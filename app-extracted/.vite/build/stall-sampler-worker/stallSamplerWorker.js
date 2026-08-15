let node_inspector_promises = require("node:inspector/promises");
let node_worker_threads = require("node:worker_threads");
BigInt64Array.BYTES_PER_ELEMENT;
//#endregion
//#region src/main/stall-sampler/samplerCore.ts
var IDLE_NODE = "(idle)";
/** Top `maxFrames` frames by self time; `(idle)` samples are dropped. */
function topFrames(profile, config) {
	const nodesById = new Map(profile.nodes.map((node) => [node.id, node]));
	const hits = /* @__PURE__ */ new Map();
	for (const nodeId of profile.samples ?? []) {
		const frame = nodesById.get(nodeId)?.callFrame;
		if (!frame || frame.functionName === IDLE_NODE) continue;
		const fn = frame.functionName || "(anonymous)";
		const line = frame.url ? frame.lineNumber + 1 : 0;
		const key = `${fn}\n${frame.url}\n${line}`;
		const entry = hits.get(key);
		if (entry) entry.hits += 1;
		else hits.set(key, {
			fn,
			url: frame.url,
			line,
			selfMs: 0,
			hits: 1
		});
	}
	return [...hits.values()].sort((a, b) => b.hits - a.hits).slice(0, config.maxFrames).map(({ fn, url, line, hits: n }) => ({
		fn,
		url,
		line,
		selfMs: Math.round(n * config.samplingIntervalUs / 1e3)
	}));
}
function createStallSampler(deps) {
	const { heartbeat, profiler, post, now, config } = deps;
	let lastSeq = Number(Atomics.load(heartbeat, 0));
	let lastAdvanceAt = now();
	let lastPollAt = lastAdvanceAt;
	let armed = false;
	let lastRunAt = -Infinity;
	/** The profiler run in flight; resolves false if `start` failed. */
	let started = null;
	/** A run already stopped at `maxCaptureMs`, held for the resume beat. */
	let summarized = null;
	let detectedAt = 0;
	let startAckAt = null;
	/** Never rejects: an inspector failure yields no capture. */
	const stopAndSummarize = async (run) => {
		try {
			if (!await run || startAckAt === null) return null;
			return {
				frames: topFrames(await profiler.stop(), config),
				startLagMs: Math.round(startAckAt - detectedAt)
			};
		} catch {
			return null;
		}
	};
	const poll = () => {
		const seq = Number(Atomics.load(heartbeat, 0));
		const t = now();
		if (t - lastPollAt > 5 * config.stallThresholdMs) lastAdvanceAt = t;
		lastPollAt = t;
		if (seq !== lastSeq) {
			const resumeSeq = lastSeq + 1;
			lastSeq = seq;
			lastAdvanceAt = t;
			armed = true;
			const capture = summarized ?? (started && stopAndSummarize(started));
			started = null;
			summarized = null;
			capture?.then((c) => c && post({
				type: "stall_capture",
				resumeSeq,
				...c
			})).catch(() => void 0);
			return;
		}
		if (!armed || summarized) return;
		if (started) {
			if (startAckAt !== null && t - startAckAt >= config.maxCaptureMs) {
				summarized = stopAndSummarize(started);
				started = null;
			}
			return;
		}
		if (t - lastAdvanceAt >= config.stallThresholdMs && t - lastRunAt >= config.minCaptureIntervalMs) {
			detectedAt = t;
			startAckAt = null;
			lastRunAt = t;
			started = profiler.start().then(() => {
				startAckAt = now();
				return true;
			}, () => false);
		}
	};
	return { poll };
}
//#endregion
//#region src/main/stall-sampler/stallSamplerWorker.ts
var { heartbeat, config } = node_worker_threads.workerData;
var session = new node_inspector_promises.Session();
session.connectToMainThread();
var prepared = null;
var prepareSession = () => {
	prepared ??= (async () => {
		await session.post("Profiler.enable");
		await session.post("Profiler.setSamplingInterval", { interval: config.samplingIntervalUs });
	})().catch((error) => {
		prepared = null;
		throw error;
	});
	return prepared;
};
var sampler = createStallSampler({
	heartbeat: new BigInt64Array(heartbeat),
	profiler: {
		async start() {
			await prepareSession();
			await session.post("Profiler.start");
		},
		async stop() {
			const { profile } = await session.post("Profiler.stop");
			return profile;
		}
	},
	post: (message) => node_worker_threads.parentPort?.postMessage(message),
	now: () => performance.now(),
	config
});
setInterval(sampler.poll, config.pollIntervalMs);
//#endregion
