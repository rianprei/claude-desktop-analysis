#!/usr/bin/env node
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
let node_stream = require("node:stream");
let node_string_decoder = require("node:string_decoder");
let node_url = require("node:url");
//#region src/main/mcp-runtime/nodeHost.ts
/**
* Node.js host for running MCP servers in Electron's UtilityProcess
* This version uses MessagePort for communication since UtilityProcess
* doesn't support stdin in the traditional sense.
*/
var [entryPoint, ...args] = process.argv.slice(2);
var messagePort;
var rawStderrWrite = process.stderr.write.bind(process.stderr);
var stdoutDecoder = new node_string_decoder.StringDecoder("utf8");
var stderrDecoder = new node_string_decoder.StringDecoder("utf8");
function chunkToString(decoder, chunk) {
	return typeof chunk === "string" ? chunk : decoder.write(Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength));
}
function postToParent(message) {
	try {
		messagePort?.postMessage(message);
	} catch (error) {
		try {
			rawStderrWrite(`[nodeHost] postToParent failed: ${String(error)}\n`);
		} catch {}
	}
}
function reportFatal(kind, err) {
	const e = err instanceof Error ? err : new Error(String(err));
	postToParent({
		type: "fatal-error",
		kind,
		message: String(e.message),
		stack: typeof e.stack === "string" ? e.stack : void 0
	});
	console.error(`[nodeHost] ${kind}:`, e.message);
	setImmediate(() => process.exit(1));
}
process.on("uncaughtException", (err) => reportFatal("uncaughtException", err));
process.on("unhandledRejection", (reason) => reportFatal("unhandledRejection", reason));
if (!entryPoint) {
	console.error("Error: No entry point specified");
	process.exit(1);
}
process.parentPort.once("message", (e) => {
	if (e.data.type !== "init" || !e.ports || !e.ports[0]) {
		console.error("Error: Expected init message with MessagePort");
		process.exit(1);
	}
	const port = e.ports[0];
	messagePort = port;
	const stdoutWrite = function(chunk, encodingOrCallback, callback) {
		const stdoutContent = chunkToString(stdoutDecoder, chunk);
		if (stdoutContent.length > 0) postToParent({
			type: "stdout",
			content: stdoutContent
		});
		let cb;
		if (typeof encodingOrCallback === "function") cb = encodingOrCallback;
		else if (callback) cb = callback;
		if (cb) process.nextTick(cb);
		return true;
	};
	process.stdout.write = stdoutWrite;
	const originalStderrWrite = process.stderr.write.bind(process.stderr);
	const stderrWrite = function(chunk, encodingOrCallback, callback) {
		const stderrContent = chunkToString(stderrDecoder, chunk);
		if (stderrContent.length > 0) postToParent({
			type: "stderr",
			content: stderrContent
		});
		if (typeof encodingOrCallback === "function") return originalStderrWrite(chunk, encodingOrCallback);
		else return originalStderrWrite(chunk, encodingOrCallback, callback);
	};
	process.stderr.write = stderrWrite;
	const stdinStream = new node_stream.Readable({ read() {} });
	if (process.stdin) {
		for (const method of [
			"read",
			"push",
			"unshift",
			"pause",
			"resume",
			"pipe",
			"unpipe",
			"on",
			"once",
			"removeListener",
			"removeAllListeners",
			"setEncoding",
			"destroy",
			"isPaused",
			"readableLength",
			"readable"
		]) if (typeof stdinStream[method] === "function") process.stdin[method] = stdinStream[method].bind(stdinStream);
		Object.defineProperty(process.stdin, "readableHighWaterMark", {
			get: () => stdinStream.readableHighWaterMark,
			configurable: true
		});
		Object.defineProperty(process.stdin, "readableLength", {
			get: () => stdinStream.readableLength,
			configurable: true
		});
		Object.defineProperty(process.stdin, "destroyed", {
			get: () => stdinStream.destroyed,
			configurable: true
		});
	}
	port.on("message", (event) => {
		if (event.data.type === "stdin") stdinStream.push(event.data.data + "\n");
	});
	port.start();
	process.argv = [
		process.platform === "win32" ? "node.exe" : "node",
		entryPoint,
		...args
	];
	try {
		const absolutePath = node_path.resolve(entryPoint);
		delete require.cache[absolutePath];
		import((0, node_url.pathToFileURL)(absolutePath).toString()).catch((error) => {
			reportFatal("import-failed", error);
		});
	} catch (error) {
		reportFatal("import-failed", error);
	}
});
process.on("SIGTERM", () => {
	process.exit(0);
});
process.on("SIGINT", () => {
	process.exit(0);
});
//#endregion
