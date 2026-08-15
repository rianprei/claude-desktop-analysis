Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let node_fs = require("node:fs");
let node_readline = require("node:readline");
let node_fs_promises = require("node:fs/promises");
//#region src/main/sessions/utils/queuedCommandAttachment.ts
/**
* The whole "is this line a user-authored queued command, and which uuid
* does its bubble render under" predicate. Single home for it: the display
* unwrap ({@link unwrapQueuedCommandAttachment}) and the rewind chain read
* (DiskTranscriptReader.loadRawChainEntries) MUST agree on the uuid — the
* renderer shows the bubble under `source_uuid`, and rewind walks the raw
* chain from whatever uuid the user clicked, so a second copy of this
* predicate is how a visible-but-non-rewindable bubble comes back.
*
* Same test the CLI's own TUI applies before rendering these lines as
* user prompts (queued_command, not the task-notification queue mode, not
* an isMeta system injection). `source_uuid` is required: it is the live
* bubble's uuid, which is what lets getTranscript's uuid-keyed buffer
* merge (bufferPendingNotOnDisk) dedup the disk row against a bubble the
* live buffer still holds. A line without it (a CLI that predates
* source_uuid threading) only carries the CLI-minted wrapper uuid, which
* never equals the buffer's — surfacing it would render the message twice
* for the rest of the live session — so such lines stay dropped.
*/
function queuedCommandBubble(record) {
	const line = record;
	if (line == null || line.type !== "attachment") return;
	const att = line.attachment;
	if (att?.type !== "queued_command" || att.commandMode === "task-notification" || att.isMeta === true || typeof att.source_uuid !== "string" || att.source_uuid.length === 0) return;
	return {
		line,
		sourceUuid: att.source_uuid
	};
}
/**
* Rebuild the user row a persisted queued_command attachment stands for, or
* undefined if the line isn't a user-authored queued command. This is what
* makes a mid-turn send survive a reload-from-disk: without it every
* `attachment` line is dropped by the SDK_MESSAGE_TYPES gate and the
* message the user saw as a live bubble is gone once the transcript is
* re-read (app restart, resume, forceFromDisk).
*
* Field mapping mirrors the CLI's own SDK replay path: `uuid = source_uuid`
* (see queuedCommandBubble for why it is required), the wrapper's
* authoring `timestamp`, `origin` carried through.
*/
function unwrapQueuedCommandAttachment(message) {
	const q = queuedCommandBubble(message);
	if (!q) return;
	const { line, sourceUuid } = q;
	const att = line.attachment;
	const prompt = att?.prompt;
	if (typeof prompt !== "string" && !Array.isArray(prompt)) return;
	return {
		type: "user",
		uuid: sourceUuid,
		session_id: line.sessionId ?? "",
		parent_tool_use_id: null,
		...line.timestamp !== void 0 && { timestamp: line.timestamp },
		...att?.origin !== void 0 && { origin: att.origin },
		message: {
			role: "user",
			content: prompt
		}
	};
}
//#endregion
//#region src/main/sessions/utils/sdkMessageTypes.ts
/**
* Allowlist of SDKMessage.type values that should reach the renderer. The
* CLI's JSONL also carries persistence-metadata records (attribution-
* snapshot, progress, attachment, mode, queue-operation, last-prompt,
* file-history-snapshot); those have no uuid and break the renderer's
* incremental turn cache, so every consumer of this set drops them.
*
* One `attachment` record is NOT plain metadata: a mid-turn send is
* persisted only as a `queued_command` attachment. Both consumers of this
* set — DiskTranscriptReader (the Code session reader) and
* filterTranscriptAfterCompact in local-agent-mode/transcriptReader.ts (the
* Cowork reload path) — unwrap those back into user rows via the shared
* unwrapQueuedCommandAttachment (./queuedCommandAttachment.ts) when this
* gate rejects a line; every other `attachment` line stays dropped. Keep in
* sync with the SDKMessage union in @anthropic-ai/claude-agent-sdk. Own
* module so the transcript worker's bundle can import it without pulling
* `@/main/logging` → `electron`.
*/
var SDK_MESSAGE_TYPES = /* @__PURE__ */ new Set([
	"user",
	"assistant",
	"system",
	"result",
	"stream_event",
	"tool_use_summary",
	"tool_progress",
	"auth_status",
	"prompt_suggestion",
	"rate_limit_event"
]);
//#endregion
//#region src/main/local-agent-mode/transcriptReader.ts
/**
* lstat-reject non-regular first; then O_NOFOLLOW|O_NONBLOCK on POSIX so a
* FIFO/device/symlink swapped in the lstat→open window is rejected (or
* returns immediately for the post-open fstat-isFile check) instead of
* blocking. Windows has neither flag — lstat is the only guard there.
*/
async function openTranscriptNoFollow(filePath) {
	if (!(await (0, node_fs_promises.lstat)(filePath)).isFile()) {
		const err = /* @__PURE__ */ new Error(`Refusing to open non-regular transcript path: ${filePath}`);
		err.code = "ELOOP";
		throw err;
	}
	let flags = node_fs.constants.O_RDONLY;
	if (node_fs.constants.O_NOFOLLOW !== void 0) flags |= node_fs.constants.O_NOFOLLOW;
	if (node_fs.constants.O_NONBLOCK !== void 0) flags |= node_fs.constants.O_NONBLOCK;
	return (0, node_fs_promises.open)(filePath, flags);
}
var LARGE_TRANSCRIPT_THRESHOLD = 50 * 1024 * 1024;
var EMPTY_BOUNDARY = Buffer.alloc(0);
var TRUNCATED_READ_SIZE = 50 * 1024 * 1024;
/**
* Confirm a line is a real compact_boundary and check for preservedSegment.
* Returns null for false positives (marker string inside user content).
* Ported from claude-cli-internal sessionStoragePortable.ts parseBoundaryLine.
*/
function parseBoundaryLine(line) {
	try {
		const parsed = JSON.parse(line);
		if (parsed.type !== "system" || parsed.subtype !== "compact_boundary") return null;
		return { hasPreservedSegment: Boolean(parsed.compactMetadata?.preservedSegment) };
	} catch {
		return null;
	}
}
/**
* Find the byte offset just after the last compact_boundary message in a
* JSONL transcript file. Returns { offset: -1, hasPreservedSegment: false }
* if no boundary is found.
*
* Reads a chunk from the tail of the file and scans it for boundaries,
* which is much faster than streaming the entire file since compaction
* boundaries are typically near the end.
*/
async function findLastCompactBoundaryOffset(filePath, fileSize) {
	const searchStart = Math.max(0, fileSize - 30 * 1024 * 1024);
	const fileHandle = await (0, node_fs_promises.open)(filePath, "r");
	try {
		const readSize = fileSize - searchStart;
		const buffer = Buffer.alloc(readSize);
		await fileHandle.read(buffer, 0, readSize, searchStart);
		const lines = buffer.toString("utf-8").split("\n");
		let lastBoundaryEndOffset = -1;
		let hasPreservedSegment = false;
		let byteOffset = searchStart;
		for (const line of lines) {
			const lineByteLength = Buffer.byteLength(line, "utf-8") + 1;
			if (line.includes("\"compact_boundary\"")) {
				const hit = parseBoundaryLine(line);
				if (hit) {
					lastBoundaryEndOffset = byteOffset + lineByteLength;
					hasPreservedSegment = hit.hasPreservedSegment;
				}
			}
			byteOffset += lineByteLength;
		}
		return {
			offset: lastBoundaryEndOffset,
			hasPreservedSegment
		};
	} finally {
		await fileHandle.close();
	}
}
/**
* Single-fd verify + delta read. Metadata (ino/mtime/size) is forgeable by a
* writer with file access; the boundary-bytes compare is the content-level
* guard, and the delta read happens on the SAME fd so a swap between verify
* and read can't land. Returns null only when the opened fd is non-regular;
* other errors propagate so callers' loggers see the real errno.
*/
async function verifyAndReadJsonlDelta(filePath, resumeOffset, lastLineBytes, maxSize) {
	const fd = await openTranscriptNoFollow(filePath);
	try {
		const st = await fd.stat();
		if (!st.isFile()) return null;
		const len = lastLineBytes.length;
		let boundaryOk = false;
		if (len === 0 && resumeOffset === 0) boundaryOk = true;
		else if (len > 0 && resumeOffset >= len && st.size >= resumeOffset) {
			const bbuf = Buffer.allocUnsafe(len);
			const { bytesRead } = await fd.read(bbuf, 0, len, resumeOffset - len);
			boundaryOk = bytesRead === len && bbuf.equals(lastLineBytes);
		}
		let deltaLines = [];
		let bytesConsumed = 0;
		if (boundaryOk && st.size > resumeOffset && st.size <= maxSize) {
			const want = st.size - resumeOffset;
			const dbuf = Buffer.allocUnsafe(want);
			let totalRead = 0;
			while (totalRead < want) {
				const { bytesRead } = await fd.read(dbuf, totalRead, want - totalRead, resumeOffset + totalRead);
				if (bytesRead === 0) break;
				totalRead += bytesRead;
			}
			const lastNl = totalRead > 0 ? dbuf.lastIndexOf(10, totalRead - 1) : -1;
			if (lastNl !== -1) {
				bytesConsumed = lastNl + 1;
				deltaLines = dbuf.toString("utf-8", 0, bytesConsumed).split("\n").filter((l) => l.length > 0);
			}
		}
		return {
			ino: st.ino,
			mtimeMs: st.mtimeMs,
			size: st.size,
			boundaryOk,
			deltaLines,
			bytesConsumed
		};
	} finally {
		await fd.close();
	}
}
/**
* Read non-empty lines from a file starting at a given byte offset using
* a stream. Does NOT skip partial first lines — callers that start
* mid-file should handle that themselves (see readLinesFromTail).
*/
async function readLinesFromOffset(filePath, startOffset) {
	const rl = (0, node_readline.createInterface)({
		input: (0, node_fs.createReadStream)(filePath, {
			encoding: "utf-8",
			start: startOffset
		}),
		crlfDelay: Infinity
	});
	const lines = [];
	for await (const line of rl) if (line.trim()) lines.push(line);
	return lines;
}
/**
* Read lines from the tail of a file (last `byteCount` bytes).
* Uses async file handle to read only the needed portion.
* Skips the first partial line since we likely start mid-line.
*/
async function readLinesFromTail(filePath, fileSize, byteCount) {
	const startOffset = Math.max(0, fileSize - byteCount);
	const lines = await readLinesFromOffset(filePath, startOffset);
	if (startOffset > 0 && lines.length > 0) lines.shift();
	return lines;
}
/**
* Stream the full transcript and collect every assistant message.id (msg_<>).
* These match api_usage.log_id and Antfort content_id, so the privacy
* pipeline can drop the sampling use-case directly. Streams line-by-line so
* large transcripts don't OOM, and reads the whole file (no truncation) so
* no inference call is missed. A vanished transcript resolves [] — no
* transcript, no ids.
*/
async function extractInferenceLogIds(transcriptPath) {
	const fileStat = await (0, node_fs_promises.lstat)(transcriptPath).catch((err) => {
		const code = err?.code;
		if (code === "ENOENT" || code === "ENOTDIR") return null;
		throw err;
	});
	if (fileStat === null) return [];
	if (!fileStat.isFile()) throw new Error(`Refusing to read non-regular transcript path: ${transcriptPath}`);
	const MAX_INFERENCE_LOG_IDS = 1e5;
	const ids = /* @__PURE__ */ new Set();
	const rl = (0, node_readline.createInterface)({
		input: (0, node_fs.createReadStream)(transcriptPath, { encoding: "utf-8" }),
		crlfDelay: Infinity
	});
	for await (const line of rl) {
		if (!line.includes("msg_")) continue;
		try {
			const parsed = JSON.parse(line);
			const id = parsed.message?.id;
			if (parsed.type === "assistant" && id?.startsWith("msg_")) ids.add(id);
		} catch {}
		if (ids.size >= MAX_INFERENCE_LOG_IDS) {
			rl.close();
			break;
		}
	}
	return Array.from(ids);
}
/**
* Read transcript lines from a JSONL file, applying truncation for large files.
*
* For large transcripts (>LARGE_TRANSCRIPT_THRESHOLD), uses two strategies:
* 1. Find the last compaction boundary and load only post-compaction messages
* 2. If no compaction boundary exists, read only the last 50MB of the file
*/
async function readTranscriptLines(transcriptPath) {
	const fileStat = await (0, node_fs_promises.lstat)(transcriptPath);
	if (!fileStat.isFile()) throw new Error(`Refusing to read non-regular transcript path: ${transcriptPath}`);
	let fileSize = fileStat.size;
	const statFields = {
		fileSize,
		ino: fileStat.ino,
		mtimeMs: fileStat.mtimeMs
	};
	if (fileSize <= 52428800) {
		const r = await verifyAndReadJsonlDelta(transcriptPath, 0, EMPTY_BOUNDARY, LARGE_TRANSCRIPT_THRESHOLD);
		if (r === null) throw new Error(`Refusing to read non-regular transcript path: ${transcriptPath}`);
		if (r.size <= 52428800) return {
			lines: r.deltaLines,
			strategy: "none",
			bytesConsumed: r.bytesConsumed,
			fileSize: r.size,
			ino: r.ino,
			mtimeMs: r.mtimeMs
		};
		fileSize = r.size;
	}
	const { offset: boundaryOffset, hasPreservedSegment } = await findLastCompactBoundaryOffset(transcriptPath, fileSize);
	if (boundaryOffset > 0 && hasPreservedSegment) return {
		lines: await readLinesFromOffset(transcriptPath, 0),
		strategy: "preserved",
		bytesConsumed: fileSize,
		...statFields
	};
	if (boundaryOffset > 0) {
		if (fileSize - boundaryOffset < 52428800) return {
			lines: await readLinesFromOffset(transcriptPath, boundaryOffset),
			strategy: "compaction",
			bytesConsumed: fileSize,
			...statFields
		};
		return {
			lines: await readLinesFromTail(transcriptPath, fileSize, TRUNCATED_READ_SIZE),
			strategy: "tail",
			bytesConsumed: fileSize,
			...statFields
		};
	}
	return {
		lines: await readLinesFromTail(transcriptPath, fileSize, TRUNCATED_READ_SIZE),
		strategy: "tail",
		bytesConsumed: fileSize,
		...statFields
	};
}
/**
* Filter JSONL transcript lines down to post-compaction messages plus
* preserved-segment messages. Pure: parses each line once, drops
* pre-boundary messages unless they belong to a live preserved chain, drops
* records whose `type` is outside {@link SDK_MESSAGE_TYPES} — except a
* user-authored `queued_command` attachment (the only on-disk trace of a
* mid-turn send), which is emitted in place as the user row it stands for
* via {@link unwrapQueuedCommandAttachment}.
*
* Preserved messages (reactive/partial/session-memory compact) are written
* to the JSONL physically BEFORE the compact_boundary line. Ported from
* CLI applyPreservedSegmentRelinks (sessionStorage.ts:1686-1789), minus
* the parentUuid relink, tail-splice, and usage-zeroing steps — desktop
* returns a linear array, not a parent-chain graph.
*
* Returns parsed message objects (the full JSON value, typed narrowly as
* TranscriptJsonlLine for routing but castable to SDKMessage by callers).
*/
function filterTranscriptAfterCompact(lines, onParseError, opts) {
	const dropPreBoundary = opts?.dropPreBoundary ?? true;
	const parsed = lines.flatMap((line) => {
		if (line.length === 0) return [];
		try {
			return [JSON.parse(line)];
		} catch {
			onParseError?.(line);
			return [];
		}
	});
	const { absoluteLastBoundaryIdx, lastSeg, lastSegBoundaryIdx } = parsed.reduce((acc, r, i) => {
		if (r.type !== "system" || r.subtype !== "compact_boundary") return acc;
		const seg = r.compactMetadata?.preservedSegment;
		return seg ? {
			absoluteLastBoundaryIdx: i,
			lastSeg: seg,
			lastSegBoundaryIdx: i
		} : {
			...acc,
			absoluteLastBoundaryIdx: i
		};
	}, {
		absoluteLastBoundaryIdx: -1,
		lastSeg: void 0,
		lastSegBoundaryIdx: -1
	});
	const segIsLive = lastSeg && lastSegBoundaryIdx === absoluteLastBoundaryIdx;
	const walkPreservedChain = (seg) => {
		const byUuid = new Map(parsed.map((r, i) => [r.uuid, {
			parentUuid: r.parentUuid,
			idx: i
		}]));
		const collected = /* @__PURE__ */ new Set();
		const seen = /* @__PURE__ */ new Set();
		let cur = seg.tailUuid;
		while (cur && !seen.has(cur)) {
			seen.add(cur);
			const entry = byUuid.get(cur);
			if (!entry || entry.idx >= absoluteLastBoundaryIdx) break;
			collected.add(cur);
			if (cur === seg.headUuid) return collected;
			cur = entry.parentUuid ?? void 0;
		}
		return /* @__PURE__ */ new Set();
	};
	const preservedUuids = segIsLive && lastSeg ? walkPreservedChain(lastSeg) : /* @__PURE__ */ new Set();
	const startIdx = dropPreBoundary && absoluteLastBoundaryIdx >= 0 ? absoluteLastBoundaryIdx + 1 : 0;
	return parsed.flatMap((r, i) => {
		if (!(i >= startIdx || r.uuid && preservedUuids.has(r.uuid))) return [];
		if (r.isCompactSummary || r.isVisibleInTranscriptOnly) return [];
		if (r.type !== void 0 && SDK_MESSAGE_TYPES.has(r.type)) return [r];
		const unwrapped = unwrapQueuedCommandAttachment(r);
		return unwrapped ? [unwrapped] : [];
	});
}
var LAST_LINE_BYTES_CAP = 64 * 1024;
/** Last line + trailing newline as UTF-8, capped to its last 64 KB — the
*  boundary `verifyAndReadJsonlDelta` re-verifies before a delta read. */
function lastLineBytesOf(lines) {
	if (lines.length === 0) return Buffer.alloc(0);
	const buf = Buffer.from(lines[lines.length - 1] + "\n", "utf-8");
	return buf.length > LAST_LINE_BYTES_CAP ? Buffer.from(buf.subarray(buf.length - LAST_LINE_BYTES_CAP)) : buf;
}
/** The whole cold transcript load — read, split, JSON.parse, filter — as
*  one call, hosted on the cowork transcript worker; main runs it directly
*  only via TranscriptSearchService's worker-unavailable fallback. */
async function readAndParseTranscript(transcriptPath, onParseError) {
	const { lines, strategy, ino, mtimeMs, bytesConsumed } = await readTranscriptLines(transcriptPath);
	return {
		parsed: filterTranscriptAfterCompact(lines, onParseError, { dropPreBoundary: strategy !== "none" }),
		strategy,
		ino,
		mtimeMs,
		bytesConsumed,
		lastLineBytes: lastLineBytesOf(lines)
	};
}
//#endregion
//#region src/main/local-agent-mode/search/transcriptSearchWorker.ts
/**
* Utility process worker for cowork transcript JSONL work — content search,
* cold full-transcript read+parse, and inference-log-id extraction. Runs in
* an isolated V8 instance so the read/split/parse/filter CPU never touches
* the main thread; the parsed reply still structured-clone deserializes on
* main on receipt. See TranscriptSearchService for the fork orchestration.
*
* Communication via MessagePort:
* - Receives: { type: "search", requestId, query, limit, messageTypes, sessions: SearchSessionInput[] }
*             { type: "readTranscript", requestId, transcriptPath }
*             { type: "extractInferenceLogIds", requestId, transcriptPath }
* - Sends:    { type: "result", requestId, hits: WorkerSearchHit[] }
*             { type: "transcript", requestId, result: ParsedTranscript }
*             { type: "inferenceLogIds", requestId, ids: string[] }
*             { type: "error", requestId, message }
*/
function postToParent(port, message) {
	try {
		port.postMessage(message);
	} catch {}
}
var SNIPPET_LEAD = 20;
var SNIPPET_TRAIL = 80;
var SCAN_CONCURRENCY = 4;
/**
* Build a per-line prefilter that approximates the downstream
* `normalized.toLowerCase().indexOf(needle)` without parsing. Two tiers:
*
*  1. /token/iu .test(line) for every token — no allocation. With the `u` flag
*     the regex uses Unicode simple case folding (CaseFolding.txt status C+S),
*     which covers every codepoint whose simple lowercase is ASCII (KELVIN
*     SIGN, long-s, …).
*  2. If (1) fails AND the line contains U+0130 (İ), fall back to
*     line.toLowerCase().includes(token). İ is the one codepoint whose
*     toLowerCase() yields ASCII (via SpecialCasing's unconditional İ→i+◌̇)
*     without a C/S simple fold. V8 stores ASCII-only readline output as
*     one-byte (Latin-1) strings, and includes() of a >U+00FF char on a
*     one-byte string returns false without scanning, so for the common
*     ASCII-transcript line tier-2's gate is O(1).
*
* The line is JSON-string-encoded, so a token containing ", \\, or non-ASCII
* may not appear verbatim — return null for those and the caller falls back to
* parse-every-line. Assumes the encoder does NOT \u-escape non-control
* non-ASCII (Node's JSON.stringify, which writes the CLI transcripts these
* files are); an encoder that does would defeat tier-1 for any escaped char.
*/
function buildPrefilter(needle) {
	const tokens = needle.split(/\s+/).filter(Boolean);
	if (tokens.length === 0) return null;
	for (const t of tokens) if (/["\\]|[^\x20-\x7e]/.test(t)) return null;
	const regexes = tokens.map((t) => new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "iu"));
	return (line) => {
		if (regexes.every((re) => re.test(line))) return true;
		if (!line.includes("İ")) return false;
		const lower = line.toLowerCase();
		return tokens.every((tok) => lower.includes(tok));
	};
}
function extractText(content) {
	if (typeof content === "string") return content;
	if (Array.isArray(content)) {
		let out = "";
		for (const block of content) {
			if (!block || typeof block !== "object") continue;
			const type = block.type;
			if (type === "text" && typeof block.text === "string") out += block.text + " ";
			else if (type === "tool_result") {
				const inner = extractText(block.content);
				if (inner) out += inner + " ";
			}
		}
		return out;
	}
	return "";
}
function makeSnippet(text, idx, qLen) {
	const start = Math.max(0, idx - SNIPPET_LEAD);
	const end = Math.min(text.length, idx + qLen + SNIPPET_TRAIL);
	const slice = text.slice(start, end).trim();
	return (start > 0 ? "…" : "") + slice + (end < text.length ? "…" : "");
}
async function scanFile(session, needle, messageTypes, prefilter) {
	let snippet = null;
	const stream = (0, node_fs.createReadStream)(session.transcriptPath, { encoding: "utf8" });
	const rl = (0, node_readline.createInterface)({
		input: stream,
		crlfDelay: Infinity
	});
	try {
		for await (const line of rl) {
			if (!line) continue;
			if (prefilter && !prefilter(line)) continue;
			let parsed;
			try {
				parsed = JSON.parse(line);
			} catch {
				continue;
			}
			if (!parsed.type || !messageTypes.has(parsed.type)) continue;
			const text = extractText(parsed.message?.content);
			if (!text) continue;
			const normalized = text.replace(/\s+/g, " ");
			const idx = normalized.toLowerCase().indexOf(needle);
			if (idx === -1) continue;
			snippet = makeSnippet(normalized, idx, needle.length);
			break;
		}
	} finally {
		rl.close();
		stream.destroy();
	}
	if (snippet === null) return null;
	return {
		sessionId: session.sessionId,
		snippet,
		lastActivityAt: session.lastActivityAt
	};
}
async function handleSearch(port, req) {
	const needle = req.query.replace(/\s+/g, " ").trim().toLowerCase();
	const messageTypes = new Set(req.messageTypes);
	const prefilter = buildPrefilter(needle);
	const hits = [];
	const inputOrder = new Map(req.sessions.map((s, i) => [s.sessionId, i]));
	let nextIndex = 0;
	const inFlight = /* @__PURE__ */ new Set();
	const launchNext = () => {
		if (hits.length >= req.limit || nextIndex >= req.sessions.length) return;
		const session = req.sessions[nextIndex++];
		const p = scanFile(session, needle, messageTypes, prefilter).then((hit) => {
			if (hit) hits.push(hit);
		}).catch(() => {}).finally(() => {
			inFlight.delete(p);
			launchNext();
		});
		inFlight.add(p);
	};
	for (let i = 0; i < SCAN_CONCURRENCY; i++) launchNext();
	while (inFlight.size > 0) await Promise.race(inFlight);
	hits.sort((a, b) => (inputOrder.get(a.sessionId) ?? 0) - (inputOrder.get(b.sessionId) ?? 0));
	const survivors = hits.slice(0, req.limit);
	survivors.sort((a, b) => b.lastActivityAt - a.lastActivityAt || (inputOrder.get(a.sessionId) ?? 0) - (inputOrder.get(b.sessionId) ?? 0));
	postToParent(port, {
		type: "result",
		requestId: req.requestId,
		hits: survivors
	});
}
async function handleReadTranscript(port, req) {
	const result = await readAndParseTranscript(req.transcriptPath, (line) => console.warn(`Failed to parse transcript line: ${line.slice(0, 200)}`));
	postToParent(port, {
		type: "transcript",
		requestId: req.requestId,
		result
	});
}
async function handleExtractInferenceLogIds(port, req) {
	const ids = await extractInferenceLogIds(req.transcriptPath);
	postToParent(port, {
		type: "inferenceLogIds",
		requestId: req.requestId,
		ids
	});
}
function dispatch(port, data) {
	switch (data.type) {
		case "search": return handleSearch(port, data);
		case "readTranscript": return handleReadTranscript(port, data);
		case "extractInferenceLogIds": return handleExtractInferenceLogIds(port, data);
		default: return Promise.resolve();
	}
}
process.parentPort?.once("message", (e) => {
	if (e.data.type !== "init" || !e.ports?.[0]) process.exit(1);
	const port = e.ports[0];
	port.on("message", (event) => {
		const data = event.data;
		dispatch(port, data).catch((error) => {
			const message = error instanceof Error ? error.message : "Unknown error";
			postToParent(port, {
				type: "error",
				requestId: data.requestId,
				message
			});
		});
	});
	port.start();
});
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
var _test = {
	buildPrefilter,
	makeSnippet,
	scanFile,
	handleSearch,
	handleReadTranscript,
	handleExtractInferenceLogIds,
	SCAN_CONCURRENCY
};
//#endregion
exports._test = _test;
