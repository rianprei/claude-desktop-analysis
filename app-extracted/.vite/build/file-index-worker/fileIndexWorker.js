Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_child_process = require("node:child_process");
let node_string_decoder = require("node:string_decoder");
require("node:fs");
//#region src/main/fileIndex.ts
var SCORE_MATCH = 16;
var BONUS_BOUNDARY = 8;
var BONUS_CAMEL = 6;
var BONUS_CONSECUTIVE = 4;
var BONUS_FIRST_CHAR = 8;
var PENALTY_GAP_START = 3;
var PENALTY_GAP_EXTENSION = 1;
var TOP_LEVEL_CACHE_LIMIT = 100;
var MAX_QUERY_LEN = 64;
var CHUNK_MS = 4;
var posBuf = new Int32Array(MAX_QUERY_LEN);
var FileIndex = class {
	constructor() {
		this.paths = [];
		this.lowerPaths = [];
		this.charBits = /* @__PURE__ */ new Int32Array(0);
		this.pathLens = /* @__PURE__ */ new Uint16Array(0);
		this.topLevelCache = null;
		this.readyCount = 0;
	}
	/**
	* Load paths from an array of strings.
	* Automatically deduplicates and filters empty strings.
	*/
	loadFromFileList(fileList) {
		const seen = /* @__PURE__ */ new Set();
		const paths = [];
		for (const line of fileList) if (line.length > 0 && !seen.has(line)) {
			seen.add(line);
			paths.push(line);
		}
		this.buildIndex(paths);
	}
	/**
	* Async variant: yields to the event loop every few ms so large indexes
	* (270k+ files) don't block the main thread. Identical result to
	* loadFromFileList.
	*
	* Returns { queryable, done }:
	*   - queryable: resolves as soon as the first chunk is indexed (search
	*     returns partial results).
	*   - done: resolves when the entire index is built.
	*/
	loadFromFileListAsync(fileList) {
		let markQueryable;
		return {
			queryable: new Promise((resolve) => {
				markQueryable = resolve;
			}),
			done: this.buildAsync(fileList, markQueryable)
		};
	}
	async buildAsync(fileList, markQueryable) {
		const seen = /* @__PURE__ */ new Set();
		const paths = [];
		let chunkStart = performance.now();
		for (let i = 0; i < fileList.length; i++) {
			const line = fileList[i];
			if (line.length > 0 && !seen.has(line)) {
				seen.add(line);
				paths.push(line);
			}
			if ((i & 255) === 255 && performance.now() - chunkStart > CHUNK_MS) {
				await yieldToEventLoop();
				chunkStart = performance.now();
			}
		}
		this.resetArrays(paths);
		chunkStart = performance.now();
		let firstChunk = true;
		for (let i = 0; i < paths.length; i++) {
			this.indexPath(i);
			if ((i & 255) === 255 && performance.now() - chunkStart > CHUNK_MS) {
				this.readyCount = i + 1;
				if (firstChunk) {
					markQueryable();
					firstChunk = false;
				}
				await yieldToEventLoop();
				chunkStart = performance.now();
			}
		}
		this.readyCount = paths.length;
		markQueryable();
	}
	buildIndex(paths) {
		this.resetArrays(paths);
		for (let i = 0; i < paths.length; i++) this.indexPath(i);
		this.readyCount = paths.length;
	}
	resetArrays(paths) {
		const n = paths.length;
		this.paths = paths;
		this.lowerPaths = Array.from({ length: n }, () => "");
		this.charBits = new Int32Array(n);
		this.pathLens = new Uint16Array(n);
		this.readyCount = 0;
		this.topLevelCache = computeTopLevelEntries(paths, TOP_LEVEL_CACHE_LIMIT);
	}
	indexPath(i) {
		const lp = this.paths[i].toLowerCase();
		this.lowerPaths[i] = lp;
		const len = lp.length;
		this.pathLens[i] = len;
		let bits = 0;
		for (let j = 0; j < len; j++) {
			const c = lp.charCodeAt(j);
			if (c >= 97 && c <= 122) bits |= 1 << c - 97;
		}
		this.charBits[i] = bits;
	}
	/**
	* Search for files matching the query using fuzzy matching.
	* Returns top N results sorted by match score.
	*/
	search(query, limit) {
		if (limit <= 0) return [];
		if (query.length === 0) {
			if (this.topLevelCache) return this.topLevelCache.slice(0, limit);
			return [];
		}
		const caseSensitive = query !== query.toLowerCase();
		const needle = caseSensitive ? query : query.toLowerCase();
		const nLen = Math.min(needle.length, MAX_QUERY_LEN);
		let needleBitmap = 0;
		const needleChars = Array.from({ length: nLen }, (_, j) => {
			const ch = needle.charAt(j);
			const cc = ch.charCodeAt(0);
			if (cc >= 97 && cc <= 122) needleBitmap |= 1 << cc - 97;
			return ch;
		});
		const scoreCeiling = nLen * 24 + BONUS_FIRST_CHAR + 32;
		const topK = [];
		let threshold = -Infinity;
		const { paths, lowerPaths, charBits, pathLens, readyCount } = this;
		outer: for (let i = 0; i < readyCount; i++) {
			if ((charBits[i] & needleBitmap) !== needleBitmap) continue;
			const haystack = caseSensitive ? paths[i] : lowerPaths[i];
			let pos = haystack.indexOf(needleChars[0]);
			if (pos === -1) continue;
			posBuf[0] = pos;
			let gapPenalty = 0;
			let consecBonus = 0;
			let prev = pos;
			for (let j = 1; j < nLen; j++) {
				pos = haystack.indexOf(needleChars[j], prev + 1);
				if (pos === -1) continue outer;
				posBuf[j] = pos;
				const gap = pos - prev - 1;
				if (gap === 0) consecBonus += BONUS_CONSECUTIVE;
				else gapPenalty += PENALTY_GAP_START + gap * PENALTY_GAP_EXTENSION;
				prev = pos;
			}
			if (topK.length === limit && scoreCeiling + consecBonus - gapPenalty <= threshold) continue;
			const path = paths[i];
			const hLen = pathLens[i];
			let score = nLen * SCORE_MATCH + consecBonus - gapPenalty;
			score += scoreBonusAt(path, posBuf[0], true);
			for (let j = 1; j < nLen; j++) score += scoreBonusAt(path, posBuf[j], false);
			score += Math.max(0, 32 - (hLen >> 2));
			if (topK.length < limit) {
				topK.push({
					path,
					fuzzScore: score,
					positions: Array.from(posBuf.subarray(0, nLen))
				});
				if (topK.length === limit) {
					topK.sort((a, b) => a.fuzzScore - b.fuzzScore);
					threshold = topK[0].fuzzScore;
				}
			} else if (score > threshold) {
				let lo = 0;
				let hi = topK.length;
				while (lo < hi) {
					const mid = lo + hi >> 1;
					if (topK[mid].fuzzScore < score) lo = mid + 1;
					else hi = mid;
				}
				topK.splice(lo, 0, {
					path,
					fuzzScore: score,
					positions: Array.from(posBuf.subarray(0, nLen))
				});
				topK.shift();
				threshold = topK[0].fuzzScore;
			}
		}
		topK.sort((a, b) => b.fuzzScore - a.fuzzScore);
		const denom = Math.max(topK.length, 1);
		return topK.map(({ path, positions }, i) => {
			const positionScore = i / denom;
			return {
				path,
				score: path.includes("test") ? Math.min(positionScore * 1.05, 1) : positionScore,
				positions
			};
		});
	}
};
/**
* Boundary/camelCase bonus for a match at position `pos` in the original-case
* path. `first` enables the start-of-string bonus (only for needle[0]).
*/
function scoreBonusAt(path, pos, first) {
	if (pos === 0) return first ? BONUS_FIRST_CHAR : 0;
	const prevCh = path.charCodeAt(pos - 1);
	if (isBoundary(prevCh)) return BONUS_BOUNDARY;
	if (isLower(prevCh) && isUpper(path.charCodeAt(pos))) return BONUS_CAMEL;
	return 0;
}
function isBoundary(code) {
	return code === 47 || code === 92 || code === 45 || code === 95 || code === 46 || code === 32;
}
function isLower(code) {
	return code >= 97 && code <= 122;
}
function isUpper(code) {
	return code >= 65 && code <= 90;
}
function yieldToEventLoop() {
	return new Promise((resolve) => setImmediate(resolve));
}
/**
* Extract unique top-level path segments, sorted by (length asc, then alpha asc).
* Handles both Unix (/) and Windows (\) path separators.
*/
function computeTopLevelEntries(paths, limit) {
	const topLevel = /* @__PURE__ */ new Set();
	for (const p of paths) {
		let end = p.length;
		for (let i = 0; i < p.length; i++) {
			const c = p.charCodeAt(i);
			if (c === 47 || c === 92) {
				end = i;
				break;
			}
		}
		const segment = p.slice(0, end);
		if (segment.length > 0) {
			topLevel.add(segment);
			if (topLevel.size >= limit) break;
		}
	}
	const sorted = Array.from(topLevel);
	sorted.sort((a, b) => {
		const lenDiff = a.length - b.length;
		if (lenDiff !== 0) return lenDiff;
		return a < b ? -1 : a > b ? 1 : 0;
	});
	return sorted.slice(0, limit).map((path) => ({
		path,
		score: 0,
		positions: []
	}));
}
//#endregion
//#region src/main/helpers/LRUCache.ts
/**
* A simple LRU (Least Recently Used) cache implementation.
* When the cache exceeds maxSize, the oldest entry is evicted.
*/
var LRUCache = class {
	constructor(maxSize, onEvict) {
		this.cache = /* @__PURE__ */ new Map();
		this.maxSize = maxSize;
		this.onEvict = onEvict;
	}
	get(key) {
		const value = this.cache.get(key);
		if (value !== void 0) {
			this.cache.delete(key);
			this.cache.set(key, value);
		}
		return value;
	}
	set(key, value) {
		this.cache.delete(key);
		this.cache.set(key, value);
		if (this.cache.size > this.maxSize) {
			const oldest = this.cache.entries().next().value;
			if (oldest !== void 0) {
				this.cache.delete(oldest[0]);
				this.onEvict?.(oldest[0], oldest[1]);
			}
		}
	}
	delete(key) {
		const value = this.cache.get(key);
		const had = this.cache.delete(key);
		if (had && value !== void 0) this.onEvict?.(key, value);
		return had;
	}
	get size() {
		return this.cache.size;
	}
	clear() {
		if (this.onEvict) for (const [k, v] of this.cache) this.onEvict(k, v);
		this.cache.clear();
	}
};
//#endregion
//#region src/main/helpers/untrustedLaunch.ts
/**
* Wraps a command to launch it as an untrusted/disclaimed process on macOS.
* On other platforms, returns the command unchanged.
*
* On macOS, this uses the `disclaimer` binary which spawns the child process
* with `responsibility_spawnattrs_setdisclaim`, preventing it from inheriting
* Claude Desktop's TCC permissions (screen recording, accessibility, etc.).
* Every child launched through it also starts with default crash exception
* ports (our own helper binaries included), so its native crashes go to the
* system reporter instead of Claude's.
*
* Use this for:
* - MCP servers (user-configured extensions)
* - Any untrusted/third-party code execution
* - Extension binaries
*
* TCC side effect on file output: a disclaimed child cannot replace an
* existing file under a TCC-protected folder (~/Desktop, ~/Documents,
* ~/Downloads). Have it write to a private staging dir and let the main
* process move the result into place, pinned by handle so a symlink swap
* can't borrow main's grant — open with safe-fs's openPluginFileNoFollow
* (usage: SimulatorService.publishRecording).
*
* @example
* ```ts
* const { cmd, args } = getUntrustedLaunchOptions({
*   cmd: "/usr/bin/node",
*   args: ["server.js", "--port", "3000"],
* });
* spawn(cmd, args);
* ```
*/
function getUntrustedLaunchOptions(options) {
	return options;
}
//#endregion
//#region src/main/helpers/spawnPromise.ts
function abortRejection(signal, cmd) {
	return signal.reason instanceof Error ? signal.reason : new DOMException(`spawnAsync(${cmd}) aborted`, "AbortError");
}
/**
* Spawns a command as a "disclaimed" process on macOS, preventing it from
* inheriting Claude Desktop's TCC permissions (screen recording, accessibility, etc.).
* The child also starts with default crash exception ports (see untrustedLaunch).
* On other platforms, executes the command directly.
*
* This is the safe default - use this for:
* - MCP servers (user-configured extensions)
* - Any untrusted/third-party code execution
* - Extension binaries
* - Shell commands that don't need TCC permissions
*
* @param cmd The command to execute.
* @param args The arguments to pass to the command.
* @param options Optional spawn options.
* @returns A promise that resolves with stdout, stderr, and exit code.
*/
async function spawnAsync(cmd, args = [], options = {}) {
	const untrusted = getUntrustedLaunchOptions({
		cmd,
		args
	});
	try {
		return await spawnAsyncDirect(untrusted.cmd, untrusted.args, options);
	} catch (error) {
		if (options.signal?.aborted && (error === options.signal.reason || error instanceof Error && error.name === "AbortError")) {
			if (untrusted.cmd !== cmd && error !== options.signal.reason) throw new DOMException(`spawnAsync(${cmd}) aborted (via disclaimer)`, "AbortError");
			throw error;
		}
		if (untrusted.cmd !== cmd && error instanceof Error) {
			const { code, spawnError } = error;
			const errnoProps = spawnError ? {
				code,
				spawnError
			} : {};
			if (error.message.includes("ENOENT")) throw Object.assign(/* @__PURE__ */ new Error(`Failed to spawn ${cmd} (disclaimer binary not found): ${error.message}`), errnoProps);
			throw Object.assign(/* @__PURE__ */ new Error(`Failed to spawn ${cmd} (via disclaimer): ${error.message}`), errnoProps);
		}
		throw error;
	}
}
/**
* Spawns a command directly WITHOUT disclaiming TCC permissions.
*
* ⚠️ SECURITY WARNING: Only use this when you INTENTIONALLY want the spawned
* process to inherit Claude Desktop's TCC permissions (e.g., for osascript
* commands where you want the TCC prompt associated with Claude Desktop).
*
* For most use cases, use spawnAsync() instead.
*
* @param cmd The command to execute.
* @param args The arguments to pass to the command.
* @param options Optional spawn options.
* @returns A promise that resolves with stdout, stderr, and exit code.
*/
var DEFAULT_MAX_BUFFER = 16 * 1024 * 1024;
var STREAMING_STDERR_TAIL_BYTES = 8192;
function spawnAsyncDirect(cmd, args = [], options = {}) {
	const { ignoreExitCode, maxBuffer = DEFAULT_MAX_BUFFER, stdin, destroyStdioOnExit, hardTimeoutMs, signal, onStdoutLine, ...spawnOptions } = options;
	if (signal?.aborted) return Promise.reject(abortRejection(signal, cmd));
	return new Promise((resolve, reject) => {
		const proc = (0, node_child_process.spawn)(cmd, args, {
			...spawnOptions,
			stdio: [
				stdin !== void 0 ? "pipe" : "ignore",
				"pipe",
				"pipe"
			]
		});
		if (stdin !== void 0 && proc.stdin) {
			proc.stdin.on("error", () => void 0);
			proc.stdin.write(stdin);
			proc.stdin.end();
		}
		const stdout = [];
		const stderr = [];
		let totalBytes = 0;
		let killed = false;
		/** Runaway guard shared by every sink: meters total bytes seen. */
		const withinMaxBuffer = (data) => {
			totalBytes += data.length;
			return totalBytes <= maxBuffer;
		};
		const onData = (chunks) => (data) => {
			if (!withinMaxBuffer(data)) {
				killed = true;
				proc.kill();
				return;
			}
			chunks.push(data);
		};
		const pgid = process.platform !== "win32" && spawnOptions.detached && typeof proc.pid === "number" ? proc.pid : void 0;
		const killGroup = (sig) => {
			if (pgid !== void 0) try {
				process.kill(-pgid, sig);
				return;
			} catch {}
			proc.kill(sig);
		};
		const killAndDestroyStdio = () => {
			killGroup("SIGKILL");
			proc.stdout?.destroy();
			proc.stderr?.destroy();
		};
		let stoppedEarly = false;
		let lineHandlerError;
		const lineDecoder = onStdoutLine ? new node_string_decoder.StringDecoder("utf8") : void 0;
		let lineCarry = [];
		/** Returns false once the consumer stopped (or threw) — stop delivering. */
		const emitLine = (line) => {
			try {
				if (onStdoutLine(line) === "stop") {
					stoppedEarly = true;
					killAndDestroyStdio();
					return false;
				}
				return true;
			} catch (error) {
				lineHandlerError = error instanceof Error ? error : new Error(String(error));
				killAndDestroyStdio();
				return false;
			}
		};
		const deliverLines = (decoded, flushCarry) => {
			if (stoppedEarly || lineHandlerError) return;
			let newlineAt = decoded.indexOf("\n");
			if (newlineAt === -1) {
				if (decoded.length > 0) lineCarry.push(decoded);
			} else {
				let lineStart = 0;
				do {
					const tail = decoded.slice(lineStart, newlineAt);
					const assembled = lineCarry.length === 0 ? tail : lineCarry.join("") + tail;
					const line = assembled.endsWith("\r") ? assembled.slice(0, -1) : assembled;
					lineCarry = [];
					lineStart = newlineAt + 1;
					if (!emitLine(line)) return;
					newlineAt = decoded.indexOf("\n", lineStart);
				} while (newlineAt !== -1);
				if (lineStart < decoded.length) lineCarry.push(decoded.slice(lineStart));
			}
			if (flushCarry && lineCarry.length > 0) {
				const trailing = lineCarry.join("");
				lineCarry = [];
				emitLine(trailing);
			}
		};
		const streamOverflowStop = (data) => {
			if (withinMaxBuffer(data)) return false;
			stoppedEarly = true;
			killAndDestroyStdio();
			return true;
		};
		proc.stdout?.on("data", lineDecoder ? (data) => {
			if (streamOverflowStop(data)) return;
			deliverLines(lineDecoder.write(data), false);
		} : onData(stdout));
		let stderrRetained = 0;
		proc.stderr?.on("data", lineDecoder ? (data) => {
			if (streamOverflowStop(data)) return;
			stderr.push(data);
			stderrRetained += data.length;
			while (stderr.length > 1 && stderrRetained - stderr[0].length >= STREAMING_STDERR_TAIL_BYTES) stderrRetained -= stderr.shift().length;
		} : onData(stderr));
		let aborted = false;
		const onAbort = () => {
			const childExited = proc.exitCode !== null || proc.signalCode !== null;
			if (!childExited) {
				aborted = true;
				proc.kill(spawnOptions.killSignal);
			}
			if (pgid !== void 0) killGroup("SIGTERM");
			setTimeout(() => {
				killGroup("SIGKILL");
				if (!childExited) {
					proc.stdout?.destroy();
					proc.stderr?.destroy();
				}
			}, 1e3).unref();
		};
		signal?.addEventListener("abort", onAbort, { once: true });
		let hardTimer;
		let hardKilled = false;
		if (hardTimeoutMs) hardTimer = setTimeout(() => {
			hardKilled = true;
			killAndDestroyStdio();
		}, hardTimeoutMs);
		proc.on("error", (error) => {
			if (hardTimer) clearTimeout(hardTimer);
			signal?.removeEventListener("abort", onAbort);
			reject(Object.assign(/* @__PURE__ */ new Error(`Failed to spawn ${cmd}: ${error.message}`), {
				code: error.code,
				spawnError: true
			}));
		});
		let exitGraceTimer;
		proc.on("exit", () => {
			if (proc.killed && pgid !== void 0) {
				killGroup("SIGTERM");
				setTimeout(() => killGroup("SIGKILL"), 1e3).unref();
			}
			if (!proc.killed && !destroyStdioOnExit) return;
			exitGraceTimer = setTimeout(() => {
				proc.stdout?.destroy();
				proc.stderr?.destroy();
			}, 1e3);
		});
		proc.on("close", (code) => {
			if (exitGraceTimer) clearTimeout(exitGraceTimer);
			if (hardTimer) clearTimeout(hardTimer);
			signal?.removeEventListener("abort", onAbort);
			if (aborted && signal) {
				reject(abortRejection(signal, cmd));
				return;
			}
			if (lineHandlerError) {
				reject(lineHandlerError);
				return;
			}
			if (killed) {
				reject(Object.assign(/* @__PURE__ */ new Error(`${cmd} output exceeded maxBuffer limit (${maxBuffer} bytes)`), { code: "EMAXBUFFER" }));
				return;
			}
			if (lineDecoder) {
				deliverLines(lineDecoder.end(), true);
				if (lineHandlerError) {
					reject(lineHandlerError);
					return;
				}
			}
			const stderrBuffer = Buffer.concat(stderr);
			const stderrStr = stderrBuffer.toString();
			const stdoutBuffer = Buffer.concat(stdout);
			const result = {
				stdout: stdoutBuffer.toString(),
				stdoutBuffer,
				stderrBuffer,
				stderr: hardKilled ? `${stderrStr}${stderrStr ? "\n" : ""}killed after ${hardTimeoutMs}ms hard deadline` : stderrStr,
				code,
				stoppedEarly
			};
			if (!ignoreExitCode && code !== 0 && !stoppedEarly) {
				const error = /* @__PURE__ */ new Error(`${cmd} exited with code ${code}: ${result.stderr || result.stdout}`);
				error.result = result;
				reject(error);
				return;
			}
			resolve(result);
		});
	});
}
//#endregion
//#region node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty, prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
})))(), 1);
//#endregion
//#region node_modules/p-timeout/index.js
var TimeoutError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "TimeoutError";
	}
};
/**
An error to be thrown when the request is aborted by AbortController.
DOMException is thrown instead of this Error when DOMException is available.
*/
var AbortError = class extends Error {
	constructor(message) {
		super();
		this.name = "AbortError";
		this.message = message;
	}
};
/**
TODO: Remove AbortError and just throw DOMException when targeting Node 18.
*/
var getDOMException = (errorMessage) => globalThis.DOMException === void 0 ? new AbortError(errorMessage) : new DOMException(errorMessage);
/**
TODO: Remove below function and just 'reject(signal.reason)' when targeting Node 18.
*/
var getAbortedReason = (signal) => {
	const reason = signal.reason === void 0 ? getDOMException("This operation was aborted.") : signal.reason;
	return reason instanceof Error ? reason : getDOMException(reason);
};
function pTimeout(promise, options) {
	const { milliseconds, fallback, message, customTimers = {
		setTimeout,
		clearTimeout
	} } = options;
	let timer;
	let abortHandler;
	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		if (options.signal) {
			const { signal } = options;
			if (signal.aborted) reject(getAbortedReason(signal));
			abortHandler = () => {
				reject(getAbortedReason(signal));
			};
			signal.addEventListener("abort", abortHandler, { once: true });
		}
		if (milliseconds === Number.POSITIVE_INFINITY) {
			promise.then(resolve, reject);
			return;
		}
		const timeoutError = new TimeoutError();
		timer = customTimers.setTimeout.call(void 0, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}
				return;
			}
			if (typeof promise.cancel === "function") promise.cancel();
			if (message === false) resolve();
			else if (message instanceof Error) reject(message);
			else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);
		(async () => {
			try {
				resolve(await promise);
			} catch (error) {
				reject(error);
			}
		})();
	}).finally(() => {
		cancelablePromise.clear();
		if (abortHandler && options.signal) options.signal.removeEventListener("abort", abortHandler);
	});
	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(void 0, timer);
		timer = void 0;
	};
	return cancelablePromise;
}
//#endregion
//#region node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
	let first = 0;
	let count = array.length;
	while (count > 0) {
		const step = Math.trunc(count / 2);
		let it = first + step;
		if (comparator(array[it], value) <= 0) {
			first = ++it;
			count -= step + 1;
		} else count = step;
	}
	return first;
}
//#endregion
//#region node_modules/p-queue/dist/priority-queue.js
var PriorityQueue = class {
	#queue = [];
	enqueue(run, options) {
		options = {
			priority: 0,
			...options
		};
		const element = {
			priority: options.priority,
			run
		};
		if (this.size && this.#queue[this.size - 1].priority >= options.priority) {
			this.#queue.push(element);
			return;
		}
		const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
		this.#queue.splice(index, 0, element);
	}
	dequeue() {
		return this.#queue.shift()?.run;
	}
	filter(options) {
		return this.#queue.filter((element) => element.priority === options.priority).map((element) => element.run);
	}
	get size() {
		return this.#queue.length;
	}
};
//#endregion
//#region node_modules/p-queue/dist/index.js
/**
Promise queue with concurrency control.
*/
var PQueue = class extends import_eventemitter3.default {
	#carryoverConcurrencyCount;
	#isIntervalIgnored;
	#intervalCount = 0;
	#intervalCap;
	#interval;
	#intervalEnd = 0;
	#intervalId;
	#timeoutId;
	#queue;
	#queueClass;
	#pending = 0;
	#concurrency;
	#isPaused;
	#throwOnTimeout;
	/**
	Per-operation timeout in milliseconds. Operations fulfill once `timeout` elapses if they haven't already.
	
	Applies to each future operation.
	*/
	timeout;
	constructor(options) {
		super();
		options = {
			carryoverConcurrencyCount: false,
			intervalCap: Number.POSITIVE_INFINITY,
			interval: 0,
			concurrency: Number.POSITIVE_INFINITY,
			autoStart: true,
			queueClass: PriorityQueue,
			...options
		};
		if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
		if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
		this.#carryoverConcurrencyCount = options.carryoverConcurrencyCount;
		this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
		this.#intervalCap = options.intervalCap;
		this.#interval = options.interval;
		this.#queue = new options.queueClass();
		this.#queueClass = options.queueClass;
		this.concurrency = options.concurrency;
		this.timeout = options.timeout;
		this.#throwOnTimeout = options.throwOnTimeout === true;
		this.#isPaused = options.autoStart === false;
	}
	get #doesIntervalAllowAnother() {
		return this.#isIntervalIgnored || this.#intervalCount < this.#intervalCap;
	}
	get #doesConcurrentAllowAnother() {
		return this.#pending < this.#concurrency;
	}
	#next() {
		this.#pending--;
		this.#tryToStartAnother();
		this.emit("next");
	}
	#onResumeInterval() {
		this.#onInterval();
		this.#initializeIntervalIfNeeded();
		this.#timeoutId = void 0;
	}
	get #isIntervalPaused() {
		const now = Date.now();
		if (this.#intervalId === void 0) {
			const delay = this.#intervalEnd - now;
			if (delay < 0) this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
			else {
				if (this.#timeoutId === void 0) this.#timeoutId = setTimeout(() => {
					this.#onResumeInterval();
				}, delay);
				return true;
			}
		}
		return false;
	}
	#tryToStartAnother() {
		if (this.#queue.size === 0) {
			if (this.#intervalId) clearInterval(this.#intervalId);
			this.#intervalId = void 0;
			this.emit("empty");
			if (this.#pending === 0) this.emit("idle");
			return false;
		}
		if (!this.#isPaused) {
			const canInitializeInterval = !this.#isIntervalPaused;
			if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
				const job = this.#queue.dequeue();
				if (!job) return false;
				this.emit("active");
				job();
				if (canInitializeInterval) this.#initializeIntervalIfNeeded();
				return true;
			}
		}
		return false;
	}
	#initializeIntervalIfNeeded() {
		if (this.#isIntervalIgnored || this.#intervalId !== void 0) return;
		this.#intervalId = setInterval(() => {
			this.#onInterval();
		}, this.#interval);
		this.#intervalEnd = Date.now() + this.#interval;
	}
	#onInterval() {
		if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = void 0;
		}
		this.#intervalCount = this.#carryoverConcurrencyCount ? this.#pending : 0;
		this.#processQueue();
	}
	/**
	Executes all queued functions until it reaches the limit.
	*/
	#processQueue() {
		while (this.#tryToStartAnother());
	}
	get concurrency() {
		return this.#concurrency;
	}
	set concurrency(newConcurrency) {
		if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
		this.#concurrency = newConcurrency;
		this.#processQueue();
	}
	async #throwOnAbort(signal) {
		return new Promise((_resolve, reject) => {
			signal.addEventListener("abort", () => {
				reject(signal.reason);
			}, { once: true });
		});
	}
	async add(function_, options = {}) {
		options = {
			timeout: this.timeout,
			throwOnTimeout: this.#throwOnTimeout,
			...options
		};
		return new Promise((resolve, reject) => {
			this.#queue.enqueue(async () => {
				this.#pending++;
				this.#intervalCount++;
				try {
					options.signal?.throwIfAborted();
					let operation = function_({ signal: options.signal });
					if (options.timeout) operation = pTimeout(Promise.resolve(operation), { milliseconds: options.timeout });
					if (options.signal) operation = Promise.race([operation, this.#throwOnAbort(options.signal)]);
					const result = await operation;
					resolve(result);
					this.emit("completed", result);
				} catch (error) {
					if (error instanceof TimeoutError && !options.throwOnTimeout) {
						resolve();
						return;
					}
					reject(error);
					this.emit("error", error);
				} finally {
					this.#next();
				}
			}, options);
			this.emit("add");
			this.#tryToStartAnother();
		});
	}
	async addAll(functions, options) {
		return Promise.all(functions.map(async (function_) => this.add(function_, options)));
	}
	/**
	Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
	*/
	start() {
		if (!this.#isPaused) return this;
		this.#isPaused = false;
		this.#processQueue();
		return this;
	}
	/**
	Put queue execution on hold.
	*/
	pause() {
		this.#isPaused = true;
	}
	/**
	Clear the queue.
	*/
	clear() {
		this.#queue = new this.#queueClass();
	}
	/**
	Can be called multiple times. Useful if you for example add additional items at a later time.
	
	@returns A promise that settles when the queue becomes empty.
	*/
	async onEmpty() {
		if (this.#queue.size === 0) return;
		await this.#onEvent("empty");
	}
	/**
	@returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
	
	If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
	
	Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
	*/
	async onSizeLessThan(limit) {
		if (this.#queue.size < limit) return;
		await this.#onEvent("next", () => this.#queue.size < limit);
	}
	/**
	The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
	
	@returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
	*/
	async onIdle() {
		if (this.#pending === 0 && this.#queue.size === 0) return;
		await this.#onEvent("idle");
	}
	async #onEvent(event, filter) {
		return new Promise((resolve) => {
			const listener = () => {
				if (filter && !filter()) return;
				this.off(event, listener);
				resolve();
			};
			this.on(event, listener);
		});
	}
	/**
	Size of the queue, the number of queued items waiting to run.
	*/
	get size() {
		return this.#queue.size;
	}
	/**
	Size of the queue, filtered by the given options.
	
	For example, this can be used to find the number of items remaining in the queue with a specific priority level.
	*/
	sizeBy(options) {
		return this.#queue.filter(options).length;
	}
	/**
	Number of running items (no longer in the queue).
	*/
	get pending() {
		return this.#pending;
	}
	/**
	Whether the queue is currently paused.
	*/
	get isPaused() {
		return this.#isPaused;
	}
};
//#endregion
//#region src/main/helpers/gitInvocationPolicy.ts
/**
* The `-c key=value` argv overrides and non-interactive env our git spawns
* compose from (the local/remote GitExecutor impls in src/main/git/ and the
* file-index gitListing worker). Owning them here means a repo can never
* re-enable a policy through its own config, and a new hardening flag lands
* in one place. Each call site picks the posture matching its trust
* context — these are deliberately not one policy (a pre-trust listing can't
* assert safe.directory; a hooks-allowed post-checkout must not disable them).
*
* Two hardening classes deliberately live outside this module: the
* marketplace clone's GIT_CONFIG_KEY_n env pins (configuredMarketplaces.ts
* gitHardeningEnv) and the per-site diff --no-textconv/--no-ext-diff flags.
*
* Also bundled into the file-index utilityProcess worker (forbidElectronPlugin),
* so this module must stay import-free: anything transitively reaching
* `electron` fails that build. Values only.
*/
/** Emit non-ASCII filenames as raw UTF-8, not C-style octal escapes, so
*  paths from `diff`/`status` match `ls-files` and exist on disk. Not a
*  security posture, so it isn't fenced by the no-raw-git-policy-flags rule. */
var GIT_UTF8_PATHS = ["-c", "core.quotepath=false"];
/** Skip git's ownership check (fires on UNC paths — //wsl$/…, SMB — and
*  non-system drives). Only sound after the cwd has passed the trust gate. */
var GIT_TRUST_DIR = ["-c", "safe.directory=*"];
/** core.fsmonitor is an arbitrary executable named in .git/config that
*  status/diff/reset/checkout all invoke; force it off so repo-controlled
*  config can't get a (TCC-inheriting) exec via our spawn. */
var GIT_NO_FSMONITOR = ["-c", "core.fsmonitor=false"];
/** Point hooks at nothing so a repo's .git/hooks (or a configured
*  core.hooksPath) can't run under our spawn. */
var GIT_NO_HOOKS = ["-c", "core.hooksPath=/dev/null"];
/** DWIM `switch`/`checkout <remote-branch>` creates a tracking branch and
*  writes branch.<name>.* to the shared .git/config through config.lock; a
*  sandboxed session holding an fd on that lockfile gets to replace the
*  config. No tracking setup, no write. */
var GIT_NO_AUTO_TRACKING = ["-c", "branch.autoSetupMerge=false"];
[
	...GIT_UTF8_PATHS,
	...GIT_TRUST_DIR,
	...GIT_NO_FSMONITOR,
	...GIT_NO_AUTO_TRACKING
];
[
	...GIT_NO_HOOKS,
	...GIT_TRUST_DIR,
	...GIT_NO_FSMONITOR,
	...GIT_NO_AUTO_TRACKING
];
/**
* Pre-trust file listing (the file-index worker enumerates a folder before
* the user has trusted it). Must NOT assert safe.directory — the ownership
* check is a legitimate signal here — but must still refuse repo-controlled
* exec, so fsmonitor and hooks stay off.
*/
var UNTRUSTED_CWD_GIT_CONFIG_ARGS = [...GIT_NO_FSMONITOR, ...GIT_NO_HOOKS];
[
	`'core.hooksPath=/dev/null'`,
	"'core.fsmonitor=false'",
	"'safe.bareRepository=explicit'"
].join(" ");
//#endregion
//#region src/main/file-index-worker/gitListing.ts
/**
* `git ls-files` listing for the @-mention file index, run inside the
* file-index utility process so a monorepo-scale listing (up to 64MB of
* stdout × up to 16 child repos) is buffered, decoded, and parsed off the
* Electron main process instead of on it — per keystroke, that was enough
* to OOM main on large workspaces.
*
* Worker-bundled: no electron (or transitively-electron) imports here — see
* forbidElectronPlugin — and diagnostics go to `console`, which the service
* relays into main.log.
*/
var GIT_LS_FILES_MAX_BUFFER = 64 * 1024 * 1024;
var CHILD_REPO_SCAN_CONCURRENCY = 4;
/**
* List all tracked files using `git ls-files`, returning the raw stdout for
* FileIndexHost to parse. Returns null if not a git repo. This is fast
* (reads from git index) and covers every tracked file at any depth.
*/
async function listFilesWithGit(cwd) {
	try {
		const result = await spawnAsync("git", [
			...UNTRUSTED_CWD_GIT_CONFIG_ARGS,
			...GIT_UTF8_PATHS,
			"ls-files",
			"--recurse-submodules"
		], {
			cwd,
			timeout: 1e4,
			hardTimeoutMs: 15e3,
			maxBuffer: GIT_LS_FILES_MAX_BUFFER,
			ignoreExitCode: true
		});
		if (result.code !== 0) {
			if (!result.stderr.includes("not a git repository")) console.warn("git ls-files failed; falling back to shallow BFS (deep paths may be missing in @-mention autocomplete):", result.stderr);
			return null;
		}
		return result.stdout;
	} catch (error) {
		if (error instanceof Error && error.message.includes("exceeded maxBuffer")) console.warn("git ls-files output exceeded the size cap; falling back to shallow BFS (deep paths may be missing in @-mention autocomplete):", error.message);
		return null;
	}
}
/**
* Run `git ls-files` over each repo with bounded concurrency and return the
* listings to parse. A failed child repo (non-empty prefix) still yields an
* empty listing so its directory entry shows in fuzzy; a failed root repo
* (prefix "") yields nothing, so an empty result tells the caller the
* focused cwd isn't a git repo and it should fall back.
*/
async function listGitRepos(repos) {
	const scanQueue = new PQueue({ concurrency: CHILD_REPO_SCAN_CONCURRENCY });
	const perRepo = await Promise.all(repos.map(({ dir }) => scanQueue.add(() => listFilesWithGit(dir))));
	const listings = [];
	repos.forEach(({ prefix }, i) => {
		const stdout = perRepo[i];
		if (typeof stdout === "string") listings.push({
			prefix,
			stdout
		});
		else if (prefix.length > 0) listings.push({
			prefix,
			stdout: ""
		});
	});
	return listings;
}
//#endregion
//#region src/main/file-index-worker/skipDirectories.ts
/**
* Directories excluded from @-mention file listing and content search.
* Lives in its own module because both the main process (resources.ts) and
* the file-index utility process import it — the worker bundle must never
* transitively reach an electron import (see forbidElectronPlugin).
*/
var SKIP_DIRECTORIES = /* @__PURE__ */ new Set([
	"node_modules",
	".git",
	".svn",
	".hg",
	"dist",
	"build",
	"out",
	".next",
	".nuxt",
	".cache",
	"__pycache__",
	".tox",
	".venv",
	"venv",
	"env",
	".env",
	"coverage",
	".nyc_output",
	".turbo",
	".parcel-cache",
	"target",
	"vendor",
	".terraform",
	".gradle",
	".m2",
	".mvn",
	".idea",
	".vscode",
	".history",
	".yarn",
	".pnpm-store",
	".npm",
	".vite"
]);
//#endregion
//#region src/main/file-index-worker/contentSearch.ts
/**
* Case-smart content search over the focused-session cwd, run inside the
* file-index utility process so search output never touches the main-process
* heap. ripgrep --json for ranking/perf parity with the CLI; falls back to
* `git grep -nI` when rg isn't on PATH. Both arms stream their line-delimited
* output through `onStdoutLine` and kill the child at the result cap.
*
* Worker-bundled: no electron (or transitively-electron) imports here — see
* forbidElectronPlugin — and diagnostics go to `console`, which the service
* relays into main.log. The augmented PATH is passed in by main because
* resolving it (allPaths → the shell-path worker) needs electron.
*/
var CONTENT_SEARCH_TIMEOUT_MS = 8e3;
var CONTENT_SEARCH_PREVIEW_MAX = 200;
var PER_FILE_MATCH_CAP = 5;
var RG_MAX_OUTPUT_BYTES = 64 * 1024 * 1024;
function isRgMatchEvent(v) {
	return typeof v === "object" && v !== null && v.type === "match";
}
/** Match sink shared by both arms: drop records resolving outside `cwd`
*  (a newline in a dirname forges records), cap matches per file so one hot
*  file can't fill every slot, collect up to `cap`, then stop the child. */
function makeMatchCollector(cap, cwd) {
	const out = [];
	const perFile = /* @__PURE__ */ new Map();
	return {
		out,
		add: (match) => {
			if (node_path.default.relative(cwd, match.absPath).startsWith("..")) return;
			const fileCount = perFile.get(match.relativePath) ?? 0;
			if (fileCount >= PER_FILE_MATCH_CAP) return;
			perFile.set(match.relativePath, fileCount + 1);
			out.push(match);
			if (out.length >= cap) return "stop";
		}
	};
}
/** Spawn options shared by both search arms. */
function searchSpawnOptions(cwd, pathEnv, onStdoutLine, maxBuffer) {
	return {
		cwd,
		timeout: CONTENT_SEARCH_TIMEOUT_MS,
		hardTimeoutMs: 1e4,
		detached: true,
		ignoreExitCode: true,
		onStdoutLine,
		maxBuffer,
		env: {
			...process.env,
			PATH: pathEnv
		}
	};
}
/**
* rg-then-git-grep cascade. `cwd` is main-authored (the focused project);
* `pathEnv` is the joined augmented PATH main resolved via allPaths().
*/
async function searchContentInDirectory(query, cwd, cap, pathEnv) {
	const rgResults = await searchWithRipgrep(query, cwd, cap, pathEnv);
	if (rgResults !== null) return rgResults;
	return searchWithGitGrep(query, cwd, cap, pathEnv);
}
/** Returns null when rg isn't installed/spawnable so the caller can fall back. */
async function searchWithRipgrep(query, cwd, cap, pathEnv) {
	const { out, add } = makeMatchCollector(cap, cwd);
	let sawStdout = false;
	const onStdoutLine = (line) => {
		sawStdout = true;
		if (line.length === 0) return;
		let evt;
		try {
			evt = JSON.parse(line);
		} catch {
			return;
		}
		if (!isRgMatchEvent(evt)) return;
		const relativePath = evt.data.path.text;
		if (!relativePath) return;
		const previewRaw = evt.data.lines.text ?? "";
		return add({
			relativePath: relativePath.replaceAll("\\", "/"),
			absPath: node_path.default.join(cwd, relativePath),
			line: evt.data.line_number,
			column: (evt.data.submatches[0]?.start ?? 0) + 1,
			preview: previewRaw.replace(/\r?\n$/, "").slice(0, CONTENT_SEARCH_PREVIEW_MAX)
		});
	};
	let result;
	try {
		result = await spawnAsync("rg", [
			"--json",
			"--no-config",
			"-S",
			"--fixed-strings",
			"--max-count",
			String(PER_FILE_MATCH_CAP),
			"--max-columns",
			String(CONTENT_SEARCH_PREVIEW_MAX),
			"--max-columns-preview",
			"-g",
			"!node_modules",
			"--",
			query
		], searchSpawnOptions(cwd, pathEnv, onStdoutLine, RG_MAX_OUTPUT_BYTES));
	} catch (err) {
		console.warn("contentSearch: rg spawn failed; falling back", err);
		return null;
	}
	if (result.stoppedEarly && out.length === 0 || !result.stoppedEarly && result.code !== 0 && !(result.code === null && out.length > 0) && !(result.code === 1 && sawStdout) && !(result.code === 2 && out.length > 0)) {
		console.warn("contentSearch: rg nonzero; falling back", result.code, result.stderr);
		return null;
	}
	return out;
}
/** `git grep -m` (per-file match cap) needs git >= 2.38; unparseable = unsupported. */
function gitVersionSupportsGrepMaxCount(versionOutput) {
	const match = /git version (\d+)\.(\d+)/.exec(versionOutput);
	if (!match) return false;
	const major = Number(match[1]);
	const minor = Number(match[2]);
	return major > 2 || major === 2 && minor >= 38;
}
var GIT_VERSION_PROBE_TIMEOUT_MS = 2e3;
var grepMaxCountSupport;
/** One `git --version` probe per worker process. Only a completed parse is
*  cached — negatives are cheap to re-probe and the user may have just fixed git. */
function probeGitGrepMaxCountSupport(pathEnv) {
	grepMaxCountSupport ??= spawnAsync("git", [...UNTRUSTED_CWD_GIT_CONFIG_ARGS, "--version"], {
		timeout: GIT_VERSION_PROBE_TIMEOUT_MS,
		hardTimeoutMs: GIT_VERSION_PROBE_TIMEOUT_MS * 2,
		detached: true,
		env: {
			...process.env,
			PATH: pathEnv
		}
	}).then((result) => gitVersionSupportsGrepMaxCount(result.stdout)).catch(() => {
		grepMaxCountSupport = void 0;
		return false;
	});
	return grepMaxCountSupport;
}
async function searchWithGitGrep(query, cwd, cap, pathEnv) {
	const { out, add } = makeMatchCollector(cap, cwd);
	const onStdoutLine = (raw) => {
		if (raw.length === 0) return;
		const nul1 = raw.indexOf("\0");
		const nul2 = raw.indexOf("\0", nul1 + 1);
		if (nul1 < 0 || nul2 < 0) return;
		const relativePath = raw.slice(0, nul1);
		const lineNo = Number.parseInt(raw.slice(nul1 + 1, nul2), 10);
		if (!Number.isFinite(lineNo)) return;
		return add({
			relativePath: relativePath.replaceAll("\\", "/"),
			absPath: node_path.default.join(cwd, relativePath),
			line: lineNo,
			column: 1,
			preview: raw.slice(nul2 + 1).slice(0, CONTENT_SEARCH_PREVIEW_MAX)
		});
	};
	try {
		const args = [
			...UNTRUSTED_CWD_GIT_CONFIG_ARGS,
			"grep",
			"--no-index",
			"--exclude-standard",
			"-nIz",
			"--fixed-strings"
		];
		if (await probeGitGrepMaxCountSupport(pathEnv)) args.push("-m", String(PER_FILE_MATCH_CAP));
		if (query === query.toLowerCase()) args.push("-i");
		args.push("-e", query, "--");
		for (const d of SKIP_DIRECTORIES) args.push(`:(exclude,glob)**/${d}/**`);
		args.push(":(exclude,glob)**/.*", ":(exclude,glob)**/.*/**");
		await spawnAsync("git", args, searchSpawnOptions(cwd, pathEnv, onStdoutLine));
	} catch (err) {
		console.warn("contentSearch: git grep spawn failed", err);
		return [];
	}
	return out;
}
//#endregion
//#region src/main/file-index-worker/fileIndexWorker.ts
/**
* Utility process for the @-mention project file index, `git ls-files`
* listing, and content search: FileIndexHost owns the file list and
* FileIndex off the Electron main process; the wiring at the bottom binds
* it to the MessagePort protocol in FileIndexService.ts.
*
* Index mutations (`clear`, `set-entries`, `commit-staged-git`) are handled
* synchronously, so the port's FIFO ordering is the consistency model —
* every reply reflects exactly the mutations posted before it.
* `stage-git-listing` and `content-search` are asynchronous (they spawn)
* but touch no index state — a staged listing is invisible until main
* commits it — and their replies are correlated by requestId, not order.
*/
var MAX_STAGED_GIT_LISTINGS = 2;
var FileIndexHost = class {
	constructor() {
		this.entries = [];
		this.pathToFile = /* @__PURE__ */ new Map();
		this.index = null;
		this.stagedGitListings = new LRUCache(MAX_STAGED_GIT_LISTINGS);
	}
	/**
	* Drop the index (focused cwd changed). Staged git listings survive on
	* purpose: when the new focus resolves to the same cwd (landing page →
	* session in that folder) the in-flight refresh must still be able to
	* commit its warm listing — main re-checks the target before every
	* commit, so a genuinely stale stage is never committed.
	*/
	clear() {
		this.entries = [];
		this.pathToFile = /* @__PURE__ */ new Map();
		this.index = null;
	}
	/** Replace the file list with pre-parsed entries (SSH / BFS listings). */
	setEntries(files) {
		this.commit(files);
	}
	/** `git ls-files` each repo and hold the raw output here, keyed by the
	*  service-minted stageToken, until main commits it — the index is
	*  untouched. False = the sole (prefix "") repo isn't a git repo, so the
	*  caller should fall back. */
	async stageGitListing(cwd, repos, stageToken) {
		const listings = await listGitRepos(repos);
		if (listings.length === 0) return false;
		this.stagedGitListings.set(stageToken, {
			cwd,
			listings
		});
		return true;
	}
	/** Free a staged listing whose refresh isn't going to commit it. */
	discardStagedGitListing(stageToken) {
		this.stagedGitListings.delete(stageToken);
	}
	/** Atomically replace the index with a staged listing. False when the
	*  stage is gone (worker reforked, or evicted past the cap) — the caller
	*  treats it like any other failed ship. */
	commitStagedGitListing(stageToken) {
		const staged = this.stagedGitListings.get(stageToken);
		this.stagedGitListings.delete(stageToken);
		if (!staged) return false;
		this.commitGitListing(staged.cwd, staged.listings);
		return true;
	}
	/** Replace the file list from raw `git ls-files` stdout(s): files + derived
	*  parent-directory entries (parents first, deduped), each repo namespaced
	*  under its prefix. */
	commitGitListing(cwd, repos) {
		const seen = /* @__PURE__ */ new Set();
		const files = [];
		const push = (name, relativePath, isDirectory) => {
			seen.add(relativePath);
			files.push({
				name,
				relativePath,
				fullPath: node_path.default.join(cwd, relativePath),
				isDirectory
			});
		};
		for (const { prefix, stdout } of repos) {
			if (prefix.length > 0 && !seen.has(prefix)) push(prefix, prefix, true);
			for (const line of stdout.split("\n")) {
				if (line.length === 0) continue;
				const relativePath = prefix.length > 0 ? `${prefix}/${line}` : line;
				const parts = relativePath.split("/");
				for (let i = 1; i < parts.length; i++) {
					const dirPath = parts.slice(0, i).join("/");
					if (!seen.has(dirPath)) push(parts[i - 1], dirPath, true);
				}
				if (!seen.has(relativePath)) push(parts[parts.length - 1], relativePath, false);
			}
		}
		this.commit(files);
	}
	/** Bounded snapshot of the current file list (listProjectFiles IPC). */
	list(limit) {
		return this.entries.slice(0, limit);
	}
	/** Fuzzy-rank over the full file list. */
	search(query, limit) {
		const matches = [];
		if (this.index) for (const { path: relativePath, positions } of this.index.search(query, limit)) {
			const file = this.pathToFile.get(relativePath);
			if (file) matches.push({
				...file,
				positions: Array.from(positions)
			});
		}
		return matches;
	}
	commit(files) {
		const pathToFile = /* @__PURE__ */ new Map();
		const relativePaths = files.map((f) => {
			pathToFile.set(f.relativePath, f);
			return f.relativePath;
		});
		try {
			const index = new FileIndex();
			index.loadFromFileList(relativePaths);
			this.entries = files;
			this.pathToFile = pathToFile;
			this.index = index;
		} catch (error) {
			console.error("[file-index] FileIndex build failed:", error);
			this.clear();
		}
	}
};
if (process.parentPort !== void 0) {
	process.parentPort.once("message", (e) => {
		if (e.data.type !== "init" || !e.ports?.[0]) process.exit(1);
		const host = new FileIndexHost();
		const port = e.ports[0];
		const post = (message) => {
			try {
				port.postMessage(message);
			} catch {}
		};
		/** Post an async handler's reply (stamped with `requestId`) when it
		*  settles; a rejection becomes an "error" reply so main's waiter never
		*  hangs. */
		const postSettled = (requestId, pending) => {
			pending.then((body) => post({
				...body,
				requestId
			})).catch((error) => post({
				type: "error",
				requestId,
				message: error instanceof Error ? error.message : "Unknown error"
			}));
		};
		const handle = (request) => {
			switch (request.type) {
				case "clear": return host.clear();
				case "discard-staged-git": return host.discardStagedGitListing(request.stageToken);
				case "set-entries":
					host.setEntries(request.files);
					return post({
						type: "set-result",
						requestId: request.requestId
					});
				case "stage-git-listing": return postSettled(request.requestId, host.stageGitListing(request.cwd, request.repos, request.stageToken).then((staged) => ({
					type: "stage-git-result",
					staged
				})));
				case "commit-staged-git": return post({
					type: "commit-staged-result",
					requestId: request.requestId,
					committed: host.commitStagedGitListing(request.stageToken)
				});
				case "search": return post({
					type: "search-result",
					requestId: request.requestId,
					results: host.search(request.query, request.limit)
				});
				case "content-search": return postSettled(request.requestId, searchContentInDirectory(request.query, request.cwd, request.cap, request.pathEnv).then((results) => ({
					type: "content-search-result",
					results
				})));
				case "list": return post({
					type: "list-result",
					requestId: request.requestId,
					files: host.list(request.limit)
				});
				default: return request;
			}
		};
		port.on("message", (event) => {
			const request = event.data;
			try {
				handle(request);
			} catch (error) {
				if ("requestId" in request) post({
					type: "error",
					requestId: request.requestId,
					message: error instanceof Error ? error.message : "Unknown error"
				});
			}
		});
		port.start();
	});
	process.on("SIGTERM", () => process.exit(0));
	process.on("SIGINT", () => process.exit(0));
}
//#endregion
exports.FileIndexHost = FileIndexHost;
