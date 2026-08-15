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
let node_crypto = require("node:crypto");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let node_os = require("node:os");
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_child_process = require("node:child_process");
let node_string_decoder = require("node:string_decoder");
//#region src/main/helpers/spawnPromise.ts
function abortRejection(signal, cmd) {
	return signal.reason instanceof Error ? signal.reason : new DOMException(`spawnAsync(${cmd}) aborted`, "AbortError");
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
/**
* Full OTEL var set a user can supply via shell rc or Settings UI. Spread into
* CC_ENV_EXTRACT_LIST (extractPathFromShell.ts) and stripUserOtelEnv
* (sessionEnvironment.ts). Superset of OTEL_TRUST_SAFE_ENV_VARS — the extras
* control WHERE telemetry goes / which tenant it auths as (ENDPOINT / HEADERS
* / CLIENT_KEY / CLIENT_CERTIFICATE) or WHAT content it carries (OTEL_LOG_*),
* and must NOT bypass the workspace trust dialog.
*/
var OTEL_USER_ENV_VARS = [
	...[
		"CLAUDE_CODE_ENABLE_TELEMETRY",
		"CLAUDE_CODE_OTEL_HEADERS_HELPER_DEBOUNCE_MS",
		"OTEL_EXPORTER_OTLP_LOGS_PROTOCOL",
		"OTEL_EXPORTER_OTLP_METRICS_PROTOCOL",
		"OTEL_EXPORTER_OTLP_PROTOCOL",
		"OTEL_EXPORTER_OTLP_TRACES_PROTOCOL",
		"OTEL_LOGS_EXPORT_INTERVAL",
		"OTEL_LOGS_EXPORTER",
		"OTEL_METRIC_EXPORT_INTERVAL",
		"OTEL_METRICS_EXPORTER",
		"OTEL_METRICS_INCLUDE_ACCOUNT_UUID",
		"OTEL_METRICS_INCLUDE_SESSION_ID",
		"OTEL_METRICS_INCLUDE_VERSION",
		"OTEL_RESOURCE_ATTRIBUTES",
		"OTEL_SERVICE_NAME"
	],
	"CLAUDE_CODE_ENHANCED_TELEMETRY_BETA",
	"OTEL_TRACES_EXPORTER",
	"OTEL_TRACES_EXPORT_INTERVAL",
	"OTEL_LOG_ASSISTANT_RESPONSES",
	"OTEL_LOG_RAW_API_BODIES",
	"OTEL_LOG_TOOL_CONTENT",
	"OTEL_LOG_TOOL_DETAILS",
	"OTEL_LOG_USER_PROMPTS",
	"OTEL_EXPORTER_OTLP_ENDPOINT",
	"OTEL_EXPORTER_OTLP_LOGS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_METRICS_ENDPOINT",
	"OTEL_EXPORTER_OTLP_TRACES_ENDPOINT",
	"OTEL_EXPORTER_OTLP_HEADERS",
	"OTEL_EXPORTER_OTLP_LOGS_HEADERS",
	"OTEL_EXPORTER_OTLP_METRICS_HEADERS",
	"OTEL_EXPORTER_OTLP_TRACES_HEADERS",
	"OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE",
	"OTEL_EXPORTER_OTLP_CLIENT_KEY",
	"OTEL_EXPORTER_OTLP_LOGS_CLIENT_CERTIFICATE",
	"OTEL_EXPORTER_OTLP_LOGS_CLIENT_KEY",
	"OTEL_EXPORTER_OTLP_METRICS_CLIENT_CERTIFICATE",
	"OTEL_EXPORTER_OTLP_METRICS_CLIENT_KEY",
	"OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE",
	"OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY"
];
//#endregion
//#region src/main/sessions/extractPathFromShell.ts
/**
* Login-shell probing helpers: safe shell selection and the interactive
* login-shell environment dump. Run inside the shell-path utility process
* (shellPathWorker.ts) so a hung or crashing shell can't take down main.
*/
var SHELL_TIMEOUT_MS = 4e3;
[...OTEL_USER_ENV_VARS];
/**
* Vars injected into the probe shell's env to keep it fast and quiet. `env`
* echoes these back, so {@link parseEnvDump} strips any key whose value
* matches what the probe injected — a user who sets the same key to a
* different value in their own rc keeps it (same value is
* indistinguishable from our injection and is stripped).
*/
var PROBE_ONLY_ENV = {
	DISABLE_AUTO_UPDATE: "true",
	ZSH_DISABLE_COMPFIX: "true",
	CLAUDE_DESKTOP_RESOLVING_ENVIRONMENT: "1"
};
/**
* Bookkeeping vars every shell exports that describe the probe process
* itself, not the user's environment. Spreading these over `process.env`
* downstream would clobber the real values with stale probe-session state.
*/
var PROBE_SESSION_VARS = [
	"PWD",
	"OLDPWD",
	"SHLVL",
	"_"
];
var COMMON_SHELLS = [
	{
		path: "/bin/zsh",
		hints: [node_path.default.resolve((0, node_os.homedir)(), ".zshrc")]
	},
	{
		path: "/bin/bash",
		hints: [node_path.default.resolve((0, node_os.homedir)(), ".bashrc")]
	},
	{ path: "/bin/sh" }
];
/**
* Get a safe shell path. Requires an absolute path to prevent command injection.
* execFile with an absolute path is safe - it directly executes the binary
* without shell parsing, so even unusual paths can't inject commands.
*/
function getSafeShell() {
	const envShell = process.env.SHELL;
	if (envShell?.startsWith("/") && (0, node_fs.existsSync)(envShell)) return envShell;
	for (const shell of COMMON_SHELLS) if ((0, node_fs.existsSync)(shell.path) && shell.hints?.some((hint) => (0, node_fs.existsSync)(hint))) return shell.path;
	for (const shell of COMMON_SHELLS) if ((0, node_fs.existsSync)(shell.path)) return shell.path;
	return "/bin/sh";
}
/**
* Extract the user's full login-shell environment. Uses both login (-l)
* and interactive (-i) flags so shell configs like ~/.zshrc and ~/.bashrc
* are sourced — tools like pyenv, rbenv, nvm, and bun initialize their env
* in interactive configs. A sentinel marker locates the dump in stdout,
* since shells can print arbitrary content during startup (welcome
* messages, neofetch, etc). Returns every var the login shell exports —
* the {@link CC_ENV_EXTRACT_LIST} whitelist is applied by callers
* (specifically getShellPath's process.env merge), not here, so consumers
* that need the full env (worktree hooks, for Dock-launch parity with the
* CLI's terminal-inherited env) can read it without a second shell spawn.
*/
async function extractShellEnvironment() {
	if (process.platform === "win32") {
		const result = {};
		for (const [key, value] of Object.entries(process.env)) if (value !== void 0) result[key] = value;
		return result;
	}
	const shell = getSafeShell();
	const envSentinel = `___CLAUDE_ENV_EXTRACT_${(0, node_crypto.randomUUID)().replace(/-/g, "")}___`;
	const { stdout } = await spawnAsyncDirect(shell, [
		"-l",
		"-i",
		"-c",
		`echo "${envSentinel}"; env`
	], {
		timeout: SHELL_TIMEOUT_MS,
		env: {
			HOME: process.env.HOME,
			PATH: process.env.PATH,
			SHELL: process.env.SHELL,
			USER: process.env.USER,
			...PROBE_ONLY_ENV
		}
	});
	const sentinelIdx = stdout.indexOf(envSentinel);
	if (sentinelIdx === -1) return { PATH: process.env.PATH || "" };
	const result = parseEnvDump(stdout.slice(sentinelIdx + envSentinel.length + 1).trim());
	if (!result.PATH) result.PATH = process.env.PATH || "";
	return result;
}
/**
* Parse `env` output into a map, handling multiline values and skipping
* keys with non-standard chars (BASH_FUNC_*%%). Strips the probe's own
* injected markers and session bookkeeping vars so they don't leak to
* downstream consumers. Exported for test.
*/
function parseEnvDump(envOutput) {
	const result = {};
	let currentKey = null;
	let currentValue = null;
	const flush = () => {
		if (currentKey !== null && currentValue !== null) result[currentKey] = currentValue;
	};
	for (const line of envOutput.split("\n")) {
		const eqIdx = line.indexOf("=");
		if (eqIdx > 0 && /^[A-Za-z_][A-Za-z0-9_]*$/.test(line.slice(0, eqIdx))) {
			flush();
			currentKey = line.slice(0, eqIdx);
			currentValue = line.slice(eqIdx + 1);
		} else if (eqIdx > 0) {
			flush();
			currentKey = null;
			currentValue = null;
		} else if (currentKey !== null && currentValue !== null) currentValue += "\n" + line;
	}
	flush();
	for (const [key, injected] of Object.entries(PROBE_ONLY_ENV)) if (result[key] === injected) delete result[key];
	for (const key of PROBE_SESSION_VARS) delete result[key];
	return result;
}
//#endregion
//#region src/main/sessions/shellPathWorker.ts
function postToParent(port, message) {
	try {
		port.postMessage(message);
	} catch {}
}
process.parentPort.once("message", (e) => {
	if (e.data.type !== "init" || !e.ports?.[0]) process.exit(1);
	const port = e.ports[0];
	port.on("message", async (event) => {
		if (event.data.type === "getEnvironment") try {
			const env = await extractShellEnvironment();
			postToParent(port, {
				type: "envResult",
				env
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			postToParent(port, {
				type: "error",
				message
			});
		}
	});
	port.start();
});
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
//#endregion
