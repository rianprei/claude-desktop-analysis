const require_esm = require("./esm-BotMe_9_.js");
let fs = require("fs");
let util = require("util");
let child_process = require("child_process");
let os = require("os");
os = require_esm.__toESM(os, 1);
let path = require("path");
require("crypto");
let fs_promises = require("fs/promises");
fs_promises = require_esm.__toESM(fs_promises, 1);
(/* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	function makeArray(subject) {
		return Array.isArray(subject) ? subject : [subject];
	}
	var UNDEFINED = void 0;
	var EMPTY = "";
	var SPACE = " ";
	var ESCAPE = "\\";
	var REGEX_TEST_BLANK_LINE = /^\s+$/;
	var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
	var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
	var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
	var REGEX_SPLITALL_CRLF = /\r?\n/g;
	var REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/;
	var REGEX_TEST_TRAILING_SLASH = /\/$/;
	var SLASH = "/";
	var TMP_KEY_IGNORE = "node-ignore";
	/* istanbul ignore else */
	if (typeof Symbol !== "undefined") TMP_KEY_IGNORE = Symbol.for("node-ignore");
	var KEY_IGNORE = TMP_KEY_IGNORE;
	var define = (object, key, value) => {
		Object.defineProperty(object, key, { value });
		return value;
	};
	var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
	var RETURN_FALSE = () => false;
	var sanitizeRange = (range) => range.replace(REGEX_REGEXP_RANGE, (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY);
	var cleanRangeBackSlash = (slashes) => {
		const { length } = slashes;
		return slashes.slice(0, length - length % 2);
	};
	var REPLACERS = [
		[/^\uFEFF/, () => EMPTY],
		[/((?:\\\\)*?)(\\?\s+)$/, (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)],
		[/(\\+?)\s/g, (_, m1) => {
			const { length } = m1;
			return m1.slice(0, length - length % 2) + SPACE;
		}],
		[/[\\$.|*+(){^]/g, (match) => `\\${match}`],
		[/(?!\\)\?/g, () => "[^/]"],
		[/^\//, () => "^"],
		[/\//g, () => "\\/"],
		[/^\^*\\\*\\\*\\\//, () => "^(?:.*\\/)?"],
		[/^(?=[^^])/, function startingReplacer() {
			return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
		}],
		[/\\\/\\\*\\\*(?=\\\/|$)/g, (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"],
		[/(^|[^\\]+)(\\\*)+(?=.+)/g, (_, p1, p2) => {
			return p1 + p2.replace(/\\\*/g, "[^\\/]*");
		}],
		[/\\\\\\(?=[$.|*+(){^])/g, () => ESCAPE],
		[/\\\\/g, () => ESCAPE],
		[/(\\)?\[([^\]/]*?)(\\*)($|\])/g, (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${sanitizeRange(range)}${endEscape}]` : "[]" : "[]"],
		[/(?:[^*])$/, (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`]
	];
	var REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/;
	var MODE_IGNORE = "regex";
	var MODE_CHECK_IGNORE = "checkRegex";
	var TRAILING_WILD_CARD_REPLACERS = {
		[MODE_IGNORE](_, p1) {
			return `${p1 ? `${p1}[^/]+` : "[^/]*"}(?=$|\\/$)`;
		},
		[MODE_CHECK_IGNORE](_, p1) {
			return `${p1 ? `${p1}[^/]*` : "[^/]*"}(?=$|\\/$)`;
		}
	};
	var makeRegexPrefix = (pattern) => REPLACERS.reduce((prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern)), pattern);
	var isString = (subject) => typeof subject === "string";
	var checkPattern = (pattern) => pattern && isString(pattern) && !REGEX_TEST_BLANK_LINE.test(pattern) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern) && pattern.indexOf("#") !== 0;
	var splitPattern = (pattern) => pattern.split(REGEX_SPLITALL_CRLF).filter(Boolean);
	var IgnoreRule = class {
		constructor(pattern, mark, body, ignoreCase, negative, prefix) {
			this.pattern = pattern;
			this.mark = mark;
			this.negative = negative;
			define(this, "body", body);
			define(this, "ignoreCase", ignoreCase);
			define(this, "regexPrefix", prefix);
		}
		get regex() {
			const key = "_regex";
			if (this[key]) return this[key];
			return this._make(MODE_IGNORE, key);
		}
		get checkRegex() {
			const key = "_checkRegex";
			if (this[key]) return this[key];
			return this._make(MODE_CHECK_IGNORE, key);
		}
		_make(mode, key) {
			const str = this.regexPrefix.replace(REGEX_REPLACE_TRAILING_WILDCARD, TRAILING_WILD_CARD_REPLACERS[mode]);
			const regex = this.ignoreCase ? new RegExp(str, "i") : new RegExp(str);
			return define(this, key, regex);
		}
	};
	var createRule = ({ pattern, mark }, ignoreCase) => {
		let negative = false;
		let body = pattern;
		if (body.indexOf("!") === 0) {
			negative = true;
			body = body.substr(1);
		}
		body = body.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
		const regexPrefix = makeRegexPrefix(body);
		return new IgnoreRule(pattern, mark, body, ignoreCase, negative, regexPrefix);
	};
	var RuleManager = class {
		constructor(ignoreCase) {
			this._ignoreCase = ignoreCase;
			this._rules = [];
		}
		_add(pattern) {
			if (pattern && pattern[KEY_IGNORE]) {
				this._rules = this._rules.concat(pattern._rules._rules);
				this._added = true;
				return;
			}
			if (isString(pattern)) pattern = { pattern };
			if (checkPattern(pattern.pattern)) {
				const rule = createRule(pattern, this._ignoreCase);
				this._added = true;
				this._rules.push(rule);
			}
		}
		add(pattern) {
			this._added = false;
			makeArray(isString(pattern) ? splitPattern(pattern) : pattern).forEach(this._add, this);
			return this._added;
		}
		test(path, checkUnignored, mode) {
			let ignored = false;
			let unignored = false;
			let matchedRule;
			this._rules.forEach((rule) => {
				const { negative } = rule;
				if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) return;
				if (!rule[mode].test(path)) return;
				ignored = !negative;
				unignored = negative;
				matchedRule = negative ? UNDEFINED : rule;
			});
			const ret = {
				ignored,
				unignored
			};
			if (matchedRule) ret.rule = matchedRule;
			return ret;
		}
	};
	var throwError = (message, Ctor) => {
		throw new Ctor(message);
	};
	var checkPath = (path, originalPath, doThrow) => {
		if (!isString(path)) return doThrow(`path must be a string, but got \`${originalPath}\``, TypeError);
		if (!path) return doThrow(`path must not be empty`, TypeError);
		if (checkPath.isNotRelative(path)) return doThrow(`path should be a \`path.relative()\`d string, but got "${originalPath}"`, RangeError);
		return true;
	};
	var isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
	checkPath.isNotRelative = isNotRelative;
	/* istanbul ignore next */
	checkPath.convert = (p) => p;
	var Ignore = class {
		constructor({ ignorecase = true, ignoreCase = ignorecase, allowRelativePaths = false } = {}) {
			define(this, KEY_IGNORE, true);
			this._rules = new RuleManager(ignoreCase);
			this._strictPathCheck = !allowRelativePaths;
			this._initCache();
		}
		_initCache() {
			this._ignoreCache = Object.create(null);
			this._testCache = Object.create(null);
		}
		add(pattern) {
			if (this._rules.add(pattern)) this._initCache();
			return this;
		}
		addPattern(pattern) {
			return this.add(pattern);
		}
		_test(originalPath, cache, checkUnignored, slices) {
			const path = originalPath && checkPath.convert(originalPath);
			checkPath(path, originalPath, this._strictPathCheck ? throwError : RETURN_FALSE);
			return this._t(path, cache, checkUnignored, slices);
		}
		checkIgnore(path) {
			if (!REGEX_TEST_TRAILING_SLASH.test(path)) return this.test(path);
			const slices = path.split(SLASH).filter(Boolean);
			slices.pop();
			if (slices.length) {
				const parent = this._t(slices.join(SLASH) + SLASH, this._testCache, true, slices);
				if (parent.ignored) return parent;
			}
			return this._rules.test(path, false, MODE_CHECK_IGNORE);
		}
		_t(path, cache, checkUnignored, slices) {
			if (path in cache) return cache[path];
			if (!slices) slices = path.split(SLASH).filter(Boolean);
			slices.pop();
			if (!slices.length) return cache[path] = this._rules.test(path, checkUnignored, MODE_IGNORE);
			const parent = this._t(slices.join(SLASH) + SLASH, cache, checkUnignored, slices);
			return cache[path] = parent.ignored ? parent : this._rules.test(path, checkUnignored, MODE_IGNORE);
		}
		ignores(path) {
			return this._test(path, this._ignoreCache, false).ignored;
		}
		createFilter() {
			return (path) => !this.ignores(path);
		}
		filter(paths) {
			return makeArray(paths).filter(this.createFilter());
		}
		test(path) {
			return this._test(path, this._testCache, true);
		}
	};
	var factory = (options) => new Ignore(options);
	var isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
	/* istanbul ignore next */
	var setupWindows = () => {
		const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
		checkPath.convert = makePosix;
		const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
		checkPath.isNotRelative = (path) => REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
	};
	/* istanbul ignore next */
	if (typeof process !== "undefined" && process.platform === "win32") setupWindows();
	module.exports = factory;
	factory.default = factory;
	module.exports.isPathValid = isPathValid;
	define(module.exports, Symbol.for("setupWindows"), setupWindows);
})))();
//#endregion
//#region node_modules/universalify/index.js
var require_universalify = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	exports.fromCallback = function(fn) {
		return Object.defineProperty(function(...args) {
			if (typeof args[args.length - 1] === "function") fn.apply(this, args);
			else return new Promise((resolve, reject) => {
				fn.call(this, ...args, (err, res) => err != null ? reject(err) : resolve(res));
			});
		}, "name", { value: fn.name });
	};
	exports.fromPromise = function(fn) {
		return Object.defineProperty(function(...args) {
			const cb = args[args.length - 1];
			if (typeof cb !== "function") return fn.apply(this, args);
			else fn.apply(this, args.slice(0, -1)).then((r) => cb(null, r), cb);
		}, "name", { value: fn.name });
	};
}));
//#endregion
//#region node_modules/graceful-fs/polyfills.js
var require_polyfills = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var constants = require("constants");
	var origCwd = process.cwd;
	var cwd = null;
	var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		if (!cwd) cwd = origCwd.call(process);
		return cwd;
	};
	try {
		process.cwd();
	} catch (er) {}
	if (typeof process.chdir === "function") {
		var chdir = process.chdir;
		process.chdir = function(d) {
			cwd = null;
			chdir.call(process, d);
		};
		if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
	}
	module.exports = patch;
	function patch(fs) {
		if (constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) patchLchmod(fs);
		if (!fs.lutimes) patchLutimes(fs);
		fs.chown = chownFix(fs.chown);
		fs.fchown = chownFix(fs.fchown);
		fs.lchown = chownFix(fs.lchown);
		fs.chmod = chmodFix(fs.chmod);
		fs.fchmod = chmodFix(fs.fchmod);
		fs.lchmod = chmodFix(fs.lchmod);
		fs.chownSync = chownFixSync(fs.chownSync);
		fs.fchownSync = chownFixSync(fs.fchownSync);
		fs.lchownSync = chownFixSync(fs.lchownSync);
		fs.chmodSync = chmodFixSync(fs.chmodSync);
		fs.fchmodSync = chmodFixSync(fs.fchmodSync);
		fs.lchmodSync = chmodFixSync(fs.lchmodSync);
		fs.stat = statFix(fs.stat);
		fs.fstat = statFix(fs.fstat);
		fs.lstat = statFix(fs.lstat);
		fs.statSync = statFixSync(fs.statSync);
		fs.fstatSync = statFixSync(fs.fstatSync);
		fs.lstatSync = statFixSync(fs.lstatSync);
		if (fs.chmod && !fs.lchmod) {
			fs.lchmod = function(path, mode, cb) {
				if (cb) process.nextTick(cb);
			};
			fs.lchmodSync = function() {};
		}
		if (fs.chown && !fs.lchown) {
			fs.lchown = function(path, uid, gid, cb) {
				if (cb) process.nextTick(cb);
			};
			fs.lchownSync = function() {};
		}
		if (platform === "win32") fs.rename = typeof fs.rename !== "function" ? fs.rename : (function(fs$rename) {
			function rename(from, to, cb) {
				var start = Date.now();
				var backoff = 0;
				fs$rename(from, to, function CB(er) {
					if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
						setTimeout(function() {
							fs.stat(to, function(stater, st) {
								if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
								else cb(er);
							});
						}, backoff);
						if (backoff < 100) backoff += 10;
						return;
					}
					if (cb) cb(er);
				});
			}
			if (Object.setPrototypeOf) Object.setPrototypeOf(rename, fs$rename);
			return rename;
		})(fs.rename);
		fs.read = typeof fs.read !== "function" ? fs.read : (function(fs$read) {
			function read(fd, buffer, offset, length, position, callback_) {
				var callback;
				if (callback_ && typeof callback_ === "function") {
					var eagCounter = 0;
					callback = function(er, _, __) {
						if (er && er.code === "EAGAIN" && eagCounter < 10) {
							eagCounter++;
							return fs$read.call(fs, fd, buffer, offset, length, position, callback);
						}
						callback_.apply(this, arguments);
					};
				}
				return fs$read.call(fs, fd, buffer, offset, length, position, callback);
			}
			if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
			return read;
		})(fs.read);
		fs.readSync = typeof fs.readSync !== "function" ? fs.readSync : (function(fs$readSync) {
			return function(fd, buffer, offset, length, position) {
				var eagCounter = 0;
				while (true) try {
					return fs$readSync.call(fs, fd, buffer, offset, length, position);
				} catch (er) {
					if (er.code === "EAGAIN" && eagCounter < 10) {
						eagCounter++;
						continue;
					}
					throw er;
				}
			};
		})(fs.readSync);
		function patchLchmod(fs) {
			fs.lchmod = function(path, mode, callback) {
				fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
					if (err) {
						if (callback) callback(err);
						return;
					}
					fs.fchmod(fd, mode, function(err) {
						fs.close(fd, function(err2) {
							if (callback) callback(err || err2);
						});
					});
				});
			};
			fs.lchmodSync = function(path, mode) {
				var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
				var threw = true;
				var ret;
				try {
					ret = fs.fchmodSync(fd, mode);
					threw = false;
				} finally {
					if (threw) try {
						fs.closeSync(fd);
					} catch (er) {}
					else fs.closeSync(fd);
				}
				return ret;
			};
		}
		function patchLutimes(fs) {
			if (constants.hasOwnProperty("O_SYMLINK") && fs.futimes) {
				fs.lutimes = function(path, at, mt, cb) {
					fs.open(path, constants.O_SYMLINK, function(er, fd) {
						if (er) {
							if (cb) cb(er);
							return;
						}
						fs.futimes(fd, at, mt, function(er) {
							fs.close(fd, function(er2) {
								if (cb) cb(er || er2);
							});
						});
					});
				};
				fs.lutimesSync = function(path, at, mt) {
					var fd = fs.openSync(path, constants.O_SYMLINK);
					var ret;
					var threw = true;
					try {
						ret = fs.futimesSync(fd, at, mt);
						threw = false;
					} finally {
						if (threw) try {
							fs.closeSync(fd);
						} catch (er) {}
						else fs.closeSync(fd);
					}
					return ret;
				};
			} else if (fs.futimes) {
				fs.lutimes = function(_a, _b, _c, cb) {
					if (cb) process.nextTick(cb);
				};
				fs.lutimesSync = function() {};
			}
		}
		function chmodFix(orig) {
			if (!orig) return orig;
			return function(target, mode, cb) {
				return orig.call(fs, target, mode, function(er) {
					if (chownErOk(er)) er = null;
					if (cb) cb.apply(this, arguments);
				});
			};
		}
		function chmodFixSync(orig) {
			if (!orig) return orig;
			return function(target, mode) {
				try {
					return orig.call(fs, target, mode);
				} catch (er) {
					if (!chownErOk(er)) throw er;
				}
			};
		}
		function chownFix(orig) {
			if (!orig) return orig;
			return function(target, uid, gid, cb) {
				return orig.call(fs, target, uid, gid, function(er) {
					if (chownErOk(er)) er = null;
					if (cb) cb.apply(this, arguments);
				});
			};
		}
		function chownFixSync(orig) {
			if (!orig) return orig;
			return function(target, uid, gid) {
				try {
					return orig.call(fs, target, uid, gid);
				} catch (er) {
					if (!chownErOk(er)) throw er;
				}
			};
		}
		function statFix(orig) {
			if (!orig) return orig;
			return function(target, options, cb) {
				if (typeof options === "function") {
					cb = options;
					options = null;
				}
				function callback(er, stats) {
					if (stats) {
						if (stats.uid < 0) stats.uid += 4294967296;
						if (stats.gid < 0) stats.gid += 4294967296;
					}
					if (cb) cb.apply(this, arguments);
				}
				return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
			};
		}
		function statFixSync(orig) {
			if (!orig) return orig;
			return function(target, options) {
				var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
				if (stats) {
					if (stats.uid < 0) stats.uid += 4294967296;
					if (stats.gid < 0) stats.gid += 4294967296;
				}
				return stats;
			};
		}
		function chownErOk(er) {
			if (!er) return true;
			if (er.code === "ENOSYS") return true;
			if (!process.getuid || process.getuid() !== 0) {
				if (er.code === "EINVAL" || er.code === "EPERM") return true;
			}
			return false;
		}
	}
}));
//#endregion
//#region node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var Stream = require("stream").Stream;
	module.exports = legacy;
	function legacy(fs) {
		return {
			ReadStream,
			WriteStream
		};
		function ReadStream(path, options) {
			if (!(this instanceof ReadStream)) return new ReadStream(path, options);
			Stream.call(this);
			var self = this;
			this.path = path;
			this.fd = null;
			this.readable = true;
			this.paused = false;
			this.flags = "r";
			this.mode = 438;
			this.bufferSize = 64 * 1024;
			options = options || {};
			var keys = Object.keys(options);
			for (var index = 0, length = keys.length; index < length; index++) {
				var key = keys[index];
				this[key] = options[key];
			}
			if (this.encoding) this.setEncoding(this.encoding);
			if (this.start !== void 0) {
				if ("number" !== typeof this.start) throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if ("number" !== typeof this.end) throw TypeError("end must be a Number");
				if (this.start > this.end) throw new Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					self._read();
				});
				return;
			}
			fs.open(this.path, this.flags, this.mode, function(err, fd) {
				if (err) {
					self.emit("error", err);
					self.readable = false;
					return;
				}
				self.fd = fd;
				self.emit("open", fd);
				self._read();
			});
		}
		function WriteStream(path, options) {
			if (!(this instanceof WriteStream)) return new WriteStream(path, options);
			Stream.call(this);
			this.path = path;
			this.fd = null;
			this.writable = true;
			this.flags = "w";
			this.encoding = "binary";
			this.mode = 438;
			this.bytesWritten = 0;
			options = options || {};
			var keys = Object.keys(options);
			for (var index = 0, length = keys.length; index < length; index++) {
				var key = keys[index];
				this[key] = options[key];
			}
			if (this.start !== void 0) {
				if ("number" !== typeof this.start) throw TypeError("start must be a Number");
				if (this.start < 0) throw new Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = false;
			this._queue = [];
			if (this.fd === null) {
				this._open = fs.open;
				this._queue.push([
					this._open,
					this.path,
					this.flags,
					this.mode,
					void 0
				]);
				this.flush();
			}
		}
	}
}));
//#endregion
//#region node_modules/graceful-fs/clone.js
var require_clone = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	module.exports = clone;
	var getPrototypeOf = Object.getPrototypeOf || function(obj) {
		return obj.__proto__;
	};
	function clone(obj) {
		if (obj === null || typeof obj !== "object") return obj;
		if (obj instanceof Object) var copy = { __proto__: getPrototypeOf(obj) };
		else var copy = Object.create(null);
		Object.getOwnPropertyNames(obj).forEach(function(key) {
			Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
		});
		return copy;
	}
}));
//#endregion
//#region node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs$1 = require("fs");
	var polyfills = require_polyfills();
	var legacy = require_legacy_streams();
	var clone = require_clone();
	var util$5 = require("util");
	/* istanbul ignore next - node 0.x polyfill */
	var gracefulQueue;
	var previousSymbol;
	/* istanbul ignore else - node 0.x polyfill */
	if (typeof Symbol === "function" && typeof Symbol.for === "function") {
		gracefulQueue = Symbol.for("graceful-fs.queue");
		previousSymbol = Symbol.for("graceful-fs.previous");
	} else {
		gracefulQueue = "___graceful-fs.queue";
		previousSymbol = "___graceful-fs.previous";
	}
	function noop() {}
	function publishQueue(context, queue) {
		Object.defineProperty(context, gracefulQueue, { get: function() {
			return queue;
		} });
	}
	var debug = noop;
	if (util$5.debuglog) debug = util$5.debuglog("gfs4");
	else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) debug = function() {
		var m = util$5.format.apply(util$5, arguments);
		m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
		console.error(m);
	};
	if (!fs$1[gracefulQueue]) {
		publishQueue(fs$1, global[gracefulQueue] || []);
		fs$1.close = (function(fs$close) {
			function close(fd, cb) {
				return fs$close.call(fs$1, fd, function(err) {
					if (!err) resetQueue();
					if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
			Object.defineProperty(close, previousSymbol, { value: fs$close });
			return close;
		})(fs$1.close);
		fs$1.closeSync = (function(fs$closeSync) {
			function closeSync(fd) {
				fs$closeSync.apply(fs$1, arguments);
				resetQueue();
			}
			Object.defineProperty(closeSync, previousSymbol, { value: fs$closeSync });
			return closeSync;
		})(fs$1.closeSync);
		if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) process.on("exit", function() {
			debug(fs$1[gracefulQueue]);
			require("assert").equal(fs$1[gracefulQueue].length, 0);
		});
	}
	if (!global[gracefulQueue]) publishQueue(global, fs$1[gracefulQueue]);
	module.exports = patch(clone(fs$1));
	if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs$1.__patched) {
		module.exports = patch(fs$1);
		fs$1.__patched = true;
	}
	function patch(fs$6) {
		polyfills(fs$6);
		fs$6.gracefulify = patch;
		fs$6.createReadStream = createReadStream;
		fs$6.createWriteStream = createWriteStream;
		var fs$readFile = fs$6.readFile;
		fs$6.readFile = readFile;
		function readFile(path, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$readFile(path, options, cb);
			function go$readFile(path, options, cb, startTime) {
				return fs$readFile(path, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$readFile,
						[
							path,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$writeFile = fs$6.writeFile;
		fs$6.writeFile = writeFile;
		function writeFile(path, data, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$writeFile(path, data, options, cb);
			function go$writeFile(path, data, options, cb, startTime) {
				return fs$writeFile(path, data, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$writeFile,
						[
							path,
							data,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$appendFile = fs$6.appendFile;
		if (fs$appendFile) fs$6.appendFile = appendFile;
		function appendFile(path, data, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			return go$appendFile(path, data, options, cb);
			function go$appendFile(path, data, options, cb, startTime) {
				return fs$appendFile(path, data, options, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$appendFile,
						[
							path,
							data,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$copyFile = fs$6.copyFile;
		if (fs$copyFile) fs$6.copyFile = copyFile;
		function copyFile(src, dest, flags, cb) {
			if (typeof flags === "function") {
				cb = flags;
				flags = 0;
			}
			return go$copyFile(src, dest, flags, cb);
			function go$copyFile(src, dest, flags, cb, startTime) {
				return fs$copyFile(src, dest, flags, function(err) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$copyFile,
						[
							src,
							dest,
							flags,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		var fs$readdir = fs$6.readdir;
		fs$6.readdir = readdir;
		var noReaddirOptionVersions = /^v[0-5]\./;
		function readdir(path, options, cb) {
			if (typeof options === "function") cb = options, options = null;
			var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir(path, options, cb, startTime) {
				return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
			} : function go$readdir(path, options, cb, startTime) {
				return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
			};
			return go$readdir(path, options, cb);
			function fs$readdirCallback(path, options, cb, startTime) {
				return function(err, files) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$readdir,
						[
							path,
							options,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else {
						if (files && files.sort) files.sort();
						if (typeof cb === "function") cb.call(this, err, files);
					}
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var legStreams = legacy(fs$6);
			ReadStream = legStreams.ReadStream;
			WriteStream = legStreams.WriteStream;
		}
		var fs$ReadStream = fs$6.ReadStream;
		if (fs$ReadStream) {
			ReadStream.prototype = Object.create(fs$ReadStream.prototype);
			ReadStream.prototype.open = ReadStream$open;
		}
		var fs$WriteStream = fs$6.WriteStream;
		if (fs$WriteStream) {
			WriteStream.prototype = Object.create(fs$WriteStream.prototype);
			WriteStream.prototype.open = WriteStream$open;
		}
		Object.defineProperty(fs$6, "ReadStream", {
			get: function() {
				return ReadStream;
			},
			set: function(val) {
				ReadStream = val;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(fs$6, "WriteStream", {
			get: function() {
				return WriteStream;
			},
			set: function(val) {
				WriteStream = val;
			},
			enumerable: true,
			configurable: true
		});
		var FileReadStream = ReadStream;
		Object.defineProperty(fs$6, "FileReadStream", {
			get: function() {
				return FileReadStream;
			},
			set: function(val) {
				FileReadStream = val;
			},
			enumerable: true,
			configurable: true
		});
		var FileWriteStream = WriteStream;
		Object.defineProperty(fs$6, "FileWriteStream", {
			get: function() {
				return FileWriteStream;
			},
			set: function(val) {
				FileWriteStream = val;
			},
			enumerable: true,
			configurable: true
		});
		function ReadStream(path, options) {
			if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
			else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
		}
		function ReadStream$open() {
			var that = this;
			open(that.path, that.flags, that.mode, function(err, fd) {
				if (err) {
					if (that.autoClose) that.destroy();
					that.emit("error", err);
				} else {
					that.fd = fd;
					that.emit("open", fd);
					that.read();
				}
			});
		}
		function WriteStream(path, options) {
			if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
			else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
		}
		function WriteStream$open() {
			var that = this;
			open(that.path, that.flags, that.mode, function(err, fd) {
				if (err) {
					that.destroy();
					that.emit("error", err);
				} else {
					that.fd = fd;
					that.emit("open", fd);
				}
			});
		}
		function createReadStream(path, options) {
			return new fs$6.ReadStream(path, options);
		}
		function createWriteStream(path, options) {
			return new fs$6.WriteStream(path, options);
		}
		var fs$open = fs$6.open;
		fs$6.open = open;
		function open(path, flags, mode, cb) {
			if (typeof mode === "function") cb = mode, mode = null;
			return go$open(path, flags, mode, cb);
			function go$open(path, flags, mode, cb, startTime) {
				return fs$open(path, flags, mode, function(err, fd) {
					if (err && (err.code === "EMFILE" || err.code === "ENFILE")) enqueue([
						go$open,
						[
							path,
							flags,
							mode,
							cb
						],
						err,
						startTime || Date.now(),
						Date.now()
					]);
					else if (typeof cb === "function") cb.apply(this, arguments);
				});
			}
		}
		return fs$6;
	}
	function enqueue(elem) {
		debug("ENQUEUE", elem[0].name, elem[1]);
		fs$1[gracefulQueue].push(elem);
		retry();
	}
	var retryTimer;
	function resetQueue() {
		var now = Date.now();
		for (var i = 0; i < fs$1[gracefulQueue].length; ++i) if (fs$1[gracefulQueue][i].length > 2) {
			fs$1[gracefulQueue][i][3] = now;
			fs$1[gracefulQueue][i][4] = now;
		}
		retry();
	}
	function retry() {
		clearTimeout(retryTimer);
		retryTimer = void 0;
		if (fs$1[gracefulQueue].length === 0) return;
		var elem = fs$1[gracefulQueue].shift();
		var fn = elem[0];
		var args = elem[1];
		var err = elem[2];
		var startTime = elem[3];
		var lastTime = elem[4];
		if (startTime === void 0) {
			debug("RETRY", fn.name, args);
			fn.apply(null, args);
		} else if (Date.now() - startTime >= 6e4) {
			debug("TIMEOUT", fn.name, args);
			var cb = args.pop();
			if (typeof cb === "function") cb.call(null, err);
		} else {
			var sinceAttempt = Date.now() - lastTime;
			var sinceStart = Math.max(lastTime - startTime, 1);
			if (sinceAttempt >= Math.min(sinceStart * 1.2, 100)) {
				debug("RETRY", fn.name, args);
				fn.apply(null, args.concat([startTime]));
			} else fs$1[gracefulQueue].push(elem);
		}
		if (retryTimer === void 0) retryTimer = setTimeout(retry, 0);
	}
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/fs/index.js
var require_fs$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var u = require_universalify().fromCallback;
	var fs = require_graceful_fs();
	var api = [
		"access",
		"appendFile",
		"chmod",
		"chown",
		"close",
		"copyFile",
		"fchmod",
		"fchown",
		"fdatasync",
		"fstat",
		"fsync",
		"ftruncate",
		"futimes",
		"lchmod",
		"lchown",
		"link",
		"lstat",
		"mkdir",
		"mkdtemp",
		"open",
		"opendir",
		"readdir",
		"readFile",
		"readlink",
		"realpath",
		"rename",
		"rm",
		"rmdir",
		"stat",
		"symlink",
		"truncate",
		"unlink",
		"utimes",
		"writeFile"
	].filter((key) => {
		return typeof fs[key] === "function";
	});
	Object.assign(exports, fs);
	api.forEach((method) => {
		exports[method] = u(fs[method]);
	});
	exports.exists = function(filename, callback) {
		if (typeof callback === "function") return fs.exists(filename, callback);
		return new Promise((resolve) => {
			return fs.exists(filename, resolve);
		});
	};
	exports.read = function(fd, buffer, offset, length, position, callback) {
		if (typeof callback === "function") return fs.read(fd, buffer, offset, length, position, callback);
		return new Promise((resolve, reject) => {
			fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
				if (err) return reject(err);
				resolve({
					bytesRead,
					buffer
				});
			});
		});
	};
	exports.write = function(fd, buffer, ...args) {
		if (typeof args[args.length - 1] === "function") return fs.write(fd, buffer, ...args);
		return new Promise((resolve, reject) => {
			fs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
				if (err) return reject(err);
				resolve({
					bytesWritten,
					buffer
				});
			});
		});
	};
	if (typeof fs.writev === "function") exports.writev = function(fd, buffers, ...args) {
		if (typeof args[args.length - 1] === "function") return fs.writev(fd, buffers, ...args);
		return new Promise((resolve, reject) => {
			fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {
				if (err) return reject(err);
				resolve({
					bytesWritten,
					buffers
				});
			});
		});
	};
	if (typeof fs.realpath.native === "function") exports.realpath.native = u(fs.realpath.native);
	else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils$2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var path$28 = require("path");
	module.exports.checkPath = function checkPath(pth) {
		if (process.platform === "win32") {
			if (/[<>:"|?*]/.test(pth.replace(path$28.parse(pth).root, ""))) {
				const error = /* @__PURE__ */ new Error(`Path contains invalid characters: ${pth}`);
				error.code = "EINVAL";
				throw error;
			}
		}
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_fs$1();
	var { checkPath } = require_utils$2();
	var getMode = (options) => {
		const defaults = { mode: 511 };
		if (typeof options === "number") return options;
		return {
			...defaults,
			...options
		}.mode;
	};
	module.exports.makeDir = async (dir, options) => {
		checkPath(dir);
		return fs.mkdir(dir, {
			mode: getMode(options),
			recursive: true
		});
	};
	module.exports.makeDirSync = (dir, options) => {
		checkPath(dir);
		return fs.mkdirSync(dir, {
			mode: getMode(options),
			recursive: true
		});
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var { makeDir: _makeDir, makeDirSync } = require_make_dir$1();
	var makeDir = u(_makeDir);
	module.exports = {
		mkdirs: makeDir,
		mkdirsSync: makeDirSync,
		mkdirp: makeDir,
		mkdirpSync: makeDirSync,
		ensureDir: makeDir,
		ensureDirSync: makeDirSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var fs = require_fs$1();
	function pathExists(path) {
		return fs.access(path).then(() => true).catch(() => false);
	}
	module.exports = {
		pathExists: u(pathExists),
		pathExistsSync: fs.existsSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/util/utimes.js
var require_utimes$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	function utimesMillis(path, atime, mtime, callback) {
		fs.open(path, "r+", (err, fd) => {
			if (err) return callback(err);
			fs.futimes(fd, atime, mtime, (futimesErr) => {
				fs.close(fd, (closeErr) => {
					if (callback) callback(futimesErr || closeErr);
				});
			});
		});
	}
	function utimesMillisSync(path, atime, mtime) {
		const fd = fs.openSync(path, "r+");
		fs.futimesSync(fd, atime, mtime);
		return fs.closeSync(fd);
	}
	module.exports = {
		utimesMillis,
		utimesMillisSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/util/stat.js
var require_stat$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_fs$1();
	var path$27 = require("path");
	var util$4 = require("util");
	function getStats(src, dest, opts) {
		const statFunc = opts.dereference ? (file) => fs.stat(file, { bigint: true }) : (file) => fs.lstat(file, { bigint: true });
		return Promise.all([statFunc(src), statFunc(dest).catch((err) => {
			if (err.code === "ENOENT") return null;
			throw err;
		})]).then(([srcStat, destStat]) => ({
			srcStat,
			destStat
		}));
	}
	function getStatsSync(src, dest, opts) {
		let destStat;
		const statFunc = opts.dereference ? (file) => fs.statSync(file, { bigint: true }) : (file) => fs.lstatSync(file, { bigint: true });
		const srcStat = statFunc(src);
		try {
			destStat = statFunc(dest);
		} catch (err) {
			if (err.code === "ENOENT") return {
				srcStat,
				destStat: null
			};
			throw err;
		}
		return {
			srcStat,
			destStat
		};
	}
	function checkPaths(src, dest, funcName, opts, cb) {
		util$4.callbackify(getStats)(src, dest, opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, destStat } = stats;
			if (destStat) {
				if (areIdentical(srcStat, destStat)) {
					const srcBaseName = path$27.basename(src);
					const destBaseName = path$27.basename(dest);
					if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return cb(null, {
						srcStat,
						destStat,
						isChangingCase: true
					});
					return cb(/* @__PURE__ */ new Error("Source and destination must not be the same."));
				}
				if (srcStat.isDirectory() && !destStat.isDirectory()) return cb(/* @__PURE__ */ new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
				if (!srcStat.isDirectory() && destStat.isDirectory()) return cb(/* @__PURE__ */ new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
			}
			if (srcStat.isDirectory() && isSrcSubdir(src, dest)) return cb(new Error(errMsg(src, dest, funcName)));
			return cb(null, {
				srcStat,
				destStat
			});
		});
	}
	function checkPathsSync(src, dest, funcName, opts) {
		const { srcStat, destStat } = getStatsSync(src, dest, opts);
		if (destStat) {
			if (areIdentical(srcStat, destStat)) {
				const srcBaseName = path$27.basename(src);
				const destBaseName = path$27.basename(dest);
				if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return {
					srcStat,
					destStat,
					isChangingCase: true
				};
				throw new Error("Source and destination must not be the same.");
			}
			if (srcStat.isDirectory() && !destStat.isDirectory()) throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
			if (!srcStat.isDirectory() && destStat.isDirectory()) throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
		}
		if (srcStat.isDirectory() && isSrcSubdir(src, dest)) throw new Error(errMsg(src, dest, funcName));
		return {
			srcStat,
			destStat
		};
	}
	function checkParentPaths(src, srcStat, dest, funcName, cb) {
		const srcParent = path$27.resolve(path$27.dirname(src));
		const destParent = path$27.resolve(path$27.dirname(dest));
		if (destParent === srcParent || destParent === path$27.parse(destParent).root) return cb();
		fs.stat(destParent, { bigint: true }, (err, destStat) => {
			if (err) {
				if (err.code === "ENOENT") return cb();
				return cb(err);
			}
			if (areIdentical(srcStat, destStat)) return cb(new Error(errMsg(src, dest, funcName)));
			return checkParentPaths(src, srcStat, destParent, funcName, cb);
		});
	}
	function checkParentPathsSync(src, srcStat, dest, funcName) {
		const srcParent = path$27.resolve(path$27.dirname(src));
		const destParent = path$27.resolve(path$27.dirname(dest));
		if (destParent === srcParent || destParent === path$27.parse(destParent).root) return;
		let destStat;
		try {
			destStat = fs.statSync(destParent, { bigint: true });
		} catch (err) {
			if (err.code === "ENOENT") return;
			throw err;
		}
		if (areIdentical(srcStat, destStat)) throw new Error(errMsg(src, dest, funcName));
		return checkParentPathsSync(src, srcStat, destParent, funcName);
	}
	function areIdentical(srcStat, destStat) {
		return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
	}
	function isSrcSubdir(src, dest) {
		const srcArr = path$27.resolve(src).split(path$27.sep).filter((i) => i);
		const destArr = path$27.resolve(dest).split(path$27.sep).filter((i) => i);
		return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
	}
	function errMsg(src, dest, funcName) {
		return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
	}
	module.exports = {
		checkPaths,
		checkPathsSync,
		checkParentPaths,
		checkParentPathsSync,
		isSrcSubdir,
		areIdentical
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/copy/copy.js
var require_copy$3 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$26 = require("path");
	var mkdirs = require_mkdirs$1().mkdirs;
	var pathExists = require_path_exists$1().pathExists;
	var utimesMillis = require_utimes$1().utimesMillis;
	var stat = require_stat$1();
	function copy(src, dest, opts, cb) {
		if (typeof opts === "function" && !cb) {
			cb = opts;
			opts = {};
		} else if (typeof opts === "function") opts = { filter: opts };
		cb = cb || function() {};
		opts = opts || {};
		opts.clobber = "clobber" in opts ? !!opts.clobber : true;
		opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
		if (opts.preserveTimestamps && process.arch === "ia32") process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
		stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, destStat } = stats;
			stat.checkParentPaths(src, srcStat, dest, "copy", (err) => {
				if (err) return cb(err);
				if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
				return checkParentDir(destStat, src, dest, opts, cb);
			});
		});
	}
	function checkParentDir(destStat, src, dest, opts, cb) {
		const destParent = path$26.dirname(dest);
		pathExists(destParent, (err, dirExists) => {
			if (err) return cb(err);
			if (dirExists) return getStats(destStat, src, dest, opts, cb);
			mkdirs(destParent, (err) => {
				if (err) return cb(err);
				return getStats(destStat, src, dest, opts, cb);
			});
		});
	}
	function handleFilter(onInclude, destStat, src, dest, opts, cb) {
		Promise.resolve(opts.filter(src, dest)).then((include) => {
			if (include) return onInclude(destStat, src, dest, opts, cb);
			return cb();
		}, (error) => cb(error));
	}
	function startCopy(destStat, src, dest, opts, cb) {
		if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
		return getStats(destStat, src, dest, opts, cb);
	}
	function getStats(destStat, src, dest, opts, cb) {
		(opts.dereference ? fs.stat : fs.lstat)(src, (err, srcStat) => {
			if (err) return cb(err);
			if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
			else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
			else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
			else if (srcStat.isSocket()) return cb(/* @__PURE__ */ new Error(`Cannot copy a socket file: ${src}`));
			else if (srcStat.isFIFO()) return cb(/* @__PURE__ */ new Error(`Cannot copy a FIFO pipe: ${src}`));
			return cb(/* @__PURE__ */ new Error(`Unknown file: ${src}`));
		});
	}
	function onFile(srcStat, destStat, src, dest, opts, cb) {
		if (!destStat) return copyFile(srcStat, src, dest, opts, cb);
		return mayCopyFile(srcStat, src, dest, opts, cb);
	}
	function mayCopyFile(srcStat, src, dest, opts, cb) {
		if (opts.overwrite) fs.unlink(dest, (err) => {
			if (err) return cb(err);
			return copyFile(srcStat, src, dest, opts, cb);
		});
		else if (opts.errorOnExist) return cb(/* @__PURE__ */ new Error(`'${dest}' already exists`));
		else return cb();
	}
	function copyFile(srcStat, src, dest, opts, cb) {
		fs.copyFile(src, dest, (err) => {
			if (err) return cb(err);
			if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
			return setDestMode(dest, srcStat.mode, cb);
		});
	}
	function handleTimestampsAndMode(srcMode, src, dest, cb) {
		if (fileIsNotWritable(srcMode)) return makeFileWritable(dest, srcMode, (err) => {
			if (err) return cb(err);
			return setDestTimestampsAndMode(srcMode, src, dest, cb);
		});
		return setDestTimestampsAndMode(srcMode, src, dest, cb);
	}
	function fileIsNotWritable(srcMode) {
		return (srcMode & 128) === 0;
	}
	function makeFileWritable(dest, srcMode, cb) {
		return setDestMode(dest, srcMode | 128, cb);
	}
	function setDestTimestampsAndMode(srcMode, src, dest, cb) {
		setDestTimestamps(src, dest, (err) => {
			if (err) return cb(err);
			return setDestMode(dest, srcMode, cb);
		});
	}
	function setDestMode(dest, srcMode, cb) {
		return fs.chmod(dest, srcMode, cb);
	}
	function setDestTimestamps(src, dest, cb) {
		fs.stat(src, (err, updatedSrcStat) => {
			if (err) return cb(err);
			return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
		});
	}
	function onDir(srcStat, destStat, src, dest, opts, cb) {
		if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
		return copyDir(src, dest, opts, cb);
	}
	function mkDirAndCopy(srcMode, src, dest, opts, cb) {
		fs.mkdir(dest, (err) => {
			if (err) return cb(err);
			copyDir(src, dest, opts, (err) => {
				if (err) return cb(err);
				return setDestMode(dest, srcMode, cb);
			});
		});
	}
	function copyDir(src, dest, opts, cb) {
		fs.readdir(src, (err, items) => {
			if (err) return cb(err);
			return copyDirItems(items, src, dest, opts, cb);
		});
	}
	function copyDirItems(items, src, dest, opts, cb) {
		const item = items.pop();
		if (!item) return cb();
		return copyDirItem(items, item, src, dest, opts, cb);
	}
	function copyDirItem(items, item, src, dest, opts, cb) {
		const srcItem = path$26.join(src, item);
		const destItem = path$26.join(dest, item);
		stat.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
			if (err) return cb(err);
			const { destStat } = stats;
			startCopy(destStat, srcItem, destItem, opts, (err) => {
				if (err) return cb(err);
				return copyDirItems(items, src, dest, opts, cb);
			});
		});
	}
	function onLink(destStat, src, dest, opts, cb) {
		fs.readlink(src, (err, resolvedSrc) => {
			if (err) return cb(err);
			if (opts.dereference) resolvedSrc = path$26.resolve(process.cwd(), resolvedSrc);
			if (!destStat) return fs.symlink(resolvedSrc, dest, cb);
			else fs.readlink(dest, (err, resolvedDest) => {
				if (err) {
					if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlink(resolvedSrc, dest, cb);
					return cb(err);
				}
				if (opts.dereference) resolvedDest = path$26.resolve(process.cwd(), resolvedDest);
				if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) return cb(/* @__PURE__ */ new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
				if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) return cb(/* @__PURE__ */ new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
				return copyLink(resolvedSrc, dest, cb);
			});
		});
	}
	function copyLink(resolvedSrc, dest, cb) {
		fs.unlink(dest, (err) => {
			if (err) return cb(err);
			return fs.symlink(resolvedSrc, dest, cb);
		});
	}
	module.exports = copy;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$25 = require("path");
	var mkdirsSync = require_mkdirs$1().mkdirsSync;
	var utimesMillisSync = require_utimes$1().utimesMillisSync;
	var stat = require_stat$1();
	function copySync(src, dest, opts) {
		if (typeof opts === "function") opts = { filter: opts };
		opts = opts || {};
		opts.clobber = "clobber" in opts ? !!opts.clobber : true;
		opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
		if (opts.preserveTimestamps && process.arch === "ia32") process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
		stat.checkParentPathsSync(src, srcStat, dest, "copy");
		return handleFilterAndCopy(destStat, src, dest, opts);
	}
	function handleFilterAndCopy(destStat, src, dest, opts) {
		if (opts.filter && !opts.filter(src, dest)) return;
		const destParent = path$25.dirname(dest);
		if (!fs.existsSync(destParent)) mkdirsSync(destParent);
		return getStats(destStat, src, dest, opts);
	}
	function startCopy(destStat, src, dest, opts) {
		if (opts.filter && !opts.filter(src, dest)) return;
		return getStats(destStat, src, dest, opts);
	}
	function getStats(destStat, src, dest, opts) {
		const srcStat = (opts.dereference ? fs.statSync : fs.lstatSync)(src);
		if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
		else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
		else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
		else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
		else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
		throw new Error(`Unknown file: ${src}`);
	}
	function onFile(srcStat, destStat, src, dest, opts) {
		if (!destStat) return copyFile(srcStat, src, dest, opts);
		return mayCopyFile(srcStat, src, dest, opts);
	}
	function mayCopyFile(srcStat, src, dest, opts) {
		if (opts.overwrite) {
			fs.unlinkSync(dest);
			return copyFile(srcStat, src, dest, opts);
		} else if (opts.errorOnExist) throw new Error(`'${dest}' already exists`);
	}
	function copyFile(srcStat, src, dest, opts) {
		fs.copyFileSync(src, dest);
		if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
		return setDestMode(dest, srcStat.mode);
	}
	function handleTimestamps(srcMode, src, dest) {
		if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
		return setDestTimestamps(src, dest);
	}
	function fileIsNotWritable(srcMode) {
		return (srcMode & 128) === 0;
	}
	function makeFileWritable(dest, srcMode) {
		return setDestMode(dest, srcMode | 128);
	}
	function setDestMode(dest, srcMode) {
		return fs.chmodSync(dest, srcMode);
	}
	function setDestTimestamps(src, dest) {
		const updatedSrcStat = fs.statSync(src);
		return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
	}
	function onDir(srcStat, destStat, src, dest, opts) {
		if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
		return copyDir(src, dest, opts);
	}
	function mkDirAndCopy(srcMode, src, dest, opts) {
		fs.mkdirSync(dest);
		copyDir(src, dest, opts);
		return setDestMode(dest, srcMode);
	}
	function copyDir(src, dest, opts) {
		fs.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
	}
	function copyDirItem(item, src, dest, opts) {
		const srcItem = path$25.join(src, item);
		const destItem = path$25.join(dest, item);
		const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
		return startCopy(destStat, srcItem, destItem, opts);
	}
	function onLink(destStat, src, dest, opts) {
		let resolvedSrc = fs.readlinkSync(src);
		if (opts.dereference) resolvedSrc = path$25.resolve(process.cwd(), resolvedSrc);
		if (!destStat) return fs.symlinkSync(resolvedSrc, dest);
		else {
			let resolvedDest;
			try {
				resolvedDest = fs.readlinkSync(dest);
			} catch (err) {
				if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlinkSync(resolvedSrc, dest);
				throw err;
			}
			if (opts.dereference) resolvedDest = path$25.resolve(process.cwd(), resolvedDest);
			if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
			if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
			return copyLink(resolvedSrc, dest);
		}
	}
	function copyLink(resolvedSrc, dest) {
		fs.unlinkSync(dest);
		return fs.symlinkSync(resolvedSrc, dest);
	}
	module.exports = copySync;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/copy/index.js
var require_copy$2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	module.exports = {
		copy: u(require_copy$3()),
		copySync: require_copy_sync$1()
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$24 = require("path");
	var assert$1 = require("assert");
	var isWindows = process.platform === "win32";
	function defaults(options) {
		[
			"unlink",
			"chmod",
			"stat",
			"lstat",
			"rmdir",
			"readdir"
		].forEach((m) => {
			options[m] = options[m] || fs[m];
			m = m + "Sync";
			options[m] = options[m] || fs[m];
		});
		options.maxBusyTries = options.maxBusyTries || 3;
	}
	function rimraf(p, options, cb) {
		let busyTries = 0;
		if (typeof options === "function") {
			cb = options;
			options = {};
		}
		assert$1(p, "rimraf: missing path");
		assert$1.strictEqual(typeof p, "string", "rimraf: path should be a string");
		assert$1.strictEqual(typeof cb, "function", "rimraf: callback function required");
		assert$1(options, "rimraf: invalid options argument provided");
		assert$1.strictEqual(typeof options, "object", "rimraf: options should be object");
		defaults(options);
		rimraf_(p, options, function CB(er) {
			if (er) {
				if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
					busyTries++;
					const time = busyTries * 100;
					return setTimeout(() => rimraf_(p, options, CB), time);
				}
				if (er.code === "ENOENT") er = null;
			}
			cb(er);
		});
	}
	function rimraf_(p, options, cb) {
		assert$1(p);
		assert$1(options);
		assert$1(typeof cb === "function");
		options.lstat(p, (er, st) => {
			if (er && er.code === "ENOENT") return cb(null);
			if (er && er.code === "EPERM" && isWindows) return fixWinEPERM(p, options, er, cb);
			if (st && st.isDirectory()) return rmdir(p, options, er, cb);
			options.unlink(p, (er) => {
				if (er) {
					if (er.code === "ENOENT") return cb(null);
					if (er.code === "EPERM") return isWindows ? fixWinEPERM(p, options, er, cb) : rmdir(p, options, er, cb);
					if (er.code === "EISDIR") return rmdir(p, options, er, cb);
				}
				return cb(er);
			});
		});
	}
	function fixWinEPERM(p, options, er, cb) {
		assert$1(p);
		assert$1(options);
		assert$1(typeof cb === "function");
		options.chmod(p, 438, (er2) => {
			if (er2) cb(er2.code === "ENOENT" ? null : er);
			else options.stat(p, (er3, stats) => {
				if (er3) cb(er3.code === "ENOENT" ? null : er);
				else if (stats.isDirectory()) rmdir(p, options, er, cb);
				else options.unlink(p, cb);
			});
		});
	}
	function fixWinEPERMSync(p, options, er) {
		let stats;
		assert$1(p);
		assert$1(options);
		try {
			options.chmodSync(p, 438);
		} catch (er2) {
			if (er2.code === "ENOENT") return;
			else throw er;
		}
		try {
			stats = options.statSync(p);
		} catch (er3) {
			if (er3.code === "ENOENT") return;
			else throw er;
		}
		if (stats.isDirectory()) rmdirSync(p, options, er);
		else options.unlinkSync(p);
	}
	function rmdir(p, options, originalEr, cb) {
		assert$1(p);
		assert$1(options);
		assert$1(typeof cb === "function");
		options.rmdir(p, (er) => {
			if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) rmkids(p, options, cb);
			else if (er && er.code === "ENOTDIR") cb(originalEr);
			else cb(er);
		});
	}
	function rmkids(p, options, cb) {
		assert$1(p);
		assert$1(options);
		assert$1(typeof cb === "function");
		options.readdir(p, (er, files) => {
			if (er) return cb(er);
			let n = files.length;
			let errState;
			if (n === 0) return options.rmdir(p, cb);
			files.forEach((f) => {
				rimraf(path$24.join(p, f), options, (er) => {
					if (errState) return;
					if (er) return cb(errState = er);
					if (--n === 0) options.rmdir(p, cb);
				});
			});
		});
	}
	function rimrafSync(p, options) {
		let st;
		options = options || {};
		defaults(options);
		assert$1(p, "rimraf: missing path");
		assert$1.strictEqual(typeof p, "string", "rimraf: path should be a string");
		assert$1(options, "rimraf: missing options");
		assert$1.strictEqual(typeof options, "object", "rimraf: options should be object");
		try {
			st = options.lstatSync(p);
		} catch (er) {
			if (er.code === "ENOENT") return;
			if (er.code === "EPERM" && isWindows) fixWinEPERMSync(p, options, er);
		}
		try {
			if (st && st.isDirectory()) rmdirSync(p, options, null);
			else options.unlinkSync(p);
		} catch (er) {
			if (er.code === "ENOENT") return;
			else if (er.code === "EPERM") return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
			else if (er.code !== "EISDIR") throw er;
			rmdirSync(p, options, er);
		}
	}
	function rmdirSync(p, options, originalEr) {
		assert$1(p);
		assert$1(options);
		try {
			options.rmdirSync(p);
		} catch (er) {
			if (er.code === "ENOTDIR") throw originalEr;
			else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") rmkidsSync(p, options);
			else if (er.code !== "ENOENT") throw er;
		}
	}
	function rmkidsSync(p, options) {
		assert$1(p);
		assert$1(options);
		options.readdirSync(p).forEach((f) => rimrafSync(path$24.join(p, f), options));
		if (isWindows) {
			const startTime = Date.now();
			do
				try {
					return options.rmdirSync(p, options);
				} catch {}
			while (Date.now() - startTime < 500);
		} else return options.rmdirSync(p, options);
	}
	module.exports = rimraf;
	rimraf.sync = rimrafSync;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/remove/index.js
var require_remove$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var u = require_universalify().fromCallback;
	var rimraf = require_rimraf$1();
	function remove(path, callback) {
		if (fs.rm) return fs.rm(path, {
			recursive: true,
			force: true
		}, callback);
		rimraf(path, callback);
	}
	function removeSync(path) {
		if (fs.rmSync) return fs.rmSync(path, {
			recursive: true,
			force: true
		});
		rimraf.sync(path);
	}
	module.exports = {
		remove: u(remove),
		removeSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/empty/index.js
var require_empty$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var fs = require_fs$1();
	var path$23 = require("path");
	var mkdir = require_mkdirs$1();
	var remove = require_remove$1();
	var emptyDir = u(async function emptyDir(dir) {
		let items;
		try {
			items = await fs.readdir(dir);
		} catch {
			return mkdir.mkdirs(dir);
		}
		return Promise.all(items.map((item) => remove.remove(path$23.join(dir, item))));
	});
	function emptyDirSync(dir) {
		let items;
		try {
			items = fs.readdirSync(dir);
		} catch {
			return mkdir.mkdirsSync(dir);
		}
		items.forEach((item) => {
			item = path$23.join(dir, item);
			remove.removeSync(item);
		});
	}
	module.exports = {
		emptyDirSync,
		emptydirSync: emptyDirSync,
		emptyDir,
		emptydir: emptyDir
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/file.js
var require_file$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$22 = require("path");
	var fs = require_graceful_fs();
	var mkdir = require_mkdirs$1();
	function createFile(file, callback) {
		function makeFile() {
			fs.writeFile(file, "", (err) => {
				if (err) return callback(err);
				callback();
			});
		}
		fs.stat(file, (err, stats) => {
			if (!err && stats.isFile()) return callback();
			const dir = path$22.dirname(file);
			fs.stat(dir, (err, stats) => {
				if (err) {
					if (err.code === "ENOENT") return mkdir.mkdirs(dir, (err) => {
						if (err) return callback(err);
						makeFile();
					});
					return callback(err);
				}
				if (stats.isDirectory()) makeFile();
				else fs.readdir(dir, (err) => {
					if (err) return callback(err);
				});
			});
		});
	}
	function createFileSync(file) {
		let stats;
		try {
			stats = fs.statSync(file);
		} catch {}
		if (stats && stats.isFile()) return;
		const dir = path$22.dirname(file);
		try {
			if (!fs.statSync(dir).isDirectory()) fs.readdirSync(dir);
		} catch (err) {
			if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
			else throw err;
		}
		fs.writeFileSync(file, "");
	}
	module.exports = {
		createFile: u(createFile),
		createFileSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/link.js
var require_link$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$21 = require("path");
	var fs = require_graceful_fs();
	var mkdir = require_mkdirs$1();
	var pathExists = require_path_exists$1().pathExists;
	var { areIdentical } = require_stat$1();
	function createLink(srcpath, dstpath, callback) {
		function makeLink(srcpath, dstpath) {
			fs.link(srcpath, dstpath, (err) => {
				if (err) return callback(err);
				callback(null);
			});
		}
		fs.lstat(dstpath, (_, dstStat) => {
			fs.lstat(srcpath, (err, srcStat) => {
				if (err) {
					err.message = err.message.replace("lstat", "ensureLink");
					return callback(err);
				}
				if (dstStat && areIdentical(srcStat, dstStat)) return callback(null);
				const dir = path$21.dirname(dstpath);
				pathExists(dir, (err, dirExists) => {
					if (err) return callback(err);
					if (dirExists) return makeLink(srcpath, dstpath);
					mkdir.mkdirs(dir, (err) => {
						if (err) return callback(err);
						makeLink(srcpath, dstpath);
					});
				});
			});
		});
	}
	function createLinkSync(srcpath, dstpath) {
		let dstStat;
		try {
			dstStat = fs.lstatSync(dstpath);
		} catch {}
		try {
			const srcStat = fs.lstatSync(srcpath);
			if (dstStat && areIdentical(srcStat, dstStat)) return;
		} catch (err) {
			err.message = err.message.replace("lstat", "ensureLink");
			throw err;
		}
		const dir = path$21.dirname(dstpath);
		if (fs.existsSync(dir)) return fs.linkSync(srcpath, dstpath);
		mkdir.mkdirsSync(dir);
		return fs.linkSync(srcpath, dstpath);
	}
	module.exports = {
		createLink: u(createLink),
		createLinkSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var path$20 = require("path");
	var fs = require_graceful_fs();
	var pathExists = require_path_exists$1().pathExists;
	/**
	* Function that returns two types of paths, one relative to symlink, and one
	* relative to the current working directory. Checks if path is absolute or
	* relative. If the path is relative, this function checks if the path is
	* relative to symlink or relative to current working directory. This is an
	* initiative to find a smarter `srcpath` to supply when building symlinks.
	* This allows you to determine which path to use out of one of three possible
	* types of source paths. The first is an absolute path. This is detected by
	* `path.isAbsolute()`. When an absolute path is provided, it is checked to
	* see if it exists. If it does it's used, if not an error is returned
	* (callback)/ thrown (sync). The other two options for `srcpath` are a
	* relative url. By default Node's `fs.symlink` works by creating a symlink
	* using `dstpath` and expects the `srcpath` to be relative to the newly
	* created symlink. If you provide a `srcpath` that does not exist on the file
	* system it results in a broken symlink. To minimize this, the function
	* checks to see if the 'relative to symlink' source file exists, and if it
	* does it will use it. If it does not, it checks if there's a file that
	* exists that is relative to the current working directory, if does its used.
	* This preserves the expectations of the original fs.symlink spec and adds
	* the ability to pass in `relative to current working direcotry` paths.
	*/
	function symlinkPaths(srcpath, dstpath, callback) {
		if (path$20.isAbsolute(srcpath)) return fs.lstat(srcpath, (err) => {
			if (err) {
				err.message = err.message.replace("lstat", "ensureSymlink");
				return callback(err);
			}
			return callback(null, {
				toCwd: srcpath,
				toDst: srcpath
			});
		});
		else {
			const dstdir = path$20.dirname(dstpath);
			const relativeToDst = path$20.join(dstdir, srcpath);
			return pathExists(relativeToDst, (err, exists) => {
				if (err) return callback(err);
				if (exists) return callback(null, {
					toCwd: relativeToDst,
					toDst: srcpath
				});
				else return fs.lstat(srcpath, (err) => {
					if (err) {
						err.message = err.message.replace("lstat", "ensureSymlink");
						return callback(err);
					}
					return callback(null, {
						toCwd: srcpath,
						toDst: path$20.relative(dstdir, srcpath)
					});
				});
			});
		}
	}
	function symlinkPathsSync(srcpath, dstpath) {
		let exists;
		if (path$20.isAbsolute(srcpath)) {
			exists = fs.existsSync(srcpath);
			if (!exists) throw new Error("absolute srcpath does not exist");
			return {
				toCwd: srcpath,
				toDst: srcpath
			};
		} else {
			const dstdir = path$20.dirname(dstpath);
			const relativeToDst = path$20.join(dstdir, srcpath);
			exists = fs.existsSync(relativeToDst);
			if (exists) return {
				toCwd: relativeToDst,
				toDst: srcpath
			};
			else {
				exists = fs.existsSync(srcpath);
				if (!exists) throw new Error("relative srcpath does not exist");
				return {
					toCwd: srcpath,
					toDst: path$20.relative(dstdir, srcpath)
				};
			}
		}
	}
	module.exports = {
		symlinkPaths,
		symlinkPathsSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	function symlinkType(srcpath, type, callback) {
		callback = typeof type === "function" ? type : callback;
		type = typeof type === "function" ? false : type;
		if (type) return callback(null, type);
		fs.lstat(srcpath, (err, stats) => {
			if (err) return callback(null, "file");
			type = stats && stats.isDirectory() ? "dir" : "file";
			callback(null, type);
		});
	}
	function symlinkTypeSync(srcpath, type) {
		let stats;
		if (type) return type;
		try {
			stats = fs.lstatSync(srcpath);
		} catch {
			return "file";
		}
		return stats && stats.isDirectory() ? "dir" : "file";
	}
	module.exports = {
		symlinkType,
		symlinkTypeSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$19 = require("path");
	var fs = require_fs$1();
	var _mkdirs = require_mkdirs$1();
	var mkdirs = _mkdirs.mkdirs;
	var mkdirsSync = _mkdirs.mkdirsSync;
	var _symlinkPaths = require_symlink_paths$1();
	var symlinkPaths = _symlinkPaths.symlinkPaths;
	var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
	var _symlinkType = require_symlink_type$1();
	var symlinkType = _symlinkType.symlinkType;
	var symlinkTypeSync = _symlinkType.symlinkTypeSync;
	var pathExists = require_path_exists$1().pathExists;
	var { areIdentical } = require_stat$1();
	function createSymlink(srcpath, dstpath, type, callback) {
		callback = typeof type === "function" ? type : callback;
		type = typeof type === "function" ? false : type;
		fs.lstat(dstpath, (err, stats) => {
			if (!err && stats.isSymbolicLink()) Promise.all([fs.stat(srcpath), fs.stat(dstpath)]).then(([srcStat, dstStat]) => {
				if (areIdentical(srcStat, dstStat)) return callback(null);
				_createSymlink(srcpath, dstpath, type, callback);
			});
			else _createSymlink(srcpath, dstpath, type, callback);
		});
	}
	function _createSymlink(srcpath, dstpath, type, callback) {
		symlinkPaths(srcpath, dstpath, (err, relative) => {
			if (err) return callback(err);
			srcpath = relative.toDst;
			symlinkType(relative.toCwd, type, (err, type) => {
				if (err) return callback(err);
				const dir = path$19.dirname(dstpath);
				pathExists(dir, (err, dirExists) => {
					if (err) return callback(err);
					if (dirExists) return fs.symlink(srcpath, dstpath, type, callback);
					mkdirs(dir, (err) => {
						if (err) return callback(err);
						fs.symlink(srcpath, dstpath, type, callback);
					});
				});
			});
		});
	}
	function createSymlinkSync(srcpath, dstpath, type) {
		let stats;
		try {
			stats = fs.lstatSync(dstpath);
		} catch {}
		if (stats && stats.isSymbolicLink()) {
			if (areIdentical(fs.statSync(srcpath), fs.statSync(dstpath))) return;
		}
		const relative = symlinkPathsSync(srcpath, dstpath);
		srcpath = relative.toDst;
		type = symlinkTypeSync(relative.toCwd, type);
		const dir = path$19.dirname(dstpath);
		if (fs.existsSync(dir)) return fs.symlinkSync(srcpath, dstpath, type);
		mkdirsSync(dir);
		return fs.symlinkSync(srcpath, dstpath, type);
	}
	module.exports = {
		createSymlink: u(createSymlink),
		createSymlinkSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/ensure/index.js
var require_ensure$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { createFile, createFileSync } = require_file$1();
	var { createLink, createLinkSync } = require_link$1();
	var { createSymlink, createSymlinkSync } = require_symlink$1();
	module.exports = {
		createFile,
		createFileSync,
		ensureFile: createFile,
		ensureFileSync: createFileSync,
		createLink,
		createLinkSync,
		ensureLink: createLink,
		ensureLinkSync: createLinkSync,
		createSymlink,
		createSymlinkSync,
		ensureSymlink: createSymlink,
		ensureSymlinkSync: createSymlinkSync
	};
}));
//#endregion
//#region node_modules/jsonfile/utils.js
var require_utils$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	function stringify(obj, { EOL = "\n", finalEOL = true, replacer = null, spaces } = {}) {
		const EOF = finalEOL ? EOL : "";
		return JSON.stringify(obj, replacer, spaces).replace(/\n/g, EOL) + EOF;
	}
	function stripBom(content) {
		if (Buffer.isBuffer(content)) content = content.toString("utf8");
		return content.replace(/^\uFEFF/, "");
	}
	module.exports = {
		stringify,
		stripBom
	};
}));
//#endregion
//#region node_modules/jsonfile/index.js
var require_jsonfile$2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var _fs;
	try {
		_fs = require_graceful_fs();
	} catch (_) {
		_fs = require("fs");
	}
	var universalify = require_universalify();
	var { stringify, stripBom } = require_utils$1();
	async function _readFile(file, options = {}) {
		if (typeof options === "string") options = { encoding: options };
		const fs$2 = options.fs || _fs;
		const shouldThrow = "throws" in options ? options.throws : true;
		let data = await universalify.fromCallback(fs$2.readFile)(file, options);
		data = stripBom(data);
		let obj;
		try {
			obj = JSON.parse(data, options ? options.reviver : null);
		} catch (err) {
			if (shouldThrow) {
				err.message = `${file}: ${err.message}`;
				throw err;
			} else return null;
		}
		return obj;
	}
	var readFile = universalify.fromPromise(_readFile);
	function readFileSync(file, options = {}) {
		if (typeof options === "string") options = { encoding: options };
		const fs$3 = options.fs || _fs;
		const shouldThrow = "throws" in options ? options.throws : true;
		try {
			let content = fs$3.readFileSync(file, options);
			content = stripBom(content);
			return JSON.parse(content, options.reviver);
		} catch (err) {
			if (shouldThrow) {
				err.message = `${file}: ${err.message}`;
				throw err;
			} else return null;
		}
	}
	async function _writeFile(file, obj, options = {}) {
		const fs$4 = options.fs || _fs;
		const str = stringify(obj, options);
		await universalify.fromCallback(fs$4.writeFile)(file, str, options);
	}
	var writeFile = universalify.fromPromise(_writeFile);
	function writeFileSync(file, obj, options = {}) {
		const fs$5 = options.fs || _fs;
		const str = stringify(obj, options);
		return fs$5.writeFileSync(file, str, options);
	}
	module.exports = {
		readFile,
		readFileSync,
		writeFile,
		writeFileSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var jsonFile = require_jsonfile$2();
	module.exports = {
		readJson: jsonFile.readFile,
		readJsonSync: jsonFile.readFileSync,
		writeJson: jsonFile.writeFile,
		writeJsonSync: jsonFile.writeFileSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/output-file/index.js
var require_output_file$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var fs = require_graceful_fs();
	var path$18 = require("path");
	var mkdir = require_mkdirs$1();
	var pathExists = require_path_exists$1().pathExists;
	function outputFile(file, data, encoding, callback) {
		if (typeof encoding === "function") {
			callback = encoding;
			encoding = "utf8";
		}
		const dir = path$18.dirname(file);
		pathExists(dir, (err, itDoes) => {
			if (err) return callback(err);
			if (itDoes) return fs.writeFile(file, data, encoding, callback);
			mkdir.mkdirs(dir, (err) => {
				if (err) return callback(err);
				fs.writeFile(file, data, encoding, callback);
			});
		});
	}
	function outputFileSync(file, ...args) {
		const dir = path$18.dirname(file);
		if (fs.existsSync(dir)) return fs.writeFileSync(file, ...args);
		mkdir.mkdirsSync(dir);
		fs.writeFileSync(file, ...args);
	}
	module.exports = {
		outputFile: u(outputFile),
		outputFileSync
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/json/output-json.js
var require_output_json$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { stringify } = require_utils$1();
	var { outputFile } = require_output_file$1();
	async function outputJson(file, data, options = {}) {
		await outputFile(file, stringify(data, options), options);
	}
	module.exports = outputJson;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { stringify } = require_utils$1();
	var { outputFileSync } = require_output_file$1();
	function outputJsonSync(file, data, options) {
		outputFileSync(file, stringify(data, options), options);
	}
	module.exports = outputJsonSync;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/json/index.js
var require_json$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var jsonFile = require_jsonfile$1();
	jsonFile.outputJson = u(require_output_json$1());
	jsonFile.outputJsonSync = require_output_json_sync$1();
	jsonFile.outputJSON = jsonFile.outputJson;
	jsonFile.outputJSONSync = jsonFile.outputJsonSync;
	jsonFile.writeJSON = jsonFile.writeJson;
	jsonFile.writeJSONSync = jsonFile.writeJsonSync;
	jsonFile.readJSON = jsonFile.readJson;
	jsonFile.readJSONSync = jsonFile.readJsonSync;
	module.exports = jsonFile;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/move/move.js
var require_move$3 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$17 = require("path");
	var copy = require_copy$2().copy;
	var remove = require_remove$1().remove;
	var mkdirp = require_mkdirs$1().mkdirp;
	var pathExists = require_path_exists$1().pathExists;
	var stat = require_stat$1();
	function move(src, dest, opts, cb) {
		if (typeof opts === "function") {
			cb = opts;
			opts = {};
		}
		opts = opts || {};
		const overwrite = opts.overwrite || opts.clobber || false;
		stat.checkPaths(src, dest, "move", opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, isChangingCase = false } = stats;
			stat.checkParentPaths(src, srcStat, dest, "move", (err) => {
				if (err) return cb(err);
				if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb);
				mkdirp(path$17.dirname(dest), (err) => {
					if (err) return cb(err);
					return doRename(src, dest, overwrite, isChangingCase, cb);
				});
			});
		});
	}
	function isParentRoot(dest) {
		const parent = path$17.dirname(dest);
		return path$17.parse(parent).root === parent;
	}
	function doRename(src, dest, overwrite, isChangingCase, cb) {
		if (isChangingCase) return rename(src, dest, overwrite, cb);
		if (overwrite) return remove(dest, (err) => {
			if (err) return cb(err);
			return rename(src, dest, overwrite, cb);
		});
		pathExists(dest, (err, destExists) => {
			if (err) return cb(err);
			if (destExists) return cb(/* @__PURE__ */ new Error("dest already exists."));
			return rename(src, dest, overwrite, cb);
		});
	}
	function rename(src, dest, overwrite, cb) {
		fs.rename(src, dest, (err) => {
			if (!err) return cb();
			if (err.code !== "EXDEV") return cb(err);
			return moveAcrossDevice(src, dest, overwrite, cb);
		});
	}
	function moveAcrossDevice(src, dest, overwrite, cb) {
		copy(src, dest, {
			overwrite,
			errorOnExist: true
		}, (err) => {
			if (err) return cb(err);
			return remove(src, cb);
		});
	}
	module.exports = move;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$16 = require("path");
	var copySync = require_copy$2().copySync;
	var removeSync = require_remove$1().removeSync;
	var mkdirpSync = require_mkdirs$1().mkdirpSync;
	var stat = require_stat$1();
	function moveSync(src, dest, opts) {
		opts = opts || {};
		const overwrite = opts.overwrite || opts.clobber || false;
		const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
		stat.checkParentPathsSync(src, srcStat, dest, "move");
		if (!isParentRoot(dest)) mkdirpSync(path$16.dirname(dest));
		return doRename(src, dest, overwrite, isChangingCase);
	}
	function isParentRoot(dest) {
		const parent = path$16.dirname(dest);
		return path$16.parse(parent).root === parent;
	}
	function doRename(src, dest, overwrite, isChangingCase) {
		if (isChangingCase) return rename(src, dest, overwrite);
		if (overwrite) {
			removeSync(dest);
			return rename(src, dest, overwrite);
		}
		if (fs.existsSync(dest)) throw new Error("dest already exists.");
		return rename(src, dest, overwrite);
	}
	function rename(src, dest, overwrite) {
		try {
			fs.renameSync(src, dest);
		} catch (err) {
			if (err.code !== "EXDEV") throw err;
			return moveAcrossDevice(src, dest, overwrite);
		}
	}
	function moveAcrossDevice(src, dest, overwrite) {
		copySync(src, dest, {
			overwrite,
			errorOnExist: true
		});
		return removeSync(src);
	}
	module.exports = moveSync;
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/move/index.js
var require_move$2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	module.exports = {
		move: u(require_move$3()),
		moveSync: require_move_sync$1()
	};
}));
//#endregion
//#region node_modules/galactus/node_modules/fs-extra/lib/index.js
var require_lib$4 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	module.exports = {
		...require_fs$1(),
		...require_copy$2(),
		...require_empty$1(),
		...require_ensure$1(),
		...require_json$1(),
		...require_mkdirs$1(),
		...require_move$2(),
		...require_output_file$1(),
		...require_path_exists$1(),
		...require_remove$1()
	};
}));
//#endregion
//#region node_modules/ms/index.js
var require_ms = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var os$1 = require("os");
	var tty$1 = require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var forceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) forceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) forceColor = 1;
	if ("FORCE_COLOR" in env) if (env.FORCE_COLOR === "true") forceColor = 1;
	else if (env.FORCE_COLOR === "false") forceColor = 0;
	else forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) return 0;
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os$1.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream) {
		return translateLevel(supportsColor(stream, stream && stream.isTTY));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty$1.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty$1.isatty(2)))
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = require("tty");
	var util$3 = require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$3.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$3.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$3.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$3.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/fs/index.js
var require_fs = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var u = require_universalify().fromCallback;
	var fs = require_graceful_fs();
	var api = [
		"access",
		"appendFile",
		"chmod",
		"chown",
		"close",
		"copyFile",
		"fchmod",
		"fchown",
		"fdatasync",
		"fstat",
		"fsync",
		"ftruncate",
		"futimes",
		"lchmod",
		"lchown",
		"link",
		"lstat",
		"mkdir",
		"mkdtemp",
		"open",
		"opendir",
		"readdir",
		"readFile",
		"readlink",
		"realpath",
		"rename",
		"rm",
		"rmdir",
		"stat",
		"symlink",
		"truncate",
		"unlink",
		"utimes",
		"writeFile"
	].filter((key) => {
		return typeof fs[key] === "function";
	});
	Object.assign(exports, fs);
	api.forEach((method) => {
		exports[method] = u(fs[method]);
	});
	exports.exists = function(filename, callback) {
		if (typeof callback === "function") return fs.exists(filename, callback);
		return new Promise((resolve) => {
			return fs.exists(filename, resolve);
		});
	};
	exports.read = function(fd, buffer, offset, length, position, callback) {
		if (typeof callback === "function") return fs.read(fd, buffer, offset, length, position, callback);
		return new Promise((resolve, reject) => {
			fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
				if (err) return reject(err);
				resolve({
					bytesRead,
					buffer
				});
			});
		});
	};
	exports.write = function(fd, buffer, ...args) {
		if (typeof args[args.length - 1] === "function") return fs.write(fd, buffer, ...args);
		return new Promise((resolve, reject) => {
			fs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
				if (err) return reject(err);
				resolve({
					bytesWritten,
					buffer
				});
			});
		});
	};
	if (typeof fs.writev === "function") exports.writev = function(fd, buffers, ...args) {
		if (typeof args[args.length - 1] === "function") return fs.writev(fd, buffers, ...args);
		return new Promise((resolve, reject) => {
			fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {
				if (err) return reject(err);
				resolve({
					bytesWritten,
					buffers
				});
			});
		});
	};
	if (typeof fs.realpath.native === "function") exports.realpath.native = u(fs.realpath.native);
	else process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/mkdirs/utils.js
var require_utils = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var path$15 = require("path");
	module.exports.checkPath = function checkPath(pth) {
		if (process.platform === "win32") {
			if (/[<>:"|?*]/.test(pth.replace(path$15.parse(pth).root, ""))) {
				const error = /* @__PURE__ */ new Error(`Path contains invalid characters: ${pth}`);
				error.code = "EINVAL";
				throw error;
			}
		}
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/mkdirs/make-dir.js
var require_make_dir = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_fs();
	var { checkPath } = require_utils();
	var getMode = (options) => {
		const defaults = { mode: 511 };
		if (typeof options === "number") return options;
		return {
			...defaults,
			...options
		}.mode;
	};
	module.exports.makeDir = async (dir, options) => {
		checkPath(dir);
		return fs.mkdir(dir, {
			mode: getMode(options),
			recursive: true
		});
	};
	module.exports.makeDirSync = (dir, options) => {
		checkPath(dir);
		return fs.mkdirSync(dir, {
			mode: getMode(options),
			recursive: true
		});
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/mkdirs/index.js
var require_mkdirs = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var { makeDir: _makeDir, makeDirSync } = require_make_dir();
	var makeDir = u(_makeDir);
	module.exports = {
		mkdirs: makeDir,
		mkdirsSync: makeDirSync,
		mkdirp: makeDir,
		mkdirpSync: makeDirSync,
		ensureDir: makeDir,
		ensureDirSync: makeDirSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/path-exists/index.js
var require_path_exists = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var fs = require_fs();
	function pathExists(path) {
		return fs.access(path).then(() => true).catch(() => false);
	}
	module.exports = {
		pathExists: u(pathExists),
		pathExistsSync: fs.existsSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/util/utimes.js
var require_utimes = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	function utimesMillis(path, atime, mtime, callback) {
		fs.open(path, "r+", (err, fd) => {
			if (err) return callback(err);
			fs.futimes(fd, atime, mtime, (futimesErr) => {
				fs.close(fd, (closeErr) => {
					if (callback) callback(futimesErr || closeErr);
				});
			});
		});
	}
	function utimesMillisSync(path, atime, mtime) {
		const fd = fs.openSync(path, "r+");
		fs.futimesSync(fd, atime, mtime);
		return fs.closeSync(fd);
	}
	module.exports = {
		utimesMillis,
		utimesMillisSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/util/stat.js
var require_stat = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_fs();
	var path$14 = require("path");
	var util$2 = require("util");
	function getStats(src, dest, opts) {
		const statFunc = opts.dereference ? (file) => fs.stat(file, { bigint: true }) : (file) => fs.lstat(file, { bigint: true });
		return Promise.all([statFunc(src), statFunc(dest).catch((err) => {
			if (err.code === "ENOENT") return null;
			throw err;
		})]).then(([srcStat, destStat]) => ({
			srcStat,
			destStat
		}));
	}
	function getStatsSync(src, dest, opts) {
		let destStat;
		const statFunc = opts.dereference ? (file) => fs.statSync(file, { bigint: true }) : (file) => fs.lstatSync(file, { bigint: true });
		const srcStat = statFunc(src);
		try {
			destStat = statFunc(dest);
		} catch (err) {
			if (err.code === "ENOENT") return {
				srcStat,
				destStat: null
			};
			throw err;
		}
		return {
			srcStat,
			destStat
		};
	}
	function checkPaths(src, dest, funcName, opts, cb) {
		util$2.callbackify(getStats)(src, dest, opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, destStat } = stats;
			if (destStat) {
				if (areIdentical(srcStat, destStat)) {
					const srcBaseName = path$14.basename(src);
					const destBaseName = path$14.basename(dest);
					if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return cb(null, {
						srcStat,
						destStat,
						isChangingCase: true
					});
					return cb(/* @__PURE__ */ new Error("Source and destination must not be the same."));
				}
				if (srcStat.isDirectory() && !destStat.isDirectory()) return cb(/* @__PURE__ */ new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
				if (!srcStat.isDirectory() && destStat.isDirectory()) return cb(/* @__PURE__ */ new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
			}
			if (srcStat.isDirectory() && isSrcSubdir(src, dest)) return cb(new Error(errMsg(src, dest, funcName)));
			return cb(null, {
				srcStat,
				destStat
			});
		});
	}
	function checkPathsSync(src, dest, funcName, opts) {
		const { srcStat, destStat } = getStatsSync(src, dest, opts);
		if (destStat) {
			if (areIdentical(srcStat, destStat)) {
				const srcBaseName = path$14.basename(src);
				const destBaseName = path$14.basename(dest);
				if (funcName === "move" && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return {
					srcStat,
					destStat,
					isChangingCase: true
				};
				throw new Error("Source and destination must not be the same.");
			}
			if (srcStat.isDirectory() && !destStat.isDirectory()) throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
			if (!srcStat.isDirectory() && destStat.isDirectory()) throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
		}
		if (srcStat.isDirectory() && isSrcSubdir(src, dest)) throw new Error(errMsg(src, dest, funcName));
		return {
			srcStat,
			destStat
		};
	}
	function checkParentPaths(src, srcStat, dest, funcName, cb) {
		const srcParent = path$14.resolve(path$14.dirname(src));
		const destParent = path$14.resolve(path$14.dirname(dest));
		if (destParent === srcParent || destParent === path$14.parse(destParent).root) return cb();
		fs.stat(destParent, { bigint: true }, (err, destStat) => {
			if (err) {
				if (err.code === "ENOENT") return cb();
				return cb(err);
			}
			if (areIdentical(srcStat, destStat)) return cb(new Error(errMsg(src, dest, funcName)));
			return checkParentPaths(src, srcStat, destParent, funcName, cb);
		});
	}
	function checkParentPathsSync(src, srcStat, dest, funcName) {
		const srcParent = path$14.resolve(path$14.dirname(src));
		const destParent = path$14.resolve(path$14.dirname(dest));
		if (destParent === srcParent || destParent === path$14.parse(destParent).root) return;
		let destStat;
		try {
			destStat = fs.statSync(destParent, { bigint: true });
		} catch (err) {
			if (err.code === "ENOENT") return;
			throw err;
		}
		if (areIdentical(srcStat, destStat)) throw new Error(errMsg(src, dest, funcName));
		return checkParentPathsSync(src, srcStat, destParent, funcName);
	}
	function areIdentical(srcStat, destStat) {
		return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
	}
	function isSrcSubdir(src, dest) {
		const srcArr = path$14.resolve(src).split(path$14.sep).filter((i) => i);
		const destArr = path$14.resolve(dest).split(path$14.sep).filter((i) => i);
		return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true);
	}
	function errMsg(src, dest, funcName) {
		return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
	}
	module.exports = {
		checkPaths,
		checkPathsSync,
		checkParentPaths,
		checkParentPathsSync,
		isSrcSubdir,
		areIdentical
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/copy/copy.js
var require_copy$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$13 = require("path");
	var mkdirs = require_mkdirs().mkdirs;
	var pathExists = require_path_exists().pathExists;
	var utimesMillis = require_utimes().utimesMillis;
	var stat = require_stat();
	function copy(src, dest, opts, cb) {
		if (typeof opts === "function" && !cb) {
			cb = opts;
			opts = {};
		} else if (typeof opts === "function") opts = { filter: opts };
		cb = cb || function() {};
		opts = opts || {};
		opts.clobber = "clobber" in opts ? !!opts.clobber : true;
		opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
		if (opts.preserveTimestamps && process.arch === "ia32") process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001");
		stat.checkPaths(src, dest, "copy", opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, destStat } = stats;
			stat.checkParentPaths(src, srcStat, dest, "copy", (err) => {
				if (err) return cb(err);
				if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb);
				return checkParentDir(destStat, src, dest, opts, cb);
			});
		});
	}
	function checkParentDir(destStat, src, dest, opts, cb) {
		const destParent = path$13.dirname(dest);
		pathExists(destParent, (err, dirExists) => {
			if (err) return cb(err);
			if (dirExists) return getStats(destStat, src, dest, opts, cb);
			mkdirs(destParent, (err) => {
				if (err) return cb(err);
				return getStats(destStat, src, dest, opts, cb);
			});
		});
	}
	function handleFilter(onInclude, destStat, src, dest, opts, cb) {
		Promise.resolve(opts.filter(src, dest)).then((include) => {
			if (include) return onInclude(destStat, src, dest, opts, cb);
			return cb();
		}, (error) => cb(error));
	}
	function startCopy(destStat, src, dest, opts, cb) {
		if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb);
		return getStats(destStat, src, dest, opts, cb);
	}
	function getStats(destStat, src, dest, opts, cb) {
		(opts.dereference ? fs.stat : fs.lstat)(src, (err, srcStat) => {
			if (err) return cb(err);
			if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb);
			else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb);
			else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb);
			else if (srcStat.isSocket()) return cb(/* @__PURE__ */ new Error(`Cannot copy a socket file: ${src}`));
			else if (srcStat.isFIFO()) return cb(/* @__PURE__ */ new Error(`Cannot copy a FIFO pipe: ${src}`));
			return cb(/* @__PURE__ */ new Error(`Unknown file: ${src}`));
		});
	}
	function onFile(srcStat, destStat, src, dest, opts, cb) {
		if (!destStat) return copyFile(srcStat, src, dest, opts, cb);
		return mayCopyFile(srcStat, src, dest, opts, cb);
	}
	function mayCopyFile(srcStat, src, dest, opts, cb) {
		if (opts.overwrite) fs.unlink(dest, (err) => {
			if (err) return cb(err);
			return copyFile(srcStat, src, dest, opts, cb);
		});
		else if (opts.errorOnExist) return cb(/* @__PURE__ */ new Error(`'${dest}' already exists`));
		else return cb();
	}
	function copyFile(srcStat, src, dest, opts, cb) {
		fs.copyFile(src, dest, (err) => {
			if (err) return cb(err);
			if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb);
			return setDestMode(dest, srcStat.mode, cb);
		});
	}
	function handleTimestampsAndMode(srcMode, src, dest, cb) {
		if (fileIsNotWritable(srcMode)) return makeFileWritable(dest, srcMode, (err) => {
			if (err) return cb(err);
			return setDestTimestampsAndMode(srcMode, src, dest, cb);
		});
		return setDestTimestampsAndMode(srcMode, src, dest, cb);
	}
	function fileIsNotWritable(srcMode) {
		return (srcMode & 128) === 0;
	}
	function makeFileWritable(dest, srcMode, cb) {
		return setDestMode(dest, srcMode | 128, cb);
	}
	function setDestTimestampsAndMode(srcMode, src, dest, cb) {
		setDestTimestamps(src, dest, (err) => {
			if (err) return cb(err);
			return setDestMode(dest, srcMode, cb);
		});
	}
	function setDestMode(dest, srcMode, cb) {
		return fs.chmod(dest, srcMode, cb);
	}
	function setDestTimestamps(src, dest, cb) {
		fs.stat(src, (err, updatedSrcStat) => {
			if (err) return cb(err);
			return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
		});
	}
	function onDir(srcStat, destStat, src, dest, opts, cb) {
		if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
		return copyDir(src, dest, opts, cb);
	}
	function mkDirAndCopy(srcMode, src, dest, opts, cb) {
		fs.mkdir(dest, (err) => {
			if (err) return cb(err);
			copyDir(src, dest, opts, (err) => {
				if (err) return cb(err);
				return setDestMode(dest, srcMode, cb);
			});
		});
	}
	function copyDir(src, dest, opts, cb) {
		fs.readdir(src, (err, items) => {
			if (err) return cb(err);
			return copyDirItems(items, src, dest, opts, cb);
		});
	}
	function copyDirItems(items, src, dest, opts, cb) {
		const item = items.pop();
		if (!item) return cb();
		return copyDirItem(items, item, src, dest, opts, cb);
	}
	function copyDirItem(items, item, src, dest, opts, cb) {
		const srcItem = path$13.join(src, item);
		const destItem = path$13.join(dest, item);
		stat.checkPaths(srcItem, destItem, "copy", opts, (err, stats) => {
			if (err) return cb(err);
			const { destStat } = stats;
			startCopy(destStat, srcItem, destItem, opts, (err) => {
				if (err) return cb(err);
				return copyDirItems(items, src, dest, opts, cb);
			});
		});
	}
	function onLink(destStat, src, dest, opts, cb) {
		fs.readlink(src, (err, resolvedSrc) => {
			if (err) return cb(err);
			if (opts.dereference) resolvedSrc = path$13.resolve(process.cwd(), resolvedSrc);
			if (!destStat) return fs.symlink(resolvedSrc, dest, cb);
			else fs.readlink(dest, (err, resolvedDest) => {
				if (err) {
					if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlink(resolvedSrc, dest, cb);
					return cb(err);
				}
				if (opts.dereference) resolvedDest = path$13.resolve(process.cwd(), resolvedDest);
				if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) return cb(/* @__PURE__ */ new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
				if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) return cb(/* @__PURE__ */ new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
				return copyLink(resolvedSrc, dest, cb);
			});
		});
	}
	function copyLink(resolvedSrc, dest, cb) {
		fs.unlink(dest, (err) => {
			if (err) return cb(err);
			return fs.symlink(resolvedSrc, dest, cb);
		});
	}
	module.exports = copy;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/copy/copy-sync.js
var require_copy_sync = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$12 = require("path");
	var mkdirsSync = require_mkdirs().mkdirsSync;
	var utimesMillisSync = require_utimes().utimesMillisSync;
	var stat = require_stat();
	function copySync(src, dest, opts) {
		if (typeof opts === "function") opts = { filter: opts };
		opts = opts || {};
		opts.clobber = "clobber" in opts ? !!opts.clobber : true;
		opts.overwrite = "overwrite" in opts ? !!opts.overwrite : opts.clobber;
		if (opts.preserveTimestamps && process.arch === "ia32") process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		const { srcStat, destStat } = stat.checkPathsSync(src, dest, "copy", opts);
		stat.checkParentPathsSync(src, srcStat, dest, "copy");
		return handleFilterAndCopy(destStat, src, dest, opts);
	}
	function handleFilterAndCopy(destStat, src, dest, opts) {
		if (opts.filter && !opts.filter(src, dest)) return;
		const destParent = path$12.dirname(dest);
		if (!fs.existsSync(destParent)) mkdirsSync(destParent);
		return getStats(destStat, src, dest, opts);
	}
	function startCopy(destStat, src, dest, opts) {
		if (opts.filter && !opts.filter(src, dest)) return;
		return getStats(destStat, src, dest, opts);
	}
	function getStats(destStat, src, dest, opts) {
		const srcStat = (opts.dereference ? fs.statSync : fs.lstatSync)(src);
		if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts);
		else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts);
		else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts);
		else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
		else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
		throw new Error(`Unknown file: ${src}`);
	}
	function onFile(srcStat, destStat, src, dest, opts) {
		if (!destStat) return copyFile(srcStat, src, dest, opts);
		return mayCopyFile(srcStat, src, dest, opts);
	}
	function mayCopyFile(srcStat, src, dest, opts) {
		if (opts.overwrite) {
			fs.unlinkSync(dest);
			return copyFile(srcStat, src, dest, opts);
		} else if (opts.errorOnExist) throw new Error(`'${dest}' already exists`);
	}
	function copyFile(srcStat, src, dest, opts) {
		fs.copyFileSync(src, dest);
		if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest);
		return setDestMode(dest, srcStat.mode);
	}
	function handleTimestamps(srcMode, src, dest) {
		if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode);
		return setDestTimestamps(src, dest);
	}
	function fileIsNotWritable(srcMode) {
		return (srcMode & 128) === 0;
	}
	function makeFileWritable(dest, srcMode) {
		return setDestMode(dest, srcMode | 128);
	}
	function setDestMode(dest, srcMode) {
		return fs.chmodSync(dest, srcMode);
	}
	function setDestTimestamps(src, dest) {
		const updatedSrcStat = fs.statSync(src);
		return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
	}
	function onDir(srcStat, destStat, src, dest, opts) {
		if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts);
		return copyDir(src, dest, opts);
	}
	function mkDirAndCopy(srcMode, src, dest, opts) {
		fs.mkdirSync(dest);
		copyDir(src, dest, opts);
		return setDestMode(dest, srcMode);
	}
	function copyDir(src, dest, opts) {
		fs.readdirSync(src).forEach((item) => copyDirItem(item, src, dest, opts));
	}
	function copyDirItem(item, src, dest, opts) {
		const srcItem = path$12.join(src, item);
		const destItem = path$12.join(dest, item);
		const { destStat } = stat.checkPathsSync(srcItem, destItem, "copy", opts);
		return startCopy(destStat, srcItem, destItem, opts);
	}
	function onLink(destStat, src, dest, opts) {
		let resolvedSrc = fs.readlinkSync(src);
		if (opts.dereference) resolvedSrc = path$12.resolve(process.cwd(), resolvedSrc);
		if (!destStat) return fs.symlinkSync(resolvedSrc, dest);
		else {
			let resolvedDest;
			try {
				resolvedDest = fs.readlinkSync(dest);
			} catch (err) {
				if (err.code === "EINVAL" || err.code === "UNKNOWN") return fs.symlinkSync(resolvedSrc, dest);
				throw err;
			}
			if (opts.dereference) resolvedDest = path$12.resolve(process.cwd(), resolvedDest);
			if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
			if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
			return copyLink(resolvedSrc, dest);
		}
	}
	function copyLink(resolvedSrc, dest) {
		fs.unlinkSync(dest);
		return fs.symlinkSync(resolvedSrc, dest);
	}
	module.exports = copySync;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/copy/index.js
var require_copy = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	module.exports = {
		copy: u(require_copy$1()),
		copySync: require_copy_sync()
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/remove/rimraf.js
var require_rimraf = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$11 = require("path");
	var assert = require("assert");
	var isWindows = process.platform === "win32";
	function defaults(options) {
		[
			"unlink",
			"chmod",
			"stat",
			"lstat",
			"rmdir",
			"readdir"
		].forEach((m) => {
			options[m] = options[m] || fs[m];
			m = m + "Sync";
			options[m] = options[m] || fs[m];
		});
		options.maxBusyTries = options.maxBusyTries || 3;
	}
	function rimraf(p, options, cb) {
		let busyTries = 0;
		if (typeof options === "function") {
			cb = options;
			options = {};
		}
		assert(p, "rimraf: missing path");
		assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
		assert.strictEqual(typeof cb, "function", "rimraf: callback function required");
		assert(options, "rimraf: invalid options argument provided");
		assert.strictEqual(typeof options, "object", "rimraf: options should be object");
		defaults(options);
		rimraf_(p, options, function CB(er) {
			if (er) {
				if ((er.code === "EBUSY" || er.code === "ENOTEMPTY" || er.code === "EPERM") && busyTries < options.maxBusyTries) {
					busyTries++;
					const time = busyTries * 100;
					return setTimeout(() => rimraf_(p, options, CB), time);
				}
				if (er.code === "ENOENT") er = null;
			}
			cb(er);
		});
	}
	function rimraf_(p, options, cb) {
		assert(p);
		assert(options);
		assert(typeof cb === "function");
		options.lstat(p, (er, st) => {
			if (er && er.code === "ENOENT") return cb(null);
			if (er && er.code === "EPERM" && isWindows) return fixWinEPERM(p, options, er, cb);
			if (st && st.isDirectory()) return rmdir(p, options, er, cb);
			options.unlink(p, (er) => {
				if (er) {
					if (er.code === "ENOENT") return cb(null);
					if (er.code === "EPERM") return isWindows ? fixWinEPERM(p, options, er, cb) : rmdir(p, options, er, cb);
					if (er.code === "EISDIR") return rmdir(p, options, er, cb);
				}
				return cb(er);
			});
		});
	}
	function fixWinEPERM(p, options, er, cb) {
		assert(p);
		assert(options);
		assert(typeof cb === "function");
		options.chmod(p, 438, (er2) => {
			if (er2) cb(er2.code === "ENOENT" ? null : er);
			else options.stat(p, (er3, stats) => {
				if (er3) cb(er3.code === "ENOENT" ? null : er);
				else if (stats.isDirectory()) rmdir(p, options, er, cb);
				else options.unlink(p, cb);
			});
		});
	}
	function fixWinEPERMSync(p, options, er) {
		let stats;
		assert(p);
		assert(options);
		try {
			options.chmodSync(p, 438);
		} catch (er2) {
			if (er2.code === "ENOENT") return;
			else throw er;
		}
		try {
			stats = options.statSync(p);
		} catch (er3) {
			if (er3.code === "ENOENT") return;
			else throw er;
		}
		if (stats.isDirectory()) rmdirSync(p, options, er);
		else options.unlinkSync(p);
	}
	function rmdir(p, options, originalEr, cb) {
		assert(p);
		assert(options);
		assert(typeof cb === "function");
		options.rmdir(p, (er) => {
			if (er && (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM")) rmkids(p, options, cb);
			else if (er && er.code === "ENOTDIR") cb(originalEr);
			else cb(er);
		});
	}
	function rmkids(p, options, cb) {
		assert(p);
		assert(options);
		assert(typeof cb === "function");
		options.readdir(p, (er, files) => {
			if (er) return cb(er);
			let n = files.length;
			let errState;
			if (n === 0) return options.rmdir(p, cb);
			files.forEach((f) => {
				rimraf(path$11.join(p, f), options, (er) => {
					if (errState) return;
					if (er) return cb(errState = er);
					if (--n === 0) options.rmdir(p, cb);
				});
			});
		});
	}
	function rimrafSync(p, options) {
		let st;
		options = options || {};
		defaults(options);
		assert(p, "rimraf: missing path");
		assert.strictEqual(typeof p, "string", "rimraf: path should be a string");
		assert(options, "rimraf: missing options");
		assert.strictEqual(typeof options, "object", "rimraf: options should be object");
		try {
			st = options.lstatSync(p);
		} catch (er) {
			if (er.code === "ENOENT") return;
			if (er.code === "EPERM" && isWindows) fixWinEPERMSync(p, options, er);
		}
		try {
			if (st && st.isDirectory()) rmdirSync(p, options, null);
			else options.unlinkSync(p);
		} catch (er) {
			if (er.code === "ENOENT") return;
			else if (er.code === "EPERM") return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
			else if (er.code !== "EISDIR") throw er;
			rmdirSync(p, options, er);
		}
	}
	function rmdirSync(p, options, originalEr) {
		assert(p);
		assert(options);
		try {
			options.rmdirSync(p);
		} catch (er) {
			if (er.code === "ENOTDIR") throw originalEr;
			else if (er.code === "ENOTEMPTY" || er.code === "EEXIST" || er.code === "EPERM") rmkidsSync(p, options);
			else if (er.code !== "ENOENT") throw er;
		}
	}
	function rmkidsSync(p, options) {
		assert(p);
		assert(options);
		options.readdirSync(p).forEach((f) => rimrafSync(path$11.join(p, f), options));
		if (isWindows) {
			const startTime = Date.now();
			do
				try {
					return options.rmdirSync(p, options);
				} catch {}
			while (Date.now() - startTime < 500);
		} else return options.rmdirSync(p, options);
	}
	module.exports = rimraf;
	rimraf.sync = rimrafSync;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/remove/index.js
var require_remove = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var u = require_universalify().fromCallback;
	var rimraf = require_rimraf();
	function remove(path, callback) {
		if (fs.rm) return fs.rm(path, {
			recursive: true,
			force: true
		}, callback);
		rimraf(path, callback);
	}
	function removeSync(path) {
		if (fs.rmSync) return fs.rmSync(path, {
			recursive: true,
			force: true
		});
		rimraf.sync(path);
	}
	module.exports = {
		remove: u(remove),
		removeSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/empty/index.js
var require_empty = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var fs = require_fs();
	var path$10 = require("path");
	var mkdir = require_mkdirs();
	var remove = require_remove();
	var emptyDir = u(async function emptyDir(dir) {
		let items;
		try {
			items = await fs.readdir(dir);
		} catch {
			return mkdir.mkdirs(dir);
		}
		return Promise.all(items.map((item) => remove.remove(path$10.join(dir, item))));
	});
	function emptyDirSync(dir) {
		let items;
		try {
			items = fs.readdirSync(dir);
		} catch {
			return mkdir.mkdirsSync(dir);
		}
		items.forEach((item) => {
			item = path$10.join(dir, item);
			remove.removeSync(item);
		});
	}
	module.exports = {
		emptyDirSync,
		emptydirSync: emptyDirSync,
		emptyDir,
		emptydir: emptyDir
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/file.js
var require_file = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$9 = require("path");
	var fs = require_graceful_fs();
	var mkdir = require_mkdirs();
	function createFile(file, callback) {
		function makeFile() {
			fs.writeFile(file, "", (err) => {
				if (err) return callback(err);
				callback();
			});
		}
		fs.stat(file, (err, stats) => {
			if (!err && stats.isFile()) return callback();
			const dir = path$9.dirname(file);
			fs.stat(dir, (err, stats) => {
				if (err) {
					if (err.code === "ENOENT") return mkdir.mkdirs(dir, (err) => {
						if (err) return callback(err);
						makeFile();
					});
					return callback(err);
				}
				if (stats.isDirectory()) makeFile();
				else fs.readdir(dir, (err) => {
					if (err) return callback(err);
				});
			});
		});
	}
	function createFileSync(file) {
		let stats;
		try {
			stats = fs.statSync(file);
		} catch {}
		if (stats && stats.isFile()) return;
		const dir = path$9.dirname(file);
		try {
			if (!fs.statSync(dir).isDirectory()) fs.readdirSync(dir);
		} catch (err) {
			if (err && err.code === "ENOENT") mkdir.mkdirsSync(dir);
			else throw err;
		}
		fs.writeFileSync(file, "");
	}
	module.exports = {
		createFile: u(createFile),
		createFileSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/link.js
var require_link = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$8 = require("path");
	var fs = require_graceful_fs();
	var mkdir = require_mkdirs();
	var pathExists = require_path_exists().pathExists;
	var { areIdentical } = require_stat();
	function createLink(srcpath, dstpath, callback) {
		function makeLink(srcpath, dstpath) {
			fs.link(srcpath, dstpath, (err) => {
				if (err) return callback(err);
				callback(null);
			});
		}
		fs.lstat(dstpath, (_, dstStat) => {
			fs.lstat(srcpath, (err, srcStat) => {
				if (err) {
					err.message = err.message.replace("lstat", "ensureLink");
					return callback(err);
				}
				if (dstStat && areIdentical(srcStat, dstStat)) return callback(null);
				const dir = path$8.dirname(dstpath);
				pathExists(dir, (err, dirExists) => {
					if (err) return callback(err);
					if (dirExists) return makeLink(srcpath, dstpath);
					mkdir.mkdirs(dir, (err) => {
						if (err) return callback(err);
						makeLink(srcpath, dstpath);
					});
				});
			});
		});
	}
	function createLinkSync(srcpath, dstpath) {
		let dstStat;
		try {
			dstStat = fs.lstatSync(dstpath);
		} catch {}
		try {
			const srcStat = fs.lstatSync(srcpath);
			if (dstStat && areIdentical(srcStat, dstStat)) return;
		} catch (err) {
			err.message = err.message.replace("lstat", "ensureLink");
			throw err;
		}
		const dir = path$8.dirname(dstpath);
		if (fs.existsSync(dir)) return fs.linkSync(srcpath, dstpath);
		mkdir.mkdirsSync(dir);
		return fs.linkSync(srcpath, dstpath);
	}
	module.exports = {
		createLink: u(createLink),
		createLinkSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/symlink-paths.js
var require_symlink_paths = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var path$7 = require("path");
	var fs = require_graceful_fs();
	var pathExists = require_path_exists().pathExists;
	/**
	* Function that returns two types of paths, one relative to symlink, and one
	* relative to the current working directory. Checks if path is absolute or
	* relative. If the path is relative, this function checks if the path is
	* relative to symlink or relative to current working directory. This is an
	* initiative to find a smarter `srcpath` to supply when building symlinks.
	* This allows you to determine which path to use out of one of three possible
	* types of source paths. The first is an absolute path. This is detected by
	* `path.isAbsolute()`. When an absolute path is provided, it is checked to
	* see if it exists. If it does it's used, if not an error is returned
	* (callback)/ thrown (sync). The other two options for `srcpath` are a
	* relative url. By default Node's `fs.symlink` works by creating a symlink
	* using `dstpath` and expects the `srcpath` to be relative to the newly
	* created symlink. If you provide a `srcpath` that does not exist on the file
	* system it results in a broken symlink. To minimize this, the function
	* checks to see if the 'relative to symlink' source file exists, and if it
	* does it will use it. If it does not, it checks if there's a file that
	* exists that is relative to the current working directory, if does its used.
	* This preserves the expectations of the original fs.symlink spec and adds
	* the ability to pass in `relative to current working direcotry` paths.
	*/
	function symlinkPaths(srcpath, dstpath, callback) {
		if (path$7.isAbsolute(srcpath)) return fs.lstat(srcpath, (err) => {
			if (err) {
				err.message = err.message.replace("lstat", "ensureSymlink");
				return callback(err);
			}
			return callback(null, {
				toCwd: srcpath,
				toDst: srcpath
			});
		});
		else {
			const dstdir = path$7.dirname(dstpath);
			const relativeToDst = path$7.join(dstdir, srcpath);
			return pathExists(relativeToDst, (err, exists) => {
				if (err) return callback(err);
				if (exists) return callback(null, {
					toCwd: relativeToDst,
					toDst: srcpath
				});
				else return fs.lstat(srcpath, (err) => {
					if (err) {
						err.message = err.message.replace("lstat", "ensureSymlink");
						return callback(err);
					}
					return callback(null, {
						toCwd: srcpath,
						toDst: path$7.relative(dstdir, srcpath)
					});
				});
			});
		}
	}
	function symlinkPathsSync(srcpath, dstpath) {
		let exists;
		if (path$7.isAbsolute(srcpath)) {
			exists = fs.existsSync(srcpath);
			if (!exists) throw new Error("absolute srcpath does not exist");
			return {
				toCwd: srcpath,
				toDst: srcpath
			};
		} else {
			const dstdir = path$7.dirname(dstpath);
			const relativeToDst = path$7.join(dstdir, srcpath);
			exists = fs.existsSync(relativeToDst);
			if (exists) return {
				toCwd: relativeToDst,
				toDst: srcpath
			};
			else {
				exists = fs.existsSync(srcpath);
				if (!exists) throw new Error("relative srcpath does not exist");
				return {
					toCwd: srcpath,
					toDst: path$7.relative(dstdir, srcpath)
				};
			}
		}
	}
	module.exports = {
		symlinkPaths,
		symlinkPathsSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/symlink-type.js
var require_symlink_type = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	function symlinkType(srcpath, type, callback) {
		callback = typeof type === "function" ? type : callback;
		type = typeof type === "function" ? false : type;
		if (type) return callback(null, type);
		fs.lstat(srcpath, (err, stats) => {
			if (err) return callback(null, "file");
			type = stats && stats.isDirectory() ? "dir" : "file";
			callback(null, type);
		});
	}
	function symlinkTypeSync(srcpath, type) {
		let stats;
		if (type) return type;
		try {
			stats = fs.lstatSync(srcpath);
		} catch {
			return "file";
		}
		return stats && stats.isDirectory() ? "dir" : "file";
	}
	module.exports = {
		symlinkType,
		symlinkTypeSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/symlink.js
var require_symlink = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var path$6 = require("path");
	var fs = require_fs();
	var _mkdirs = require_mkdirs();
	var mkdirs = _mkdirs.mkdirs;
	var mkdirsSync = _mkdirs.mkdirsSync;
	var _symlinkPaths = require_symlink_paths();
	var symlinkPaths = _symlinkPaths.symlinkPaths;
	var symlinkPathsSync = _symlinkPaths.symlinkPathsSync;
	var _symlinkType = require_symlink_type();
	var symlinkType = _symlinkType.symlinkType;
	var symlinkTypeSync = _symlinkType.symlinkTypeSync;
	var pathExists = require_path_exists().pathExists;
	var { areIdentical } = require_stat();
	function createSymlink(srcpath, dstpath, type, callback) {
		callback = typeof type === "function" ? type : callback;
		type = typeof type === "function" ? false : type;
		fs.lstat(dstpath, (err, stats) => {
			if (!err && stats.isSymbolicLink()) Promise.all([fs.stat(srcpath), fs.stat(dstpath)]).then(([srcStat, dstStat]) => {
				if (areIdentical(srcStat, dstStat)) return callback(null);
				_createSymlink(srcpath, dstpath, type, callback);
			});
			else _createSymlink(srcpath, dstpath, type, callback);
		});
	}
	function _createSymlink(srcpath, dstpath, type, callback) {
		symlinkPaths(srcpath, dstpath, (err, relative) => {
			if (err) return callback(err);
			srcpath = relative.toDst;
			symlinkType(relative.toCwd, type, (err, type) => {
				if (err) return callback(err);
				const dir = path$6.dirname(dstpath);
				pathExists(dir, (err, dirExists) => {
					if (err) return callback(err);
					if (dirExists) return fs.symlink(srcpath, dstpath, type, callback);
					mkdirs(dir, (err) => {
						if (err) return callback(err);
						fs.symlink(srcpath, dstpath, type, callback);
					});
				});
			});
		});
	}
	function createSymlinkSync(srcpath, dstpath, type) {
		let stats;
		try {
			stats = fs.lstatSync(dstpath);
		} catch {}
		if (stats && stats.isSymbolicLink()) {
			if (areIdentical(fs.statSync(srcpath), fs.statSync(dstpath))) return;
		}
		const relative = symlinkPathsSync(srcpath, dstpath);
		srcpath = relative.toDst;
		type = symlinkTypeSync(relative.toCwd, type);
		const dir = path$6.dirname(dstpath);
		if (fs.existsSync(dir)) return fs.symlinkSync(srcpath, dstpath, type);
		mkdirsSync(dir);
		return fs.symlinkSync(srcpath, dstpath, type);
	}
	module.exports = {
		createSymlink: u(createSymlink),
		createSymlinkSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/ensure/index.js
var require_ensure = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { createFile, createFileSync } = require_file();
	var { createLink, createLinkSync } = require_link();
	var { createSymlink, createSymlinkSync } = require_symlink();
	module.exports = {
		createFile,
		createFileSync,
		ensureFile: createFile,
		ensureFileSync: createFileSync,
		createLink,
		createLinkSync,
		ensureLink: createLink,
		ensureLinkSync: createLinkSync,
		createSymlink,
		createSymlinkSync,
		ensureSymlink: createSymlink,
		ensureSymlinkSync: createSymlinkSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/json/jsonfile.js
var require_jsonfile = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var jsonFile = require_jsonfile$2();
	module.exports = {
		readJson: jsonFile.readFile,
		readJsonSync: jsonFile.readFileSync,
		writeJson: jsonFile.writeFile,
		writeJsonSync: jsonFile.writeFileSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/output-file/index.js
var require_output_file = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	var fs = require_graceful_fs();
	var path$5 = require("path");
	var mkdir = require_mkdirs();
	var pathExists = require_path_exists().pathExists;
	function outputFile(file, data, encoding, callback) {
		if (typeof encoding === "function") {
			callback = encoding;
			encoding = "utf8";
		}
		const dir = path$5.dirname(file);
		pathExists(dir, (err, itDoes) => {
			if (err) return callback(err);
			if (itDoes) return fs.writeFile(file, data, encoding, callback);
			mkdir.mkdirs(dir, (err) => {
				if (err) return callback(err);
				fs.writeFile(file, data, encoding, callback);
			});
		});
	}
	function outputFileSync(file, ...args) {
		const dir = path$5.dirname(file);
		if (fs.existsSync(dir)) return fs.writeFileSync(file, ...args);
		mkdir.mkdirsSync(dir);
		fs.writeFileSync(file, ...args);
	}
	module.exports = {
		outputFile: u(outputFile),
		outputFileSync
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/json/output-json.js
var require_output_json = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { stringify } = require_utils$1();
	var { outputFile } = require_output_file();
	async function outputJson(file, data, options = {}) {
		await outputFile(file, stringify(data, options), options);
	}
	module.exports = outputJson;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/json/output-json-sync.js
var require_output_json_sync = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var { stringify } = require_utils$1();
	var { outputFileSync } = require_output_file();
	function outputJsonSync(file, data, options) {
		outputFileSync(file, stringify(data, options), options);
	}
	module.exports = outputJsonSync;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/json/index.js
var require_json = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromPromise;
	var jsonFile = require_jsonfile();
	jsonFile.outputJson = u(require_output_json());
	jsonFile.outputJsonSync = require_output_json_sync();
	jsonFile.outputJSON = jsonFile.outputJson;
	jsonFile.outputJSONSync = jsonFile.outputJsonSync;
	jsonFile.writeJSON = jsonFile.writeJson;
	jsonFile.writeJSONSync = jsonFile.writeJsonSync;
	jsonFile.readJSON = jsonFile.readJson;
	jsonFile.readJSONSync = jsonFile.readJsonSync;
	module.exports = jsonFile;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/move/move.js
var require_move$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$4 = require("path");
	var copy = require_copy().copy;
	var remove = require_remove().remove;
	var mkdirp = require_mkdirs().mkdirp;
	var pathExists = require_path_exists().pathExists;
	var stat = require_stat();
	function move(src, dest, opts, cb) {
		if (typeof opts === "function") {
			cb = opts;
			opts = {};
		}
		opts = opts || {};
		const overwrite = opts.overwrite || opts.clobber || false;
		stat.checkPaths(src, dest, "move", opts, (err, stats) => {
			if (err) return cb(err);
			const { srcStat, isChangingCase = false } = stats;
			stat.checkParentPaths(src, srcStat, dest, "move", (err) => {
				if (err) return cb(err);
				if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb);
				mkdirp(path$4.dirname(dest), (err) => {
					if (err) return cb(err);
					return doRename(src, dest, overwrite, isChangingCase, cb);
				});
			});
		});
	}
	function isParentRoot(dest) {
		const parent = path$4.dirname(dest);
		return path$4.parse(parent).root === parent;
	}
	function doRename(src, dest, overwrite, isChangingCase, cb) {
		if (isChangingCase) return rename(src, dest, overwrite, cb);
		if (overwrite) return remove(dest, (err) => {
			if (err) return cb(err);
			return rename(src, dest, overwrite, cb);
		});
		pathExists(dest, (err, destExists) => {
			if (err) return cb(err);
			if (destExists) return cb(/* @__PURE__ */ new Error("dest already exists."));
			return rename(src, dest, overwrite, cb);
		});
	}
	function rename(src, dest, overwrite, cb) {
		fs.rename(src, dest, (err) => {
			if (!err) return cb();
			if (err.code !== "EXDEV") return cb(err);
			return moveAcrossDevice(src, dest, overwrite, cb);
		});
	}
	function moveAcrossDevice(src, dest, overwrite, cb) {
		copy(src, dest, {
			overwrite,
			errorOnExist: true
		}, (err) => {
			if (err) return cb(err);
			return remove(src, cb);
		});
	}
	module.exports = move;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/move/move-sync.js
var require_move_sync = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var fs = require_graceful_fs();
	var path$3 = require("path");
	var copySync = require_copy().copySync;
	var removeSync = require_remove().removeSync;
	var mkdirpSync = require_mkdirs().mkdirpSync;
	var stat = require_stat();
	function moveSync(src, dest, opts) {
		opts = opts || {};
		const overwrite = opts.overwrite || opts.clobber || false;
		const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, "move", opts);
		stat.checkParentPathsSync(src, srcStat, dest, "move");
		if (!isParentRoot(dest)) mkdirpSync(path$3.dirname(dest));
		return doRename(src, dest, overwrite, isChangingCase);
	}
	function isParentRoot(dest) {
		const parent = path$3.dirname(dest);
		return path$3.parse(parent).root === parent;
	}
	function doRename(src, dest, overwrite, isChangingCase) {
		if (isChangingCase) return rename(src, dest, overwrite);
		if (overwrite) {
			removeSync(dest);
			return rename(src, dest, overwrite);
		}
		if (fs.existsSync(dest)) throw new Error("dest already exists.");
		return rename(src, dest, overwrite);
	}
	function rename(src, dest, overwrite) {
		try {
			fs.renameSync(src, dest);
		} catch (err) {
			if (err.code !== "EXDEV") throw err;
			return moveAcrossDevice(src, dest, overwrite);
		}
	}
	function moveAcrossDevice(src, dest, overwrite) {
		copySync(src, dest, {
			overwrite,
			errorOnExist: true
		});
		return removeSync(src);
	}
	module.exports = moveSync;
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/move/index.js
var require_move = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var u = require_universalify().fromCallback;
	module.exports = {
		move: u(require_move$1()),
		moveSync: require_move_sync()
	};
}));
//#endregion
//#region node_modules/flora-colossus/node_modules/fs-extra/lib/index.js
var require_lib$3 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	module.exports = {
		...require_fs(),
		...require_copy(),
		...require_empty(),
		...require_ensure(),
		...require_json(),
		...require_mkdirs(),
		...require_move(),
		...require_output_file(),
		...require_path_exists(),
		...require_remove()
	};
}));
//#endregion
//#region node_modules/flora-colossus/lib/depTypes.js
var require_depTypes = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.childDepType = exports.depTypeGreater = exports.DepType = void 0;
	var DepType;
	(function(DepType) {
		DepType[DepType["PROD"] = 0] = "PROD";
		DepType[DepType["DEV"] = 1] = "DEV";
		DepType[DepType["OPTIONAL"] = 2] = "OPTIONAL";
		DepType[DepType["DEV_OPTIONAL"] = 3] = "DEV_OPTIONAL";
		DepType[DepType["ROOT"] = 4] = "ROOT";
	})(DepType = exports.DepType || (exports.DepType = {}));
	var depTypeGreater = (newType, existing) => {
		switch (existing) {
			case DepType.DEV: switch (newType) {
				case DepType.OPTIONAL:
				case DepType.PROD:
				case DepType.ROOT: return true;
				case DepType.DEV:
				case DepType.DEV_OPTIONAL:
				default: return false;
			}
			case DepType.DEV_OPTIONAL: switch (newType) {
				case DepType.OPTIONAL:
				case DepType.PROD:
				case DepType.ROOT:
				case DepType.DEV: return true;
				case DepType.DEV_OPTIONAL:
				default: return false;
			}
			case DepType.OPTIONAL: switch (newType) {
				case DepType.PROD:
				case DepType.ROOT: return true;
				case DepType.OPTIONAL:
				case DepType.DEV:
				case DepType.DEV_OPTIONAL:
				default: return false;
			}
			case DepType.PROD: switch (newType) {
				case DepType.ROOT: return true;
				case DepType.PROD:
				case DepType.OPTIONAL:
				case DepType.DEV:
				case DepType.DEV_OPTIONAL:
				default: return false;
			}
			case DepType.ROOT: switch (newType) {
				case DepType.ROOT:
				case DepType.PROD:
				case DepType.OPTIONAL:
				case DepType.DEV:
				case DepType.DEV_OPTIONAL:
				default: return false;
			}
			default: return false;
		}
	};
	exports.depTypeGreater = depTypeGreater;
	var childDepType = (parentType, childType) => {
		if (childType === DepType.ROOT) throw new Error("Something went wrong, a child dependency can't be marked as the ROOT");
		switch (parentType) {
			case DepType.ROOT: return childType;
			case DepType.PROD:
				if (childType === DepType.OPTIONAL) return DepType.OPTIONAL;
				return DepType.PROD;
			case DepType.OPTIONAL: return DepType.OPTIONAL;
			case DepType.DEV_OPTIONAL: return DepType.DEV_OPTIONAL;
			case DepType.DEV:
				if (childType === DepType.OPTIONAL) return DepType.DEV_OPTIONAL;
				return DepType.DEV;
		}
	};
	exports.childDepType = childDepType;
}));
//#endregion
//#region node_modules/flora-colossus/lib/nativeModuleTypes.js
var require_nativeModuleTypes = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NativeModuleType = void 0;
	(function(NativeModuleType) {
		NativeModuleType[NativeModuleType["NONE"] = 0] = "NONE";
		NativeModuleType[NativeModuleType["NODE_GYP"] = 1] = "NODE_GYP";
		NativeModuleType[NativeModuleType["PREBUILD"] = 2] = "PREBUILD";
	})(exports.NativeModuleType || (exports.NativeModuleType = {}));
}));
//#endregion
//#region node_modules/flora-colossus/lib/Walker.js
var require_Walker = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Walker = void 0;
	var debug = require_src();
	var fs = require_lib$3();
	var path$2 = require("path");
	var depTypes_1 = require_depTypes();
	var nativeModuleTypes_1 = require_nativeModuleTypes();
	var d = debug("flora-colossus");
	var Walker = class {
		constructor(modulePath) {
			this.modules = [];
			this.walkHistory = /* @__PURE__ */ new Set();
			this.cache = null;
			if (!modulePath || typeof modulePath !== "string") throw new Error("modulePath must be provided as a string");
			d(`creating walker with rootModule=${modulePath}`);
			this.rootModule = modulePath;
		}
		relativeModule(rootPath, moduleName) {
			return path$2.resolve(rootPath, "node_modules", moduleName);
		}
		async loadPackageJSON(modulePath) {
			const pJPath = path$2.resolve(modulePath, "package.json");
			if (await fs.pathExists(pJPath)) {
				const pJ = await fs.readJson(pJPath);
				if (!pJ.dependencies) pJ.dependencies = {};
				if (!pJ.devDependencies) pJ.devDependencies = {};
				if (!pJ.optionalDependencies) pJ.optionalDependencies = {};
				return pJ;
			}
			return null;
		}
		async walkDependenciesForModuleInModule(moduleName, modulePath, depType) {
			let testPath = modulePath;
			let discoveredPath = null;
			let lastRelative = null;
			while (!discoveredPath && this.relativeModule(testPath, moduleName) !== lastRelative) {
				lastRelative = this.relativeModule(testPath, moduleName);
				if (await fs.pathExists(lastRelative)) discoveredPath = lastRelative;
				else {
					if (path$2.basename(path$2.dirname(testPath)) !== "node_modules") testPath = path$2.dirname(testPath);
					testPath = path$2.dirname(path$2.dirname(testPath));
				}
			}
			if (!discoveredPath && depType !== depTypes_1.DepType.OPTIONAL && depType !== depTypes_1.DepType.DEV_OPTIONAL) throw new Error(`Failed to locate module "${moduleName}" from "${modulePath}"

        This normally means that either you have deleted this package already somehow (check your ignore settings if using electron-packager).  Or your module installation failed.`);
			if (discoveredPath) await this.walkDependenciesForModule(discoveredPath, depType);
		}
		async detectNativeModuleType(modulePath, pJ) {
			if (pJ.dependencies["prebuild-install"]) return nativeModuleTypes_1.NativeModuleType.PREBUILD;
			else if (await fs.pathExists(path$2.join(modulePath, "binding.gyp"))) return nativeModuleTypes_1.NativeModuleType.NODE_GYP;
			return nativeModuleTypes_1.NativeModuleType.NONE;
		}
		async walkDependenciesForModule(modulePath, depType) {
			d("walk reached:", modulePath, " Type is:", depTypes_1.DepType[depType]);
			if (this.walkHistory.has(modulePath)) {
				d("already walked this route");
				const existingModule = this.modules.find((module$3) => module$3.path === modulePath);
				if ((0, depTypes_1.depTypeGreater)(depType, existingModule.depType)) {
					d(`existing module has a type of "${existingModule.depType}", new module type would be "${depType}" therefore updating`);
					existingModule.depType = depType;
				}
				return;
			}
			const pJ = await this.loadPackageJSON(modulePath);
			if (!pJ) {
				d("walk hit a dead end, this module is incomplete");
				return;
			}
			this.walkHistory.add(modulePath);
			this.modules.push({
				depType,
				nativeModuleType: await this.detectNativeModuleType(modulePath, pJ),
				path: modulePath,
				name: pJ.name
			});
			for (const moduleName in pJ.dependencies) {
				if (moduleName in pJ.optionalDependencies) {
					d(`found ${moduleName} in prod deps of ${modulePath} but it is also marked optional`);
					continue;
				}
				await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.PROD));
			}
			for (const moduleName in pJ.optionalDependencies) await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.OPTIONAL));
			if (depType === depTypes_1.DepType.ROOT) {
				d("we're still at the beginning, walking down the dev route");
				for (const moduleName in pJ.devDependencies) await this.walkDependenciesForModuleInModule(moduleName, modulePath, (0, depTypes_1.childDepType)(depType, depTypes_1.DepType.DEV));
			}
		}
		async walkTree() {
			d("starting tree walk");
			if (!this.cache) this.cache = new Promise(async (resolve, reject) => {
				this.modules = [];
				try {
					await this.walkDependenciesForModule(this.rootModule, depTypes_1.DepType.ROOT);
				} catch (err) {
					reject(err);
					return;
				}
				resolve(this.modules);
			});
			else d("tree walk in progress / completed already, waiting for existing walk to complete");
			return await this.cache;
		}
		getRootModule() {
			return this.rootModule;
		}
	};
	exports.Walker = Walker;
}));
//#endregion
//#region node_modules/flora-colossus/lib/index.js
var require_lib$2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_Walker(), exports);
	__exportStar(require_depTypes(), exports);
}));
//#endregion
//#region node_modules/galactus/lib/DestroyerOfModules.js
var require_DestroyerOfModules = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DestroyerOfModules = void 0;
	var fs = require_lib$4();
	var path$1 = require("path");
	var flora_colossus_1 = require_lib$2();
	var DestroyerOfModules = class {
		constructor({ rootDirectory, walker, shouldKeepModuleTest }) {
			if (rootDirectory) this.walker = new flora_colossus_1.Walker(rootDirectory);
			else if (walker) this.walker = walker;
			else throw new Error("Must either provide rootDirectory or walker argument");
			if (shouldKeepModuleTest) this.shouldKeepFn = shouldKeepModuleTest;
		}
		async destroyModule(modulePath, moduleMap) {
			if (moduleMap.get(modulePath)) {
				const nodeModulesPath = path$1.resolve(modulePath, "node_modules");
				if (!await fs.pathExists(nodeModulesPath)) return;
				for (const subModuleName of await fs.readdir(nodeModulesPath)) if (subModuleName.startsWith("@")) for (const subScopedModuleName of await fs.readdir(path$1.resolve(nodeModulesPath, subModuleName))) await this.destroyModule(path$1.resolve(nodeModulesPath, subModuleName, subScopedModuleName), moduleMap);
				else await this.destroyModule(path$1.resolve(nodeModulesPath, subModuleName), moduleMap);
			} else await fs.remove(modulePath);
		}
		async collectKeptModules({ relativePaths = false }) {
			const modules = await this.walker.walkTree();
			const moduleMap = /* @__PURE__ */ new Map();
			const rootPath = path$1.resolve(this.walker.getRootModule());
			for (const module$1 of modules) if (this.shouldKeepModule(module$1)) {
				let modulePath = module$1.path;
				if (relativePaths) modulePath = modulePath.replace(`${rootPath}${path$1.sep}`, "");
				moduleMap.set(modulePath, module$1);
			}
			return moduleMap;
		}
		async destroy() {
			await this.destroyModule(this.walker.getRootModule(), await this.collectKeptModules({ relativePaths: false }));
		}
		shouldKeepModule(module$2) {
			const isDevDep = module$2.depType === flora_colossus_1.DepType.DEV || module$2.depType === flora_colossus_1.DepType.DEV_OPTIONAL;
			return this.shouldKeepFn ? this.shouldKeepFn(module$2, isDevDep) : !isDevDep;
		}
	};
	exports.DestroyerOfModules = DestroyerOfModules;
}));
//#endregion
//#region node_modules/galactus/lib/index.js
var require_lib$1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_DestroyerOfModules(), exports);
	__exportStar(require_lib$2(), exports);
}));
//#endregion
//#region node_modules/pretty-bytes/index.js
var require_pretty_bytes = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var BYTE_UNITS = [
		"B",
		"kB",
		"MB",
		"GB",
		"TB",
		"PB",
		"EB",
		"ZB",
		"YB"
	];
	var BIBYTE_UNITS = [
		"B",
		"kiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB"
	];
	var BIT_UNITS = [
		"b",
		"kbit",
		"Mbit",
		"Gbit",
		"Tbit",
		"Pbit",
		"Ebit",
		"Zbit",
		"Ybit"
	];
	var BIBIT_UNITS = [
		"b",
		"kibit",
		"Mibit",
		"Gibit",
		"Tibit",
		"Pibit",
		"Eibit",
		"Zibit",
		"Yibit"
	];
	var toLocaleString = (number, locale, options) => {
		let result = number;
		if (typeof locale === "string" || Array.isArray(locale)) result = number.toLocaleString(locale, options);
		else if (locale === true || options !== void 0) result = number.toLocaleString(void 0, options);
		return result;
	};
	module.exports = (number, options) => {
		if (!Number.isFinite(number)) throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
		options = Object.assign({
			bits: false,
			binary: false
		}, options);
		const UNITS = options.bits ? options.binary ? BIBIT_UNITS : BIT_UNITS : options.binary ? BIBYTE_UNITS : BYTE_UNITS;
		if (options.signed && number === 0) return ` 0 ${UNITS[0]}`;
		const isNegative = number < 0;
		const prefix = isNegative ? "-" : options.signed ? "+" : "";
		if (isNegative) number = -number;
		let localeOptions;
		if (options.minimumFractionDigits !== void 0) localeOptions = { minimumFractionDigits: options.minimumFractionDigits };
		if (options.maximumFractionDigits !== void 0) localeOptions = Object.assign({ maximumFractionDigits: options.maximumFractionDigits }, localeOptions);
		if (number < 1) return prefix + toLocaleString(number, options.locale, localeOptions) + " " + UNITS[0];
		const exponent = Math.min(Math.floor(options.binary ? Math.log(number) / Math.log(1024) : Math.log10(number) / 3), UNITS.length - 1);
		number /= Math.pow(options.binary ? 1024 : 1e3, exponent);
		if (!localeOptions) number = number.toPrecision(3);
		const numberString = toLocaleString(Number(number), options.locale, localeOptions);
		const unit = UNITS[exponent];
		return prefix + numberString + " " + unit;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/forge.js
var require_forge = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Node.js module for Forge.
	*
	* @author Dave Longley
	*
	* Copyright 2011-2016 Digital Bazaar, Inc.
	*/
	module.exports = { options: { usePureJavaScript: false } };
}));
//#endregion
//#region node_modules/node-forge/lib/baseN.js
var require_baseN = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Base-N/Base-X encoding/decoding functions.
	*
	* Original implementation from base-x:
	* https://github.com/cryptocoinjs/base-x
	*
	* Which is MIT licensed:
	*
	* The MIT License (MIT)
	*
	* Copyright base-x contributors (c) 2016
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in
	* all copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
	* DEALINGS IN THE SOFTWARE.
	*/
	var api = {};
	module.exports = api;
	var _reverseAlphabets = {};
	/**
	* BaseN-encodes a Uint8Array using the given alphabet.
	*
	* @param input the Uint8Array to encode.
	* @param maxline the maximum number of encoded characters per line to use,
	*          defaults to none.
	*
	* @return the baseN-encoded output string.
	*/
	api.encode = function(input, alphabet, maxline) {
		if (typeof alphabet !== "string") throw new TypeError("\"alphabet\" must be a string.");
		if (maxline !== void 0 && typeof maxline !== "number") throw new TypeError("\"maxline\" must be a number.");
		var output = "";
		if (!(input instanceof Uint8Array)) output = _encodeWithByteBuffer(input, alphabet);
		else {
			var i = 0;
			var base = alphabet.length;
			var first = alphabet.charAt(0);
			var digits = [0];
			for (i = 0; i < input.length; ++i) {
				for (var j = 0, carry = input[i]; j < digits.length; ++j) {
					carry += digits[j] << 8;
					digits[j] = carry % base;
					carry = carry / base | 0;
				}
				while (carry > 0) {
					digits.push(carry % base);
					carry = carry / base | 0;
				}
			}
			for (i = 0; input[i] === 0 && i < input.length - 1; ++i) output += first;
			for (i = digits.length - 1; i >= 0; --i) output += alphabet[digits[i]];
		}
		if (maxline) {
			var regex = new RegExp(".{1," + maxline + "}", "g");
			output = output.match(regex).join("\r\n");
		}
		return output;
	};
	/**
	* Decodes a baseN-encoded (using the given alphabet) string to a
	* Uint8Array.
	*
	* @param input the baseN-encoded input string.
	*
	* @return the Uint8Array.
	*/
	api.decode = function(input, alphabet) {
		if (typeof input !== "string") throw new TypeError("\"input\" must be a string.");
		if (typeof alphabet !== "string") throw new TypeError("\"alphabet\" must be a string.");
		var table = _reverseAlphabets[alphabet];
		if (!table) {
			table = _reverseAlphabets[alphabet] = [];
			for (var i = 0; i < alphabet.length; ++i) table[alphabet.charCodeAt(i)] = i;
		}
		input = input.replace(/\s/g, "");
		var base = alphabet.length;
		var first = alphabet.charAt(0);
		var bytes = [0];
		for (var i = 0; i < input.length; i++) {
			var value = table[input.charCodeAt(i)];
			if (value === void 0) return;
			for (var j = 0, carry = value; j < bytes.length; ++j) {
				carry += bytes[j] * base;
				bytes[j] = carry & 255;
				carry >>= 8;
			}
			while (carry > 0) {
				bytes.push(carry & 255);
				carry >>= 8;
			}
		}
		for (var k = 0; input[k] === first && k < input.length - 1; ++k) bytes.push(0);
		if (typeof Buffer !== "undefined") return Buffer.from(bytes.reverse());
		return new Uint8Array(bytes.reverse());
	};
	function _encodeWithByteBuffer(input, alphabet) {
		var i = 0;
		var base = alphabet.length;
		var first = alphabet.charAt(0);
		var digits = [0];
		for (i = 0; i < input.length(); ++i) {
			for (var j = 0, carry = input.at(i); j < digits.length; ++j) {
				carry += digits[j] << 8;
				digits[j] = carry % base;
				carry = carry / base | 0;
			}
			while (carry > 0) {
				digits.push(carry % base);
				carry = carry / base | 0;
			}
		}
		var output = "";
		for (i = 0; input.at(i) === 0 && i < input.length() - 1; ++i) output += first;
		for (i = digits.length - 1; i >= 0; --i) output += alphabet[digits[i]];
		return output;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/util.js
var require_util = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Utility functions for web applications.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2018 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	var baseN = require_baseN();
	var util = module.exports = forge.util = forge.util || {};
	(function() {
		if (typeof process !== "undefined" && process.nextTick && !process.browser) {
			util.nextTick = process.nextTick;
			if (typeof setImmediate === "function") util.setImmediate = setImmediate;
			else util.setImmediate = util.nextTick;
			return;
		}
		if (typeof setImmediate === "function") {
			util.setImmediate = function() {
				return setImmediate.apply(void 0, arguments);
			};
			util.nextTick = function(callback) {
				return setImmediate(callback);
			};
			return;
		}
		util.setImmediate = function(callback) {
			setTimeout(callback, 0);
		};
		if (typeof window !== "undefined" && typeof window.postMessage === "function") {
			var msg = "forge.setImmediate";
			var callbacks = [];
			util.setImmediate = function(callback) {
				callbacks.push(callback);
				if (callbacks.length === 1) window.postMessage(msg, "*");
			};
			function handler(event) {
				if (event.source === window && event.data === msg) {
					event.stopPropagation();
					var copy = callbacks.slice();
					callbacks.length = 0;
					copy.forEach(function(callback) {
						callback();
					});
				}
			}
			window.addEventListener("message", handler, true);
		}
		if (typeof MutationObserver !== "undefined") {
			var now = Date.now();
			var attr = true;
			var div = document.createElement("div");
			var callbacks = [];
			new MutationObserver(function() {
				var copy = callbacks.slice();
				callbacks.length = 0;
				copy.forEach(function(callback) {
					callback();
				});
			}).observe(div, { attributes: true });
			var oldSetImmediate = util.setImmediate;
			util.setImmediate = function(callback) {
				if (Date.now() - now > 15) {
					now = Date.now();
					oldSetImmediate(callback);
				} else {
					callbacks.push(callback);
					if (callbacks.length === 1) div.setAttribute("a", attr = !attr);
				}
			};
		}
		util.nextTick = util.setImmediate;
	})();
	util.isNodejs = typeof process !== "undefined" && process.versions && process.versions.node;
	util.globalScope = (function() {
		if (util.isNodejs) return global;
		return typeof self === "undefined" ? window : self;
	})();
	util.isArray = Array.isArray || function(x) {
		return Object.prototype.toString.call(x) === "[object Array]";
	};
	util.isArrayBuffer = function(x) {
		return typeof ArrayBuffer !== "undefined" && x instanceof ArrayBuffer;
	};
	util.isArrayBufferView = function(x) {
		return x && util.isArrayBuffer(x.buffer) && x.byteLength !== void 0;
	};
	/**
	* Ensure a bits param is 8, 16, 24, or 32. Used to validate input for
	* algorithms where bit manipulation, JavaScript limitations, and/or algorithm
	* design only allow for byte operations of a limited size.
	*
	* @param n number of bits.
	*
	* Throw Error if n invalid.
	*/
	function _checkBitsParam(n) {
		if (!(n === 8 || n === 16 || n === 24 || n === 32)) throw new Error("Only 8, 16, 24, or 32 bits supported: " + n);
	}
	util.ByteBuffer = ByteStringBuffer;
	/** Buffer w/BinaryString backing */
	/**
	* Constructor for a binary string backed byte buffer.
	*
	* @param [b] the bytes to wrap (either encoded as string, one byte per
	*          character, or as an ArrayBuffer or Typed Array).
	*/
	function ByteStringBuffer(b) {
		this.data = "";
		this.read = 0;
		if (typeof b === "string") this.data = b;
		else if (util.isArrayBuffer(b) || util.isArrayBufferView(b)) if (typeof Buffer !== "undefined" && b instanceof Buffer) this.data = b.toString("binary");
		else {
			var arr = new Uint8Array(b);
			try {
				this.data = String.fromCharCode.apply(null, arr);
			} catch (e) {
				for (var i = 0; i < arr.length; ++i) this.putByte(arr[i]);
			}
		}
		else if (b instanceof ByteStringBuffer || typeof b === "object" && typeof b.data === "string" && typeof b.read === "number") {
			this.data = b.data;
			this.read = b.read;
		}
		this._constructedStringLength = 0;
	}
	util.ByteStringBuffer = ByteStringBuffer;
	var _MAX_CONSTRUCTED_STRING_LENGTH = 4096;
	util.ByteStringBuffer.prototype._optimizeConstructedString = function(x) {
		this._constructedStringLength += x;
		if (this._constructedStringLength > _MAX_CONSTRUCTED_STRING_LENGTH) {
			this.data.substr(0, 1);
			this._constructedStringLength = 0;
		}
	};
	/**
	* Gets the number of bytes in this buffer.
	*
	* @return the number of bytes in this buffer.
	*/
	util.ByteStringBuffer.prototype.length = function() {
		return this.data.length - this.read;
	};
	/**
	* Gets whether or not this buffer is empty.
	*
	* @return true if this buffer is empty, false if not.
	*/
	util.ByteStringBuffer.prototype.isEmpty = function() {
		return this.length() <= 0;
	};
	/**
	* Puts a byte in this buffer.
	*
	* @param b the byte to put.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putByte = function(b) {
		return this.putBytes(String.fromCharCode(b));
	};
	/**
	* Puts a byte in this buffer N times.
	*
	* @param b the byte to put.
	* @param n the number of bytes of value b to put.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.fillWithByte = function(b, n) {
		b = String.fromCharCode(b);
		var d = this.data;
		while (n > 0) {
			if (n & 1) d += b;
			n >>>= 1;
			if (n > 0) b += b;
		}
		this.data = d;
		this._optimizeConstructedString(n);
		return this;
	};
	/**
	* Puts bytes in this buffer.
	*
	* @param bytes the bytes (as a binary encoded string) to put.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putBytes = function(bytes) {
		this.data += bytes;
		this._optimizeConstructedString(bytes.length);
		return this;
	};
	/**
	* Puts a UTF-16 encoded string into this buffer.
	*
	* @param str the string to put.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putString = function(str) {
		return this.putBytes(util.encodeUtf8(str));
	};
	/**
	* Puts a 16-bit integer in this buffer in big-endian order.
	*
	* @param i the 16-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt16 = function(i) {
		return this.putBytes(String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
	};
	/**
	* Puts a 24-bit integer in this buffer in big-endian order.
	*
	* @param i the 24-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt24 = function(i) {
		return this.putBytes(String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
	};
	/**
	* Puts a 32-bit integer in this buffer in big-endian order.
	*
	* @param i the 32-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt32 = function(i) {
		return this.putBytes(String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255));
	};
	/**
	* Puts a 16-bit integer in this buffer in little-endian order.
	*
	* @param i the 16-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt16Le = function(i) {
		return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255));
	};
	/**
	* Puts a 24-bit integer in this buffer in little-endian order.
	*
	* @param i the 24-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt24Le = function(i) {
		return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255));
	};
	/**
	* Puts a 32-bit integer in this buffer in little-endian order.
	*
	* @param i the 32-bit integer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt32Le = function(i) {
		return this.putBytes(String.fromCharCode(i & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 24 & 255));
	};
	/**
	* Puts an n-bit integer in this buffer in big-endian order.
	*
	* @param i the n-bit integer.
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putInt = function(i, n) {
		_checkBitsParam(n);
		var bytes = "";
		do {
			n -= 8;
			bytes += String.fromCharCode(i >> n & 255);
		} while (n > 0);
		return this.putBytes(bytes);
	};
	/**
	* Puts a signed n-bit integer in this buffer in big-endian order. Two's
	* complement representation is used.
	*
	* @param i the n-bit integer.
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putSignedInt = function(i, n) {
		if (i < 0) i += 2 << n - 1;
		return this.putInt(i, n);
	};
	/**
	* Puts the given buffer into this buffer.
	*
	* @param buffer the buffer to put into this one.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.putBuffer = function(buffer) {
		return this.putBytes(buffer.getBytes());
	};
	/**
	* Gets a byte from this buffer and advances the read pointer by 1.
	*
	* @return the byte.
	*/
	util.ByteStringBuffer.prototype.getByte = function() {
		return this.data.charCodeAt(this.read++);
	};
	/**
	* Gets a uint16 from this buffer in big-endian order and advances the read
	* pointer by 2.
	*
	* @return the uint16.
	*/
	util.ByteStringBuffer.prototype.getInt16 = function() {
		var rval = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
		this.read += 2;
		return rval;
	};
	/**
	* Gets a uint24 from this buffer in big-endian order and advances the read
	* pointer by 3.
	*
	* @return the uint24.
	*/
	util.ByteStringBuffer.prototype.getInt24 = function() {
		var rval = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
		this.read += 3;
		return rval;
	};
	/**
	* Gets a uint32 from this buffer in big-endian order and advances the read
	* pointer by 4.
	*
	* @return the word.
	*/
	util.ByteStringBuffer.prototype.getInt32 = function() {
		var rval = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
		this.read += 4;
		return rval;
	};
	/**
	* Gets a uint16 from this buffer in little-endian order and advances the read
	* pointer by 2.
	*
	* @return the uint16.
	*/
	util.ByteStringBuffer.prototype.getInt16Le = function() {
		var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
		this.read += 2;
		return rval;
	};
	/**
	* Gets a uint24 from this buffer in little-endian order and advances the read
	* pointer by 3.
	*
	* @return the uint24.
	*/
	util.ByteStringBuffer.prototype.getInt24Le = function() {
		var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
		this.read += 3;
		return rval;
	};
	/**
	* Gets a uint32 from this buffer in little-endian order and advances the read
	* pointer by 4.
	*
	* @return the word.
	*/
	util.ByteStringBuffer.prototype.getInt32Le = function() {
		var rval = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
		this.read += 4;
		return rval;
	};
	/**
	* Gets an n-bit integer from this buffer in big-endian order and advances the
	* read pointer by ceil(n/8).
	*
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return the integer.
	*/
	util.ByteStringBuffer.prototype.getInt = function(n) {
		_checkBitsParam(n);
		var rval = 0;
		do {
			rval = (rval << 8) + this.data.charCodeAt(this.read++);
			n -= 8;
		} while (n > 0);
		return rval;
	};
	/**
	* Gets a signed n-bit integer from this buffer in big-endian order, using
	* two's complement, and advances the read pointer by n/8.
	*
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return the integer.
	*/
	util.ByteStringBuffer.prototype.getSignedInt = function(n) {
		var x = this.getInt(n);
		var max = 2 << n - 2;
		if (x >= max) x -= max << 1;
		return x;
	};
	/**
	* Reads bytes out as a binary encoded string and clears them from the
	* buffer. Note that the resulting string is binary encoded (in node.js this
	* encoding is referred to as `binary`, it is *not* `utf8`).
	*
	* @param count the number of bytes to read, undefined or null for all.
	*
	* @return a binary encoded string of bytes.
	*/
	util.ByteStringBuffer.prototype.getBytes = function(count) {
		var rval;
		if (count) {
			count = Math.min(this.length(), count);
			rval = this.data.slice(this.read, this.read + count);
			this.read += count;
		} else if (count === 0) rval = "";
		else {
			rval = this.read === 0 ? this.data : this.data.slice(this.read);
			this.clear();
		}
		return rval;
	};
	/**
	* Gets a binary encoded string of the bytes from this buffer without
	* modifying the read pointer.
	*
	* @param count the number of bytes to get, omit to get all.
	*
	* @return a string full of binary encoded characters.
	*/
	util.ByteStringBuffer.prototype.bytes = function(count) {
		return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
	};
	/**
	* Gets a byte at the given index without modifying the read pointer.
	*
	* @param i the byte index.
	*
	* @return the byte.
	*/
	util.ByteStringBuffer.prototype.at = function(i) {
		return this.data.charCodeAt(this.read + i);
	};
	/**
	* Puts a byte at the given index without modifying the read pointer.
	*
	* @param i the byte index.
	* @param b the byte to put.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.setAt = function(i, b) {
		this.data = this.data.substr(0, this.read + i) + String.fromCharCode(b) + this.data.substr(this.read + i + 1);
		return this;
	};
	/**
	* Gets the last byte without modifying the read pointer.
	*
	* @return the last byte.
	*/
	util.ByteStringBuffer.prototype.last = function() {
		return this.data.charCodeAt(this.data.length - 1);
	};
	/**
	* Creates a copy of this buffer.
	*
	* @return the copy.
	*/
	util.ByteStringBuffer.prototype.copy = function() {
		var c = util.createBuffer(this.data);
		c.read = this.read;
		return c;
	};
	/**
	* Compacts this buffer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.compact = function() {
		if (this.read > 0) {
			this.data = this.data.slice(this.read);
			this.read = 0;
		}
		return this;
	};
	/**
	* Clears this buffer.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.clear = function() {
		this.data = "";
		this.read = 0;
		return this;
	};
	/**
	* Shortens this buffer by trimming bytes off of the end of this buffer.
	*
	* @param count the number of bytes to trim off.
	*
	* @return this buffer.
	*/
	util.ByteStringBuffer.prototype.truncate = function(count) {
		var len = Math.max(0, this.length() - count);
		this.data = this.data.substr(this.read, len);
		this.read = 0;
		return this;
	};
	/**
	* Converts this buffer to a hexadecimal string.
	*
	* @return a hexadecimal string.
	*/
	util.ByteStringBuffer.prototype.toHex = function() {
		var rval = "";
		for (var i = this.read; i < this.data.length; ++i) {
			var b = this.data.charCodeAt(i);
			if (b < 16) rval += "0";
			rval += b.toString(16);
		}
		return rval;
	};
	/**
	* Converts this buffer to a UTF-16 string (standard JavaScript string).
	*
	* @return a UTF-16 string.
	*/
	util.ByteStringBuffer.prototype.toString = function() {
		return util.decodeUtf8(this.bytes());
	};
	/** End Buffer w/BinaryString backing */
	/** Buffer w/UInt8Array backing */
	/**
	* FIXME: Experimental. Do not use yet.
	*
	* Constructor for an ArrayBuffer-backed byte buffer.
	*
	* The buffer may be constructed from a string, an ArrayBuffer, DataView, or a
	* TypedArray.
	*
	* If a string is given, its encoding should be provided as an option,
	* otherwise it will default to 'binary'. A 'binary' string is encoded such
	* that each character is one byte in length and size.
	*
	* If an ArrayBuffer, DataView, or TypedArray is given, it will be used
	* *directly* without any copying. Note that, if a write to the buffer requires
	* more space, the buffer will allocate a new backing ArrayBuffer to
	* accommodate. The starting read and write offsets for the buffer may be
	* given as options.
	*
	* @param [b] the initial bytes for this buffer.
	* @param options the options to use:
	*          [readOffset] the starting read offset to use (default: 0).
	*          [writeOffset] the starting write offset to use (default: the
	*            length of the first parameter).
	*          [growSize] the minimum amount, in bytes, to grow the buffer by to
	*            accommodate writes (default: 1024).
	*          [encoding] the encoding ('binary', 'utf8', 'utf16', 'hex') for the
	*            first parameter, if it is a string (default: 'binary').
	*/
	function DataBuffer(b, options) {
		options = options || {};
		this.read = options.readOffset || 0;
		this.growSize = options.growSize || 1024;
		var isArrayBuffer = util.isArrayBuffer(b);
		var isArrayBufferView = util.isArrayBufferView(b);
		if (isArrayBuffer || isArrayBufferView) {
			if (isArrayBuffer) this.data = new DataView(b);
			else this.data = new DataView(b.buffer, b.byteOffset, b.byteLength);
			this.write = "writeOffset" in options ? options.writeOffset : this.data.byteLength;
			return;
		}
		this.data = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
		this.write = 0;
		if (b !== null && b !== void 0) this.putBytes(b);
		if ("writeOffset" in options) this.write = options.writeOffset;
	}
	util.DataBuffer = DataBuffer;
	/**
	* Gets the number of bytes in this buffer.
	*
	* @return the number of bytes in this buffer.
	*/
	util.DataBuffer.prototype.length = function() {
		return this.write - this.read;
	};
	/**
	* Gets whether or not this buffer is empty.
	*
	* @return true if this buffer is empty, false if not.
	*/
	util.DataBuffer.prototype.isEmpty = function() {
		return this.length() <= 0;
	};
	/**
	* Ensures this buffer has enough empty space to accommodate the given number
	* of bytes. An optional parameter may be given that indicates a minimum
	* amount to grow the buffer if necessary. If the parameter is not given,
	* the buffer will be grown by some previously-specified default amount
	* or heuristic.
	*
	* @param amount the number of bytes to accommodate.
	* @param [growSize] the minimum amount, in bytes, to grow the buffer by if
	*          necessary.
	*/
	util.DataBuffer.prototype.accommodate = function(amount, growSize) {
		if (this.length() >= amount) return this;
		growSize = Math.max(growSize || this.growSize, amount);
		var src = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
		var dst = new Uint8Array(this.length() + growSize);
		dst.set(src);
		this.data = new DataView(dst.buffer);
		return this;
	};
	/**
	* Puts a byte in this buffer.
	*
	* @param b the byte to put.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putByte = function(b) {
		this.accommodate(1);
		this.data.setUint8(this.write++, b);
		return this;
	};
	/**
	* Puts a byte in this buffer N times.
	*
	* @param b the byte to put.
	* @param n the number of bytes of value b to put.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.fillWithByte = function(b, n) {
		this.accommodate(n);
		for (var i = 0; i < n; ++i) this.data.setUint8(b);
		return this;
	};
	/**
	* Puts bytes in this buffer. The bytes may be given as a string, an
	* ArrayBuffer, a DataView, or a TypedArray.
	*
	* @param bytes the bytes to put.
	* @param [encoding] the encoding for the first parameter ('binary', 'utf8',
	*          'utf16', 'hex'), if it is a string (default: 'binary').
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putBytes = function(bytes, encoding) {
		if (util.isArrayBufferView(bytes)) {
			var src = new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			var len = src.byteLength - src.byteOffset;
			this.accommodate(len);
			var dst = new Uint8Array(this.data.buffer, this.write);
			dst.set(src);
			this.write += len;
			return this;
		}
		if (util.isArrayBuffer(bytes)) {
			var src = new Uint8Array(bytes);
			this.accommodate(src.byteLength);
			var dst = new Uint8Array(this.data.buffer);
			dst.set(src, this.write);
			this.write += src.byteLength;
			return this;
		}
		if (bytes instanceof util.DataBuffer || typeof bytes === "object" && typeof bytes.read === "number" && typeof bytes.write === "number" && util.isArrayBufferView(bytes.data)) {
			var src = new Uint8Array(bytes.data.byteLength, bytes.read, bytes.length());
			this.accommodate(src.byteLength);
			var dst = new Uint8Array(bytes.data.byteLength, this.write);
			dst.set(src);
			this.write += src.byteLength;
			return this;
		}
		if (bytes instanceof util.ByteStringBuffer) {
			bytes = bytes.data;
			encoding = "binary";
		}
		encoding = encoding || "binary";
		if (typeof bytes === "string") {
			var view;
			if (encoding === "hex") {
				this.accommodate(Math.ceil(bytes.length / 2));
				view = new Uint8Array(this.data.buffer, this.write);
				this.write += util.binary.hex.decode(bytes, view, this.write);
				return this;
			}
			if (encoding === "base64") {
				this.accommodate(Math.ceil(bytes.length / 4) * 3);
				view = new Uint8Array(this.data.buffer, this.write);
				this.write += util.binary.base64.decode(bytes, view, this.write);
				return this;
			}
			if (encoding === "utf8") {
				bytes = util.encodeUtf8(bytes);
				encoding = "binary";
			}
			if (encoding === "binary" || encoding === "raw") {
				this.accommodate(bytes.length);
				view = new Uint8Array(this.data.buffer, this.write);
				this.write += util.binary.raw.decode(view);
				return this;
			}
			if (encoding === "utf16") {
				this.accommodate(bytes.length * 2);
				view = new Uint16Array(this.data.buffer, this.write);
				this.write += util.text.utf16.encode(view);
				return this;
			}
			throw new Error("Invalid encoding: " + encoding);
		}
		throw Error("Invalid parameter: " + bytes);
	};
	/**
	* Puts the given buffer into this buffer.
	*
	* @param buffer the buffer to put into this one.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putBuffer = function(buffer) {
		this.putBytes(buffer);
		buffer.clear();
		return this;
	};
	/**
	* Puts a string into this buffer.
	*
	* @param str the string to put.
	* @param [encoding] the encoding for the string (default: 'utf16').
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putString = function(str) {
		return this.putBytes(str, "utf16");
	};
	/**
	* Puts a 16-bit integer in this buffer in big-endian order.
	*
	* @param i the 16-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt16 = function(i) {
		this.accommodate(2);
		this.data.setInt16(this.write, i);
		this.write += 2;
		return this;
	};
	/**
	* Puts a 24-bit integer in this buffer in big-endian order.
	*
	* @param i the 24-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt24 = function(i) {
		this.accommodate(3);
		this.data.setInt16(this.write, i >> 8 & 65535);
		this.data.setInt8(this.write, i >> 16 & 255);
		this.write += 3;
		return this;
	};
	/**
	* Puts a 32-bit integer in this buffer in big-endian order.
	*
	* @param i the 32-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt32 = function(i) {
		this.accommodate(4);
		this.data.setInt32(this.write, i);
		this.write += 4;
		return this;
	};
	/**
	* Puts a 16-bit integer in this buffer in little-endian order.
	*
	* @param i the 16-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt16Le = function(i) {
		this.accommodate(2);
		this.data.setInt16(this.write, i, true);
		this.write += 2;
		return this;
	};
	/**
	* Puts a 24-bit integer in this buffer in little-endian order.
	*
	* @param i the 24-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt24Le = function(i) {
		this.accommodate(3);
		this.data.setInt8(this.write, i >> 16 & 255);
		this.data.setInt16(this.write, i >> 8 & 65535, true);
		this.write += 3;
		return this;
	};
	/**
	* Puts a 32-bit integer in this buffer in little-endian order.
	*
	* @param i the 32-bit integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt32Le = function(i) {
		this.accommodate(4);
		this.data.setInt32(this.write, i, true);
		this.write += 4;
		return this;
	};
	/**
	* Puts an n-bit integer in this buffer in big-endian order.
	*
	* @param i the n-bit integer.
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putInt = function(i, n) {
		_checkBitsParam(n);
		this.accommodate(n / 8);
		do {
			n -= 8;
			this.data.setInt8(this.write++, i >> n & 255);
		} while (n > 0);
		return this;
	};
	/**
	* Puts a signed n-bit integer in this buffer in big-endian order. Two's
	* complement representation is used.
	*
	* @param i the n-bit integer.
	* @param n the number of bits in the integer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.putSignedInt = function(i, n) {
		_checkBitsParam(n);
		this.accommodate(n / 8);
		if (i < 0) i += 2 << n - 1;
		return this.putInt(i, n);
	};
	/**
	* Gets a byte from this buffer and advances the read pointer by 1.
	*
	* @return the byte.
	*/
	util.DataBuffer.prototype.getByte = function() {
		return this.data.getInt8(this.read++);
	};
	/**
	* Gets a uint16 from this buffer in big-endian order and advances the read
	* pointer by 2.
	*
	* @return the uint16.
	*/
	util.DataBuffer.prototype.getInt16 = function() {
		var rval = this.data.getInt16(this.read);
		this.read += 2;
		return rval;
	};
	/**
	* Gets a uint24 from this buffer in big-endian order and advances the read
	* pointer by 3.
	*
	* @return the uint24.
	*/
	util.DataBuffer.prototype.getInt24 = function() {
		var rval = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
		this.read += 3;
		return rval;
	};
	/**
	* Gets a uint32 from this buffer in big-endian order and advances the read
	* pointer by 4.
	*
	* @return the word.
	*/
	util.DataBuffer.prototype.getInt32 = function() {
		var rval = this.data.getInt32(this.read);
		this.read += 4;
		return rval;
	};
	/**
	* Gets a uint16 from this buffer in little-endian order and advances the read
	* pointer by 2.
	*
	* @return the uint16.
	*/
	util.DataBuffer.prototype.getInt16Le = function() {
		var rval = this.data.getInt16(this.read, true);
		this.read += 2;
		return rval;
	};
	/**
	* Gets a uint24 from this buffer in little-endian order and advances the read
	* pointer by 3.
	*
	* @return the uint24.
	*/
	util.DataBuffer.prototype.getInt24Le = function() {
		var rval = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, true) << 8;
		this.read += 3;
		return rval;
	};
	/**
	* Gets a uint32 from this buffer in little-endian order and advances the read
	* pointer by 4.
	*
	* @return the word.
	*/
	util.DataBuffer.prototype.getInt32Le = function() {
		var rval = this.data.getInt32(this.read, true);
		this.read += 4;
		return rval;
	};
	/**
	* Gets an n-bit integer from this buffer in big-endian order and advances the
	* read pointer by n/8.
	*
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return the integer.
	*/
	util.DataBuffer.prototype.getInt = function(n) {
		_checkBitsParam(n);
		var rval = 0;
		do {
			rval = (rval << 8) + this.data.getInt8(this.read++);
			n -= 8;
		} while (n > 0);
		return rval;
	};
	/**
	* Gets a signed n-bit integer from this buffer in big-endian order, using
	* two's complement, and advances the read pointer by n/8.
	*
	* @param n the number of bits in the integer (8, 16, 24, or 32).
	*
	* @return the integer.
	*/
	util.DataBuffer.prototype.getSignedInt = function(n) {
		var x = this.getInt(n);
		var max = 2 << n - 2;
		if (x >= max) x -= max << 1;
		return x;
	};
	/**
	* Reads bytes out as a binary encoded string and clears them from the
	* buffer.
	*
	* @param count the number of bytes to read, undefined or null for all.
	*
	* @return a binary encoded string of bytes.
	*/
	util.DataBuffer.prototype.getBytes = function(count) {
		var rval;
		if (count) {
			count = Math.min(this.length(), count);
			rval = this.data.slice(this.read, this.read + count);
			this.read += count;
		} else if (count === 0) rval = "";
		else {
			rval = this.read === 0 ? this.data : this.data.slice(this.read);
			this.clear();
		}
		return rval;
	};
	/**
	* Gets a binary encoded string of the bytes from this buffer without
	* modifying the read pointer.
	*
	* @param count the number of bytes to get, omit to get all.
	*
	* @return a string full of binary encoded characters.
	*/
	util.DataBuffer.prototype.bytes = function(count) {
		return typeof count === "undefined" ? this.data.slice(this.read) : this.data.slice(this.read, this.read + count);
	};
	/**
	* Gets a byte at the given index without modifying the read pointer.
	*
	* @param i the byte index.
	*
	* @return the byte.
	*/
	util.DataBuffer.prototype.at = function(i) {
		return this.data.getUint8(this.read + i);
	};
	/**
	* Puts a byte at the given index without modifying the read pointer.
	*
	* @param i the byte index.
	* @param b the byte to put.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.setAt = function(i, b) {
		this.data.setUint8(i, b);
		return this;
	};
	/**
	* Gets the last byte without modifying the read pointer.
	*
	* @return the last byte.
	*/
	util.DataBuffer.prototype.last = function() {
		return this.data.getUint8(this.write - 1);
	};
	/**
	* Creates a copy of this buffer.
	*
	* @return the copy.
	*/
	util.DataBuffer.prototype.copy = function() {
		return new util.DataBuffer(this);
	};
	/**
	* Compacts this buffer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.compact = function() {
		if (this.read > 0) {
			var src = new Uint8Array(this.data.buffer, this.read);
			var dst = new Uint8Array(src.byteLength);
			dst.set(src);
			this.data = new DataView(dst);
			this.write -= this.read;
			this.read = 0;
		}
		return this;
	};
	/**
	* Clears this buffer.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.clear = function() {
		this.data = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(0));
		this.read = this.write = 0;
		return this;
	};
	/**
	* Shortens this buffer by trimming bytes off of the end of this buffer.
	*
	* @param count the number of bytes to trim off.
	*
	* @return this buffer.
	*/
	util.DataBuffer.prototype.truncate = function(count) {
		this.write = Math.max(0, this.length() - count);
		this.read = Math.min(this.read, this.write);
		return this;
	};
	/**
	* Converts this buffer to a hexadecimal string.
	*
	* @return a hexadecimal string.
	*/
	util.DataBuffer.prototype.toHex = function() {
		var rval = "";
		for (var i = this.read; i < this.data.byteLength; ++i) {
			var b = this.data.getUint8(i);
			if (b < 16) rval += "0";
			rval += b.toString(16);
		}
		return rval;
	};
	/**
	* Converts this buffer to a string, using the given encoding. If no
	* encoding is given, 'utf8' (UTF-8) is used.
	*
	* @param [encoding] the encoding to use: 'binary', 'utf8', 'utf16', 'hex',
	*          'base64' (default: 'utf8').
	*
	* @return a string representation of the bytes in this buffer.
	*/
	util.DataBuffer.prototype.toString = function(encoding) {
		var view = new Uint8Array(this.data, this.read, this.length());
		encoding = encoding || "utf8";
		if (encoding === "binary" || encoding === "raw") return util.binary.raw.encode(view);
		if (encoding === "hex") return util.binary.hex.encode(view);
		if (encoding === "base64") return util.binary.base64.encode(view);
		if (encoding === "utf8") return util.text.utf8.decode(view);
		if (encoding === "utf16") return util.text.utf16.decode(view);
		throw new Error("Invalid encoding: " + encoding);
	};
	/** End Buffer w/UInt8Array backing */
	/**
	* Creates a buffer that stores bytes. A value may be given to populate the
	* buffer with data. This value can either be string of encoded bytes or a
	* regular string of characters. When passing a string of binary encoded
	* bytes, the encoding `raw` should be given. This is also the default. When
	* passing a string of characters, the encoding `utf8` should be given.
	*
	* @param [input] a string with encoded bytes to store in the buffer.
	* @param [encoding] (default: 'raw', other: 'utf8').
	*/
	util.createBuffer = function(input, encoding) {
		encoding = encoding || "raw";
		if (input !== void 0 && encoding === "utf8") input = util.encodeUtf8(input);
		return new util.ByteBuffer(input);
	};
	/**
	* Fills a string with a particular value. If you want the string to be a byte
	* string, pass in String.fromCharCode(theByte).
	*
	* @param c the character to fill the string with, use String.fromCharCode
	*          to fill the string with a byte value.
	* @param n the number of characters of value c to fill with.
	*
	* @return the filled string.
	*/
	util.fillString = function(c, n) {
		var s = "";
		while (n > 0) {
			if (n & 1) s += c;
			n >>>= 1;
			if (n > 0) c += c;
		}
		return s;
	};
	/**
	* Performs a per byte XOR between two byte strings and returns the result as a
	* string of bytes.
	*
	* @param s1 first string of bytes.
	* @param s2 second string of bytes.
	* @param n the number of bytes to XOR.
	*
	* @return the XOR'd result.
	*/
	util.xorBytes = function(s1, s2, n) {
		var s3 = "";
		var b = "";
		var t = "";
		var i = 0;
		var c = 0;
		for (; n > 0; --n, ++i) {
			b = s1.charCodeAt(i) ^ s2.charCodeAt(i);
			if (c >= 10) {
				s3 += t;
				t = "";
				c = 0;
			}
			t += String.fromCharCode(b);
			++c;
		}
		s3 += t;
		return s3;
	};
	/**
	* Converts a hex string into a 'binary' encoded string of bytes.
	*
	* @param hex the hexadecimal string to convert.
	*
	* @return the binary-encoded string of bytes.
	*/
	util.hexToBytes = function(hex) {
		var rval = "";
		var i = 0;
		if (hex.length & true) {
			i = 1;
			rval += String.fromCharCode(parseInt(hex[0], 16));
		}
		for (; i < hex.length; i += 2) rval += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return rval;
	};
	/**
	* Converts a 'binary' encoded string of bytes to hex.
	*
	* @param bytes the byte string to convert.
	*
	* @return the string of hexadecimal characters.
	*/
	util.bytesToHex = function(bytes) {
		return util.createBuffer(bytes).toHex();
	};
	/**
	* Converts an 32-bit integer to 4-big-endian byte string.
	*
	* @param i the integer.
	*
	* @return the byte string.
	*/
	util.int32ToBytes = function(i) {
		return String.fromCharCode(i >> 24 & 255) + String.fromCharCode(i >> 16 & 255) + String.fromCharCode(i >> 8 & 255) + String.fromCharCode(i & 255);
	};
	var _base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	var _base64Idx = [
		62,
		-1,
		-1,
		-1,
		63,
		52,
		53,
		54,
		55,
		56,
		57,
		58,
		59,
		60,
		61,
		-1,
		-1,
		-1,
		64,
		-1,
		-1,
		-1,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		25,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		26,
		27,
		28,
		29,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
		40,
		41,
		42,
		43,
		44,
		45,
		46,
		47,
		48,
		49,
		50,
		51
	];
	var _base58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	/**
	* Base64 encodes a 'binary' encoded string of bytes.
	*
	* @param input the binary encoded string of bytes to base64-encode.
	* @param maxline the maximum number of encoded characters per line to use,
	*          defaults to none.
	*
	* @return the base64-encoded output.
	*/
	util.encode64 = function(input, maxline) {
		var line = "";
		var output = "";
		var chr1, chr2, chr3;
		var i = 0;
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			line += _base64.charAt(chr1 >> 2);
			line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
			if (isNaN(chr2)) line += "==";
			else {
				line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
				line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
			}
			if (maxline && line.length > maxline) {
				output += line.substr(0, maxline) + "\r\n";
				line = line.substr(maxline);
			}
		}
		output += line;
		return output;
	};
	/**
	* Base64 decodes a string into a 'binary' encoded string of bytes.
	*
	* @param input the base64-encoded input.
	*
	* @return the binary encoded string.
	*/
	util.decode64 = function(input) {
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		var output = "";
		var enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
			enc1 = _base64Idx[input.charCodeAt(i++) - 43];
			enc2 = _base64Idx[input.charCodeAt(i++) - 43];
			enc3 = _base64Idx[input.charCodeAt(i++) - 43];
			enc4 = _base64Idx[input.charCodeAt(i++) - 43];
			output += String.fromCharCode(enc1 << 2 | enc2 >> 4);
			if (enc3 !== 64) {
				output += String.fromCharCode((enc2 & 15) << 4 | enc3 >> 2);
				if (enc4 !== 64) output += String.fromCharCode((enc3 & 3) << 6 | enc4);
			}
		}
		return output;
	};
	/**
	* Encodes the given string of characters (a standard JavaScript
	* string) as a binary encoded string where the bytes represent
	* a UTF-8 encoded string of characters. Non-ASCII characters will be
	* encoded as multiple bytes according to UTF-8.
	*
	* @param str a standard string of characters to encode.
	*
	* @return the binary encoded string.
	*/
	util.encodeUtf8 = function(str) {
		return unescape(encodeURIComponent(str));
	};
	/**
	* Decodes a binary encoded string that contains bytes that
	* represent a UTF-8 encoded string of characters -- into a
	* string of characters (a standard JavaScript string).
	*
	* @param str the binary encoded string to decode.
	*
	* @return the resulting standard string of characters.
	*/
	util.decodeUtf8 = function(str) {
		return decodeURIComponent(escape(str));
	};
	util.binary = {
		raw: {},
		hex: {},
		base64: {},
		base58: {},
		baseN: {
			encode: baseN.encode,
			decode: baseN.decode
		}
	};
	/**
	* Encodes a Uint8Array as a binary-encoded string. This encoding uses
	* a value between 0 and 255 for each character.
	*
	* @param bytes the Uint8Array to encode.
	*
	* @return the binary-encoded string.
	*/
	util.binary.raw.encode = function(bytes) {
		return String.fromCharCode.apply(null, bytes);
	};
	/**
	* Decodes a binary-encoded string to a Uint8Array. This encoding uses
	* a value between 0 and 255 for each character.
	*
	* @param str the binary-encoded string to decode.
	* @param [output] an optional Uint8Array to write the output to; if it
	*          is too small, an exception will be thrown.
	* @param [offset] the start offset for writing to the output (default: 0).
	*
	* @return the Uint8Array or the number of bytes written if output was given.
	*/
	util.binary.raw.decode = function(str, output, offset) {
		var out = output;
		if (!out) out = new Uint8Array(str.length);
		offset = offset || 0;
		var j = offset;
		for (var i = 0; i < str.length; ++i) out[j++] = str.charCodeAt(i);
		return output ? j - offset : out;
	};
	/**
	* Encodes a 'binary' string, ArrayBuffer, DataView, TypedArray, or
	* ByteBuffer as a string of hexadecimal characters.
	*
	* @param bytes the bytes to convert.
	*
	* @return the string of hexadecimal characters.
	*/
	util.binary.hex.encode = util.bytesToHex;
	/**
	* Decodes a hex-encoded string to a Uint8Array.
	*
	* @param hex the hexadecimal string to convert.
	* @param [output] an optional Uint8Array to write the output to; if it
	*          is too small, an exception will be thrown.
	* @param [offset] the start offset for writing to the output (default: 0).
	*
	* @return the Uint8Array or the number of bytes written if output was given.
	*/
	util.binary.hex.decode = function(hex, output, offset) {
		var out = output;
		if (!out) out = new Uint8Array(Math.ceil(hex.length / 2));
		offset = offset || 0;
		var i = 0, j = offset;
		if (hex.length & 1) {
			i = 1;
			out[j++] = parseInt(hex[0], 16);
		}
		for (; i < hex.length; i += 2) out[j++] = parseInt(hex.substr(i, 2), 16);
		return output ? j - offset : out;
	};
	/**
	* Base64-encodes a Uint8Array.
	*
	* @param input the Uint8Array to encode.
	* @param maxline the maximum number of encoded characters per line to use,
	*          defaults to none.
	*
	* @return the base64-encoded output string.
	*/
	util.binary.base64.encode = function(input, maxline) {
		var line = "";
		var output = "";
		var chr1, chr2, chr3;
		var i = 0;
		while (i < input.byteLength) {
			chr1 = input[i++];
			chr2 = input[i++];
			chr3 = input[i++];
			line += _base64.charAt(chr1 >> 2);
			line += _base64.charAt((chr1 & 3) << 4 | chr2 >> 4);
			if (isNaN(chr2)) line += "==";
			else {
				line += _base64.charAt((chr2 & 15) << 2 | chr3 >> 6);
				line += isNaN(chr3) ? "=" : _base64.charAt(chr3 & 63);
			}
			if (maxline && line.length > maxline) {
				output += line.substr(0, maxline) + "\r\n";
				line = line.substr(maxline);
			}
		}
		output += line;
		return output;
	};
	/**
	* Decodes a base64-encoded string to a Uint8Array.
	*
	* @param input the base64-encoded input string.
	* @param [output] an optional Uint8Array to write the output to; if it
	*          is too small, an exception will be thrown.
	* @param [offset] the start offset for writing to the output (default: 0).
	*
	* @return the Uint8Array or the number of bytes written if output was given.
	*/
	util.binary.base64.decode = function(input, output, offset) {
		var out = output;
		if (!out) out = new Uint8Array(Math.ceil(input.length / 4) * 3);
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		offset = offset || 0;
		var enc1, enc2, enc3, enc4;
		var i = 0, j = offset;
		while (i < input.length) {
			enc1 = _base64Idx[input.charCodeAt(i++) - 43];
			enc2 = _base64Idx[input.charCodeAt(i++) - 43];
			enc3 = _base64Idx[input.charCodeAt(i++) - 43];
			enc4 = _base64Idx[input.charCodeAt(i++) - 43];
			out[j++] = enc1 << 2 | enc2 >> 4;
			if (enc3 !== 64) {
				out[j++] = (enc2 & 15) << 4 | enc3 >> 2;
				if (enc4 !== 64) out[j++] = (enc3 & 3) << 6 | enc4;
			}
		}
		return output ? j - offset : out.subarray(0, j);
	};
	util.binary.base58.encode = function(input, maxline) {
		return util.binary.baseN.encode(input, _base58, maxline);
	};
	util.binary.base58.decode = function(input, maxline) {
		return util.binary.baseN.decode(input, _base58, maxline);
	};
	util.text = {
		utf8: {},
		utf16: {}
	};
	/**
	* Encodes the given string as UTF-8 in a Uint8Array.
	*
	* @param str the string to encode.
	* @param [output] an optional Uint8Array to write the output to; if it
	*          is too small, an exception will be thrown.
	* @param [offset] the start offset for writing to the output (default: 0).
	*
	* @return the Uint8Array or the number of bytes written if output was given.
	*/
	util.text.utf8.encode = function(str, output, offset) {
		str = util.encodeUtf8(str);
		var out = output;
		if (!out) out = new Uint8Array(str.length);
		offset = offset || 0;
		var j = offset;
		for (var i = 0; i < str.length; ++i) out[j++] = str.charCodeAt(i);
		return output ? j - offset : out;
	};
	/**
	* Decodes the UTF-8 contents from a Uint8Array.
	*
	* @param bytes the Uint8Array to decode.
	*
	* @return the resulting string.
	*/
	util.text.utf8.decode = function(bytes) {
		return util.decodeUtf8(String.fromCharCode.apply(null, bytes));
	};
	/**
	* Encodes the given string as UTF-16 in a Uint8Array.
	*
	* @param str the string to encode.
	* @param [output] an optional Uint8Array to write the output to; if it
	*          is too small, an exception will be thrown.
	* @param [offset] the start offset for writing to the output (default: 0).
	*
	* @return the Uint8Array or the number of bytes written if output was given.
	*/
	util.text.utf16.encode = function(str, output, offset) {
		var out = output;
		if (!out) out = new Uint8Array(str.length * 2);
		var view = new Uint16Array(out.buffer);
		offset = offset || 0;
		var j = offset;
		var k = offset;
		for (var i = 0; i < str.length; ++i) {
			view[k++] = str.charCodeAt(i);
			j += 2;
		}
		return output ? j - offset : out;
	};
	/**
	* Decodes the UTF-16 contents from a Uint8Array.
	*
	* @param bytes the Uint8Array to decode.
	*
	* @return the resulting string.
	*/
	util.text.utf16.decode = function(bytes) {
		return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
	};
	/**
	* Deflates the given data using a flash interface.
	*
	* @param api the flash interface.
	* @param bytes the data.
	* @param raw true to return only raw deflate data, false to include zlib
	*          header and trailer.
	*
	* @return the deflated data as a string.
	*/
	util.deflate = function(api, bytes, raw) {
		bytes = util.decode64(api.deflate(util.encode64(bytes)).rval);
		if (raw) {
			var start = 2;
			if (bytes.charCodeAt(1) & 32) start = 6;
			bytes = bytes.substring(start, bytes.length - 4);
		}
		return bytes;
	};
	/**
	* Inflates the given data using a flash interface.
	*
	* @param api the flash interface.
	* @param bytes the data.
	* @param raw true if the incoming data has no zlib header or trailer and is
	*          raw DEFLATE data.
	*
	* @return the inflated data as a string, null on error.
	*/
	util.inflate = function(api, bytes, raw) {
		var rval = api.inflate(util.encode64(bytes)).rval;
		return rval === null ? null : util.decode64(rval);
	};
	/**
	* Sets a storage object.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	* @param obj the storage object, null to remove.
	*/
	var _setStorageObject = function(api, id, obj) {
		if (!api) throw new Error("WebStorage not available.");
		var rval;
		if (obj === null) rval = api.removeItem(id);
		else {
			obj = util.encode64(JSON.stringify(obj));
			rval = api.setItem(id, obj);
		}
		if (typeof rval !== "undefined" && rval.rval !== true) {
			var error = new Error(rval.error.message);
			error.id = rval.error.id;
			error.name = rval.error.name;
			throw error;
		}
	};
	/**
	* Gets a storage object.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	*
	* @return the storage object entry or null if none exists.
	*/
	var _getStorageObject = function(api, id) {
		if (!api) throw new Error("WebStorage not available.");
		var rval = api.getItem(id);
		if (api.init) if (rval.rval === null) {
			if (rval.error) {
				var error = new Error(rval.error.message);
				error.id = rval.error.id;
				error.name = rval.error.name;
				throw error;
			}
			rval = null;
		} else rval = rval.rval;
		if (rval !== null) rval = JSON.parse(util.decode64(rval));
		return rval;
	};
	/**
	* Stores an item in local storage.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	* @param key the key for the item.
	* @param data the data for the item (any javascript object/primitive).
	*/
	var _setItem = function(api, id, key, data) {
		var obj = _getStorageObject(api, id);
		if (obj === null) obj = {};
		obj[key] = data;
		_setStorageObject(api, id, obj);
	};
	/**
	* Gets an item from local storage.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	* @param key the key for the item.
	*
	* @return the item.
	*/
	var _getItem = function(api, id, key) {
		var rval = _getStorageObject(api, id);
		if (rval !== null) rval = key in rval ? rval[key] : null;
		return rval;
	};
	/**
	* Removes an item from local storage.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	* @param key the key for the item.
	*/
	var _removeItem = function(api, id, key) {
		var obj = _getStorageObject(api, id);
		if (obj !== null && key in obj) {
			delete obj[key];
			var empty = true;
			for (var prop in obj) {
				empty = false;
				break;
			}
			if (empty) obj = null;
			_setStorageObject(api, id, obj);
		}
	};
	/**
	* Clears the local disk storage identified by the given ID.
	*
	* @param api the storage interface.
	* @param id the storage ID to use.
	*/
	var _clearItems = function(api, id) {
		_setStorageObject(api, id, null);
	};
	/**
	* Calls a storage function.
	*
	* @param func the function to call.
	* @param args the arguments for the function.
	* @param location the location argument.
	*
	* @return the return value from the function.
	*/
	var _callStorageFunction = function(func, args, location) {
		var rval = null;
		if (typeof location === "undefined") location = ["web", "flash"];
		var type;
		var done = false;
		var exception = null;
		for (var idx in location) {
			type = location[idx];
			try {
				if (type === "flash" || type === "both") {
					if (args[0] === null) throw new Error("Flash local storage not available.");
					rval = func.apply(this, args);
					done = type === "flash";
				}
				if (type === "web" || type === "both") {
					args[0] = localStorage;
					rval = func.apply(this, args);
					done = true;
				}
			} catch (ex) {
				exception = ex;
			}
			if (done) break;
		}
		if (!done) throw exception;
		return rval;
	};
	/**
	* Stores an item on local disk.
	*
	* The available types of local storage include 'flash', 'web', and 'both'.
	*
	* The type 'flash' refers to flash local storage (SharedObject). In order
	* to use flash local storage, the 'api' parameter must be valid. The type
	* 'web' refers to WebStorage, if supported by the browser. The type 'both'
	* refers to storing using both 'flash' and 'web', not just one or the
	* other.
	*
	* The location array should list the storage types to use in order of
	* preference:
	*
	* ['flash']: flash only storage
	* ['web']: web only storage
	* ['both']: try to store in both
	* ['flash','web']: store in flash first, but if not available, 'web'
	* ['web','flash']: store in web first, but if not available, 'flash'
	*
	* The location array defaults to: ['web', 'flash']
	*
	* @param api the flash interface, null to use only WebStorage.
	* @param id the storage ID to use.
	* @param key the key for the item.
	* @param data the data for the item (any javascript object/primitive).
	* @param location an array with the preferred types of storage to use.
	*/
	util.setItem = function(api, id, key, data, location) {
		_callStorageFunction(_setItem, arguments, location);
	};
	/**
	* Gets an item on local disk.
	*
	* Set setItem() for details on storage types.
	*
	* @param api the flash interface, null to use only WebStorage.
	* @param id the storage ID to use.
	* @param key the key for the item.
	* @param location an array with the preferred types of storage to use.
	*
	* @return the item.
	*/
	util.getItem = function(api, id, key, location) {
		return _callStorageFunction(_getItem, arguments, location);
	};
	/**
	* Removes an item on local disk.
	*
	* Set setItem() for details on storage types.
	*
	* @param api the flash interface.
	* @param id the storage ID to use.
	* @param key the key for the item.
	* @param location an array with the preferred types of storage to use.
	*/
	util.removeItem = function(api, id, key, location) {
		_callStorageFunction(_removeItem, arguments, location);
	};
	/**
	* Clears the local disk storage identified by the given ID.
	*
	* Set setItem() for details on storage types.
	*
	* @param api the flash interface if flash is available.
	* @param id the storage ID to use.
	* @param location an array with the preferred types of storage to use.
	*/
	util.clearItems = function(api, id, location) {
		_callStorageFunction(_clearItems, arguments, location);
	};
	/**
	* Check if an object is empty.
	*
	* Taken from:
	* http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object-from-json/679937#679937
	*
	* @param object the object to check.
	*/
	util.isEmpty = function(obj) {
		for (var prop in obj) if (obj.hasOwnProperty(prop)) return false;
		return true;
	};
	/**
	* Format with simple printf-style interpolation.
	*
	* %%: literal '%'
	* %s,%o: convert next argument into a string.
	*
	* @param format the string to format.
	* @param ... arguments to interpolate into the format string.
	*/
	util.format = function(format) {
		var re = /%./g;
		var match;
		var part;
		var argi = 0;
		var parts = [];
		var last = 0;
		while (match = re.exec(format)) {
			part = format.substring(last, re.lastIndex - 2);
			if (part.length > 0) parts.push(part);
			last = re.lastIndex;
			var code = match[0][1];
			switch (code) {
				case "s":
				case "o":
					if (argi < arguments.length) parts.push(arguments[argi++ + 1]);
					else parts.push("<?>");
					break;
				case "%":
					parts.push("%");
					break;
				default: parts.push("<%" + code + "?>");
			}
		}
		parts.push(format.substring(last));
		return parts.join("");
	};
	/**
	* Formats a number.
	*
	* http://snipplr.com/view/5945/javascript-numberformat--ported-from-php/
	*/
	util.formatNumber = function(number, decimals, dec_point, thousands_sep) {
		var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
		var d = dec_point === void 0 ? "," : dec_point;
		var t = thousands_sep === void 0 ? "." : thousands_sep, s = n < 0 ? "-" : "";
		var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
		var j = i.length > 3 ? i.length % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	};
	/**
	* Formats a byte size.
	*
	* http://snipplr.com/view/5949/format-humanize-file-byte-size-presentation-in-javascript/
	*/
	util.formatSize = function(size) {
		if (size >= 1073741824) size = util.formatNumber(size / 1073741824, 2, ".", "") + " GiB";
		else if (size >= 1048576) size = util.formatNumber(size / 1048576, 2, ".", "") + " MiB";
		else if (size >= 1024) size = util.formatNumber(size / 1024, 0) + " KiB";
		else size = util.formatNumber(size, 0) + " bytes";
		return size;
	};
	/**
	* Converts an IPv4 or IPv6 string representation into bytes (in network order).
	*
	* @param ip the IPv4 or IPv6 address to convert.
	*
	* @return the 4-byte IPv6 or 16-byte IPv6 address or null if the address can't
	*         be parsed.
	*/
	util.bytesFromIP = function(ip) {
		if (ip.indexOf(".") !== -1) return util.bytesFromIPv4(ip);
		if (ip.indexOf(":") !== -1) return util.bytesFromIPv6(ip);
		return null;
	};
	/**
	* Converts an IPv4 string representation into bytes (in network order).
	*
	* @param ip the IPv4 address to convert.
	*
	* @return the 4-byte address or null if the address can't be parsed.
	*/
	util.bytesFromIPv4 = function(ip) {
		ip = ip.split(".");
		if (ip.length !== 4) return null;
		var b = util.createBuffer();
		for (var i = 0; i < ip.length; ++i) {
			var num = parseInt(ip[i], 10);
			if (isNaN(num)) return null;
			b.putByte(num);
		}
		return b.getBytes();
	};
	/**
	* Converts an IPv6 string representation into bytes (in network order).
	*
	* @param ip the IPv6 address to convert.
	*
	* @return the 16-byte address or null if the address can't be parsed.
	*/
	util.bytesFromIPv6 = function(ip) {
		var blanks = 0;
		ip = ip.split(":").filter(function(e) {
			if (e.length === 0) ++blanks;
			return true;
		});
		var zeros = (8 - ip.length + blanks) * 2;
		var b = util.createBuffer();
		for (var i = 0; i < 8; ++i) {
			if (!ip[i] || ip[i].length === 0) {
				b.fillWithByte(0, zeros);
				zeros = 0;
				continue;
			}
			var bytes = util.hexToBytes(ip[i]);
			if (bytes.length < 2) b.putByte(0);
			b.putBytes(bytes);
		}
		return b.getBytes();
	};
	/**
	* Converts 4-bytes into an IPv4 string representation or 16-bytes into
	* an IPv6 string representation. The bytes must be in network order.
	*
	* @param bytes the bytes to convert.
	*
	* @return the IPv4 or IPv6 string representation if 4 or 16 bytes,
	*         respectively, are given, otherwise null.
	*/
	util.bytesToIP = function(bytes) {
		if (bytes.length === 4) return util.bytesToIPv4(bytes);
		if (bytes.length === 16) return util.bytesToIPv6(bytes);
		return null;
	};
	/**
	* Converts 4-bytes into an IPv4 string representation. The bytes must be
	* in network order.
	*
	* @param bytes the bytes to convert.
	*
	* @return the IPv4 string representation or null for an invalid # of bytes.
	*/
	util.bytesToIPv4 = function(bytes) {
		if (bytes.length !== 4) return null;
		var ip = [];
		for (var i = 0; i < bytes.length; ++i) ip.push(bytes.charCodeAt(i));
		return ip.join(".");
	};
	/**
	* Converts 16-bytes into an IPv16 string representation. The bytes must be
	* in network order.
	*
	* @param bytes the bytes to convert.
	*
	* @return the IPv16 string representation or null for an invalid # of bytes.
	*/
	util.bytesToIPv6 = function(bytes) {
		if (bytes.length !== 16) return null;
		var ip = [];
		var zeroGroups = [];
		var zeroMaxGroup = 0;
		for (var i = 0; i < bytes.length; i += 2) {
			var hex = util.bytesToHex(bytes[i] + bytes[i + 1]);
			while (hex[0] === "0" && hex !== "0") hex = hex.substr(1);
			if (hex === "0") {
				var last = zeroGroups[zeroGroups.length - 1];
				var idx = ip.length;
				if (!last || idx !== last.end + 1) zeroGroups.push({
					start: idx,
					end: idx
				});
				else {
					last.end = idx;
					if (last.end - last.start > zeroGroups[zeroMaxGroup].end - zeroGroups[zeroMaxGroup].start) zeroMaxGroup = zeroGroups.length - 1;
				}
			}
			ip.push(hex);
		}
		if (zeroGroups.length > 0) {
			var group = zeroGroups[zeroMaxGroup];
			if (group.end - group.start > 0) {
				ip.splice(group.start, group.end - group.start + 1, "");
				if (group.start === 0) ip.unshift("");
				if (group.end === 7) ip.push("");
			}
		}
		return ip.join(":");
	};
	/**
	* Estimates the number of processes that can be run concurrently. If
	* creating Web Workers, keep in mind that the main JavaScript process needs
	* its own core.
	*
	* @param options the options to use:
	*          update true to force an update (not use the cached value).
	* @param callback(err, max) called once the operation completes.
	*/
	util.estimateCores = function(options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		options = options || {};
		if ("cores" in util && !options.update) return callback(null, util.cores);
		if (typeof navigator !== "undefined" && "hardwareConcurrency" in navigator && navigator.hardwareConcurrency > 0) {
			util.cores = navigator.hardwareConcurrency;
			return callback(null, util.cores);
		}
		if (typeof Worker === "undefined") {
			util.cores = 1;
			return callback(null, util.cores);
		}
		if (typeof Blob === "undefined") {
			util.cores = 2;
			return callback(null, util.cores);
		}
		var blobUrl = URL.createObjectURL(new Blob([
			"(",
			function() {
				self.addEventListener("message", function(e) {
					var st = Date.now();
					var et = st + 4;
					while (Date.now() < et);
					self.postMessage({
						st,
						et
					});
				});
			}.toString(),
			")()"
		], { type: "application/javascript" }));
		sample([], 5, 16);
		function sample(max, samples, numWorkers) {
			if (samples === 0) {
				var avg = Math.floor(max.reduce(function(avg, x) {
					return avg + x;
				}, 0) / max.length);
				util.cores = Math.max(1, avg);
				URL.revokeObjectURL(blobUrl);
				return callback(null, util.cores);
			}
			map(numWorkers, function(err, results) {
				max.push(reduce(numWorkers, results));
				sample(max, samples - 1, numWorkers);
			});
		}
		function map(numWorkers, callback) {
			var workers = [];
			var results = [];
			for (var i = 0; i < numWorkers; ++i) {
				var worker = new Worker(blobUrl);
				worker.addEventListener("message", function(e) {
					results.push(e.data);
					if (results.length === numWorkers) {
						for (var i = 0; i < numWorkers; ++i) workers[i].terminate();
						callback(null, results);
					}
				});
				workers.push(worker);
			}
			for (var i = 0; i < numWorkers; ++i) workers[i].postMessage(i);
		}
		function reduce(numWorkers, results) {
			var overlaps = [];
			for (var n = 0; n < numWorkers; ++n) {
				var r1 = results[n];
				var overlap = overlaps[n] = [];
				for (var i = 0; i < numWorkers; ++i) {
					if (n === i) continue;
					var r2 = results[i];
					if (r1.st > r2.st && r1.st < r2.et || r2.st > r1.st && r2.st < r1.et) overlap.push(i);
				}
			}
			return overlaps.reduce(function(max, overlap) {
				return Math.max(max, overlap.length);
			}, 0);
		}
	};
}));
//#endregion
//#region node_modules/node-forge/lib/cipher.js
var require_cipher = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Cipher base API.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	module.exports = forge.cipher = forge.cipher || {};
	forge.cipher.algorithms = forge.cipher.algorithms || {};
	/**
	* Creates a cipher object that can be used to encrypt data using the given
	* algorithm and key. The algorithm may be provided as a string value for a
	* previously registered algorithm or it may be given as a cipher algorithm
	* API object.
	*
	* @param algorithm the algorithm to use, either a string or an algorithm API
	*          object.
	* @param key the key to use, as a binary-encoded string of bytes or a
	*          byte buffer.
	*
	* @return the cipher.
	*/
	forge.cipher.createCipher = function(algorithm, key) {
		var api = algorithm;
		if (typeof api === "string") {
			api = forge.cipher.getAlgorithm(api);
			if (api) api = api();
		}
		if (!api) throw new Error("Unsupported algorithm: " + algorithm);
		return new forge.cipher.BlockCipher({
			algorithm: api,
			key,
			decrypt: false
		});
	};
	/**
	* Creates a decipher object that can be used to decrypt data using the given
	* algorithm and key. The algorithm may be provided as a string value for a
	* previously registered algorithm or it may be given as a cipher algorithm
	* API object.
	*
	* @param algorithm the algorithm to use, either a string or an algorithm API
	*          object.
	* @param key the key to use, as a binary-encoded string of bytes or a
	*          byte buffer.
	*
	* @return the cipher.
	*/
	forge.cipher.createDecipher = function(algorithm, key) {
		var api = algorithm;
		if (typeof api === "string") {
			api = forge.cipher.getAlgorithm(api);
			if (api) api = api();
		}
		if (!api) throw new Error("Unsupported algorithm: " + algorithm);
		return new forge.cipher.BlockCipher({
			algorithm: api,
			key,
			decrypt: true
		});
	};
	/**
	* Registers an algorithm by name. If the name was already registered, the
	* algorithm API object will be overwritten.
	*
	* @param name the name of the algorithm.
	* @param algorithm the algorithm API object.
	*/
	forge.cipher.registerAlgorithm = function(name, algorithm) {
		name = name.toUpperCase();
		forge.cipher.algorithms[name] = algorithm;
	};
	/**
	* Gets a registered algorithm by name.
	*
	* @param name the name of the algorithm.
	*
	* @return the algorithm, if found, null if not.
	*/
	forge.cipher.getAlgorithm = function(name) {
		name = name.toUpperCase();
		if (name in forge.cipher.algorithms) return forge.cipher.algorithms[name];
		return null;
	};
	var BlockCipher = forge.cipher.BlockCipher = function(options) {
		this.algorithm = options.algorithm;
		this.mode = this.algorithm.mode;
		this.blockSize = this.mode.blockSize;
		this._finish = false;
		this._input = null;
		this.output = null;
		this._op = options.decrypt ? this.mode.decrypt : this.mode.encrypt;
		this._decrypt = options.decrypt;
		this.algorithm.initialize(options);
	};
	/**
	* Starts or restarts the encryption or decryption process, whichever
	* was previously configured.
	*
	* For non-GCM mode, the IV may be a binary-encoded string of bytes, an array
	* of bytes, a byte buffer, or an array of 32-bit integers. If the IV is in
	* bytes, then it must be Nb (16) bytes in length. If the IV is given in as
	* 32-bit integers, then it must be 4 integers long.
	*
	* Note: an IV is not required or used in ECB mode.
	*
	* For GCM-mode, the IV must be given as a binary-encoded string of bytes or
	* a byte buffer. The number of bytes should be 12 (96 bits) as recommended
	* by NIST SP-800-38D but another length may be given.
	*
	* @param options the options to use:
	*          iv the initialization vector to use as a binary-encoded string of
	*            bytes, null to reuse the last ciphered block from a previous
	*            update() (this "residue" method is for legacy support only).
	*          additionalData additional authentication data as a binary-encoded
	*            string of bytes, for 'GCM' mode, (default: none).
	*          tagLength desired length of authentication tag, in bits, for
	*            'GCM' mode (0-128, default: 128).
	*          tag the authentication tag to check if decrypting, as a
	*             binary-encoded string of bytes.
	*          output the output the buffer to write to, null to create one.
	*/
	BlockCipher.prototype.start = function(options) {
		options = options || {};
		var opts = {};
		for (var key in options) opts[key] = options[key];
		opts.decrypt = this._decrypt;
		this._finish = false;
		this._input = forge.util.createBuffer();
		this.output = options.output || forge.util.createBuffer();
		this.mode.start(opts);
	};
	/**
	* Updates the next block according to the cipher mode.
	*
	* @param input the buffer to read from.
	*/
	BlockCipher.prototype.update = function(input) {
		if (input) this._input.putBuffer(input);
		while (!this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish);
		this._input.compact();
	};
	/**
	* Finishes encrypting or decrypting.
	*
	* @param pad a padding function to use in CBC mode, null for default,
	*          signature(blockSize, buffer, decrypt).
	*
	* @return true if successful, false on error.
	*/
	BlockCipher.prototype.finish = function(pad) {
		if (pad && (this.mode.name === "ECB" || this.mode.name === "CBC")) {
			this.mode.pad = function(input) {
				return pad(this.blockSize, input, false);
			};
			this.mode.unpad = function(output) {
				return pad(this.blockSize, output, true);
			};
		}
		var options = {};
		options.decrypt = this._decrypt;
		options.overflow = this._input.length() % this.blockSize;
		if (!this._decrypt && this.mode.pad) {
			if (!this.mode.pad(this._input, options)) return false;
		}
		this._finish = true;
		this.update();
		if (this._decrypt && this.mode.unpad) {
			if (!this.mode.unpad(this.output, options)) return false;
		}
		if (this.mode.afterFinish) {
			if (!this.mode.afterFinish(this.output, options)) return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/cipherModes.js
var require_cipherModes = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Supported cipher modes.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	forge.cipher = forge.cipher || {};
	var modes = module.exports = forge.cipher.modes = forge.cipher.modes || {};
	/** Electronic codebook (ECB) (Don't use this; it's not secure) **/
	modes.ecb = function(options) {
		options = options || {};
		this.name = "ECB";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = new Array(this._ints);
		this._outBlock = new Array(this._ints);
	};
	modes.ecb.prototype.start = function(options) {};
	modes.ecb.prototype.encrypt = function(input, output, finish) {
		if (input.length() < this.blockSize && !(finish && input.length() > 0)) return true;
		for (var i = 0; i < this._ints; ++i) this._inBlock[i] = input.getInt32();
		this.cipher.encrypt(this._inBlock, this._outBlock);
		for (var i = 0; i < this._ints; ++i) output.putInt32(this._outBlock[i]);
	};
	modes.ecb.prototype.decrypt = function(input, output, finish) {
		if (input.length() < this.blockSize && !(finish && input.length() > 0)) return true;
		for (var i = 0; i < this._ints; ++i) this._inBlock[i] = input.getInt32();
		this.cipher.decrypt(this._inBlock, this._outBlock);
		for (var i = 0; i < this._ints; ++i) output.putInt32(this._outBlock[i]);
	};
	modes.ecb.prototype.pad = function(input, options) {
		var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
		input.fillWithByte(padding, padding);
		return true;
	};
	modes.ecb.prototype.unpad = function(output, options) {
		if (options.overflow > 0) return false;
		var len = output.length();
		var count = output.at(len - 1);
		if (count > this.blockSize << 2) return false;
		output.truncate(count);
		return true;
	};
	/** Cipher-block Chaining (CBC) **/
	modes.cbc = function(options) {
		options = options || {};
		this.name = "CBC";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = new Array(this._ints);
		this._outBlock = new Array(this._ints);
	};
	modes.cbc.prototype.start = function(options) {
		if (options.iv === null) {
			if (!this._prev) throw new Error("Invalid IV parameter.");
			this._iv = this._prev.slice(0);
		} else if (!("iv" in options)) throw new Error("Invalid IV parameter.");
		else {
			this._iv = transformIV(options.iv, this.blockSize);
			this._prev = this._iv.slice(0);
		}
	};
	modes.cbc.prototype.encrypt = function(input, output, finish) {
		if (input.length() < this.blockSize && !(finish && input.length() > 0)) return true;
		for (var i = 0; i < this._ints; ++i) this._inBlock[i] = this._prev[i] ^ input.getInt32();
		this.cipher.encrypt(this._inBlock, this._outBlock);
		for (var i = 0; i < this._ints; ++i) output.putInt32(this._outBlock[i]);
		this._prev = this._outBlock;
	};
	modes.cbc.prototype.decrypt = function(input, output, finish) {
		if (input.length() < this.blockSize && !(finish && input.length() > 0)) return true;
		for (var i = 0; i < this._ints; ++i) this._inBlock[i] = input.getInt32();
		this.cipher.decrypt(this._inBlock, this._outBlock);
		for (var i = 0; i < this._ints; ++i) output.putInt32(this._prev[i] ^ this._outBlock[i]);
		this._prev = this._inBlock.slice(0);
	};
	modes.cbc.prototype.pad = function(input, options) {
		var padding = input.length() === this.blockSize ? this.blockSize : this.blockSize - input.length();
		input.fillWithByte(padding, padding);
		return true;
	};
	modes.cbc.prototype.unpad = function(output, options) {
		if (options.overflow > 0) return false;
		var len = output.length();
		var count = output.at(len - 1);
		if (count > this.blockSize << 2) return false;
		output.truncate(count);
		return true;
	};
	/** Cipher feedback (CFB) **/
	modes.cfb = function(options) {
		options = options || {};
		this.name = "CFB";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = null;
		this._outBlock = new Array(this._ints);
		this._partialBlock = new Array(this._ints);
		this._partialOutput = forge.util.createBuffer();
		this._partialBytes = 0;
	};
	modes.cfb.prototype.start = function(options) {
		if (!("iv" in options)) throw new Error("Invalid IV parameter.");
		this._iv = transformIV(options.iv, this.blockSize);
		this._inBlock = this._iv.slice(0);
		this._partialBytes = 0;
	};
	modes.cfb.prototype.encrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (inputLength === 0) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		if (this._partialBytes === 0 && inputLength >= this.blockSize) {
			for (var i = 0; i < this._ints; ++i) {
				this._inBlock[i] = input.getInt32() ^ this._outBlock[i];
				output.putInt32(this._inBlock[i]);
			}
			return;
		}
		var partialBytes = (this.blockSize - inputLength) % this.blockSize;
		if (partialBytes > 0) partialBytes = this.blockSize - partialBytes;
		this._partialOutput.clear();
		for (var i = 0; i < this._ints; ++i) {
			this._partialBlock[i] = input.getInt32() ^ this._outBlock[i];
			this._partialOutput.putInt32(this._partialBlock[i]);
		}
		if (partialBytes > 0) input.read -= this.blockSize;
		else for (var i = 0; i < this._ints; ++i) this._inBlock[i] = this._partialBlock[i];
		if (this._partialBytes > 0) this._partialOutput.getBytes(this._partialBytes);
		if (partialBytes > 0 && !finish) {
			output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
			this._partialBytes = partialBytes;
			return true;
		}
		output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
		this._partialBytes = 0;
	};
	modes.cfb.prototype.decrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (inputLength === 0) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		if (this._partialBytes === 0 && inputLength >= this.blockSize) {
			for (var i = 0; i < this._ints; ++i) {
				this._inBlock[i] = input.getInt32();
				output.putInt32(this._inBlock[i] ^ this._outBlock[i]);
			}
			return;
		}
		var partialBytes = (this.blockSize - inputLength) % this.blockSize;
		if (partialBytes > 0) partialBytes = this.blockSize - partialBytes;
		this._partialOutput.clear();
		for (var i = 0; i < this._ints; ++i) {
			this._partialBlock[i] = input.getInt32();
			this._partialOutput.putInt32(this._partialBlock[i] ^ this._outBlock[i]);
		}
		if (partialBytes > 0) input.read -= this.blockSize;
		else for (var i = 0; i < this._ints; ++i) this._inBlock[i] = this._partialBlock[i];
		if (this._partialBytes > 0) this._partialOutput.getBytes(this._partialBytes);
		if (partialBytes > 0 && !finish) {
			output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
			this._partialBytes = partialBytes;
			return true;
		}
		output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
		this._partialBytes = 0;
	};
	/** Output feedback (OFB) **/
	modes.ofb = function(options) {
		options = options || {};
		this.name = "OFB";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = null;
		this._outBlock = new Array(this._ints);
		this._partialOutput = forge.util.createBuffer();
		this._partialBytes = 0;
	};
	modes.ofb.prototype.start = function(options) {
		if (!("iv" in options)) throw new Error("Invalid IV parameter.");
		this._iv = transformIV(options.iv, this.blockSize);
		this._inBlock = this._iv.slice(0);
		this._partialBytes = 0;
	};
	modes.ofb.prototype.encrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (input.length() === 0) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		if (this._partialBytes === 0 && inputLength >= this.blockSize) {
			for (var i = 0; i < this._ints; ++i) {
				output.putInt32(input.getInt32() ^ this._outBlock[i]);
				this._inBlock[i] = this._outBlock[i];
			}
			return;
		}
		var partialBytes = (this.blockSize - inputLength) % this.blockSize;
		if (partialBytes > 0) partialBytes = this.blockSize - partialBytes;
		this._partialOutput.clear();
		for (var i = 0; i < this._ints; ++i) this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
		if (partialBytes > 0) input.read -= this.blockSize;
		else for (var i = 0; i < this._ints; ++i) this._inBlock[i] = this._outBlock[i];
		if (this._partialBytes > 0) this._partialOutput.getBytes(this._partialBytes);
		if (partialBytes > 0 && !finish) {
			output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
			this._partialBytes = partialBytes;
			return true;
		}
		output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
		this._partialBytes = 0;
	};
	modes.ofb.prototype.decrypt = modes.ofb.prototype.encrypt;
	/** Counter (CTR) **/
	modes.ctr = function(options) {
		options = options || {};
		this.name = "CTR";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = null;
		this._outBlock = new Array(this._ints);
		this._partialOutput = forge.util.createBuffer();
		this._partialBytes = 0;
	};
	modes.ctr.prototype.start = function(options) {
		if (!("iv" in options)) throw new Error("Invalid IV parameter.");
		this._iv = transformIV(options.iv, this.blockSize);
		this._inBlock = this._iv.slice(0);
		this._partialBytes = 0;
	};
	modes.ctr.prototype.encrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (inputLength === 0) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		if (this._partialBytes === 0 && inputLength >= this.blockSize) for (var i = 0; i < this._ints; ++i) output.putInt32(input.getInt32() ^ this._outBlock[i]);
		else {
			var partialBytes = (this.blockSize - inputLength) % this.blockSize;
			if (partialBytes > 0) partialBytes = this.blockSize - partialBytes;
			this._partialOutput.clear();
			for (var i = 0; i < this._ints; ++i) this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
			if (partialBytes > 0) input.read -= this.blockSize;
			if (this._partialBytes > 0) this._partialOutput.getBytes(this._partialBytes);
			if (partialBytes > 0 && !finish) {
				output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
				this._partialBytes = partialBytes;
				return true;
			}
			output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
			this._partialBytes = 0;
		}
		inc32(this._inBlock);
	};
	modes.ctr.prototype.decrypt = modes.ctr.prototype.encrypt;
	/** Galois/Counter Mode (GCM) **/
	modes.gcm = function(options) {
		options = options || {};
		this.name = "GCM";
		this.cipher = options.cipher;
		this.blockSize = options.blockSize || 16;
		this._ints = this.blockSize / 4;
		this._inBlock = new Array(this._ints);
		this._outBlock = new Array(this._ints);
		this._partialOutput = forge.util.createBuffer();
		this._partialBytes = 0;
		this._R = 3774873600;
	};
	modes.gcm.prototype.start = function(options) {
		if (!("iv" in options)) throw new Error("Invalid IV parameter.");
		var iv = forge.util.createBuffer(options.iv);
		this._cipherLength = 0;
		var additionalData;
		if ("additionalData" in options) additionalData = forge.util.createBuffer(options.additionalData);
		else additionalData = forge.util.createBuffer();
		if ("tagLength" in options) this._tagLength = options.tagLength;
		else this._tagLength = 128;
		this._tag = null;
		if (options.decrypt) {
			this._tag = forge.util.createBuffer(options.tag).getBytes();
			if (this._tag.length !== this._tagLength / 8) throw new Error("Authentication tag does not match tag length.");
		}
		this._hashBlock = new Array(this._ints);
		this.tag = null;
		this._hashSubkey = new Array(this._ints);
		this.cipher.encrypt([
			0,
			0,
			0,
			0
		], this._hashSubkey);
		this.componentBits = 4;
		this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
		var ivLength = iv.length();
		if (ivLength === 12) this._j0 = [
			iv.getInt32(),
			iv.getInt32(),
			iv.getInt32(),
			1
		];
		else {
			this._j0 = [
				0,
				0,
				0,
				0
			];
			while (iv.length() > 0) this._j0 = this.ghash(this._hashSubkey, this._j0, [
				iv.getInt32(),
				iv.getInt32(),
				iv.getInt32(),
				iv.getInt32()
			]);
			this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(from64To32(ivLength * 8)));
		}
		this._inBlock = this._j0.slice(0);
		inc32(this._inBlock);
		this._partialBytes = 0;
		additionalData = forge.util.createBuffer(additionalData);
		this._aDataLength = from64To32(additionalData.length() * 8);
		var overflow = additionalData.length() % this.blockSize;
		if (overflow) additionalData.fillWithByte(0, this.blockSize - overflow);
		this._s = [
			0,
			0,
			0,
			0
		];
		while (additionalData.length() > 0) this._s = this.ghash(this._hashSubkey, this._s, [
			additionalData.getInt32(),
			additionalData.getInt32(),
			additionalData.getInt32(),
			additionalData.getInt32()
		]);
	};
	modes.gcm.prototype.encrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (inputLength === 0) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		if (this._partialBytes === 0 && inputLength >= this.blockSize) {
			for (var i = 0; i < this._ints; ++i) output.putInt32(this._outBlock[i] ^= input.getInt32());
			this._cipherLength += this.blockSize;
		} else {
			var partialBytes = (this.blockSize - inputLength) % this.blockSize;
			if (partialBytes > 0) partialBytes = this.blockSize - partialBytes;
			this._partialOutput.clear();
			for (var i = 0; i < this._ints; ++i) this._partialOutput.putInt32(input.getInt32() ^ this._outBlock[i]);
			if (partialBytes <= 0 || finish) {
				if (finish) {
					var overflow = inputLength % this.blockSize;
					this._cipherLength += overflow;
					this._partialOutput.truncate(this.blockSize - overflow);
				} else this._cipherLength += this.blockSize;
				for (var i = 0; i < this._ints; ++i) this._outBlock[i] = this._partialOutput.getInt32();
				this._partialOutput.read -= this.blockSize;
			}
			if (this._partialBytes > 0) this._partialOutput.getBytes(this._partialBytes);
			if (partialBytes > 0 && !finish) {
				input.read -= this.blockSize;
				output.putBytes(this._partialOutput.getBytes(partialBytes - this._partialBytes));
				this._partialBytes = partialBytes;
				return true;
			}
			output.putBytes(this._partialOutput.getBytes(inputLength - this._partialBytes));
			this._partialBytes = 0;
		}
		this._s = this.ghash(this._hashSubkey, this._s, this._outBlock);
		inc32(this._inBlock);
	};
	modes.gcm.prototype.decrypt = function(input, output, finish) {
		var inputLength = input.length();
		if (inputLength < this.blockSize && !(finish && inputLength > 0)) return true;
		this.cipher.encrypt(this._inBlock, this._outBlock);
		inc32(this._inBlock);
		this._hashBlock[0] = input.getInt32();
		this._hashBlock[1] = input.getInt32();
		this._hashBlock[2] = input.getInt32();
		this._hashBlock[3] = input.getInt32();
		this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
		for (var i = 0; i < this._ints; ++i) output.putInt32(this._outBlock[i] ^ this._hashBlock[i]);
		if (inputLength < this.blockSize) this._cipherLength += inputLength % this.blockSize;
		else this._cipherLength += this.blockSize;
	};
	modes.gcm.prototype.afterFinish = function(output, options) {
		var rval = true;
		if (options.decrypt && options.overflow) output.truncate(this.blockSize - options.overflow);
		this.tag = forge.util.createBuffer();
		var lengths = this._aDataLength.concat(from64To32(this._cipherLength * 8));
		this._s = this.ghash(this._hashSubkey, this._s, lengths);
		var tag = [];
		this.cipher.encrypt(this._j0, tag);
		for (var i = 0; i < this._ints; ++i) this.tag.putInt32(this._s[i] ^ tag[i]);
		this.tag.truncate(this.tag.length() % (this._tagLength / 8));
		if (options.decrypt && this.tag.bytes() !== this._tag) rval = false;
		return rval;
	};
	/**
	* See NIST SP-800-38D 6.3 (Algorithm 1). This function performs Galois
	* field multiplication. The field, GF(2^128), is defined by the polynomial:
	*
	* x^128 + x^7 + x^2 + x + 1
	*
	* Which is represented in little-endian binary form as: 11100001 (0xe1). When
	* the value of a coefficient is 1, a bit is set. The value R, is the
	* concatenation of this value and 120 zero bits, yielding a 128-bit value
	* which matches the block size.
	*
	* This function will multiply two elements (vectors of bytes), X and Y, in
	* the field GF(2^128). The result is initialized to zero. For each bit of
	* X (out of 128), x_i, if x_i is set, then the result is multiplied (XOR'd)
	* by the current value of Y. For each bit, the value of Y will be raised by
	* a power of x (multiplied by the polynomial x). This can be achieved by
	* shifting Y once to the right. If the current value of Y, prior to being
	* multiplied by x, has 0 as its LSB, then it is a 127th degree polynomial.
	* Otherwise, we must divide by R after shifting to find the remainder.
	*
	* @param x the first block to multiply by the second.
	* @param y the second block to multiply by the first.
	*
	* @return the block result of the multiplication.
	*/
	modes.gcm.prototype.multiply = function(x, y) {
		var z_i = [
			0,
			0,
			0,
			0
		];
		var v_i = y.slice(0);
		for (var i = 0; i < 128; ++i) {
			if (x[i / 32 | 0] & 1 << 31 - i % 32) {
				z_i[0] ^= v_i[0];
				z_i[1] ^= v_i[1];
				z_i[2] ^= v_i[2];
				z_i[3] ^= v_i[3];
			}
			this.pow(v_i, v_i);
		}
		return z_i;
	};
	modes.gcm.prototype.pow = function(x, out) {
		var lsb = x[3] & 1;
		for (var i = 3; i > 0; --i) out[i] = x[i] >>> 1 | (x[i - 1] & 1) << 31;
		out[0] = x[0] >>> 1;
		if (lsb) out[0] ^= this._R;
	};
	modes.gcm.prototype.tableMultiply = function(x) {
		var z = [
			0,
			0,
			0,
			0
		];
		for (var i = 0; i < 32; ++i) {
			var x_i = x[i / 8 | 0] >>> (7 - i % 8) * 4 & 15;
			var ah = this._m[i][x_i];
			z[0] ^= ah[0];
			z[1] ^= ah[1];
			z[2] ^= ah[2];
			z[3] ^= ah[3];
		}
		return z;
	};
	/**
	* A continuing version of the GHASH algorithm that operates on a single
	* block. The hash block, last hash value (Ym) and the new block to hash
	* are given.
	*
	* @param h the hash block.
	* @param y the previous value for Ym, use [0, 0, 0, 0] for a new hash.
	* @param x the block to hash.
	*
	* @return the hashed value (Ym).
	*/
	modes.gcm.prototype.ghash = function(h, y, x) {
		y[0] ^= x[0];
		y[1] ^= x[1];
		y[2] ^= x[2];
		y[3] ^= x[3];
		return this.tableMultiply(y);
	};
	/**
	* Precomputes a table for multiplying against the hash subkey. This
	* mechanism provides a substantial speed increase over multiplication
	* performed without a table. The table-based multiplication this table is
	* for solves X * H by multiplying each component of X by H and then
	* composing the results together using XOR.
	*
	* This function can be used to generate tables with different bit sizes
	* for the components, however, this implementation assumes there are
	* 32 components of X (which is a 16 byte vector), therefore each component
	* takes 4-bits (so the table is constructed with bits=4).
	*
	* @param h the hash subkey.
	* @param bits the bit size for a component.
	*/
	modes.gcm.prototype.generateHashTable = function(h, bits) {
		var multiplier = 8 / bits;
		var perInt = 4 * multiplier;
		var size = 16 * multiplier;
		var m = new Array(size);
		for (var i = 0; i < size; ++i) {
			var tmp = [
				0,
				0,
				0,
				0
			];
			var idx = i / perInt | 0;
			var shft = (perInt - 1 - i % perInt) * bits;
			tmp[idx] = 1 << bits - 1 << shft;
			m[i] = this.generateSubHashTable(this.multiply(tmp, h), bits);
		}
		return m;
	};
	/**
	* Generates a table for multiplying against the hash subkey for one
	* particular component (out of all possible component values).
	*
	* @param mid the pre-multiplied value for the middle key of the table.
	* @param bits the bit size for a component.
	*/
	modes.gcm.prototype.generateSubHashTable = function(mid, bits) {
		var size = 1 << bits;
		var half = size >>> 1;
		var m = new Array(size);
		m[half] = mid.slice(0);
		var i = half >>> 1;
		while (i > 0) {
			this.pow(m[2 * i], m[i] = []);
			i >>= 1;
		}
		i = 2;
		while (i < half) {
			for (var j = 1; j < i; ++j) {
				var m_i = m[i];
				var m_j = m[j];
				m[i + j] = [
					m_i[0] ^ m_j[0],
					m_i[1] ^ m_j[1],
					m_i[2] ^ m_j[2],
					m_i[3] ^ m_j[3]
				];
			}
			i *= 2;
		}
		m[0] = [
			0,
			0,
			0,
			0
		];
		for (i = half + 1; i < size; ++i) {
			var c = m[i ^ half];
			m[i] = [
				mid[0] ^ c[0],
				mid[1] ^ c[1],
				mid[2] ^ c[2],
				mid[3] ^ c[3]
			];
		}
		return m;
	};
	/** Utility functions */
	function transformIV(iv, blockSize) {
		if (typeof iv === "string") iv = forge.util.createBuffer(iv);
		if (forge.util.isArray(iv) && iv.length > 4) {
			var tmp = iv;
			iv = forge.util.createBuffer();
			for (var i = 0; i < tmp.length; ++i) iv.putByte(tmp[i]);
		}
		if (iv.length() < blockSize) throw new Error("Invalid IV length; got " + iv.length() + " bytes and expected " + blockSize + " bytes.");
		if (!forge.util.isArray(iv)) {
			var ints = [];
			var blocks = blockSize / 4;
			for (var i = 0; i < blocks; ++i) ints.push(iv.getInt32());
			iv = ints;
		}
		return iv;
	}
	function inc32(block) {
		block[block.length - 1] = block[block.length - 1] + 1 & 4294967295;
	}
	function from64To32(num) {
		return [num / 4294967296 | 0, num & 4294967295];
	}
}));
//#endregion
//#region node_modules/node-forge/lib/aes.js
var require_aes = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Advanced Encryption Standard (AES) implementation.
	*
	* This implementation is based on the public domain library 'jscrypto' which
	* was written by:
	*
	* Emily Stark (estark@stanford.edu)
	* Mike Hamburg (mhamburg@stanford.edu)
	* Dan Boneh (dabo@cs.stanford.edu)
	*
	* Parts of this code are based on the OpenSSL implementation of AES:
	* http://www.openssl.org
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_cipher();
	require_cipherModes();
	require_util();
	module.exports = forge.aes = forge.aes || {};
	/**
	* Deprecated. Instead, use:
	*
	* var cipher = forge.cipher.createCipher('AES-<mode>', key);
	* cipher.start({iv: iv});
	*
	* Creates an AES cipher object to encrypt data using the given symmetric key.
	* The output will be stored in the 'output' member of the returned cipher.
	*
	* The key and iv may be given as a string of bytes, an array of bytes,
	* a byte buffer, or an array of 32-bit words.
	*
	* @param key the symmetric key to use.
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.aes.startEncrypting = function(key, iv, output, mode) {
		var cipher = _createCipher({
			key,
			output,
			decrypt: false,
			mode
		});
		cipher.start(iv);
		return cipher;
	};
	/**
	* Deprecated. Instead, use:
	*
	* var cipher = forge.cipher.createCipher('AES-<mode>', key);
	*
	* Creates an AES cipher object to encrypt data using the given symmetric key.
	*
	* The key may be given as a string of bytes, an array of bytes, a
	* byte buffer, or an array of 32-bit words.
	*
	* @param key the symmetric key to use.
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.aes.createEncryptionCipher = function(key, mode) {
		return _createCipher({
			key,
			output: null,
			decrypt: false,
			mode
		});
	};
	/**
	* Deprecated. Instead, use:
	*
	* var decipher = forge.cipher.createDecipher('AES-<mode>', key);
	* decipher.start({iv: iv});
	*
	* Creates an AES cipher object to decrypt data using the given symmetric key.
	* The output will be stored in the 'output' member of the returned cipher.
	*
	* The key and iv may be given as a string of bytes, an array of bytes,
	* a byte buffer, or an array of 32-bit words.
	*
	* @param key the symmetric key to use.
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.aes.startDecrypting = function(key, iv, output, mode) {
		var cipher = _createCipher({
			key,
			output,
			decrypt: true,
			mode
		});
		cipher.start(iv);
		return cipher;
	};
	/**
	* Deprecated. Instead, use:
	*
	* var decipher = forge.cipher.createDecipher('AES-<mode>', key);
	*
	* Creates an AES cipher object to decrypt data using the given symmetric key.
	*
	* The key may be given as a string of bytes, an array of bytes, a
	* byte buffer, or an array of 32-bit words.
	*
	* @param key the symmetric key to use.
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.aes.createDecryptionCipher = function(key, mode) {
		return _createCipher({
			key,
			output: null,
			decrypt: true,
			mode
		});
	};
	/**
	* Creates a new AES cipher algorithm object.
	*
	* @param name the name of the algorithm.
	* @param mode the mode factory function.
	*
	* @return the AES algorithm object.
	*/
	forge.aes.Algorithm = function(name, mode) {
		if (!init) initialize();
		var self = this;
		self.name = name;
		self.mode = new mode({
			blockSize: 16,
			cipher: {
				encrypt: function(inBlock, outBlock) {
					return _updateBlock(self._w, inBlock, outBlock, false);
				},
				decrypt: function(inBlock, outBlock) {
					return _updateBlock(self._w, inBlock, outBlock, true);
				}
			}
		});
		self._init = false;
	};
	/**
	* Initializes this AES algorithm by expanding its key.
	*
	* @param options the options to use.
	*          key the key to use with this algorithm.
	*          decrypt true if the algorithm should be initialized for decryption,
	*            false for encryption.
	*/
	forge.aes.Algorithm.prototype.initialize = function(options) {
		if (this._init) return;
		var key = options.key;
		var tmp;
		if (typeof key === "string" && (key.length === 16 || key.length === 24 || key.length === 32)) key = forge.util.createBuffer(key);
		else if (forge.util.isArray(key) && (key.length === 16 || key.length === 24 || key.length === 32)) {
			tmp = key;
			key = forge.util.createBuffer();
			for (var i = 0; i < tmp.length; ++i) key.putByte(tmp[i]);
		}
		if (!forge.util.isArray(key)) {
			tmp = key;
			key = [];
			var len = tmp.length();
			if (len === 16 || len === 24 || len === 32) {
				len = len >>> 2;
				for (var i = 0; i < len; ++i) key.push(tmp.getInt32());
			}
		}
		if (!forge.util.isArray(key) || !(key.length === 4 || key.length === 6 || key.length === 8)) throw new Error("Invalid key parameter.");
		var mode = this.mode.name;
		var encryptOp = [
			"CFB",
			"OFB",
			"CTR",
			"GCM"
		].indexOf(mode) !== -1;
		this._w = _expandKey(key, options.decrypt && !encryptOp);
		this._init = true;
	};
	/**
	* Expands a key. Typically only used for testing.
	*
	* @param key the symmetric key to expand, as an array of 32-bit words.
	* @param decrypt true to expand for decryption, false for encryption.
	*
	* @return the expanded key.
	*/
	forge.aes._expandKey = function(key, decrypt) {
		if (!init) initialize();
		return _expandKey(key, decrypt);
	};
	/**
	* Updates a single block. Typically only used for testing.
	*
	* @param w the expanded key to use.
	* @param input an array of block-size 32-bit words.
	* @param output an array of block-size 32-bit words.
	* @param decrypt true to decrypt, false to encrypt.
	*/
	forge.aes._updateBlock = _updateBlock;
	/** Register AES algorithms **/
	registerAlgorithm("AES-ECB", forge.cipher.modes.ecb);
	registerAlgorithm("AES-CBC", forge.cipher.modes.cbc);
	registerAlgorithm("AES-CFB", forge.cipher.modes.cfb);
	registerAlgorithm("AES-OFB", forge.cipher.modes.ofb);
	registerAlgorithm("AES-CTR", forge.cipher.modes.ctr);
	registerAlgorithm("AES-GCM", forge.cipher.modes.gcm);
	function registerAlgorithm(name, mode) {
		var factory = function() {
			return new forge.aes.Algorithm(name, mode);
		};
		forge.cipher.registerAlgorithm(name, factory);
	}
	/** AES implementation **/
	var init = false;
	var Nb = 4;
	var sbox;
	var isbox;
	var rcon;
	var mix;
	var imix;
	/**
	* Performs initialization, ie: precomputes tables to optimize for speed.
	*
	* One way to understand how AES works is to imagine that 'addition' and
	* 'multiplication' are interfaces that require certain mathematical
	* properties to hold true (ie: they are associative) but they might have
	* different implementations and produce different kinds of results ...
	* provided that their mathematical properties remain true. AES defines
	* its own methods of addition and multiplication but keeps some important
	* properties the same, ie: associativity and distributivity. The
	* explanation below tries to shed some light on how AES defines addition
	* and multiplication of bytes and 32-bit words in order to perform its
	* encryption and decryption algorithms.
	*
	* The basics:
	*
	* The AES algorithm views bytes as binary representations of polynomials
	* that have either 1 or 0 as the coefficients. It defines the addition
	* or subtraction of two bytes as the XOR operation. It also defines the
	* multiplication of two bytes as a finite field referred to as GF(2^8)
	* (Note: 'GF' means "Galois Field" which is a field that contains a finite
	* number of elements so GF(2^8) has 256 elements).
	*
	* This means that any two bytes can be represented as binary polynomials;
	* when they multiplied together and modularly reduced by an irreducible
	* polynomial of the 8th degree, the results are the field GF(2^8). The
	* specific irreducible polynomial that AES uses in hexadecimal is 0x11b.
	* This multiplication is associative with 0x01 as the identity:
	*
	* (b * 0x01 = GF(b, 0x01) = b).
	*
	* The operation GF(b, 0x02) can be performed at the byte level by left
	* shifting b once and then XOR'ing it (to perform the modular reduction)
	* with 0x11b if b is >= 128. Repeated application of the multiplication
	* of 0x02 can be used to implement the multiplication of any two bytes.
	*
	* For instance, multiplying 0x57 and 0x13, denoted as GF(0x57, 0x13), can
	* be performed by factoring 0x13 into 0x01, 0x02, and 0x10. Then these
	* factors can each be multiplied by 0x57 and then added together. To do
	* the multiplication, values for 0x57 multiplied by each of these 3 factors
	* can be precomputed and stored in a table. To add them, the values from
	* the table are XOR'd together.
	*
	* AES also defines addition and multiplication of words, that is 4-byte
	* numbers represented as polynomials of 3 degrees where the coefficients
	* are the values of the bytes.
	*
	* The word [a0, a1, a2, a3] is a polynomial a3x^3 + a2x^2 + a1x + a0.
	*
	* Addition is performed by XOR'ing like powers of x. Multiplication
	* is performed in two steps, the first is an algebraic expansion as
	* you would do normally (where addition is XOR). But the result is
	* a polynomial larger than 3 degrees and thus it cannot fit in a word. So
	* next the result is modularly reduced by an AES-specific polynomial of
	* degree 4 which will always produce a polynomial of less than 4 degrees
	* such that it will fit in a word. In AES, this polynomial is x^4 + 1.
	*
	* The modular product of two polynomials 'a' and 'b' is thus:
	*
	* d(x) = d3x^3 + d2x^2 + d1x + d0
	* with
	* d0 = GF(a0, b0) ^ GF(a3, b1) ^ GF(a2, b2) ^ GF(a1, b3)
	* d1 = GF(a1, b0) ^ GF(a0, b1) ^ GF(a3, b2) ^ GF(a2, b3)
	* d2 = GF(a2, b0) ^ GF(a1, b1) ^ GF(a0, b2) ^ GF(a3, b3)
	* d3 = GF(a3, b0) ^ GF(a2, b1) ^ GF(a1, b2) ^ GF(a0, b3)
	*
	* As a matrix:
	*
	* [d0] = [a0 a3 a2 a1][b0]
	* [d1]   [a1 a0 a3 a2][b1]
	* [d2]   [a2 a1 a0 a3][b2]
	* [d3]   [a3 a2 a1 a0][b3]
	*
	* Special polynomials defined by AES (0x02 == {02}):
	* a(x)    = {03}x^3 + {01}x^2 + {01}x + {02}
	* a^-1(x) = {0b}x^3 + {0d}x^2 + {09}x + {0e}.
	*
	* These polynomials are used in the MixColumns() and InverseMixColumns()
	* operations, respectively, to cause each element in the state to affect
	* the output (referred to as diffusing).
	*
	* RotWord() uses: a0 = a1 = a2 = {00} and a3 = {01}, which is the
	* polynomial x3.
	*
	* The ShiftRows() method modifies the last 3 rows in the state (where
	* the state is 4 words with 4 bytes per word) by shifting bytes cyclically.
	* The 1st byte in the second row is moved to the end of the row. The 1st
	* and 2nd bytes in the third row are moved to the end of the row. The 1st,
	* 2nd, and 3rd bytes are moved in the fourth row.
	*
	* More details on how AES arithmetic works:
	*
	* In the polynomial representation of binary numbers, XOR performs addition
	* and subtraction and multiplication in GF(2^8) denoted as GF(a, b)
	* corresponds with the multiplication of polynomials modulo an irreducible
	* polynomial of degree 8. In other words, for AES, GF(a, b) will multiply
	* polynomial 'a' with polynomial 'b' and then do a modular reduction by
	* an AES-specific irreducible polynomial of degree 8.
	*
	* A polynomial is irreducible if its only divisors are one and itself. For
	* the AES algorithm, this irreducible polynomial is:
	*
	* m(x) = x^8 + x^4 + x^3 + x + 1,
	*
	* or {01}{1b} in hexadecimal notation, where each coefficient is a bit:
	* 100011011 = 283 = 0x11b.
	*
	* For example, GF(0x57, 0x83) = 0xc1 because
	*
	* 0x57 = 87  = 01010111 = x^6 + x^4 + x^2 + x + 1
	* 0x85 = 131 = 10000101 = x^7 + x + 1
	*
	* (x^6 + x^4 + x^2 + x + 1) * (x^7 + x + 1)
	* =  x^13 + x^11 + x^9 + x^8 + x^7 +
	*    x^7 + x^5 + x^3 + x^2 + x +
	*    x^6 + x^4 + x^2 + x + 1
	* =  x^13 + x^11 + x^9 + x^8 + x^6 + x^5 + x^4 + x^3 + 1 = y
	*    y modulo (x^8 + x^4 + x^3 + x + 1)
	* =  x^7 + x^6 + 1.
	*
	* The modular reduction by m(x) guarantees the result will be a binary
	* polynomial of less than degree 8, so that it can fit in a byte.
	*
	* The operation to multiply a binary polynomial b with x (the polynomial
	* x in binary representation is 00000010) is:
	*
	* b_7x^8 + b_6x^7 + b_5x^6 + b_4x^5 + b_3x^4 + b_2x^3 + b_1x^2 + b_0x^1
	*
	* To get GF(b, x) we must reduce that by m(x). If b_7 is 0 (that is the
	* most significant bit is 0 in b) then the result is already reduced. If
	* it is 1, then we can reduce it by subtracting m(x) via an XOR.
	*
	* It follows that multiplication by x (00000010 or 0x02) can be implemented
	* by performing a left shift followed by a conditional bitwise XOR with
	* 0x1b. This operation on bytes is denoted by xtime(). Multiplication by
	* higher powers of x can be implemented by repeated application of xtime().
	*
	* By adding intermediate results, multiplication by any constant can be
	* implemented. For instance:
	*
	* GF(0x57, 0x13) = 0xfe because:
	*
	* xtime(b) = (b & 128) ? (b << 1 ^ 0x11b) : (b << 1)
	*
	* Note: We XOR with 0x11b instead of 0x1b because in javascript our
	* datatype for b can be larger than 1 byte, so a left shift will not
	* automatically eliminate bits that overflow a byte ... by XOR'ing the
	* overflow bit with 1 (the extra one from 0x11b) we zero it out.
	*
	* GF(0x57, 0x02) = xtime(0x57) = 0xae
	* GF(0x57, 0x04) = xtime(0xae) = 0x47
	* GF(0x57, 0x08) = xtime(0x47) = 0x8e
	* GF(0x57, 0x10) = xtime(0x8e) = 0x07
	*
	* GF(0x57, 0x13) = GF(0x57, (0x01 ^ 0x02 ^ 0x10))
	*
	* And by the distributive property (since XOR is addition and GF() is
	* multiplication):
	*
	* = GF(0x57, 0x01) ^ GF(0x57, 0x02) ^ GF(0x57, 0x10)
	* = 0x57 ^ 0xae ^ 0x07
	* = 0xfe.
	*/
	function initialize() {
		init = true;
		rcon = [
			0,
			1,
			2,
			4,
			8,
			16,
			32,
			64,
			128,
			27,
			54
		];
		var xtime = new Array(256);
		for (var i = 0; i < 128; ++i) {
			xtime[i] = i << 1;
			xtime[i + 128] = i + 128 << 1 ^ 283;
		}
		sbox = new Array(256);
		isbox = new Array(256);
		mix = new Array(4);
		imix = new Array(4);
		for (var i = 0; i < 4; ++i) {
			mix[i] = new Array(256);
			imix[i] = new Array(256);
		}
		var e = 0, ei = 0, e2, e4, e8, sx, sx2, me, ime;
		for (var i = 0; i < 256; ++i) {
			sx = ei ^ ei << 1 ^ ei << 2 ^ ei << 3 ^ ei << 4;
			sx = sx >> 8 ^ sx & 255 ^ 99;
			sbox[e] = sx;
			isbox[sx] = e;
			sx2 = xtime[sx];
			e2 = xtime[e];
			e4 = xtime[e2];
			e8 = xtime[e4];
			me = sx2 << 24 ^ sx << 16 ^ sx << 8 ^ (sx ^ sx2);
			ime = (e2 ^ e4 ^ e8) << 24 ^ (e ^ e8) << 16 ^ (e ^ e4 ^ e8) << 8 ^ (e ^ e2 ^ e8);
			for (var n = 0; n < 4; ++n) {
				mix[n][e] = me;
				imix[n][sx] = ime;
				me = me << 24 | me >>> 8;
				ime = ime << 24 | ime >>> 8;
			}
			if (e === 0) e = ei = 1;
			else {
				e = e2 ^ xtime[xtime[xtime[e2 ^ e8]]];
				ei ^= xtime[xtime[ei]];
			}
		}
	}
	/**
	* Generates a key schedule using the AES key expansion algorithm.
	*
	* The AES algorithm takes the Cipher Key, K, and performs a Key Expansion
	* routine to generate a key schedule. The Key Expansion generates a total
	* of Nb*(Nr + 1) words: the algorithm requires an initial set of Nb words,
	* and each of the Nr rounds requires Nb words of key data. The resulting
	* key schedule consists of a linear array of 4-byte words, denoted [wi ],
	* with i in the range 0 <= i < Nb(Nr + 1).
	*
	* KeyExpansion(byte key[4*Nk], word w[Nb*(Nr+1)], Nk)
	* AES-128 (Nb=4, Nk=4, Nr=10)
	* AES-192 (Nb=4, Nk=6, Nr=12)
	* AES-256 (Nb=4, Nk=8, Nr=14)
	* Note: Nr=Nk+6.
	*
	* Nb is the number of columns (32-bit words) comprising the State (or
	* number of bytes in a block). For AES, Nb=4.
	*
	* @param key the key to schedule (as an array of 32-bit words).
	* @param decrypt true to modify the key schedule to decrypt, false not to.
	*
	* @return the generated key schedule.
	*/
	function _expandKey(key, decrypt) {
		var w = key.slice(0);
		var temp, iNk = 1;
		var Nk = w.length;
		var end = Nb * (Nk + 6 + 1);
		for (var i = Nk; i < end; ++i) {
			temp = w[i - 1];
			if (i % Nk === 0) {
				temp = sbox[temp >>> 16 & 255] << 24 ^ sbox[temp >>> 8 & 255] << 16 ^ sbox[temp & 255] << 8 ^ sbox[temp >>> 24] ^ rcon[iNk] << 24;
				iNk++;
			} else if (Nk > 6 && i % Nk === 4) temp = sbox[temp >>> 24] << 24 ^ sbox[temp >>> 16 & 255] << 16 ^ sbox[temp >>> 8 & 255] << 8 ^ sbox[temp & 255];
			w[i] = w[i - Nk] ^ temp;
		}
		if (decrypt) {
			var tmp;
			var m0 = imix[0];
			var m1 = imix[1];
			var m2 = imix[2];
			var m3 = imix[3];
			var wnew = w.slice(0);
			end = w.length;
			for (var i = 0, wi = end - Nb; i < end; i += Nb, wi -= Nb) if (i === 0 || i === end - Nb) {
				wnew[i] = w[wi];
				wnew[i + 1] = w[wi + 3];
				wnew[i + 2] = w[wi + 2];
				wnew[i + 3] = w[wi + 1];
			} else for (var n = 0; n < Nb; ++n) {
				tmp = w[wi + n];
				wnew[i + (3 & -n)] = m0[sbox[tmp >>> 24]] ^ m1[sbox[tmp >>> 16 & 255]] ^ m2[sbox[tmp >>> 8 & 255]] ^ m3[sbox[tmp & 255]];
			}
			w = wnew;
		}
		return w;
	}
	/**
	* Updates a single block (16 bytes) using AES. The update will either
	* encrypt or decrypt the block.
	*
	* @param w the key schedule.
	* @param input the input block (an array of 32-bit words).
	* @param output the updated output block.
	* @param decrypt true to decrypt the block, false to encrypt it.
	*/
	function _updateBlock(w, input, output, decrypt) {
		var Nr = w.length / 4 - 1;
		var m0, m1, m2, m3, sub;
		if (decrypt) {
			m0 = imix[0];
			m1 = imix[1];
			m2 = imix[2];
			m3 = imix[3];
			sub = isbox;
		} else {
			m0 = mix[0];
			m1 = mix[1];
			m2 = mix[2];
			m3 = mix[3];
			sub = sbox;
		}
		var a = input[0] ^ w[0], b = input[decrypt ? 3 : 1] ^ w[1], c = input[2] ^ w[2], d = input[decrypt ? 1 : 3] ^ w[3], a2, b2, c2;
		var i = 3;
		for (var round = 1; round < Nr; ++round) {
			a2 = m0[a >>> 24] ^ m1[b >>> 16 & 255] ^ m2[c >>> 8 & 255] ^ m3[d & 255] ^ w[++i];
			b2 = m0[b >>> 24] ^ m1[c >>> 16 & 255] ^ m2[d >>> 8 & 255] ^ m3[a & 255] ^ w[++i];
			c2 = m0[c >>> 24] ^ m1[d >>> 16 & 255] ^ m2[a >>> 8 & 255] ^ m3[b & 255] ^ w[++i];
			d = m0[d >>> 24] ^ m1[a >>> 16 & 255] ^ m2[b >>> 8 & 255] ^ m3[c & 255] ^ w[++i];
			a = a2;
			b = b2;
			c = c2;
		}
		output[0] = sub[a >>> 24] << 24 ^ sub[b >>> 16 & 255] << 16 ^ sub[c >>> 8 & 255] << 8 ^ sub[d & 255] ^ w[++i];
		output[decrypt ? 3 : 1] = sub[b >>> 24] << 24 ^ sub[c >>> 16 & 255] << 16 ^ sub[d >>> 8 & 255] << 8 ^ sub[a & 255] ^ w[++i];
		output[2] = sub[c >>> 24] << 24 ^ sub[d >>> 16 & 255] << 16 ^ sub[a >>> 8 & 255] << 8 ^ sub[b & 255] ^ w[++i];
		output[decrypt ? 1 : 3] = sub[d >>> 24] << 24 ^ sub[a >>> 16 & 255] << 16 ^ sub[b >>> 8 & 255] << 8 ^ sub[c & 255] ^ w[++i];
	}
	/**
	* Deprecated. Instead, use:
	*
	* forge.cipher.createCipher('AES-<mode>', key);
	* forge.cipher.createDecipher('AES-<mode>', key);
	*
	* Creates a deprecated AES cipher object. This object's mode will default to
	* CBC (cipher-block-chaining).
	*
	* The key and iv may be given as a string of bytes, an array of bytes, a
	* byte buffer, or an array of 32-bit words.
	*
	* @param options the options to use.
	*          key the symmetric key to use.
	*          output the buffer to write to.
	*          decrypt true for decryption, false for encryption.
	*          mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	function _createCipher(options) {
		options = options || {};
		var algorithm = "AES-" + (options.mode || "CBC").toUpperCase();
		var cipher;
		if (options.decrypt) cipher = forge.cipher.createDecipher(algorithm, options.key);
		else cipher = forge.cipher.createCipher(algorithm, options.key);
		var start = cipher.start;
		cipher.start = function(iv, options) {
			var output = null;
			if (options instanceof forge.util.ByteBuffer) {
				output = options;
				options = {};
			}
			options = options || {};
			options.output = output;
			options.iv = iv;
			start.call(cipher, options);
		};
		return cipher;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/oids.js
var require_oids = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Object IDs for ASN.1.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2013 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	forge.pki = forge.pki || {};
	var oids = module.exports = forge.pki.oids = forge.oids = forge.oids || {};
	function _IN(id, name) {
		oids[id] = name;
		oids[name] = id;
	}
	function _I_(id, name) {
		oids[id] = name;
	}
	_IN("1.2.840.113549.1.1.1", "rsaEncryption");
	_IN("1.2.840.113549.1.1.4", "md5WithRSAEncryption");
	_IN("1.2.840.113549.1.1.5", "sha1WithRSAEncryption");
	_IN("1.2.840.113549.1.1.7", "RSAES-OAEP");
	_IN("1.2.840.113549.1.1.8", "mgf1");
	_IN("1.2.840.113549.1.1.9", "pSpecified");
	_IN("1.2.840.113549.1.1.10", "RSASSA-PSS");
	_IN("1.2.840.113549.1.1.11", "sha256WithRSAEncryption");
	_IN("1.2.840.113549.1.1.12", "sha384WithRSAEncryption");
	_IN("1.2.840.113549.1.1.13", "sha512WithRSAEncryption");
	_IN("1.3.101.112", "EdDSA25519");
	_IN("1.2.840.10040.4.3", "dsa-with-sha1");
	_IN("1.3.14.3.2.7", "desCBC");
	_IN("1.3.14.3.2.26", "sha1");
	_IN("1.3.14.3.2.29", "sha1WithRSASignature");
	_IN("2.16.840.1.101.3.4.2.1", "sha256");
	_IN("2.16.840.1.101.3.4.2.2", "sha384");
	_IN("2.16.840.1.101.3.4.2.3", "sha512");
	_IN("2.16.840.1.101.3.4.2.4", "sha224");
	_IN("2.16.840.1.101.3.4.2.5", "sha512-224");
	_IN("2.16.840.1.101.3.4.2.6", "sha512-256");
	_IN("1.2.840.113549.2.2", "md2");
	_IN("1.2.840.113549.2.5", "md5");
	_IN("1.2.840.113549.1.7.1", "data");
	_IN("1.2.840.113549.1.7.2", "signedData");
	_IN("1.2.840.113549.1.7.3", "envelopedData");
	_IN("1.2.840.113549.1.7.4", "signedAndEnvelopedData");
	_IN("1.2.840.113549.1.7.5", "digestedData");
	_IN("1.2.840.113549.1.7.6", "encryptedData");
	_IN("1.2.840.113549.1.9.1", "emailAddress");
	_IN("1.2.840.113549.1.9.2", "unstructuredName");
	_IN("1.2.840.113549.1.9.3", "contentType");
	_IN("1.2.840.113549.1.9.4", "messageDigest");
	_IN("1.2.840.113549.1.9.5", "signingTime");
	_IN("1.2.840.113549.1.9.6", "counterSignature");
	_IN("1.2.840.113549.1.9.7", "challengePassword");
	_IN("1.2.840.113549.1.9.8", "unstructuredAddress");
	_IN("1.2.840.113549.1.9.14", "extensionRequest");
	_IN("1.2.840.113549.1.9.20", "friendlyName");
	_IN("1.2.840.113549.1.9.21", "localKeyId");
	_IN("1.2.840.113549.1.9.22.1", "x509Certificate");
	_IN("1.2.840.113549.1.12.10.1.1", "keyBag");
	_IN("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag");
	_IN("1.2.840.113549.1.12.10.1.3", "certBag");
	_IN("1.2.840.113549.1.12.10.1.4", "crlBag");
	_IN("1.2.840.113549.1.12.10.1.5", "secretBag");
	_IN("1.2.840.113549.1.12.10.1.6", "safeContentsBag");
	_IN("1.2.840.113549.1.5.13", "pkcs5PBES2");
	_IN("1.2.840.113549.1.5.12", "pkcs5PBKDF2");
	_IN("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4");
	_IN("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4");
	_IN("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC");
	_IN("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC");
	_IN("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC");
	_IN("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC");
	_IN("1.2.840.113549.2.7", "hmacWithSHA1");
	_IN("1.2.840.113549.2.8", "hmacWithSHA224");
	_IN("1.2.840.113549.2.9", "hmacWithSHA256");
	_IN("1.2.840.113549.2.10", "hmacWithSHA384");
	_IN("1.2.840.113549.2.11", "hmacWithSHA512");
	_IN("1.2.840.113549.3.7", "des-EDE3-CBC");
	_IN("2.16.840.1.101.3.4.1.2", "aes128-CBC");
	_IN("2.16.840.1.101.3.4.1.22", "aes192-CBC");
	_IN("2.16.840.1.101.3.4.1.42", "aes256-CBC");
	_IN("2.5.4.3", "commonName");
	_IN("2.5.4.4", "surname");
	_IN("2.5.4.5", "serialNumber");
	_IN("2.5.4.6", "countryName");
	_IN("2.5.4.7", "localityName");
	_IN("2.5.4.8", "stateOrProvinceName");
	_IN("2.5.4.9", "streetAddress");
	_IN("2.5.4.10", "organizationName");
	_IN("2.5.4.11", "organizationalUnitName");
	_IN("2.5.4.12", "title");
	_IN("2.5.4.13", "description");
	_IN("2.5.4.15", "businessCategory");
	_IN("2.5.4.17", "postalCode");
	_IN("2.5.4.42", "givenName");
	_IN("2.5.4.65", "pseudonym");
	_IN("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName");
	_IN("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName");
	_IN("2.16.840.1.113730.1.1", "nsCertType");
	_IN("2.16.840.1.113730.1.13", "nsComment");
	_I_("2.5.29.1", "authorityKeyIdentifier");
	_I_("2.5.29.2", "keyAttributes");
	_I_("2.5.29.3", "certificatePolicies");
	_I_("2.5.29.4", "keyUsageRestriction");
	_I_("2.5.29.5", "policyMapping");
	_I_("2.5.29.6", "subtreesConstraint");
	_I_("2.5.29.7", "subjectAltName");
	_I_("2.5.29.8", "issuerAltName");
	_I_("2.5.29.9", "subjectDirectoryAttributes");
	_I_("2.5.29.10", "basicConstraints");
	_I_("2.5.29.11", "nameConstraints");
	_I_("2.5.29.12", "policyConstraints");
	_I_("2.5.29.13", "basicConstraints");
	_IN("2.5.29.14", "subjectKeyIdentifier");
	_IN("2.5.29.15", "keyUsage");
	_I_("2.5.29.16", "privateKeyUsagePeriod");
	_IN("2.5.29.17", "subjectAltName");
	_IN("2.5.29.18", "issuerAltName");
	_IN("2.5.29.19", "basicConstraints");
	_I_("2.5.29.20", "cRLNumber");
	_I_("2.5.29.21", "cRLReason");
	_I_("2.5.29.22", "expirationDate");
	_I_("2.5.29.23", "instructionCode");
	_I_("2.5.29.24", "invalidityDate");
	_I_("2.5.29.25", "cRLDistributionPoints");
	_I_("2.5.29.26", "issuingDistributionPoint");
	_I_("2.5.29.27", "deltaCRLIndicator");
	_I_("2.5.29.28", "issuingDistributionPoint");
	_I_("2.5.29.29", "certificateIssuer");
	_I_("2.5.29.30", "nameConstraints");
	_IN("2.5.29.31", "cRLDistributionPoints");
	_IN("2.5.29.32", "certificatePolicies");
	_I_("2.5.29.33", "policyMappings");
	_I_("2.5.29.34", "policyConstraints");
	_IN("2.5.29.35", "authorityKeyIdentifier");
	_I_("2.5.29.36", "policyConstraints");
	_IN("2.5.29.37", "extKeyUsage");
	_I_("2.5.29.46", "freshestCRL");
	_I_("2.5.29.54", "inhibitAnyPolicy");
	_IN("1.3.6.1.4.1.11129.2.4.2", "timestampList");
	_IN("1.3.6.1.5.5.7.1.1", "authorityInfoAccess");
	_IN("1.3.6.1.5.5.7.3.1", "serverAuth");
	_IN("1.3.6.1.5.5.7.3.2", "clientAuth");
	_IN("1.3.6.1.5.5.7.3.3", "codeSigning");
	_IN("1.3.6.1.5.5.7.3.4", "emailProtection");
	_IN("1.3.6.1.5.5.7.3.8", "timeStamping");
}));
//#endregion
//#region node_modules/node-forge/lib/asn1.js
var require_asn1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of Abstract Syntax Notation Number One.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2015 Digital Bazaar, Inc.
	*
	* An API for storing data using the Abstract Syntax Notation Number One
	* format using DER (Distinguished Encoding Rules) encoding. This encoding is
	* commonly used to store data for PKI, i.e. X.509 Certificates, and this
	* implementation exists for that purpose.
	*
	* Abstract Syntax Notation Number One (ASN.1) is used to define the abstract
	* syntax of information without restricting the way the information is encoded
	* for transmission. It provides a standard that allows for open systems
	* communication. ASN.1 defines the syntax of information data and a number of
	* simple data types as well as a notation for describing them and specifying
	* values for them.
	*
	* The RSA algorithm creates public and private keys that are often stored in
	* X.509 or PKCS#X formats -- which use ASN.1 (encoded in DER format). This
	* class provides the most basic functionality required to store and load DSA
	* keys that are encoded according to ASN.1.
	*
	* The most common binary encodings for ASN.1 are BER (Basic Encoding Rules)
	* and DER (Distinguished Encoding Rules). DER is just a subset of BER that
	* has stricter requirements for how data must be encoded.
	*
	* Each ASN.1 structure has a tag (a byte identifying the ASN.1 structure type)
	* and a byte array for the value of this ASN1 structure which may be data or a
	* list of ASN.1 structures.
	*
	* Each ASN.1 structure using BER is (Tag-Length-Value):
	*
	* | byte 0 | bytes X | bytes Y |
	* |--------|---------|----------
	* |  tag   | length  |  value  |
	*
	* ASN.1 allows for tags to be of "High-tag-number form" which allows a tag to
	* be two or more octets, but that is not supported by this class. A tag is
	* only 1 byte. Bits 1-5 give the tag number (ie the data type within a
	* particular 'class'), 6 indicates whether or not the ASN.1 value is
	* constructed from other ASN.1 values, and bits 7 and 8 give the 'class'. If
	* bits 7 and 8 are both zero, the class is UNIVERSAL. If only bit 7 is set,
	* then the class is APPLICATION. If only bit 8 is set, then the class is
	* CONTEXT_SPECIFIC. If both bits 7 and 8 are set, then the class is PRIVATE.
	* The tag numbers for the data types for the class UNIVERSAL are listed below:
	*
	* UNIVERSAL 0 Reserved for use by the encoding rules
	* UNIVERSAL 1 Boolean type
	* UNIVERSAL 2 Integer type
	* UNIVERSAL 3 Bitstring type
	* UNIVERSAL 4 Octetstring type
	* UNIVERSAL 5 Null type
	* UNIVERSAL 6 Object identifier type
	* UNIVERSAL 7 Object descriptor type
	* UNIVERSAL 8 External type and Instance-of type
	* UNIVERSAL 9 Real type
	* UNIVERSAL 10 Enumerated type
	* UNIVERSAL 11 Embedded-pdv type
	* UNIVERSAL 12 UTF8String type
	* UNIVERSAL 13 Relative object identifier type
	* UNIVERSAL 14-15 Reserved for future editions
	* UNIVERSAL 16 Sequence and Sequence-of types
	* UNIVERSAL 17 Set and Set-of types
	* UNIVERSAL 18-22, 25-30 Character string types
	* UNIVERSAL 23-24 Time types
	*
	* The length of an ASN.1 structure is specified after the tag identifier.
	* There is a definite form and an indefinite form. The indefinite form may
	* be used if the encoding is constructed and not all immediately available.
	* The indefinite form is encoded using a length byte with only the 8th bit
	* set. The end of the constructed object is marked using end-of-contents
	* octets (two zero bytes).
	*
	* The definite form looks like this:
	*
	* The length may take up 1 or more bytes, it depends on the length of the
	* value of the ASN.1 structure. DER encoding requires that if the ASN.1
	* structure has a value that has a length greater than 127, more than 1 byte
	* will be used to store its length, otherwise just one byte will be used.
	* This is strict.
	*
	* In the case that the length of the ASN.1 value is less than 127, 1 octet
	* (byte) is used to store the "short form" length. The 8th bit has a value of
	* 0 indicating the length is "short form" and not "long form" and bits 7-1
	* give the length of the data. (The 8th bit is the left-most, most significant
	* bit: also known as big endian or network format).
	*
	* In the case that the length of the ASN.1 value is greater than 127, 2 to
	* 127 octets (bytes) are used to store the "long form" length. The first
	* byte's 8th bit is set to 1 to indicate the length is "long form." Bits 7-1
	* give the number of additional octets. All following octets are in base 256
	* with the most significant digit first (typical big-endian binary unsigned
	* integer storage). So, for instance, if the length of a value was 257, the
	* first byte would be set to:
	*
	* 10000010 = 130 = 0x82.
	*
	* This indicates there are 2 octets (base 256) for the length. The second and
	* third bytes (the octets just mentioned) would store the length in base 256:
	*
	* octet 2: 00000001 = 1 * 256^1 = 256
	* octet 3: 00000001 = 1 * 256^0 = 1
	* total = 257
	*
	* The algorithm for converting a js integer value of 257 to base-256 is:
	*
	* var value = 257;
	* var bytes = [];
	* bytes[0] = (value >>> 8) & 0xFF; // most significant byte first
	* bytes[1] = value & 0xFF;        // least significant byte last
	*
	* On the ASN.1 UNIVERSAL Object Identifier (OID) type:
	*
	* An OID can be written like: "value1.value2.value3...valueN"
	*
	* The DER encoding rules:
	*
	* The first byte has the value 40 * value1 + value2.
	* The following bytes, if any, encode the remaining values. Each value is
	* encoded in base 128, most significant digit first (big endian), with as
	* few digits as possible, and the most significant bit of each byte set
	* to 1 except the last in each value's encoding. For example: Given the
	* OID "1.2.840.113549", its DER encoding is (remember each byte except the
	* last one in each encoding is OR'd with 0x80):
	*
	* byte 1: 40 * 1 + 2 = 42 = 0x2A.
	* bytes 2-3: 128 * 6 + 72 = 840 = 6 72 = 6 72 = 0x0648 = 0x8648
	* bytes 4-6: 16384 * 6 + 128 * 119 + 13 = 6 119 13 = 0x06770D = 0x86F70D
	*
	* The final value is: 0x2A864886F70D.
	* The full OID (including ASN.1 tag and length of 6 bytes) is:
	* 0x06062A864886F70D
	*/
	var forge = require_forge();
	require_util();
	require_oids();
	var asn1 = module.exports = forge.asn1 = forge.asn1 || {};
	/**
	* ASN.1 classes.
	*/
	asn1.Class = {
		UNIVERSAL: 0,
		APPLICATION: 64,
		CONTEXT_SPECIFIC: 128,
		PRIVATE: 192
	};
	/**
	* ASN.1 types. Not all types are supported by this implementation, only
	* those necessary to implement a simple PKI are implemented.
	*/
	asn1.Type = {
		NONE: 0,
		BOOLEAN: 1,
		INTEGER: 2,
		BITSTRING: 3,
		OCTETSTRING: 4,
		NULL: 5,
		OID: 6,
		ODESC: 7,
		EXTERNAL: 8,
		REAL: 9,
		ENUMERATED: 10,
		EMBEDDED: 11,
		UTF8: 12,
		ROID: 13,
		SEQUENCE: 16,
		SET: 17,
		PRINTABLESTRING: 19,
		IA5STRING: 22,
		UTCTIME: 23,
		GENERALIZEDTIME: 24,
		BMPSTRING: 30
	};
	/**
	* Sets the default maximum recursion depth when parsing ASN.1 structures.
	*/
	asn1.maxDepth = 256;
	/**
	* Creates a new asn1 object.
	*
	* @param tagClass the tag class for the object.
	* @param type the data type (tag number) for the object.
	* @param constructed true if the asn1 object is in constructed form.
	* @param value the value for the object, if it is not constructed.
	* @param [options] the options to use:
	*          [bitStringContents] the plain BIT STRING content including padding
	*            byte.
	*
	* @return the asn1 object.
	*/
	asn1.create = function(tagClass, type, constructed, value, options) {
		if (forge.util.isArray(value)) {
			var tmp = [];
			for (var i = 0; i < value.length; ++i) if (value[i] !== void 0) tmp.push(value[i]);
			value = tmp;
		}
		var obj = {
			tagClass,
			type,
			constructed,
			composed: constructed || forge.util.isArray(value),
			value
		};
		if (options && "bitStringContents" in options) {
			obj.bitStringContents = options.bitStringContents;
			obj.original = asn1.copy(obj);
		}
		return obj;
	};
	/**
	* Copies an asn1 object.
	*
	* @param obj the asn1 object.
	* @param [options] copy options:
	*          [excludeBitStringContents] true to not copy bitStringContents
	*
	* @return the a copy of the asn1 object.
	*/
	asn1.copy = function(obj, options) {
		var copy;
		if (forge.util.isArray(obj)) {
			copy = [];
			for (var i = 0; i < obj.length; ++i) copy.push(asn1.copy(obj[i], options));
			return copy;
		}
		if (typeof obj === "string") return obj;
		copy = {
			tagClass: obj.tagClass,
			type: obj.type,
			constructed: obj.constructed,
			composed: obj.composed,
			value: asn1.copy(obj.value, options)
		};
		if (options && !options.excludeBitStringContents) copy.bitStringContents = obj.bitStringContents;
		return copy;
	};
	/**
	* Compares asn1 objects for equality.
	*
	* Note this function does not run in constant time.
	*
	* @param obj1 the first asn1 object.
	* @param obj2 the second asn1 object.
	* @param [options] compare options:
	*          [includeBitStringContents] true to compare bitStringContents
	*
	* @return true if the asn1 objects are equal.
	*/
	asn1.equals = function(obj1, obj2, options) {
		if (forge.util.isArray(obj1)) {
			if (!forge.util.isArray(obj2)) return false;
			if (obj1.length !== obj2.length) return false;
			for (var i = 0; i < obj1.length; ++i) if (!asn1.equals(obj1[i], obj2[i])) return false;
			return true;
		}
		if (typeof obj1 !== typeof obj2) return false;
		if (typeof obj1 === "string") return obj1 === obj2;
		var equal = obj1.tagClass === obj2.tagClass && obj1.type === obj2.type && obj1.constructed === obj2.constructed && obj1.composed === obj2.composed && asn1.equals(obj1.value, obj2.value);
		if (options && options.includeBitStringContents) equal = equal && obj1.bitStringContents === obj2.bitStringContents;
		return equal;
	};
	/**
	* Gets the length of a BER-encoded ASN.1 value.
	*
	* In case the length is not specified, undefined is returned.
	*
	* @param b the BER-encoded ASN.1 byte buffer, starting with the first
	*          length byte.
	*
	* @return the length of the BER-encoded ASN.1 value or undefined.
	*/
	asn1.getBerValueLength = function(b) {
		var b2 = b.getByte();
		if (b2 === 128) return;
		var length;
		if (!(b2 & 128)) length = b2;
		else length = b.getInt((b2 & 127) << 3);
		return length;
	};
	/**
	* Check if the byte buffer has enough bytes. Throws an Error if not.
	*
	* @param bytes the byte buffer to parse from.
	* @param remaining the bytes remaining in the current parsing state.
	* @param n the number of bytes the buffer must have.
	*/
	function _checkBufferLength(bytes, remaining, n) {
		if (n > remaining) {
			var error = /* @__PURE__ */ new Error("Too few bytes to parse DER.");
			error.available = bytes.length();
			error.remaining = remaining;
			error.requested = n;
			throw error;
		}
	}
	/**
	* Gets the length of a BER-encoded ASN.1 value.
	*
	* In case the length is not specified, undefined is returned.
	*
	* @param bytes the byte buffer to parse from.
	* @param remaining the bytes remaining in the current parsing state.
	*
	* @return the length of the BER-encoded ASN.1 value or undefined.
	*/
	var _getValueLength = function(bytes, remaining) {
		var b2 = bytes.getByte();
		remaining--;
		if (b2 === 128) return;
		var length;
		if (!(b2 & 128)) length = b2;
		else {
			var longFormBytes = b2 & 127;
			_checkBufferLength(bytes, remaining, longFormBytes);
			length = bytes.getInt(longFormBytes << 3);
		}
		if (length < 0) throw new Error("Negative length: " + length);
		return length;
	};
	/**
	* Parses an asn1 object from a byte buffer in DER format.
	*
	* @param bytes the byte buffer to parse from.
	* @param [strict] true to be strict when checking value lengths, false to
	*          allow truncated values (default: true).
	* @param [options] object with options or boolean strict flag
	*          [strict] true to be strict when checking value lengths, false to
	*            allow truncated values (default: true).
	*          [parseAllBytes] true to ensure all bytes are parsed
	*            (default: true)
	*          [decodeBitStrings] true to attempt to decode the content of
	*            BIT STRINGs (not OCTET STRINGs) using strict mode. Note that
	*            without schema support to understand the data context this can
	*            erroneously decode values that happen to be valid ASN.1. This
	*            flag will be deprecated or removed as soon as schema support is
	*            available. (default: true)
	*          [maxDepth] override asn1.maxDepth recursion limit
	*            (default: asn1.maxDepth)
	*
	* @throws Will throw an error for various malformed input conditions.
	*
	* @return the parsed asn1 object.
	*/
	asn1.fromDer = function(bytes, options) {
		if (options === void 0) options = {
			strict: true,
			parseAllBytes: true,
			decodeBitStrings: true
		};
		if (typeof options === "boolean") options = {
			strict: options,
			parseAllBytes: true,
			decodeBitStrings: true
		};
		if (!("strict" in options)) options.strict = true;
		if (!("parseAllBytes" in options)) options.parseAllBytes = true;
		if (!("decodeBitStrings" in options)) options.decodeBitStrings = true;
		if (!("maxDepth" in options)) options.maxDepth = asn1.maxDepth;
		if (typeof bytes === "string") bytes = forge.util.createBuffer(bytes);
		var byteCount = bytes.length();
		var value = _fromDer(bytes, bytes.length(), 0, options);
		if (options.parseAllBytes && bytes.length() !== 0) {
			var error = /* @__PURE__ */ new Error("Unparsed DER bytes remain after ASN.1 parsing.");
			error.byteCount = byteCount;
			error.remaining = bytes.length();
			throw error;
		}
		return value;
	};
	/**
	* Internal function to parse an asn1 object from a byte buffer in DER format.
	*
	* @param bytes the byte buffer to parse from.
	* @param remaining the number of bytes remaining for this chunk.
	* @param depth the current parsing depth.
	* @param options object with same options as fromDer().
	*
	* @return the parsed asn1 object.
	*/
	function _fromDer(bytes, remaining, depth, options) {
		if (depth >= options.maxDepth) throw new Error("ASN.1 parsing error: Max depth exceeded.");
		var start;
		_checkBufferLength(bytes, remaining, 2);
		var b1 = bytes.getByte();
		remaining--;
		var tagClass = b1 & 192;
		var type = b1 & 31;
		start = bytes.length();
		var length = _getValueLength(bytes, remaining);
		remaining -= start - bytes.length();
		if (length !== void 0 && length > remaining) {
			if (options.strict) {
				var error = /* @__PURE__ */ new Error("Too few bytes to read ASN.1 value.");
				error.available = bytes.length();
				error.remaining = remaining;
				error.requested = length;
				throw error;
			}
			length = remaining;
		}
		var value;
		var bitStringContents;
		var constructed = (b1 & 32) === 32;
		if (constructed) {
			value = [];
			if (length === void 0) for (;;) {
				_checkBufferLength(bytes, remaining, 2);
				if (bytes.bytes(2) === String.fromCharCode(0, 0)) {
					bytes.getBytes(2);
					remaining -= 2;
					break;
				}
				start = bytes.length();
				value.push(_fromDer(bytes, remaining, depth + 1, options));
				remaining -= start - bytes.length();
			}
			else while (length > 0) {
				start = bytes.length();
				value.push(_fromDer(bytes, length, depth + 1, options));
				remaining -= start - bytes.length();
				length -= start - bytes.length();
			}
		}
		if (value === void 0 && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING) bitStringContents = bytes.bytes(length);
		if (value === void 0 && options.decodeBitStrings && tagClass === asn1.Class.UNIVERSAL && type === asn1.Type.BITSTRING && length > 1) {
			var savedRead = bytes.read;
			var savedRemaining = remaining;
			var unused = 0;
			if (type === asn1.Type.BITSTRING) {
				_checkBufferLength(bytes, remaining, 1);
				unused = bytes.getByte();
				remaining--;
			}
			if (unused === 0) try {
				start = bytes.length();
				var composed = _fromDer(bytes, remaining, depth + 1, {
					strict: true,
					decodeBitStrings: true
				});
				var used = start - bytes.length();
				remaining -= used;
				if (type == asn1.Type.BITSTRING) used++;
				var tc = composed.tagClass;
				if (used === length && (tc === asn1.Class.UNIVERSAL || tc === asn1.Class.CONTEXT_SPECIFIC)) value = [composed];
			} catch (ex) {}
			if (value === void 0) {
				bytes.read = savedRead;
				remaining = savedRemaining;
			}
		}
		if (value === void 0) {
			if (length === void 0) {
				if (options.strict) throw new Error("Non-constructed ASN.1 object of indefinite length.");
				length = remaining;
			}
			if (type === asn1.Type.BMPSTRING) {
				value = "";
				for (; length > 0; length -= 2) {
					_checkBufferLength(bytes, remaining, 2);
					value += String.fromCharCode(bytes.getInt16());
					remaining -= 2;
				}
			} else {
				value = bytes.getBytes(length);
				remaining -= length;
			}
		}
		var asn1Options = bitStringContents === void 0 ? null : { bitStringContents };
		return asn1.create(tagClass, type, constructed, value, asn1Options);
	}
	/**
	* Converts the given asn1 object to a buffer of bytes in DER format.
	*
	* @param asn1 the asn1 object to convert to bytes.
	*
	* @return the buffer of bytes.
	*/
	asn1.toDer = function(obj) {
		var bytes = forge.util.createBuffer();
		var b1 = obj.tagClass | obj.type;
		var value = forge.util.createBuffer();
		var useBitStringContents = false;
		if ("bitStringContents" in obj) {
			useBitStringContents = true;
			if (obj.original) useBitStringContents = asn1.equals(obj, obj.original);
		}
		if (useBitStringContents) value.putBytes(obj.bitStringContents);
		else if (obj.composed) {
			if (obj.constructed) b1 |= 32;
			else value.putByte(0);
			for (var i = 0; i < obj.value.length; ++i) if (obj.value[i] !== void 0) value.putBuffer(asn1.toDer(obj.value[i]));
		} else if (obj.type === asn1.Type.BMPSTRING) for (var i = 0; i < obj.value.length; ++i) value.putInt16(obj.value.charCodeAt(i));
		else if (obj.type === asn1.Type.INTEGER && obj.value.length > 1 && (obj.value.charCodeAt(0) === 0 && (obj.value.charCodeAt(1) & 128) === 0 || obj.value.charCodeAt(0) === 255 && (obj.value.charCodeAt(1) & 128) === 128)) value.putBytes(obj.value.substr(1));
		else value.putBytes(obj.value);
		bytes.putByte(b1);
		if (value.length() <= 127) bytes.putByte(value.length() & 127);
		else {
			var len = value.length();
			var lenBytes = "";
			do {
				lenBytes += String.fromCharCode(len & 255);
				len = len >>> 8;
			} while (len > 0);
			bytes.putByte(lenBytes.length | 128);
			for (var i = lenBytes.length - 1; i >= 0; --i) bytes.putByte(lenBytes.charCodeAt(i));
		}
		bytes.putBuffer(value);
		return bytes;
	};
	/**
	* Converts an OID dot-separated string to a byte buffer. The byte buffer
	* contains only the DER-encoded value, not any tag or length bytes.
	*
	* @param oid the OID dot-separated string.
	*
	* @return the byte buffer.
	*/
	asn1.oidToDer = function(oid) {
		var values = oid.split(".");
		var bytes = forge.util.createBuffer();
		bytes.putByte(40 * parseInt(values[0], 10) + parseInt(values[1], 10));
		var last, valueBytes, value, b;
		for (var i = 2; i < values.length; ++i) {
			last = true;
			valueBytes = [];
			value = parseInt(values[i], 10);
			if (value > 4294967295) throw new Error("OID value too large; max is 32-bits.");
			do {
				b = value & 127;
				value = value >>> 7;
				if (!last) b |= 128;
				valueBytes.push(b);
				last = false;
			} while (value > 0);
			for (var n = valueBytes.length - 1; n >= 0; --n) bytes.putByte(valueBytes[n]);
		}
		return bytes;
	};
	/**
	* Converts a DER-encoded byte buffer to an OID dot-separated string. The
	* byte buffer should contain only the DER-encoded value, not any tag or
	* length bytes.
	*
	* @param bytes the byte buffer.
	*
	* @return the OID dot-separated string.
	*/
	asn1.derToOid = function(bytes) {
		var oid;
		if (typeof bytes === "string") bytes = forge.util.createBuffer(bytes);
		var b = bytes.getByte();
		oid = Math.floor(b / 40) + "." + b % 40;
		var value = 0;
		while (bytes.length() > 0) {
			if (value > 70368744177663) throw new Error("OID value too large; max is 53-bits.");
			b = bytes.getByte();
			value = value * 128;
			if (b & 128) value += b & 127;
			else {
				oid += "." + (value + b);
				value = 0;
			}
		}
		return oid;
	};
	/**
	* Converts a UTCTime value to a date.
	*
	* Note: GeneralizedTime has 4 digits for the year and is used for X.509
	* dates past 2049. Parsing that structure hasn't been implemented yet.
	*
	* @param utc the UTCTime value to convert.
	*
	* @return the date.
	*/
	asn1.utcTimeToDate = function(utc) {
		var date = /* @__PURE__ */ new Date();
		var year = parseInt(utc.substr(0, 2), 10);
		year = year >= 50 ? 1900 + year : 2e3 + year;
		var MM = parseInt(utc.substr(2, 2), 10) - 1;
		var DD = parseInt(utc.substr(4, 2), 10);
		var hh = parseInt(utc.substr(6, 2), 10);
		var mm = parseInt(utc.substr(8, 2), 10);
		var ss = 0;
		if (utc.length > 11) {
			var c = utc.charAt(10);
			var end = 10;
			if (c !== "+" && c !== "-") {
				ss = parseInt(utc.substr(10, 2), 10);
				end += 2;
			}
		}
		date.setUTCFullYear(year, MM, DD);
		date.setUTCHours(hh, mm, ss, 0);
		if (end) {
			c = utc.charAt(end);
			if (c === "+" || c === "-") {
				var hhoffset = parseInt(utc.substr(end + 1, 2), 10);
				var mmoffset = parseInt(utc.substr(end + 4, 2), 10);
				var offset = hhoffset * 60 + mmoffset;
				offset *= 6e4;
				if (c === "+") date.setTime(+date - offset);
				else date.setTime(+date + offset);
			}
		}
		return date;
	};
	/**
	* Converts a GeneralizedTime value to a date.
	*
	* @param gentime the GeneralizedTime value to convert.
	*
	* @return the date.
	*/
	asn1.generalizedTimeToDate = function(gentime) {
		var date = /* @__PURE__ */ new Date();
		var YYYY = parseInt(gentime.substr(0, 4), 10);
		var MM = parseInt(gentime.substr(4, 2), 10) - 1;
		var DD = parseInt(gentime.substr(6, 2), 10);
		var hh = parseInt(gentime.substr(8, 2), 10);
		var mm = parseInt(gentime.substr(10, 2), 10);
		var ss = parseInt(gentime.substr(12, 2), 10);
		var fff = 0;
		var offset = 0;
		var isUTC = false;
		if (gentime.charAt(gentime.length - 1) === "Z") isUTC = true;
		var end = gentime.length - 5, c = gentime.charAt(end);
		if (c === "+" || c === "-") {
			var hhoffset = parseInt(gentime.substr(end + 1, 2), 10);
			var mmoffset = parseInt(gentime.substr(end + 4, 2), 10);
			offset = hhoffset * 60 + mmoffset;
			offset *= 6e4;
			if (c === "+") offset *= -1;
			isUTC = true;
		}
		if (gentime.charAt(14) === ".") fff = parseFloat(gentime.substr(14), 10) * 1e3;
		if (isUTC) {
			date.setUTCFullYear(YYYY, MM, DD);
			date.setUTCHours(hh, mm, ss, fff);
			date.setTime(+date + offset);
		} else {
			date.setFullYear(YYYY, MM, DD);
			date.setHours(hh, mm, ss, fff);
		}
		return date;
	};
	/**
	* Converts a date to a UTCTime value.
	*
	* Note: GeneralizedTime has 4 digits for the year and is used for X.509
	* dates past 2049. Converting to a GeneralizedTime hasn't been
	* implemented yet.
	*
	* @param date the date to convert.
	*
	* @return the UTCTime value.
	*/
	asn1.dateToUtcTime = function(date) {
		if (typeof date === "string") return date;
		var rval = "";
		var format = [];
		format.push(("" + date.getUTCFullYear()).substr(2));
		format.push("" + (date.getUTCMonth() + 1));
		format.push("" + date.getUTCDate());
		format.push("" + date.getUTCHours());
		format.push("" + date.getUTCMinutes());
		format.push("" + date.getUTCSeconds());
		for (var i = 0; i < format.length; ++i) {
			if (format[i].length < 2) rval += "0";
			rval += format[i];
		}
		rval += "Z";
		return rval;
	};
	/**
	* Converts a date to a GeneralizedTime value.
	*
	* @param date the date to convert.
	*
	* @return the GeneralizedTime value as a string.
	*/
	asn1.dateToGeneralizedTime = function(date) {
		if (typeof date === "string") return date;
		var rval = "";
		var format = [];
		format.push("" + date.getUTCFullYear());
		format.push("" + (date.getUTCMonth() + 1));
		format.push("" + date.getUTCDate());
		format.push("" + date.getUTCHours());
		format.push("" + date.getUTCMinutes());
		format.push("" + date.getUTCSeconds());
		for (var i = 0; i < format.length; ++i) {
			if (format[i].length < 2) rval += "0";
			rval += format[i];
		}
		rval += "Z";
		return rval;
	};
	/**
	* Converts a javascript integer to a DER-encoded byte buffer to be used
	* as the value for an INTEGER type.
	*
	* @param x the integer.
	*
	* @return the byte buffer.
	*/
	asn1.integerToDer = function(x) {
		var rval = forge.util.createBuffer();
		if (x >= -128 && x < 128) return rval.putSignedInt(x, 8);
		if (x >= -32768 && x < 32768) return rval.putSignedInt(x, 16);
		if (x >= -8388608 && x < 8388608) return rval.putSignedInt(x, 24);
		if (x >= -2147483648 && x < 2147483648) return rval.putSignedInt(x, 32);
		var error = /* @__PURE__ */ new Error("Integer too large; max is 32-bits.");
		error.integer = x;
		throw error;
	};
	/**
	* Converts a DER-encoded byte buffer to a javascript integer. This is
	* typically used to decode the value of an INTEGER type.
	*
	* @param bytes the byte buffer.
	*
	* @return the integer.
	*/
	asn1.derToInteger = function(bytes) {
		if (typeof bytes === "string") bytes = forge.util.createBuffer(bytes);
		var n = bytes.length() * 8;
		if (n > 32) throw new Error("Integer too large; max is 32-bits.");
		return bytes.getSignedInt(n);
	};
	/**
	* Validates that the given ASN.1 object is at least a super set of the
	* given ASN.1 structure. Only tag classes and types are checked. An
	* optional map may also be provided to capture ASN.1 values while the
	* structure is checked.
	*
	* To capture an ASN.1 value, set an object in the validator's 'capture'
	* parameter to the key to use in the capture map. To capture the full
	* ASN.1 object, specify 'captureAsn1'. To capture BIT STRING bytes, including
	* the leading unused bits counter byte, specify 'captureBitStringContents'.
	* To capture BIT STRING bytes, without the leading unused bits counter byte,
	* specify 'captureBitStringValue'.
	*
	* Objects in the validator may set a field 'optional' to true to indicate
	* that it isn't necessary to pass validation.
	*
	* @param obj the ASN.1 object to validate.
	* @param v the ASN.1 structure validator.
	* @param capture an optional map to capture values in.
	* @param errors an optional array for storing validation errors.
	*
	* @return true on success, false on failure.
	*/
	asn1.validate = function(obj, v, capture, errors) {
		var rval = false;
		if ((obj.tagClass === v.tagClass || typeof v.tagClass === "undefined") && (obj.type === v.type || typeof v.type === "undefined")) {
			if (obj.constructed === v.constructed || typeof v.constructed === "undefined") {
				rval = true;
				if (v.value && forge.util.isArray(v.value)) {
					var j = 0;
					for (var i = 0; rval && i < v.value.length; ++i) {
						var schemaItem = v.value[i];
						rval = !!schemaItem.optional;
						var objChild = obj.value[j];
						if (!objChild) {
							if (!schemaItem.optional) {
								rval = false;
								if (errors) errors.push("[" + v.name + "] Missing required element. Expected tag class \"" + schemaItem.tagClass + "\", type \"" + schemaItem.type + "\"");
							}
							continue;
						}
						if (typeof schemaItem.tagClass !== "undefined" && typeof schemaItem.type !== "undefined" && (objChild.tagClass !== schemaItem.tagClass || objChild.type !== schemaItem.type)) if (schemaItem.optional) {
							rval = true;
							continue;
						} else {
							rval = false;
							if (errors) errors.push("[" + v.name + "] Tag mismatch. Expected (" + schemaItem.tagClass + "," + schemaItem.type + "), got (" + objChild.tagClass + "," + objChild.type + ")");
							break;
						}
						if (asn1.validate(objChild, schemaItem, capture, errors)) {
							++j;
							rval = true;
						} else if (schemaItem.optional) rval = true;
						else {
							rval = false;
							break;
						}
					}
				}
				if (rval && capture) {
					if (v.capture) capture[v.capture] = obj.value;
					if (v.captureAsn1) capture[v.captureAsn1] = obj;
					if (v.captureBitStringContents && "bitStringContents" in obj) capture[v.captureBitStringContents] = obj.bitStringContents;
					if (v.captureBitStringValue && "bitStringContents" in obj) if (obj.bitStringContents.length < 2) capture[v.captureBitStringValue] = "";
					else {
						if (obj.bitStringContents.charCodeAt(0) !== 0) throw new Error("captureBitStringValue only supported for zero unused bits");
						capture[v.captureBitStringValue] = obj.bitStringContents.slice(1);
					}
				}
			} else if (errors) errors.push("[" + v.name + "] Expected constructed \"" + v.constructed + "\", got \"" + obj.constructed + "\"");
		} else if (errors) {
			if (obj.tagClass !== v.tagClass) errors.push("[" + v.name + "] Expected tag class \"" + v.tagClass + "\", got \"" + obj.tagClass + "\"");
			if (obj.type !== v.type) errors.push("[" + v.name + "] Expected type \"" + v.type + "\", got \"" + obj.type + "\"");
		}
		return rval;
	};
	var _nonLatinRegex = /[^\\u0000-\\u00ff]/;
	/**
	* Pretty prints an ASN.1 object to a string.
	*
	* @param obj the object to write out.
	* @param level the level in the tree.
	* @param indentation the indentation to use.
	*
	* @return the string.
	*/
	asn1.prettyPrint = function(obj, level, indentation) {
		var rval = "";
		level = level || 0;
		indentation = indentation || 2;
		if (level > 0) rval += "\n";
		var indent = "";
		for (var i = 0; i < level * indentation; ++i) indent += " ";
		rval += indent + "Tag: ";
		switch (obj.tagClass) {
			case asn1.Class.UNIVERSAL:
				rval += "Universal:";
				break;
			case asn1.Class.APPLICATION:
				rval += "Application:";
				break;
			case asn1.Class.CONTEXT_SPECIFIC:
				rval += "Context-Specific:";
				break;
			case asn1.Class.PRIVATE:
				rval += "Private:";
				break;
		}
		if (obj.tagClass === asn1.Class.UNIVERSAL) {
			rval += obj.type;
			switch (obj.type) {
				case asn1.Type.NONE:
					rval += " (None)";
					break;
				case asn1.Type.BOOLEAN:
					rval += " (Boolean)";
					break;
				case asn1.Type.INTEGER:
					rval += " (Integer)";
					break;
				case asn1.Type.BITSTRING:
					rval += " (Bit string)";
					break;
				case asn1.Type.OCTETSTRING:
					rval += " (Octet string)";
					break;
				case asn1.Type.NULL:
					rval += " (Null)";
					break;
				case asn1.Type.OID:
					rval += " (Object Identifier)";
					break;
				case asn1.Type.ODESC:
					rval += " (Object Descriptor)";
					break;
				case asn1.Type.EXTERNAL:
					rval += " (External or Instance of)";
					break;
				case asn1.Type.REAL:
					rval += " (Real)";
					break;
				case asn1.Type.ENUMERATED:
					rval += " (Enumerated)";
					break;
				case asn1.Type.EMBEDDED:
					rval += " (Embedded PDV)";
					break;
				case asn1.Type.UTF8:
					rval += " (UTF8)";
					break;
				case asn1.Type.ROID:
					rval += " (Relative Object Identifier)";
					break;
				case asn1.Type.SEQUENCE:
					rval += " (Sequence)";
					break;
				case asn1.Type.SET:
					rval += " (Set)";
					break;
				case asn1.Type.PRINTABLESTRING:
					rval += " (Printable String)";
					break;
				case asn1.Type.IA5String:
					rval += " (IA5String (ASCII))";
					break;
				case asn1.Type.UTCTIME:
					rval += " (UTC time)";
					break;
				case asn1.Type.GENERALIZEDTIME:
					rval += " (Generalized time)";
					break;
				case asn1.Type.BMPSTRING:
					rval += " (BMP String)";
					break;
			}
		} else rval += obj.type;
		rval += "\n";
		rval += indent + "Constructed: " + obj.constructed + "\n";
		if (obj.composed) {
			var subvalues = 0;
			var sub = "";
			for (var i = 0; i < obj.value.length; ++i) if (obj.value[i] !== void 0) {
				subvalues += 1;
				sub += asn1.prettyPrint(obj.value[i], level + 1, indentation);
				if (i + 1 < obj.value.length) sub += ",";
			}
			rval += indent + "Sub values: " + subvalues + sub;
		} else {
			rval += indent + "Value: ";
			if (obj.type === asn1.Type.OID) {
				var oid = asn1.derToOid(obj.value);
				rval += oid;
				if (forge.pki && forge.pki.oids) {
					if (oid in forge.pki.oids) rval += " (" + forge.pki.oids[oid] + ") ";
				}
			}
			if (obj.type === asn1.Type.INTEGER) try {
				rval += asn1.derToInteger(obj.value);
			} catch (ex) {
				rval += "0x" + forge.util.bytesToHex(obj.value);
			}
			else if (obj.type === asn1.Type.BITSTRING) {
				if (obj.value.length > 1) rval += "0x" + forge.util.bytesToHex(obj.value.slice(1));
				else rval += "(none)";
				if (obj.value.length > 0) {
					var unused = obj.value.charCodeAt(0);
					if (unused == 1) rval += " (1 unused bit shown)";
					else if (unused > 1) rval += " (" + unused + " unused bits shown)";
				}
			} else if (obj.type === asn1.Type.OCTETSTRING) {
				if (!_nonLatinRegex.test(obj.value)) rval += "(" + obj.value + ") ";
				rval += "0x" + forge.util.bytesToHex(obj.value);
			} else if (obj.type === asn1.Type.UTF8) try {
				rval += forge.util.decodeUtf8(obj.value);
			} catch (e) {
				if (e.message === "URI malformed") rval += "0x" + forge.util.bytesToHex(obj.value) + " (malformed UTF8)";
				else throw e;
			}
			else if (obj.type === asn1.Type.PRINTABLESTRING || obj.type === asn1.Type.IA5String) rval += obj.value;
			else if (_nonLatinRegex.test(obj.value)) rval += "0x" + forge.util.bytesToHex(obj.value);
			else if (obj.value.length === 0) rval += "[null]";
			else rval += obj.value;
		}
		return rval;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/md.js
var require_md = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Node.js module for Forge message digests.
	*
	* @author Dave Longley
	*
	* Copyright 2011-2017 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	module.exports = forge.md = forge.md || {};
	forge.md.algorithms = forge.md.algorithms || {};
}));
//#endregion
//#region node_modules/node-forge/lib/hmac.js
var require_hmac = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Hash-based Message Authentication Code implementation. Requires a message
	* digest object that can be obtained, for example, from forge.md.sha1 or
	* forge.md.md5.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2012 Digital Bazaar, Inc. All rights reserved.
	*/
	var forge = require_forge();
	require_md();
	require_util();
	var hmac = module.exports = forge.hmac = forge.hmac || {};
	/**
	* Creates an HMAC object that uses the given message digest object.
	*
	* @return an HMAC object.
	*/
	hmac.create = function() {
		var _key = null;
		var _md = null;
		var _ipadding = null;
		var _opadding = null;
		var ctx = {};
		/**
		* Starts or restarts the HMAC with the given key and message digest.
		*
		* @param md the message digest to use, null to reuse the previous one,
		*           a string to use builtin 'sha1', 'md5', 'sha256'.
		* @param key the key to use as a string, array of bytes, byte buffer,
		*           or null to reuse the previous key.
		*/
		ctx.start = function(md, key) {
			if (md !== null) if (typeof md === "string") {
				md = md.toLowerCase();
				if (md in forge.md.algorithms) _md = forge.md.algorithms[md].create();
				else throw new Error("Unknown hash algorithm \"" + md + "\"");
			} else _md = md;
			if (key === null) key = _key;
			else {
				if (typeof key === "string") key = forge.util.createBuffer(key);
				else if (forge.util.isArray(key)) {
					var tmp = key;
					key = forge.util.createBuffer();
					for (var i = 0; i < tmp.length; ++i) key.putByte(tmp[i]);
				}
				var keylen = key.length();
				if (keylen > _md.blockLength) {
					_md.start();
					_md.update(key.bytes());
					key = _md.digest();
				}
				_ipadding = forge.util.createBuffer();
				_opadding = forge.util.createBuffer();
				keylen = key.length();
				for (var i = 0; i < keylen; ++i) {
					var tmp = key.at(i);
					_ipadding.putByte(54 ^ tmp);
					_opadding.putByte(92 ^ tmp);
				}
				if (keylen < _md.blockLength) {
					var tmp = _md.blockLength - keylen;
					for (var i = 0; i < tmp; ++i) {
						_ipadding.putByte(54);
						_opadding.putByte(92);
					}
				}
				_key = key;
				_ipadding = _ipadding.bytes();
				_opadding = _opadding.bytes();
			}
			_md.start();
			_md.update(_ipadding);
		};
		/**
		* Updates the HMAC with the given message bytes.
		*
		* @param bytes the bytes to update with.
		*/
		ctx.update = function(bytes) {
			_md.update(bytes);
		};
		/**
		* Produces the Message Authentication Code (MAC).
		*
		* @return a byte buffer containing the digest value.
		*/
		ctx.getMac = function() {
			var inner = _md.digest().bytes();
			_md.start();
			_md.update(_opadding);
			_md.update(inner);
			return _md.digest();
		};
		ctx.digest = ctx.getMac;
		return ctx;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/md5.js
var require_md5 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Message Digest Algorithm 5 with 128-bit digest (MD5) implementation.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_md();
	require_util();
	var md5 = module.exports = forge.md5 = forge.md5 || {};
	forge.md.md5 = forge.md.algorithms.md5 = md5;
	/**
	* Creates an MD5 message digest object.
	*
	* @return a message digest object.
	*/
	md5.create = function() {
		if (!_initialized) _init();
		var _state = null;
		var _input = forge.util.createBuffer();
		var _w = new Array(16);
		var md = {
			algorithm: "md5",
			blockLength: 64,
			digestLength: 16,
			messageLength: 0,
			fullMessageLength: null,
			messageLengthSize: 8
		};
		/**
		* Starts the digest.
		*
		* @return this digest object.
		*/
		md.start = function() {
			md.messageLength = 0;
			md.fullMessageLength = md.messageLength64 = [];
			var int32s = md.messageLengthSize / 4;
			for (var i = 0; i < int32s; ++i) md.fullMessageLength.push(0);
			_input = forge.util.createBuffer();
			_state = {
				h0: 1732584193,
				h1: 4023233417,
				h2: 2562383102,
				h3: 271733878
			};
			return md;
		};
		md.start();
		/**
		* Updates the digest with the given message input. The given input can
		* treated as raw input (no encoding will be applied) or an encoding of
		* 'utf8' maybe given to encode the input using UTF-8.
		*
		* @param msg the message input to update with.
		* @param encoding the encoding to use (default: 'raw', other: 'utf8').
		*
		* @return this digest object.
		*/
		md.update = function(msg, encoding) {
			if (encoding === "utf8") msg = forge.util.encodeUtf8(msg);
			var len = msg.length;
			md.messageLength += len;
			len = [len / 4294967296 >>> 0, len >>> 0];
			for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
				md.fullMessageLength[i] += len[1];
				len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
				md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
				len[0] = len[1] / 4294967296 >>> 0;
			}
			_input.putBytes(msg);
			_update(_state, _w, _input);
			if (_input.read > 2048 || _input.length() === 0) _input.compact();
			return md;
		};
		/**
		* Produces the digest.
		*
		* @return a byte buffer containing the digest value.
		*/
		md.digest = function() {
			var finalBlock = forge.util.createBuffer();
			finalBlock.putBytes(_input.bytes());
			var overflow = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize & md.blockLength - 1;
			finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
			var bits, carry = 0;
			for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
				bits = md.fullMessageLength[i] * 8 + carry;
				carry = bits / 4294967296 >>> 0;
				finalBlock.putInt32Le(bits >>> 0);
			}
			var s2 = {
				h0: _state.h0,
				h1: _state.h1,
				h2: _state.h2,
				h3: _state.h3
			};
			_update(s2, _w, finalBlock);
			var rval = forge.util.createBuffer();
			rval.putInt32Le(s2.h0);
			rval.putInt32Le(s2.h1);
			rval.putInt32Le(s2.h2);
			rval.putInt32Le(s2.h3);
			return rval;
		};
		return md;
	};
	var _padding = null;
	var _g = null;
	var _r = null;
	var _k = null;
	var _initialized = false;
	/**
	* Initializes the constant tables.
	*/
	function _init() {
		_padding = String.fromCharCode(128);
		_padding += forge.util.fillString(String.fromCharCode(0), 64);
		_g = [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			1,
			6,
			11,
			0,
			5,
			10,
			15,
			4,
			9,
			14,
			3,
			8,
			13,
			2,
			7,
			12,
			5,
			8,
			11,
			14,
			1,
			4,
			7,
			10,
			13,
			0,
			3,
			6,
			9,
			12,
			15,
			2,
			0,
			7,
			14,
			5,
			12,
			3,
			10,
			1,
			8,
			15,
			6,
			13,
			4,
			11,
			2,
			9
		];
		_r = [
			7,
			12,
			17,
			22,
			7,
			12,
			17,
			22,
			7,
			12,
			17,
			22,
			7,
			12,
			17,
			22,
			5,
			9,
			14,
			20,
			5,
			9,
			14,
			20,
			5,
			9,
			14,
			20,
			5,
			9,
			14,
			20,
			4,
			11,
			16,
			23,
			4,
			11,
			16,
			23,
			4,
			11,
			16,
			23,
			4,
			11,
			16,
			23,
			6,
			10,
			15,
			21,
			6,
			10,
			15,
			21,
			6,
			10,
			15,
			21,
			6,
			10,
			15,
			21
		];
		_k = new Array(64);
		for (var i = 0; i < 64; ++i) _k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296);
		_initialized = true;
	}
	/**
	* Updates an MD5 state with the given byte buffer.
	*
	* @param s the MD5 state to update.
	* @param w the array to use to store words.
	* @param bytes the byte buffer to update with.
	*/
	function _update(s, w, bytes) {
		var t, a, b, c, d, f, r, i;
		var len = bytes.length();
		while (len >= 64) {
			a = s.h0;
			b = s.h1;
			c = s.h2;
			d = s.h3;
			for (i = 0; i < 16; ++i) {
				w[i] = bytes.getInt32Le();
				f = d ^ b & (c ^ d);
				t = a + f + _k[i] + w[i];
				r = _r[i];
				a = d;
				d = c;
				c = b;
				b += t << r | t >>> 32 - r;
			}
			for (; i < 32; ++i) {
				f = c ^ d & (b ^ c);
				t = a + f + _k[i] + w[_g[i]];
				r = _r[i];
				a = d;
				d = c;
				c = b;
				b += t << r | t >>> 32 - r;
			}
			for (; i < 48; ++i) {
				f = b ^ c ^ d;
				t = a + f + _k[i] + w[_g[i]];
				r = _r[i];
				a = d;
				d = c;
				c = b;
				b += t << r | t >>> 32 - r;
			}
			for (; i < 64; ++i) {
				f = c ^ (b | ~d);
				t = a + f + _k[i] + w[_g[i]];
				r = _r[i];
				a = d;
				d = c;
				c = b;
				b += t << r | t >>> 32 - r;
			}
			s.h0 = s.h0 + a | 0;
			s.h1 = s.h1 + b | 0;
			s.h2 = s.h2 + c | 0;
			s.h3 = s.h3 + d | 0;
			len -= 64;
		}
	}
}));
//#endregion
//#region node_modules/node-forge/lib/pem.js
var require_pem = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of basic PEM (Privacy Enhanced Mail) algorithms.
	*
	* See: RFC 1421.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2013-2014 Digital Bazaar, Inc.
	*
	* A Forge PEM object has the following fields:
	*
	* type: identifies the type of message (eg: "RSA PRIVATE KEY").
	*
	* procType: identifies the type of processing performed on the message,
	*   it has two subfields: version and type, eg: 4,ENCRYPTED.
	*
	* contentDomain: identifies the type of content in the message, typically
	*   only uses the value: "RFC822".
	*
	* dekInfo: identifies the message encryption algorithm and mode and includes
	*   any parameters for the algorithm, it has two subfields: algorithm and
	*   parameters, eg: DES-CBC,F8143EDE5960C597.
	*
	* headers: contains all other PEM encapsulated headers -- where order is
	*   significant (for pairing data like recipient ID + key info).
	*
	* body: the binary-encoded body.
	*/
	var forge = require_forge();
	require_util();
	var pem = module.exports = forge.pem = forge.pem || {};
	/**
	* Encodes (serializes) the given PEM object.
	*
	* @param msg the PEM message object to encode.
	* @param options the options to use:
	*          maxline the maximum characters per line for the body, (default: 64).
	*
	* @return the PEM-formatted string.
	*/
	pem.encode = function(msg, options) {
		options = options || {};
		var rval = "-----BEGIN " + msg.type + "-----\r\n";
		var header;
		if (msg.procType) {
			header = {
				name: "Proc-Type",
				values: [String(msg.procType.version), msg.procType.type]
			};
			rval += foldHeader(header);
		}
		if (msg.contentDomain) {
			header = {
				name: "Content-Domain",
				values: [msg.contentDomain]
			};
			rval += foldHeader(header);
		}
		if (msg.dekInfo) {
			header = {
				name: "DEK-Info",
				values: [msg.dekInfo.algorithm]
			};
			if (msg.dekInfo.parameters) header.values.push(msg.dekInfo.parameters);
			rval += foldHeader(header);
		}
		if (msg.headers) for (var i = 0; i < msg.headers.length; ++i) rval += foldHeader(msg.headers[i]);
		if (msg.procType) rval += "\r\n";
		rval += forge.util.encode64(msg.body, options.maxline || 64) + "\r\n";
		rval += "-----END " + msg.type + "-----\r\n";
		return rval;
	};
	/**
	* Decodes (deserializes) all PEM messages found in the given string.
	*
	* @param str the PEM-formatted string to decode.
	*
	* @return the PEM message objects in an array.
	*/
	pem.decode = function(str) {
		var rval = [];
		var rMessage = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g;
		var rHeader = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/;
		var rCRLF = /\r?\n/;
		var match;
		while (true) {
			match = rMessage.exec(str);
			if (!match) break;
			var type = match[1];
			if (type === "NEW CERTIFICATE REQUEST") type = "CERTIFICATE REQUEST";
			var msg = {
				type,
				procType: null,
				contentDomain: null,
				dekInfo: null,
				headers: [],
				body: forge.util.decode64(match[3])
			};
			rval.push(msg);
			if (!match[2]) continue;
			var lines = match[2].split(rCRLF);
			var li = 0;
			while (match && li < lines.length) {
				var line = lines[li].replace(/\s+$/, "");
				for (var nl = li + 1; nl < lines.length; ++nl) {
					var next = lines[nl];
					if (!/\s/.test(next[0])) break;
					line += next;
					li = nl;
				}
				match = line.match(rHeader);
				if (match) {
					var header = {
						name: match[1],
						values: []
					};
					var values = match[2].split(",");
					for (var vi = 0; vi < values.length; ++vi) header.values.push(ltrim(values[vi]));
					if (!msg.procType) {
						if (header.name !== "Proc-Type") throw new Error("Invalid PEM formatted message. The first encapsulated header must be \"Proc-Type\".");
						else if (header.values.length !== 2) throw new Error("Invalid PEM formatted message. The \"Proc-Type\" header must have two subfields.");
						msg.procType = {
							version: values[0],
							type: values[1]
						};
					} else if (!msg.contentDomain && header.name === "Content-Domain") msg.contentDomain = values[0] || "";
					else if (!msg.dekInfo && header.name === "DEK-Info") {
						if (header.values.length === 0) throw new Error("Invalid PEM formatted message. The \"DEK-Info\" header must have at least one subfield.");
						msg.dekInfo = {
							algorithm: values[0],
							parameters: values[1] || null
						};
					} else msg.headers.push(header);
				}
				++li;
			}
			if (msg.procType === "ENCRYPTED" && !msg.dekInfo) throw new Error("Invalid PEM formatted message. The \"DEK-Info\" header must be present if \"Proc-Type\" is \"ENCRYPTED\".");
		}
		if (rval.length === 0) throw new Error("Invalid PEM formatted message.");
		return rval;
	};
	function foldHeader(header) {
		var rval = header.name + ": ";
		var values = [];
		var insertSpace = function(match, $1) {
			return " " + $1;
		};
		for (var i = 0; i < header.values.length; ++i) values.push(header.values[i].replace(/^(\S+\r\n)/, insertSpace));
		rval += values.join(",") + "\r\n";
		var length = 0;
		var candidate = -1;
		for (var i = 0; i < rval.length; ++i, ++length) if (length > 65 && candidate !== -1) {
			var insert = rval[candidate];
			if (insert === ",") {
				++candidate;
				rval = rval.substr(0, candidate) + "\r\n " + rval.substr(candidate);
			} else rval = rval.substr(0, candidate) + "\r\n" + insert + rval.substr(candidate + 1);
			length = i - candidate - 1;
			candidate = -1;
			++i;
		} else if (rval[i] === " " || rval[i] === "	" || rval[i] === ",") candidate = i;
		return rval;
	}
	function ltrim(str) {
		return str.replace(/^\s+/, "");
	}
}));
//#endregion
//#region node_modules/node-forge/lib/des.js
var require_des = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* DES (Data Encryption Standard) implementation.
	*
	* This implementation supports DES as well as 3DES-EDE in ECB and CBC mode.
	* It is based on the BSD-licensed implementation by Paul Tero:
	*
	* Paul Tero, July 2001
	* http://www.tero.co.uk/des/
	*
	* Optimised for performance with large blocks by
	* Michael Hayworth, November 2001
	* http://www.netdealing.com
	*
	* THIS SOFTWARE IS PROVIDED "AS IS" AND
	* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	* ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
	* FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
	* OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
	* HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
	* LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
	* OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
	* SUCH DAMAGE.
	*
	* @author Stefan Siegl
	* @author Dave Longley
	*
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	* Copyright (c) 2012-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_cipher();
	require_cipherModes();
	require_util();
	module.exports = forge.des = forge.des || {};
	/**
	* Deprecated. Instead, use:
	*
	* var cipher = forge.cipher.createCipher('DES-<mode>', key);
	* cipher.start({iv: iv});
	*
	* Creates an DES cipher object to encrypt data using the given symmetric key.
	* The output will be stored in the 'output' member of the returned cipher.
	*
	* The key and iv may be given as binary-encoded strings of bytes or
	* byte buffers.
	*
	* @param key the symmetric key to use (64 or 192 bits).
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	* @param mode the cipher mode to use (default: 'CBC' if IV is
	*          given, 'ECB' if null).
	*
	* @return the cipher.
	*/
	forge.des.startEncrypting = function(key, iv, output, mode) {
		var cipher = _createCipher({
			key,
			output,
			decrypt: false,
			mode: mode || (iv === null ? "ECB" : "CBC")
		});
		cipher.start(iv);
		return cipher;
	};
	/**
	* Deprecated. Instead, use:
	*
	* var cipher = forge.cipher.createCipher('DES-<mode>', key);
	*
	* Creates an DES cipher object to encrypt data using the given symmetric key.
	*
	* The key may be given as a binary-encoded string of bytes or a byte buffer.
	*
	* @param key the symmetric key to use (64 or 192 bits).
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.des.createEncryptionCipher = function(key, mode) {
		return _createCipher({
			key,
			output: null,
			decrypt: false,
			mode
		});
	};
	/**
	* Deprecated. Instead, use:
	*
	* var decipher = forge.cipher.createDecipher('DES-<mode>', key);
	* decipher.start({iv: iv});
	*
	* Creates an DES cipher object to decrypt data using the given symmetric key.
	* The output will be stored in the 'output' member of the returned cipher.
	*
	* The key and iv may be given as binary-encoded strings of bytes or
	* byte buffers.
	*
	* @param key the symmetric key to use (64 or 192 bits).
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	* @param mode the cipher mode to use (default: 'CBC' if IV is
	*          given, 'ECB' if null).
	*
	* @return the cipher.
	*/
	forge.des.startDecrypting = function(key, iv, output, mode) {
		var cipher = _createCipher({
			key,
			output,
			decrypt: true,
			mode: mode || (iv === null ? "ECB" : "CBC")
		});
		cipher.start(iv);
		return cipher;
	};
	/**
	* Deprecated. Instead, use:
	*
	* var decipher = forge.cipher.createDecipher('DES-<mode>', key);
	*
	* Creates an DES cipher object to decrypt data using the given symmetric key.
	*
	* The key may be given as a binary-encoded string of bytes or a byte buffer.
	*
	* @param key the symmetric key to use (64 or 192 bits).
	* @param mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	forge.des.createDecryptionCipher = function(key, mode) {
		return _createCipher({
			key,
			output: null,
			decrypt: true,
			mode
		});
	};
	/**
	* Creates a new DES cipher algorithm object.
	*
	* @param name the name of the algorithm.
	* @param mode the mode factory function.
	*
	* @return the DES algorithm object.
	*/
	forge.des.Algorithm = function(name, mode) {
		var self = this;
		self.name = name;
		self.mode = new mode({
			blockSize: 8,
			cipher: {
				encrypt: function(inBlock, outBlock) {
					return _updateBlock(self._keys, inBlock, outBlock, false);
				},
				decrypt: function(inBlock, outBlock) {
					return _updateBlock(self._keys, inBlock, outBlock, true);
				}
			}
		});
		self._init = false;
	};
	/**
	* Initializes this DES algorithm by expanding its key.
	*
	* @param options the options to use.
	*          key the key to use with this algorithm.
	*          decrypt true if the algorithm should be initialized for decryption,
	*            false for encryption.
	*/
	forge.des.Algorithm.prototype.initialize = function(options) {
		if (this._init) return;
		var key = forge.util.createBuffer(options.key);
		if (this.name.indexOf("3DES") === 0) {
			if (key.length() !== 24) throw new Error("Invalid Triple-DES key size: " + key.length() * 8);
		}
		this._keys = _createKeys(key);
		this._init = true;
	};
	/** Register DES algorithms **/
	registerAlgorithm("DES-ECB", forge.cipher.modes.ecb);
	registerAlgorithm("DES-CBC", forge.cipher.modes.cbc);
	registerAlgorithm("DES-CFB", forge.cipher.modes.cfb);
	registerAlgorithm("DES-OFB", forge.cipher.modes.ofb);
	registerAlgorithm("DES-CTR", forge.cipher.modes.ctr);
	registerAlgorithm("3DES-ECB", forge.cipher.modes.ecb);
	registerAlgorithm("3DES-CBC", forge.cipher.modes.cbc);
	registerAlgorithm("3DES-CFB", forge.cipher.modes.cfb);
	registerAlgorithm("3DES-OFB", forge.cipher.modes.ofb);
	registerAlgorithm("3DES-CTR", forge.cipher.modes.ctr);
	function registerAlgorithm(name, mode) {
		var factory = function() {
			return new forge.des.Algorithm(name, mode);
		};
		forge.cipher.registerAlgorithm(name, factory);
	}
	/** DES implementation **/
	var spfunction1 = [
		16843776,
		0,
		65536,
		16843780,
		16842756,
		66564,
		4,
		65536,
		1024,
		16843776,
		16843780,
		1024,
		16778244,
		16842756,
		16777216,
		4,
		1028,
		16778240,
		16778240,
		66560,
		66560,
		16842752,
		16842752,
		16778244,
		65540,
		16777220,
		16777220,
		65540,
		0,
		1028,
		66564,
		16777216,
		65536,
		16843780,
		4,
		16842752,
		16843776,
		16777216,
		16777216,
		1024,
		16842756,
		65536,
		66560,
		16777220,
		1024,
		4,
		16778244,
		66564,
		16843780,
		65540,
		16842752,
		16778244,
		16777220,
		1028,
		66564,
		16843776,
		1028,
		16778240,
		16778240,
		0,
		65540,
		66560,
		0,
		16842756
	];
	var spfunction2 = [
		-2146402272,
		-2147450880,
		32768,
		1081376,
		1048576,
		32,
		-2146435040,
		-2147450848,
		-2147483616,
		-2146402272,
		-2146402304,
		-2147483648,
		-2147450880,
		1048576,
		32,
		-2146435040,
		1081344,
		1048608,
		-2147450848,
		0,
		-2147483648,
		32768,
		1081376,
		-2146435072,
		1048608,
		-2147483616,
		0,
		1081344,
		32800,
		-2146402304,
		-2146435072,
		32800,
		0,
		1081376,
		-2146435040,
		1048576,
		-2147450848,
		-2146435072,
		-2146402304,
		32768,
		-2146435072,
		-2147450880,
		32,
		-2146402272,
		1081376,
		32,
		32768,
		-2147483648,
		32800,
		-2146402304,
		1048576,
		-2147483616,
		1048608,
		-2147450848,
		-2147483616,
		1048608,
		1081344,
		0,
		-2147450880,
		32800,
		-2147483648,
		-2146435040,
		-2146402272,
		1081344
	];
	var spfunction3 = [
		520,
		134349312,
		0,
		134348808,
		134218240,
		0,
		131592,
		134218240,
		131080,
		134217736,
		134217736,
		131072,
		134349320,
		131080,
		134348800,
		520,
		134217728,
		8,
		134349312,
		512,
		131584,
		134348800,
		134348808,
		131592,
		134218248,
		131584,
		131072,
		134218248,
		8,
		134349320,
		512,
		134217728,
		134349312,
		134217728,
		131080,
		520,
		131072,
		134349312,
		134218240,
		0,
		512,
		131080,
		134349320,
		134218240,
		134217736,
		512,
		0,
		134348808,
		134218248,
		131072,
		134217728,
		134349320,
		8,
		131592,
		131584,
		134217736,
		134348800,
		134218248,
		520,
		134348800,
		131592,
		8,
		134348808,
		131584
	];
	var spfunction4 = [
		8396801,
		8321,
		8321,
		128,
		8396928,
		8388737,
		8388609,
		8193,
		0,
		8396800,
		8396800,
		8396929,
		129,
		0,
		8388736,
		8388609,
		1,
		8192,
		8388608,
		8396801,
		128,
		8388608,
		8193,
		8320,
		8388737,
		1,
		8320,
		8388736,
		8192,
		8396928,
		8396929,
		129,
		8388736,
		8388609,
		8396800,
		8396929,
		129,
		0,
		0,
		8396800,
		8320,
		8388736,
		8388737,
		1,
		8396801,
		8321,
		8321,
		128,
		8396929,
		129,
		1,
		8192,
		8388609,
		8193,
		8396928,
		8388737,
		8193,
		8320,
		8388608,
		8396801,
		128,
		8388608,
		8192,
		8396928
	];
	var spfunction5 = [
		256,
		34078976,
		34078720,
		1107296512,
		524288,
		256,
		1073741824,
		34078720,
		1074266368,
		524288,
		33554688,
		1074266368,
		1107296512,
		1107820544,
		524544,
		1073741824,
		33554432,
		1074266112,
		1074266112,
		0,
		1073742080,
		1107820800,
		1107820800,
		33554688,
		1107820544,
		1073742080,
		0,
		1107296256,
		34078976,
		33554432,
		1107296256,
		524544,
		524288,
		1107296512,
		256,
		33554432,
		1073741824,
		34078720,
		1107296512,
		1074266368,
		33554688,
		1073741824,
		1107820544,
		34078976,
		1074266368,
		256,
		33554432,
		1107820544,
		1107820800,
		524544,
		1107296256,
		1107820800,
		34078720,
		0,
		1074266112,
		1107296256,
		524544,
		33554688,
		1073742080,
		524288,
		0,
		1074266112,
		34078976,
		1073742080
	];
	var spfunction6 = [
		536870928,
		541065216,
		16384,
		541081616,
		541065216,
		16,
		541081616,
		4194304,
		536887296,
		4210704,
		4194304,
		536870928,
		4194320,
		536887296,
		536870912,
		16400,
		0,
		4194320,
		536887312,
		16384,
		4210688,
		536887312,
		16,
		541065232,
		541065232,
		0,
		4210704,
		541081600,
		16400,
		4210688,
		541081600,
		536870912,
		536887296,
		16,
		541065232,
		4210688,
		541081616,
		4194304,
		16400,
		536870928,
		4194304,
		536887296,
		536870912,
		16400,
		536870928,
		541081616,
		4210688,
		541065216,
		4210704,
		541081600,
		0,
		541065232,
		16,
		16384,
		541065216,
		4210704,
		16384,
		4194320,
		536887312,
		0,
		541081600,
		536870912,
		4194320,
		536887312
	];
	var spfunction7 = [
		2097152,
		69206018,
		67110914,
		0,
		2048,
		67110914,
		2099202,
		69208064,
		69208066,
		2097152,
		0,
		67108866,
		2,
		67108864,
		69206018,
		2050,
		67110912,
		2099202,
		2097154,
		67110912,
		67108866,
		69206016,
		69208064,
		2097154,
		69206016,
		2048,
		2050,
		69208066,
		2099200,
		2,
		67108864,
		2099200,
		67108864,
		2099200,
		2097152,
		67110914,
		67110914,
		69206018,
		69206018,
		2,
		2097154,
		67108864,
		67110912,
		2097152,
		69208064,
		2050,
		2099202,
		69208064,
		2050,
		67108866,
		69208066,
		69206016,
		2099200,
		0,
		2,
		69208066,
		0,
		2099202,
		69206016,
		2048,
		67108866,
		67110912,
		2048,
		2097154
	];
	var spfunction8 = [
		268439616,
		4096,
		262144,
		268701760,
		268435456,
		268439616,
		64,
		268435456,
		262208,
		268697600,
		268701760,
		266240,
		268701696,
		266304,
		4096,
		64,
		268697600,
		268435520,
		268439552,
		4160,
		266240,
		262208,
		268697664,
		268701696,
		4160,
		0,
		0,
		268697664,
		268435520,
		268439552,
		266304,
		262144,
		266304,
		262144,
		268701696,
		4096,
		64,
		268697664,
		4096,
		266304,
		268439552,
		64,
		268435520,
		268697600,
		268697664,
		268435456,
		262144,
		268439616,
		0,
		268701760,
		262208,
		268435520,
		268697600,
		268439552,
		268439616,
		0,
		268701760,
		266240,
		266240,
		4160,
		4160,
		262208,
		268435456,
		268701696
	];
	/**
	* Create necessary sub keys.
	*
	* @param key the 64-bit or 192-bit key.
	*
	* @return the expanded keys.
	*/
	function _createKeys(key) {
		var pc2bytes0 = [
			0,
			4,
			536870912,
			536870916,
			65536,
			65540,
			536936448,
			536936452,
			512,
			516,
			536871424,
			536871428,
			66048,
			66052,
			536936960,
			536936964
		], pc2bytes1 = [
			0,
			1,
			1048576,
			1048577,
			67108864,
			67108865,
			68157440,
			68157441,
			256,
			257,
			1048832,
			1048833,
			67109120,
			67109121,
			68157696,
			68157697
		], pc2bytes2 = [
			0,
			8,
			2048,
			2056,
			16777216,
			16777224,
			16779264,
			16779272,
			0,
			8,
			2048,
			2056,
			16777216,
			16777224,
			16779264,
			16779272
		], pc2bytes3 = [
			0,
			2097152,
			134217728,
			136314880,
			8192,
			2105344,
			134225920,
			136323072,
			131072,
			2228224,
			134348800,
			136445952,
			139264,
			2236416,
			134356992,
			136454144
		], pc2bytes4 = [
			0,
			262144,
			16,
			262160,
			0,
			262144,
			16,
			262160,
			4096,
			266240,
			4112,
			266256,
			4096,
			266240,
			4112,
			266256
		], pc2bytes5 = [
			0,
			1024,
			32,
			1056,
			0,
			1024,
			32,
			1056,
			33554432,
			33555456,
			33554464,
			33555488,
			33554432,
			33555456,
			33554464,
			33555488
		], pc2bytes6 = [
			0,
			268435456,
			524288,
			268959744,
			2,
			268435458,
			524290,
			268959746,
			0,
			268435456,
			524288,
			268959744,
			2,
			268435458,
			524290,
			268959746
		], pc2bytes7 = [
			0,
			65536,
			2048,
			67584,
			536870912,
			536936448,
			536872960,
			536938496,
			131072,
			196608,
			133120,
			198656,
			537001984,
			537067520,
			537004032,
			537069568
		], pc2bytes8 = [
			0,
			262144,
			0,
			262144,
			2,
			262146,
			2,
			262146,
			33554432,
			33816576,
			33554432,
			33816576,
			33554434,
			33816578,
			33554434,
			33816578
		], pc2bytes9 = [
			0,
			268435456,
			8,
			268435464,
			0,
			268435456,
			8,
			268435464,
			1024,
			268436480,
			1032,
			268436488,
			1024,
			268436480,
			1032,
			268436488
		], pc2bytes10 = [
			0,
			32,
			0,
			32,
			1048576,
			1048608,
			1048576,
			1048608,
			8192,
			8224,
			8192,
			8224,
			1056768,
			1056800,
			1056768,
			1056800
		], pc2bytes11 = [
			0,
			16777216,
			512,
			16777728,
			2097152,
			18874368,
			2097664,
			18874880,
			67108864,
			83886080,
			67109376,
			83886592,
			69206016,
			85983232,
			69206528,
			85983744
		], pc2bytes12 = [
			0,
			4096,
			134217728,
			134221824,
			524288,
			528384,
			134742016,
			134746112,
			16,
			4112,
			134217744,
			134221840,
			524304,
			528400,
			134742032,
			134746128
		], pc2bytes13 = [
			0,
			4,
			256,
			260,
			0,
			4,
			256,
			260,
			1,
			5,
			257,
			261,
			1,
			5,
			257,
			261
		];
		var iterations = key.length() > 8 ? 3 : 1;
		var keys = [];
		var shifts = [
			0,
			0,
			1,
			1,
			1,
			1,
			1,
			1,
			0,
			1,
			1,
			1,
			1,
			1,
			1,
			0
		];
		var n = 0, tmp;
		for (var j = 0; j < iterations; j++) {
			var left = key.getInt32();
			var right = key.getInt32();
			tmp = (left >>> 4 ^ right) & 252645135;
			right ^= tmp;
			left ^= tmp << 4;
			tmp = (right >>> -16 ^ left) & 65535;
			left ^= tmp;
			right ^= tmp << -16;
			tmp = (left >>> 2 ^ right) & 858993459;
			right ^= tmp;
			left ^= tmp << 2;
			tmp = (right >>> -16 ^ left) & 65535;
			left ^= tmp;
			right ^= tmp << -16;
			tmp = (left >>> 1 ^ right) & 1431655765;
			right ^= tmp;
			left ^= tmp << 1;
			tmp = (right >>> 8 ^ left) & 16711935;
			left ^= tmp;
			right ^= tmp << 8;
			tmp = (left >>> 1 ^ right) & 1431655765;
			right ^= tmp;
			left ^= tmp << 1;
			tmp = left << 8 | right >>> 20 & 240;
			left = right << 24 | right << 8 & 16711680 | right >>> 8 & 65280 | right >>> 24 & 240;
			right = tmp;
			for (var i = 0; i < shifts.length; ++i) {
				if (shifts[i]) {
					left = left << 2 | left >>> 26;
					right = right << 2 | right >>> 26;
				} else {
					left = left << 1 | left >>> 27;
					right = right << 1 | right >>> 27;
				}
				left &= -15;
				right &= -15;
				var lefttmp = pc2bytes0[left >>> 28] | pc2bytes1[left >>> 24 & 15] | pc2bytes2[left >>> 20 & 15] | pc2bytes3[left >>> 16 & 15] | pc2bytes4[left >>> 12 & 15] | pc2bytes5[left >>> 8 & 15] | pc2bytes6[left >>> 4 & 15];
				var righttmp = pc2bytes7[right >>> 28] | pc2bytes8[right >>> 24 & 15] | pc2bytes9[right >>> 20 & 15] | pc2bytes10[right >>> 16 & 15] | pc2bytes11[right >>> 12 & 15] | pc2bytes12[right >>> 8 & 15] | pc2bytes13[right >>> 4 & 15];
				tmp = (righttmp >>> 16 ^ lefttmp) & 65535;
				keys[n++] = lefttmp ^ tmp;
				keys[n++] = righttmp ^ tmp << 16;
			}
		}
		return keys;
	}
	/**
	* Updates a single block (1 byte) using DES. The update will either
	* encrypt or decrypt the block.
	*
	* @param keys the expanded keys.
	* @param input the input block (an array of 32-bit words).
	* @param output the updated output block.
	* @param decrypt true to decrypt the block, false to encrypt it.
	*/
	function _updateBlock(keys, input, output, decrypt) {
		var iterations = keys.length === 32 ? 3 : 9;
		var looping;
		if (iterations === 3) looping = decrypt ? [
			30,
			-2,
			-2
		] : [
			0,
			32,
			2
		];
		else looping = decrypt ? [
			94,
			62,
			-2,
			32,
			64,
			2,
			30,
			-2,
			-2
		] : [
			0,
			32,
			2,
			62,
			30,
			-2,
			64,
			96,
			2
		];
		var tmp;
		var left = input[0];
		var right = input[1];
		tmp = (left >>> 4 ^ right) & 252645135;
		right ^= tmp;
		left ^= tmp << 4;
		tmp = (left >>> 16 ^ right) & 65535;
		right ^= tmp;
		left ^= tmp << 16;
		tmp = (right >>> 2 ^ left) & 858993459;
		left ^= tmp;
		right ^= tmp << 2;
		tmp = (right >>> 8 ^ left) & 16711935;
		left ^= tmp;
		right ^= tmp << 8;
		tmp = (left >>> 1 ^ right) & 1431655765;
		right ^= tmp;
		left ^= tmp << 1;
		left = left << 1 | left >>> 31;
		right = right << 1 | right >>> 31;
		for (var j = 0; j < iterations; j += 3) {
			var endloop = looping[j + 1];
			var loopinc = looping[j + 2];
			for (var i = looping[j]; i != endloop; i += loopinc) {
				var right1 = right ^ keys[i];
				var right2 = (right >>> 4 | right << 28) ^ keys[i + 1];
				tmp = left;
				left = right;
				right = tmp ^ (spfunction2[right1 >>> 24 & 63] | spfunction4[right1 >>> 16 & 63] | spfunction6[right1 >>> 8 & 63] | spfunction8[right1 & 63] | spfunction1[right2 >>> 24 & 63] | spfunction3[right2 >>> 16 & 63] | spfunction5[right2 >>> 8 & 63] | spfunction7[right2 & 63]);
			}
			tmp = left;
			left = right;
			right = tmp;
		}
		left = left >>> 1 | left << 31;
		right = right >>> 1 | right << 31;
		tmp = (left >>> 1 ^ right) & 1431655765;
		right ^= tmp;
		left ^= tmp << 1;
		tmp = (right >>> 8 ^ left) & 16711935;
		left ^= tmp;
		right ^= tmp << 8;
		tmp = (right >>> 2 ^ left) & 858993459;
		left ^= tmp;
		right ^= tmp << 2;
		tmp = (left >>> 16 ^ right) & 65535;
		right ^= tmp;
		left ^= tmp << 16;
		tmp = (left >>> 4 ^ right) & 252645135;
		right ^= tmp;
		left ^= tmp << 4;
		output[0] = left;
		output[1] = right;
	}
	/**
	* Deprecated. Instead, use:
	*
	* forge.cipher.createCipher('DES-<mode>', key);
	* forge.cipher.createDecipher('DES-<mode>', key);
	*
	* Creates a deprecated DES cipher object. This object's mode will default to
	* CBC (cipher-block-chaining).
	*
	* The key may be given as a binary-encoded string of bytes or a byte buffer.
	*
	* @param options the options to use.
	*          key the symmetric key to use (64 or 192 bits).
	*          output the buffer to write to.
	*          decrypt true for decryption, false for encryption.
	*          mode the cipher mode to use (default: 'CBC').
	*
	* @return the cipher.
	*/
	function _createCipher(options) {
		options = options || {};
		var algorithm = "DES-" + (options.mode || "CBC").toUpperCase();
		var cipher;
		if (options.decrypt) cipher = forge.cipher.createDecipher(algorithm, options.key);
		else cipher = forge.cipher.createCipher(algorithm, options.key);
		var start = cipher.start;
		cipher.start = function(iv, options) {
			var output = null;
			if (options instanceof forge.util.ByteBuffer) {
				output = options;
				options = {};
			}
			options = options || {};
			options.output = output;
			options.iv = iv;
			start.call(cipher, options);
		};
		return cipher;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/pbkdf2.js
var require_pbkdf2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Password-Based Key-Derivation Function #2 implementation.
	*
	* See RFC 2898 for details.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2013 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_hmac();
	require_md();
	require_util();
	var pkcs5 = forge.pkcs5 = forge.pkcs5 || {};
	var crypto;
	if (forge.util.isNodejs && !forge.options.usePureJavaScript) crypto = require("crypto");
	/**
	* Derives a key from a password.
	*
	* @param p the password as a binary-encoded string of bytes.
	* @param s the salt as a binary-encoded string of bytes.
	* @param c the iteration count, a positive integer.
	* @param dkLen the intended length, in bytes, of the derived key,
	*          (max: 2^32 - 1) * hash length of the PRF.
	* @param [md] the message digest (or algorithm identifier as a string) to use
	*          in the PRF, defaults to SHA-1.
	* @param [callback(err, key)] presence triggers asynchronous version, called
	*          once the operation completes.
	*
	* @return the derived key, as a binary-encoded string of bytes, for the
	*           synchronous version (if no callback is specified).
	*/
	module.exports = forge.pbkdf2 = pkcs5.pbkdf2 = function(p, s, c, dkLen, md, callback) {
		if (typeof md === "function") {
			callback = md;
			md = null;
		}
		if (forge.util.isNodejs && !forge.options.usePureJavaScript && crypto.pbkdf2 && (md === null || typeof md !== "object") && (crypto.pbkdf2Sync.length > 4 || !md || md === "sha1")) {
			if (typeof md !== "string") md = "sha1";
			p = Buffer.from(p, "binary");
			s = Buffer.from(s, "binary");
			if (!callback) {
				if (crypto.pbkdf2Sync.length === 4) return crypto.pbkdf2Sync(p, s, c, dkLen).toString("binary");
				return crypto.pbkdf2Sync(p, s, c, dkLen, md).toString("binary");
			}
			if (crypto.pbkdf2Sync.length === 4) return crypto.pbkdf2(p, s, c, dkLen, function(err, key) {
				if (err) return callback(err);
				callback(null, key.toString("binary"));
			});
			return crypto.pbkdf2(p, s, c, dkLen, md, function(err, key) {
				if (err) return callback(err);
				callback(null, key.toString("binary"));
			});
		}
		if (typeof md === "undefined" || md === null) md = "sha1";
		if (typeof md === "string") {
			if (!(md in forge.md.algorithms)) throw new Error("Unknown hash algorithm: " + md);
			md = forge.md[md].create();
		}
		var hLen = md.digestLength;
		if (dkLen > 4294967295 * hLen) {
			var err = /* @__PURE__ */ new Error("Derived key is too long.");
			if (callback) return callback(err);
			throw err;
		}
		var len = Math.ceil(dkLen / hLen);
		var r = dkLen - (len - 1) * hLen;
		var prf = forge.hmac.create();
		prf.start(md, p);
		var dk = "";
		var xor, u_c, u_c1;
		if (!callback) {
			for (var i = 1; i <= len; ++i) {
				prf.start(null, null);
				prf.update(s);
				prf.update(forge.util.int32ToBytes(i));
				xor = u_c1 = prf.digest().getBytes();
				for (var j = 2; j <= c; ++j) {
					prf.start(null, null);
					prf.update(u_c1);
					u_c = prf.digest().getBytes();
					xor = forge.util.xorBytes(xor, u_c, hLen);
					u_c1 = u_c;
				}
				dk += i < len ? xor : xor.substr(0, r);
			}
			return dk;
		}
		var i = 1, j;
		function outer() {
			if (i > len) return callback(null, dk);
			prf.start(null, null);
			prf.update(s);
			prf.update(forge.util.int32ToBytes(i));
			xor = u_c1 = prf.digest().getBytes();
			j = 2;
			inner();
		}
		function inner() {
			if (j <= c) {
				prf.start(null, null);
				prf.update(u_c1);
				u_c = prf.digest().getBytes();
				xor = forge.util.xorBytes(xor, u_c, hLen);
				u_c1 = u_c;
				++j;
				return forge.util.setImmediate(inner);
			}
			dk += i < len ? xor : xor.substr(0, r);
			++i;
			outer();
		}
		outer();
	};
}));
//#endregion
//#region node_modules/node-forge/lib/sha256.js
var require_sha256 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Secure Hash Algorithm with 256-bit digest (SHA-256) implementation.
	*
	* See FIPS 180-2 for details.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2015 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_md();
	require_util();
	var sha256 = module.exports = forge.sha256 = forge.sha256 || {};
	forge.md.sha256 = forge.md.algorithms.sha256 = sha256;
	/**
	* Creates a SHA-256 message digest object.
	*
	* @return a message digest object.
	*/
	sha256.create = function() {
		if (!_initialized) _init();
		var _state = null;
		var _input = forge.util.createBuffer();
		var _w = new Array(64);
		var md = {
			algorithm: "sha256",
			blockLength: 64,
			digestLength: 32,
			messageLength: 0,
			fullMessageLength: null,
			messageLengthSize: 8
		};
		/**
		* Starts the digest.
		*
		* @return this digest object.
		*/
		md.start = function() {
			md.messageLength = 0;
			md.fullMessageLength = md.messageLength64 = [];
			var int32s = md.messageLengthSize / 4;
			for (var i = 0; i < int32s; ++i) md.fullMessageLength.push(0);
			_input = forge.util.createBuffer();
			_state = {
				h0: 1779033703,
				h1: 3144134277,
				h2: 1013904242,
				h3: 2773480762,
				h4: 1359893119,
				h5: 2600822924,
				h6: 528734635,
				h7: 1541459225
			};
			return md;
		};
		md.start();
		/**
		* Updates the digest with the given message input. The given input can
		* treated as raw input (no encoding will be applied) or an encoding of
		* 'utf8' maybe given to encode the input using UTF-8.
		*
		* @param msg the message input to update with.
		* @param encoding the encoding to use (default: 'raw', other: 'utf8').
		*
		* @return this digest object.
		*/
		md.update = function(msg, encoding) {
			if (encoding === "utf8") msg = forge.util.encodeUtf8(msg);
			var len = msg.length;
			md.messageLength += len;
			len = [len / 4294967296 >>> 0, len >>> 0];
			for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
				md.fullMessageLength[i] += len[1];
				len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
				md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
				len[0] = len[1] / 4294967296 >>> 0;
			}
			_input.putBytes(msg);
			_update(_state, _w, _input);
			if (_input.read > 2048 || _input.length() === 0) _input.compact();
			return md;
		};
		/**
		* Produces the digest.
		*
		* @return a byte buffer containing the digest value.
		*/
		md.digest = function() {
			var finalBlock = forge.util.createBuffer();
			finalBlock.putBytes(_input.bytes());
			var overflow = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize & md.blockLength - 1;
			finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
			var next, carry;
			var bits = md.fullMessageLength[0] * 8;
			for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
				next = md.fullMessageLength[i + 1] * 8;
				carry = next / 4294967296 >>> 0;
				bits += carry;
				finalBlock.putInt32(bits >>> 0);
				bits = next >>> 0;
			}
			finalBlock.putInt32(bits);
			var s2 = {
				h0: _state.h0,
				h1: _state.h1,
				h2: _state.h2,
				h3: _state.h3,
				h4: _state.h4,
				h5: _state.h5,
				h6: _state.h6,
				h7: _state.h7
			};
			_update(s2, _w, finalBlock);
			var rval = forge.util.createBuffer();
			rval.putInt32(s2.h0);
			rval.putInt32(s2.h1);
			rval.putInt32(s2.h2);
			rval.putInt32(s2.h3);
			rval.putInt32(s2.h4);
			rval.putInt32(s2.h5);
			rval.putInt32(s2.h6);
			rval.putInt32(s2.h7);
			return rval;
		};
		return md;
	};
	var _padding = null;
	var _initialized = false;
	var _k = null;
	/**
	* Initializes the constant tables.
	*/
	function _init() {
		_padding = String.fromCharCode(128);
		_padding += forge.util.fillString(String.fromCharCode(0), 64);
		_k = [
			1116352408,
			1899447441,
			3049323471,
			3921009573,
			961987163,
			1508970993,
			2453635748,
			2870763221,
			3624381080,
			310598401,
			607225278,
			1426881987,
			1925078388,
			2162078206,
			2614888103,
			3248222580,
			3835390401,
			4022224774,
			264347078,
			604807628,
			770255983,
			1249150122,
			1555081692,
			1996064986,
			2554220882,
			2821834349,
			2952996808,
			3210313671,
			3336571891,
			3584528711,
			113926993,
			338241895,
			666307205,
			773529912,
			1294757372,
			1396182291,
			1695183700,
			1986661051,
			2177026350,
			2456956037,
			2730485921,
			2820302411,
			3259730800,
			3345764771,
			3516065817,
			3600352804,
			4094571909,
			275423344,
			430227734,
			506948616,
			659060556,
			883997877,
			958139571,
			1322822218,
			1537002063,
			1747873779,
			1955562222,
			2024104815,
			2227730452,
			2361852424,
			2428436474,
			2756734187,
			3204031479,
			3329325298
		];
		_initialized = true;
	}
	/**
	* Updates a SHA-256 state with the given byte buffer.
	*
	* @param s the SHA-256 state to update.
	* @param w the array to use to store words.
	* @param bytes the byte buffer to update with.
	*/
	function _update(s, w, bytes) {
		var t1, t2, s0, s1, ch, maj, i, a, b, c, d, e, f, g, h;
		var len = bytes.length();
		while (len >= 64) {
			for (i = 0; i < 16; ++i) w[i] = bytes.getInt32();
			for (; i < 64; ++i) {
				t1 = w[i - 2];
				t1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
				t2 = w[i - 15];
				t2 = (t2 >>> 7 | t2 << 25) ^ (t2 >>> 18 | t2 << 14) ^ t2 >>> 3;
				w[i] = t1 + w[i - 7] + t2 + w[i - 16] | 0;
			}
			a = s.h0;
			b = s.h1;
			c = s.h2;
			d = s.h3;
			e = s.h4;
			f = s.h5;
			g = s.h6;
			h = s.h7;
			for (i = 0; i < 64; ++i) {
				s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
				ch = g ^ e & (f ^ g);
				s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
				maj = a & b | c & (a ^ b);
				t1 = h + s1 + ch + _k[i] + w[i];
				t2 = s0 + maj;
				h = g;
				g = f;
				f = e;
				e = d + t1 >>> 0;
				d = c;
				c = b;
				b = a;
				a = t1 + t2 >>> 0;
			}
			s.h0 = s.h0 + a | 0;
			s.h1 = s.h1 + b | 0;
			s.h2 = s.h2 + c | 0;
			s.h3 = s.h3 + d | 0;
			s.h4 = s.h4 + e | 0;
			s.h5 = s.h5 + f | 0;
			s.h6 = s.h6 + g | 0;
			s.h7 = s.h7 + h | 0;
			len -= 64;
		}
	}
}));
//#endregion
//#region node_modules/node-forge/lib/prng.js
var require_prng = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* A javascript implementation of a cryptographically-secure
	* Pseudo Random Number Generator (PRNG). The Fortuna algorithm is followed
	* here though the use of SHA-256 is not enforced; when generating an
	* a PRNG context, the hashing algorithm and block cipher used for
	* the generator are specified via a plugin.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	var _crypto = null;
	if (forge.util.isNodejs && !forge.options.usePureJavaScript && !process.versions["node-webkit"]) _crypto = require("crypto");
	var prng = module.exports = forge.prng = forge.prng || {};
	/**
	* Creates a new PRNG context.
	*
	* A PRNG plugin must be passed in that will provide:
	*
	* 1. A function that initializes the key and seed of a PRNG context. It
	*   will be given a 16 byte key and a 16 byte seed. Any key expansion
	*   or transformation of the seed from a byte string into an array of
	*   integers (or similar) should be performed.
	* 2. The cryptographic function used by the generator. It takes a key and
	*   a seed.
	* 3. A seed increment function. It takes the seed and returns seed + 1.
	* 4. An api to create a message digest.
	*
	* For an example, see random.js.
	*
	* @param plugin the PRNG plugin to use.
	*/
	prng.create = function(plugin) {
		var ctx = {
			plugin,
			key: null,
			seed: null,
			time: null,
			reseeds: 0,
			generated: 0,
			keyBytes: ""
		};
		var md = plugin.md;
		var pools = new Array(32);
		for (var i = 0; i < 32; ++i) pools[i] = md.create();
		ctx.pools = pools;
		ctx.pool = 0;
		/**
		* Generates random bytes. The bytes may be generated synchronously or
		* asynchronously. Web workers must use the asynchronous interface or
		* else the behavior is undefined.
		*
		* @param count the number of random bytes to generate.
		* @param [callback(err, bytes)] called once the operation completes.
		*
		* @return count random bytes as a string.
		*/
		ctx.generate = function(count, callback) {
			if (!callback) return ctx.generateSync(count);
			var cipher = ctx.plugin.cipher;
			var increment = ctx.plugin.increment;
			var formatKey = ctx.plugin.formatKey;
			var formatSeed = ctx.plugin.formatSeed;
			var b = forge.util.createBuffer();
			ctx.key = null;
			generate();
			function generate(err) {
				if (err) return callback(err);
				if (b.length() >= count) return callback(null, b.getBytes(count));
				if (ctx.generated > 1048575) ctx.key = null;
				if (ctx.key === null) return forge.util.nextTick(function() {
					_reseed(generate);
				});
				var bytes = cipher(ctx.key, ctx.seed);
				ctx.generated += bytes.length;
				b.putBytes(bytes);
				ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
				ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
				forge.util.setImmediate(generate);
			}
		};
		/**
		* Generates random bytes synchronously.
		*
		* @param count the number of random bytes to generate.
		*
		* @return count random bytes as a string.
		*/
		ctx.generateSync = function(count) {
			var cipher = ctx.plugin.cipher;
			var increment = ctx.plugin.increment;
			var formatKey = ctx.plugin.formatKey;
			var formatSeed = ctx.plugin.formatSeed;
			ctx.key = null;
			var b = forge.util.createBuffer();
			while (b.length() < count) {
				if (ctx.generated > 1048575) ctx.key = null;
				if (ctx.key === null) _reseedSync();
				var bytes = cipher(ctx.key, ctx.seed);
				ctx.generated += bytes.length;
				b.putBytes(bytes);
				ctx.key = formatKey(cipher(ctx.key, increment(ctx.seed)));
				ctx.seed = formatSeed(cipher(ctx.key, ctx.seed));
			}
			return b.getBytes(count);
		};
		/**
		* Private function that asynchronously reseeds a generator.
		*
		* @param callback(err) called once the operation completes.
		*/
		function _reseed(callback) {
			if (ctx.pools[0].messageLength >= 32) {
				_seed();
				return callback();
			}
			var needed = 32 - ctx.pools[0].messageLength << 5;
			ctx.seedFile(needed, function(err, bytes) {
				if (err) return callback(err);
				ctx.collect(bytes);
				_seed();
				callback();
			});
		}
		/**
		* Private function that synchronously reseeds a generator.
		*/
		function _reseedSync() {
			if (ctx.pools[0].messageLength >= 32) return _seed();
			var needed = 32 - ctx.pools[0].messageLength << 5;
			ctx.collect(ctx.seedFileSync(needed));
			_seed();
		}
		/**
		* Private function that seeds a generator once enough bytes are available.
		*/
		function _seed() {
			ctx.reseeds = ctx.reseeds === 4294967295 ? 0 : ctx.reseeds + 1;
			var md = ctx.plugin.md.create();
			md.update(ctx.keyBytes);
			var _2powK = 1;
			for (var k = 0; k < 32; ++k) {
				if (ctx.reseeds % _2powK === 0) {
					md.update(ctx.pools[k].digest().getBytes());
					ctx.pools[k].start();
				}
				_2powK = _2powK << 1;
			}
			ctx.keyBytes = md.digest().getBytes();
			md.start();
			md.update(ctx.keyBytes);
			var seedBytes = md.digest().getBytes();
			ctx.key = ctx.plugin.formatKey(ctx.keyBytes);
			ctx.seed = ctx.plugin.formatSeed(seedBytes);
			ctx.generated = 0;
		}
		/**
		* The built-in default seedFile. This seedFile is used when entropy
		* is needed immediately.
		*
		* @param needed the number of bytes that are needed.
		*
		* @return the random bytes.
		*/
		function defaultSeedFile(needed) {
			var getRandomValues = null;
			var globalScope = forge.util.globalScope;
			var _crypto = globalScope.crypto || globalScope.msCrypto;
			if (_crypto && _crypto.getRandomValues) getRandomValues = function(arr) {
				return _crypto.getRandomValues(arr);
			};
			var b = forge.util.createBuffer();
			if (getRandomValues) while (b.length() < needed) {
				var count = Math.max(1, Math.min(needed - b.length(), 65536) / 4);
				var entropy = new Uint32Array(Math.floor(count));
				try {
					getRandomValues(entropy);
					for (var i = 0; i < entropy.length; ++i) b.putInt32(entropy[i]);
				} catch (e) {
					if (!(typeof QuotaExceededError !== "undefined" && e instanceof QuotaExceededError)) throw e;
				}
			}
			if (b.length() < needed) {
				var hi, lo, next;
				var seed = Math.floor(Math.random() * 65536);
				while (b.length() < needed) {
					lo = 16807 * (seed & 65535);
					hi = 16807 * (seed >> 16);
					lo += (hi & 32767) << 16;
					lo += hi >> 15;
					lo = (lo & 2147483647) + (lo >> 31);
					seed = lo & 4294967295;
					for (var i = 0; i < 3; ++i) {
						next = seed >>> (i << 3);
						next ^= Math.floor(Math.random() * 256);
						b.putByte(next & 255);
					}
				}
			}
			return b.getBytes(needed);
		}
		if (_crypto) {
			ctx.seedFile = function(needed, callback) {
				_crypto.randomBytes(needed, function(err, bytes) {
					if (err) return callback(err);
					callback(null, bytes.toString());
				});
			};
			ctx.seedFileSync = function(needed) {
				return _crypto.randomBytes(needed).toString();
			};
		} else {
			ctx.seedFile = function(needed, callback) {
				try {
					callback(null, defaultSeedFile(needed));
				} catch (e) {
					callback(e);
				}
			};
			ctx.seedFileSync = defaultSeedFile;
		}
		/**
		* Adds entropy to a prng ctx's accumulator.
		*
		* @param bytes the bytes of entropy as a string.
		*/
		ctx.collect = function(bytes) {
			var count = bytes.length;
			for (var i = 0; i < count; ++i) {
				ctx.pools[ctx.pool].update(bytes.substr(i, 1));
				ctx.pool = ctx.pool === 31 ? 0 : ctx.pool + 1;
			}
		};
		/**
		* Collects an integer of n bits.
		*
		* @param i the integer entropy.
		* @param n the number of bits in the integer.
		*/
		ctx.collectInt = function(i, n) {
			var bytes = "";
			for (var x = 0; x < n; x += 8) bytes += String.fromCharCode(i >> x & 255);
			ctx.collect(bytes);
		};
		/**
		* Registers a Web Worker to receive immediate entropy from the main thread.
		* This method is required until Web Workers can access the native crypto
		* API. This method should be called twice for each created worker, once in
		* the main thread, and once in the worker itself.
		*
		* @param worker the worker to register.
		*/
		ctx.registerWorker = function(worker) {
			if (worker === self) ctx.seedFile = function(needed, callback) {
				function listener(e) {
					var data = e.data;
					if (data.forge && data.forge.prng) {
						self.removeEventListener("message", listener);
						callback(data.forge.prng.err, data.forge.prng.bytes);
					}
				}
				self.addEventListener("message", listener);
				self.postMessage({ forge: { prng: { needed } } });
			};
			else {
				var listener = function(e) {
					var data = e.data;
					if (data.forge && data.forge.prng) ctx.seedFile(data.forge.prng.needed, function(err, bytes) {
						worker.postMessage({ forge: { prng: {
							err,
							bytes
						} } });
					});
				};
				worker.addEventListener("message", listener);
			}
		};
		return ctx;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/random.js
var require_random = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* An API for getting cryptographically-secure random bytes. The bytes are
	* generated using the Fortuna algorithm devised by Bruce Schneier and
	* Niels Ferguson.
	*
	* Getting strong random bytes is not yet easy to do in javascript. The only
	* truish random entropy that can be collected is from the mouse, keyboard, or
	* from timing with respect to page loads, etc. This generator makes a poor
	* attempt at providing random bytes when those sources haven't yet provided
	* enough entropy to initially seed or to reseed the PRNG.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2009-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_aes();
	require_sha256();
	require_prng();
	require_util();
	(function() {
		if (forge.random && forge.random.getBytes) {
			module.exports = forge.random;
			return;
		}
		(function(jQuery) {
			var prng_aes = {};
			var _prng_aes_output = new Array(4);
			var _prng_aes_buffer = forge.util.createBuffer();
			prng_aes.formatKey = function(key) {
				var tmp = forge.util.createBuffer(key);
				key = new Array(4);
				key[0] = tmp.getInt32();
				key[1] = tmp.getInt32();
				key[2] = tmp.getInt32();
				key[3] = tmp.getInt32();
				return forge.aes._expandKey(key, false);
			};
			prng_aes.formatSeed = function(seed) {
				var tmp = forge.util.createBuffer(seed);
				seed = new Array(4);
				seed[0] = tmp.getInt32();
				seed[1] = tmp.getInt32();
				seed[2] = tmp.getInt32();
				seed[3] = tmp.getInt32();
				return seed;
			};
			prng_aes.cipher = function(key, seed) {
				forge.aes._updateBlock(key, seed, _prng_aes_output, false);
				_prng_aes_buffer.putInt32(_prng_aes_output[0]);
				_prng_aes_buffer.putInt32(_prng_aes_output[1]);
				_prng_aes_buffer.putInt32(_prng_aes_output[2]);
				_prng_aes_buffer.putInt32(_prng_aes_output[3]);
				return _prng_aes_buffer.getBytes();
			};
			prng_aes.increment = function(seed) {
				++seed[3];
				return seed;
			};
			prng_aes.md = forge.md.sha256;
			/**
			* Creates a new PRNG.
			*/
			function spawnPrng() {
				var ctx = forge.prng.create(prng_aes);
				/**
				* Gets random bytes. If a native secure crypto API is unavailable, this
				* method tries to make the bytes more unpredictable by drawing from data that
				* can be collected from the user of the browser, eg: mouse movement.
				*
				* If a callback is given, this method will be called asynchronously.
				*
				* @param count the number of random bytes to get.
				* @param [callback(err, bytes)] called once the operation completes.
				*
				* @return the random bytes in a string.
				*/
				ctx.getBytes = function(count, callback) {
					return ctx.generate(count, callback);
				};
				/**
				* Gets random bytes asynchronously. If a native secure crypto API is
				* unavailable, this method tries to make the bytes more unpredictable by
				* drawing from data that can be collected from the user of the browser,
				* eg: mouse movement.
				*
				* @param count the number of random bytes to get.
				*
				* @return the random bytes in a string.
				*/
				ctx.getBytesSync = function(count) {
					return ctx.generate(count);
				};
				return ctx;
			}
			var _ctx = spawnPrng();
			var getRandomValues = null;
			var globalScope = forge.util.globalScope;
			var _crypto = globalScope.crypto || globalScope.msCrypto;
			if (_crypto && _crypto.getRandomValues) getRandomValues = function(arr) {
				return _crypto.getRandomValues(arr);
			};
			if (forge.options.usePureJavaScript || !forge.util.isNodejs && !getRandomValues) {
				if (typeof window === "undefined" || window.document === void 0) {}
				_ctx.collectInt(+/* @__PURE__ */ new Date(), 32);
				if (typeof navigator !== "undefined") {
					var _navBytes = "";
					for (var key in navigator) try {
						if (typeof navigator[key] == "string") _navBytes += navigator[key];
					} catch (e) {}
					_ctx.collect(_navBytes);
					_navBytes = null;
				}
				if (jQuery) {
					jQuery().mousemove(function(e) {
						_ctx.collectInt(e.clientX, 16);
						_ctx.collectInt(e.clientY, 16);
					});
					jQuery().keypress(function(e) {
						_ctx.collectInt(e.charCode, 8);
					});
				}
			}
			if (!forge.random) forge.random = _ctx;
			else for (var key in _ctx) forge.random[key] = _ctx[key];
			forge.random.createInstance = spawnPrng;
			module.exports = forge.random;
		})(typeof jQuery !== "undefined" ? jQuery : null);
	})();
}));
//#endregion
//#region node_modules/node-forge/lib/rc2.js
var require_rc2 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* RC2 implementation.
	*
	* @author Stefan Siegl
	*
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	*
	* Information on the RC2 cipher is available from RFC #2268,
	* http://www.ietf.org/rfc/rfc2268.txt
	*/
	var forge = require_forge();
	require_util();
	var piTable = [
		217,
		120,
		249,
		196,
		25,
		221,
		181,
		237,
		40,
		233,
		253,
		121,
		74,
		160,
		216,
		157,
		198,
		126,
		55,
		131,
		43,
		118,
		83,
		142,
		98,
		76,
		100,
		136,
		68,
		139,
		251,
		162,
		23,
		154,
		89,
		245,
		135,
		179,
		79,
		19,
		97,
		69,
		109,
		141,
		9,
		129,
		125,
		50,
		189,
		143,
		64,
		235,
		134,
		183,
		123,
		11,
		240,
		149,
		33,
		34,
		92,
		107,
		78,
		130,
		84,
		214,
		101,
		147,
		206,
		96,
		178,
		28,
		115,
		86,
		192,
		20,
		167,
		140,
		241,
		220,
		18,
		117,
		202,
		31,
		59,
		190,
		228,
		209,
		66,
		61,
		212,
		48,
		163,
		60,
		182,
		38,
		111,
		191,
		14,
		218,
		70,
		105,
		7,
		87,
		39,
		242,
		29,
		155,
		188,
		148,
		67,
		3,
		248,
		17,
		199,
		246,
		144,
		239,
		62,
		231,
		6,
		195,
		213,
		47,
		200,
		102,
		30,
		215,
		8,
		232,
		234,
		222,
		128,
		82,
		238,
		247,
		132,
		170,
		114,
		172,
		53,
		77,
		106,
		42,
		150,
		26,
		210,
		113,
		90,
		21,
		73,
		116,
		75,
		159,
		208,
		94,
		4,
		24,
		164,
		236,
		194,
		224,
		65,
		110,
		15,
		81,
		203,
		204,
		36,
		145,
		175,
		80,
		161,
		244,
		112,
		57,
		153,
		124,
		58,
		133,
		35,
		184,
		180,
		122,
		252,
		2,
		54,
		91,
		37,
		85,
		151,
		49,
		45,
		93,
		250,
		152,
		227,
		138,
		146,
		174,
		5,
		223,
		41,
		16,
		103,
		108,
		186,
		201,
		211,
		0,
		230,
		207,
		225,
		158,
		168,
		44,
		99,
		22,
		1,
		63,
		88,
		226,
		137,
		169,
		13,
		56,
		52,
		27,
		171,
		51,
		255,
		176,
		187,
		72,
		12,
		95,
		185,
		177,
		205,
		46,
		197,
		243,
		219,
		71,
		229,
		165,
		156,
		119,
		10,
		166,
		32,
		104,
		254,
		127,
		193,
		173
	];
	var s = [
		1,
		2,
		3,
		5
	];
	/**
	* Rotate a word left by given number of bits.
	*
	* Bits that are shifted out on the left are put back in on the right
	* hand side.
	*
	* @param word The word to shift left.
	* @param bits The number of bits to shift by.
	* @return The rotated word.
	*/
	var rol = function(word, bits) {
		return word << bits & 65535 | (word & 65535) >> 16 - bits;
	};
	/**
	* Rotate a word right by given number of bits.
	*
	* Bits that are shifted out on the right are put back in on the left
	* hand side.
	*
	* @param word The word to shift right.
	* @param bits The number of bits to shift by.
	* @return The rotated word.
	*/
	var ror = function(word, bits) {
		return (word & 65535) >> bits | word << 16 - bits & 65535;
	};
	module.exports = forge.rc2 = forge.rc2 || {};
	/**
	* Perform RC2 key expansion as per RFC #2268, section 2.
	*
	* @param key variable-length user key (between 1 and 128 bytes)
	* @param effKeyBits number of effective key bits (default: 128)
	* @return the expanded RC2 key (ByteBuffer of 128 bytes)
	*/
	forge.rc2.expandKey = function(key, effKeyBits) {
		if (typeof key === "string") key = forge.util.createBuffer(key);
		effKeyBits = effKeyBits || 128;
		var L = key;
		var T = key.length();
		var T1 = effKeyBits;
		var T8 = Math.ceil(T1 / 8);
		var TM = 255 >> (T1 & 7);
		var i;
		for (i = T; i < 128; i++) L.putByte(piTable[L.at(i - 1) + L.at(i - T) & 255]);
		L.setAt(128 - T8, piTable[L.at(128 - T8) & TM]);
		for (i = 127 - T8; i >= 0; i--) L.setAt(i, piTable[L.at(i + 1) ^ L.at(i + T8)]);
		return L;
	};
	/**
	* Creates a RC2 cipher object.
	*
	* @param key the symmetric key to use (as base for key generation).
	* @param bits the number of effective key bits.
	* @param encrypt false for decryption, true for encryption.
	*
	* @return the cipher.
	*/
	var createCipher = function(key, bits, encrypt) {
		var _finish = false, _input = null, _output = null, _iv = null;
		var mixRound, mashRound;
		var i, j, K = [];
		key = forge.rc2.expandKey(key, bits);
		for (i = 0; i < 64; i++) K.push(key.getInt16Le());
		if (encrypt) {
			/**
			* Perform one mixing round "in place".
			*
			* @param R Array of four words to perform mixing on.
			*/
			mixRound = function(R) {
				for (i = 0; i < 4; i++) {
					R[i] += K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
					R[i] = rol(R[i], s[i]);
					j++;
				}
			};
			/**
			* Perform one mashing round "in place".
			*
			* @param R Array of four words to perform mashing on.
			*/
			mashRound = function(R) {
				for (i = 0; i < 4; i++) R[i] += K[R[(i + 3) % 4] & 63];
			};
		} else {
			/**
			* Perform one r-mixing round "in place".
			*
			* @param R Array of four words to perform mixing on.
			*/
			mixRound = function(R) {
				for (i = 3; i >= 0; i--) {
					R[i] = ror(R[i], s[i]);
					R[i] -= K[j] + (R[(i + 3) % 4] & R[(i + 2) % 4]) + (~R[(i + 3) % 4] & R[(i + 1) % 4]);
					j--;
				}
			};
			/**
			* Perform one r-mashing round "in place".
			*
			* @param R Array of four words to perform mashing on.
			*/
			mashRound = function(R) {
				for (i = 3; i >= 0; i--) R[i] -= K[R[(i + 3) % 4] & 63];
			};
		}
		/**
		* Run the specified cipher execution plan.
		*
		* This function takes four words from the input buffer, applies the IV on
		* it (if requested) and runs the provided execution plan.
		*
		* The plan must be put together in form of a array of arrays.  Where the
		* outer one is simply a list of steps to perform and the inner one needs
		* to have two elements: the first one telling how many rounds to perform,
		* the second one telling what to do (i.e. the function to call).
		*
		* @param {Array} plan The plan to execute.
		*/
		var runPlan = function(plan) {
			var R = [];
			for (i = 0; i < 4; i++) {
				var val = _input.getInt16Le();
				if (_iv !== null) if (encrypt) val ^= _iv.getInt16Le();
				else _iv.putInt16Le(val);
				R.push(val & 65535);
			}
			j = encrypt ? 0 : 63;
			for (var ptr = 0; ptr < plan.length; ptr++) for (var ctr = 0; ctr < plan[ptr][0]; ctr++) plan[ptr][1](R);
			for (i = 0; i < 4; i++) {
				if (_iv !== null) if (encrypt) _iv.putInt16Le(R[i]);
				else R[i] ^= _iv.getInt16Le();
				_output.putInt16Le(R[i]);
			}
		};
		var cipher = null;
		cipher = {
			/**
			* Starts or restarts the encryption or decryption process, whichever
			* was previously configured.
			*
			* To use the cipher in CBC mode, iv may be given either as a string
			* of bytes, or as a byte buffer.  For ECB mode, give null as iv.
			*
			* @param iv the initialization vector to use, null for ECB mode.
			* @param output the output the buffer to write to, null to create one.
			*/
			start: function(iv, output) {
				if (iv) {
					if (typeof iv === "string") iv = forge.util.createBuffer(iv);
				}
				_finish = false;
				_input = forge.util.createBuffer();
				_output = output || new forge.util.createBuffer();
				_iv = iv;
				cipher.output = _output;
			},
			/**
			* Updates the next block.
			*
			* @param input the buffer to read from.
			*/
			update: function(input) {
				if (!_finish) _input.putBuffer(input);
				while (_input.length() >= 8) runPlan([
					[5, mixRound],
					[1, mashRound],
					[6, mixRound],
					[1, mashRound],
					[5, mixRound]
				]);
			},
			/**
			* Finishes encrypting or decrypting.
			*
			* @param pad a padding function to use, null for PKCS#7 padding,
			*           signature(blockSize, buffer, decrypt).
			*
			* @return true if successful, false on error.
			*/
			finish: function(pad) {
				var rval = true;
				if (encrypt) if (pad) rval = pad(8, _input, !encrypt);
				else {
					var padding = _input.length() === 8 ? 8 : 8 - _input.length();
					_input.fillWithByte(padding, padding);
				}
				if (rval) {
					_finish = true;
					cipher.update();
				}
				if (!encrypt) {
					rval = _input.length() === 0;
					if (rval) if (pad) rval = pad(8, _output, !encrypt);
					else {
						var len = _output.length();
						var count = _output.at(len - 1);
						if (count > len) rval = false;
						else _output.truncate(count);
					}
				}
				return rval;
			}
		};
		return cipher;
	};
	/**
	* Creates an RC2 cipher object to encrypt data in ECB or CBC mode using the
	* given symmetric key. The output will be stored in the 'output' member
	* of the returned cipher.
	*
	* The key and iv may be given as a string of bytes or a byte buffer.
	* The cipher is initialized to use 128 effective key bits.
	*
	* @param key the symmetric key to use.
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	*
	* @return the cipher.
	*/
	forge.rc2.startEncrypting = function(key, iv, output) {
		var cipher = forge.rc2.createEncryptionCipher(key, 128);
		cipher.start(iv, output);
		return cipher;
	};
	/**
	* Creates an RC2 cipher object to encrypt data in ECB or CBC mode using the
	* given symmetric key.
	*
	* The key may be given as a string of bytes or a byte buffer.
	*
	* To start encrypting call start() on the cipher with an iv and optional
	* output buffer.
	*
	* @param key the symmetric key to use.
	*
	* @return the cipher.
	*/
	forge.rc2.createEncryptionCipher = function(key, bits) {
		return createCipher(key, bits, true);
	};
	/**
	* Creates an RC2 cipher object to decrypt data in ECB or CBC mode using the
	* given symmetric key. The output will be stored in the 'output' member
	* of the returned cipher.
	*
	* The key and iv may be given as a string of bytes or a byte buffer.
	* The cipher is initialized to use 128 effective key bits.
	*
	* @param key the symmetric key to use.
	* @param iv the initialization vector to use.
	* @param output the buffer to write to, null to create one.
	*
	* @return the cipher.
	*/
	forge.rc2.startDecrypting = function(key, iv, output) {
		var cipher = forge.rc2.createDecryptionCipher(key, 128);
		cipher.start(iv, output);
		return cipher;
	};
	/**
	* Creates an RC2 cipher object to decrypt data in ECB or CBC mode using the
	* given symmetric key.
	*
	* The key may be given as a string of bytes or a byte buffer.
	*
	* To start decrypting call start() on the cipher with an iv and optional
	* output buffer.
	*
	* @param key the symmetric key to use.
	*
	* @return the cipher.
	*/
	forge.rc2.createDecryptionCipher = function(key, bits) {
		return createCipher(key, bits, false);
	};
}));
//#endregion
//#region node_modules/node-forge/lib/jsbn.js
var require_jsbn = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var forge = require_forge();
	module.exports = forge.jsbn = forge.jsbn || {};
	var dbits;
	var j_lm = true;
	function BigInteger(a, b, c) {
		this.data = [];
		if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);
		else if (b == null && "string" != typeof a) this.fromString(a, 256);
		else this.fromString(a, b);
	}
	forge.jsbn.BigInteger = BigInteger;
	function nbi() {
		return new BigInteger(null);
	}
	function am1(i, x, w, j, c, n) {
		while (--n >= 0) {
			var v = x * this.data[i++] + w.data[j] + c;
			c = Math.floor(v / 67108864);
			w.data[j++] = v & 67108863;
		}
		return c;
	}
	function am2(i, x, w, j, c, n) {
		var xl = x & 32767, xh = x >> 15;
		while (--n >= 0) {
			var l = this.data[i] & 32767;
			var h = this.data[i++] >> 15;
			var m = xh * l + h * xl;
			l = xl * l + ((m & 32767) << 15) + w.data[j] + (c & 1073741823);
			c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
			w.data[j++] = l & 1073741823;
		}
		return c;
	}
	function am3(i, x, w, j, c, n) {
		var xl = x & 16383, xh = x >> 14;
		while (--n >= 0) {
			var l = this.data[i] & 16383;
			var h = this.data[i++] >> 14;
			var m = xh * l + h * xl;
			l = xl * l + ((m & 16383) << 14) + w.data[j] + c;
			c = (l >> 28) + (m >> 14) + xh * h;
			w.data[j++] = l & 268435455;
		}
		return c;
	}
	if (typeof navigator === "undefined") {
		BigInteger.prototype.am = am3;
		dbits = 28;
	} else if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
		BigInteger.prototype.am = am2;
		dbits = 30;
	} else if (j_lm && navigator.appName != "Netscape") {
		BigInteger.prototype.am = am1;
		dbits = 26;
	} else {
		BigInteger.prototype.am = am3;
		dbits = 28;
	}
	BigInteger.prototype.DB = dbits;
	BigInteger.prototype.DM = (1 << dbits) - 1;
	BigInteger.prototype.DV = 1 << dbits;
	var BI_FP = 52;
	BigInteger.prototype.FV = Math.pow(2, BI_FP);
	BigInteger.prototype.F1 = BI_FP - dbits;
	BigInteger.prototype.F2 = 2 * dbits - BI_FP;
	var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
	var BI_RC = new Array();
	var rr = "0".charCodeAt(0), vv;
	for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
	rr = "a".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	rr = "A".charCodeAt(0);
	for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
	function int2char(n) {
		return BI_RM.charAt(n);
	}
	function intAt(s, i) {
		var c = BI_RC[s.charCodeAt(i)];
		return c == null ? -1 : c;
	}
	function bnpCopyTo(r) {
		for (var i = this.t - 1; i >= 0; --i) r.data[i] = this.data[i];
		r.t = this.t;
		r.s = this.s;
	}
	function bnpFromInt(x) {
		this.t = 1;
		this.s = x < 0 ? -1 : 0;
		if (x > 0) this.data[0] = x;
		else if (x < -1) this.data[0] = x + this.DV;
		else this.t = 0;
	}
	function nbv(i) {
		var r = nbi();
		r.fromInt(i);
		return r;
	}
	function bnpFromString(s, b) {
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 256) k = 8;
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else {
			this.fromRadix(s, b);
			return;
		}
		this.t = 0;
		this.s = 0;
		var i = s.length, mi = false, sh = 0;
		while (--i >= 0) {
			var x = k == 8 ? s[i] & 255 : intAt(s, i);
			if (x < 0) {
				if (s.charAt(i) == "-") mi = true;
				continue;
			}
			mi = false;
			if (sh == 0) this.data[this.t++] = x;
			else if (sh + k > this.DB) {
				this.data[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
				this.data[this.t++] = x >> this.DB - sh;
			} else this.data[this.t - 1] |= x << sh;
			sh += k;
			if (sh >= this.DB) sh -= this.DB;
		}
		if (k == 8 && (s[0] & 128) != 0) {
			this.s = -1;
			if (sh > 0) this.data[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
		}
		this.clamp();
		if (mi) BigInteger.ZERO.subTo(this, this);
	}
	function bnpClamp() {
		var c = this.s & this.DM;
		while (this.t > 0 && this.data[this.t - 1] == c) --this.t;
	}
	function bnToString(b) {
		if (this.s < 0) return "-" + this.negate().toString(b);
		var k;
		if (b == 16) k = 4;
		else if (b == 8) k = 3;
		else if (b == 2) k = 1;
		else if (b == 32) k = 5;
		else if (b == 4) k = 2;
		else return this.toRadix(b);
		var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
		var p = this.DB - i * this.DB % k;
		if (i-- > 0) {
			if (p < this.DB && (d = this.data[i] >> p) > 0) {
				m = true;
				r = int2char(d);
			}
			while (i >= 0) {
				if (p < k) {
					d = (this.data[i] & (1 << p) - 1) << k - p;
					d |= this.data[--i] >> (p += this.DB - k);
				} else {
					d = this.data[i] >> (p -= k) & km;
					if (p <= 0) {
						p += this.DB;
						--i;
					}
				}
				if (d > 0) m = true;
				if (m) r += int2char(d);
			}
		}
		return m ? r : "0";
	}
	function bnNegate() {
		var r = nbi();
		BigInteger.ZERO.subTo(this, r);
		return r;
	}
	function bnAbs() {
		return this.s < 0 ? this.negate() : this;
	}
	function bnCompareTo(a) {
		var r = this.s - a.s;
		if (r != 0) return r;
		var i = this.t;
		r = i - a.t;
		if (r != 0) return this.s < 0 ? -r : r;
		while (--i >= 0) if ((r = this.data[i] - a.data[i]) != 0) return r;
		return 0;
	}
	function nbits(x) {
		var r = 1, t;
		if ((t = x >>> 16) != 0) {
			x = t;
			r += 16;
		}
		if ((t = x >> 8) != 0) {
			x = t;
			r += 8;
		}
		if ((t = x >> 4) != 0) {
			x = t;
			r += 4;
		}
		if ((t = x >> 2) != 0) {
			x = t;
			r += 2;
		}
		if ((t = x >> 1) != 0) {
			x = t;
			r += 1;
		}
		return r;
	}
	function bnBitLength() {
		if (this.t <= 0) return 0;
		return this.DB * (this.t - 1) + nbits(this.data[this.t - 1] ^ this.s & this.DM);
	}
	function bnpDLShiftTo(n, r) {
		var i;
		for (i = this.t - 1; i >= 0; --i) r.data[i + n] = this.data[i];
		for (i = n - 1; i >= 0; --i) r.data[i] = 0;
		r.t = this.t + n;
		r.s = this.s;
	}
	function bnpDRShiftTo(n, r) {
		for (var i = n; i < this.t; ++i) r.data[i - n] = this.data[i];
		r.t = Math.max(this.t - n, 0);
		r.s = this.s;
	}
	function bnpLShiftTo(n, r) {
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << cbs) - 1;
		var ds = Math.floor(n / this.DB), c = this.s << bs & this.DM, i;
		for (i = this.t - 1; i >= 0; --i) {
			r.data[i + ds + 1] = this.data[i] >> cbs | c;
			c = (this.data[i] & bm) << bs;
		}
		for (i = ds - 1; i >= 0; --i) r.data[i] = 0;
		r.data[ds] = c;
		r.t = this.t + ds + 1;
		r.s = this.s;
		r.clamp();
	}
	function bnpRShiftTo(n, r) {
		r.s = this.s;
		var ds = Math.floor(n / this.DB);
		if (ds >= this.t) {
			r.t = 0;
			return;
		}
		var bs = n % this.DB;
		var cbs = this.DB - bs;
		var bm = (1 << bs) - 1;
		r.data[0] = this.data[ds] >> bs;
		for (var i = ds + 1; i < this.t; ++i) {
			r.data[i - ds - 1] |= (this.data[i] & bm) << cbs;
			r.data[i - ds] = this.data[i] >> bs;
		}
		if (bs > 0) r.data[this.t - ds - 1] |= (this.s & bm) << cbs;
		r.t = this.t - ds;
		r.clamp();
	}
	function bnpSubTo(a, r) {
		var i = 0, c = 0, m = Math.min(a.t, this.t);
		while (i < m) {
			c += this.data[i] - a.data[i];
			r.data[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t) {
			c -= a.s;
			while (i < this.t) {
				c += this.data[i];
				r.data[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		} else {
			c += this.s;
			while (i < a.t) {
				c -= a.data[i];
				r.data[i++] = c & this.DM;
				c >>= this.DB;
			}
			c -= a.s;
		}
		r.s = c < 0 ? -1 : 0;
		if (c < -1) r.data[i++] = this.DV + c;
		else if (c > 0) r.data[i++] = c;
		r.t = i;
		r.clamp();
	}
	function bnpMultiplyTo(a, r) {
		var x = this.abs(), y = a.abs();
		var i = x.t;
		r.t = i + y.t;
		while (--i >= 0) r.data[i] = 0;
		for (i = 0; i < y.t; ++i) r.data[i + x.t] = x.am(0, y.data[i], r, i, 0, x.t);
		r.s = 0;
		r.clamp();
		if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
	}
	function bnpSquareTo(r) {
		var x = this.abs();
		var i = r.t = 2 * x.t;
		while (--i >= 0) r.data[i] = 0;
		for (i = 0; i < x.t - 1; ++i) {
			var c = x.am(i, x.data[i], r, 2 * i, 0, 1);
			if ((r.data[i + x.t] += x.am(i + 1, 2 * x.data[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
				r.data[i + x.t] -= x.DV;
				r.data[i + x.t + 1] = 1;
			}
		}
		if (r.t > 0) r.data[r.t - 1] += x.am(i, x.data[i], r, 2 * i, 0, 1);
		r.s = 0;
		r.clamp();
	}
	function bnpDivRemTo(m, q, r) {
		var pm = m.abs();
		if (pm.t <= 0) return;
		var pt = this.abs();
		if (pt.t < pm.t) {
			if (q != null) q.fromInt(0);
			if (r != null) this.copyTo(r);
			return;
		}
		if (r == null) r = nbi();
		var y = nbi(), ts = this.s, ms = m.s;
		var nsh = this.DB - nbits(pm.data[pm.t - 1]);
		if (nsh > 0) {
			pm.lShiftTo(nsh, y);
			pt.lShiftTo(nsh, r);
		} else {
			pm.copyTo(y);
			pt.copyTo(r);
		}
		var ys = y.t;
		var y0 = y.data[ys - 1];
		if (y0 == 0) return;
		var yt = y0 * (1 << this.F1) + (ys > 1 ? y.data[ys - 2] >> this.F2 : 0);
		var d1 = this.FV / yt, d2 = (1 << this.F1) / yt, e = 1 << this.F2;
		var i = r.t, j = i - ys, t = q == null ? nbi() : q;
		y.dlShiftTo(j, t);
		if (r.compareTo(t) >= 0) {
			r.data[r.t++] = 1;
			r.subTo(t, r);
		}
		BigInteger.ONE.dlShiftTo(ys, t);
		t.subTo(y, y);
		while (y.t < ys) y.data[y.t++] = 0;
		while (--j >= 0) {
			var qd = r.data[--i] == y0 ? this.DM : Math.floor(r.data[i] * d1 + (r.data[i - 1] + e) * d2);
			if ((r.data[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
				y.dlShiftTo(j, t);
				r.subTo(t, r);
				while (r.data[i] < --qd) r.subTo(t, r);
			}
		}
		if (q != null) {
			r.drShiftTo(ys, q);
			if (ts != ms) BigInteger.ZERO.subTo(q, q);
		}
		r.t = ys;
		r.clamp();
		if (nsh > 0) r.rShiftTo(nsh, r);
		if (ts < 0) BigInteger.ZERO.subTo(r, r);
	}
	function bnMod(a) {
		var r = nbi();
		this.abs().divRemTo(a, null, r);
		if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
		return r;
	}
	function Classic(m) {
		this.m = m;
	}
	function cConvert(x) {
		if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
		else return x;
	}
	function cRevert(x) {
		return x;
	}
	function cReduce(x) {
		x.divRemTo(this.m, null, x);
	}
	function cMulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}
	function cSqrTo(x, r) {
		x.squareTo(r);
		this.reduce(r);
	}
	Classic.prototype.convert = cConvert;
	Classic.prototype.revert = cRevert;
	Classic.prototype.reduce = cReduce;
	Classic.prototype.mulTo = cMulTo;
	Classic.prototype.sqrTo = cSqrTo;
	function bnpInvDigit() {
		if (this.t < 1) return 0;
		var x = this.data[0];
		if ((x & 1) == 0) return 0;
		var y = x & 3;
		y = y * (2 - (x & 15) * y) & 15;
		y = y * (2 - (x & 255) * y) & 255;
		y = y * (2 - ((x & 65535) * y & 65535)) & 65535;
		y = y * (2 - x * y % this.DV) % this.DV;
		return y > 0 ? this.DV - y : -y;
	}
	function Montgomery(m) {
		this.m = m;
		this.mp = m.invDigit();
		this.mpl = this.mp & 32767;
		this.mph = this.mp >> 15;
		this.um = (1 << m.DB - 15) - 1;
		this.mt2 = 2 * m.t;
	}
	function montConvert(x) {
		var r = nbi();
		x.abs().dlShiftTo(this.m.t, r);
		r.divRemTo(this.m, null, r);
		if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
		return r;
	}
	function montRevert(x) {
		var r = nbi();
		x.copyTo(r);
		this.reduce(r);
		return r;
	}
	function montReduce(x) {
		while (x.t <= this.mt2) x.data[x.t++] = 0;
		for (var i = 0; i < this.m.t; ++i) {
			var j = x.data[i] & 32767;
			var u0 = j * this.mpl + ((j * this.mph + (x.data[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
			j = i + this.m.t;
			x.data[j] += this.m.am(0, u0, x, i, 0, this.m.t);
			while (x.data[j] >= x.DV) {
				x.data[j] -= x.DV;
				x.data[++j]++;
			}
		}
		x.clamp();
		x.drShiftTo(this.m.t, x);
		if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}
	function montSqrTo(x, r) {
		x.squareTo(r);
		this.reduce(r);
	}
	function montMulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}
	Montgomery.prototype.convert = montConvert;
	Montgomery.prototype.revert = montRevert;
	Montgomery.prototype.reduce = montReduce;
	Montgomery.prototype.mulTo = montMulTo;
	Montgomery.prototype.sqrTo = montSqrTo;
	function bnpIsEven() {
		return (this.t > 0 ? this.data[0] & 1 : this.s) == 0;
	}
	function bnpExp(e, z) {
		if (e > 4294967295 || e < 1) return BigInteger.ONE;
		var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e) - 1;
		g.copyTo(r);
		while (--i >= 0) {
			z.sqrTo(r, r2);
			if ((e & 1 << i) > 0) z.mulTo(r2, g, r);
			else {
				var t = r;
				r = r2;
				r2 = t;
			}
		}
		return z.revert(r);
	}
	function bnModPowInt(e, m) {
		var z;
		if (e < 256 || m.isEven()) z = new Classic(m);
		else z = new Montgomery(m);
		return this.exp(e, z);
	}
	BigInteger.prototype.copyTo = bnpCopyTo;
	BigInteger.prototype.fromInt = bnpFromInt;
	BigInteger.prototype.fromString = bnpFromString;
	BigInteger.prototype.clamp = bnpClamp;
	BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
	BigInteger.prototype.drShiftTo = bnpDRShiftTo;
	BigInteger.prototype.lShiftTo = bnpLShiftTo;
	BigInteger.prototype.rShiftTo = bnpRShiftTo;
	BigInteger.prototype.subTo = bnpSubTo;
	BigInteger.prototype.multiplyTo = bnpMultiplyTo;
	BigInteger.prototype.squareTo = bnpSquareTo;
	BigInteger.prototype.divRemTo = bnpDivRemTo;
	BigInteger.prototype.invDigit = bnpInvDigit;
	BigInteger.prototype.isEven = bnpIsEven;
	BigInteger.prototype.exp = bnpExp;
	BigInteger.prototype.toString = bnToString;
	BigInteger.prototype.negate = bnNegate;
	BigInteger.prototype.abs = bnAbs;
	BigInteger.prototype.compareTo = bnCompareTo;
	BigInteger.prototype.bitLength = bnBitLength;
	BigInteger.prototype.mod = bnMod;
	BigInteger.prototype.modPowInt = bnModPowInt;
	BigInteger.ZERO = nbv(0);
	BigInteger.ONE = nbv(1);
	function bnClone() {
		var r = nbi();
		this.copyTo(r);
		return r;
	}
	function bnIntValue() {
		if (this.s < 0) {
			if (this.t == 1) return this.data[0] - this.DV;
			else if (this.t == 0) return -1;
		} else if (this.t == 1) return this.data[0];
		else if (this.t == 0) return 0;
		return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0];
	}
	function bnByteValue() {
		return this.t == 0 ? this.s : this.data[0] << 24 >> 24;
	}
	function bnShortValue() {
		return this.t == 0 ? this.s : this.data[0] << 16 >> 16;
	}
	function bnpChunkSize(r) {
		return Math.floor(Math.LN2 * this.DB / Math.log(r));
	}
	function bnSigNum() {
		if (this.s < 0) return -1;
		else if (this.t <= 0 || this.t == 1 && this.data[0] <= 0) return 0;
		else return 1;
	}
	function bnpToRadix(b) {
		if (b == null) b = 10;
		if (this.signum() == 0 || b < 2 || b > 36) return "0";
		var cs = this.chunkSize(b);
		var a = Math.pow(b, cs);
		var d = nbv(a), y = nbi(), z = nbi(), r = "";
		this.divRemTo(d, y, z);
		while (y.signum() > 0) {
			r = (a + z.intValue()).toString(b).substr(1) + r;
			y.divRemTo(d, y, z);
		}
		return z.intValue().toString(b) + r;
	}
	function bnpFromRadix(s, b) {
		this.fromInt(0);
		if (b == null) b = 10;
		var cs = this.chunkSize(b);
		var d = Math.pow(b, cs), mi = false, j = 0, w = 0;
		for (var i = 0; i < s.length; ++i) {
			var x = intAt(s, i);
			if (x < 0) {
				if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
				continue;
			}
			w = b * w + x;
			if (++j >= cs) {
				this.dMultiply(d);
				this.dAddOffset(w, 0);
				j = 0;
				w = 0;
			}
		}
		if (j > 0) {
			this.dMultiply(Math.pow(b, j));
			this.dAddOffset(w, 0);
		}
		if (mi) BigInteger.ZERO.subTo(this, this);
	}
	function bnpFromNumber(a, b, c) {
		if ("number" == typeof b) if (a < 2) this.fromInt(1);
		else {
			this.fromNumber(a, c);
			if (!this.testBit(a - 1)) this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
			if (this.isEven()) this.dAddOffset(1, 0);
			while (!this.isProbablePrime(b)) {
				this.dAddOffset(2, 0);
				if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
			}
		}
		else {
			var x = new Array(), t = a & 7;
			x.length = (a >> 3) + 1;
			b.nextBytes(x);
			if (t > 0) x[0] &= (1 << t) - 1;
			else x[0] = 0;
			this.fromString(x, 256);
		}
	}
	function bnToByteArray() {
		var i = this.t, r = new Array();
		r[0] = this.s;
		var p = this.DB - i * this.DB % 8, d, k = 0;
		if (i-- > 0) {
			if (p < this.DB && (d = this.data[i] >> p) != (this.s & this.DM) >> p) r[k++] = d | this.s << this.DB - p;
			while (i >= 0) {
				if (p < 8) {
					d = (this.data[i] & (1 << p) - 1) << 8 - p;
					d |= this.data[--i] >> (p += this.DB - 8);
				} else {
					d = this.data[i] >> (p -= 8) & 255;
					if (p <= 0) {
						p += this.DB;
						--i;
					}
				}
				if ((d & 128) != 0) d |= -256;
				if (k == 0 && (this.s & 128) != (d & 128)) ++k;
				if (k > 0 || d != this.s) r[k++] = d;
			}
		}
		return r;
	}
	function bnEquals(a) {
		return this.compareTo(a) == 0;
	}
	function bnMin(a) {
		return this.compareTo(a) < 0 ? this : a;
	}
	function bnMax(a) {
		return this.compareTo(a) > 0 ? this : a;
	}
	function bnpBitwiseTo(a, op, r) {
		var i, f, m = Math.min(a.t, this.t);
		for (i = 0; i < m; ++i) r.data[i] = op(this.data[i], a.data[i]);
		if (a.t < this.t) {
			f = a.s & this.DM;
			for (i = m; i < this.t; ++i) r.data[i] = op(this.data[i], f);
			r.t = this.t;
		} else {
			f = this.s & this.DM;
			for (i = m; i < a.t; ++i) r.data[i] = op(f, a.data[i]);
			r.t = a.t;
		}
		r.s = op(this.s, a.s);
		r.clamp();
	}
	function op_and(x, y) {
		return x & y;
	}
	function bnAnd(a) {
		var r = nbi();
		this.bitwiseTo(a, op_and, r);
		return r;
	}
	function op_or(x, y) {
		return x | y;
	}
	function bnOr(a) {
		var r = nbi();
		this.bitwiseTo(a, op_or, r);
		return r;
	}
	function op_xor(x, y) {
		return x ^ y;
	}
	function bnXor(a) {
		var r = nbi();
		this.bitwiseTo(a, op_xor, r);
		return r;
	}
	function op_andnot(x, y) {
		return x & ~y;
	}
	function bnAndNot(a) {
		var r = nbi();
		this.bitwiseTo(a, op_andnot, r);
		return r;
	}
	function bnNot() {
		var r = nbi();
		for (var i = 0; i < this.t; ++i) r.data[i] = this.DM & ~this.data[i];
		r.t = this.t;
		r.s = ~this.s;
		return r;
	}
	function bnShiftLeft(n) {
		var r = nbi();
		if (n < 0) this.rShiftTo(-n, r);
		else this.lShiftTo(n, r);
		return r;
	}
	function bnShiftRight(n) {
		var r = nbi();
		if (n < 0) this.lShiftTo(-n, r);
		else this.rShiftTo(n, r);
		return r;
	}
	function lbit(x) {
		if (x == 0) return -1;
		var r = 0;
		if ((x & 65535) == 0) {
			x >>= 16;
			r += 16;
		}
		if ((x & 255) == 0) {
			x >>= 8;
			r += 8;
		}
		if ((x & 15) == 0) {
			x >>= 4;
			r += 4;
		}
		if ((x & 3) == 0) {
			x >>= 2;
			r += 2;
		}
		if ((x & 1) == 0) ++r;
		return r;
	}
	function bnGetLowestSetBit() {
		for (var i = 0; i < this.t; ++i) if (this.data[i] != 0) return i * this.DB + lbit(this.data[i]);
		if (this.s < 0) return this.t * this.DB;
		return -1;
	}
	function cbit(x) {
		var r = 0;
		while (x != 0) {
			x &= x - 1;
			++r;
		}
		return r;
	}
	function bnBitCount() {
		var r = 0, x = this.s & this.DM;
		for (var i = 0; i < this.t; ++i) r += cbit(this.data[i] ^ x);
		return r;
	}
	function bnTestBit(n) {
		var j = Math.floor(n / this.DB);
		if (j >= this.t) return this.s != 0;
		return (this.data[j] & 1 << n % this.DB) != 0;
	}
	function bnpChangeBit(n, op) {
		var r = BigInteger.ONE.shiftLeft(n);
		this.bitwiseTo(r, op, r);
		return r;
	}
	function bnSetBit(n) {
		return this.changeBit(n, op_or);
	}
	function bnClearBit(n) {
		return this.changeBit(n, op_andnot);
	}
	function bnFlipBit(n) {
		return this.changeBit(n, op_xor);
	}
	function bnpAddTo(a, r) {
		var i = 0, c = 0, m = Math.min(a.t, this.t);
		while (i < m) {
			c += this.data[i] + a.data[i];
			r.data[i++] = c & this.DM;
			c >>= this.DB;
		}
		if (a.t < this.t) {
			c += a.s;
			while (i < this.t) {
				c += this.data[i];
				r.data[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += this.s;
		} else {
			c += this.s;
			while (i < a.t) {
				c += a.data[i];
				r.data[i++] = c & this.DM;
				c >>= this.DB;
			}
			c += a.s;
		}
		r.s = c < 0 ? -1 : 0;
		if (c > 0) r.data[i++] = c;
		else if (c < -1) r.data[i++] = this.DV + c;
		r.t = i;
		r.clamp();
	}
	function bnAdd(a) {
		var r = nbi();
		this.addTo(a, r);
		return r;
	}
	function bnSubtract(a) {
		var r = nbi();
		this.subTo(a, r);
		return r;
	}
	function bnMultiply(a) {
		var r = nbi();
		this.multiplyTo(a, r);
		return r;
	}
	function bnSquare() {
		var r = nbi();
		this.squareTo(r);
		return r;
	}
	function bnDivide(a) {
		var r = nbi();
		this.divRemTo(a, r, null);
		return r;
	}
	function bnRemainder(a) {
		var r = nbi();
		this.divRemTo(a, null, r);
		return r;
	}
	function bnDivideAndRemainder(a) {
		var q = nbi(), r = nbi();
		this.divRemTo(a, q, r);
		return new Array(q, r);
	}
	function bnpDMultiply(n) {
		this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
		++this.t;
		this.clamp();
	}
	function bnpDAddOffset(n, w) {
		if (n == 0) return;
		while (this.t <= w) this.data[this.t++] = 0;
		this.data[w] += n;
		while (this.data[w] >= this.DV) {
			this.data[w] -= this.DV;
			if (++w >= this.t) this.data[this.t++] = 0;
			++this.data[w];
		}
	}
	function NullExp() {}
	function nNop(x) {
		return x;
	}
	function nMulTo(x, y, r) {
		x.multiplyTo(y, r);
	}
	function nSqrTo(x, r) {
		x.squareTo(r);
	}
	NullExp.prototype.convert = nNop;
	NullExp.prototype.revert = nNop;
	NullExp.prototype.mulTo = nMulTo;
	NullExp.prototype.sqrTo = nSqrTo;
	function bnPow(e) {
		return this.exp(e, new NullExp());
	}
	function bnpMultiplyLowerTo(a, n, r) {
		var i = Math.min(this.t + a.t, n);
		r.s = 0;
		r.t = i;
		while (i > 0) r.data[--i] = 0;
		var j;
		for (j = r.t - this.t; i < j; ++i) r.data[i + this.t] = this.am(0, a.data[i], r, i, 0, this.t);
		for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a.data[i], r, i, 0, n - i);
		r.clamp();
	}
	function bnpMultiplyUpperTo(a, n, r) {
		--n;
		var i = r.t = this.t + a.t - n;
		r.s = 0;
		while (--i >= 0) r.data[i] = 0;
		for (i = Math.max(n - this.t, 0); i < a.t; ++i) r.data[this.t + i - n] = this.am(n - i, a.data[i], r, 0, 0, this.t + i - n);
		r.clamp();
		r.drShiftTo(1, r);
	}
	function Barrett(m) {
		this.r2 = nbi();
		this.q3 = nbi();
		BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
		this.mu = this.r2.divide(m);
		this.m = m;
	}
	function barrettConvert(x) {
		if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);
		else if (x.compareTo(this.m) < 0) return x;
		else {
			var r = nbi();
			x.copyTo(r);
			this.reduce(r);
			return r;
		}
	}
	function barrettRevert(x) {
		return x;
	}
	function barrettReduce(x) {
		x.drShiftTo(this.m.t - 1, this.r2);
		if (x.t > this.m.t + 1) {
			x.t = this.m.t + 1;
			x.clamp();
		}
		this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
		this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
		while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);
		x.subTo(this.r2, x);
		while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
	}
	function barrettSqrTo(x, r) {
		x.squareTo(r);
		this.reduce(r);
	}
	function barrettMulTo(x, y, r) {
		x.multiplyTo(y, r);
		this.reduce(r);
	}
	Barrett.prototype.convert = barrettConvert;
	Barrett.prototype.revert = barrettRevert;
	Barrett.prototype.reduce = barrettReduce;
	Barrett.prototype.mulTo = barrettMulTo;
	Barrett.prototype.sqrTo = barrettSqrTo;
	function bnModPow(e, m) {
		var i = e.bitLength(), k, r = nbv(1), z;
		if (i <= 0) return r;
		else if (i < 18) k = 1;
		else if (i < 48) k = 3;
		else if (i < 144) k = 4;
		else if (i < 768) k = 5;
		else k = 6;
		if (i < 8) z = new Classic(m);
		else if (m.isEven()) z = new Barrett(m);
		else z = new Montgomery(m);
		var g = new Array(), n = 3, k1 = k - 1, km = (1 << k) - 1;
		g[1] = z.convert(this);
		if (k > 1) {
			var g2 = nbi();
			z.sqrTo(g[1], g2);
			while (n <= km) {
				g[n] = nbi();
				z.mulTo(g2, g[n - 2], g[n]);
				n += 2;
			}
		}
		var j = e.t - 1, w, is1 = true, r2 = nbi(), t;
		i = nbits(e.data[j]) - 1;
		while (j >= 0) {
			if (i >= k1) w = e.data[j] >> i - k1 & km;
			else {
				w = (e.data[j] & (1 << i + 1) - 1) << k1 - i;
				if (j > 0) w |= e.data[j - 1] >> this.DB + i - k1;
			}
			n = k;
			while ((w & 1) == 0) {
				w >>= 1;
				--n;
			}
			if ((i -= n) < 0) {
				i += this.DB;
				--j;
			}
			if (is1) {
				g[w].copyTo(r);
				is1 = false;
			} else {
				while (n > 1) {
					z.sqrTo(r, r2);
					z.sqrTo(r2, r);
					n -= 2;
				}
				if (n > 0) z.sqrTo(r, r2);
				else {
					t = r;
					r = r2;
					r2 = t;
				}
				z.mulTo(r2, g[w], r);
			}
			while (j >= 0 && (e.data[j] & 1 << i) == 0) {
				z.sqrTo(r, r2);
				t = r;
				r = r2;
				r2 = t;
				if (--i < 0) {
					i = this.DB - 1;
					--j;
				}
			}
		}
		return z.revert(r);
	}
	function bnGCD(a) {
		var x = this.s < 0 ? this.negate() : this.clone();
		var y = a.s < 0 ? a.negate() : a.clone();
		if (x.compareTo(y) < 0) {
			var t = x;
			x = y;
			y = t;
		}
		var i = x.getLowestSetBit(), g = y.getLowestSetBit();
		if (g < 0) return x;
		if (i < g) g = i;
		if (g > 0) {
			x.rShiftTo(g, x);
			y.rShiftTo(g, y);
		}
		while (x.signum() > 0) {
			if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
			if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
			if (x.compareTo(y) >= 0) {
				x.subTo(y, x);
				x.rShiftTo(1, x);
			} else {
				y.subTo(x, y);
				y.rShiftTo(1, y);
			}
		}
		if (g > 0) y.lShiftTo(g, y);
		return y;
	}
	function bnpModInt(n) {
		if (n <= 0) return 0;
		var d = this.DV % n, r = this.s < 0 ? n - 1 : 0;
		if (this.t > 0) if (d == 0) r = this.data[0] % n;
		else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this.data[i]) % n;
		return r;
	}
	function bnModInverse(m) {
		if (this.signum() == 0) return BigInteger.ZERO;
		var ac = m.isEven();
		if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
		var u = m.clone(), v = this.clone();
		var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
		while (u.signum() != 0) {
			while (u.isEven()) {
				u.rShiftTo(1, u);
				if (ac) {
					if (!a.isEven() || !b.isEven()) {
						a.addTo(this, a);
						b.subTo(m, b);
					}
					a.rShiftTo(1, a);
				} else if (!b.isEven()) b.subTo(m, b);
				b.rShiftTo(1, b);
			}
			while (v.isEven()) {
				v.rShiftTo(1, v);
				if (ac) {
					if (!c.isEven() || !d.isEven()) {
						c.addTo(this, c);
						d.subTo(m, d);
					}
					c.rShiftTo(1, c);
				} else if (!d.isEven()) d.subTo(m, d);
				d.rShiftTo(1, d);
			}
			if (u.compareTo(v) >= 0) {
				u.subTo(v, u);
				if (ac) a.subTo(c, a);
				b.subTo(d, b);
			} else {
				v.subTo(u, v);
				if (ac) c.subTo(a, c);
				d.subTo(b, d);
			}
		}
		if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
		if (d.compareTo(m) >= 0) return d.subtract(m);
		if (d.signum() < 0) d.addTo(m, d);
		else return d;
		if (d.signum() < 0) return d.add(m);
		else return d;
	}
	var lowprimes = [
		2,
		3,
		5,
		7,
		11,
		13,
		17,
		19,
		23,
		29,
		31,
		37,
		41,
		43,
		47,
		53,
		59,
		61,
		67,
		71,
		73,
		79,
		83,
		89,
		97,
		101,
		103,
		107,
		109,
		113,
		127,
		131,
		137,
		139,
		149,
		151,
		157,
		163,
		167,
		173,
		179,
		181,
		191,
		193,
		197,
		199,
		211,
		223,
		227,
		229,
		233,
		239,
		241,
		251,
		257,
		263,
		269,
		271,
		277,
		281,
		283,
		293,
		307,
		311,
		313,
		317,
		331,
		337,
		347,
		349,
		353,
		359,
		367,
		373,
		379,
		383,
		389,
		397,
		401,
		409,
		419,
		421,
		431,
		433,
		439,
		443,
		449,
		457,
		461,
		463,
		467,
		479,
		487,
		491,
		499,
		503,
		509,
		521,
		523,
		541,
		547,
		557,
		563,
		569,
		571,
		577,
		587,
		593,
		599,
		601,
		607,
		613,
		617,
		619,
		631,
		641,
		643,
		647,
		653,
		659,
		661,
		673,
		677,
		683,
		691,
		701,
		709,
		719,
		727,
		733,
		739,
		743,
		751,
		757,
		761,
		769,
		773,
		787,
		797,
		809,
		811,
		821,
		823,
		827,
		829,
		839,
		853,
		857,
		859,
		863,
		877,
		881,
		883,
		887,
		907,
		911,
		919,
		929,
		937,
		941,
		947,
		953,
		967,
		971,
		977,
		983,
		991,
		997
	];
	var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
	function bnIsProbablePrime(t) {
		var i, x = this.abs();
		if (x.t == 1 && x.data[0] <= lowprimes[lowprimes.length - 1]) {
			for (i = 0; i < lowprimes.length; ++i) if (x.data[0] == lowprimes[i]) return true;
			return false;
		}
		if (x.isEven()) return false;
		i = 1;
		while (i < lowprimes.length) {
			var m = lowprimes[i], j = i + 1;
			while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
			m = x.modInt(m);
			while (i < j) if (m % lowprimes[i++] == 0) return false;
		}
		return x.millerRabin(t);
	}
	function bnpMillerRabin(t) {
		var n1 = this.subtract(BigInteger.ONE);
		var k = n1.getLowestSetBit();
		if (k <= 0) return false;
		var r = n1.shiftRight(k);
		var prng = bnGetPrng();
		var a;
		for (var i = 0; i < t; ++i) {
			do
				a = new BigInteger(this.bitLength(), prng);
			while (a.compareTo(BigInteger.ONE) <= 0 || a.compareTo(n1) >= 0);
			var y = a.modPow(r, this);
			if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
				var j = 1;
				while (j++ < k && y.compareTo(n1) != 0) {
					y = y.modPowInt(2, this);
					if (y.compareTo(BigInteger.ONE) == 0) return false;
				}
				if (y.compareTo(n1) != 0) return false;
			}
		}
		return true;
	}
	function bnGetPrng() {
		return { nextBytes: function(x) {
			for (var i = 0; i < x.length; ++i) x[i] = Math.floor(Math.random() * 256);
		} };
	}
	BigInteger.prototype.chunkSize = bnpChunkSize;
	BigInteger.prototype.toRadix = bnpToRadix;
	BigInteger.prototype.fromRadix = bnpFromRadix;
	BigInteger.prototype.fromNumber = bnpFromNumber;
	BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
	BigInteger.prototype.changeBit = bnpChangeBit;
	BigInteger.prototype.addTo = bnpAddTo;
	BigInteger.prototype.dMultiply = bnpDMultiply;
	BigInteger.prototype.dAddOffset = bnpDAddOffset;
	BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
	BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
	BigInteger.prototype.modInt = bnpModInt;
	BigInteger.prototype.millerRabin = bnpMillerRabin;
	BigInteger.prototype.clone = bnClone;
	BigInteger.prototype.intValue = bnIntValue;
	BigInteger.prototype.byteValue = bnByteValue;
	BigInteger.prototype.shortValue = bnShortValue;
	BigInteger.prototype.signum = bnSigNum;
	BigInteger.prototype.toByteArray = bnToByteArray;
	BigInteger.prototype.equals = bnEquals;
	BigInteger.prototype.min = bnMin;
	BigInteger.prototype.max = bnMax;
	BigInteger.prototype.and = bnAnd;
	BigInteger.prototype.or = bnOr;
	BigInteger.prototype.xor = bnXor;
	BigInteger.prototype.andNot = bnAndNot;
	BigInteger.prototype.not = bnNot;
	BigInteger.prototype.shiftLeft = bnShiftLeft;
	BigInteger.prototype.shiftRight = bnShiftRight;
	BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
	BigInteger.prototype.bitCount = bnBitCount;
	BigInteger.prototype.testBit = bnTestBit;
	BigInteger.prototype.setBit = bnSetBit;
	BigInteger.prototype.clearBit = bnClearBit;
	BigInteger.prototype.flipBit = bnFlipBit;
	BigInteger.prototype.add = bnAdd;
	BigInteger.prototype.subtract = bnSubtract;
	BigInteger.prototype.multiply = bnMultiply;
	BigInteger.prototype.divide = bnDivide;
	BigInteger.prototype.remainder = bnRemainder;
	BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
	BigInteger.prototype.modPow = bnModPow;
	BigInteger.prototype.modInverse = bnModInverse;
	BigInteger.prototype.pow = bnPow;
	BigInteger.prototype.gcd = bnGCD;
	BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
	BigInteger.prototype.square = bnSquare;
}));
//#endregion
//#region node_modules/node-forge/lib/sha1.js
var require_sha1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Secure Hash Algorithm with 160-bit digest (SHA-1) implementation.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2015 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_md();
	require_util();
	var sha1 = module.exports = forge.sha1 = forge.sha1 || {};
	forge.md.sha1 = forge.md.algorithms.sha1 = sha1;
	/**
	* Creates a SHA-1 message digest object.
	*
	* @return a message digest object.
	*/
	sha1.create = function() {
		if (!_initialized) _init();
		var _state = null;
		var _input = forge.util.createBuffer();
		var _w = new Array(80);
		var md = {
			algorithm: "sha1",
			blockLength: 64,
			digestLength: 20,
			messageLength: 0,
			fullMessageLength: null,
			messageLengthSize: 8
		};
		/**
		* Starts the digest.
		*
		* @return this digest object.
		*/
		md.start = function() {
			md.messageLength = 0;
			md.fullMessageLength = md.messageLength64 = [];
			var int32s = md.messageLengthSize / 4;
			for (var i = 0; i < int32s; ++i) md.fullMessageLength.push(0);
			_input = forge.util.createBuffer();
			_state = {
				h0: 1732584193,
				h1: 4023233417,
				h2: 2562383102,
				h3: 271733878,
				h4: 3285377520
			};
			return md;
		};
		md.start();
		/**
		* Updates the digest with the given message input. The given input can
		* treated as raw input (no encoding will be applied) or an encoding of
		* 'utf8' maybe given to encode the input using UTF-8.
		*
		* @param msg the message input to update with.
		* @param encoding the encoding to use (default: 'raw', other: 'utf8').
		*
		* @return this digest object.
		*/
		md.update = function(msg, encoding) {
			if (encoding === "utf8") msg = forge.util.encodeUtf8(msg);
			var len = msg.length;
			md.messageLength += len;
			len = [len / 4294967296 >>> 0, len >>> 0];
			for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
				md.fullMessageLength[i] += len[1];
				len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
				md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
				len[0] = len[1] / 4294967296 >>> 0;
			}
			_input.putBytes(msg);
			_update(_state, _w, _input);
			if (_input.read > 2048 || _input.length() === 0) _input.compact();
			return md;
		};
		/**
		* Produces the digest.
		*
		* @return a byte buffer containing the digest value.
		*/
		md.digest = function() {
			var finalBlock = forge.util.createBuffer();
			finalBlock.putBytes(_input.bytes());
			var overflow = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize & md.blockLength - 1;
			finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
			var next, carry;
			var bits = md.fullMessageLength[0] * 8;
			for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
				next = md.fullMessageLength[i + 1] * 8;
				carry = next / 4294967296 >>> 0;
				bits += carry;
				finalBlock.putInt32(bits >>> 0);
				bits = next >>> 0;
			}
			finalBlock.putInt32(bits);
			var s2 = {
				h0: _state.h0,
				h1: _state.h1,
				h2: _state.h2,
				h3: _state.h3,
				h4: _state.h4
			};
			_update(s2, _w, finalBlock);
			var rval = forge.util.createBuffer();
			rval.putInt32(s2.h0);
			rval.putInt32(s2.h1);
			rval.putInt32(s2.h2);
			rval.putInt32(s2.h3);
			rval.putInt32(s2.h4);
			return rval;
		};
		return md;
	};
	var _padding = null;
	var _initialized = false;
	/**
	* Initializes the constant tables.
	*/
	function _init() {
		_padding = String.fromCharCode(128);
		_padding += forge.util.fillString(String.fromCharCode(0), 64);
		_initialized = true;
	}
	/**
	* Updates a SHA-1 state with the given byte buffer.
	*
	* @param s the SHA-1 state to update.
	* @param w the array to use to store words.
	* @param bytes the byte buffer to update with.
	*/
	function _update(s, w, bytes) {
		var t, a, b, c, d, e, f, i;
		var len = bytes.length();
		while (len >= 64) {
			a = s.h0;
			b = s.h1;
			c = s.h2;
			d = s.h3;
			e = s.h4;
			for (i = 0; i < 16; ++i) {
				t = bytes.getInt32();
				w[i] = t;
				f = d ^ b & (c ^ d);
				t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			for (; i < 20; ++i) {
				t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
				t = t << 1 | t >>> 31;
				w[i] = t;
				f = d ^ b & (c ^ d);
				t = (a << 5 | a >>> 27) + f + e + 1518500249 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			for (; i < 32; ++i) {
				t = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
				t = t << 1 | t >>> 31;
				w[i] = t;
				f = b ^ c ^ d;
				t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			for (; i < 40; ++i) {
				t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
				t = t << 2 | t >>> 30;
				w[i] = t;
				f = b ^ c ^ d;
				t = (a << 5 | a >>> 27) + f + e + 1859775393 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			for (; i < 60; ++i) {
				t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
				t = t << 2 | t >>> 30;
				w[i] = t;
				f = b & c | d & (b ^ c);
				t = (a << 5 | a >>> 27) + f + e + 2400959708 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			for (; i < 80; ++i) {
				t = w[i - 6] ^ w[i - 16] ^ w[i - 28] ^ w[i - 32];
				t = t << 2 | t >>> 30;
				w[i] = t;
				f = b ^ c ^ d;
				t = (a << 5 | a >>> 27) + f + e + 3395469782 + t;
				e = d;
				d = c;
				c = (b << 30 | b >>> 2) >>> 0;
				b = a;
				a = t;
			}
			s.h0 = s.h0 + a | 0;
			s.h1 = s.h1 + b | 0;
			s.h2 = s.h2 + c | 0;
			s.h3 = s.h3 + d | 0;
			s.h4 = s.h4 + e | 0;
			len -= 64;
		}
	}
}));
//#endregion
//#region node_modules/node-forge/lib/pkcs1.js
var require_pkcs1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Partial implementation of PKCS#1 v2.2: RSA-OEAP
	*
	* Modified but based on the following MIT and BSD licensed code:
	*
	* https://github.com/kjur/jsjws/blob/master/rsa.js:
	*
	* The 'jsjws'(JSON Web Signature JavaScript Library) License
	*
	* Copyright (c) 2012 Kenji Urushima
	*
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	*
	* The above copyright notice and this permission notice shall be included in
	* all copies or substantial portions of the Software.
	*
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	* THE SOFTWARE.
	*
	* http://webrsa.cvs.sourceforge.net/viewvc/webrsa/Client/RSAES-OAEP.js?content-type=text%2Fplain:
	*
	* RSAES-OAEP.js
	* $Id: RSAES-OAEP.js,v 1.1.1.1 2003/03/19 15:37:20 ellispritchard Exp $
	* JavaScript Implementation of PKCS #1 v2.1 RSA CRYPTOGRAPHY STANDARD (RSA Laboratories, June 14, 2002)
	* Copyright (C) Ellis Pritchard, Guardian Unlimited 2003.
	* Contact: ellis@nukinetics.com
	* Distributed under the BSD License.
	*
	* Official documentation: http://www.rsa.com/rsalabs/node.asp?id=2125
	*
	* @author Evan Jones (http://evanjones.ca/)
	* @author Dave Longley
	*
	* Copyright (c) 2013-2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	require_random();
	require_sha1();
	var pkcs1 = module.exports = forge.pkcs1 = forge.pkcs1 || {};
	/**
	* Encode the given RSAES-OAEP message (M) using key, with optional label (L)
	* and seed.
	*
	* This method does not perform RSA encryption, it only encodes the message
	* using RSAES-OAEP.
	*
	* @param key the RSA key to use.
	* @param message the message to encode.
	* @param options the options to use:
	*          label an optional label to use.
	*          seed the seed to use.
	*          md the message digest object to use, undefined for SHA-1.
	*          mgf1 optional mgf1 parameters:
	*            md the message digest object to use for MGF1.
	*
	* @return the encoded message bytes.
	*/
	pkcs1.encode_rsa_oaep = function(key, message, options) {
		var label;
		var seed;
		var md;
		var mgf1Md;
		if (typeof options === "string") {
			label = options;
			seed = arguments[3] || void 0;
			md = arguments[4] || void 0;
		} else if (options) {
			label = options.label || void 0;
			seed = options.seed || void 0;
			md = options.md || void 0;
			if (options.mgf1 && options.mgf1.md) mgf1Md = options.mgf1.md;
		}
		if (!md) md = forge.md.sha1.create();
		else md.start();
		if (!mgf1Md) mgf1Md = md;
		var keyLength = Math.ceil(key.n.bitLength() / 8);
		var maxLength = keyLength - 2 * md.digestLength - 2;
		if (message.length > maxLength) {
			var error = /* @__PURE__ */ new Error("RSAES-OAEP input message length is too long.");
			error.length = message.length;
			error.maxLength = maxLength;
			throw error;
		}
		if (!label) label = "";
		md.update(label, "raw");
		var lHash = md.digest();
		var PS = "";
		var PS_length = maxLength - message.length;
		for (var i = 0; i < PS_length; i++) PS += "\0";
		var DB = lHash.getBytes() + PS + "" + message;
		if (!seed) seed = forge.random.getBytes(md.digestLength);
		else if (seed.length !== md.digestLength) {
			var error = /* @__PURE__ */ new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.");
			error.seedLength = seed.length;
			error.digestLength = md.digestLength;
			throw error;
		}
		var dbMask = rsa_mgf1(seed, keyLength - md.digestLength - 1, mgf1Md);
		var maskedDB = forge.util.xorBytes(DB, dbMask, DB.length);
		var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
		return "\0" + forge.util.xorBytes(seed, seedMask, seed.length) + maskedDB;
	};
	/**
	* Decode the given RSAES-OAEP encoded message (EM) using key, with optional
	* label (L).
	*
	* This method does not perform RSA decryption, it only decodes the message
	* using RSAES-OAEP.
	*
	* @param key the RSA key to use.
	* @param em the encoded message to decode.
	* @param options the options to use:
	*          label an optional label to use.
	*          md the message digest object to use for OAEP, undefined for SHA-1.
	*          mgf1 optional mgf1 parameters:
	*            md the message digest object to use for MGF1.
	*
	* @return the decoded message bytes.
	*/
	pkcs1.decode_rsa_oaep = function(key, em, options) {
		var label;
		var md;
		var mgf1Md;
		if (typeof options === "string") {
			label = options;
			md = arguments[3] || void 0;
		} else if (options) {
			label = options.label || void 0;
			md = options.md || void 0;
			if (options.mgf1 && options.mgf1.md) mgf1Md = options.mgf1.md;
		}
		var keyLength = Math.ceil(key.n.bitLength() / 8);
		if (em.length !== keyLength) {
			var error = /* @__PURE__ */ new Error("RSAES-OAEP encoded message length is invalid.");
			error.length = em.length;
			error.expectedLength = keyLength;
			throw error;
		}
		if (md === void 0) md = forge.md.sha1.create();
		else md.start();
		if (!mgf1Md) mgf1Md = md;
		if (keyLength < 2 * md.digestLength + 2) throw new Error("RSAES-OAEP key is too short for the hash function.");
		if (!label) label = "";
		md.update(label, "raw");
		var lHash = md.digest().getBytes();
		var y = em.charAt(0);
		var maskedSeed = em.substring(1, md.digestLength + 1);
		var maskedDB = em.substring(1 + md.digestLength);
		var seedMask = rsa_mgf1(maskedDB, md.digestLength, mgf1Md);
		var dbMask = rsa_mgf1(forge.util.xorBytes(maskedSeed, seedMask, maskedSeed.length), keyLength - md.digestLength - 1, mgf1Md);
		var db = forge.util.xorBytes(maskedDB, dbMask, maskedDB.length);
		var lHashPrime = db.substring(0, md.digestLength);
		var error = y !== "\0";
		for (var i = 0; i < md.digestLength; ++i) error |= lHash.charAt(i) !== lHashPrime.charAt(i);
		var in_ps = 1;
		var index = md.digestLength;
		for (var j = md.digestLength; j < db.length; j++) {
			var code = db.charCodeAt(j);
			var is_0 = code & 1 ^ 1;
			error |= code & (in_ps ? 65534 : 0);
			in_ps = in_ps & is_0;
			index += in_ps;
		}
		if (error || db.charCodeAt(index) !== 1) throw new Error("Invalid RSAES-OAEP padding.");
		return db.substring(index + 1);
	};
	function rsa_mgf1(seed, maskLength, hash) {
		if (!hash) hash = forge.md.sha1.create();
		var t = "";
		var count = Math.ceil(maskLength / hash.digestLength);
		for (var i = 0; i < count; ++i) {
			var c = String.fromCharCode(i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255);
			hash.start();
			hash.update(seed + c);
			t += hash.digest().getBytes();
		}
		return t.substring(0, maskLength);
	}
}));
//#endregion
//#region node_modules/node-forge/lib/prime.js
var require_prime = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Prime number generation API.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	require_jsbn();
	require_random();
	(function() {
		if (forge.prime) {
			module.exports = forge.prime;
			return;
		}
		var prime = module.exports = forge.prime = forge.prime || {};
		var BigInteger = forge.jsbn.BigInteger;
		var GCD_30_DELTA = [
			6,
			4,
			2,
			4,
			2,
			4,
			6,
			2
		];
		var THIRTY = new BigInteger(null);
		THIRTY.fromInt(30);
		var op_or = function(x, y) {
			return x | y;
		};
		/**
		* Generates a random probable prime with the given number of bits.
		*
		* Alternative algorithms can be specified by name as a string or as an
		* object with custom options like so:
		*
		* {
		*   name: 'PRIMEINC',
		*   options: {
		*     maxBlockTime: <the maximum amount of time to block the main
		*       thread before allowing I/O other JS to run>,
		*     millerRabinTests: <the number of miller-rabin tests to run>,
		*     workerScript: <the worker script URL>,
		*     workers: <the number of web workers (if supported) to use,
		*       -1 to use estimated cores minus one>.
		*     workLoad: the size of the work load, ie: number of possible prime
		*       numbers for each web worker to check per work assignment,
		*       (default: 100).
		*   }
		* }
		*
		* @param bits the number of bits for the prime number.
		* @param options the options to use.
		*          [algorithm] the algorithm to use (default: 'PRIMEINC').
		*          [prng] a custom crypto-secure pseudo-random number generator to use,
		*            that must define "getBytesSync".
		*
		* @return callback(err, num) called once the operation completes.
		*/
		prime.generateProbablePrime = function(bits, options, callback) {
			if (typeof options === "function") {
				callback = options;
				options = {};
			}
			options = options || {};
			var algorithm = options.algorithm || "PRIMEINC";
			if (typeof algorithm === "string") algorithm = { name: algorithm };
			algorithm.options = algorithm.options || {};
			var prng = options.prng || forge.random;
			var rng = { nextBytes: function(x) {
				var b = prng.getBytesSync(x.length);
				for (var i = 0; i < x.length; ++i) x[i] = b.charCodeAt(i);
			} };
			if (algorithm.name === "PRIMEINC") return primeincFindPrime(bits, rng, algorithm.options, callback);
			throw new Error("Invalid prime generation algorithm: " + algorithm.name);
		};
		function primeincFindPrime(bits, rng, options, callback) {
			if ("workers" in options) return primeincFindPrimeWithWorkers(bits, rng, options, callback);
			return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
		}
		function primeincFindPrimeWithoutWorkers(bits, rng, options, callback) {
			var num = generateRandom(bits, rng);
			var deltaIdx = 0;
			var mrTests = getMillerRabinTests(num.bitLength());
			if ("millerRabinTests" in options) mrTests = options.millerRabinTests;
			var maxBlockTime = 10;
			if ("maxBlockTime" in options) maxBlockTime = options.maxBlockTime;
			_primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
		}
		function _primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback) {
			var start = +/* @__PURE__ */ new Date();
			do {
				if (num.bitLength() > bits) num = generateRandom(bits, rng);
				if (num.isProbablePrime(mrTests)) return callback(null, num);
				num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
			} while (maxBlockTime < 0 || +/* @__PURE__ */ new Date() - start < maxBlockTime);
			forge.util.setImmediate(function() {
				_primeinc(num, bits, rng, deltaIdx, mrTests, maxBlockTime, callback);
			});
		}
		function primeincFindPrimeWithWorkers(bits, rng, options, callback) {
			if (typeof Worker === "undefined") return primeincFindPrimeWithoutWorkers(bits, rng, options, callback);
			var num = generateRandom(bits, rng);
			var numWorkers = options.workers;
			var workLoad = options.workLoad || 100;
			var range = workLoad * 30 / 8;
			var workerScript = options.workerScript || "forge/prime.worker.js";
			if (numWorkers === -1) return forge.util.estimateCores(function(err, cores) {
				if (err) cores = 2;
				numWorkers = cores - 1;
				generate();
			});
			generate();
			function generate() {
				numWorkers = Math.max(1, numWorkers);
				var workers = [];
				for (var i = 0; i < numWorkers; ++i) workers[i] = new Worker(workerScript);
				var running = numWorkers;
				for (var i = 0; i < numWorkers; ++i) workers[i].addEventListener("message", workerMessage);
				var found = false;
				function workerMessage(e) {
					if (found) return;
					--running;
					var data = e.data;
					if (data.found) {
						for (var i = 0; i < workers.length; ++i) workers[i].terminate();
						found = true;
						return callback(null, new BigInteger(data.prime, 16));
					}
					if (num.bitLength() > bits) num = generateRandom(bits, rng);
					var hex = num.toString(16);
					e.target.postMessage({
						hex,
						workLoad
					});
					num.dAddOffset(range, 0);
				}
			}
		}
		/**
		* Generates a random number using the given number of bits and RNG.
		*
		* @param bits the number of bits for the number.
		* @param rng the random number generator to use.
		*
		* @return the random number.
		*/
		function generateRandom(bits, rng) {
			var num = new BigInteger(bits, rng);
			var bits1 = bits - 1;
			if (!num.testBit(bits1)) num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, num);
			num.dAddOffset(31 - num.mod(THIRTY).byteValue(), 0);
			return num;
		}
		/**
		* Returns the required number of Miller-Rabin tests to generate a
		* prime with an error probability of (1/2)^80.
		*
		* See Handbook of Applied Cryptography Chapter 4, Table 4.4.
		*
		* @param bits the bit size.
		*
		* @return the required number of iterations.
		*/
		function getMillerRabinTests(bits) {
			if (bits <= 100) return 27;
			if (bits <= 150) return 18;
			if (bits <= 200) return 15;
			if (bits <= 250) return 12;
			if (bits <= 300) return 9;
			if (bits <= 350) return 8;
			if (bits <= 400) return 7;
			if (bits <= 500) return 6;
			if (bits <= 600) return 5;
			if (bits <= 800) return 4;
			if (bits <= 1250) return 3;
			return 2;
		}
	})();
}));
//#endregion
//#region node_modules/node-forge/lib/rsa.js
var require_rsa = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of basic RSA algorithms.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*
	* The only algorithm currently supported for PKI is RSA.
	*
	* An RSA key is often stored in ASN.1 DER format. The SubjectPublicKeyInfo
	* ASN.1 structure is composed of an algorithm of type AlgorithmIdentifier
	* and a subjectPublicKey of type bit string.
	*
	* The AlgorithmIdentifier contains an Object Identifier (OID) and parameters
	* for the algorithm, if any. In the case of RSA, there aren't any.
	*
	* SubjectPublicKeyInfo ::= SEQUENCE {
	*   algorithm AlgorithmIdentifier,
	*   subjectPublicKey BIT STRING
	* }
	*
	* AlgorithmIdentifer ::= SEQUENCE {
	*   algorithm OBJECT IDENTIFIER,
	*   parameters ANY DEFINED BY algorithm OPTIONAL
	* }
	*
	* For an RSA public key, the subjectPublicKey is:
	*
	* RSAPublicKey ::= SEQUENCE {
	*   modulus            INTEGER,    -- n
	*   publicExponent     INTEGER     -- e
	* }
	*
	* PrivateKeyInfo ::= SEQUENCE {
	*   version                   Version,
	*   privateKeyAlgorithm       PrivateKeyAlgorithmIdentifier,
	*   privateKey                PrivateKey,
	*   attributes           [0]  IMPLICIT Attributes OPTIONAL
	* }
	*
	* Version ::= INTEGER
	* PrivateKeyAlgorithmIdentifier ::= AlgorithmIdentifier
	* PrivateKey ::= OCTET STRING
	* Attributes ::= SET OF Attribute
	*
	* An RSA private key as the following structure:
	*
	* RSAPrivateKey ::= SEQUENCE {
	*   version Version,
	*   modulus INTEGER, -- n
	*   publicExponent INTEGER, -- e
	*   privateExponent INTEGER, -- d
	*   prime1 INTEGER, -- p
	*   prime2 INTEGER, -- q
	*   exponent1 INTEGER, -- d mod (p-1)
	*   exponent2 INTEGER, -- d mod (q-1)
	*   coefficient INTEGER -- (inverse of q) mod p
	* }
	*
	* Version ::= INTEGER
	*
	* The OID for the RSA key algorithm is: 1.2.840.113549.1.1.1
	*/
	var forge = require_forge();
	require_asn1();
	require_jsbn();
	require_oids();
	require_pkcs1();
	require_prime();
	require_random();
	require_util();
	if (typeof BigInteger === "undefined") var BigInteger = forge.jsbn.BigInteger;
	var _crypto = forge.util.isNodejs ? require("crypto") : null;
	var asn1 = forge.asn1;
	var util = forge.util;
	forge.pki = forge.pki || {};
	module.exports = forge.pki.rsa = forge.rsa = forge.rsa || {};
	var pki = forge.pki;
	var GCD_30_DELTA = [
		6,
		4,
		2,
		4,
		2,
		4,
		6,
		2
	];
	var privateKeyValidator = {
		name: "PrivateKeyInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "PrivateKeyInfo.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyVersion"
			},
			{
				name: "PrivateKeyInfo.privateKeyAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "AlgorithmIdentifier.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "privateKeyOid"
				}]
			},
			{
				name: "PrivateKeyInfo",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OCTETSTRING,
				constructed: false,
				capture: "privateKey"
			}
		]
	};
	var rsaPrivateKeyValidator = {
		name: "RSAPrivateKey",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "RSAPrivateKey.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyVersion"
			},
			{
				name: "RSAPrivateKey.modulus",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyModulus"
			},
			{
				name: "RSAPrivateKey.publicExponent",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyPublicExponent"
			},
			{
				name: "RSAPrivateKey.privateExponent",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyPrivateExponent"
			},
			{
				name: "RSAPrivateKey.prime1",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyPrime1"
			},
			{
				name: "RSAPrivateKey.prime2",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyPrime2"
			},
			{
				name: "RSAPrivateKey.exponent1",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyExponent1"
			},
			{
				name: "RSAPrivateKey.exponent2",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyExponent2"
			},
			{
				name: "RSAPrivateKey.coefficient",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyCoefficient"
			}
		]
	};
	var rsaPublicKeyValidator = {
		name: "RSAPublicKey",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "RSAPublicKey.modulus",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.INTEGER,
			constructed: false,
			capture: "publicKeyModulus"
		}, {
			name: "RSAPublicKey.exponent",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.INTEGER,
			constructed: false,
			capture: "publicKeyExponent"
		}]
	};
	var publicKeyValidator = forge.pki.rsa.publicKeyValidator = {
		name: "SubjectPublicKeyInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		captureAsn1: "subjectPublicKeyInfo",
		value: [{
			name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "AlgorithmIdentifier.algorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "publicKeyOid"
			}]
		}, {
			name: "SubjectPublicKeyInfo.subjectPublicKey",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.BITSTRING,
			constructed: false,
			value: [{
				name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				optional: true,
				captureAsn1: "rsaPublicKey"
			}]
		}]
	};
	var digestInfoValidator = {
		name: "DigestInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "DigestInfo.DigestAlgorithm",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "algorithmIdentifier"
			}, {
				name: "DigestInfo.DigestAlgorithm.parameters",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.NULL,
				capture: "parameters",
				optional: true,
				constructed: false
			}]
		}, {
			name: "DigestInfo.digest",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OCTETSTRING,
			constructed: false,
			capture: "digest"
		}]
	};
	/**
	* Wrap digest in DigestInfo object.
	*
	* This function implements EMSA-PKCS1-v1_5-ENCODE as per RFC 3447.
	*
	* DigestInfo ::= SEQUENCE {
	*   digestAlgorithm DigestAlgorithmIdentifier,
	*   digest Digest
	* }
	*
	* DigestAlgorithmIdentifier ::= AlgorithmIdentifier
	* Digest ::= OCTET STRING
	*
	* @param md the message digest object with the hash to sign.
	*
	* @return the encoded message (ready for RSA encryption)
	*/
	var emsaPkcs1v15encode = function(md) {
		var oid;
		if (md.algorithm in pki.oids) oid = pki.oids[md.algorithm];
		else {
			var error = /* @__PURE__ */ new Error("Unknown message digest algorithm.");
			error.algorithm = md.algorithm;
			throw error;
		}
		var oidBytes = asn1.oidToDer(oid).getBytes();
		var digestInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
		var digestAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
		digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, oidBytes));
		digestAlgorithm.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, ""));
		var digest = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, md.digest().getBytes());
		digestInfo.value.push(digestAlgorithm);
		digestInfo.value.push(digest);
		return asn1.toDer(digestInfo).getBytes();
	};
	/**
	* Performs x^c mod n (RSA encryption or decryption operation).
	*
	* @param x the number to raise and mod.
	* @param key the key to use.
	* @param pub true if the key is public, false if private.
	*
	* @return the result of x^c mod n.
	*/
	var _modPow = function(x, key, pub) {
		if (pub) return x.modPow(key.e, key.n);
		if (!key.p || !key.q) return x.modPow(key.d, key.n);
		if (!key.dP) key.dP = key.d.mod(key.p.subtract(BigInteger.ONE));
		if (!key.dQ) key.dQ = key.d.mod(key.q.subtract(BigInteger.ONE));
		if (!key.qInv) key.qInv = key.q.modInverse(key.p);
		var r;
		do
			r = new BigInteger(forge.util.bytesToHex(forge.random.getBytes(key.n.bitLength() / 8)), 16);
		while (r.compareTo(key.n) >= 0 || !r.gcd(key.n).equals(BigInteger.ONE));
		x = x.multiply(r.modPow(key.e, key.n)).mod(key.n);
		var xp = x.mod(key.p).modPow(key.dP, key.p);
		var xq = x.mod(key.q).modPow(key.dQ, key.q);
		while (xp.compareTo(xq) < 0) xp = xp.add(key.p);
		var y = xp.subtract(xq).multiply(key.qInv).mod(key.p).multiply(key.q).add(xq);
		y = y.multiply(r.modInverse(key.n)).mod(key.n);
		return y;
	};
	/**
	* NOTE: THIS METHOD IS DEPRECATED, use 'sign' on a private key object or
	* 'encrypt' on a public key object instead.
	*
	* Performs RSA encryption.
	*
	* The parameter bt controls whether to put padding bytes before the
	* message passed in. Set bt to either true or false to disable padding
	* completely (in order to handle e.g. EMSA-PSS encoding separately before),
	* signaling whether the encryption operation is a public key operation
	* (i.e. encrypting data) or not, i.e. private key operation (data signing).
	*
	* For PKCS#1 v1.5 padding pass in the block type to use, i.e. either 0x01
	* (for signing) or 0x02 (for encryption). The key operation mode (private
	* or public) is derived from this flag in that case).
	*
	* @param m the message to encrypt as a byte string.
	* @param key the RSA key to use.
	* @param bt for PKCS#1 v1.5 padding, the block type to use
	*   (0x01 for private key, 0x02 for public),
	*   to disable padding: true = public key, false = private key.
	*
	* @return the encrypted bytes as a string.
	*/
	pki.rsa.encrypt = function(m, key, bt) {
		var pub = bt;
		var eb;
		var k = Math.ceil(key.n.bitLength() / 8);
		if (bt !== false && bt !== true) {
			pub = bt === 2;
			eb = _encodePkcs1_v1_5(m, key, bt);
		} else {
			eb = forge.util.createBuffer();
			eb.putBytes(m);
		}
		var yhex = _modPow(new BigInteger(eb.toHex(), 16), key, pub).toString(16);
		var ed = forge.util.createBuffer();
		var zeros = k - Math.ceil(yhex.length / 2);
		while (zeros > 0) {
			ed.putByte(0);
			--zeros;
		}
		ed.putBytes(forge.util.hexToBytes(yhex));
		return ed.getBytes();
	};
	/**
	* NOTE: THIS METHOD IS DEPRECATED, use 'decrypt' on a private key object or
	* 'verify' on a public key object instead.
	*
	* Performs RSA decryption.
	*
	* The parameter ml controls whether to apply PKCS#1 v1.5 padding
	* or not.  Set ml = false to disable padding removal completely
	* (in order to handle e.g. EMSA-PSS later on) and simply pass back
	* the RSA encryption block.
	*
	* @param ed the encrypted data to decrypt in as a byte string.
	* @param key the RSA key to use.
	* @param pub true for a public key operation, false for private.
	* @param ml the message length, if known, false to disable padding.
	*
	* @return the decrypted message as a byte string.
	*/
	pki.rsa.decrypt = function(ed, key, pub, ml) {
		var k = Math.ceil(key.n.bitLength() / 8);
		if (ed.length !== k) {
			var error = /* @__PURE__ */ new Error("Encrypted message length is invalid.");
			error.length = ed.length;
			error.expected = k;
			throw error;
		}
		var y = new BigInteger(forge.util.createBuffer(ed).toHex(), 16);
		if (y.compareTo(key.n) >= 0) throw new Error("Encrypted message is invalid.");
		var xhex = _modPow(y, key, pub).toString(16);
		var eb = forge.util.createBuffer();
		var zeros = k - Math.ceil(xhex.length / 2);
		while (zeros > 0) {
			eb.putByte(0);
			--zeros;
		}
		eb.putBytes(forge.util.hexToBytes(xhex));
		if (ml !== false) return _decodePkcs1_v1_5(eb.getBytes(), key, pub);
		return eb.getBytes();
	};
	/**
	* Creates an RSA key-pair generation state object. It is used to allow
	* key-generation to be performed in steps. It also allows for a UI to
	* display progress updates.
	*
	* @param bits the size for the private key in bits, defaults to 2048.
	* @param e the public exponent to use, defaults to 65537 (0x10001).
	* @param [options] the options to use.
	*          prng a custom crypto-secure pseudo-random number generator to use,
	*            that must define "getBytesSync".
	*          algorithm the algorithm to use (default: 'PRIMEINC').
	*
	* @return the state object to use to generate the key-pair.
	*/
	pki.rsa.createKeyPairGenerationState = function(bits, e, options) {
		if (typeof bits === "string") bits = parseInt(bits, 10);
		bits = bits || 2048;
		options = options || {};
		var prng = options.prng || forge.random;
		var rng = { nextBytes: function(x) {
			var b = prng.getBytesSync(x.length);
			for (var i = 0; i < x.length; ++i) x[i] = b.charCodeAt(i);
		} };
		var algorithm = options.algorithm || "PRIMEINC";
		var rval;
		if (algorithm === "PRIMEINC") {
			rval = {
				algorithm,
				state: 0,
				bits,
				rng,
				eInt: e || 65537,
				e: new BigInteger(null),
				p: null,
				q: null,
				qBits: bits >> 1,
				pBits: bits - (bits >> 1),
				pqState: 0,
				num: null,
				keys: null
			};
			rval.e.fromInt(rval.eInt);
		} else throw new Error("Invalid key generation algorithm: " + algorithm);
		return rval;
	};
	/**
	* Attempts to runs the key-generation algorithm for at most n seconds
	* (approximately) using the given state. When key-generation has completed,
	* the keys will be stored in state.keys.
	*
	* To use this function to update a UI while generating a key or to prevent
	* causing browser lockups/warnings, set "n" to a value other than 0. A
	* simple pattern for generating a key and showing a progress indicator is:
	*
	* var state = pki.rsa.createKeyPairGenerationState(2048);
	* var step = function() {
	*   // step key-generation, run algorithm for 100 ms, repeat
	*   if(!forge.pki.rsa.stepKeyPairGenerationState(state, 100)) {
	*     setTimeout(step, 1);
	*   } else {
	*     // key-generation complete
	*     // TODO: turn off progress indicator here
	*     // TODO: use the generated key-pair in "state.keys"
	*   }
	* };
	* // TODO: turn on progress indicator here
	* setTimeout(step, 0);
	*
	* @param state the state to use.
	* @param n the maximum number of milliseconds to run the algorithm for, 0
	*          to run the algorithm to completion.
	*
	* @return true if the key-generation completed, false if not.
	*/
	pki.rsa.stepKeyPairGenerationState = function(state, n) {
		if (!("algorithm" in state)) state.algorithm = "PRIMEINC";
		var THIRTY = new BigInteger(null);
		THIRTY.fromInt(30);
		var deltaIdx = 0;
		var op_or = function(x, y) {
			return x | y;
		};
		var t1 = +/* @__PURE__ */ new Date();
		var t2;
		var total = 0;
		while (state.keys === null && (n <= 0 || total < n)) {
			if (state.state === 0) {
				var bits = state.p === null ? state.pBits : state.qBits;
				var bits1 = bits - 1;
				if (state.pqState === 0) {
					state.num = new BigInteger(bits, state.rng);
					if (!state.num.testBit(bits1)) state.num.bitwiseTo(BigInteger.ONE.shiftLeft(bits1), op_or, state.num);
					state.num.dAddOffset(31 - state.num.mod(THIRTY).byteValue(), 0);
					deltaIdx = 0;
					++state.pqState;
				} else if (state.pqState === 1) if (state.num.bitLength() > bits) state.pqState = 0;
				else if (state.num.isProbablePrime(_getMillerRabinTests(state.num.bitLength()))) ++state.pqState;
				else state.num.dAddOffset(GCD_30_DELTA[deltaIdx++ % 8], 0);
				else if (state.pqState === 2) state.pqState = state.num.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) === 0 ? 3 : 0;
				else if (state.pqState === 3) {
					state.pqState = 0;
					if (state.p === null) state.p = state.num;
					else state.q = state.num;
					if (state.p !== null && state.q !== null) ++state.state;
					state.num = null;
				}
			} else if (state.state === 1) {
				if (state.p.compareTo(state.q) < 0) {
					state.num = state.p;
					state.p = state.q;
					state.q = state.num;
				}
				++state.state;
			} else if (state.state === 2) {
				state.p1 = state.p.subtract(BigInteger.ONE);
				state.q1 = state.q.subtract(BigInteger.ONE);
				state.phi = state.p1.multiply(state.q1);
				++state.state;
			} else if (state.state === 3) if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) === 0) ++state.state;
			else {
				state.p = null;
				state.q = null;
				state.state = 0;
			}
			else if (state.state === 4) {
				state.n = state.p.multiply(state.q);
				if (state.n.bitLength() === state.bits) ++state.state;
				else {
					state.q = null;
					state.state = 0;
				}
			} else if (state.state === 5) {
				var d = state.e.modInverse(state.phi);
				state.keys = {
					privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
					publicKey: pki.rsa.setPublicKey(state.n, state.e)
				};
			}
			t2 = +/* @__PURE__ */ new Date();
			total += t2 - t1;
			t1 = t2;
		}
		return state.keys !== null;
	};
	/**
	* Generates an RSA public-private key pair in a single call.
	*
	* To generate a key-pair in steps (to allow for progress updates and to
	* prevent blocking or warnings in slow browsers) then use the key-pair
	* generation state functions.
	*
	* To generate a key-pair asynchronously (either through web-workers, if
	* available, or by breaking up the work on the main thread), pass a
	* callback function.
	*
	* @param [bits] the size for the private key in bits, defaults to 2048.
	* @param [e] the public exponent to use, defaults to 65537.
	* @param [options] options for key-pair generation, if given then 'bits'
	*            and 'e' must *not* be given:
	*          bits the size for the private key in bits, (default: 2048).
	*          e the public exponent to use, (default: 65537 (0x10001)).
	*          workerScript the worker script URL.
	*          workers the number of web workers (if supported) to use,
	*            (default: 2).
	*          workLoad the size of the work load, ie: number of possible prime
	*            numbers for each web worker to check per work assignment,
	*            (default: 100).
	*          prng a custom crypto-secure pseudo-random number generator to use,
	*            that must define "getBytesSync". Disables use of native APIs.
	*          algorithm the algorithm to use (default: 'PRIMEINC').
	* @param [callback(err, keypair)] called once the operation completes.
	*
	* @return an object with privateKey and publicKey properties.
	*/
	pki.rsa.generateKeyPair = function(bits, e, options, callback) {
		if (arguments.length === 1) {
			if (typeof bits === "object") {
				options = bits;
				bits = void 0;
			} else if (typeof bits === "function") {
				callback = bits;
				bits = void 0;
			}
		} else if (arguments.length === 2) if (typeof bits === "number") {
			if (typeof e === "function") {
				callback = e;
				e = void 0;
			} else if (typeof e !== "number") {
				options = e;
				e = void 0;
			}
		} else {
			options = bits;
			callback = e;
			bits = void 0;
			e = void 0;
		}
		else if (arguments.length === 3) if (typeof e === "number") {
			if (typeof options === "function") {
				callback = options;
				options = void 0;
			}
		} else {
			callback = options;
			options = e;
			e = void 0;
		}
		options = options || {};
		if (bits === void 0) bits = options.bits || 2048;
		if (e === void 0) e = options.e || 65537;
		if (!forge.options.usePureJavaScript && !options.prng && bits >= 256 && bits <= 16384 && (e === 65537 || e === 3)) {
			if (callback) {
				if (_detectNodeCrypto("generateKeyPair")) return _crypto.generateKeyPair("rsa", {
					modulusLength: bits,
					publicExponent: e,
					publicKeyEncoding: {
						type: "spki",
						format: "pem"
					},
					privateKeyEncoding: {
						type: "pkcs8",
						format: "pem"
					}
				}, function(err, pub, priv) {
					if (err) return callback(err);
					callback(null, {
						privateKey: pki.privateKeyFromPem(priv),
						publicKey: pki.publicKeyFromPem(pub)
					});
				});
				if (_detectSubtleCrypto("generateKey") && _detectSubtleCrypto("exportKey")) return util.globalScope.crypto.subtle.generateKey({
					name: "RSASSA-PKCS1-v1_5",
					modulusLength: bits,
					publicExponent: _intToUint8Array(e),
					hash: { name: "SHA-256" }
				}, true, ["sign", "verify"]).then(function(pair) {
					return util.globalScope.crypto.subtle.exportKey("pkcs8", pair.privateKey);
				}).then(void 0, function(err) {
					callback(err);
				}).then(function(pkcs8) {
					if (pkcs8) {
						var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
						callback(null, {
							privateKey,
							publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
						});
					}
				});
				if (_detectSubtleMsCrypto("generateKey") && _detectSubtleMsCrypto("exportKey")) {
					var genOp = util.globalScope.msCrypto.subtle.generateKey({
						name: "RSASSA-PKCS1-v1_5",
						modulusLength: bits,
						publicExponent: _intToUint8Array(e),
						hash: { name: "SHA-256" }
					}, true, ["sign", "verify"]);
					genOp.oncomplete = function(e) {
						var pair = e.target.result;
						var exportOp = util.globalScope.msCrypto.subtle.exportKey("pkcs8", pair.privateKey);
						exportOp.oncomplete = function(e) {
							var pkcs8 = e.target.result;
							var privateKey = pki.privateKeyFromAsn1(asn1.fromDer(forge.util.createBuffer(pkcs8)));
							callback(null, {
								privateKey,
								publicKey: pki.setRsaPublicKey(privateKey.n, privateKey.e)
							});
						};
						exportOp.onerror = function(err) {
							callback(err);
						};
					};
					genOp.onerror = function(err) {
						callback(err);
					};
					return;
				}
			} else if (_detectNodeCrypto("generateKeyPairSync")) {
				var keypair = _crypto.generateKeyPairSync("rsa", {
					modulusLength: bits,
					publicExponent: e,
					publicKeyEncoding: {
						type: "spki",
						format: "pem"
					},
					privateKeyEncoding: {
						type: "pkcs8",
						format: "pem"
					}
				});
				return {
					privateKey: pki.privateKeyFromPem(keypair.privateKey),
					publicKey: pki.publicKeyFromPem(keypair.publicKey)
				};
			}
		}
		var state = pki.rsa.createKeyPairGenerationState(bits, e, options);
		if (!callback) {
			pki.rsa.stepKeyPairGenerationState(state, 0);
			return state.keys;
		}
		_generateKeyPair(state, options, callback);
	};
	/**
	* Sets an RSA public key from BigIntegers modulus and exponent.
	*
	* @param n the modulus.
	* @param e the exponent.
	*
	* @return the public key.
	*/
	pki.setRsaPublicKey = pki.rsa.setPublicKey = function(n, e) {
		var key = {
			n,
			e
		};
		/**
		* Encrypts the given data with this public key. Newer applications
		* should use the 'RSA-OAEP' decryption scheme, 'RSAES-PKCS1-V1_5' is for
		* legacy applications.
		*
		* @param data the byte string to encrypt.
		* @param scheme the encryption scheme to use:
		*          'RSAES-PKCS1-V1_5' (default),
		*          'RSA-OAEP',
		*          'RAW', 'NONE', or null to perform raw RSA encryption,
		*          an object with an 'encode' property set to a function
		*          with the signature 'function(data, key)' that returns
		*          a binary-encoded string representing the encoded data.
		* @param schemeOptions any scheme-specific options.
		*
		* @return the encrypted byte string.
		*/
		key.encrypt = function(data, scheme, schemeOptions) {
			if (typeof scheme === "string") scheme = scheme.toUpperCase();
			else if (scheme === void 0) scheme = "RSAES-PKCS1-V1_5";
			if (scheme === "RSAES-PKCS1-V1_5") scheme = { encode: function(m, key, pub) {
				return _encodePkcs1_v1_5(m, key, 2).getBytes();
			} };
			else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") scheme = { encode: function(m, key) {
				return forge.pkcs1.encode_rsa_oaep(key, m, schemeOptions);
			} };
			else if ([
				"RAW",
				"NONE",
				"NULL",
				null
			].indexOf(scheme) !== -1) scheme = { encode: function(e) {
				return e;
			} };
			else if (typeof scheme === "string") throw new Error("Unsupported encryption scheme: \"" + scheme + "\".");
			var e = scheme.encode(data, key, true);
			return pki.rsa.encrypt(e, key, true);
		};
		/**
		* Verifies the given signature against the given digest.
		*
		* PKCS#1 supports multiple (currently two) signature schemes:
		* RSASSA-PKCS1-V1_5 and RSASSA-PSS.
		*
		* By default this implementation uses the "old scheme", i.e.
		* RSASSA-PKCS1-V1_5, in which case once RSA-decrypted, the
		* signature is an OCTET STRING that holds a DigestInfo.
		*
		* DigestInfo ::= SEQUENCE {
		*   digestAlgorithm DigestAlgorithmIdentifier,
		*   digest Digest
		* }
		* DigestAlgorithmIdentifier ::= AlgorithmIdentifier
		* Digest ::= OCTET STRING
		*
		* To perform PSS signature verification, provide an instance
		* of Forge PSS object as the scheme parameter.
		*
		* @param digest the message digest hash to compare against the signature,
		*          as a binary-encoded string.
		* @param signature the signature to verify, as a binary-encoded string.
		* @param scheme signature verification scheme to use:
		*          'RSASSA-PKCS1-V1_5' or undefined for RSASSA PKCS#1 v1.5,
		*          a Forge PSS object for RSASSA-PSS,
		*          'NONE' or null for none, DigestInfo will not be expected, but
		*            PKCS#1 v1.5 padding will still be used.
		* @param options optional verify options
		*          _parseAllDigestBytes testing flag to control parsing of all
		*            digest bytes. Unsupported and not for general usage.
		*            (default: true)
		*          _skipPaddingChecks testing flag to skip some padding checks to
		*            test other checks. Unsupported and not for general usage.
		*            (default: false)
		*
		* @return true if the signature was verified, false if not.
		*/
		key.verify = function(digest, signature, scheme, options) {
			if (typeof scheme === "string") scheme = scheme.toUpperCase();
			else if (scheme === void 0) scheme = "RSASSA-PKCS1-V1_5";
			if (options === void 0) options = {
				_parseAllDigestBytes: true,
				_skipPaddingChecks: false
			};
			if (!("_parseAllDigestBytes" in options)) options._parseAllDigestBytes = true;
			if (!("_skipPaddingChecks" in options)) options._skipPaddingChecks = false;
			if (scheme === "RSASSA-PKCS1-V1_5") scheme = { verify: function(digest, d) {
				d = _decodePkcs1_v1_5(d, key, true, void 0, options);
				var obj = asn1.fromDer(d, { parseAllBytes: options._parseAllDigestBytes });
				var capture = {};
				var errors = [];
				if (!asn1.validate(obj, digestInfoValidator, capture, errors) || obj.value.length !== 2) {
					var error = /* @__PURE__ */ new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.");
					error.errors = errors;
					throw error;
				}
				var oid = asn1.derToOid(capture.algorithmIdentifier);
				if (!(oid === forge.oids.md2 || oid === forge.oids.md5 || oid === forge.oids.sha1 || oid === forge.oids.sha224 || oid === forge.oids.sha256 || oid === forge.oids.sha384 || oid === forge.oids.sha512 || oid === forge.oids["sha512-224"] || oid === forge.oids["sha512-256"])) {
					var error = /* @__PURE__ */ new Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.");
					error.oid = oid;
					throw error;
				}
				if (oid === forge.oids.md2 || oid === forge.oids.md5) {
					if (!("parameters" in capture)) throw new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifier NULL parameters.");
				}
				return digest === capture.digest;
			} };
			else if (scheme === "NONE" || scheme === "NULL" || scheme === null) scheme = { verify: function(digest, d) {
				d = _decodePkcs1_v1_5(d, key, true, void 0, options);
				return digest === d;
			} };
			var d = pki.rsa.decrypt(signature, key, true, false);
			return scheme.verify(digest, d, key.n.bitLength());
		};
		return key;
	};
	/**
	* Sets an RSA private key from BigIntegers modulus, exponent, primes,
	* prime exponents, and modular multiplicative inverse.
	*
	* @param n the modulus.
	* @param e the public exponent.
	* @param d the private exponent ((inverse of e) mod n).
	* @param p the first prime.
	* @param q the second prime.
	* @param dP exponent1 (d mod (p-1)).
	* @param dQ exponent2 (d mod (q-1)).
	* @param qInv ((inverse of q) mod p)
	*
	* @return the private key.
	*/
	pki.setRsaPrivateKey = pki.rsa.setPrivateKey = function(n, e, d, p, q, dP, dQ, qInv) {
		var key = {
			n,
			e,
			d,
			p,
			q,
			dP,
			dQ,
			qInv
		};
		/**
		* Decrypts the given data with this private key. The decryption scheme
		* must match the one used to encrypt the data.
		*
		* @param data the byte string to decrypt.
		* @param scheme the decryption scheme to use:
		*          'RSAES-PKCS1-V1_5' (default),
		*          'RSA-OAEP',
		*          'RAW', 'NONE', or null to perform raw RSA decryption.
		* @param schemeOptions any scheme-specific options.
		*
		* @return the decrypted byte string.
		*/
		key.decrypt = function(data, scheme, schemeOptions) {
			if (typeof scheme === "string") scheme = scheme.toUpperCase();
			else if (scheme === void 0) scheme = "RSAES-PKCS1-V1_5";
			var d = pki.rsa.decrypt(data, key, false, false);
			if (scheme === "RSAES-PKCS1-V1_5") scheme = { decode: _decodePkcs1_v1_5 };
			else if (scheme === "RSA-OAEP" || scheme === "RSAES-OAEP") scheme = { decode: function(d, key) {
				return forge.pkcs1.decode_rsa_oaep(key, d, schemeOptions);
			} };
			else if ([
				"RAW",
				"NONE",
				"NULL",
				null
			].indexOf(scheme) !== -1) scheme = { decode: function(d) {
				return d;
			} };
			else throw new Error("Unsupported encryption scheme: \"" + scheme + "\".");
			return scheme.decode(d, key, false);
		};
		/**
		* Signs the given digest, producing a signature.
		*
		* PKCS#1 supports multiple (currently two) signature schemes:
		* RSASSA-PKCS1-V1_5 and RSASSA-PSS.
		*
		* By default this implementation uses the "old scheme", i.e.
		* RSASSA-PKCS1-V1_5. In order to generate a PSS signature, provide
		* an instance of Forge PSS object as the scheme parameter.
		*
		* @param md the message digest object with the hash to sign.
		* @param scheme the signature scheme to use:
		*          'RSASSA-PKCS1-V1_5' or undefined for RSASSA PKCS#1 v1.5,
		*          a Forge PSS object for RSASSA-PSS,
		*          'NONE' or null for none, DigestInfo will not be used but
		*            PKCS#1 v1.5 padding will still be used.
		*
		* @return the signature as a byte string.
		*/
		key.sign = function(md, scheme) {
			var bt = false;
			if (typeof scheme === "string") scheme = scheme.toUpperCase();
			if (scheme === void 0 || scheme === "RSASSA-PKCS1-V1_5") {
				scheme = { encode: emsaPkcs1v15encode };
				bt = 1;
			} else if (scheme === "NONE" || scheme === "NULL" || scheme === null) {
				scheme = { encode: function() {
					return md;
				} };
				bt = 1;
			}
			var d = scheme.encode(md, key.n.bitLength());
			return pki.rsa.encrypt(d, key, bt);
		};
		return key;
	};
	/**
	* Wraps an RSAPrivateKey ASN.1 object in an ASN.1 PrivateKeyInfo object.
	*
	* @param rsaKey the ASN.1 RSAPrivateKey.
	*
	* @return the ASN.1 PrivateKeyInfo.
	*/
	pki.wrapRsaPrivateKey = function(rsaKey) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(rsaKey).getBytes())
		]);
	};
	/**
	* Converts a private key from an ASN.1 object.
	*
	* @param obj the ASN.1 representation of a PrivateKeyInfo containing an
	*          RSAPrivateKey or an RSAPrivateKey.
	*
	* @return the private key.
	*/
	pki.privateKeyFromAsn1 = function(obj) {
		var capture = {};
		var errors = [];
		if (asn1.validate(obj, privateKeyValidator, capture, errors)) obj = asn1.fromDer(forge.util.createBuffer(capture.privateKey));
		capture = {};
		errors = [];
		if (!asn1.validate(obj, rsaPrivateKeyValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
			error.errors = errors;
			throw error;
		}
		var n = forge.util.createBuffer(capture.privateKeyModulus).toHex(), e = forge.util.createBuffer(capture.privateKeyPublicExponent).toHex(), d = forge.util.createBuffer(capture.privateKeyPrivateExponent).toHex(), p = forge.util.createBuffer(capture.privateKeyPrime1).toHex(), q = forge.util.createBuffer(capture.privateKeyPrime2).toHex(), dP = forge.util.createBuffer(capture.privateKeyExponent1).toHex(), dQ = forge.util.createBuffer(capture.privateKeyExponent2).toHex(), qInv = forge.util.createBuffer(capture.privateKeyCoefficient).toHex();
		return pki.setRsaPrivateKey(new BigInteger(n, 16), new BigInteger(e, 16), new BigInteger(d, 16), new BigInteger(p, 16), new BigInteger(q, 16), new BigInteger(dP, 16), new BigInteger(dQ, 16), new BigInteger(qInv, 16));
	};
	/**
	* Converts a private key to an ASN.1 RSAPrivateKey.
	*
	* @param key the private key.
	*
	* @return the ASN.1 representation of an RSAPrivateKey.
	*/
	pki.privateKeyToAsn1 = pki.privateKeyToRSAPrivateKey = function(key) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(0).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.d)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.p)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.q)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dP)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.dQ)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.qInv))
		]);
	};
	/**
	* Converts a public key from an ASN.1 SubjectPublicKeyInfo or RSAPublicKey.
	*
	* @param obj the asn1 representation of a SubjectPublicKeyInfo or RSAPublicKey.
	*
	* @return the public key.
	*/
	pki.publicKeyFromAsn1 = function(obj) {
		var capture = {};
		var errors = [];
		if (asn1.validate(obj, publicKeyValidator, capture, errors)) {
			var oid = asn1.derToOid(capture.publicKeyOid);
			if (oid !== pki.oids.rsaEncryption) {
				var error = /* @__PURE__ */ new Error("Cannot read public key. Unknown OID.");
				error.oid = oid;
				throw error;
			}
			obj = capture.rsaPublicKey;
		}
		errors = [];
		if (!asn1.validate(obj, rsaPublicKeyValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.");
			error.errors = errors;
			throw error;
		}
		var n = forge.util.createBuffer(capture.publicKeyModulus).toHex();
		var e = forge.util.createBuffer(capture.publicKeyExponent).toHex();
		return pki.setRsaPublicKey(new BigInteger(n, 16), new BigInteger(e, 16));
	};
	/**
	* Converts a public key to an ASN.1 SubjectPublicKeyInfo.
	*
	* @param key the public key.
	*
	* @return the asn1 representation of a SubjectPublicKeyInfo.
	*/
	pki.publicKeyToAsn1 = pki.publicKeyToSubjectPublicKeyInfo = function(key) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.rsaEncryption).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, [pki.publicKeyToRSAPublicKey(key)])]);
	};
	/**
	* Converts a public key to an ASN.1 RSAPublicKey.
	*
	* @param key the public key.
	*
	* @return the asn1 representation of a RSAPublicKey.
	*/
	pki.publicKeyToRSAPublicKey = function(key) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.n)), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, _bnToBytes(key.e))]);
	};
	/**
	* Encodes a message using PKCS#1 v1.5 padding.
	*
	* @param m the message to encode.
	* @param key the RSA key to use.
	* @param bt the block type to use, i.e. either 0x01 (for signing) or 0x02
	*          (for encryption).
	*
	* @return the padded byte buffer.
	*/
	function _encodePkcs1_v1_5(m, key, bt) {
		var eb = forge.util.createBuffer();
		var k = Math.ceil(key.n.bitLength() / 8);
		if (m.length > k - 11) {
			var error = /* @__PURE__ */ new Error("Message is too long for PKCS#1 v1.5 padding.");
			error.length = m.length;
			error.max = k - 11;
			throw error;
		}
		eb.putByte(0);
		eb.putByte(bt);
		var padNum = k - 3 - m.length;
		var padByte;
		if (bt === 0 || bt === 1) {
			padByte = bt === 0 ? 0 : 255;
			for (var i = 0; i < padNum; ++i) eb.putByte(padByte);
		} else while (padNum > 0) {
			var numZeros = 0;
			var padBytes = forge.random.getBytes(padNum);
			for (var i = 0; i < padNum; ++i) {
				padByte = padBytes.charCodeAt(i);
				if (padByte === 0) ++numZeros;
				else eb.putByte(padByte);
			}
			padNum = numZeros;
		}
		eb.putByte(0);
		eb.putBytes(m);
		return eb;
	}
	/**
	* Decodes a message using PKCS#1 v1.5 padding.
	*
	* @param em the message to decode.
	* @param key the RSA key to use.
	* @param pub true if the key is a public key, false if it is private.
	* @param ml the message length, if specified.
	* @param options testing options.
	*
	* @return the decoded bytes.
	*/
	function _decodePkcs1_v1_5(em, key, pub, ml, options) {
		var k = Math.ceil(key.n.bitLength() / 8);
		var eb = forge.util.createBuffer(em);
		var first = eb.getByte();
		var bt = eb.getByte();
		if (first !== 0 || pub && bt !== 0 && bt !== 1 || !pub && bt !== 2 || pub && bt === 0 && typeof ml === "undefined") throw new Error("Encryption block is invalid.");
		var padNum = 0;
		if (bt === 0) {
			padNum = k - 3 - ml;
			for (var i = 0; i < padNum; ++i) if (eb.getByte() !== 0) throw new Error("Encryption block is invalid.");
		} else if (bt === 1) {
			padNum = 0;
			while (eb.length() > 1) {
				if (eb.getByte() !== 255) {
					--eb.read;
					break;
				}
				++padNum;
			}
			if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) throw new Error("Encryption block is invalid.");
		} else if (bt === 2) {
			padNum = 0;
			while (eb.length() > 1) {
				if (eb.getByte() === 0) {
					--eb.read;
					break;
				}
				++padNum;
			}
			if (padNum < 8 && !(options ? options._skipPaddingChecks : false)) throw new Error("Encryption block is invalid.");
		}
		if (eb.getByte() !== 0 || padNum !== k - 3 - eb.length()) throw new Error("Encryption block is invalid.");
		return eb.getBytes();
	}
	/**
	* Runs the key-generation algorithm asynchronously, either in the background
	* via Web Workers, or using the main thread and setImmediate.
	*
	* @param state the key-pair generation state.
	* @param [options] options for key-pair generation:
	*          workerScript the worker script URL.
	*          workers the number of web workers (if supported) to use,
	*            (default: 2, -1 to use estimated cores minus one).
	*          workLoad the size of the work load, ie: number of possible prime
	*            numbers for each web worker to check per work assignment,
	*            (default: 100).
	* @param callback(err, keypair) called once the operation completes.
	*/
	function _generateKeyPair(state, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		options = options || {};
		var opts = { algorithm: {
			name: options.algorithm || "PRIMEINC",
			options: {
				workers: options.workers || 2,
				workLoad: options.workLoad || 100,
				workerScript: options.workerScript
			}
		} };
		if ("prng" in options) opts.prng = options.prng;
		generate();
		function generate() {
			getPrime(state.pBits, function(err, num) {
				if (err) return callback(err);
				state.p = num;
				if (state.q !== null) return finish(err, state.q);
				getPrime(state.qBits, finish);
			});
		}
		function getPrime(bits, callback) {
			forge.prime.generateProbablePrime(bits, opts, callback);
		}
		function finish(err, num) {
			if (err) return callback(err);
			state.q = num;
			if (state.p.compareTo(state.q) < 0) {
				var tmp = state.p;
				state.p = state.q;
				state.q = tmp;
			}
			if (state.p.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
				state.p = null;
				generate();
				return;
			}
			if (state.q.subtract(BigInteger.ONE).gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
				state.q = null;
				getPrime(state.qBits, finish);
				return;
			}
			state.p1 = state.p.subtract(BigInteger.ONE);
			state.q1 = state.q.subtract(BigInteger.ONE);
			state.phi = state.p1.multiply(state.q1);
			if (state.phi.gcd(state.e).compareTo(BigInteger.ONE) !== 0) {
				state.p = state.q = null;
				generate();
				return;
			}
			state.n = state.p.multiply(state.q);
			if (state.n.bitLength() !== state.bits) {
				state.q = null;
				getPrime(state.qBits, finish);
				return;
			}
			var d = state.e.modInverse(state.phi);
			state.keys = {
				privateKey: pki.rsa.setPrivateKey(state.n, state.e, d, state.p, state.q, d.mod(state.p1), d.mod(state.q1), state.q.modInverse(state.p)),
				publicKey: pki.rsa.setPublicKey(state.n, state.e)
			};
			callback(null, state.keys);
		}
	}
	/**
	* Converts a positive BigInteger into 2's-complement big-endian bytes.
	*
	* @param b the big integer to convert.
	*
	* @return the bytes.
	*/
	function _bnToBytes(b) {
		var hex = b.toString(16);
		if (hex[0] >= "8") hex = "00" + hex;
		var bytes = forge.util.hexToBytes(hex);
		if (bytes.length > 1 && (bytes.charCodeAt(0) === 0 && (bytes.charCodeAt(1) & 128) === 0 || bytes.charCodeAt(0) === 255 && (bytes.charCodeAt(1) & 128) === 128)) return bytes.substr(1);
		return bytes;
	}
	/**
	* Returns the required number of Miller-Rabin tests to generate a
	* prime with an error probability of (1/2)^80.
	*
	* See Handbook of Applied Cryptography Chapter 4, Table 4.4.
	*
	* @param bits the bit size.
	*
	* @return the required number of iterations.
	*/
	function _getMillerRabinTests(bits) {
		if (bits <= 100) return 27;
		if (bits <= 150) return 18;
		if (bits <= 200) return 15;
		if (bits <= 250) return 12;
		if (bits <= 300) return 9;
		if (bits <= 350) return 8;
		if (bits <= 400) return 7;
		if (bits <= 500) return 6;
		if (bits <= 600) return 5;
		if (bits <= 800) return 4;
		if (bits <= 1250) return 3;
		return 2;
	}
	/**
	* Performs feature detection on the Node crypto interface.
	*
	* @param fn the feature (function) to detect.
	*
	* @return true if detected, false if not.
	*/
	function _detectNodeCrypto(fn) {
		return forge.util.isNodejs && typeof _crypto[fn] === "function";
	}
	/**
	* Performs feature detection on the SubtleCrypto interface.
	*
	* @param fn the feature (function) to detect.
	*
	* @return true if detected, false if not.
	*/
	function _detectSubtleCrypto(fn) {
		return typeof util.globalScope !== "undefined" && typeof util.globalScope.crypto === "object" && typeof util.globalScope.crypto.subtle === "object" && typeof util.globalScope.crypto.subtle[fn] === "function";
	}
	/**
	* Performs feature detection on the deprecated Microsoft Internet Explorer
	* outdated SubtleCrypto interface. This function should only be used after
	* checking for the modern, standard SubtleCrypto interface.
	*
	* @param fn the feature (function) to detect.
	*
	* @return true if detected, false if not.
	*/
	function _detectSubtleMsCrypto(fn) {
		return typeof util.globalScope !== "undefined" && typeof util.globalScope.msCrypto === "object" && typeof util.globalScope.msCrypto.subtle === "object" && typeof util.globalScope.msCrypto.subtle[fn] === "function";
	}
	function _intToUint8Array(x) {
		var bytes = forge.util.hexToBytes(x.toString(16));
		var buffer = new Uint8Array(bytes.length);
		for (var i = 0; i < bytes.length; ++i) buffer[i] = bytes.charCodeAt(i);
		return buffer;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/pbe.js
var require_pbe = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Password-based encryption functions.
	*
	* @author Dave Longley
	* @author Stefan Siegl <stesie@brokenpipe.de>
	*
	* Copyright (c) 2010-2013 Digital Bazaar, Inc.
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	*
	* An EncryptedPrivateKeyInfo:
	*
	* EncryptedPrivateKeyInfo ::= SEQUENCE {
	*   encryptionAlgorithm  EncryptionAlgorithmIdentifier,
	*   encryptedData        EncryptedData }
	*
	* EncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
	*
	* EncryptedData ::= OCTET STRING
	*/
	var forge = require_forge();
	require_aes();
	require_asn1();
	require_des();
	require_md();
	require_oids();
	require_pbkdf2();
	require_pem();
	require_random();
	require_rc2();
	require_rsa();
	require_util();
	if (typeof BigInteger === "undefined") var BigInteger = forge.jsbn.BigInteger;
	var asn1 = forge.asn1;
	var pki = forge.pki = forge.pki || {};
	module.exports = pki.pbe = forge.pbe = forge.pbe || {};
	var oids = pki.oids;
	var encryptedPrivateKeyValidator = {
		name: "EncryptedPrivateKeyInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "EncryptedPrivateKeyInfo.encryptionAlgorithm",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "AlgorithmIdentifier.algorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "encryptionOid"
			}, {
				name: "AlgorithmIdentifier.parameters",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				captureAsn1: "encryptionParams"
			}]
		}, {
			name: "EncryptedPrivateKeyInfo.encryptedData",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OCTETSTRING,
			constructed: false,
			capture: "encryptedData"
		}]
	};
	var PBES2AlgorithmsValidator = {
		name: "PBES2Algorithms",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "PBES2Algorithms.keyDerivationFunc",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "PBES2Algorithms.keyDerivationFunc.oid",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "kdfOid"
			}, {
				name: "PBES2Algorithms.params",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [
					{
						name: "PBES2Algorithms.params.salt",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.OCTETSTRING,
						constructed: false,
						capture: "kdfSalt"
					},
					{
						name: "PBES2Algorithms.params.iterationCount",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.INTEGER,
						constructed: false,
						capture: "kdfIterationCount"
					},
					{
						name: "PBES2Algorithms.params.keyLength",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.INTEGER,
						constructed: false,
						optional: true,
						capture: "keyLength"
					},
					{
						name: "PBES2Algorithms.params.prf",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						optional: true,
						value: [{
							name: "PBES2Algorithms.params.prf.algorithm",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.OID,
							constructed: false,
							capture: "prfOid"
						}]
					}
				]
			}]
		}, {
			name: "PBES2Algorithms.encryptionScheme",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "PBES2Algorithms.encryptionScheme.oid",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "encOid"
			}, {
				name: "PBES2Algorithms.encryptionScheme.iv",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OCTETSTRING,
				constructed: false,
				capture: "encIv"
			}]
		}]
	};
	var pkcs12PbeParamsValidator = {
		name: "pkcs-12PbeParams",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "pkcs-12PbeParams.salt",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OCTETSTRING,
			constructed: false,
			capture: "salt"
		}, {
			name: "pkcs-12PbeParams.iterations",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.INTEGER,
			constructed: false,
			capture: "iterations"
		}]
	};
	/**
	* Encrypts a ASN.1 PrivateKeyInfo object, producing an EncryptedPrivateKeyInfo.
	*
	* PBES2Algorithms ALGORITHM-IDENTIFIER ::=
	*   { {PBES2-params IDENTIFIED BY id-PBES2}, ...}
	*
	* id-PBES2 OBJECT IDENTIFIER ::= {pkcs-5 13}
	*
	* PBES2-params ::= SEQUENCE {
	*   keyDerivationFunc AlgorithmIdentifier {{PBES2-KDFs}},
	*   encryptionScheme AlgorithmIdentifier {{PBES2-Encs}}
	* }
	*
	* PBES2-KDFs ALGORITHM-IDENTIFIER ::=
	*   { {PBKDF2-params IDENTIFIED BY id-PBKDF2}, ... }
	*
	* PBES2-Encs ALGORITHM-IDENTIFIER ::= { ... }
	*
	* PBKDF2-params ::= SEQUENCE {
	*   salt CHOICE {
	*     specified OCTET STRING,
	*     otherSource AlgorithmIdentifier {{PBKDF2-SaltSources}}
	*   },
	*   iterationCount INTEGER (1..MAX),
	*   keyLength INTEGER (1..MAX) OPTIONAL,
	*   prf AlgorithmIdentifier {{PBKDF2-PRFs}} DEFAULT algid-hmacWithSHA1
	* }
	*
	* @param obj the ASN.1 PrivateKeyInfo object.
	* @param password the password to encrypt with.
	* @param options:
	*          algorithm the encryption algorithm to use
	*            ('aes128', 'aes192', 'aes256', '3des'), defaults to 'aes128'.
	*          count the iteration count to use.
	*          saltSize the salt size to use.
	*          prfAlgorithm the PRF message digest algorithm to use
	*            ('sha1', 'sha224', 'sha256', 'sha384', 'sha512')
	*
	* @return the ASN.1 EncryptedPrivateKeyInfo.
	*/
	pki.encryptPrivateKeyInfo = function(obj, password, options) {
		options = options || {};
		options.saltSize = options.saltSize || 8;
		options.count = options.count || 2048;
		options.algorithm = options.algorithm || "aes128";
		options.prfAlgorithm = options.prfAlgorithm || "sha1";
		var salt = forge.random.getBytesSync(options.saltSize);
		var count = options.count;
		var countBytes = asn1.integerToDer(count);
		var dkLen;
		var encryptionAlgorithm;
		var encryptedData;
		if (options.algorithm.indexOf("aes") === 0 || options.algorithm === "des") {
			var ivLen, encOid, cipherFn;
			switch (options.algorithm) {
				case "aes128":
					dkLen = 16;
					ivLen = 16;
					encOid = oids["aes128-CBC"];
					cipherFn = forge.aes.createEncryptionCipher;
					break;
				case "aes192":
					dkLen = 24;
					ivLen = 16;
					encOid = oids["aes192-CBC"];
					cipherFn = forge.aes.createEncryptionCipher;
					break;
				case "aes256":
					dkLen = 32;
					ivLen = 16;
					encOid = oids["aes256-CBC"];
					cipherFn = forge.aes.createEncryptionCipher;
					break;
				case "des":
					dkLen = 8;
					ivLen = 8;
					encOid = oids["desCBC"];
					cipherFn = forge.des.createEncryptionCipher;
					break;
				default:
					var error = /* @__PURE__ */ new Error("Cannot encrypt private key. Unknown encryption algorithm.");
					error.algorithm = options.algorithm;
					throw error;
			}
			var prfAlgorithm = "hmacWith" + options.prfAlgorithm.toUpperCase();
			var md = prfAlgorithmToMessageDigest(prfAlgorithm);
			var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
			var iv = forge.random.getBytesSync(ivLen);
			var cipher = cipherFn(dk);
			cipher.start(iv);
			cipher.update(asn1.toDer(obj));
			cipher.finish();
			encryptedData = cipher.output.getBytes();
			var params = createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm);
			encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBES2"]).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pkcs5PBKDF2"]).getBytes()), params]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(encOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, iv)])])]);
		} else if (options.algorithm === "3des") {
			dkLen = 24;
			var saltBytes = new forge.util.ByteBuffer(salt);
			var dk = pki.pbe.generatePkcs12Key(password, saltBytes, 1, count, dkLen);
			var iv = pki.pbe.generatePkcs12Key(password, saltBytes, 2, count, dkLen);
			var cipher = forge.des.createEncryptionCipher(dk);
			cipher.start(iv);
			cipher.update(asn1.toDer(obj));
			cipher.finish();
			encryptedData = cipher.output.getBytes();
			encryptionAlgorithm = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())])]);
		} else {
			var error = /* @__PURE__ */ new Error("Cannot encrypt private key. Unknown encryption algorithm.");
			error.algorithm = options.algorithm;
			throw error;
		}
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [encryptionAlgorithm, asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, encryptedData)]);
	};
	/**
	* Decrypts a ASN.1 PrivateKeyInfo object.
	*
	* @param obj the ASN.1 EncryptedPrivateKeyInfo object.
	* @param password the password to decrypt with.
	*
	* @return the ASN.1 PrivateKeyInfo on success, null on failure.
	*/
	pki.decryptPrivateKeyInfo = function(obj, password) {
		var rval = null;
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, encryptedPrivateKeyValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read encrypted private key. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
			error.errors = errors;
			throw error;
		}
		var oid = asn1.derToOid(capture.encryptionOid);
		var cipher = pki.pbe.getCipher(oid, capture.encryptionParams, password);
		var encrypted = forge.util.createBuffer(capture.encryptedData);
		cipher.update(encrypted);
		if (cipher.finish()) rval = asn1.fromDer(cipher.output);
		return rval;
	};
	/**
	* Converts a EncryptedPrivateKeyInfo to PEM format.
	*
	* @param epki the EncryptedPrivateKeyInfo.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted encrypted private key.
	*/
	pki.encryptedPrivateKeyToPem = function(epki, maxline) {
		var msg = {
			type: "ENCRYPTED PRIVATE KEY",
			body: asn1.toDer(epki).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Converts a PEM-encoded EncryptedPrivateKeyInfo to ASN.1 format. Decryption
	* is not performed.
	*
	* @param pem the EncryptedPrivateKeyInfo in PEM-format.
	*
	* @return the ASN.1 EncryptedPrivateKeyInfo.
	*/
	pki.encryptedPrivateKeyFromPem = function(pem) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "ENCRYPTED PRIVATE KEY") {
			var error = /* @__PURE__ */ new Error("Could not convert encrypted private key from PEM; PEM header type is \"ENCRYPTED PRIVATE KEY\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert encrypted private key from PEM; PEM is encrypted.");
		return asn1.fromDer(msg.body);
	};
	/**
	* Encrypts an RSA private key. By default, the key will be wrapped in
	* a PrivateKeyInfo and encrypted to produce a PKCS#8 EncryptedPrivateKeyInfo.
	* This is the standard, preferred way to encrypt a private key.
	*
	* To produce a non-standard PEM-encrypted private key that uses encapsulated
	* headers to indicate the encryption algorithm (old-style non-PKCS#8 OpenSSL
	* private key encryption), set the 'legacy' option to true. Note: Using this
	* option will cause the iteration count to be forced to 1.
	*
	* Note: The 'des' algorithm is supported, but it is not considered to be
	* secure because it only uses a single 56-bit key. If possible, it is highly
	* recommended that a different algorithm be used.
	*
	* @param rsaKey the RSA key to encrypt.
	* @param password the password to use.
	* @param options:
	*          algorithm: the encryption algorithm to use
	*            ('aes128', 'aes192', 'aes256', '3des', 'des').
	*          count: the iteration count to use.
	*          saltSize: the salt size to use.
	*          legacy: output an old non-PKCS#8 PEM-encrypted+encapsulated
	*            headers (DEK-Info) private key.
	*
	* @return the PEM-encoded ASN.1 EncryptedPrivateKeyInfo.
	*/
	pki.encryptRsaPrivateKey = function(rsaKey, password, options) {
		options = options || {};
		if (!options.legacy) {
			var rval = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(rsaKey));
			rval = pki.encryptPrivateKeyInfo(rval, password, options);
			return pki.encryptedPrivateKeyToPem(rval);
		}
		var algorithm;
		var iv;
		var dkLen;
		var cipherFn;
		switch (options.algorithm) {
			case "aes128":
				algorithm = "AES-128-CBC";
				dkLen = 16;
				iv = forge.random.getBytesSync(16);
				cipherFn = forge.aes.createEncryptionCipher;
				break;
			case "aes192":
				algorithm = "AES-192-CBC";
				dkLen = 24;
				iv = forge.random.getBytesSync(16);
				cipherFn = forge.aes.createEncryptionCipher;
				break;
			case "aes256":
				algorithm = "AES-256-CBC";
				dkLen = 32;
				iv = forge.random.getBytesSync(16);
				cipherFn = forge.aes.createEncryptionCipher;
				break;
			case "3des":
				algorithm = "DES-EDE3-CBC";
				dkLen = 24;
				iv = forge.random.getBytesSync(8);
				cipherFn = forge.des.createEncryptionCipher;
				break;
			case "des":
				algorithm = "DES-CBC";
				dkLen = 8;
				iv = forge.random.getBytesSync(8);
				cipherFn = forge.des.createEncryptionCipher;
				break;
			default:
				var error = /* @__PURE__ */ new Error("Could not encrypt RSA private key; unsupported encryption algorithm \"" + options.algorithm + "\".");
				error.algorithm = options.algorithm;
				throw error;
		}
		var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
		var cipher = cipherFn(dk);
		cipher.start(iv);
		cipher.update(asn1.toDer(pki.privateKeyToAsn1(rsaKey)));
		cipher.finish();
		var msg = {
			type: "RSA PRIVATE KEY",
			procType: {
				version: "4",
				type: "ENCRYPTED"
			},
			dekInfo: {
				algorithm,
				parameters: forge.util.bytesToHex(iv).toUpperCase()
			},
			body: cipher.output.getBytes()
		};
		return forge.pem.encode(msg);
	};
	/**
	* Decrypts an RSA private key.
	*
	* @param pem the PEM-formatted EncryptedPrivateKeyInfo to decrypt.
	* @param password the password to use.
	*
	* @return the RSA key on success, null on failure.
	*/
	pki.decryptRsaPrivateKey = function(pem, password) {
		var rval = null;
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "ENCRYPTED PRIVATE KEY" && msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
			var error = /* @__PURE__ */ new Error("Could not convert private key from PEM; PEM header type is not \"ENCRYPTED PRIVATE KEY\", \"PRIVATE KEY\", or \"RSA PRIVATE KEY\".");
			error.headerType = error;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") {
			var dkLen;
			var cipherFn;
			switch (msg.dekInfo.algorithm) {
				case "DES-CBC":
					dkLen = 8;
					cipherFn = forge.des.createDecryptionCipher;
					break;
				case "DES-EDE3-CBC":
					dkLen = 24;
					cipherFn = forge.des.createDecryptionCipher;
					break;
				case "AES-128-CBC":
					dkLen = 16;
					cipherFn = forge.aes.createDecryptionCipher;
					break;
				case "AES-192-CBC":
					dkLen = 24;
					cipherFn = forge.aes.createDecryptionCipher;
					break;
				case "AES-256-CBC":
					dkLen = 32;
					cipherFn = forge.aes.createDecryptionCipher;
					break;
				case "RC2-40-CBC":
					dkLen = 5;
					cipherFn = function(key) {
						return forge.rc2.createDecryptionCipher(key, 40);
					};
					break;
				case "RC2-64-CBC":
					dkLen = 8;
					cipherFn = function(key) {
						return forge.rc2.createDecryptionCipher(key, 64);
					};
					break;
				case "RC2-128-CBC":
					dkLen = 16;
					cipherFn = function(key) {
						return forge.rc2.createDecryptionCipher(key, 128);
					};
					break;
				default:
					var error = /* @__PURE__ */ new Error("Could not decrypt private key; unsupported encryption algorithm \"" + msg.dekInfo.algorithm + "\".");
					error.algorithm = msg.dekInfo.algorithm;
					throw error;
			}
			var iv = forge.util.hexToBytes(msg.dekInfo.parameters);
			var dk = forge.pbe.opensslDeriveBytes(password, iv.substr(0, 8), dkLen);
			var cipher = cipherFn(dk);
			cipher.start(iv);
			cipher.update(forge.util.createBuffer(msg.body));
			if (cipher.finish()) rval = cipher.output.getBytes();
			else return rval;
		} else rval = msg.body;
		if (msg.type === "ENCRYPTED PRIVATE KEY") rval = pki.decryptPrivateKeyInfo(asn1.fromDer(rval), password);
		else rval = asn1.fromDer(rval);
		if (rval !== null) rval = pki.privateKeyFromAsn1(rval);
		return rval;
	};
	/**
	* Derives a PKCS#12 key.
	*
	* @param password the password to derive the key material from, null or
	*          undefined for none.
	* @param salt the salt, as a ByteBuffer, to use.
	* @param id the PKCS#12 ID byte (1 = key material, 2 = IV, 3 = MAC).
	* @param iter the iteration count.
	* @param n the number of bytes to derive from the password.
	* @param md the message digest to use, defaults to SHA-1.
	*
	* @return a ByteBuffer with the bytes derived from the password.
	*/
	pki.pbe.generatePkcs12Key = function(password, salt, id, iter, n, md) {
		var j, l;
		if (typeof md === "undefined" || md === null) {
			if (!("sha1" in forge.md)) throw new Error("\"sha1\" hash algorithm unavailable.");
			md = forge.md.sha1.create();
		}
		var u = md.digestLength;
		var v = md.blockLength;
		var result = new forge.util.ByteBuffer();
		var passBuf = new forge.util.ByteBuffer();
		if (password !== null && password !== void 0) {
			for (l = 0; l < password.length; l++) passBuf.putInt16(password.charCodeAt(l));
			passBuf.putInt16(0);
		}
		var p = passBuf.length();
		var s = salt.length();
		var D = new forge.util.ByteBuffer();
		D.fillWithByte(id, v);
		var Slen = v * Math.ceil(s / v);
		var S = new forge.util.ByteBuffer();
		for (l = 0; l < Slen; l++) S.putByte(salt.at(l % s));
		var Plen = v * Math.ceil(p / v);
		var P = new forge.util.ByteBuffer();
		for (l = 0; l < Plen; l++) P.putByte(passBuf.at(l % p));
		var I = S;
		I.putBuffer(P);
		var c = Math.ceil(n / u);
		for (var i = 1; i <= c; i++) {
			var buf = new forge.util.ByteBuffer();
			buf.putBytes(D.bytes());
			buf.putBytes(I.bytes());
			for (var round = 0; round < iter; round++) {
				md.start();
				md.update(buf.getBytes());
				buf = md.digest();
			}
			var B = new forge.util.ByteBuffer();
			for (l = 0; l < v; l++) B.putByte(buf.at(l % u));
			var k = Math.ceil(s / v) + Math.ceil(p / v);
			var Inew = new forge.util.ByteBuffer();
			for (j = 0; j < k; j++) {
				var chunk = new forge.util.ByteBuffer(I.getBytes(v));
				var x = 511;
				for (l = B.length() - 1; l >= 0; l--) {
					x = x >> 8;
					x += B.at(l) + chunk.at(l);
					chunk.setAt(l, x & 255);
				}
				Inew.putBuffer(chunk);
			}
			I = Inew;
			result.putBuffer(buf);
		}
		result.truncate(result.length() - n);
		return result;
	};
	/**
	* Get new Forge cipher object instance.
	*
	* @param oid the OID (in string notation).
	* @param params the ASN.1 params object.
	* @param password the password to decrypt with.
	*
	* @return new cipher object instance.
	*/
	pki.pbe.getCipher = function(oid, params, password) {
		switch (oid) {
			case pki.oids["pkcs5PBES2"]: return pki.pbe.getCipherForPBES2(oid, params, password);
			case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
			case pki.oids["pbewithSHAAnd40BitRC2-CBC"]: return pki.pbe.getCipherForPKCS12PBE(oid, params, password);
			default:
				var error = /* @__PURE__ */ new Error("Cannot read encrypted PBE data block. Unsupported OID.");
				error.oid = oid;
				error.supportedOids = [
					"pkcs5PBES2",
					"pbeWithSHAAnd3-KeyTripleDES-CBC",
					"pbewithSHAAnd40BitRC2-CBC"
				];
				throw error;
		}
	};
	/**
	* Get new Forge cipher object instance according to PBES2 params block.
	*
	* The returned cipher instance is already started using the IV
	* from PBES2 parameter block.
	*
	* @param oid the PKCS#5 PBKDF2 OID (in string notation).
	* @param params the ASN.1 PBES2-params object.
	* @param password the password to decrypt with.
	*
	* @return new cipher object instance.
	*/
	pki.pbe.getCipherForPBES2 = function(oid, params, password) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(params, PBES2AlgorithmsValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
			error.errors = errors;
			throw error;
		}
		oid = asn1.derToOid(capture.kdfOid);
		if (oid !== pki.oids["pkcs5PBKDF2"]) {
			var error = /* @__PURE__ */ new Error("Cannot read encrypted private key. Unsupported key derivation function OID.");
			error.oid = oid;
			error.supportedOids = ["pkcs5PBKDF2"];
			throw error;
		}
		oid = asn1.derToOid(capture.encOid);
		if (oid !== pki.oids["aes128-CBC"] && oid !== pki.oids["aes192-CBC"] && oid !== pki.oids["aes256-CBC"] && oid !== pki.oids["des-EDE3-CBC"] && oid !== pki.oids["desCBC"]) {
			var error = /* @__PURE__ */ new Error("Cannot read encrypted private key. Unsupported encryption scheme OID.");
			error.oid = oid;
			error.supportedOids = [
				"aes128-CBC",
				"aes192-CBC",
				"aes256-CBC",
				"des-EDE3-CBC",
				"desCBC"
			];
			throw error;
		}
		var salt = capture.kdfSalt;
		var count = forge.util.createBuffer(capture.kdfIterationCount);
		count = count.getInt(count.length() << 3);
		var dkLen;
		var cipherFn;
		switch (pki.oids[oid]) {
			case "aes128-CBC":
				dkLen = 16;
				cipherFn = forge.aes.createDecryptionCipher;
				break;
			case "aes192-CBC":
				dkLen = 24;
				cipherFn = forge.aes.createDecryptionCipher;
				break;
			case "aes256-CBC":
				dkLen = 32;
				cipherFn = forge.aes.createDecryptionCipher;
				break;
			case "des-EDE3-CBC":
				dkLen = 24;
				cipherFn = forge.des.createDecryptionCipher;
				break;
			case "desCBC":
				dkLen = 8;
				cipherFn = forge.des.createDecryptionCipher;
				break;
		}
		var md = prfOidToMessageDigest(capture.prfOid);
		var dk = forge.pkcs5.pbkdf2(password, salt, count, dkLen, md);
		var iv = capture.encIv;
		var cipher = cipherFn(dk);
		cipher.start(iv);
		return cipher;
	};
	/**
	* Get new Forge cipher object instance for PKCS#12 PBE.
	*
	* The returned cipher instance is already started using the key & IV
	* derived from the provided password and PKCS#12 PBE salt.
	*
	* @param oid The PKCS#12 PBE OID (in string notation).
	* @param params The ASN.1 PKCS#12 PBE-params object.
	* @param password The password to decrypt with.
	*
	* @return the new cipher object instance.
	*/
	pki.pbe.getCipherForPKCS12PBE = function(oid, params, password) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(params, pkcs12PbeParamsValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read password-based-encryption algorithm parameters. ASN.1 object is not a supported EncryptedPrivateKeyInfo.");
			error.errors = errors;
			throw error;
		}
		var salt = forge.util.createBuffer(capture.salt);
		var count = forge.util.createBuffer(capture.iterations);
		count = count.getInt(count.length() << 3);
		var dkLen, dIvLen, cipherFn;
		switch (oid) {
			case pki.oids["pbeWithSHAAnd3-KeyTripleDES-CBC"]:
				dkLen = 24;
				dIvLen = 8;
				cipherFn = forge.des.startDecrypting;
				break;
			case pki.oids["pbewithSHAAnd40BitRC2-CBC"]:
				dkLen = 5;
				dIvLen = 8;
				cipherFn = function(key, iv) {
					var cipher = forge.rc2.createDecryptionCipher(key, 40);
					cipher.start(iv, null);
					return cipher;
				};
				break;
			default:
				var error = /* @__PURE__ */ new Error("Cannot read PKCS #12 PBE data block. Unsupported OID.");
				error.oid = oid;
				throw error;
		}
		var md = prfOidToMessageDigest(capture.prfOid);
		var key = pki.pbe.generatePkcs12Key(password, salt, 1, count, dkLen, md);
		md.start();
		var iv = pki.pbe.generatePkcs12Key(password, salt, 2, count, dIvLen, md);
		return cipherFn(key, iv);
	};
	/**
	* OpenSSL's legacy key derivation function.
	*
	* See: http://www.openssl.org/docs/crypto/EVP_BytesToKey.html
	*
	* @param password the password to derive the key from.
	* @param salt the salt to use, null for none.
	* @param dkLen the number of bytes needed for the derived key.
	* @param [options] the options to use:
	*          [md] an optional message digest object to use.
	*/
	pki.pbe.opensslDeriveBytes = function(password, salt, dkLen, md) {
		if (typeof md === "undefined" || md === null) {
			if (!("md5" in forge.md)) throw new Error("\"md5\" hash algorithm unavailable.");
			md = forge.md.md5.create();
		}
		if (salt === null) salt = "";
		var digests = [hash(md, password + salt)];
		for (var length = 16, i = 1; length < dkLen; ++i, length += 16) digests.push(hash(md, digests[i - 1] + password + salt));
		return digests.join("").substr(0, dkLen);
	};
	function hash(md, bytes) {
		return md.start().update(bytes).digest().getBytes();
	}
	function prfOidToMessageDigest(prfOid) {
		var prfAlgorithm;
		if (!prfOid) prfAlgorithm = "hmacWithSHA1";
		else {
			prfAlgorithm = pki.oids[asn1.derToOid(prfOid)];
			if (!prfAlgorithm) {
				var error = /* @__PURE__ */ new Error("Unsupported PRF OID.");
				error.oid = prfOid;
				error.supported = [
					"hmacWithSHA1",
					"hmacWithSHA224",
					"hmacWithSHA256",
					"hmacWithSHA384",
					"hmacWithSHA512"
				];
				throw error;
			}
		}
		return prfAlgorithmToMessageDigest(prfAlgorithm);
	}
	function prfAlgorithmToMessageDigest(prfAlgorithm) {
		var factory = forge.md;
		switch (prfAlgorithm) {
			case "hmacWithSHA224": factory = forge.md.sha512;
			case "hmacWithSHA1":
			case "hmacWithSHA256":
			case "hmacWithSHA384":
			case "hmacWithSHA512":
				prfAlgorithm = prfAlgorithm.substr(8).toLowerCase();
				break;
			default:
				var error = /* @__PURE__ */ new Error("Unsupported PRF algorithm.");
				error.algorithm = prfAlgorithm;
				error.supported = [
					"hmacWithSHA1",
					"hmacWithSHA224",
					"hmacWithSHA256",
					"hmacWithSHA384",
					"hmacWithSHA512"
				];
				throw error;
		}
		if (!factory || !(prfAlgorithm in factory)) throw new Error("Unknown hash algorithm: " + prfAlgorithm);
		return factory[prfAlgorithm].create();
	}
	function createPbkdf2Params(salt, countBytes, dkLen, prfAlgorithm) {
		var params = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, salt), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, countBytes.getBytes())]);
		if (prfAlgorithm !== "hmacWithSHA1") params.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(dkLen.toString(16))), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids[prfAlgorithm]).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]));
		return params;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/pkcs7asn1.js
var require_pkcs7asn1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of ASN.1 validators for PKCS#7 v1.5.
	*
	* @author Dave Longley
	* @author Stefan Siegl
	*
	* Copyright (c) 2012-2015 Digital Bazaar, Inc.
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	*
	* The ASN.1 representation of PKCS#7 is as follows
	* (see RFC #2315 for details, http://www.ietf.org/rfc/rfc2315.txt):
	*
	* A PKCS#7 message consists of a ContentInfo on root level, which may
	* contain any number of further ContentInfo nested into it.
	*
	* ContentInfo ::= SEQUENCE {
	*   contentType                ContentType,
	*   content               [0]  EXPLICIT ANY DEFINED BY contentType OPTIONAL
	* }
	*
	* ContentType ::= OBJECT IDENTIFIER
	*
	* EnvelopedData ::= SEQUENCE {
	*   version                    Version,
	*   recipientInfos             RecipientInfos,
	*   encryptedContentInfo       EncryptedContentInfo
	* }
	*
	* EncryptedData ::= SEQUENCE {
	*   version                    Version,
	*   encryptedContentInfo       EncryptedContentInfo
	* }
	*
	* id-signedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
	*   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 2 }
	*
	* SignedData ::= SEQUENCE {
	*   version           INTEGER,
	*   digestAlgorithms  DigestAlgorithmIdentifiers,
	*   contentInfo       ContentInfo,
	*   certificates      [0] IMPLICIT Certificates OPTIONAL,
	*   crls              [1] IMPLICIT CertificateRevocationLists OPTIONAL,
	*   signerInfos       SignerInfos
	* }
	*
	* SignerInfos ::= SET OF SignerInfo
	*
	* SignerInfo ::= SEQUENCE {
	*   version                    Version,
	*   issuerAndSerialNumber      IssuerAndSerialNumber,
	*   digestAlgorithm            DigestAlgorithmIdentifier,
	*   authenticatedAttributes    [0] IMPLICIT Attributes OPTIONAL,
	*   digestEncryptionAlgorithm  DigestEncryptionAlgorithmIdentifier,
	*   encryptedDigest            EncryptedDigest,
	*   unauthenticatedAttributes  [1] IMPLICIT Attributes OPTIONAL
	* }
	*
	* EncryptedDigest ::= OCTET STRING
	*
	* Attributes ::= SET OF Attribute
	*
	* Attribute ::= SEQUENCE {
	*   attrType    OBJECT IDENTIFIER,
	*   attrValues  SET OF AttributeValue
	* }
	*
	* AttributeValue ::= ANY
	*
	* Version ::= INTEGER
	*
	* RecipientInfos ::= SET OF RecipientInfo
	*
	* EncryptedContentInfo ::= SEQUENCE {
	*   contentType                 ContentType,
	*   contentEncryptionAlgorithm  ContentEncryptionAlgorithmIdentifier,
	*   encryptedContent       [0]  IMPLICIT EncryptedContent OPTIONAL
	* }
	*
	* ContentEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
	*
	* The AlgorithmIdentifier contains an Object Identifier (OID) and parameters
	* for the algorithm, if any. In the case of AES and DES3, there is only one,
	* the IV.
	*
	* AlgorithmIdentifer ::= SEQUENCE {
	*    algorithm OBJECT IDENTIFIER,
	*    parameters ANY DEFINED BY algorithm OPTIONAL
	* }
	*
	* EncryptedContent ::= OCTET STRING
	*
	* RecipientInfo ::= SEQUENCE {
	*   version                     Version,
	*   issuerAndSerialNumber       IssuerAndSerialNumber,
	*   keyEncryptionAlgorithm      KeyEncryptionAlgorithmIdentifier,
	*   encryptedKey                EncryptedKey
	* }
	*
	* IssuerAndSerialNumber ::= SEQUENCE {
	*   issuer                      Name,
	*   serialNumber                CertificateSerialNumber
	* }
	*
	* CertificateSerialNumber ::= INTEGER
	*
	* KeyEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
	*
	* EncryptedKey ::= OCTET STRING
	*/
	var forge = require_forge();
	require_asn1();
	require_util();
	var asn1 = forge.asn1;
	var p7v = module.exports = forge.pkcs7asn1 = forge.pkcs7asn1 || {};
	forge.pkcs7 = forge.pkcs7 || {};
	forge.pkcs7.asn1 = p7v;
	var contentInfoValidator = {
		name: "ContentInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "ContentInfo.ContentType",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OID,
			constructed: false,
			capture: "contentType"
		}, {
			name: "ContentInfo.content",
			tagClass: asn1.Class.CONTEXT_SPECIFIC,
			type: 0,
			constructed: true,
			optional: true,
			captureAsn1: "content"
		}]
	};
	p7v.contentInfoValidator = contentInfoValidator;
	var encryptedContentInfoValidator = {
		name: "EncryptedContentInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "EncryptedContentInfo.contentType",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "contentType"
			},
			{
				name: "EncryptedContentInfo.contentEncryptionAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "EncryptedContentInfo.contentEncryptionAlgorithm.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "encAlgorithm"
				}, {
					name: "EncryptedContentInfo.contentEncryptionAlgorithm.parameter",
					tagClass: asn1.Class.UNIVERSAL,
					captureAsn1: "encParameter"
				}]
			},
			{
				name: "EncryptedContentInfo.encryptedContent",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 0,
				capture: "encryptedContent",
				captureAsn1: "encryptedContentAsn1"
			}
		]
	};
	p7v.envelopedDataValidator = {
		name: "EnvelopedData",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "EnvelopedData.Version",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.INTEGER,
			constructed: false,
			capture: "version"
		}, {
			name: "EnvelopedData.RecipientInfos",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SET,
			constructed: true,
			captureAsn1: "recipientInfos"
		}].concat(encryptedContentInfoValidator)
	};
	p7v.encryptedDataValidator = {
		name: "EncryptedData",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "EncryptedData.Version",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.INTEGER,
			constructed: false,
			capture: "version"
		}].concat(encryptedContentInfoValidator)
	};
	var signerValidator = {
		name: "SignerInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "SignerInfo.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false
			},
			{
				name: "SignerInfo.issuerAndSerialNumber",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "SignerInfo.issuerAndSerialNumber.issuer",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.SEQUENCE,
					constructed: true,
					captureAsn1: "issuer"
				}, {
					name: "SignerInfo.issuerAndSerialNumber.serialNumber",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.INTEGER,
					constructed: false,
					capture: "serial"
				}]
			},
			{
				name: "SignerInfo.digestAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "SignerInfo.digestAlgorithm.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "digestAlgorithm"
				}, {
					name: "SignerInfo.digestAlgorithm.parameter",
					tagClass: asn1.Class.UNIVERSAL,
					constructed: false,
					captureAsn1: "digestParameter",
					optional: true
				}]
			},
			{
				name: "SignerInfo.authenticatedAttributes",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 0,
				constructed: true,
				optional: true,
				capture: "authenticatedAttributes"
			},
			{
				name: "SignerInfo.digestEncryptionAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				capture: "signatureAlgorithm"
			},
			{
				name: "SignerInfo.encryptedDigest",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OCTETSTRING,
				constructed: false,
				capture: "signature"
			},
			{
				name: "SignerInfo.unauthenticatedAttributes",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 1,
				constructed: true,
				optional: true,
				capture: "unauthenticatedAttributes"
			}
		]
	};
	p7v.signedDataValidator = {
		name: "SignedData",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "SignedData.Version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "version"
			},
			{
				name: "SignedData.DigestAlgorithms",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SET,
				constructed: true,
				captureAsn1: "digestAlgorithms"
			},
			contentInfoValidator,
			{
				name: "SignedData.Certificates",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 0,
				optional: true,
				captureAsn1: "certificates"
			},
			{
				name: "SignedData.CertificateRevocationLists",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 1,
				optional: true,
				captureAsn1: "crls"
			},
			{
				name: "SignedData.SignerInfos",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SET,
				capture: "signerInfos",
				optional: true,
				value: [signerValidator]
			}
		]
	};
	p7v.recipientInfoValidator = {
		name: "RecipientInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "RecipientInfo.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "version"
			},
			{
				name: "RecipientInfo.issuerAndSerial",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "RecipientInfo.issuerAndSerial.issuer",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.SEQUENCE,
					constructed: true,
					captureAsn1: "issuer"
				}, {
					name: "RecipientInfo.issuerAndSerial.serialNumber",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.INTEGER,
					constructed: false,
					capture: "serial"
				}]
			},
			{
				name: "RecipientInfo.keyEncryptionAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "RecipientInfo.keyEncryptionAlgorithm.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "encAlgorithm"
				}, {
					name: "RecipientInfo.keyEncryptionAlgorithm.parameter",
					tagClass: asn1.Class.UNIVERSAL,
					constructed: false,
					captureAsn1: "encParameter",
					optional: true
				}]
			},
			{
				name: "RecipientInfo.encryptedKey",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OCTETSTRING,
				constructed: false,
				capture: "encKey"
			}
		]
	};
}));
//#endregion
//#region node_modules/node-forge/lib/mgf1.js
var require_mgf1 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of mask generation function MGF1.
	*
	* @author Stefan Siegl
	* @author Dave Longley
	*
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	* Copyright (c) 2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	forge.mgf = forge.mgf || {};
	var mgf1 = module.exports = forge.mgf.mgf1 = forge.mgf1 = forge.mgf1 || {};
	/**
	* Creates a MGF1 mask generation function object.
	*
	* @param md the message digest API to use (eg: forge.md.sha1.create()).
	*
	* @return a mask generation function object.
	*/
	mgf1.create = function(md) {
		return { 
		/**
		* Generate mask of specified length.
		*
		* @param {String} seed The seed for mask generation.
		* @param maskLen Number of bytes to generate.
		* @return {String} The generated mask.
		*/
generate: function(seed, maskLen) {
			var t = new forge.util.ByteBuffer();
			var len = Math.ceil(maskLen / md.digestLength);
			for (var i = 0; i < len; i++) {
				var c = new forge.util.ByteBuffer();
				c.putInt32(i);
				md.start();
				md.update(seed + c.getBytes());
				t.putBuffer(md.digest());
			}
			t.truncate(t.length() - maskLen);
			return t.getBytes();
		} };
	};
}));
//#endregion
//#region node_modules/node-forge/lib/mgf.js
var require_mgf = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Node.js module for Forge mask generation functions.
	*
	* @author Stefan Siegl
	*
	* Copyright 2012 Stefan Siegl <stesie@brokenpipe.de>
	*/
	var forge = require_forge();
	require_mgf1();
	module.exports = forge.mgf = forge.mgf || {};
	forge.mgf.mgf1 = forge.mgf1;
}));
//#endregion
//#region node_modules/node-forge/lib/pss.js
var require_pss = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of PKCS#1 PSS signature padding.
	*
	* @author Stefan Siegl
	*
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	*/
	var forge = require_forge();
	require_random();
	require_util();
	var pss = module.exports = forge.pss = forge.pss || {};
	/**
	* Creates a PSS signature scheme object.
	*
	* There are several ways to provide a salt for encoding:
	*
	* 1. Specify the saltLength only and the built-in PRNG will generate it.
	* 2. Specify the saltLength and a custom PRNG with 'getBytesSync' defined that
	*   will be used.
	* 3. Specify the salt itself as a forge.util.ByteBuffer.
	*
	* @param options the options to use:
	*          md the message digest object to use, a forge md instance.
	*          mgf the mask generation function to use, a forge mgf instance.
	*          [saltLength] the length of the salt in octets.
	*          [prng] the pseudo-random number generator to use to produce a salt.
	*          [salt] the salt to use when encoding.
	*
	* @return a signature scheme object.
	*/
	pss.create = function(options) {
		if (arguments.length === 3) options = {
			md: arguments[0],
			mgf: arguments[1],
			saltLength: arguments[2]
		};
		var hash = options.md;
		var mgf = options.mgf;
		var hLen = hash.digestLength;
		var salt_ = options.salt || null;
		if (typeof salt_ === "string") salt_ = forge.util.createBuffer(salt_);
		var sLen;
		if ("saltLength" in options) sLen = options.saltLength;
		else if (salt_ !== null) sLen = salt_.length();
		else throw new Error("Salt length not specified or specific salt not given.");
		if (salt_ !== null && salt_.length() !== sLen) throw new Error("Given salt length does not match length of given salt.");
		var prng = options.prng || forge.random;
		var pssobj = {};
		/**
		* Encodes a PSS signature.
		*
		* This function implements EMSA-PSS-ENCODE as per RFC 3447, section 9.1.1.
		*
		* @param md the message digest object with the hash to sign.
		* @param modsBits the length of the RSA modulus in bits.
		*
		* @return the encoded message as a binary-encoded string of length
		*           ceil((modBits - 1) / 8).
		*/
		pssobj.encode = function(md, modBits) {
			var i;
			var emBits = modBits - 1;
			var emLen = Math.ceil(emBits / 8);
			var mHash = md.digest().getBytes();
			if (emLen < hLen + sLen + 2) throw new Error("Message is too long to encrypt.");
			var salt;
			if (salt_ === null) salt = prng.getBytesSync(sLen);
			else salt = salt_.bytes();
			var m_ = new forge.util.ByteBuffer();
			m_.fillWithByte(0, 8);
			m_.putBytes(mHash);
			m_.putBytes(salt);
			hash.start();
			hash.update(m_.getBytes());
			var h = hash.digest().getBytes();
			var ps = new forge.util.ByteBuffer();
			ps.fillWithByte(0, emLen - sLen - hLen - 2);
			ps.putByte(1);
			ps.putBytes(salt);
			var db = ps.getBytes();
			var maskLen = emLen - hLen - 1;
			var dbMask = mgf.generate(h, maskLen);
			var maskedDB = "";
			for (i = 0; i < maskLen; i++) maskedDB += String.fromCharCode(db.charCodeAt(i) ^ dbMask.charCodeAt(i));
			var mask = 65280 >> 8 * emLen - emBits & 255;
			maskedDB = String.fromCharCode(maskedDB.charCodeAt(0) & ~mask) + maskedDB.substr(1);
			return maskedDB + h + String.fromCharCode(188);
		};
		/**
		* Verifies a PSS signature.
		*
		* This function implements EMSA-PSS-VERIFY as per RFC 3447, section 9.1.2.
		*
		* @param mHash the message digest hash, as a binary-encoded string, to
		*         compare against the signature.
		* @param em the encoded message, as a binary-encoded string
		*          (RSA decryption result).
		* @param modsBits the length of the RSA modulus in bits.
		*
		* @return true if the signature was verified, false if not.
		*/
		pssobj.verify = function(mHash, em, modBits) {
			var i;
			var emBits = modBits - 1;
			var emLen = Math.ceil(emBits / 8);
			em = em.substr(-emLen);
			if (emLen < hLen + sLen + 2) throw new Error("Inconsistent parameters to PSS signature verification.");
			if (em.charCodeAt(emLen - 1) !== 188) throw new Error("Encoded message does not end in 0xBC.");
			var maskLen = emLen - hLen - 1;
			var maskedDB = em.substr(0, maskLen);
			var h = em.substr(maskLen, hLen);
			var mask = 65280 >> 8 * emLen - emBits & 255;
			if ((maskedDB.charCodeAt(0) & mask) !== 0) throw new Error("Bits beyond keysize not zero as expected.");
			var dbMask = mgf.generate(h, maskLen);
			var db = "";
			for (i = 0; i < maskLen; i++) db += String.fromCharCode(maskedDB.charCodeAt(i) ^ dbMask.charCodeAt(i));
			db = String.fromCharCode(db.charCodeAt(0) & ~mask) + db.substr(1);
			var checkLen = emLen - hLen - sLen - 2;
			for (i = 0; i < checkLen; i++) if (db.charCodeAt(i) !== 0) throw new Error("Leftmost octets not zero as expected");
			if (db.charCodeAt(checkLen) !== 1) throw new Error("Inconsistent PSS signature, 0x01 marker not found");
			var salt = db.substr(-sLen);
			var m_ = new forge.util.ByteBuffer();
			m_.fillWithByte(0, 8);
			m_.putBytes(mHash);
			m_.putBytes(salt);
			hash.start();
			hash.update(m_.getBytes());
			return h === hash.digest().getBytes();
		};
		return pssobj;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/x509.js
var require_x509 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of X.509 and related components (such as
	* Certification Signing Requests) of a Public Key Infrastructure.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	*
	* The ASN.1 representation of an X.509v3 certificate is as follows
	* (see RFC 2459):
	*
	* Certificate ::= SEQUENCE {
	*   tbsCertificate       TBSCertificate,
	*   signatureAlgorithm   AlgorithmIdentifier,
	*   signatureValue       BIT STRING
	* }
	*
	* TBSCertificate ::= SEQUENCE {
	*   version         [0]  EXPLICIT Version DEFAULT v1,
	*   serialNumber         CertificateSerialNumber,
	*   signature            AlgorithmIdentifier,
	*   issuer               Name,
	*   validity             Validity,
	*   subject              Name,
	*   subjectPublicKeyInfo SubjectPublicKeyInfo,
	*   issuerUniqueID  [1]  IMPLICIT UniqueIdentifier OPTIONAL,
	*                        -- If present, version shall be v2 or v3
	*   subjectUniqueID [2]  IMPLICIT UniqueIdentifier OPTIONAL,
	*                        -- If present, version shall be v2 or v3
	*   extensions      [3]  EXPLICIT Extensions OPTIONAL
	*                        -- If present, version shall be v3
	* }
	*
	* Version ::= INTEGER  { v1(0), v2(1), v3(2) }
	*
	* CertificateSerialNumber ::= INTEGER
	*
	* Name ::= CHOICE {
	*   // only one possible choice for now
	*   RDNSequence
	* }
	*
	* RDNSequence ::= SEQUENCE OF RelativeDistinguishedName
	*
	* RelativeDistinguishedName ::= SET OF AttributeTypeAndValue
	*
	* AttributeTypeAndValue ::= SEQUENCE {
	*   type     AttributeType,
	*   value    AttributeValue
	* }
	* AttributeType ::= OBJECT IDENTIFIER
	* AttributeValue ::= ANY DEFINED BY AttributeType
	*
	* Validity ::= SEQUENCE {
	*   notBefore      Time,
	*   notAfter       Time
	* }
	*
	* Time ::= CHOICE {
	*   utcTime        UTCTime,
	*   generalTime    GeneralizedTime
	* }
	*
	* UniqueIdentifier ::= BIT STRING
	*
	* SubjectPublicKeyInfo ::= SEQUENCE {
	*   algorithm            AlgorithmIdentifier,
	*   subjectPublicKey     BIT STRING
	* }
	*
	* Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension
	*
	* Extension ::= SEQUENCE {
	*   extnID      OBJECT IDENTIFIER,
	*   critical    BOOLEAN DEFAULT FALSE,
	*   extnValue   OCTET STRING
	* }
	*
	* The only key algorithm currently supported for PKI is RSA.
	*
	* RSASSA-PSS signatures are described in RFC 3447 and RFC 4055.
	*
	* PKCS#10 v1.7 describes certificate signing requests:
	*
	* CertificationRequestInfo:
	*
	* CertificationRequestInfo ::= SEQUENCE {
	*   version       INTEGER { v1(0) } (v1,...),
	*   subject       Name,
	*   subjectPKInfo SubjectPublicKeyInfo{{ PKInfoAlgorithms }},
	*   attributes    [0] Attributes{{ CRIAttributes }}
	* }
	*
	* Attributes { ATTRIBUTE:IOSet } ::= SET OF Attribute{{ IOSet }}
	*
	* CRIAttributes  ATTRIBUTE  ::= {
	*   ... -- add any locally defined attributes here -- }
	*
	* Attribute { ATTRIBUTE:IOSet } ::= SEQUENCE {
	*   type   ATTRIBUTE.&id({IOSet}),
	*   values SET SIZE(1..MAX) OF ATTRIBUTE.&Type({IOSet}{@type})
	* }
	*
	* CertificationRequest ::= SEQUENCE {
	*   certificationRequestInfo CertificationRequestInfo,
	*   signatureAlgorithm AlgorithmIdentifier{{ SignatureAlgorithms }},
	*   signature          BIT STRING
	* }
	*/
	var forge = require_forge();
	require_aes();
	require_asn1();
	require_des();
	require_md();
	require_mgf();
	require_oids();
	require_pem();
	require_pss();
	require_rsa();
	require_util();
	var asn1 = forge.asn1;
	var pki = module.exports = forge.pki = forge.pki || {};
	var oids = pki.oids;
	var _shortNames = {};
	_shortNames["CN"] = oids["commonName"];
	_shortNames["commonName"] = "CN";
	_shortNames["C"] = oids["countryName"];
	_shortNames["countryName"] = "C";
	_shortNames["L"] = oids["localityName"];
	_shortNames["localityName"] = "L";
	_shortNames["ST"] = oids["stateOrProvinceName"];
	_shortNames["stateOrProvinceName"] = "ST";
	_shortNames["O"] = oids["organizationName"];
	_shortNames["organizationName"] = "O";
	_shortNames["OU"] = oids["organizationalUnitName"];
	_shortNames["organizationalUnitName"] = "OU";
	_shortNames["E"] = oids["emailAddress"];
	_shortNames["emailAddress"] = "E";
	var publicKeyValidator = forge.pki.rsa.publicKeyValidator;
	var x509CertificateValidator = {
		name: "Certificate",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "Certificate.TBSCertificate",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				captureAsn1: "tbsCertificate",
				value: [
					{
						name: "Certificate.TBSCertificate.version",
						tagClass: asn1.Class.CONTEXT_SPECIFIC,
						type: 0,
						constructed: true,
						optional: true,
						value: [{
							name: "Certificate.TBSCertificate.version.integer",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.INTEGER,
							constructed: false,
							capture: "certVersion"
						}]
					},
					{
						name: "Certificate.TBSCertificate.serialNumber",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.INTEGER,
						constructed: false,
						capture: "certSerialNumber"
					},
					{
						name: "Certificate.TBSCertificate.signature",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						value: [{
							name: "Certificate.TBSCertificate.signature.algorithm",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.OID,
							constructed: false,
							capture: "certinfoSignatureOid"
						}, {
							name: "Certificate.TBSCertificate.signature.parameters",
							tagClass: asn1.Class.UNIVERSAL,
							optional: true,
							captureAsn1: "certinfoSignatureParams"
						}]
					},
					{
						name: "Certificate.TBSCertificate.issuer",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						captureAsn1: "certIssuer"
					},
					{
						name: "Certificate.TBSCertificate.validity",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						value: [
							{
								name: "Certificate.TBSCertificate.validity.notBefore (utc)",
								tagClass: asn1.Class.UNIVERSAL,
								type: asn1.Type.UTCTIME,
								constructed: false,
								optional: true,
								capture: "certValidity1UTCTime"
							},
							{
								name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
								tagClass: asn1.Class.UNIVERSAL,
								type: asn1.Type.GENERALIZEDTIME,
								constructed: false,
								optional: true,
								capture: "certValidity2GeneralizedTime"
							},
							{
								name: "Certificate.TBSCertificate.validity.notAfter (utc)",
								tagClass: asn1.Class.UNIVERSAL,
								type: asn1.Type.UTCTIME,
								constructed: false,
								optional: true,
								capture: "certValidity3UTCTime"
							},
							{
								name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
								tagClass: asn1.Class.UNIVERSAL,
								type: asn1.Type.GENERALIZEDTIME,
								constructed: false,
								optional: true,
								capture: "certValidity4GeneralizedTime"
							}
						]
					},
					{
						name: "Certificate.TBSCertificate.subject",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						captureAsn1: "certSubject"
					},
					publicKeyValidator,
					{
						name: "Certificate.TBSCertificate.issuerUniqueID",
						tagClass: asn1.Class.CONTEXT_SPECIFIC,
						type: 1,
						constructed: true,
						optional: true,
						value: [{
							name: "Certificate.TBSCertificate.issuerUniqueID.id",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.BITSTRING,
							constructed: false,
							captureBitStringValue: "certIssuerUniqueId"
						}]
					},
					{
						name: "Certificate.TBSCertificate.subjectUniqueID",
						tagClass: asn1.Class.CONTEXT_SPECIFIC,
						type: 2,
						constructed: true,
						optional: true,
						value: [{
							name: "Certificate.TBSCertificate.subjectUniqueID.id",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.BITSTRING,
							constructed: false,
							captureBitStringValue: "certSubjectUniqueId"
						}]
					},
					{
						name: "Certificate.TBSCertificate.extensions",
						tagClass: asn1.Class.CONTEXT_SPECIFIC,
						type: 3,
						constructed: true,
						captureAsn1: "certExtensions",
						optional: true
					}
				]
			},
			{
				name: "Certificate.signatureAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "Certificate.signatureAlgorithm.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "certSignatureOid"
				}, {
					name: "Certificate.TBSCertificate.signature.parameters",
					tagClass: asn1.Class.UNIVERSAL,
					optional: true,
					captureAsn1: "certSignatureParams"
				}]
			},
			{
				name: "Certificate.signatureValue",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.BITSTRING,
				constructed: false,
				captureBitStringValue: "certSignature"
			}
		]
	};
	var rsassaPssParameterValidator = {
		name: "rsapss",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "rsapss.hashAlgorithm",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 0,
				constructed: true,
				value: [{
					name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Class.SEQUENCE,
					constructed: true,
					optional: true,
					value: [{
						name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.OID,
						constructed: false,
						capture: "hashOid"
					}]
				}]
			},
			{
				name: "rsapss.maskGenAlgorithm",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 1,
				constructed: true,
				value: [{
					name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Class.SEQUENCE,
					constructed: true,
					optional: true,
					value: [{
						name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.OID,
						constructed: false,
						capture: "maskGenOid"
					}, {
						name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						value: [{
							name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.OID,
							constructed: false,
							capture: "maskGenHashOid"
						}]
					}]
				}]
			},
			{
				name: "rsapss.saltLength",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 2,
				optional: true,
				value: [{
					name: "rsapss.saltLength.saltLength",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Class.INTEGER,
					constructed: false,
					capture: "saltLength"
				}]
			},
			{
				name: "rsapss.trailerField",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 3,
				optional: true,
				value: [{
					name: "rsapss.trailer.trailer",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Class.INTEGER,
					constructed: false,
					capture: "trailer"
				}]
			}
		]
	};
	var certificationRequestInfoValidator = {
		name: "CertificationRequestInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		captureAsn1: "certificationRequestInfo",
		value: [
			{
				name: "CertificationRequestInfo.integer",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "certificationRequestInfoVersion"
			},
			{
				name: "CertificationRequestInfo.subject",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				captureAsn1: "certificationRequestInfoSubject"
			},
			publicKeyValidator,
			{
				name: "CertificationRequestInfo.attributes",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				type: 0,
				constructed: true,
				optional: true,
				capture: "certificationRequestInfoAttributes",
				value: [{
					name: "CertificationRequestInfo.attributes",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.SEQUENCE,
					constructed: true,
					value: [{
						name: "CertificationRequestInfo.attributes.type",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.OID,
						constructed: false
					}, {
						name: "CertificationRequestInfo.attributes.value",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SET,
						constructed: true
					}]
				}]
			}
		]
	};
	var certificationRequestValidator = {
		name: "CertificationRequest",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		captureAsn1: "csr",
		value: [
			certificationRequestInfoValidator,
			{
				name: "CertificationRequest.signatureAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "CertificationRequest.signatureAlgorithm.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "csrSignatureOid"
				}, {
					name: "CertificationRequest.signatureAlgorithm.parameters",
					tagClass: asn1.Class.UNIVERSAL,
					optional: true,
					captureAsn1: "csrSignatureParams"
				}]
			},
			{
				name: "CertificationRequest.signature",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.BITSTRING,
				constructed: false,
				captureBitStringValue: "csrSignature"
			}
		]
	};
	/**
	* Converts an RDNSequence of ASN.1 DER-encoded RelativeDistinguishedName
	* sets into an array with objects that have type and value properties.
	*
	* @param rdn the RDNSequence to convert.
	* @param md a message digest to append type and value to if provided.
	*/
	pki.RDNAttributesAsArray = function(rdn, md) {
		var rval = [];
		var set, attr, obj;
		for (var si = 0; si < rdn.value.length; ++si) {
			set = rdn.value[si];
			for (var i = 0; i < set.value.length; ++i) {
				obj = {};
				attr = set.value[i];
				obj.type = asn1.derToOid(attr.value[0].value);
				obj.value = attr.value[1].value;
				obj.valueTagClass = attr.value[1].type;
				if (obj.type in oids) {
					obj.name = oids[obj.type];
					if (obj.name in _shortNames) obj.shortName = _shortNames[obj.name];
				}
				if (md) {
					md.update(obj.type);
					md.update(obj.value);
				}
				rval.push(obj);
			}
		}
		return rval;
	};
	/**
	* Converts ASN.1 CRIAttributes into an array with objects that have type and
	* value properties.
	*
	* @param attributes the CRIAttributes to convert.
	*/
	pki.CRIAttributesAsArray = function(attributes) {
		var rval = [];
		for (var si = 0; si < attributes.length; ++si) {
			var seq = attributes[si];
			var type = asn1.derToOid(seq.value[0].value);
			var values = seq.value[1].value;
			for (var vi = 0; vi < values.length; ++vi) {
				var obj = {};
				obj.type = type;
				obj.value = values[vi].value;
				obj.valueTagClass = values[vi].type;
				if (obj.type in oids) {
					obj.name = oids[obj.type];
					if (obj.name in _shortNames) obj.shortName = _shortNames[obj.name];
				}
				if (obj.type === oids.extensionRequest) {
					obj.extensions = [];
					for (var ei = 0; ei < obj.value.length; ++ei) obj.extensions.push(pki.certificateExtensionFromAsn1(obj.value[ei]));
				}
				rval.push(obj);
			}
		}
		return rval;
	};
	/**
	* Gets an issuer or subject attribute from its name, type, or short name.
	*
	* @param obj the issuer or subject object.
	* @param options a short name string or an object with:
	*          shortName the short name for the attribute.
	*          name the name for the attribute.
	*          type the type for the attribute.
	*
	* @return the attribute.
	*/
	function _getAttribute(obj, options) {
		if (typeof options === "string") options = { shortName: options };
		var rval = null;
		var attr;
		for (var i = 0; rval === null && i < obj.attributes.length; ++i) {
			attr = obj.attributes[i];
			if (options.type && options.type === attr.type) rval = attr;
			else if (options.name && options.name === attr.name) rval = attr;
			else if (options.shortName && options.shortName === attr.shortName) rval = attr;
		}
		return rval;
	}
	/**
	* Converts signature parameters from ASN.1 structure.
	*
	* Currently only RSASSA-PSS supported.  The PKCS#1 v1.5 signature scheme had
	* no parameters.
	*
	* RSASSA-PSS-params  ::=  SEQUENCE  {
	*   hashAlgorithm      [0] HashAlgorithm DEFAULT
	*                             sha1Identifier,
	*   maskGenAlgorithm   [1] MaskGenAlgorithm DEFAULT
	*                             mgf1SHA1Identifier,
	*   saltLength         [2] INTEGER DEFAULT 20,
	*   trailerField       [3] INTEGER DEFAULT 1
	* }
	*
	* HashAlgorithm  ::=  AlgorithmIdentifier
	*
	* MaskGenAlgorithm  ::=  AlgorithmIdentifier
	*
	* AlgorithmIdentifer ::= SEQUENCE {
	*   algorithm OBJECT IDENTIFIER,
	*   parameters ANY DEFINED BY algorithm OPTIONAL
	* }
	*
	* @param oid The OID specifying the signature algorithm
	* @param obj The ASN.1 structure holding the parameters
	* @param fillDefaults Whether to use return default values where omitted
	* @return signature parameter object
	*/
	var _readSignatureParameters = function(oid, obj, fillDefaults) {
		var params = {};
		if (oid !== oids["RSASSA-PSS"]) return params;
		if (fillDefaults) params = {
			hash: { algorithmOid: oids["sha1"] },
			mgf: {
				algorithmOid: oids["mgf1"],
				hash: { algorithmOid: oids["sha1"] }
			},
			saltLength: 20
		};
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, rsassaPssParameterValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read RSASSA-PSS parameter block.");
			error.errors = errors;
			throw error;
		}
		if (capture.hashOid !== void 0) {
			params.hash = params.hash || {};
			params.hash.algorithmOid = asn1.derToOid(capture.hashOid);
		}
		if (capture.maskGenOid !== void 0) {
			params.mgf = params.mgf || {};
			params.mgf.algorithmOid = asn1.derToOid(capture.maskGenOid);
			params.mgf.hash = params.mgf.hash || {};
			params.mgf.hash.algorithmOid = asn1.derToOid(capture.maskGenHashOid);
		}
		if (capture.saltLength !== void 0) params.saltLength = capture.saltLength.charCodeAt(0);
		return params;
	};
	/**
	* Create signature digest for OID.
	*
	* @param options
	*   signatureOid: the OID specifying the signature algorithm.
	*   type: a human readable type for error messages
	* @return a created md instance. throws if unknown oid.
	*/
	var _createSignatureDigest = function(options) {
		switch (oids[options.signatureOid]) {
			case "sha1WithRSAEncryption":
			case "sha1WithRSASignature": return forge.md.sha1.create();
			case "md5WithRSAEncryption": return forge.md.md5.create();
			case "sha256WithRSAEncryption": return forge.md.sha256.create();
			case "sha384WithRSAEncryption": return forge.md.sha384.create();
			case "sha512WithRSAEncryption": return forge.md.sha512.create();
			case "RSASSA-PSS": return forge.md.sha256.create();
			default:
				var error = /* @__PURE__ */ new Error("Could not compute " + options.type + " digest. Unknown signature OID.");
				error.signatureOid = options.signatureOid;
				throw error;
		}
	};
	/**
	* Verify signature on certificate or CSR.
	*
	* @param options:
	*   certificate the certificate or CSR to verify.
	*   md the signature digest.
	*   signature the signature
	* @return a created md instance. throws if unknown oid.
	*/
	var _verifySignature = function(options) {
		var cert = options.certificate;
		var scheme;
		switch (cert.signatureOid) {
			case oids.sha1WithRSAEncryption:
			case oids.sha1WithRSASignature: break;
			case oids["RSASSA-PSS"]:
				var hash = oids[cert.signatureParameters.mgf.hash.algorithmOid], mgf;
				if (hash === void 0 || forge.md[hash] === void 0) {
					var error = /* @__PURE__ */ new Error("Unsupported MGF hash function.");
					error.oid = cert.signatureParameters.mgf.hash.algorithmOid;
					error.name = hash;
					throw error;
				}
				mgf = oids[cert.signatureParameters.mgf.algorithmOid];
				if (mgf === void 0 || forge.mgf[mgf] === void 0) {
					var error = /* @__PURE__ */ new Error("Unsupported MGF function.");
					error.oid = cert.signatureParameters.mgf.algorithmOid;
					error.name = mgf;
					throw error;
				}
				mgf = forge.mgf[mgf].create(forge.md[hash].create());
				hash = oids[cert.signatureParameters.hash.algorithmOid];
				if (hash === void 0 || forge.md[hash] === void 0) {
					var error = /* @__PURE__ */ new Error("Unsupported RSASSA-PSS hash function.");
					error.oid = cert.signatureParameters.hash.algorithmOid;
					error.name = hash;
					throw error;
				}
				scheme = forge.pss.create(forge.md[hash].create(), mgf, cert.signatureParameters.saltLength);
				break;
		}
		return cert.publicKey.verify(options.md.digest().getBytes(), options.signature, scheme);
	};
	/**
	* Converts an X.509 certificate from PEM format.
	*
	* Note: If the certificate is to be verified then compute hash should
	* be set to true. This will scan the TBSCertificate part of the ASN.1
	* object while it is converted so it doesn't need to be converted back
	* to ASN.1-DER-encoding later.
	*
	* @param pem the PEM-formatted certificate.
	* @param computeHash true to compute the hash for verification.
	* @param strict true to be strict when checking ASN.1 value lengths, false to
	*          allow truncated values (default: true).
	*
	* @return the certificate.
	*/
	pki.certificateFromPem = function(pem, computeHash, strict) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
			var error = /* @__PURE__ */ new Error("Could not convert certificate from PEM; PEM header type is not \"CERTIFICATE\", \"X509 CERTIFICATE\", or \"TRUSTED CERTIFICATE\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
		var obj = asn1.fromDer(msg.body, strict);
		return pki.certificateFromAsn1(obj, computeHash);
	};
	/**
	* Converts an X.509 certificate to PEM format.
	*
	* @param cert the certificate.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted certificate.
	*/
	pki.certificateToPem = function(cert, maxline) {
		var msg = {
			type: "CERTIFICATE",
			body: asn1.toDer(pki.certificateToAsn1(cert)).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Converts an RSA public key from PEM format.
	*
	* @param pem the PEM-formatted public key.
	*
	* @return the public key.
	*/
	pki.publicKeyFromPem = function(pem) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "PUBLIC KEY" && msg.type !== "RSA PUBLIC KEY") {
			var error = /* @__PURE__ */ new Error("Could not convert public key from PEM; PEM header type is not \"PUBLIC KEY\" or \"RSA PUBLIC KEY\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert public key from PEM; PEM is encrypted.");
		var obj = asn1.fromDer(msg.body);
		return pki.publicKeyFromAsn1(obj);
	};
	/**
	* Converts an RSA public key to PEM format (using a SubjectPublicKeyInfo).
	*
	* @param key the public key.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted public key.
	*/
	pki.publicKeyToPem = function(key, maxline) {
		var msg = {
			type: "PUBLIC KEY",
			body: asn1.toDer(pki.publicKeyToAsn1(key)).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Converts an RSA public key to PEM format (using an RSAPublicKey).
	*
	* @param key the public key.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted public key.
	*/
	pki.publicKeyToRSAPublicKeyPem = function(key, maxline) {
		var msg = {
			type: "RSA PUBLIC KEY",
			body: asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Gets a fingerprint for the given public key.
	*
	* @param options the options to use.
	*          [md] the message digest object to use (defaults to forge.md.sha1).
	*          [type] the type of fingerprint, such as 'RSAPublicKey',
	*            'SubjectPublicKeyInfo' (defaults to 'RSAPublicKey').
	*          [encoding] an alternative output encoding, such as 'hex'
	*            (defaults to none, outputs a byte buffer).
	*          [delimiter] the delimiter to use between bytes for 'hex' encoded
	*            output, eg: ':' (defaults to none).
	*
	* @return the fingerprint as a byte buffer or other encoding based on options.
	*/
	pki.getPublicKeyFingerprint = function(key, options) {
		options = options || {};
		var md = options.md || forge.md.sha1.create();
		var type = options.type || "RSAPublicKey";
		var bytes;
		switch (type) {
			case "RSAPublicKey":
				bytes = asn1.toDer(pki.publicKeyToRSAPublicKey(key)).getBytes();
				break;
			case "SubjectPublicKeyInfo":
				bytes = asn1.toDer(pki.publicKeyToAsn1(key)).getBytes();
				break;
			default: throw new Error("Unknown fingerprint type \"" + options.type + "\".");
		}
		md.start();
		md.update(bytes);
		var digest = md.digest();
		if (options.encoding === "hex") {
			var hex = digest.toHex();
			if (options.delimiter) return hex.match(/.{2}/g).join(options.delimiter);
			return hex;
		} else if (options.encoding === "binary") return digest.getBytes();
		else if (options.encoding) throw new Error("Unknown encoding \"" + options.encoding + "\".");
		return digest;
	};
	/**
	* Converts a PKCS#10 certification request (CSR) from PEM format.
	*
	* Note: If the certification request is to be verified then compute hash
	* should be set to true. This will scan the CertificationRequestInfo part of
	* the ASN.1 object while it is converted so it doesn't need to be converted
	* back to ASN.1-DER-encoding later.
	*
	* @param pem the PEM-formatted certificate.
	* @param computeHash true to compute the hash for verification.
	* @param strict true to be strict when checking ASN.1 value lengths, false to
	*          allow truncated values (default: true).
	*
	* @return the certification request (CSR).
	*/
	pki.certificationRequestFromPem = function(pem, computeHash, strict) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "CERTIFICATE REQUEST") {
			var error = /* @__PURE__ */ new Error("Could not convert certification request from PEM; PEM header type is not \"CERTIFICATE REQUEST\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert certification request from PEM; PEM is encrypted.");
		var obj = asn1.fromDer(msg.body, strict);
		return pki.certificationRequestFromAsn1(obj, computeHash);
	};
	/**
	* Converts a PKCS#10 certification request (CSR) to PEM format.
	*
	* @param csr the certification request.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted certification request.
	*/
	pki.certificationRequestToPem = function(csr, maxline) {
		var msg = {
			type: "CERTIFICATE REQUEST",
			body: asn1.toDer(pki.certificationRequestToAsn1(csr)).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Creates an empty X.509v3 RSA certificate.
	*
	* @return the certificate.
	*/
	pki.createCertificate = function() {
		var cert = {};
		cert.version = 2;
		cert.serialNumber = "00";
		cert.signatureOid = null;
		cert.signature = null;
		cert.siginfo = {};
		cert.siginfo.algorithmOid = null;
		cert.validity = {};
		cert.validity.notBefore = /* @__PURE__ */ new Date();
		cert.validity.notAfter = /* @__PURE__ */ new Date();
		cert.issuer = {};
		cert.issuer.getField = function(sn) {
			return _getAttribute(cert.issuer, sn);
		};
		cert.issuer.addField = function(attr) {
			_fillMissingFields([attr]);
			cert.issuer.attributes.push(attr);
		};
		cert.issuer.attributes = [];
		cert.issuer.hash = null;
		cert.subject = {};
		cert.subject.getField = function(sn) {
			return _getAttribute(cert.subject, sn);
		};
		cert.subject.addField = function(attr) {
			_fillMissingFields([attr]);
			cert.subject.attributes.push(attr);
		};
		cert.subject.attributes = [];
		cert.subject.hash = null;
		cert.extensions = [];
		cert.publicKey = null;
		cert.md = null;
		/**
		* Sets the subject of this certificate.
		*
		* @param attrs the array of subject attributes to use.
		* @param uniqueId an optional a unique ID to use.
		*/
		cert.setSubject = function(attrs, uniqueId) {
			_fillMissingFields(attrs);
			cert.subject.attributes = attrs;
			delete cert.subject.uniqueId;
			if (uniqueId) cert.subject.uniqueId = uniqueId;
			cert.subject.hash = null;
		};
		/**
		* Sets the issuer of this certificate.
		*
		* @param attrs the array of issuer attributes to use.
		* @param uniqueId an optional a unique ID to use.
		*/
		cert.setIssuer = function(attrs, uniqueId) {
			_fillMissingFields(attrs);
			cert.issuer.attributes = attrs;
			delete cert.issuer.uniqueId;
			if (uniqueId) cert.issuer.uniqueId = uniqueId;
			cert.issuer.hash = null;
		};
		/**
		* Sets the extensions of this certificate.
		*
		* @param exts the array of extensions to use.
		*/
		cert.setExtensions = function(exts) {
			for (var i = 0; i < exts.length; ++i) _fillMissingExtensionFields(exts[i], { cert });
			cert.extensions = exts;
		};
		/**
		* Gets an extension by its name or id.
		*
		* @param options the name to use or an object with:
		*          name the name to use.
		*          id the id to use.
		*
		* @return the extension or null if not found.
		*/
		cert.getExtension = function(options) {
			if (typeof options === "string") options = { name: options };
			var rval = null;
			var ext;
			for (var i = 0; rval === null && i < cert.extensions.length; ++i) {
				ext = cert.extensions[i];
				if (options.id && ext.id === options.id) rval = ext;
				else if (options.name && ext.name === options.name) rval = ext;
			}
			return rval;
		};
		/**
		* Signs this certificate using the given private key.
		*
		* @param key the private key to sign with.
		* @param md the message digest object to use (defaults to forge.md.sha1).
		*/
		cert.sign = function(key, md) {
			cert.md = md || forge.md.sha1.create();
			var algorithmOid = oids[cert.md.algorithm + "WithRSAEncryption"];
			if (!algorithmOid) {
				var error = /* @__PURE__ */ new Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
				error.algorithm = cert.md.algorithm;
				throw error;
			}
			cert.signatureOid = cert.siginfo.algorithmOid = algorithmOid;
			cert.tbsCertificate = pki.getTBSCertificate(cert);
			var bytes = asn1.toDer(cert.tbsCertificate);
			cert.md.update(bytes.getBytes());
			cert.signature = key.sign(cert.md);
		};
		/**
		* Attempts verify the signature on the passed certificate using this
		* certificate's public key.
		*
		* @param child the certificate to verify.
		*
		* @return true if verified, false if not.
		*/
		cert.verify = function(child) {
			var rval = false;
			if (!cert.issued(child)) {
				var issuer = child.issuer;
				var subject = cert.subject;
				var error = /* @__PURE__ */ new Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
				error.expectedIssuer = subject.attributes;
				error.actualIssuer = issuer.attributes;
				throw error;
			}
			var md = child.md;
			if (md === null) {
				md = _createSignatureDigest({
					signatureOid: child.signatureOid,
					type: "certificate"
				});
				var tbsCertificate = child.tbsCertificate || pki.getTBSCertificate(child);
				var bytes = asn1.toDer(tbsCertificate);
				md.update(bytes.getBytes());
			}
			if (md !== null) rval = _verifySignature({
				certificate: cert,
				md,
				signature: child.signature
			});
			return rval;
		};
		/**
		* Returns true if this certificate's issuer matches the passed
		* certificate's subject. Note that no signature check is performed.
		*
		* @param parent the certificate to check.
		*
		* @return true if this certificate's issuer matches the passed certificate's
		*         subject.
		*/
		cert.isIssuer = function(parent) {
			var rval = false;
			var i = cert.issuer;
			var s = parent.subject;
			if (i.hash && s.hash) rval = i.hash === s.hash;
			else if (i.attributes.length === s.attributes.length) {
				rval = true;
				var iattr, sattr;
				for (var n = 0; rval && n < i.attributes.length; ++n) {
					iattr = i.attributes[n];
					sattr = s.attributes[n];
					if (iattr.type !== sattr.type || iattr.value !== sattr.value) rval = false;
				}
			}
			return rval;
		};
		/**
		* Returns true if this certificate's subject matches the issuer of the
		* given certificate). Note that not signature check is performed.
		*
		* @param child the certificate to check.
		*
		* @return true if this certificate's subject matches the passed
		*         certificate's issuer.
		*/
		cert.issued = function(child) {
			return child.isIssuer(cert);
		};
		/**
		* Generates the subjectKeyIdentifier for this certificate as byte buffer.
		*
		* @return the subjectKeyIdentifier for this certificate as byte buffer.
		*/
		cert.generateSubjectKeyIdentifier = function() {
			return pki.getPublicKeyFingerprint(cert.publicKey, { type: "RSAPublicKey" });
		};
		/**
		* Verifies the subjectKeyIdentifier extension value for this certificate
		* against its public key. If no extension is found, false will be
		* returned.
		*
		* @return true if verified, false if not.
		*/
		cert.verifySubjectKeyIdentifier = function() {
			var oid = oids["subjectKeyIdentifier"];
			for (var i = 0; i < cert.extensions.length; ++i) {
				var ext = cert.extensions[i];
				if (ext.id === oid) {
					var ski = cert.generateSubjectKeyIdentifier().getBytes();
					return forge.util.hexToBytes(ext.subjectKeyIdentifier) === ski;
				}
			}
			return false;
		};
		return cert;
	};
	/**
	* Converts an X.509v3 RSA certificate from an ASN.1 object.
	*
	* Note: If the certificate is to be verified then compute hash should
	* be set to true. There is currently no implementation for converting
	* a certificate back to ASN.1 so the TBSCertificate part of the ASN.1
	* object needs to be scanned before the cert object is created.
	*
	* @param obj the asn1 representation of an X.509v3 RSA certificate.
	* @param computeHash true to compute the hash for verification.
	*
	* @return the certificate.
	*/
	pki.certificateFromAsn1 = function(obj, computeHash) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, x509CertificateValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
			error.errors = errors;
			throw error;
		}
		if (asn1.derToOid(capture.publicKeyOid) !== pki.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA.");
		var cert = pki.createCertificate();
		cert.version = capture.certVersion ? capture.certVersion.charCodeAt(0) : 0;
		cert.serialNumber = forge.util.createBuffer(capture.certSerialNumber).toHex();
		cert.signatureOid = forge.asn1.derToOid(capture.certSignatureOid);
		cert.signatureParameters = _readSignatureParameters(cert.signatureOid, capture.certSignatureParams, true);
		cert.siginfo.algorithmOid = forge.asn1.derToOid(capture.certinfoSignatureOid);
		cert.siginfo.parameters = _readSignatureParameters(cert.siginfo.algorithmOid, capture.certinfoSignatureParams, false);
		cert.signature = capture.certSignature;
		var validity = [];
		if (capture.certValidity1UTCTime !== void 0) validity.push(asn1.utcTimeToDate(capture.certValidity1UTCTime));
		if (capture.certValidity2GeneralizedTime !== void 0) validity.push(asn1.generalizedTimeToDate(capture.certValidity2GeneralizedTime));
		if (capture.certValidity3UTCTime !== void 0) validity.push(asn1.utcTimeToDate(capture.certValidity3UTCTime));
		if (capture.certValidity4GeneralizedTime !== void 0) validity.push(asn1.generalizedTimeToDate(capture.certValidity4GeneralizedTime));
		if (validity.length > 2) throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
		if (validity.length < 2) throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
		cert.validity.notBefore = validity[0];
		cert.validity.notAfter = validity[1];
		cert.tbsCertificate = capture.tbsCertificate;
		if (computeHash) {
			cert.md = _createSignatureDigest({
				signatureOid: cert.signatureOid,
				type: "certificate"
			});
			var bytes = asn1.toDer(cert.tbsCertificate);
			cert.md.update(bytes.getBytes());
		}
		var imd = forge.md.sha1.create();
		var ibytes = asn1.toDer(capture.certIssuer);
		imd.update(ibytes.getBytes());
		cert.issuer.getField = function(sn) {
			return _getAttribute(cert.issuer, sn);
		};
		cert.issuer.addField = function(attr) {
			_fillMissingFields([attr]);
			cert.issuer.attributes.push(attr);
		};
		cert.issuer.attributes = pki.RDNAttributesAsArray(capture.certIssuer);
		if (capture.certIssuerUniqueId) cert.issuer.uniqueId = capture.certIssuerUniqueId;
		cert.issuer.hash = imd.digest().toHex();
		var smd = forge.md.sha1.create();
		var sbytes = asn1.toDer(capture.certSubject);
		smd.update(sbytes.getBytes());
		cert.subject.getField = function(sn) {
			return _getAttribute(cert.subject, sn);
		};
		cert.subject.addField = function(attr) {
			_fillMissingFields([attr]);
			cert.subject.attributes.push(attr);
		};
		cert.subject.attributes = pki.RDNAttributesAsArray(capture.certSubject);
		if (capture.certSubjectUniqueId) cert.subject.uniqueId = capture.certSubjectUniqueId;
		cert.subject.hash = smd.digest().toHex();
		if (capture.certExtensions) cert.extensions = pki.certificateExtensionsFromAsn1(capture.certExtensions);
		else cert.extensions = [];
		cert.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
		return cert;
	};
	/**
	* Converts an ASN.1 extensions object (with extension sequences as its
	* values) into an array of extension objects with types and values.
	*
	* Supported extensions:
	*
	* id-ce-keyUsage OBJECT IDENTIFIER ::=  { id-ce 15 }
	* KeyUsage ::= BIT STRING {
	*   digitalSignature        (0),
	*   nonRepudiation          (1),
	*   keyEncipherment         (2),
	*   dataEncipherment        (3),
	*   keyAgreement            (4),
	*   keyCertSign             (5),
	*   cRLSign                 (6),
	*   encipherOnly            (7),
	*   decipherOnly            (8)
	* }
	*
	* id-ce-basicConstraints OBJECT IDENTIFIER ::=  { id-ce 19 }
	* BasicConstraints ::= SEQUENCE {
	*   cA                      BOOLEAN DEFAULT FALSE,
	*   pathLenConstraint       INTEGER (0..MAX) OPTIONAL
	* }
	*
	* subjectAltName EXTENSION ::= {
	*   SYNTAX GeneralNames
	*   IDENTIFIED BY id-ce-subjectAltName
	* }
	*
	* GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
	*
	* GeneralName ::= CHOICE {
	*   otherName      [0] INSTANCE OF OTHER-NAME,
	*   rfc822Name     [1] IA5String,
	*   dNSName        [2] IA5String,
	*   x400Address    [3] ORAddress,
	*   directoryName  [4] Name,
	*   ediPartyName   [5] EDIPartyName,
	*   uniformResourceIdentifier [6] IA5String,
	*   IPAddress      [7] OCTET STRING,
	*   registeredID   [8] OBJECT IDENTIFIER
	* }
	*
	* OTHER-NAME ::= TYPE-IDENTIFIER
	*
	* EDIPartyName ::= SEQUENCE {
	*   nameAssigner [0] DirectoryString {ub-name} OPTIONAL,
	*   partyName    [1] DirectoryString {ub-name}
	* }
	*
	* @param exts the extensions ASN.1 with extension sequences to parse.
	*
	* @return the array.
	*/
	pki.certificateExtensionsFromAsn1 = function(exts) {
		var rval = [];
		for (var i = 0; i < exts.value.length; ++i) {
			var extseq = exts.value[i];
			for (var ei = 0; ei < extseq.value.length; ++ei) rval.push(pki.certificateExtensionFromAsn1(extseq.value[ei]));
		}
		return rval;
	};
	/**
	* Parses a single certificate extension from ASN.1.
	*
	* @param ext the extension in ASN.1 format.
	*
	* @return the parsed extension as an object.
	*/
	pki.certificateExtensionFromAsn1 = function(ext) {
		var e = {};
		e.id = asn1.derToOid(ext.value[0].value);
		e.critical = false;
		if (ext.value[1].type === asn1.Type.BOOLEAN) {
			e.critical = ext.value[1].value.charCodeAt(0) !== 0;
			e.value = ext.value[2].value;
		} else e.value = ext.value[1].value;
		if (e.id in oids) {
			e.name = oids[e.id];
			if (e.name === "keyUsage") {
				var ev = asn1.fromDer(e.value);
				var b2 = 0;
				var b3 = 0;
				if (ev.value.length > 1) {
					b2 = ev.value.charCodeAt(1);
					b3 = ev.value.length > 2 ? ev.value.charCodeAt(2) : 0;
				}
				e.digitalSignature = (b2 & 128) === 128;
				e.nonRepudiation = (b2 & 64) === 64;
				e.keyEncipherment = (b2 & 32) === 32;
				e.dataEncipherment = (b2 & 16) === 16;
				e.keyAgreement = (b2 & 8) === 8;
				e.keyCertSign = (b2 & 4) === 4;
				e.cRLSign = (b2 & 2) === 2;
				e.encipherOnly = (b2 & 1) === 1;
				e.decipherOnly = (b3 & 128) === 128;
			} else if (e.name === "basicConstraints") {
				var ev = asn1.fromDer(e.value);
				if (ev.value.length > 0 && ev.value[0].type === asn1.Type.BOOLEAN) e.cA = ev.value[0].value.charCodeAt(0) !== 0;
				else e.cA = false;
				var value = null;
				if (ev.value.length > 0 && ev.value[0].type === asn1.Type.INTEGER) value = ev.value[0].value;
				else if (ev.value.length > 1) value = ev.value[1].value;
				if (value !== null) e.pathLenConstraint = asn1.derToInteger(value);
			} else if (e.name === "extKeyUsage") {
				var ev = asn1.fromDer(e.value);
				for (var vi = 0; vi < ev.value.length; ++vi) {
					var oid = asn1.derToOid(ev.value[vi].value);
					if (oid in oids) e[oids[oid]] = true;
					else e[oid] = true;
				}
			} else if (e.name === "nsCertType") {
				var ev = asn1.fromDer(e.value);
				var b2 = 0;
				if (ev.value.length > 1) b2 = ev.value.charCodeAt(1);
				e.client = (b2 & 128) === 128;
				e.server = (b2 & 64) === 64;
				e.email = (b2 & 32) === 32;
				e.objsign = (b2 & 16) === 16;
				e.reserved = (b2 & 8) === 8;
				e.sslCA = (b2 & 4) === 4;
				e.emailCA = (b2 & 2) === 2;
				e.objCA = (b2 & 1) === 1;
			} else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
				e.altNames = [];
				var gn;
				var ev = asn1.fromDer(e.value);
				for (var n = 0; n < ev.value.length; ++n) {
					gn = ev.value[n];
					var altName = {
						type: gn.type,
						value: gn.value
					};
					e.altNames.push(altName);
					switch (gn.type) {
						case 1:
						case 2:
						case 6: break;
						case 7:
							altName.ip = forge.util.bytesToIP(gn.value);
							break;
						case 8:
							altName.oid = asn1.derToOid(gn.value);
							break;
						default:
					}
				}
			} else if (e.name === "subjectKeyIdentifier") {
				var ev = asn1.fromDer(e.value);
				e.subjectKeyIdentifier = forge.util.bytesToHex(ev.value);
			}
		}
		return e;
	};
	/**
	* Converts a PKCS#10 certification request (CSR) from an ASN.1 object.
	*
	* Note: If the certification request is to be verified then compute hash
	* should be set to true. There is currently no implementation for converting
	* a certificate back to ASN.1 so the CertificationRequestInfo part of the
	* ASN.1 object needs to be scanned before the csr object is created.
	*
	* @param obj the asn1 representation of a PKCS#10 certification request (CSR).
	* @param computeHash true to compute the hash for verification.
	*
	* @return the certification request (CSR).
	*/
	pki.certificationRequestFromAsn1 = function(obj, computeHash) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, certificationRequestValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
			error.errors = errors;
			throw error;
		}
		if (asn1.derToOid(capture.publicKeyOid) !== pki.oids.rsaEncryption) throw new Error("Cannot read public key. OID is not RSA.");
		var csr = pki.createCertificationRequest();
		csr.version = capture.csrVersion ? capture.csrVersion.charCodeAt(0) : 0;
		csr.signatureOid = forge.asn1.derToOid(capture.csrSignatureOid);
		csr.signatureParameters = _readSignatureParameters(csr.signatureOid, capture.csrSignatureParams, true);
		csr.siginfo.algorithmOid = forge.asn1.derToOid(capture.csrSignatureOid);
		csr.siginfo.parameters = _readSignatureParameters(csr.siginfo.algorithmOid, capture.csrSignatureParams, false);
		csr.signature = capture.csrSignature;
		csr.certificationRequestInfo = capture.certificationRequestInfo;
		if (computeHash) {
			csr.md = _createSignatureDigest({
				signatureOid: csr.signatureOid,
				type: "certification request"
			});
			var bytes = asn1.toDer(csr.certificationRequestInfo);
			csr.md.update(bytes.getBytes());
		}
		var smd = forge.md.sha1.create();
		csr.subject.getField = function(sn) {
			return _getAttribute(csr.subject, sn);
		};
		csr.subject.addField = function(attr) {
			_fillMissingFields([attr]);
			csr.subject.attributes.push(attr);
		};
		csr.subject.attributes = pki.RDNAttributesAsArray(capture.certificationRequestInfoSubject, smd);
		csr.subject.hash = smd.digest().toHex();
		csr.publicKey = pki.publicKeyFromAsn1(capture.subjectPublicKeyInfo);
		csr.getAttribute = function(sn) {
			return _getAttribute(csr, sn);
		};
		csr.addAttribute = function(attr) {
			_fillMissingFields([attr]);
			csr.attributes.push(attr);
		};
		csr.attributes = pki.CRIAttributesAsArray(capture.certificationRequestInfoAttributes || []);
		return csr;
	};
	/**
	* Creates an empty certification request (a CSR or certificate signing
	* request). Once created, its public key and attributes can be set and then
	* it can be signed.
	*
	* @return the empty certification request.
	*/
	pki.createCertificationRequest = function() {
		var csr = {};
		csr.version = 0;
		csr.signatureOid = null;
		csr.signature = null;
		csr.siginfo = {};
		csr.siginfo.algorithmOid = null;
		csr.subject = {};
		csr.subject.getField = function(sn) {
			return _getAttribute(csr.subject, sn);
		};
		csr.subject.addField = function(attr) {
			_fillMissingFields([attr]);
			csr.subject.attributes.push(attr);
		};
		csr.subject.attributes = [];
		csr.subject.hash = null;
		csr.publicKey = null;
		csr.attributes = [];
		csr.getAttribute = function(sn) {
			return _getAttribute(csr, sn);
		};
		csr.addAttribute = function(attr) {
			_fillMissingFields([attr]);
			csr.attributes.push(attr);
		};
		csr.md = null;
		/**
		* Sets the subject of this certification request.
		*
		* @param attrs the array of subject attributes to use.
		*/
		csr.setSubject = function(attrs) {
			_fillMissingFields(attrs);
			csr.subject.attributes = attrs;
			csr.subject.hash = null;
		};
		/**
		* Sets the attributes of this certification request.
		*
		* @param attrs the array of attributes to use.
		*/
		csr.setAttributes = function(attrs) {
			_fillMissingFields(attrs);
			csr.attributes = attrs;
		};
		/**
		* Signs this certification request using the given private key.
		*
		* @param key the private key to sign with.
		* @param md the message digest object to use (defaults to forge.md.sha1).
		*/
		csr.sign = function(key, md) {
			csr.md = md || forge.md.sha1.create();
			var algorithmOid = oids[csr.md.algorithm + "WithRSAEncryption"];
			if (!algorithmOid) {
				var error = /* @__PURE__ */ new Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
				error.algorithm = csr.md.algorithm;
				throw error;
			}
			csr.signatureOid = csr.siginfo.algorithmOid = algorithmOid;
			csr.certificationRequestInfo = pki.getCertificationRequestInfo(csr);
			var bytes = asn1.toDer(csr.certificationRequestInfo);
			csr.md.update(bytes.getBytes());
			csr.signature = key.sign(csr.md);
		};
		/**
		* Attempts verify the signature on the passed certification request using
		* its public key.
		*
		* A CSR that has been exported to a file in PEM format can be verified using
		* OpenSSL using this command:
		*
		* openssl req -in <the-csr-pem-file> -verify -noout -text
		*
		* @return true if verified, false if not.
		*/
		csr.verify = function() {
			var rval = false;
			var md = csr.md;
			if (md === null) {
				md = _createSignatureDigest({
					signatureOid: csr.signatureOid,
					type: "certification request"
				});
				var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
				var bytes = asn1.toDer(cri);
				md.update(bytes.getBytes());
			}
			if (md !== null) rval = _verifySignature({
				certificate: csr,
				md,
				signature: csr.signature
			});
			return rval;
		};
		return csr;
	};
	/**
	* Converts an X.509 subject or issuer to an ASN.1 RDNSequence.
	*
	* @param obj the subject or issuer (distinguished name).
	*
	* @return the ASN.1 RDNSequence.
	*/
	function _dnToAsn1(obj) {
		var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
		var attr, set;
		var attrs = obj.attributes;
		for (var i = 0; i < attrs.length; ++i) {
			attr = attrs[i];
			var value = attr.value;
			var valueTagClass = asn1.Type.PRINTABLESTRING;
			if ("valueTagClass" in attr) {
				valueTagClass = attr.valueTagClass;
				if (valueTagClass === asn1.Type.UTF8) value = forge.util.encodeUtf8(value);
			}
			set = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()), asn1.create(asn1.Class.UNIVERSAL, valueTagClass, false, value)])]);
			rval.value.push(set);
		}
		return rval;
	}
	/**
	* Fills in missing fields in attributes.
	*
	* @param attrs the attributes to fill missing fields in.
	*/
	function _fillMissingFields(attrs) {
		var attr;
		for (var i = 0; i < attrs.length; ++i) {
			attr = attrs[i];
			if (typeof attr.name === "undefined") {
				if (attr.type && attr.type in pki.oids) attr.name = pki.oids[attr.type];
				else if (attr.shortName && attr.shortName in _shortNames) attr.name = pki.oids[_shortNames[attr.shortName]];
			}
			if (typeof attr.type === "undefined") if (attr.name && attr.name in pki.oids) attr.type = pki.oids[attr.name];
			else {
				var error = /* @__PURE__ */ new Error("Attribute type not specified.");
				error.attribute = attr;
				throw error;
			}
			if (typeof attr.shortName === "undefined") {
				if (attr.name && attr.name in _shortNames) attr.shortName = _shortNames[attr.name];
			}
			if (attr.type === oids.extensionRequest) {
				attr.valueConstructed = true;
				attr.valueTagClass = asn1.Type.SEQUENCE;
				if (!attr.value && attr.extensions) {
					attr.value = [];
					for (var ei = 0; ei < attr.extensions.length; ++ei) attr.value.push(pki.certificateExtensionToAsn1(_fillMissingExtensionFields(attr.extensions[ei])));
				}
			}
			if (typeof attr.value === "undefined") {
				var error = /* @__PURE__ */ new Error("Attribute value not specified.");
				error.attribute = attr;
				throw error;
			}
		}
	}
	/**
	* Fills in missing fields in certificate extensions.
	*
	* @param e the extension.
	* @param [options] the options to use.
	*          [cert] the certificate the extensions are for.
	*
	* @return the extension.
	*/
	function _fillMissingExtensionFields(e, options) {
		options = options || {};
		if (typeof e.name === "undefined") {
			if (e.id && e.id in pki.oids) e.name = pki.oids[e.id];
		}
		if (typeof e.id === "undefined") if (e.name && e.name in pki.oids) e.id = pki.oids[e.name];
		else {
			var error = /* @__PURE__ */ new Error("Extension ID not specified.");
			error.extension = e;
			throw error;
		}
		if (typeof e.value !== "undefined") return e;
		if (e.name === "keyUsage") {
			var unused = 0;
			var b2 = 0;
			var b3 = 0;
			if (e.digitalSignature) {
				b2 |= 128;
				unused = 7;
			}
			if (e.nonRepudiation) {
				b2 |= 64;
				unused = 6;
			}
			if (e.keyEncipherment) {
				b2 |= 32;
				unused = 5;
			}
			if (e.dataEncipherment) {
				b2 |= 16;
				unused = 4;
			}
			if (e.keyAgreement) {
				b2 |= 8;
				unused = 3;
			}
			if (e.keyCertSign) {
				b2 |= 4;
				unused = 2;
			}
			if (e.cRLSign) {
				b2 |= 2;
				unused = 1;
			}
			if (e.encipherOnly) {
				b2 |= 1;
				unused = 0;
			}
			if (e.decipherOnly) {
				b3 |= 128;
				unused = 7;
			}
			var value = String.fromCharCode(unused);
			if (b3 !== 0) value += String.fromCharCode(b2) + String.fromCharCode(b3);
			else if (b2 !== 0) value += String.fromCharCode(b2);
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
		} else if (e.name === "basicConstraints") {
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			if (e.cA) e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
			if ("pathLenConstraint" in e) e.value.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(e.pathLenConstraint).getBytes()));
		} else if (e.name === "extKeyUsage") {
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			var seq = e.value.value;
			for (var key in e) {
				if (e[key] !== true) continue;
				if (key in oids) seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oids[key]).getBytes()));
				else if (key.indexOf(".") !== -1) seq.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(key).getBytes()));
			}
		} else if (e.name === "nsCertType") {
			var unused = 0;
			var b2 = 0;
			if (e.client) {
				b2 |= 128;
				unused = 7;
			}
			if (e.server) {
				b2 |= 64;
				unused = 6;
			}
			if (e.email) {
				b2 |= 32;
				unused = 5;
			}
			if (e.objsign) {
				b2 |= 16;
				unused = 4;
			}
			if (e.reserved) {
				b2 |= 8;
				unused = 3;
			}
			if (e.sslCA) {
				b2 |= 4;
				unused = 2;
			}
			if (e.emailCA) {
				b2 |= 2;
				unused = 1;
			}
			if (e.objCA) {
				b2 |= 1;
				unused = 0;
			}
			var value = String.fromCharCode(unused);
			if (b2 !== 0) value += String.fromCharCode(b2);
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, value);
		} else if (e.name === "subjectAltName" || e.name === "issuerAltName") {
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			var altName;
			for (var n = 0; n < e.altNames.length; ++n) {
				altName = e.altNames[n];
				var value = altName.value;
				if (altName.type === 7 && altName.ip) {
					value = forge.util.bytesFromIP(altName.ip);
					if (value === null) {
						var error = /* @__PURE__ */ new Error("Extension \"ip\" value is not a valid IPv4 or IPv6 address.");
						error.extension = e;
						throw error;
					}
				} else if (altName.type === 8) if (altName.oid) value = asn1.oidToDer(asn1.oidToDer(altName.oid));
				else value = asn1.oidToDer(value);
				e.value.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
			}
		} else if (e.name === "nsComment" && options.cert) {
			if (!/^[\x00-\x7F]*$/.test(e.comment) || e.comment.length < 1 || e.comment.length > 128) throw new Error("Invalid \"nsComment\" content.");
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.IA5STRING, false, e.comment);
		} else if (e.name === "subjectKeyIdentifier" && options.cert) {
			var ski = options.cert.generateSubjectKeyIdentifier();
			e.subjectKeyIdentifier = ski.toHex();
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ski.getBytes());
		} else if (e.name === "authorityKeyIdentifier" && options.cert) {
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			var seq = e.value.value;
			if (e.keyIdentifier) {
				var keyIdentifier = e.keyIdentifier === true ? options.cert.generateSubjectKeyIdentifier().getBytes() : e.keyIdentifier;
				seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, false, keyIdentifier));
			}
			if (e.authorityCertIssuer) {
				var authorityCertIssuer = [asn1.create(asn1.Class.CONTEXT_SPECIFIC, 4, true, [_dnToAsn1(e.authorityCertIssuer === true ? options.cert.issuer : e.authorityCertIssuer)])];
				seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, authorityCertIssuer));
			}
			if (e.serialNumber) {
				var serialNumber = forge.util.hexToBytes(e.serialNumber === true ? options.cert.serialNumber : e.serialNumber);
				seq.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, false, serialNumber));
			}
		} else if (e.name === "cRLDistributionPoints") {
			e.value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			var seq = e.value.value;
			var subSeq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
			var fullNameGeneralNames = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
			var altName;
			for (var n = 0; n < e.altNames.length; ++n) {
				altName = e.altNames[n];
				var value = altName.value;
				if (altName.type === 7 && altName.ip) {
					value = forge.util.bytesFromIP(altName.ip);
					if (value === null) {
						var error = /* @__PURE__ */ new Error("Extension \"ip\" value is not a valid IPv4 or IPv6 address.");
						error.extension = e;
						throw error;
					}
				} else if (altName.type === 8) if (altName.oid) value = asn1.oidToDer(asn1.oidToDer(altName.oid));
				else value = asn1.oidToDer(value);
				fullNameGeneralNames.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, altName.type, false, value));
			}
			subSeq.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [fullNameGeneralNames]));
			seq.push(subSeq);
		}
		if (typeof e.value === "undefined") {
			var error = /* @__PURE__ */ new Error("Extension value not specified.");
			error.extension = e;
			throw error;
		}
		return e;
	}
	/**
	* Convert signature parameters object to ASN.1
	*
	* @param {String} oid Signature algorithm OID
	* @param params The signature parameters object
	* @return ASN.1 object representing signature parameters
	*/
	function _signatureParametersToAsn1(oid, params) {
		switch (oid) {
			case oids["RSASSA-PSS"]:
				var parts = [];
				if (params.hash.algorithmOid !== void 0) parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.hash.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")])]));
				if (params.mgf.algorithmOid !== void 0) parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(params.mgf.hash.algorithmOid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")])])]));
				if (params.saltLength !== void 0) parts.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(params.saltLength).getBytes())]));
				return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, parts);
			default: return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "");
		}
	}
	/**
	* Converts a certification request's attributes to an ASN.1 set of
	* CRIAttributes.
	*
	* @param csr certification request.
	*
	* @return the ASN.1 set of CRIAttributes.
	*/
	function _CRIAttributesToAsn1(csr) {
		var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
		if (csr.attributes.length === 0) return rval;
		var attrs = csr.attributes;
		for (var i = 0; i < attrs.length; ++i) {
			var attr = attrs[i];
			var value = attr.value;
			var valueTagClass = asn1.Type.UTF8;
			if ("valueTagClass" in attr) valueTagClass = attr.valueTagClass;
			if (valueTagClass === asn1.Type.UTF8) value = forge.util.encodeUtf8(value);
			var valueConstructed = false;
			if ("valueConstructed" in attr) valueConstructed = attr.valueConstructed;
			var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, valueTagClass, valueConstructed, value)])]);
			rval.value.push(seq);
		}
		return rval;
	}
	var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z");
	var jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z");
	/**
	* Converts a Date object to ASN.1
	* Handles the different format before and after 1st January 2050
	*
	* @param date date object.
	*
	* @return the ASN.1 object representing the date.
	*/
	function _dateToAsn1(date) {
		if (date >= jan_1_1950 && date < jan_1_2050) return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
		else return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
	}
	/**
	* Gets the ASN.1 TBSCertificate part of an X.509v3 certificate.
	*
	* @param cert the certificate.
	*
	* @return the asn1 TBSCertificate.
	*/
	pki.getTBSCertificate = function(cert) {
		var notBefore = _dateToAsn1(cert.validity.notBefore);
		var notAfter = _dateToAsn1(cert.validity.notAfter);
		var tbs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(cert.version).getBytes())]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(cert.serialNumber)),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.siginfo.algorithmOid).getBytes()), _signatureParametersToAsn1(cert.siginfo.algorithmOid, cert.siginfo.parameters)]),
			_dnToAsn1(cert.issuer),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [notBefore, notAfter]),
			_dnToAsn1(cert.subject),
			pki.publicKeyToAsn1(cert.publicKey)
		]);
		if (cert.issuer.uniqueId) tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.issuer.uniqueId)]));
		if (cert.subject.uniqueId) tbs.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 2, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.subject.uniqueId)]));
		if (cert.extensions.length > 0) tbs.value.push(pki.certificateExtensionsToAsn1(cert.extensions));
		return tbs;
	};
	/**
	* Gets the ASN.1 CertificationRequestInfo part of a
	* PKCS#10 CertificationRequest.
	*
	* @param csr the certification request.
	*
	* @return the asn1 CertificationRequestInfo.
	*/
	pki.getCertificationRequestInfo = function(csr) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(csr.version).getBytes()),
			_dnToAsn1(csr.subject),
			pki.publicKeyToAsn1(csr.publicKey),
			_CRIAttributesToAsn1(csr)
		]);
	};
	/**
	* Converts a DistinguishedName (subject or issuer) to an ASN.1 object.
	*
	* @param dn the DistinguishedName.
	*
	* @return the asn1 representation of a DistinguishedName.
	*/
	pki.distinguishedNameToAsn1 = function(dn) {
		return _dnToAsn1(dn);
	};
	/**
	* Converts an X.509v3 RSA certificate to an ASN.1 object.
	*
	* @param cert the certificate.
	*
	* @return the asn1 representation of an X.509v3 RSA certificate.
	*/
	pki.certificateToAsn1 = function(cert) {
		var tbsCertificate = cert.tbsCertificate || pki.getTBSCertificate(cert);
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			tbsCertificate,
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(cert.signatureOid).getBytes()), _signatureParametersToAsn1(cert.signatureOid, cert.signatureParameters)]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + cert.signature)
		]);
	};
	/**
	* Converts X.509v3 certificate extensions to ASN.1.
	*
	* @param exts the extensions to convert.
	*
	* @return the extensions in ASN.1 format.
	*/
	pki.certificateExtensionsToAsn1 = function(exts) {
		var rval = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 3, true, []);
		var seq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
		rval.value.push(seq);
		for (var i = 0; i < exts.length; ++i) seq.value.push(pki.certificateExtensionToAsn1(exts[i]));
		return rval;
	};
	/**
	* Converts a single certificate extension to ASN.1.
	*
	* @param ext the extension to convert.
	*
	* @return the extension in ASN.1 format.
	*/
	pki.certificateExtensionToAsn1 = function(ext) {
		var extseq = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, []);
		extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ext.id).getBytes()));
		if (ext.critical) extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BOOLEAN, false, String.fromCharCode(255)));
		var value = ext.value;
		if (typeof ext.value !== "string") value = asn1.toDer(value).getBytes();
		extseq.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, value));
		return extseq;
	};
	/**
	* Converts a PKCS#10 certification request to an ASN.1 object.
	*
	* @param csr the certification request.
	*
	* @return the asn1 representation of a certification request.
	*/
	pki.certificationRequestToAsn1 = function(csr) {
		var cri = csr.certificationRequestInfo || pki.getCertificationRequestInfo(csr);
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			cri,
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(csr.signatureOid).getBytes()), _signatureParametersToAsn1(csr.signatureOid, csr.signatureParameters)]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BITSTRING, false, String.fromCharCode(0) + csr.signature)
		]);
	};
	/**
	* Creates a CA store.
	*
	* @param certs an optional array of certificate objects or PEM-formatted
	*          certificate strings to add to the CA store.
	*
	* @return the CA store.
	*/
	pki.createCaStore = function(certs) {
		var caStore = { certs: {} };
		/**
		* Gets the certificate that issued the passed certificate or its
		* 'parent'.
		*
		* @param cert the certificate to get the parent for.
		*
		* @return the parent certificate or null if none was found.
		*/
		caStore.getIssuer = function(cert) {
			return getBySubject(cert.issuer);
		};
		/**
		* Adds a trusted certificate to the store.
		*
		* @param cert the certificate to add as a trusted certificate (either a
		*          pki.certificate object or a PEM-formatted certificate).
		*/
		caStore.addCertificate = function(cert) {
			if (typeof cert === "string") cert = forge.pki.certificateFromPem(cert);
			ensureSubjectHasHash(cert.subject);
			if (!caStore.hasCertificate(cert)) if (cert.subject.hash in caStore.certs) {
				var tmp = caStore.certs[cert.subject.hash];
				if (!forge.util.isArray(tmp)) tmp = [tmp];
				tmp.push(cert);
				caStore.certs[cert.subject.hash] = tmp;
			} else caStore.certs[cert.subject.hash] = cert;
		};
		/**
		* Checks to see if the given certificate is in the store.
		*
		* @param cert the certificate to check (either a pki.certificate or a
		*          PEM-formatted certificate).
		*
		* @return true if the certificate is in the store, false if not.
		*/
		caStore.hasCertificate = function(cert) {
			if (typeof cert === "string") cert = forge.pki.certificateFromPem(cert);
			var match = getBySubject(cert.subject);
			if (!match) return false;
			if (!forge.util.isArray(match)) match = [match];
			var der1 = asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
			for (var i = 0; i < match.length; ++i) if (der1 === asn1.toDer(pki.certificateToAsn1(match[i])).getBytes()) return true;
			return false;
		};
		/**
		* Lists all of the certificates kept in the store.
		*
		* @return an array of all of the pki.certificate objects in the store.
		*/
		caStore.listAllCertificates = function() {
			var certList = [];
			for (var hash in caStore.certs) if (caStore.certs.hasOwnProperty(hash)) {
				var value = caStore.certs[hash];
				if (!forge.util.isArray(value)) certList.push(value);
				else for (var i = 0; i < value.length; ++i) certList.push(value[i]);
			}
			return certList;
		};
		/**
		* Removes a certificate from the store.
		*
		* @param cert the certificate to remove (either a pki.certificate or a
		*          PEM-formatted certificate).
		*
		* @return the certificate that was removed or null if the certificate
		*           wasn't in store.
		*/
		caStore.removeCertificate = function(cert) {
			var result;
			if (typeof cert === "string") cert = forge.pki.certificateFromPem(cert);
			ensureSubjectHasHash(cert.subject);
			if (!caStore.hasCertificate(cert)) return null;
			var match = getBySubject(cert.subject);
			if (!forge.util.isArray(match)) {
				result = caStore.certs[cert.subject.hash];
				delete caStore.certs[cert.subject.hash];
				return result;
			}
			var der1 = asn1.toDer(pki.certificateToAsn1(cert)).getBytes();
			for (var i = 0; i < match.length; ++i) if (der1 === asn1.toDer(pki.certificateToAsn1(match[i])).getBytes()) {
				result = match[i];
				match.splice(i, 1);
			}
			if (match.length === 0) delete caStore.certs[cert.subject.hash];
			return result;
		};
		function getBySubject(subject) {
			ensureSubjectHasHash(subject);
			return caStore.certs[subject.hash] || null;
		}
		function ensureSubjectHasHash(subject) {
			if (!subject.hash) {
				var md = forge.md.sha1.create();
				subject.attributes = pki.RDNAttributesAsArray(_dnToAsn1(subject), md);
				subject.hash = md.digest().toHex();
			}
		}
		if (certs) for (var i = 0; i < certs.length; ++i) {
			var cert = certs[i];
			caStore.addCertificate(cert);
		}
		return caStore;
	};
	/**
	* Certificate verification errors, based on TLS.
	*/
	pki.certificateError = {
		bad_certificate: "forge.pki.BadCertificate",
		unsupported_certificate: "forge.pki.UnsupportedCertificate",
		certificate_revoked: "forge.pki.CertificateRevoked",
		certificate_expired: "forge.pki.CertificateExpired",
		certificate_unknown: "forge.pki.CertificateUnknown",
		unknown_ca: "forge.pki.UnknownCertificateAuthority"
	};
	/**
	* Verifies a certificate chain against the given Certificate Authority store
	* with an optional custom verify callback.
	*
	* @param caStore a certificate store to verify against.
	* @param chain the certificate chain to verify, with the root or highest
	*          authority at the end (an array of certificates).
	* @param options a callback to be called for every certificate in the chain or
	*                  an object with:
	*                  verify a callback to be called for every certificate in the
	*                    chain
	*                  validityCheckDate the date against which the certificate
	*                    validity period should be checked. Pass null to not check
	*                    the validity period. By default, the current date is used.
	*
	* The verify callback has the following signature:
	*
	* verified - Set to true if certificate was verified, otherwise the
	*   pki.certificateError for why the certificate failed.
	* depth - The current index in the chain, where 0 is the end point's cert.
	* certs - The certificate chain, *NOTE* an empty chain indicates an anonymous
	*   end point.
	*
	* The function returns true on success and on failure either the appropriate
	* pki.certificateError or an object with 'error' set to the appropriate
	* pki.certificateError and 'message' set to a custom error message.
	*
	* @return true if successful, error thrown if not.
	*/
	pki.verifyCertificateChain = function(caStore, chain, options) {
		if (typeof options === "function") options = { verify: options };
		options = options || {};
		chain = chain.slice(0);
		var certs = chain.slice(0);
		var validityCheckDate = options.validityCheckDate;
		if (typeof validityCheckDate === "undefined") validityCheckDate = /* @__PURE__ */ new Date();
		var first = true;
		var error = null;
		var depth = 0;
		do {
			var cert = chain.shift();
			var parent = null;
			var selfSigned = false;
			if (validityCheckDate) {
				if (validityCheckDate < cert.validity.notBefore || validityCheckDate > cert.validity.notAfter) error = {
					message: "Certificate is not valid yet or has expired.",
					error: pki.certificateError.certificate_expired,
					notBefore: cert.validity.notBefore,
					notAfter: cert.validity.notAfter,
					now: validityCheckDate
				};
			}
			if (error === null) {
				parent = chain[0] || caStore.getIssuer(cert);
				if (parent === null) {
					if (cert.isIssuer(cert)) {
						selfSigned = true;
						parent = cert;
					}
				}
				if (parent) {
					var parents = parent;
					if (!forge.util.isArray(parents)) parents = [parents];
					var verified = false;
					while (!verified && parents.length > 0) {
						parent = parents.shift();
						try {
							verified = parent.verify(cert);
						} catch (ex) {}
					}
					if (!verified) error = {
						message: "Certificate signature is invalid.",
						error: pki.certificateError.bad_certificate
					};
				}
				if (error === null && (!parent || selfSigned) && !caStore.hasCertificate(cert)) error = {
					message: "Certificate is not trusted.",
					error: pki.certificateError.unknown_ca
				};
			}
			if (error === null && parent && !cert.isIssuer(parent)) error = {
				message: "Certificate issuer is invalid.",
				error: pki.certificateError.bad_certificate
			};
			if (error === null) {
				var se = {
					keyUsage: true,
					basicConstraints: true
				};
				for (var i = 0; error === null && i < cert.extensions.length; ++i) {
					var ext = cert.extensions[i];
					if (ext.critical && !(ext.name in se)) error = {
						message: "Certificate has an unsupported critical extension.",
						error: pki.certificateError.unsupported_certificate
					};
				}
			}
			if (error === null && (!first || chain.length === 0 && (!parent || selfSigned))) {
				var bcExt = cert.getExtension("basicConstraints");
				var keyUsageExt = cert.getExtension("keyUsage");
				if (keyUsageExt !== null) {
					if (!keyUsageExt.keyCertSign || bcExt === null) error = {
						message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
						error: pki.certificateError.bad_certificate
					};
				}
				if (error === null && bcExt === null) error = {
					message: "Certificate is missing basicConstraints extension and cannot be used as a CA.",
					error: pki.certificateError.bad_certificate
				};
				if (error === null && bcExt !== null && !bcExt.cA) error = {
					message: "Certificate basicConstraints indicates the certificate is not a CA.",
					error: pki.certificateError.bad_certificate
				};
				if (error === null && keyUsageExt !== null && "pathLenConstraint" in bcExt) {
					if (depth - 1 > bcExt.pathLenConstraint) error = {
						message: "Certificate basicConstraints pathLenConstraint violated.",
						error: pki.certificateError.bad_certificate
					};
				}
			}
			var vfd = error === null ? true : error.error;
			var ret = options.verify ? options.verify(vfd, depth, certs) : vfd;
			if (ret === true) error = null;
			else {
				if (vfd === true) error = {
					message: "The application rejected the certificate.",
					error: pki.certificateError.bad_certificate
				};
				if (ret || ret === 0) {
					if (typeof ret === "object" && !forge.util.isArray(ret)) {
						if (ret.message) error.message = ret.message;
						if (ret.error) error.error = ret.error;
					} else if (typeof ret === "string") error.error = ret;
				}
				throw error;
			}
			first = false;
			++depth;
		} while (chain.length > 0);
		return true;
	};
}));
//#endregion
//#region node_modules/node-forge/lib/pkcs12.js
var require_pkcs12 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of PKCS#12.
	*
	* @author Dave Longley
	* @author Stefan Siegl <stesie@brokenpipe.de>
	*
	* Copyright (c) 2010-2014 Digital Bazaar, Inc.
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	*
	* The ASN.1 representation of PKCS#12 is as follows
	* (see ftp://ftp.rsasecurity.com/pub/pkcs/pkcs-12/pkcs-12-tc1.pdf for details)
	*
	* PFX ::= SEQUENCE {
	*   version  INTEGER {v3(3)}(v3,...),
	*   authSafe ContentInfo,
	*   macData  MacData OPTIONAL
	* }
	*
	* MacData ::= SEQUENCE {
	*   mac DigestInfo,
	*   macSalt OCTET STRING,
	*   iterations INTEGER DEFAULT 1
	* }
	* Note: The iterations default is for historical reasons and its use is
	* deprecated. A higher value, like 1024, is recommended.
	*
	* DigestInfo is defined in PKCS#7 as follows:
	*
	* DigestInfo ::= SEQUENCE {
	*   digestAlgorithm DigestAlgorithmIdentifier,
	*   digest Digest
	* }
	*
	* DigestAlgorithmIdentifier ::= AlgorithmIdentifier
	*
	* The AlgorithmIdentifier contains an Object Identifier (OID) and parameters
	* for the algorithm, if any. In the case of SHA1 there is none.
	*
	* AlgorithmIdentifer ::= SEQUENCE {
	*    algorithm OBJECT IDENTIFIER,
	*    parameters ANY DEFINED BY algorithm OPTIONAL
	* }
	*
	* Digest ::= OCTET STRING
	*
	*
	* ContentInfo ::= SEQUENCE {
	*   contentType ContentType,
	*   content     [0] EXPLICIT ANY DEFINED BY contentType OPTIONAL
	* }
	*
	* ContentType ::= OBJECT IDENTIFIER
	*
	* AuthenticatedSafe ::= SEQUENCE OF ContentInfo
	* -- Data if unencrypted
	* -- EncryptedData if password-encrypted
	* -- EnvelopedData if public key-encrypted
	*
	*
	* SafeContents ::= SEQUENCE OF SafeBag
	*
	* SafeBag ::= SEQUENCE {
	*   bagId     BAG-TYPE.&id ({PKCS12BagSet})
	*   bagValue  [0] EXPLICIT BAG-TYPE.&Type({PKCS12BagSet}{@bagId}),
	*   bagAttributes SET OF PKCS12Attribute OPTIONAL
	* }
	*
	* PKCS12Attribute ::= SEQUENCE {
	*   attrId ATTRIBUTE.&id ({PKCS12AttrSet}),
	*   attrValues SET OF ATTRIBUTE.&Type ({PKCS12AttrSet}{@attrId})
	* } -- This type is compatible with the X.500 type 'Attribute'
	*
	* PKCS12AttrSet ATTRIBUTE ::= {
	*   friendlyName | -- from PKCS #9
	*   localKeyId, -- from PKCS #9
	*   ... -- Other attributes are allowed
	* }
	*
	* CertBag ::= SEQUENCE {
	*   certId    BAG-TYPE.&id   ({CertTypes}),
	*   certValue [0] EXPLICIT BAG-TYPE.&Type ({CertTypes}{@certId})
	* }
	*
	* x509Certificate BAG-TYPE ::= {OCTET STRING IDENTIFIED BY {certTypes 1}}
	*   -- DER-encoded X.509 certificate stored in OCTET STRING
	*
	* sdsiCertificate BAG-TYPE ::= {IA5String IDENTIFIED BY {certTypes 2}}
	* -- Base64-encoded SDSI certificate stored in IA5String
	*
	* CertTypes BAG-TYPE ::= {
	*   x509Certificate |
	*   sdsiCertificate,
	*   ... -- For future extensions
	* }
	*/
	var forge = require_forge();
	require_asn1();
	require_hmac();
	require_oids();
	require_pkcs7asn1();
	require_pbe();
	require_random();
	require_rsa();
	require_sha1();
	require_util();
	require_x509();
	var asn1 = forge.asn1;
	var pki = forge.pki;
	var p12 = module.exports = forge.pkcs12 = forge.pkcs12 || {};
	var contentInfoValidator = {
		name: "ContentInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "ContentInfo.contentType",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OID,
			constructed: false,
			capture: "contentType"
		}, {
			name: "ContentInfo.content",
			tagClass: asn1.Class.CONTEXT_SPECIFIC,
			constructed: true,
			captureAsn1: "content"
		}]
	};
	var pfxValidator = {
		name: "PFX",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "PFX.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "version"
			},
			contentInfoValidator,
			{
				name: "PFX.macData",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				optional: true,
				captureAsn1: "mac",
				value: [
					{
						name: "PFX.macData.mac",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.SEQUENCE,
						constructed: true,
						value: [{
							name: "PFX.macData.mac.digestAlgorithm",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.SEQUENCE,
							constructed: true,
							value: [{
								name: "PFX.macData.mac.digestAlgorithm.algorithm",
								tagClass: asn1.Class.UNIVERSAL,
								type: asn1.Type.OID,
								constructed: false,
								capture: "macAlgorithm"
							}, {
								name: "PFX.macData.mac.digestAlgorithm.parameters",
								optional: true,
								tagClass: asn1.Class.UNIVERSAL,
								captureAsn1: "macAlgorithmParameters"
							}]
						}, {
							name: "PFX.macData.mac.digest",
							tagClass: asn1.Class.UNIVERSAL,
							type: asn1.Type.OCTETSTRING,
							constructed: false,
							capture: "macDigest"
						}]
					},
					{
						name: "PFX.macData.macSalt",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.OCTETSTRING,
						constructed: false,
						capture: "macSalt"
					},
					{
						name: "PFX.macData.iterations",
						tagClass: asn1.Class.UNIVERSAL,
						type: asn1.Type.INTEGER,
						constructed: false,
						optional: true,
						capture: "macIterations"
					}
				]
			}
		]
	};
	var safeBagValidator = {
		name: "SafeBag",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "SafeBag.bagId",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "bagId"
			},
			{
				name: "SafeBag.bagValue",
				tagClass: asn1.Class.CONTEXT_SPECIFIC,
				constructed: true,
				captureAsn1: "bagValue"
			},
			{
				name: "SafeBag.bagAttributes",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SET,
				constructed: true,
				optional: true,
				capture: "bagAttributes"
			}
		]
	};
	var attributeValidator = {
		name: "Attribute",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "Attribute.attrId",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OID,
			constructed: false,
			capture: "oid"
		}, {
			name: "Attribute.attrValues",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SET,
			constructed: true,
			capture: "values"
		}]
	};
	var certBagValidator = {
		name: "CertBag",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [{
			name: "CertBag.certId",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.OID,
			constructed: false,
			capture: "certId"
		}, {
			name: "CertBag.certValue",
			tagClass: asn1.Class.CONTEXT_SPECIFIC,
			constructed: true,
			value: [{
				name: "CertBag.certValue[0]",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Class.OCTETSTRING,
				constructed: false,
				capture: "cert"
			}]
		}]
	};
	/**
	* Search SafeContents structure for bags with matching attributes.
	*
	* The search can optionally be narrowed by a certain bag type.
	*
	* @param safeContents the SafeContents structure to search in.
	* @param attrName the name of the attribute to compare against.
	* @param attrValue the attribute value to search for.
	* @param [bagType] bag type to narrow search by.
	*
	* @return an array of matching bags.
	*/
	function _getBagsByAttribute(safeContents, attrName, attrValue, bagType) {
		var result = [];
		for (var i = 0; i < safeContents.length; i++) for (var j = 0; j < safeContents[i].safeBags.length; j++) {
			var bag = safeContents[i].safeBags[j];
			if (bagType !== void 0 && bag.type !== bagType) continue;
			if (attrName === null) {
				result.push(bag);
				continue;
			}
			if (bag.attributes[attrName] !== void 0 && bag.attributes[attrName].indexOf(attrValue) >= 0) result.push(bag);
		}
		return result;
	}
	/**
	* Converts a PKCS#12 PFX in ASN.1 notation into a PFX object.
	*
	* @param obj The PKCS#12 PFX in ASN.1 notation.
	* @param strict true to use strict DER decoding, false not to (default: true).
	* @param {String} password Password to decrypt with (optional).
	*
	* @return PKCS#12 PFX object.
	*/
	p12.pkcs12FromAsn1 = function(obj, strict, password) {
		if (typeof strict === "string") {
			password = strict;
			strict = true;
		} else if (strict === void 0) strict = true;
		var capture = {};
		if (!asn1.validate(obj, pfxValidator, capture, [])) {
			var error = /* @__PURE__ */ new Error("Cannot read PKCS#12 PFX. ASN.1 object is not an PKCS#12 PFX.");
			error.errors = error;
			throw error;
		}
		var pfx = {
			version: capture.version.charCodeAt(0),
			safeContents: [],
			/**
			* Gets bags with matching attributes.
			*
			* @param filter the attributes to filter by:
			*          [localKeyId] the localKeyId to search for.
			*          [localKeyIdHex] the localKeyId in hex to search for.
			*          [friendlyName] the friendly name to search for.
			*          [bagType] bag type to narrow each attribute search by.
			*
			* @return a map of attribute type to an array of matching bags or, if no
			*           attribute was given but a bag type, the map key will be the
			*           bag type.
			*/
			getBags: function(filter) {
				var rval = {};
				var localKeyId;
				if ("localKeyId" in filter) localKeyId = filter.localKeyId;
				else if ("localKeyIdHex" in filter) localKeyId = forge.util.hexToBytes(filter.localKeyIdHex);
				if (localKeyId === void 0 && !("friendlyName" in filter) && "bagType" in filter) rval[filter.bagType] = _getBagsByAttribute(pfx.safeContents, null, null, filter.bagType);
				if (localKeyId !== void 0) rval.localKeyId = _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, filter.bagType);
				if ("friendlyName" in filter) rval.friendlyName = _getBagsByAttribute(pfx.safeContents, "friendlyName", filter.friendlyName, filter.bagType);
				return rval;
			},
			/**
			* DEPRECATED: use getBags() instead.
			*
			* Get bags with matching friendlyName attribute.
			*
			* @param friendlyName the friendly name to search for.
			* @param [bagType] bag type to narrow search by.
			*
			* @return an array of bags with matching friendlyName attribute.
			*/
			getBagsByFriendlyName: function(friendlyName, bagType) {
				return _getBagsByAttribute(pfx.safeContents, "friendlyName", friendlyName, bagType);
			},
			/**
			* DEPRECATED: use getBags() instead.
			*
			* Get bags with matching localKeyId attribute.
			*
			* @param localKeyId the localKeyId to search for.
			* @param [bagType] bag type to narrow search by.
			*
			* @return an array of bags with matching localKeyId attribute.
			*/
			getBagsByLocalKeyId: function(localKeyId, bagType) {
				return _getBagsByAttribute(pfx.safeContents, "localKeyId", localKeyId, bagType);
			}
		};
		if (capture.version.charCodeAt(0) !== 3) {
			var error = /* @__PURE__ */ new Error("PKCS#12 PFX of version other than 3 not supported.");
			error.version = capture.version.charCodeAt(0);
			throw error;
		}
		if (asn1.derToOid(capture.contentType) !== pki.oids.data) {
			var error = /* @__PURE__ */ new Error("Only PKCS#12 PFX in password integrity mode supported.");
			error.oid = asn1.derToOid(capture.contentType);
			throw error;
		}
		var data = capture.content.value[0];
		if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) throw new Error("PKCS#12 authSafe content data is not an OCTET STRING.");
		data = _decodePkcs7Data(data);
		if (capture.mac) {
			var md = null;
			var macKeyBytes = 0;
			var macAlgorithm = asn1.derToOid(capture.macAlgorithm);
			switch (macAlgorithm) {
				case pki.oids.sha1:
					md = forge.md.sha1.create();
					macKeyBytes = 20;
					break;
				case pki.oids.sha256:
					md = forge.md.sha256.create();
					macKeyBytes = 32;
					break;
				case pki.oids.sha384:
					md = forge.md.sha384.create();
					macKeyBytes = 48;
					break;
				case pki.oids.sha512:
					md = forge.md.sha512.create();
					macKeyBytes = 64;
					break;
				case pki.oids.md5:
					md = forge.md.md5.create();
					macKeyBytes = 16;
					break;
			}
			if (md === null) throw new Error("PKCS#12 uses unsupported MAC algorithm: " + macAlgorithm);
			var macSalt = new forge.util.ByteBuffer(capture.macSalt);
			var macIterations = "macIterations" in capture ? parseInt(forge.util.bytesToHex(capture.macIterations), 16) : 1;
			var macKey = p12.generateKey(password, macSalt, 3, macIterations, macKeyBytes, md);
			var mac = forge.hmac.create();
			mac.start(md, macKey);
			mac.update(data.value);
			if (mac.getMac().getBytes() !== capture.macDigest) throw new Error("PKCS#12 MAC could not be verified. Invalid password?");
		} else if (Array.isArray(obj.value) && obj.value.length > 2) throw new Error("Invalid PKCS#12. macData field present but MAC was not validated.");
		_decodeAuthenticatedSafe(pfx, data.value, strict, password);
		return pfx;
	};
	/**
	* Decodes PKCS#7 Data. PKCS#7 (RFC 2315) defines "Data" as an OCTET STRING,
	* but it is sometimes an OCTET STRING that is composed/constructed of chunks,
	* each its own OCTET STRING. This is BER-encoding vs. DER-encoding. This
	* function transforms this corner-case into the usual simple,
	* non-composed/constructed OCTET STRING.
	*
	* This function may be moved to ASN.1 at some point to better deal with
	* more BER-encoding issues, should they arise.
	*
	* @param data the ASN.1 Data object to transform.
	*/
	function _decodePkcs7Data(data) {
		if (data.composed || data.constructed) {
			var value = forge.util.createBuffer();
			for (var i = 0; i < data.value.length; ++i) value.putBytes(data.value[i].value);
			data.composed = data.constructed = false;
			data.value = value.getBytes();
		}
		return data;
	}
	/**
	* Decode PKCS#12 AuthenticatedSafe (BER encoded) into PFX object.
	*
	* The AuthenticatedSafe is a BER-encoded SEQUENCE OF ContentInfo.
	*
	* @param pfx The PKCS#12 PFX object to fill.
	* @param {String} authSafe BER-encoded AuthenticatedSafe.
	* @param strict true to use strict DER decoding, false not to.
	* @param {String} password Password to decrypt with (optional).
	*/
	function _decodeAuthenticatedSafe(pfx, authSafe, strict, password) {
		authSafe = asn1.fromDer(authSafe, strict);
		if (authSafe.tagClass !== asn1.Class.UNIVERSAL || authSafe.type !== asn1.Type.SEQUENCE || authSafe.constructed !== true) throw new Error("PKCS#12 AuthenticatedSafe expected to be a SEQUENCE OF ContentInfo");
		for (var i = 0; i < authSafe.value.length; i++) {
			var contentInfo = authSafe.value[i];
			var capture = {};
			var errors = [];
			if (!asn1.validate(contentInfo, contentInfoValidator, capture, errors)) {
				var error = /* @__PURE__ */ new Error("Cannot read ContentInfo.");
				error.errors = errors;
				throw error;
			}
			var obj = { encrypted: false };
			var safeContents = null;
			var data = capture.content.value[0];
			switch (asn1.derToOid(capture.contentType)) {
				case pki.oids.data:
					if (data.tagClass !== asn1.Class.UNIVERSAL || data.type !== asn1.Type.OCTETSTRING) throw new Error("PKCS#12 SafeContents Data is not an OCTET STRING.");
					safeContents = _decodePkcs7Data(data).value;
					break;
				case pki.oids.encryptedData:
					safeContents = _decryptSafeContents(data, password);
					obj.encrypted = true;
					break;
				default:
					var error = /* @__PURE__ */ new Error("Unsupported PKCS#12 contentType.");
					error.contentType = asn1.derToOid(capture.contentType);
					throw error;
			}
			obj.safeBags = _decodeSafeContents(safeContents, strict, password);
			pfx.safeContents.push(obj);
		}
	}
	/**
	* Decrypt PKCS#7 EncryptedData structure.
	*
	* @param data ASN.1 encoded EncryptedContentInfo object.
	* @param password The user-provided password.
	*
	* @return The decrypted SafeContents (ASN.1 object).
	*/
	function _decryptSafeContents(data, password) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(data, forge.pkcs7.asn1.encryptedDataValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read EncryptedContentInfo.");
			error.errors = errors;
			throw error;
		}
		var oid = asn1.derToOid(capture.contentType);
		if (oid !== pki.oids.data) {
			var error = /* @__PURE__ */ new Error("PKCS#12 EncryptedContentInfo ContentType is not Data.");
			error.oid = oid;
			throw error;
		}
		oid = asn1.derToOid(capture.encAlgorithm);
		var cipher = pki.pbe.getCipher(oid, capture.encParameter, password);
		var encryptedContentAsn1 = _decodePkcs7Data(capture.encryptedContentAsn1);
		var encrypted = forge.util.createBuffer(encryptedContentAsn1.value);
		cipher.update(encrypted);
		if (!cipher.finish()) throw new Error("Failed to decrypt PKCS#12 SafeContents.");
		return cipher.output.getBytes();
	}
	/**
	* Decode PKCS#12 SafeContents (BER-encoded) into array of Bag objects.
	*
	* The safeContents is a BER-encoded SEQUENCE OF SafeBag.
	*
	* @param {String} safeContents BER-encoded safeContents.
	* @param strict true to use strict DER decoding, false not to.
	* @param {String} password Password to decrypt with (optional).
	*
	* @return {Array} Array of Bag objects.
	*/
	function _decodeSafeContents(safeContents, strict, password) {
		if (!strict && safeContents.length === 0) return [];
		safeContents = asn1.fromDer(safeContents, strict);
		if (safeContents.tagClass !== asn1.Class.UNIVERSAL || safeContents.type !== asn1.Type.SEQUENCE || safeContents.constructed !== true) throw new Error("PKCS#12 SafeContents expected to be a SEQUENCE OF SafeBag.");
		var res = [];
		for (var i = 0; i < safeContents.value.length; i++) {
			var safeBag = safeContents.value[i];
			var capture = {};
			var errors = [];
			if (!asn1.validate(safeBag, safeBagValidator, capture, errors)) {
				var error = /* @__PURE__ */ new Error("Cannot read SafeBag.");
				error.errors = errors;
				throw error;
			}
			var bag = {
				type: asn1.derToOid(capture.bagId),
				attributes: _decodeBagAttributes(capture.bagAttributes)
			};
			res.push(bag);
			var validator, decoder;
			var bagAsn1 = capture.bagValue.value[0];
			switch (bag.type) {
				case pki.oids.pkcs8ShroudedKeyBag:
					bagAsn1 = pki.decryptPrivateKeyInfo(bagAsn1, password);
					if (bagAsn1 === null) throw new Error("Unable to decrypt PKCS#8 ShroudedKeyBag, wrong password?");
				case pki.oids.keyBag:
					try {
						bag.key = pki.privateKeyFromAsn1(bagAsn1);
					} catch (e) {
						bag.key = null;
						bag.asn1 = bagAsn1;
					}
					continue;
				case pki.oids.certBag:
					validator = certBagValidator;
					decoder = function() {
						if (asn1.derToOid(capture.certId) !== pki.oids.x509Certificate) {
							var error = /* @__PURE__ */ new Error("Unsupported certificate type, only X.509 supported.");
							error.oid = asn1.derToOid(capture.certId);
							throw error;
						}
						var certAsn1 = asn1.fromDer(capture.cert, strict);
						try {
							bag.cert = pki.certificateFromAsn1(certAsn1, true);
						} catch (e) {
							bag.cert = null;
							bag.asn1 = certAsn1;
						}
					};
					break;
				default:
					var error = /* @__PURE__ */ new Error("Unsupported PKCS#12 SafeBag type.");
					error.oid = bag.type;
					throw error;
			}
			if (validator !== void 0 && !asn1.validate(bagAsn1, validator, capture, errors)) {
				var error = /* @__PURE__ */ new Error("Cannot read PKCS#12 " + validator.name);
				error.errors = errors;
				throw error;
			}
			decoder();
		}
		return res;
	}
	/**
	* Decode PKCS#12 SET OF PKCS12Attribute into JavaScript object.
	*
	* @param attributes SET OF PKCS12Attribute (ASN.1 object).
	*
	* @return the decoded attributes.
	*/
	function _decodeBagAttributes(attributes) {
		var decodedAttrs = {};
		if (attributes !== void 0) for (var i = 0; i < attributes.length; ++i) {
			var capture = {};
			var errors = [];
			if (!asn1.validate(attributes[i], attributeValidator, capture, errors)) {
				var error = /* @__PURE__ */ new Error("Cannot read PKCS#12 BagAttribute.");
				error.errors = errors;
				throw error;
			}
			var oid = asn1.derToOid(capture.oid);
			if (pki.oids[oid] === void 0) continue;
			decodedAttrs[pki.oids[oid]] = [];
			for (var j = 0; j < capture.values.length; ++j) decodedAttrs[pki.oids[oid]].push(capture.values[j].value);
		}
		return decodedAttrs;
	}
	/**
	* Wraps a private key and certificate in a PKCS#12 PFX wrapper. If a
	* password is provided then the private key will be encrypted.
	*
	* An entire certificate chain may also be included. To do this, pass
	* an array for the "cert" parameter where the first certificate is
	* the one that is paired with the private key and each subsequent one
	* verifies the previous one. The certificates may be in PEM format or
	* have been already parsed by Forge.
	*
	* @todo implement password-based-encryption for the whole package
	*
	* @param key the private key.
	* @param cert the certificate (may be an array of certificates in order
	*          to specify a certificate chain).
	* @param password the password to use, null for none.
	* @param options:
	*          algorithm the encryption algorithm to use
	*            ('aes128', 'aes192', 'aes256', '3des'), defaults to 'aes128'.
	*          count the iteration count to use.
	*          saltSize the salt size to use.
	*          useMac true to include a MAC, false not to, defaults to true.
	*          localKeyId the local key ID to use, in hex.
	*          friendlyName the friendly name to use.
	*          generateLocalKeyId true to generate a random local key ID,
	*            false not to, defaults to true.
	*
	* @return the PKCS#12 PFX ASN.1 object.
	*/
	p12.toPkcs12Asn1 = function(key, cert, password, options) {
		options = options || {};
		options.saltSize = options.saltSize || 8;
		options.count = options.count || 2048;
		options.algorithm = options.algorithm || options.encAlgorithm || "aes128";
		if (!("useMac" in options)) options.useMac = true;
		if (!("localKeyId" in options)) options.localKeyId = null;
		if (!("generateLocalKeyId" in options)) options.generateLocalKeyId = true;
		var localKeyId = options.localKeyId;
		var bagAttrs;
		if (localKeyId !== null) localKeyId = forge.util.hexToBytes(localKeyId);
		else if (options.generateLocalKeyId) if (cert) {
			var pairedCert = forge.util.isArray(cert) ? cert[0] : cert;
			if (typeof pairedCert === "string") pairedCert = pki.certificateFromPem(pairedCert);
			var sha1 = forge.md.sha1.create();
			sha1.update(asn1.toDer(pki.certificateToAsn1(pairedCert)).getBytes());
			localKeyId = sha1.digest().getBytes();
		} else localKeyId = forge.random.getBytes(20);
		var attrs = [];
		if (localKeyId !== null) attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.localKeyId).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, localKeyId)])]));
		if ("friendlyName" in options) attrs.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.friendlyName).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.BMPSTRING, false, options.friendlyName)])]));
		if (attrs.length > 0) bagAttrs = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, attrs);
		var contents = [];
		var chain = [];
		if (cert !== null) if (forge.util.isArray(cert)) chain = cert;
		else chain = [cert];
		var certSafeBags = [];
		for (var i = 0; i < chain.length; ++i) {
			cert = chain[i];
			if (typeof cert === "string") cert = pki.certificateFromPem(cert);
			var certBagAttrs = i === 0 ? bagAttrs : void 0;
			var certAsn1 = pki.certificateToAsn1(cert);
			var certSafeBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.certBag).getBytes()),
				asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.x509Certificate).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certAsn1).getBytes())])])]),
				certBagAttrs
			]);
			certSafeBags.push(certSafeBag);
		}
		if (certSafeBags.length > 0) {
			var certSafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, certSafeBags);
			var certCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(certSafeContents).getBytes())])]);
			contents.push(certCI);
		}
		var keyBag = null;
		if (key !== null) {
			var pkAsn1 = pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(key));
			if (password === null) keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.keyBag).getBytes()),
				asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [pkAsn1]),
				bagAttrs
			]);
			else keyBag = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.pkcs8ShroudedKeyBag).getBytes()),
				asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [pki.encryptPrivateKeyInfo(pkAsn1, password, options)]),
				bagAttrs
			]);
			var keySafeContents = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [keyBag]);
			var keyCI = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(keySafeContents).getBytes())])]);
			contents.push(keyCI);
		}
		var safe = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, contents);
		var macData;
		if (options.useMac) {
			var sha1 = forge.md.sha1.create();
			var macSalt = new forge.util.ByteBuffer(forge.random.getBytes(options.saltSize));
			var count = options.count;
			var key = p12.generateKey(password, macSalt, 3, count, 20);
			var mac = forge.hmac.create();
			mac.start(sha1, key);
			mac.update(asn1.toDer(safe).getBytes());
			var macValue = mac.getMac();
			macData = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.sha1).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macValue.getBytes())]),
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, macSalt.getBytes()),
				asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(count).getBytes())
			]);
		}
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(3).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(pki.oids.data).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, asn1.toDer(safe).getBytes())])]),
			macData
		]);
	};
	/**
	* Derives a PKCS#12 key.
	*
	* @param password the password to derive the key material from, null or
	*          undefined for none.
	* @param salt the salt, as a ByteBuffer, to use.
	* @param id the PKCS#12 ID byte (1 = key material, 2 = IV, 3 = MAC).
	* @param iter the iteration count.
	* @param n the number of bytes to derive from the password.
	* @param md the message digest to use, defaults to SHA-1.
	*
	* @return a ByteBuffer with the bytes derived from the password.
	*/
	p12.generateKey = forge.pbe.generatePkcs12Key;
}));
//#endregion
//#region node_modules/node-forge/lib/pki.js
var require_pki = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of a basic Public Key Infrastructure, including
	* support for RSA public and private keys.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2010-2013 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_asn1();
	require_oids();
	require_pbe();
	require_pem();
	require_pbkdf2();
	require_pkcs12();
	require_pss();
	require_rsa();
	require_util();
	require_x509();
	var asn1 = forge.asn1;
	var pki = module.exports = forge.pki = forge.pki || {};
	/**
	* NOTE: THIS METHOD IS DEPRECATED. Use pem.decode() instead.
	*
	* Converts PEM-formatted data to DER.
	*
	* @param pem the PEM-formatted data.
	*
	* @return the DER-formatted data.
	*/
	pki.pemToDer = function(pem) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert PEM to DER; PEM is encrypted.");
		return forge.util.createBuffer(msg.body);
	};
	/**
	* Converts an RSA private key from PEM format.
	*
	* @param pem the PEM-formatted private key.
	*
	* @return the private key.
	*/
	pki.privateKeyFromPem = function(pem) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "PRIVATE KEY" && msg.type !== "RSA PRIVATE KEY") {
			var error = /* @__PURE__ */ new Error("Could not convert private key from PEM; PEM header type is not \"PRIVATE KEY\" or \"RSA PRIVATE KEY\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert private key from PEM; PEM is encrypted.");
		var obj = asn1.fromDer(msg.body);
		return pki.privateKeyFromAsn1(obj);
	};
	/**
	* Converts an RSA private key to PEM format.
	*
	* @param key the private key.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted private key.
	*/
	pki.privateKeyToPem = function(key, maxline) {
		var msg = {
			type: "RSA PRIVATE KEY",
			body: asn1.toDer(pki.privateKeyToAsn1(key)).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
	/**
	* Converts a PrivateKeyInfo to PEM format.
	*
	* @param pki the PrivateKeyInfo.
	* @param maxline the maximum characters per line, defaults to 64.
	*
	* @return the PEM-formatted private key.
	*/
	pki.privateKeyInfoToPem = function(pki, maxline) {
		var msg = {
			type: "PRIVATE KEY",
			body: asn1.toDer(pki).getBytes()
		};
		return forge.pem.encode(msg, { maxline });
	};
}));
//#endregion
//#region node_modules/node-forge/lib/tls.js
var require_tls = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* A Javascript implementation of Transport Layer Security (TLS).
	*
	* @author Dave Longley
	*
	* Copyright (c) 2009-2014 Digital Bazaar, Inc.
	*
	* The TLS Handshake Protocol involves the following steps:
	*
	* - Exchange hello messages to agree on algorithms, exchange random values,
	* and check for session resumption.
	*
	* - Exchange the necessary cryptographic parameters to allow the client and
	* server to agree on a premaster secret.
	*
	* - Exchange certificates and cryptographic information to allow the client
	* and server to authenticate themselves.
	*
	* - Generate a master secret from the premaster secret and exchanged random
	* values.
	*
	* - Provide security parameters to the record layer.
	*
	* - Allow the client and server to verify that their peer has calculated the
	* same security parameters and that the handshake occurred without tampering
	* by an attacker.
	*
	* Up to 4 different messages may be sent during a key exchange. The server
	* certificate, the server key exchange, the client certificate, and the
	* client key exchange.
	*
	* A typical handshake (from the client's perspective).
	*
	* 1. Client sends ClientHello.
	* 2. Client receives ServerHello.
	* 3. Client receives optional Certificate.
	* 4. Client receives optional ServerKeyExchange.
	* 5. Client receives ServerHelloDone.
	* 6. Client sends optional Certificate.
	* 7. Client sends ClientKeyExchange.
	* 8. Client sends optional CertificateVerify.
	* 9. Client sends ChangeCipherSpec.
	* 10. Client sends Finished.
	* 11. Client receives ChangeCipherSpec.
	* 12. Client receives Finished.
	* 13. Client sends/receives application data.
	*
	* To reuse an existing session:
	*
	* 1. Client sends ClientHello with session ID for reuse.
	* 2. Client receives ServerHello with same session ID if reusing.
	* 3. Client receives ChangeCipherSpec message if reusing.
	* 4. Client receives Finished.
	* 5. Client sends ChangeCipherSpec.
	* 6. Client sends Finished.
	*
	* Note: Client ignores HelloRequest if in the middle of a handshake.
	*
	* Record Layer:
	*
	* The record layer fragments information blocks into TLSPlaintext records
	* carrying data in chunks of 2^14 bytes or less. Client message boundaries are
	* not preserved in the record layer (i.e., multiple client messages of the
	* same ContentType MAY be coalesced into a single TLSPlaintext record, or a
	* single message MAY be fragmented across several records).
	*
	* struct {
	*   uint8 major;
	*   uint8 minor;
	* } ProtocolVersion;
	*
	* struct {
	*   ContentType type;
	*   ProtocolVersion version;
	*   uint16 length;
	*   opaque fragment[TLSPlaintext.length];
	* } TLSPlaintext;
	*
	* type:
	*   The higher-level protocol used to process the enclosed fragment.
	*
	* version:
	*   The version of the protocol being employed. TLS Version 1.2 uses version
	*   {3, 3}. TLS Version 1.0 uses version {3, 1}. Note that a client that
	*   supports multiple versions of TLS may not know what version will be
	*   employed before it receives the ServerHello.
	*
	* length:
	*   The length (in bytes) of the following TLSPlaintext.fragment. The length
	*   MUST NOT exceed 2^14 = 16384 bytes.
	*
	* fragment:
	*   The application data. This data is transparent and treated as an
	*   independent block to be dealt with by the higher-level protocol specified
	*   by the type field.
	*
	* Implementations MUST NOT send zero-length fragments of Handshake, Alert, or
	* ChangeCipherSpec content types. Zero-length fragments of Application data
	* MAY be sent as they are potentially useful as a traffic analysis
	* countermeasure.
	*
	* Note: Data of different TLS record layer content types MAY be interleaved.
	* Application data is generally of lower precedence for transmission than
	* other content types. However, records MUST be delivered to the network in
	* the same order as they are protected by the record layer. Recipients MUST
	* receive and process interleaved application layer traffic during handshakes
	* subsequent to the first one on a connection.
	*
	* struct {
	*   ContentType type;       // same as TLSPlaintext.type
	*   ProtocolVersion version;// same as TLSPlaintext.version
	*   uint16 length;
	*   opaque fragment[TLSCompressed.length];
	* } TLSCompressed;
	*
	* length:
	*   The length (in bytes) of the following TLSCompressed.fragment.
	*   The length MUST NOT exceed 2^14 + 1024.
	*
	* fragment:
	*   The compressed form of TLSPlaintext.fragment.
	*
	* Note: A CompressionMethod.null operation is an identity operation; no fields
	* are altered. In this implementation, since no compression is supported,
	* uncompressed records are always the same as compressed records.
	*
	* Encryption Information:
	*
	* The encryption and MAC functions translate a TLSCompressed structure into a
	* TLSCiphertext. The decryption functions reverse the process. The MAC of the
	* record also includes a sequence number so that missing, extra, or repeated
	* messages are detectable.
	*
	* struct {
	*   ContentType type;
	*   ProtocolVersion version;
	*   uint16 length;
	*   select (SecurityParameters.cipher_type) {
	*     case stream: GenericStreamCipher;
	*     case block:  GenericBlockCipher;
	*     case aead:   GenericAEADCipher;
	*   } fragment;
	* } TLSCiphertext;
	*
	* type:
	*   The type field is identical to TLSCompressed.type.
	*
	* version:
	*   The version field is identical to TLSCompressed.version.
	*
	* length:
	*   The length (in bytes) of the following TLSCiphertext.fragment.
	*   The length MUST NOT exceed 2^14 + 2048.
	*
	* fragment:
	*   The encrypted form of TLSCompressed.fragment, with the MAC.
	*
	* Note: Only CBC Block Ciphers are supported by this implementation.
	*
	* The TLSCompressed.fragment structures are converted to/from block
	* TLSCiphertext.fragment structures.
	*
	* struct {
	*   opaque IV[SecurityParameters.record_iv_length];
	*   block-ciphered struct {
	*     opaque content[TLSCompressed.length];
	*     opaque MAC[SecurityParameters.mac_length];
	*     uint8 padding[GenericBlockCipher.padding_length];
	*     uint8 padding_length;
	*   };
	* } GenericBlockCipher;
	*
	* The MAC is generated as described in Section 6.2.3.1.
	*
	* IV:
	*   The Initialization Vector (IV) SHOULD be chosen at random, and MUST be
	*   unpredictable. Note that in versions of TLS prior to 1.1, there was no
	*   IV field, and the last ciphertext block of the previous record (the "CBC
	*   residue") was used as the IV. This was changed to prevent the attacks
	*   described in [CBCATT]. For block ciphers, the IV length is of length
	*   SecurityParameters.record_iv_length, which is equal to the
	*   SecurityParameters.block_size.
	*
	* padding:
	*   Padding that is added to force the length of the plaintext to be an
	*   integral multiple of the block cipher's block length. The padding MAY be
	*   any length up to 255 bytes, as long as it results in the
	*   TLSCiphertext.length being an integral multiple of the block length.
	*   Lengths longer than necessary might be desirable to frustrate attacks on
	*   a protocol that are based on analysis of the lengths of exchanged
	*   messages. Each uint8 in the padding data vector MUST be filled with the
	*   padding length value. The receiver MUST check this padding and MUST use
	*   the bad_record_mac alert to indicate padding errors.
	*
	* padding_length:
	*   The padding length MUST be such that the total size of the
	*   GenericBlockCipher structure is a multiple of the cipher's block length.
	*   Legal values range from zero to 255, inclusive. This length specifies the
	*   length of the padding field exclusive of the padding_length field itself.
	*
	* The encrypted data length (TLSCiphertext.length) is one more than the sum of
	* SecurityParameters.block_length, TLSCompressed.length,
	* SecurityParameters.mac_length, and padding_length.
	*
	* Example: If the block length is 8 bytes, the content length
	* (TLSCompressed.length) is 61 bytes, and the MAC length is 20 bytes, then the
	* length before padding is 82 bytes (this does not include the IV. Thus, the
	* padding length modulo 8 must be equal to 6 in order to make the total length
	* an even multiple of 8 bytes (the block length). The padding length can be
	* 6, 14, 22, and so on, through 254. If the padding length were the minimum
	* necessary, 6, the padding would be 6 bytes, each containing the value 6.
	* Thus, the last 8 octets of the GenericBlockCipher before block encryption
	* would be xx 06 06 06 06 06 06 06, where xx is the last octet of the MAC.
	*
	* Note: With block ciphers in CBC mode (Cipher Block Chaining), it is critical
	* that the entire plaintext of the record be known before any ciphertext is
	* transmitted. Otherwise, it is possible for the attacker to mount the attack
	* described in [CBCATT].
	*
	* Implementation note: Canvel et al. [CBCTIME] have demonstrated a timing
	* attack on CBC padding based on the time required to compute the MAC. In
	* order to defend against this attack, implementations MUST ensure that
	* record processing time is essentially the same whether or not the padding
	* is correct. In general, the best way to do this is to compute the MAC even
	* if the padding is incorrect, and only then reject the packet. For instance,
	* if the pad appears to be incorrect, the implementation might assume a
	* zero-length pad and then compute the MAC. This leaves a small timing
	* channel, since MAC performance depends, to some extent, on the size of the
	* data fragment, but it is not believed to be large enough to be exploitable,
	* due to the large block size of existing MACs and the small size of the
	* timing signal.
	*/
	var forge = require_forge();
	require_asn1();
	require_hmac();
	require_md5();
	require_pem();
	require_pki();
	require_random();
	require_sha1();
	require_util();
	/**
	* Generates pseudo random bytes by mixing the result of two hash functions,
	* MD5 and SHA-1.
	*
	* prf_TLS1(secret, label, seed) =
	*   P_MD5(S1, label + seed) XOR P_SHA-1(S2, label + seed);
	*
	* Each P_hash function functions as follows:
	*
	* P_hash(secret, seed) = HMAC_hash(secret, A(1) + seed) +
	*                        HMAC_hash(secret, A(2) + seed) +
	*                        HMAC_hash(secret, A(3) + seed) + ...
	* A() is defined as:
	*   A(0) = seed
	*   A(i) = HMAC_hash(secret, A(i-1))
	*
	* The '+' operator denotes concatenation.
	*
	* As many iterations A(N) as are needed are performed to generate enough
	* pseudo random byte output. If an iteration creates more data than is
	* necessary, then it is truncated.
	*
	* Therefore:
	* A(1) = HMAC_hash(secret, A(0))
	*      = HMAC_hash(secret, seed)
	* A(2) = HMAC_hash(secret, A(1))
	*      = HMAC_hash(secret, HMAC_hash(secret, seed))
	*
	* Therefore:
	* P_hash(secret, seed) =
	*   HMAC_hash(secret, HMAC_hash(secret, A(0)) + seed) +
	*   HMAC_hash(secret, HMAC_hash(secret, A(1)) + seed) +
	*   ...
	*
	* Therefore:
	* P_hash(secret, seed) =
	*   HMAC_hash(secret, HMAC_hash(secret, seed) + seed) +
	*   HMAC_hash(secret, HMAC_hash(secret, HMAC_hash(secret, seed)) + seed) +
	*   ...
	*
	* @param secret the secret to use.
	* @param label the label to use.
	* @param seed the seed value to use.
	* @param length the number of bytes to generate.
	*
	* @return the pseudo random bytes in a byte buffer.
	*/
	var prf_TLS1 = function(secret, label, seed, length) {
		var rval = forge.util.createBuffer();
		var idx = secret.length >> 1;
		var slen = idx + (secret.length & 1);
		var s1 = secret.substr(0, slen);
		var s2 = secret.substr(idx, slen);
		var ai = forge.util.createBuffer();
		var hmac = forge.hmac.create();
		seed = label + seed;
		var md5itr = Math.ceil(length / 16);
		var sha1itr = Math.ceil(length / 20);
		hmac.start("MD5", s1);
		var md5bytes = forge.util.createBuffer();
		ai.putBytes(seed);
		for (var i = 0; i < md5itr; ++i) {
			hmac.start(null, null);
			hmac.update(ai.getBytes());
			ai.putBuffer(hmac.digest());
			hmac.start(null, null);
			hmac.update(ai.bytes() + seed);
			md5bytes.putBuffer(hmac.digest());
		}
		hmac.start("SHA1", s2);
		var sha1bytes = forge.util.createBuffer();
		ai.clear();
		ai.putBytes(seed);
		for (var i = 0; i < sha1itr; ++i) {
			hmac.start(null, null);
			hmac.update(ai.getBytes());
			ai.putBuffer(hmac.digest());
			hmac.start(null, null);
			hmac.update(ai.bytes() + seed);
			sha1bytes.putBuffer(hmac.digest());
		}
		rval.putBytes(forge.util.xorBytes(md5bytes.getBytes(), sha1bytes.getBytes(), length));
		return rval;
	};
	/**
	* Gets a MAC for a record using the SHA-1 hash algorithm.
	*
	* @param key the mac key.
	* @param state the sequence number (array of two 32-bit integers).
	* @param record the record.
	*
	* @return the sha-1 hash (20 bytes) for the given record.
	*/
	var hmac_sha1 = function(key, seqNum, record) {
		var hmac = forge.hmac.create();
		hmac.start("SHA1", key);
		var b = forge.util.createBuffer();
		b.putInt32(seqNum[0]);
		b.putInt32(seqNum[1]);
		b.putByte(record.type);
		b.putByte(record.version.major);
		b.putByte(record.version.minor);
		b.putInt16(record.length);
		b.putBytes(record.fragment.bytes());
		hmac.update(b.getBytes());
		return hmac.digest().getBytes();
	};
	/**
	* Compresses the TLSPlaintext record into a TLSCompressed record using the
	* deflate algorithm.
	*
	* @param c the TLS connection.
	* @param record the TLSPlaintext record to compress.
	* @param s the ConnectionState to use.
	*
	* @return true on success, false on failure.
	*/
	var deflate = function(c, record, s) {
		var rval = false;
		try {
			var bytes = c.deflate(record.fragment.getBytes());
			record.fragment = forge.util.createBuffer(bytes);
			record.length = bytes.length;
			rval = true;
		} catch (ex) {}
		return rval;
	};
	/**
	* Decompresses the TLSCompressed record into a TLSPlaintext record using the
	* deflate algorithm.
	*
	* @param c the TLS connection.
	* @param record the TLSCompressed record to decompress.
	* @param s the ConnectionState to use.
	*
	* @return true on success, false on failure.
	*/
	var inflate = function(c, record, s) {
		var rval = false;
		try {
			var bytes = c.inflate(record.fragment.getBytes());
			record.fragment = forge.util.createBuffer(bytes);
			record.length = bytes.length;
			rval = true;
		} catch (ex) {}
		return rval;
	};
	/**
	* Reads a TLS variable-length vector from a byte buffer.
	*
	* Variable-length vectors are defined by specifying a subrange of legal
	* lengths, inclusively, using the notation <floor..ceiling>. When these are
	* encoded, the actual length precedes the vector's contents in the byte
	* stream. The length will be in the form of a number consuming as many bytes
	* as required to hold the vector's specified maximum (ceiling) length. A
	* variable-length vector with an actual length field of zero is referred to
	* as an empty vector.
	*
	* @param b the byte buffer.
	* @param lenBytes the number of bytes required to store the length.
	*
	* @return the resulting byte buffer.
	*/
	var readVector = function(b, lenBytes) {
		var len = 0;
		switch (lenBytes) {
			case 1:
				len = b.getByte();
				break;
			case 2:
				len = b.getInt16();
				break;
			case 3:
				len = b.getInt24();
				break;
			case 4:
				len = b.getInt32();
				break;
		}
		return forge.util.createBuffer(b.getBytes(len));
	};
	/**
	* Writes a TLS variable-length vector to a byte buffer.
	*
	* @param b the byte buffer.
	* @param lenBytes the number of bytes required to store the length.
	* @param v the byte buffer vector.
	*/
	var writeVector = function(b, lenBytes, v) {
		b.putInt(v.length(), lenBytes << 3);
		b.putBuffer(v);
	};
	/**
	* The tls implementation.
	*/
	var tls = {};
	/**
	* Version: TLS 1.2 = 3.3, TLS 1.1 = 3.2, TLS 1.0 = 3.1. Both TLS 1.1 and
	* TLS 1.2 were still too new (ie: openSSL didn't implement them) at the time
	* of this implementation so TLS 1.0 was implemented instead.
	*/
	tls.Versions = {
		TLS_1_0: {
			major: 3,
			minor: 1
		},
		TLS_1_1: {
			major: 3,
			minor: 2
		},
		TLS_1_2: {
			major: 3,
			minor: 3
		}
	};
	tls.SupportedVersions = [tls.Versions.TLS_1_1, tls.Versions.TLS_1_0];
	tls.Version = tls.SupportedVersions[0];
	/**
	* Maximum fragment size. True maximum is 16384, but we fragment before that
	* to allow for unusual small increases during compression.
	*/
	tls.MaxFragment = 15360;
	/**
	* Whether this entity is considered the "client" or "server".
	* enum { server, client } ConnectionEnd;
	*/
	tls.ConnectionEnd = {
		server: 0,
		client: 1
	};
	/**
	* Pseudo-random function algorithm used to generate keys from the master
	* secret.
	* enum { tls_prf_sha256 } PRFAlgorithm;
	*/
	tls.PRFAlgorithm = { tls_prf_sha256: 0 };
	/**
	* Bulk encryption algorithms.
	* enum { null, rc4, des3, aes } BulkCipherAlgorithm;
	*/
	tls.BulkCipherAlgorithm = {
		none: null,
		rc4: 0,
		des3: 1,
		aes: 2
	};
	/**
	* Cipher types.
	* enum { stream, block, aead } CipherType;
	*/
	tls.CipherType = {
		stream: 0,
		block: 1,
		aead: 2
	};
	/**
	* MAC (Message Authentication Code) algorithms.
	* enum { null, hmac_md5, hmac_sha1, hmac_sha256,
	*   hmac_sha384, hmac_sha512} MACAlgorithm;
	*/
	tls.MACAlgorithm = {
		none: null,
		hmac_md5: 0,
		hmac_sha1: 1,
		hmac_sha256: 2,
		hmac_sha384: 3,
		hmac_sha512: 4
	};
	/**
	* Compression algorithms.
	* enum { null(0), deflate(1), (255) } CompressionMethod;
	*/
	tls.CompressionMethod = {
		none: 0,
		deflate: 1
	};
	/**
	* TLS record content types.
	* enum {
	*   change_cipher_spec(20), alert(21), handshake(22),
	*   application_data(23), (255)
	* } ContentType;
	*/
	tls.ContentType = {
		change_cipher_spec: 20,
		alert: 21,
		handshake: 22,
		application_data: 23,
		heartbeat: 24
	};
	/**
	* TLS handshake types.
	* enum {
	*   hello_request(0), client_hello(1), server_hello(2),
	*   certificate(11), server_key_exchange (12),
	*   certificate_request(13), server_hello_done(14),
	*   certificate_verify(15), client_key_exchange(16),
	*   finished(20), (255)
	* } HandshakeType;
	*/
	tls.HandshakeType = {
		hello_request: 0,
		client_hello: 1,
		server_hello: 2,
		certificate: 11,
		server_key_exchange: 12,
		certificate_request: 13,
		server_hello_done: 14,
		certificate_verify: 15,
		client_key_exchange: 16,
		finished: 20
	};
	/**
	* TLS Alert Protocol.
	*
	* enum { warning(1), fatal(2), (255) } AlertLevel;
	*
	* enum {
	*   close_notify(0),
	*   unexpected_message(10),
	*   bad_record_mac(20),
	*   decryption_failed(21),
	*   record_overflow(22),
	*   decompression_failure(30),
	*   handshake_failure(40),
	*   bad_certificate(42),
	*   unsupported_certificate(43),
	*   certificate_revoked(44),
	*   certificate_expired(45),
	*   certificate_unknown(46),
	*   illegal_parameter(47),
	*   unknown_ca(48),
	*   access_denied(49),
	*   decode_error(50),
	*   decrypt_error(51),
	*   export_restriction(60),
	*   protocol_version(70),
	*   insufficient_security(71),
	*   internal_error(80),
	*   user_canceled(90),
	*   no_renegotiation(100),
	*   (255)
	* } AlertDescription;
	*
	* struct {
	*   AlertLevel level;
	*   AlertDescription description;
	* } Alert;
	*/
	tls.Alert = {};
	tls.Alert.Level = {
		warning: 1,
		fatal: 2
	};
	tls.Alert.Description = {
		close_notify: 0,
		unexpected_message: 10,
		bad_record_mac: 20,
		decryption_failed: 21,
		record_overflow: 22,
		decompression_failure: 30,
		handshake_failure: 40,
		bad_certificate: 42,
		unsupported_certificate: 43,
		certificate_revoked: 44,
		certificate_expired: 45,
		certificate_unknown: 46,
		illegal_parameter: 47,
		unknown_ca: 48,
		access_denied: 49,
		decode_error: 50,
		decrypt_error: 51,
		export_restriction: 60,
		protocol_version: 70,
		insufficient_security: 71,
		internal_error: 80,
		user_canceled: 90,
		no_renegotiation: 100
	};
	/**
	* TLS Heartbeat Message types.
	* enum {
	*   heartbeat_request(1),
	*   heartbeat_response(2),
	*   (255)
	* } HeartbeatMessageType;
	*/
	tls.HeartbeatMessageType = {
		heartbeat_request: 1,
		heartbeat_response: 2
	};
	/**
	* Supported cipher suites.
	*/
	tls.CipherSuites = {};
	/**
	* Gets a supported cipher suite from its 2 byte ID.
	*
	* @param twoBytes two bytes in a string.
	*
	* @return the matching supported cipher suite or null.
	*/
	tls.getCipherSuite = function(twoBytes) {
		var rval = null;
		for (var key in tls.CipherSuites) {
			var cs = tls.CipherSuites[key];
			if (cs.id[0] === twoBytes.charCodeAt(0) && cs.id[1] === twoBytes.charCodeAt(1)) {
				rval = cs;
				break;
			}
		}
		return rval;
	};
	/**
	* Called when an unexpected record is encountered.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleUnexpected = function(c, record) {
		if (!(!c.open && c.entity === tls.ConnectionEnd.client)) c.error(c, {
			message: "Unexpected message. Received TLS record out of order.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.unexpected_message
			}
		});
	};
	/**
	* Called when a client receives a HelloRequest record.
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleHelloRequest = function(c, record, length) {
		if (!c.handshaking && c.handshakes > 0) {
			tls.queue(c, tls.createAlert(c, {
				level: tls.Alert.Level.warning,
				description: tls.Alert.Description.no_renegotiation
			}));
			tls.flush(c);
		}
		c.process();
	};
	/**
	* Parses a hello message from a ClientHello or ServerHello record.
	*
	* @param record the record to parse.
	*
	* @return the parsed message.
	*/
	tls.parseHelloMessage = function(c, record, length) {
		var msg = null;
		var client = c.entity === tls.ConnectionEnd.client;
		if (length < 38) c.error(c, {
			message: client ? "Invalid ServerHello message. Message too short." : "Invalid ClientHello message. Message too short.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		else {
			var b = record.fragment;
			var remaining = b.length();
			msg = {
				version: {
					major: b.getByte(),
					minor: b.getByte()
				},
				random: forge.util.createBuffer(b.getBytes(32)),
				session_id: readVector(b, 1),
				extensions: []
			};
			if (client) {
				msg.cipher_suite = b.getBytes(2);
				msg.compression_method = b.getByte();
			} else {
				msg.cipher_suites = readVector(b, 2);
				msg.compression_methods = readVector(b, 1);
			}
			remaining = length - (remaining - b.length());
			if (remaining > 0) {
				var exts = readVector(b, 2);
				while (exts.length() > 0) msg.extensions.push({
					type: [exts.getByte(), exts.getByte()],
					data: readVector(exts, 2)
				});
				if (!client) for (var i = 0; i < msg.extensions.length; ++i) {
					var ext = msg.extensions[i];
					if (ext.type[0] === 0 && ext.type[1] === 0) {
						var snl = readVector(ext.data, 2);
						while (snl.length() > 0) {
							if (snl.getByte() !== 0) break;
							c.session.extensions.server_name.serverNameList.push(readVector(snl, 2).getBytes());
						}
					}
				}
			}
			if (c.session.version) {
				if (msg.version.major !== c.session.version.major || msg.version.minor !== c.session.version.minor) return c.error(c, {
					message: "TLS version change is disallowed during renegotiation.",
					send: true,
					alert: {
						level: tls.Alert.Level.fatal,
						description: tls.Alert.Description.protocol_version
					}
				});
			}
			if (client) c.session.cipherSuite = tls.getCipherSuite(msg.cipher_suite);
			else {
				var tmp = forge.util.createBuffer(msg.cipher_suites.bytes());
				while (tmp.length() > 0) {
					c.session.cipherSuite = tls.getCipherSuite(tmp.getBytes(2));
					if (c.session.cipherSuite !== null) break;
				}
			}
			if (c.session.cipherSuite === null) return c.error(c, {
				message: "No cipher suites in common.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.handshake_failure
				},
				cipherSuite: forge.util.bytesToHex(msg.cipher_suite)
			});
			if (client) c.session.compressionMethod = msg.compression_method;
			else c.session.compressionMethod = tls.CompressionMethod.none;
		}
		return msg;
	};
	/**
	* Creates security parameters for the given connection based on the given
	* hello message.
	*
	* @param c the TLS connection.
	* @param msg the hello message.
	*/
	tls.createSecurityParameters = function(c, msg) {
		var client = c.entity === tls.ConnectionEnd.client;
		var msgRandom = msg.random.bytes();
		var cRandom = client ? c.session.sp.client_random : msgRandom;
		var sRandom = client ? msgRandom : tls.createRandom().getBytes();
		c.session.sp = {
			entity: c.entity,
			prf_algorithm: tls.PRFAlgorithm.tls_prf_sha256,
			bulk_cipher_algorithm: null,
			cipher_type: null,
			enc_key_length: null,
			block_length: null,
			fixed_iv_length: null,
			record_iv_length: null,
			mac_algorithm: null,
			mac_length: null,
			mac_key_length: null,
			compression_algorithm: c.session.compressionMethod,
			pre_master_secret: null,
			master_secret: null,
			client_random: cRandom,
			server_random: sRandom
		};
	};
	/**
	* Called when a client receives a ServerHello record.
	*
	* When a ServerHello message will be sent:
	*   The server will send this message in response to a client hello message
	*   when it was able to find an acceptable set of algorithms. If it cannot
	*   find such a match, it will respond with a handshake failure alert.
	*
	* uint24 length;
	* struct {
	*   ProtocolVersion server_version;
	*   Random random;
	*   SessionID session_id;
	*   CipherSuite cipher_suite;
	*   CompressionMethod compression_method;
	*   select(extensions_present) {
	*     case false:
	*       struct {};
	*     case true:
	*       Extension extensions<0..2^16-1>;
	*   };
	* } ServerHello;
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleServerHello = function(c, record, length) {
		var msg = tls.parseHelloMessage(c, record, length);
		if (c.fail) return;
		if (msg.version.minor <= c.version.minor) c.version.minor = msg.version.minor;
		else return c.error(c, {
			message: "Incompatible TLS version.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.protocol_version
			}
		});
		c.session.version = c.version;
		var sessionId = msg.session_id.bytes();
		if (sessionId.length > 0 && sessionId === c.session.id) {
			c.expect = SCC;
			c.session.resuming = true;
			c.session.sp.server_random = msg.random.bytes();
		} else {
			c.expect = SCE;
			c.session.resuming = false;
			tls.createSecurityParameters(c, msg);
		}
		c.session.id = sessionId;
		c.process();
	};
	/**
	* Called when a server receives a ClientHello record.
	*
	* When a ClientHello message will be sent:
	*   When a client first connects to a server it is required to send the
	*   client hello as its first message. The client can also send a client
	*   hello in response to a hello request or on its own initiative in order
	*   to renegotiate the security parameters in an existing connection.
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleClientHello = function(c, record, length) {
		var msg = tls.parseHelloMessage(c, record, length);
		if (c.fail) return;
		var sessionId = msg.session_id.bytes();
		var session = null;
		if (c.sessionCache) {
			session = c.sessionCache.getSession(sessionId);
			if (session === null) sessionId = "";
			else if (session.version.major !== msg.version.major || session.version.minor > msg.version.minor) {
				session = null;
				sessionId = "";
			}
		}
		if (sessionId.length === 0) sessionId = forge.random.getBytes(32);
		c.session.id = sessionId;
		c.session.clientHelloVersion = msg.version;
		c.session.sp = {};
		if (session) {
			c.version = c.session.version = session.version;
			c.session.sp = session.sp;
		} else {
			var version;
			for (var i = 1; i < tls.SupportedVersions.length; ++i) {
				version = tls.SupportedVersions[i];
				if (version.minor <= msg.version.minor) break;
			}
			c.version = {
				major: version.major,
				minor: version.minor
			};
			c.session.version = c.version;
		}
		if (session !== null) {
			c.expect = CCC;
			c.session.resuming = true;
			c.session.sp.client_random = msg.random.bytes();
		} else {
			c.expect = c.verifyClient !== false ? CCE : CKE;
			c.session.resuming = false;
			tls.createSecurityParameters(c, msg);
		}
		c.open = true;
		tls.queue(c, tls.createRecord(c, {
			type: tls.ContentType.handshake,
			data: tls.createServerHello(c)
		}));
		if (c.session.resuming) {
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.change_cipher_spec,
				data: tls.createChangeCipherSpec()
			}));
			c.state.pending = tls.createConnectionState(c);
			c.state.current.write = c.state.pending.write;
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createFinished(c)
			}));
		} else {
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createCertificate(c)
			}));
			if (!c.fail) {
				tls.queue(c, tls.createRecord(c, {
					type: tls.ContentType.handshake,
					data: tls.createServerKeyExchange(c)
				}));
				if (c.verifyClient !== false) tls.queue(c, tls.createRecord(c, {
					type: tls.ContentType.handshake,
					data: tls.createCertificateRequest(c)
				}));
				tls.queue(c, tls.createRecord(c, {
					type: tls.ContentType.handshake,
					data: tls.createServerHelloDone(c)
				}));
			}
		}
		tls.flush(c);
		c.process();
	};
	/**
	* Called when a client receives a Certificate record.
	*
	* When this message will be sent:
	*   The server must send a certificate whenever the agreed-upon key exchange
	*   method is not an anonymous one. This message will always immediately
	*   follow the server hello message.
	*
	* Meaning of this message:
	*   The certificate type must be appropriate for the selected cipher suite's
	*   key exchange algorithm, and is generally an X.509v3 certificate. It must
	*   contain a key which matches the key exchange method, as follows. Unless
	*   otherwise specified, the signing algorithm for the certificate must be
	*   the same as the algorithm for the certificate key. Unless otherwise
	*   specified, the public key may be of any length.
	*
	* opaque ASN.1Cert<1..2^24-1>;
	* struct {
	*   ASN.1Cert certificate_list<1..2^24-1>;
	* } Certificate;
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleCertificate = function(c, record, length) {
		if (length < 3) return c.error(c, {
			message: "Invalid Certificate message. Message too short.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		var b = record.fragment;
		var msg = { certificate_list: readVector(b, 3) };
		var cert, asn1;
		var certs = [];
		try {
			while (msg.certificate_list.length() > 0) {
				cert = readVector(msg.certificate_list, 3);
				asn1 = forge.asn1.fromDer(cert);
				cert = forge.pki.certificateFromAsn1(asn1, true);
				certs.push(cert);
			}
		} catch (ex) {
			return c.error(c, {
				message: "Could not parse certificate list.",
				cause: ex,
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.bad_certificate
				}
			});
		}
		var client = c.entity === tls.ConnectionEnd.client;
		if ((client || c.verifyClient === true) && certs.length === 0) c.error(c, {
			message: client ? "No server certificate provided." : "No client certificate provided.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		else if (certs.length === 0) c.expect = client ? SKE : CKE;
		else {
			if (client) c.session.serverCertificate = certs[0];
			else c.session.clientCertificate = certs[0];
			if (tls.verifyCertificateChain(c, certs)) c.expect = client ? SKE : CKE;
		}
		c.process();
	};
	/**
	* Called when a client receives a ServerKeyExchange record.
	*
	* When this message will be sent:
	*   This message will be sent immediately after the server certificate
	*   message (or the server hello message, if this is an anonymous
	*   negotiation).
	*
	*   The server key exchange message is sent by the server only when the
	*   server certificate message (if sent) does not contain enough data to
	*   allow the client to exchange a premaster secret.
	*
	* Meaning of this message:
	*   This message conveys cryptographic information to allow the client to
	*   communicate the premaster secret: either an RSA public key to encrypt
	*   the premaster secret with, or a Diffie-Hellman public key with which the
	*   client can complete a key exchange (with the result being the premaster
	*   secret.)
	*
	* enum {
	*   dhe_dss, dhe_rsa, dh_anon, rsa, dh_dss, dh_rsa
	* } KeyExchangeAlgorithm;
	*
	* struct {
	*   opaque dh_p<1..2^16-1>;
	*   opaque dh_g<1..2^16-1>;
	*   opaque dh_Ys<1..2^16-1>;
	* } ServerDHParams;
	*
	* struct {
	*   select(KeyExchangeAlgorithm) {
	*     case dh_anon:
	*       ServerDHParams params;
	*     case dhe_dss:
	*     case dhe_rsa:
	*       ServerDHParams params;
	*       digitally-signed struct {
	*         opaque client_random[32];
	*         opaque server_random[32];
	*         ServerDHParams params;
	*       } signed_params;
	*     case rsa:
	*     case dh_dss:
	*     case dh_rsa:
	*       struct {};
	*   };
	* } ServerKeyExchange;
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleServerKeyExchange = function(c, record, length) {
		if (length > 0) return c.error(c, {
			message: "Invalid key parameters. Only RSA is supported.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.unsupported_certificate
			}
		});
		c.expect = SCR;
		c.process();
	};
	/**
	* Called when a client receives a ClientKeyExchange record.
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleClientKeyExchange = function(c, record, length) {
		if (length < 48) return c.error(c, {
			message: "Invalid key parameters. Only RSA is supported.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.unsupported_certificate
			}
		});
		var b = record.fragment;
		var msg = { enc_pre_master_secret: readVector(b, 2).getBytes() };
		var privateKey = null;
		if (c.getPrivateKey) try {
			privateKey = c.getPrivateKey(c, c.session.serverCertificate);
			privateKey = forge.pki.privateKeyFromPem(privateKey);
		} catch (ex) {
			c.error(c, {
				message: "Could not get private key.",
				cause: ex,
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.internal_error
				}
			});
		}
		if (privateKey === null) return c.error(c, {
			message: "No private key set.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.internal_error
			}
		});
		try {
			var sp = c.session.sp;
			sp.pre_master_secret = privateKey.decrypt(msg.enc_pre_master_secret);
			var version = c.session.clientHelloVersion;
			if (version.major !== sp.pre_master_secret.charCodeAt(0) || version.minor !== sp.pre_master_secret.charCodeAt(1)) throw new Error("TLS version rollback attack detected.");
		} catch (ex) {
			sp.pre_master_secret = forge.random.getBytes(48);
		}
		c.expect = CCC;
		if (c.session.clientCertificate !== null) c.expect = CCV;
		c.process();
	};
	/**
	* Called when a client receives a CertificateRequest record.
	*
	* When this message will be sent:
	*   A non-anonymous server can optionally request a certificate from the
	*   client, if appropriate for the selected cipher suite. This message, if
	*   sent, will immediately follow the Server Key Exchange message (if it is
	*   sent; otherwise, the Server Certificate message).
	*
	* enum {
	*   rsa_sign(1), dss_sign(2), rsa_fixed_dh(3), dss_fixed_dh(4),
	*   rsa_ephemeral_dh_RESERVED(5), dss_ephemeral_dh_RESERVED(6),
	*   fortezza_dms_RESERVED(20), (255)
	* } ClientCertificateType;
	*
	* opaque DistinguishedName<1..2^16-1>;
	*
	* struct {
	*   ClientCertificateType certificate_types<1..2^8-1>;
	*   SignatureAndHashAlgorithm supported_signature_algorithms<2^16-1>;
	*   DistinguishedName certificate_authorities<0..2^16-1>;
	* } CertificateRequest;
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleCertificateRequest = function(c, record, length) {
		if (length < 3) return c.error(c, {
			message: "Invalid CertificateRequest. Message too short.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		var b = record.fragment;
		var msg = {
			certificate_types: readVector(b, 1),
			certificate_authorities: readVector(b, 2)
		};
		c.session.certificateRequest = msg;
		c.expect = SHD;
		c.process();
	};
	/**
	* Called when a server receives a CertificateVerify record.
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleCertificateVerify = function(c, record, length) {
		if (length < 2) return c.error(c, {
			message: "Invalid CertificateVerify. Message too short.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		var b = record.fragment;
		b.read -= 4;
		var msgBytes = b.bytes();
		b.read += 4;
		var msg = { signature: readVector(b, 2).getBytes() };
		var verify = forge.util.createBuffer();
		verify.putBuffer(c.session.md5.digest());
		verify.putBuffer(c.session.sha1.digest());
		verify = verify.getBytes();
		try {
			if (!c.session.clientCertificate.publicKey.verify(verify, msg.signature, "NONE")) throw new Error("CertificateVerify signature does not match.");
			c.session.md5.update(msgBytes);
			c.session.sha1.update(msgBytes);
		} catch (ex) {
			return c.error(c, {
				message: "Bad signature in CertificateVerify.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.handshake_failure
				}
			});
		}
		c.expect = CCC;
		c.process();
	};
	/**
	* Called when a client receives a ServerHelloDone record.
	*
	* When this message will be sent:
	*   The server hello done message is sent by the server to indicate the end
	*   of the server hello and associated messages. After sending this message
	*   the server will wait for a client response.
	*
	* Meaning of this message:
	*   This message means that the server is done sending messages to support
	*   the key exchange, and the client can proceed with its phase of the key
	*   exchange.
	*
	*   Upon receipt of the server hello done message the client should verify
	*   that the server provided a valid certificate if required and check that
	*   the server hello parameters are acceptable.
	*
	* struct {} ServerHelloDone;
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleServerHelloDone = function(c, record, length) {
		if (length > 0) return c.error(c, {
			message: "Invalid ServerHelloDone message. Invalid length.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.record_overflow
			}
		});
		if (c.serverCertificate === null) {
			var error = {
				message: "No server certificate provided. Not enough security.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.insufficient_security
				}
			};
			var ret = c.verify(c, error.alert.description, 0, []);
			if (ret !== true) {
				if (ret || ret === 0) {
					if (typeof ret === "object" && !forge.util.isArray(ret)) {
						if (ret.message) error.message = ret.message;
						if (ret.alert) error.alert.description = ret.alert;
					} else if (typeof ret === "number") error.alert.description = ret;
				}
				return c.error(c, error);
			}
		}
		if (c.session.certificateRequest !== null) {
			record = tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createCertificate(c)
			});
			tls.queue(c, record);
		}
		record = tls.createRecord(c, {
			type: tls.ContentType.handshake,
			data: tls.createClientKeyExchange(c)
		});
		tls.queue(c, record);
		c.expect = SER;
		var callback = function(c, signature) {
			if (c.session.certificateRequest !== null && c.session.clientCertificate !== null) tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createCertificateVerify(c, signature)
			}));
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.change_cipher_spec,
				data: tls.createChangeCipherSpec()
			}));
			c.state.pending = tls.createConnectionState(c);
			c.state.current.write = c.state.pending.write;
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createFinished(c)
			}));
			c.expect = SCC;
			tls.flush(c);
			c.process();
		};
		if (c.session.certificateRequest === null || c.session.clientCertificate === null) return callback(c, null);
		tls.getClientSignature(c, callback);
	};
	/**
	* Called when a ChangeCipherSpec record is received.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleChangeCipherSpec = function(c, record) {
		if (record.fragment.getByte() !== 1) return c.error(c, {
			message: "Invalid ChangeCipherSpec message received.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.illegal_parameter
			}
		});
		var client = c.entity === tls.ConnectionEnd.client;
		if (c.session.resuming && client || !c.session.resuming && !client) c.state.pending = tls.createConnectionState(c);
		c.state.current.read = c.state.pending.read;
		if (!c.session.resuming && client || c.session.resuming && !client) c.state.pending = null;
		c.expect = client ? SFI : CFI;
		c.process();
	};
	/**
	* Called when a Finished record is received.
	*
	* When this message will be sent:
	*   A finished message is always sent immediately after a change
	*   cipher spec message to verify that the key exchange and
	*   authentication processes were successful. It is essential that a
	*   change cipher spec message be received between the other
	*   handshake messages and the Finished message.
	*
	* Meaning of this message:
	*   The finished message is the first protected with the just-
	*   negotiated algorithms, keys, and secrets. Recipients of finished
	*   messages must verify that the contents are correct.  Once a side
	*   has sent its Finished message and received and validated the
	*   Finished message from its peer, it may begin to send and receive
	*   application data over the connection.
	*
	* struct {
	*   opaque verify_data[verify_data_length];
	* } Finished;
	*
	* verify_data
	*   PRF(master_secret, finished_label, Hash(handshake_messages))
	*     [0..verify_data_length-1];
	*
	* finished_label
	*   For Finished messages sent by the client, the string
	*   "client finished". For Finished messages sent by the server, the
	*   string "server finished".
	*
	* verify_data_length depends on the cipher suite. If it is not specified
	* by the cipher suite, then it is 12. Versions of TLS < 1.2 always used
	* 12 bytes.
	*
	* @param c the connection.
	* @param record the record.
	* @param length the length of the handshake message.
	*/
	tls.handleFinished = function(c, record, length) {
		var b = record.fragment;
		b.read -= 4;
		var msgBytes = b.bytes();
		b.read += 4;
		var vd = record.fragment.getBytes();
		b = forge.util.createBuffer();
		b.putBuffer(c.session.md5.digest());
		b.putBuffer(c.session.sha1.digest());
		var client = c.entity === tls.ConnectionEnd.client;
		var label = client ? "server finished" : "client finished";
		var sp = c.session.sp;
		b = prf_TLS1(sp.master_secret, label, b.getBytes(), 12);
		if (b.getBytes() !== vd) return c.error(c, {
			message: "Invalid verify_data in Finished message.",
			send: true,
			alert: {
				level: tls.Alert.Level.fatal,
				description: tls.Alert.Description.decrypt_error
			}
		});
		c.session.md5.update(msgBytes);
		c.session.sha1.update(msgBytes);
		if (c.session.resuming && client || !c.session.resuming && !client) {
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.change_cipher_spec,
				data: tls.createChangeCipherSpec()
			}));
			c.state.current.write = c.state.pending.write;
			c.state.pending = null;
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.handshake,
				data: tls.createFinished(c)
			}));
		}
		c.expect = client ? SAD : CAD;
		c.handshaking = false;
		++c.handshakes;
		c.peerCertificate = client ? c.session.serverCertificate : c.session.clientCertificate;
		tls.flush(c);
		c.isConnected = true;
		c.connected(c);
		c.process();
	};
	/**
	* Called when an Alert record is received.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleAlert = function(c, record) {
		var b = record.fragment;
		var alert = {
			level: b.getByte(),
			description: b.getByte()
		};
		var msg;
		switch (alert.description) {
			case tls.Alert.Description.close_notify:
				msg = "Connection closed.";
				break;
			case tls.Alert.Description.unexpected_message:
				msg = "Unexpected message.";
				break;
			case tls.Alert.Description.bad_record_mac:
				msg = "Bad record MAC.";
				break;
			case tls.Alert.Description.decryption_failed:
				msg = "Decryption failed.";
				break;
			case tls.Alert.Description.record_overflow:
				msg = "Record overflow.";
				break;
			case tls.Alert.Description.decompression_failure:
				msg = "Decompression failed.";
				break;
			case tls.Alert.Description.handshake_failure:
				msg = "Handshake failure.";
				break;
			case tls.Alert.Description.bad_certificate:
				msg = "Bad certificate.";
				break;
			case tls.Alert.Description.unsupported_certificate:
				msg = "Unsupported certificate.";
				break;
			case tls.Alert.Description.certificate_revoked:
				msg = "Certificate revoked.";
				break;
			case tls.Alert.Description.certificate_expired:
				msg = "Certificate expired.";
				break;
			case tls.Alert.Description.certificate_unknown:
				msg = "Certificate unknown.";
				break;
			case tls.Alert.Description.illegal_parameter:
				msg = "Illegal parameter.";
				break;
			case tls.Alert.Description.unknown_ca:
				msg = "Unknown certificate authority.";
				break;
			case tls.Alert.Description.access_denied:
				msg = "Access denied.";
				break;
			case tls.Alert.Description.decode_error:
				msg = "Decode error.";
				break;
			case tls.Alert.Description.decrypt_error:
				msg = "Decrypt error.";
				break;
			case tls.Alert.Description.export_restriction:
				msg = "Export restriction.";
				break;
			case tls.Alert.Description.protocol_version:
				msg = "Unsupported protocol version.";
				break;
			case tls.Alert.Description.insufficient_security:
				msg = "Insufficient security.";
				break;
			case tls.Alert.Description.internal_error:
				msg = "Internal error.";
				break;
			case tls.Alert.Description.user_canceled:
				msg = "User canceled.";
				break;
			case tls.Alert.Description.no_renegotiation:
				msg = "Renegotiation not supported.";
				break;
			default:
				msg = "Unknown error.";
				break;
		}
		if (alert.description === tls.Alert.Description.close_notify) return c.close();
		c.error(c, {
			message: msg,
			send: false,
			origin: c.entity === tls.ConnectionEnd.client ? "server" : "client",
			alert
		});
		c.process();
	};
	/**
	* Called when a Handshake record is received.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleHandshake = function(c, record) {
		var b = record.fragment;
		var type = b.getByte();
		var length = b.getInt24();
		if (length > b.length()) {
			c.fragmented = record;
			record.fragment = forge.util.createBuffer();
			b.read -= 4;
			return c.process();
		}
		c.fragmented = null;
		b.read -= 4;
		var bytes = b.bytes(length + 4);
		b.read += 4;
		if (type in hsTable[c.entity][c.expect]) {
			if (c.entity === tls.ConnectionEnd.server && !c.open && !c.fail) {
				c.handshaking = true;
				c.session = {
					version: null,
					extensions: { server_name: { serverNameList: [] } },
					cipherSuite: null,
					compressionMethod: null,
					serverCertificate: null,
					clientCertificate: null,
					md5: forge.md.md5.create(),
					sha1: forge.md.sha1.create()
				};
			}
			if (type !== tls.HandshakeType.hello_request && type !== tls.HandshakeType.certificate_verify && type !== tls.HandshakeType.finished) {
				c.session.md5.update(bytes);
				c.session.sha1.update(bytes);
			}
			hsTable[c.entity][c.expect][type](c, record, length);
		} else tls.handleUnexpected(c, record);
	};
	/**
	* Called when an ApplicationData record is received.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleApplicationData = function(c, record) {
		c.data.putBuffer(record.fragment);
		c.dataReady(c);
		c.process();
	};
	/**
	* Called when a Heartbeat record is received.
	*
	* @param c the connection.
	* @param record the record.
	*/
	tls.handleHeartbeat = function(c, record) {
		var b = record.fragment;
		var type = b.getByte();
		var length = b.getInt16();
		var payload = b.getBytes(length);
		if (type === tls.HeartbeatMessageType.heartbeat_request) {
			if (c.handshaking || length > payload.length) return c.process();
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.heartbeat,
				data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_response, payload)
			}));
			tls.flush(c);
		} else if (type === tls.HeartbeatMessageType.heartbeat_response) {
			if (payload !== c.expectedHeartbeatPayload) return c.process();
			if (c.heartbeatReceived) c.heartbeatReceived(c, forge.util.createBuffer(payload));
		}
		c.process();
	};
	/**
	* The transistional state tables for receiving TLS records. It maps the
	* current TLS engine state and a received record to a function to handle the
	* record and update the state.
	*
	* For instance, if the current state is SHE, then the TLS engine is expecting
	* a ServerHello record. Once a record is received, the handler function is
	* looked up using the state SHE and the record's content type.
	*
	* The resulting function will either be an error handler or a record handler.
	* The function will take whatever action is appropriate and update the state
	* for the next record.
	*
	* The states are all based on possible server record types. Note that the
	* client will never specifically expect to receive a HelloRequest or an alert
	* from the server so there is no state that reflects this. These messages may
	* occur at any time.
	*
	* There are two tables for mapping states because there is a second tier of
	* types for handshake messages. Once a record with a content type of handshake
	* is received, the handshake record handler will look up the handshake type in
	* the secondary map to get its appropriate handler.
	*
	* Valid message orders are as follows:
	*
	* =======================FULL HANDSHAKE======================
	* Client                                               Server
	*
	* ClientHello                  -------->
	*                                                 ServerHello
	*                                                Certificate*
	*                                          ServerKeyExchange*
	*                                         CertificateRequest*
	*                              <--------      ServerHelloDone
	* Certificate*
	* ClientKeyExchange
	* CertificateVerify*
	* [ChangeCipherSpec]
	* Finished                     -------->
	*                                          [ChangeCipherSpec]
	*                              <--------             Finished
	* Application Data             <------->     Application Data
	*
	* =====================SESSION RESUMPTION=====================
	* Client                                                Server
	*
	* ClientHello                   -------->
	*                                                  ServerHello
	*                                           [ChangeCipherSpec]
	*                               <--------             Finished
	* [ChangeCipherSpec]
	* Finished                      -------->
	* Application Data              <------->     Application Data
	*/
	var SHE = 0;
	var SCE = 1;
	var SKE = 2;
	var SCR = 3;
	var SHD = 4;
	var SCC = 5;
	var SFI = 6;
	var SAD = 7;
	var SER = 8;
	var CHE = 0;
	var CCE = 1;
	var CKE = 2;
	var CCV = 3;
	var CCC = 4;
	var CFI = 5;
	var CAD = 6;
	var __ = tls.handleUnexpected;
	var R0 = tls.handleChangeCipherSpec;
	var R1 = tls.handleAlert;
	var R2 = tls.handleHandshake;
	var R3 = tls.handleApplicationData;
	var R4 = tls.handleHeartbeat;
	var ctTable = [];
	ctTable[tls.ConnectionEnd.client] = [
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			R0,
			R1,
			__,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			R3,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		]
	];
	ctTable[tls.ConnectionEnd.server] = [
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			R0,
			R1,
			__,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		],
		[
			__,
			R1,
			R2,
			R3,
			R4
		],
		[
			__,
			R1,
			R2,
			__,
			R4
		]
	];
	var H0 = tls.handleHelloRequest;
	var H1 = tls.handleServerHello;
	var H2 = tls.handleCertificate;
	var H3 = tls.handleServerKeyExchange;
	var H4 = tls.handleCertificateRequest;
	var H5 = tls.handleServerHelloDone;
	var H6 = tls.handleFinished;
	var hsTable = [];
	hsTable[tls.ConnectionEnd.client] = [
		[
			__,
			__,
			H1,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H2,
			H3,
			H4,
			H5,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H3,
			H4,
			H5,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H4,
			H5,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H5,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H6
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			H0,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		]
	];
	var H7 = tls.handleClientHello;
	var H8 = tls.handleClientKeyExchange;
	var H9 = tls.handleCertificateVerify;
	hsTable[tls.ConnectionEnd.server] = [
		[
			__,
			H7,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H2,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H8,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H9,
			__,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			H6
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		],
		[
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__,
			__
		]
	];
	/**
	* Generates the master_secret and keys using the given security parameters.
	*
	* The security parameters for a TLS connection state are defined as such:
	*
	* struct {
	*   ConnectionEnd          entity;
	*   PRFAlgorithm           prf_algorithm;
	*   BulkCipherAlgorithm    bulk_cipher_algorithm;
	*   CipherType             cipher_type;
	*   uint8                  enc_key_length;
	*   uint8                  block_length;
	*   uint8                  fixed_iv_length;
	*   uint8                  record_iv_length;
	*   MACAlgorithm           mac_algorithm;
	*   uint8                  mac_length;
	*   uint8                  mac_key_length;
	*   CompressionMethod      compression_algorithm;
	*   opaque                 master_secret[48];
	*   opaque                 client_random[32];
	*   opaque                 server_random[32];
	* } SecurityParameters;
	*
	* Note that this definition is from TLS 1.2. In TLS 1.0 some of these
	* parameters are ignored because, for instance, the PRFAlgorithm is a
	* builtin-fixed algorithm combining iterations of MD5 and SHA-1 in TLS 1.0.
	*
	* The Record Protocol requires an algorithm to generate keys required by the
	* current connection state.
	*
	* The master secret is expanded into a sequence of secure bytes, which is then
	* split to a client write MAC key, a server write MAC key, a client write
	* encryption key, and a server write encryption key. In TLS 1.0 a client write
	* IV and server write IV are also generated. Each of these is generated from
	* the byte sequence in that order. Unused values are empty. In TLS 1.2, some
	* AEAD ciphers may additionally require a client write IV and a server write
	* IV (see Section 6.2.3.3).
	*
	* When keys, MAC keys, and IVs are generated, the master secret is used as an
	* entropy source.
	*
	* To generate the key material, compute:
	*
	* master_secret = PRF(pre_master_secret, "master secret",
	*                     ClientHello.random + ServerHello.random)
	*
	* key_block = PRF(SecurityParameters.master_secret,
	*                 "key expansion",
	*                 SecurityParameters.server_random +
	*                 SecurityParameters.client_random);
	*
	* until enough output has been generated. Then, the key_block is
	* partitioned as follows:
	*
	* client_write_MAC_key[SecurityParameters.mac_key_length]
	* server_write_MAC_key[SecurityParameters.mac_key_length]
	* client_write_key[SecurityParameters.enc_key_length]
	* server_write_key[SecurityParameters.enc_key_length]
	* client_write_IV[SecurityParameters.fixed_iv_length]
	* server_write_IV[SecurityParameters.fixed_iv_length]
	*
	* In TLS 1.2, the client_write_IV and server_write_IV are only generated for
	* implicit nonce techniques as described in Section 3.2.1 of [AEAD]. This
	* implementation uses TLS 1.0 so IVs are generated.
	*
	* Implementation note: The currently defined cipher suite which requires the
	* most material is AES_256_CBC_SHA256. It requires 2 x 32 byte keys and 2 x 32
	* byte MAC keys, for a total 128 bytes of key material. In TLS 1.0 it also
	* requires 2 x 16 byte IVs, so it actually takes 160 bytes of key material.
	*
	* @param c the connection.
	* @param sp the security parameters to use.
	*
	* @return the security keys.
	*/
	tls.generateKeys = function(c, sp) {
		var prf = prf_TLS1;
		var random = sp.client_random + sp.server_random;
		if (!c.session.resuming) {
			sp.master_secret = prf(sp.pre_master_secret, "master secret", random, 48).bytes();
			sp.pre_master_secret = null;
		}
		random = sp.server_random + sp.client_random;
		var length = 2 * sp.mac_key_length + 2 * sp.enc_key_length;
		var tls10 = c.version.major === tls.Versions.TLS_1_0.major && c.version.minor === tls.Versions.TLS_1_0.minor;
		if (tls10) length += 2 * sp.fixed_iv_length;
		var km = prf(sp.master_secret, "key expansion", random, length);
		var rval = {
			client_write_MAC_key: km.getBytes(sp.mac_key_length),
			server_write_MAC_key: km.getBytes(sp.mac_key_length),
			client_write_key: km.getBytes(sp.enc_key_length),
			server_write_key: km.getBytes(sp.enc_key_length)
		};
		if (tls10) {
			rval.client_write_IV = km.getBytes(sp.fixed_iv_length);
			rval.server_write_IV = km.getBytes(sp.fixed_iv_length);
		}
		return rval;
	};
	/**
	* Creates a new initialized TLS connection state. A connection state has
	* a read mode and a write mode.
	*
	* compression state:
	*   The current state of the compression algorithm.
	*
	* cipher state:
	*   The current state of the encryption algorithm. This will consist of the
	*   scheduled key for that connection. For stream ciphers, this will also
	*   contain whatever state information is necessary to allow the stream to
	*   continue to encrypt or decrypt data.
	*
	* MAC key:
	*   The MAC key for the connection.
	*
	* sequence number:
	*   Each connection state contains a sequence number, which is maintained
	*   separately for read and write states. The sequence number MUST be set to
	*   zero whenever a connection state is made the active state. Sequence
	*   numbers are of type uint64 and may not exceed 2^64-1. Sequence numbers do
	*   not wrap. If a TLS implementation would need to wrap a sequence number,
	*   it must renegotiate instead. A sequence number is incremented after each
	*   record: specifically, the first record transmitted under a particular
	*   connection state MUST use sequence number 0.
	*
	* @param c the connection.
	*
	* @return the new initialized TLS connection state.
	*/
	tls.createConnectionState = function(c) {
		var client = c.entity === tls.ConnectionEnd.client;
		var createMode = function() {
			var mode = {
				sequenceNumber: [0, 0],
				macKey: null,
				macLength: 0,
				macFunction: null,
				cipherState: null,
				cipherFunction: function(record) {
					return true;
				},
				compressionState: null,
				compressFunction: function(record) {
					return true;
				},
				updateSequenceNumber: function() {
					if (mode.sequenceNumber[1] === 4294967295) {
						mode.sequenceNumber[1] = 0;
						++mode.sequenceNumber[0];
					} else ++mode.sequenceNumber[1];
				}
			};
			return mode;
		};
		var state = {
			read: createMode(),
			write: createMode()
		};
		state.read.update = function(c, record) {
			if (!state.read.cipherFunction(record, state.read)) c.error(c, {
				message: "Could not decrypt record or bad MAC.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.bad_record_mac
				}
			});
			else if (!state.read.compressFunction(c, record, state.read)) c.error(c, {
				message: "Could not decompress record.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.decompression_failure
				}
			});
			return !c.fail;
		};
		state.write.update = function(c, record) {
			if (!state.write.compressFunction(c, record, state.write)) c.error(c, {
				message: "Could not compress record.",
				send: false,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.internal_error
				}
			});
			else if (!state.write.cipherFunction(record, state.write)) c.error(c, {
				message: "Could not encrypt record.",
				send: false,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.internal_error
				}
			});
			return !c.fail;
		};
		if (c.session) {
			var sp = c.session.sp;
			c.session.cipherSuite.initSecurityParameters(sp);
			sp.keys = tls.generateKeys(c, sp);
			state.read.macKey = client ? sp.keys.server_write_MAC_key : sp.keys.client_write_MAC_key;
			state.write.macKey = client ? sp.keys.client_write_MAC_key : sp.keys.server_write_MAC_key;
			c.session.cipherSuite.initConnectionState(state, c, sp);
			switch (sp.compression_algorithm) {
				case tls.CompressionMethod.none: break;
				case tls.CompressionMethod.deflate:
					state.read.compressFunction = inflate;
					state.write.compressFunction = deflate;
					break;
				default: throw new Error("Unsupported compression algorithm.");
			}
		}
		return state;
	};
	/**
	* Creates a Random structure.
	*
	* struct {
	*   uint32 gmt_unix_time;
	*   opaque random_bytes[28];
	* } Random;
	*
	* gmt_unix_time:
	*   The current time and date in standard UNIX 32-bit format (seconds since
	*   the midnight starting Jan 1, 1970, UTC, ignoring leap seconds) according
	*   to the sender's internal clock. Clocks are not required to be set
	*   correctly by the basic TLS protocol; higher-level or application
	*   protocols may define additional requirements. Note that, for historical
	*   reasons, the data element is named using GMT, the predecessor of the
	*   current worldwide time base, UTC.
	* random_bytes:
	*   28 bytes generated by a secure random number generator.
	*
	* @return the Random structure as a byte array.
	*/
	tls.createRandom = function() {
		var d = /* @__PURE__ */ new Date();
		var utc = +d + d.getTimezoneOffset() * 6e4;
		var rval = forge.util.createBuffer();
		rval.putInt32(utc);
		rval.putBytes(forge.random.getBytes(28));
		return rval;
	};
	/**
	* Creates a TLS record with the given type and data.
	*
	* @param c the connection.
	* @param options:
	*   type: the record type.
	*   data: the plain text data in a byte buffer.
	*
	* @return the created record.
	*/
	tls.createRecord = function(c, options) {
		if (!options.data) return null;
		return {
			type: options.type,
			version: {
				major: c.version.major,
				minor: c.version.minor
			},
			length: options.data.length(),
			fragment: options.data
		};
	};
	/**
	* Creates a TLS alert record.
	*
	* @param c the connection.
	* @param alert:
	*   level: the TLS alert level.
	*   description: the TLS alert description.
	*
	* @return the created alert record.
	*/
	tls.createAlert = function(c, alert) {
		var b = forge.util.createBuffer();
		b.putByte(alert.level);
		b.putByte(alert.description);
		return tls.createRecord(c, {
			type: tls.ContentType.alert,
			data: b
		});
	};
	/**
	* Creates a ClientHello message.
	*
	* opaque SessionID<0..32>;
	* enum { null(0), deflate(1), (255) } CompressionMethod;
	* uint8 CipherSuite[2];
	*
	* struct {
	*   ProtocolVersion client_version;
	*   Random random;
	*   SessionID session_id;
	*   CipherSuite cipher_suites<2..2^16-2>;
	*   CompressionMethod compression_methods<1..2^8-1>;
	*   select(extensions_present) {
	*     case false:
	*       struct {};
	*     case true:
	*       Extension extensions<0..2^16-1>;
	*   };
	* } ClientHello;
	*
	* The extension format for extended client hellos and server hellos is:
	*
	* struct {
	*   ExtensionType extension_type;
	*   opaque extension_data<0..2^16-1>;
	* } Extension;
	*
	* Here:
	*
	* - "extension_type" identifies the particular extension type.
	* - "extension_data" contains information specific to the particular
	* extension type.
	*
	* The extension types defined in this document are:
	*
	* enum {
	*   server_name(0), max_fragment_length(1),
	*   client_certificate_url(2), trusted_ca_keys(3),
	*   truncated_hmac(4), status_request(5), (65535)
	* } ExtensionType;
	*
	* @param c the connection.
	*
	* @return the ClientHello byte buffer.
	*/
	tls.createClientHello = function(c) {
		c.session.clientHelloVersion = {
			major: c.version.major,
			minor: c.version.minor
		};
		var cipherSuites = forge.util.createBuffer();
		for (var i = 0; i < c.cipherSuites.length; ++i) {
			var cs = c.cipherSuites[i];
			cipherSuites.putByte(cs.id[0]);
			cipherSuites.putByte(cs.id[1]);
		}
		var cSuites = cipherSuites.length();
		var compressionMethods = forge.util.createBuffer();
		compressionMethods.putByte(tls.CompressionMethod.none);
		var cMethods = compressionMethods.length();
		var extensions = forge.util.createBuffer();
		if (c.virtualHost) {
			var ext = forge.util.createBuffer();
			ext.putByte(0);
			ext.putByte(0);
			var serverName = forge.util.createBuffer();
			serverName.putByte(0);
			writeVector(serverName, 2, forge.util.createBuffer(c.virtualHost));
			var snList = forge.util.createBuffer();
			writeVector(snList, 2, serverName);
			writeVector(ext, 2, snList);
			extensions.putBuffer(ext);
		}
		var extLength = extensions.length();
		if (extLength > 0) extLength += 2;
		var sessionId = c.session.id;
		var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + cSuites + 1 + cMethods + extLength;
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.client_hello);
		rval.putInt24(length);
		rval.putByte(c.version.major);
		rval.putByte(c.version.minor);
		rval.putBytes(c.session.sp.client_random);
		writeVector(rval, 1, forge.util.createBuffer(sessionId));
		writeVector(rval, 2, cipherSuites);
		writeVector(rval, 1, compressionMethods);
		if (extLength > 0) writeVector(rval, 2, extensions);
		return rval;
	};
	/**
	* Creates a ServerHello message.
	*
	* @param c the connection.
	*
	* @return the ServerHello byte buffer.
	*/
	tls.createServerHello = function(c) {
		var sessionId = c.session.id;
		var length = sessionId.length + 1 + 2 + 4 + 28 + 2 + 1;
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.server_hello);
		rval.putInt24(length);
		rval.putByte(c.version.major);
		rval.putByte(c.version.minor);
		rval.putBytes(c.session.sp.server_random);
		writeVector(rval, 1, forge.util.createBuffer(sessionId));
		rval.putByte(c.session.cipherSuite.id[0]);
		rval.putByte(c.session.cipherSuite.id[1]);
		rval.putByte(c.session.compressionMethod);
		return rval;
	};
	/**
	* Creates a Certificate message.
	*
	* When this message will be sent:
	*   This is the first message the client can send after receiving a server
	*   hello done message and the first message the server can send after
	*   sending a ServerHello. This client message is only sent if the server
	*   requests a certificate. If no suitable certificate is available, the
	*   client should send a certificate message containing no certificates. If
	*   client authentication is required by the server for the handshake to
	*   continue, it may respond with a fatal handshake failure alert.
	*
	* opaque ASN.1Cert<1..2^24-1>;
	*
	* struct {
	*   ASN.1Cert certificate_list<0..2^24-1>;
	* } Certificate;
	*
	* @param c the connection.
	*
	* @return the Certificate byte buffer.
	*/
	tls.createCertificate = function(c) {
		var client = c.entity === tls.ConnectionEnd.client;
		var cert = null;
		if (c.getCertificate) {
			var hint;
			if (client) hint = c.session.certificateRequest;
			else hint = c.session.extensions.server_name.serverNameList;
			cert = c.getCertificate(c, hint);
		}
		var certList = forge.util.createBuffer();
		if (cert !== null) try {
			if (!forge.util.isArray(cert)) cert = [cert];
			var asn1 = null;
			for (var i = 0; i < cert.length; ++i) {
				var msg = forge.pem.decode(cert[i])[0];
				if (msg.type !== "CERTIFICATE" && msg.type !== "X509 CERTIFICATE" && msg.type !== "TRUSTED CERTIFICATE") {
					var error = /* @__PURE__ */ new Error("Could not convert certificate from PEM; PEM header type is not \"CERTIFICATE\", \"X509 CERTIFICATE\", or \"TRUSTED CERTIFICATE\".");
					error.headerType = msg.type;
					throw error;
				}
				if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
				var der = forge.util.createBuffer(msg.body);
				if (asn1 === null) asn1 = forge.asn1.fromDer(der.bytes(), false);
				var certBuffer = forge.util.createBuffer();
				writeVector(certBuffer, 3, der);
				certList.putBuffer(certBuffer);
			}
			cert = forge.pki.certificateFromAsn1(asn1);
			if (client) c.session.clientCertificate = cert;
			else c.session.serverCertificate = cert;
		} catch (ex) {
			return c.error(c, {
				message: "Could not send certificate list.",
				cause: ex,
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.bad_certificate
				}
			});
		}
		var length = 3 + certList.length();
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.certificate);
		rval.putInt24(length);
		writeVector(rval, 3, certList);
		return rval;
	};
	/**
	* Creates a ClientKeyExchange message.
	*
	* When this message will be sent:
	*   This message is always sent by the client. It will immediately follow the
	*   client certificate message, if it is sent. Otherwise it will be the first
	*   message sent by the client after it receives the server hello done
	*   message.
	*
	* Meaning of this message:
	*   With this message, the premaster secret is set, either though direct
	*   transmission of the RSA-encrypted secret, or by the transmission of
	*   Diffie-Hellman parameters which will allow each side to agree upon the
	*   same premaster secret. When the key exchange method is DH_RSA or DH_DSS,
	*   client certification has been requested, and the client was able to
	*   respond with a certificate which contained a Diffie-Hellman public key
	*   whose parameters (group and generator) matched those specified by the
	*   server in its certificate, this message will not contain any data.
	*
	* Meaning of this message:
	*   If RSA is being used for key agreement and authentication, the client
	*   generates a 48-byte premaster secret, encrypts it using the public key
	*   from the server's certificate or the temporary RSA key provided in a
	*   server key exchange message, and sends the result in an encrypted
	*   premaster secret message. This structure is a variant of the client
	*   key exchange message, not a message in itself.
	*
	* struct {
	*   select(KeyExchangeAlgorithm) {
	*     case rsa: EncryptedPreMasterSecret;
	*     case diffie_hellman: ClientDiffieHellmanPublic;
	*   } exchange_keys;
	* } ClientKeyExchange;
	*
	* struct {
	*   ProtocolVersion client_version;
	*   opaque random[46];
	* } PreMasterSecret;
	*
	* struct {
	*   public-key-encrypted PreMasterSecret pre_master_secret;
	* } EncryptedPreMasterSecret;
	*
	* A public-key-encrypted element is encoded as a vector <0..2^16-1>.
	*
	* @param c the connection.
	*
	* @return the ClientKeyExchange byte buffer.
	*/
	tls.createClientKeyExchange = function(c) {
		var b = forge.util.createBuffer();
		b.putByte(c.session.clientHelloVersion.major);
		b.putByte(c.session.clientHelloVersion.minor);
		b.putBytes(forge.random.getBytes(46));
		var sp = c.session.sp;
		sp.pre_master_secret = b.getBytes();
		b = c.session.serverCertificate.publicKey.encrypt(sp.pre_master_secret);
		var length = b.length + 2;
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.client_key_exchange);
		rval.putInt24(length);
		rval.putInt16(b.length);
		rval.putBytes(b);
		return rval;
	};
	/**
	* Creates a ServerKeyExchange message.
	*
	* @param c the connection.
	*
	* @return the ServerKeyExchange byte buffer.
	*/
	tls.createServerKeyExchange = function(c) {
		var length = 0;
		var rval = forge.util.createBuffer();
		if (length > 0) {
			rval.putByte(tls.HandshakeType.server_key_exchange);
			rval.putInt24(length);
		}
		return rval;
	};
	/**
	* Gets the signed data used to verify a client-side certificate. See
	* tls.createCertificateVerify() for details.
	*
	* @param c the connection.
	* @param callback the callback to call once the signed data is ready.
	*/
	tls.getClientSignature = function(c, callback) {
		var b = forge.util.createBuffer();
		b.putBuffer(c.session.md5.digest());
		b.putBuffer(c.session.sha1.digest());
		b = b.getBytes();
		c.getSignature = c.getSignature || function(c, b, callback) {
			var privateKey = null;
			if (c.getPrivateKey) try {
				privateKey = c.getPrivateKey(c, c.session.clientCertificate);
				privateKey = forge.pki.privateKeyFromPem(privateKey);
			} catch (ex) {
				c.error(c, {
					message: "Could not get private key.",
					cause: ex,
					send: true,
					alert: {
						level: tls.Alert.Level.fatal,
						description: tls.Alert.Description.internal_error
					}
				});
			}
			if (privateKey === null) c.error(c, {
				message: "No private key set.",
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: tls.Alert.Description.internal_error
				}
			});
			else b = privateKey.sign(b, null);
			callback(c, b);
		};
		c.getSignature(c, b, callback);
	};
	/**
	* Creates a CertificateVerify message.
	*
	* Meaning of this message:
	*   This structure conveys the client's Diffie-Hellman public value
	*   (Yc) if it was not already included in the client's certificate.
	*   The encoding used for Yc is determined by the enumerated
	*   PublicValueEncoding. This structure is a variant of the client
	*   key exchange message, not a message in itself.
	*
	* When this message will be sent:
	*   This message is used to provide explicit verification of a client
	*   certificate. This message is only sent following a client
	*   certificate that has signing capability (i.e. all certificates
	*   except those containing fixed Diffie-Hellman parameters). When
	*   sent, it will immediately follow the client key exchange message.
	*
	* struct {
	*   Signature signature;
	* } CertificateVerify;
	*
	* CertificateVerify.signature.md5_hash
	*   MD5(handshake_messages);
	*
	* Certificate.signature.sha_hash
	*   SHA(handshake_messages);
	*
	* Here handshake_messages refers to all handshake messages sent or
	* received starting at client hello up to but not including this
	* message, including the type and length fields of the handshake
	* messages.
	*
	* select(SignatureAlgorithm) {
	*   case anonymous: struct { };
	*   case rsa:
	*     digitally-signed struct {
	*       opaque md5_hash[16];
	*       opaque sha_hash[20];
	*     };
	*   case dsa:
	*     digitally-signed struct {
	*       opaque sha_hash[20];
	*     };
	* } Signature;
	*
	* In digital signing, one-way hash functions are used as input for a
	* signing algorithm. A digitally-signed element is encoded as an opaque
	* vector <0..2^16-1>, where the length is specified by the signing
	* algorithm and key.
	*
	* In RSA signing, a 36-byte structure of two hashes (one SHA and one
	* MD5) is signed (encrypted with the private key). It is encoded with
	* PKCS #1 block type 0 or type 1 as described in [PKCS1].
	*
	* In DSS, the 20 bytes of the SHA hash are run directly through the
	* Digital Signing Algorithm with no additional hashing.
	*
	* @param c the connection.
	* @param signature the signature to include in the message.
	*
	* @return the CertificateVerify byte buffer.
	*/
	tls.createCertificateVerify = function(c, signature) {
		var length = signature.length + 2;
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.certificate_verify);
		rval.putInt24(length);
		rval.putInt16(signature.length);
		rval.putBytes(signature);
		return rval;
	};
	/**
	* Creates a CertificateRequest message.
	*
	* @param c the connection.
	*
	* @return the CertificateRequest byte buffer.
	*/
	tls.createCertificateRequest = function(c) {
		var certTypes = forge.util.createBuffer();
		certTypes.putByte(1);
		var cAs = forge.util.createBuffer();
		for (var key in c.caStore.certs) {
			var cert = c.caStore.certs[key];
			var dn = forge.pki.distinguishedNameToAsn1(cert.subject);
			var byteBuffer = forge.asn1.toDer(dn);
			cAs.putInt16(byteBuffer.length());
			cAs.putBuffer(byteBuffer);
		}
		var length = 1 + certTypes.length() + 2 + cAs.length();
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.certificate_request);
		rval.putInt24(length);
		writeVector(rval, 1, certTypes);
		writeVector(rval, 2, cAs);
		return rval;
	};
	/**
	* Creates a ServerHelloDone message.
	*
	* @param c the connection.
	*
	* @return the ServerHelloDone byte buffer.
	*/
	tls.createServerHelloDone = function(c) {
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.server_hello_done);
		rval.putInt24(0);
		return rval;
	};
	/**
	* Creates a ChangeCipherSpec message.
	*
	* The change cipher spec protocol exists to signal transitions in
	* ciphering strategies. The protocol consists of a single message,
	* which is encrypted and compressed under the current (not the pending)
	* connection state. The message consists of a single byte of value 1.
	*
	* struct {
	*   enum { change_cipher_spec(1), (255) } type;
	* } ChangeCipherSpec;
	*
	* @return the ChangeCipherSpec byte buffer.
	*/
	tls.createChangeCipherSpec = function() {
		var rval = forge.util.createBuffer();
		rval.putByte(1);
		return rval;
	};
	/**
	* Creates a Finished message.
	*
	* struct {
	*   opaque verify_data[12];
	* } Finished;
	*
	* verify_data
	*   PRF(master_secret, finished_label, MD5(handshake_messages) +
	*   SHA-1(handshake_messages)) [0..11];
	*
	* finished_label
	*   For Finished messages sent by the client, the string "client
	*   finished". For Finished messages sent by the server, the
	*   string "server finished".
	*
	* handshake_messages
	*   All of the data from all handshake messages up to but not
	*   including this message. This is only data visible at the
	*   handshake layer and does not include record layer headers.
	*   This is the concatenation of all the Handshake structures as
	*   defined in 7.4 exchanged thus far.
	*
	* @param c the connection.
	*
	* @return the Finished byte buffer.
	*/
	tls.createFinished = function(c) {
		var b = forge.util.createBuffer();
		b.putBuffer(c.session.md5.digest());
		b.putBuffer(c.session.sha1.digest());
		var client = c.entity === tls.ConnectionEnd.client;
		var sp = c.session.sp;
		var vdl = 12;
		var prf = prf_TLS1;
		var label = client ? "client finished" : "server finished";
		b = prf(sp.master_secret, label, b.getBytes(), vdl);
		var rval = forge.util.createBuffer();
		rval.putByte(tls.HandshakeType.finished);
		rval.putInt24(b.length());
		rval.putBuffer(b);
		return rval;
	};
	/**
	* Creates a HeartbeatMessage (See RFC 6520).
	*
	* struct {
	*   HeartbeatMessageType type;
	*   uint16 payload_length;
	*   opaque payload[HeartbeatMessage.payload_length];
	*   opaque padding[padding_length];
	* } HeartbeatMessage;
	*
	* The total length of a HeartbeatMessage MUST NOT exceed 2^14 or
	* max_fragment_length when negotiated as defined in [RFC6066].
	*
	* type: The message type, either heartbeat_request or heartbeat_response.
	*
	* payload_length: The length of the payload.
	*
	* payload: The payload consists of arbitrary content.
	*
	* padding: The padding is random content that MUST be ignored by the
	*   receiver. The length of a HeartbeatMessage is TLSPlaintext.length
	*   for TLS and DTLSPlaintext.length for DTLS. Furthermore, the
	*   length of the type field is 1 byte, and the length of the
	*   payload_length is 2. Therefore, the padding_length is
	*   TLSPlaintext.length - payload_length - 3 for TLS and
	*   DTLSPlaintext.length - payload_length - 3 for DTLS. The
	*   padding_length MUST be at least 16.
	*
	* The sender of a HeartbeatMessage MUST use a random padding of at
	* least 16 bytes. The padding of a received HeartbeatMessage message
	* MUST be ignored.
	*
	* If the payload_length of a received HeartbeatMessage is too large,
	* the received HeartbeatMessage MUST be discarded silently.
	*
	* @param c the connection.
	* @param type the tls.HeartbeatMessageType.
	* @param payload the heartbeat data to send as the payload.
	* @param [payloadLength] the payload length to use, defaults to the
	*          actual payload length.
	*
	* @return the HeartbeatRequest byte buffer.
	*/
	tls.createHeartbeat = function(type, payload, payloadLength) {
		if (typeof payloadLength === "undefined") payloadLength = payload.length;
		var rval = forge.util.createBuffer();
		rval.putByte(type);
		rval.putInt16(payloadLength);
		rval.putBytes(payload);
		var plaintextLength = rval.length();
		var paddingLength = Math.max(16, plaintextLength - payloadLength - 3);
		rval.putBytes(forge.random.getBytes(paddingLength));
		return rval;
	};
	/**
	* Fragments, compresses, encrypts, and queues a record for delivery.
	*
	* @param c the connection.
	* @param record the record to queue.
	*/
	tls.queue = function(c, record) {
		if (!record) return;
		if (record.fragment.length() === 0) {
			if (record.type === tls.ContentType.handshake || record.type === tls.ContentType.alert || record.type === tls.ContentType.change_cipher_spec) return;
		}
		if (record.type === tls.ContentType.handshake) {
			var bytes = record.fragment.bytes();
			c.session.md5.update(bytes);
			c.session.sha1.update(bytes);
			bytes = null;
		}
		var records;
		if (record.fragment.length() <= tls.MaxFragment) records = [record];
		else {
			records = [];
			var data = record.fragment.bytes();
			while (data.length > tls.MaxFragment) {
				records.push(tls.createRecord(c, {
					type: record.type,
					data: forge.util.createBuffer(data.slice(0, tls.MaxFragment))
				}));
				data = data.slice(tls.MaxFragment);
			}
			if (data.length > 0) records.push(tls.createRecord(c, {
				type: record.type,
				data: forge.util.createBuffer(data)
			}));
		}
		for (var i = 0; i < records.length && !c.fail; ++i) {
			var rec = records[i];
			if (c.state.current.write.update(c, rec)) c.records.push(rec);
		}
	};
	/**
	* Flushes all queued records to the output buffer and calls the
	* tlsDataReady() handler on the given connection.
	*
	* @param c the connection.
	*
	* @return true on success, false on failure.
	*/
	tls.flush = function(c) {
		for (var i = 0; i < c.records.length; ++i) {
			var record = c.records[i];
			c.tlsData.putByte(record.type);
			c.tlsData.putByte(record.version.major);
			c.tlsData.putByte(record.version.minor);
			c.tlsData.putInt16(record.fragment.length());
			c.tlsData.putBuffer(c.records[i].fragment);
		}
		c.records = [];
		return c.tlsDataReady(c);
	};
	/**
	* Maps a pki.certificateError to a tls.Alert.Description.
	*
	* @param error the error to map.
	*
	* @return the alert description.
	*/
	var _certErrorToAlertDesc = function(error) {
		switch (error) {
			case true: return true;
			case forge.pki.certificateError.bad_certificate: return tls.Alert.Description.bad_certificate;
			case forge.pki.certificateError.unsupported_certificate: return tls.Alert.Description.unsupported_certificate;
			case forge.pki.certificateError.certificate_revoked: return tls.Alert.Description.certificate_revoked;
			case forge.pki.certificateError.certificate_expired: return tls.Alert.Description.certificate_expired;
			case forge.pki.certificateError.certificate_unknown: return tls.Alert.Description.certificate_unknown;
			case forge.pki.certificateError.unknown_ca: return tls.Alert.Description.unknown_ca;
			default: return tls.Alert.Description.bad_certificate;
		}
	};
	/**
	* Maps a tls.Alert.Description to a pki.certificateError.
	*
	* @param desc the alert description.
	*
	* @return the certificate error.
	*/
	var _alertDescToCertError = function(desc) {
		switch (desc) {
			case true: return true;
			case tls.Alert.Description.bad_certificate: return forge.pki.certificateError.bad_certificate;
			case tls.Alert.Description.unsupported_certificate: return forge.pki.certificateError.unsupported_certificate;
			case tls.Alert.Description.certificate_revoked: return forge.pki.certificateError.certificate_revoked;
			case tls.Alert.Description.certificate_expired: return forge.pki.certificateError.certificate_expired;
			case tls.Alert.Description.certificate_unknown: return forge.pki.certificateError.certificate_unknown;
			case tls.Alert.Description.unknown_ca: return forge.pki.certificateError.unknown_ca;
			default: return forge.pki.certificateError.bad_certificate;
		}
	};
	/**
	* Verifies a certificate chain against the given connection's
	* Certificate Authority store.
	*
	* @param c the TLS connection.
	* @param chain the certificate chain to verify, with the root or highest
	*          authority at the end.
	*
	* @return true if successful, false if not.
	*/
	tls.verifyCertificateChain = function(c, chain) {
		try {
			var options = {};
			for (var key in c.verifyOptions) options[key] = c.verifyOptions[key];
			options.verify = function(vfd, depth, chain) {
				_certErrorToAlertDesc(vfd);
				var ret = c.verify(c, vfd, depth, chain);
				if (ret !== true) {
					if (typeof ret === "object" && !forge.util.isArray(ret)) {
						var error = /* @__PURE__ */ new Error("The application rejected the certificate.");
						error.send = true;
						error.alert = {
							level: tls.Alert.Level.fatal,
							description: tls.Alert.Description.bad_certificate
						};
						if (ret.message) error.message = ret.message;
						if (ret.alert) error.alert.description = ret.alert;
						throw error;
					}
					if (ret !== vfd) ret = _alertDescToCertError(ret);
				}
				return ret;
			};
			forge.pki.verifyCertificateChain(c.caStore, chain, options);
		} catch (ex) {
			var err = ex;
			if (typeof err !== "object" || forge.util.isArray(err)) err = {
				send: true,
				alert: {
					level: tls.Alert.Level.fatal,
					description: _certErrorToAlertDesc(ex)
				}
			};
			if (!("send" in err)) err.send = true;
			if (!("alert" in err)) err.alert = {
				level: tls.Alert.Level.fatal,
				description: _certErrorToAlertDesc(err.error)
			};
			c.error(c, err);
		}
		return !c.fail;
	};
	/**
	* Creates a new TLS session cache.
	*
	* @param cache optional map of session ID to cached session.
	* @param capacity the maximum size for the cache (default: 100).
	*
	* @return the new TLS session cache.
	*/
	tls.createSessionCache = function(cache, capacity) {
		var rval = null;
		if (cache && cache.getSession && cache.setSession && cache.order) rval = cache;
		else {
			rval = {};
			rval.cache = cache || {};
			rval.capacity = Math.max(capacity || 100, 1);
			rval.order = [];
			for (var key in cache) if (rval.order.length <= capacity) rval.order.push(key);
			else delete cache[key];
			rval.getSession = function(sessionId) {
				var session = null;
				var key = null;
				if (sessionId) key = forge.util.bytesToHex(sessionId);
				else if (rval.order.length > 0) key = rval.order[0];
				if (key !== null && key in rval.cache) {
					session = rval.cache[key];
					delete rval.cache[key];
					for (var i in rval.order) if (rval.order[i] === key) {
						rval.order.splice(i, 1);
						break;
					}
				}
				return session;
			};
			rval.setSession = function(sessionId, session) {
				if (rval.order.length === rval.capacity) {
					var key = rval.order.shift();
					delete rval.cache[key];
				}
				var key = forge.util.bytesToHex(sessionId);
				rval.order.push(key);
				rval.cache[key] = session;
			};
		}
		return rval;
	};
	/**
	* Creates a new TLS connection.
	*
	* See public createConnection() docs for more details.
	*
	* @param options the options for this connection.
	*
	* @return the new TLS connection.
	*/
	tls.createConnection = function(options) {
		var caStore = null;
		if (options.caStore) if (forge.util.isArray(options.caStore)) caStore = forge.pki.createCaStore(options.caStore);
		else caStore = options.caStore;
		else caStore = forge.pki.createCaStore();
		var cipherSuites = options.cipherSuites || null;
		if (cipherSuites === null) {
			cipherSuites = [];
			for (var key in tls.CipherSuites) cipherSuites.push(tls.CipherSuites[key]);
		}
		var entity = options.server || false ? tls.ConnectionEnd.server : tls.ConnectionEnd.client;
		var sessionCache = options.sessionCache ? tls.createSessionCache(options.sessionCache) : null;
		var c = {
			version: {
				major: tls.Version.major,
				minor: tls.Version.minor
			},
			entity,
			sessionId: options.sessionId,
			caStore,
			sessionCache,
			cipherSuites,
			connected: options.connected,
			virtualHost: options.virtualHost || null,
			verifyClient: options.verifyClient || false,
			verify: options.verify || function(cn, vfd, dpth, cts) {
				return vfd;
			},
			verifyOptions: options.verifyOptions || {},
			getCertificate: options.getCertificate || null,
			getPrivateKey: options.getPrivateKey || null,
			getSignature: options.getSignature || null,
			input: forge.util.createBuffer(),
			tlsData: forge.util.createBuffer(),
			data: forge.util.createBuffer(),
			tlsDataReady: options.tlsDataReady,
			dataReady: options.dataReady,
			heartbeatReceived: options.heartbeatReceived,
			closed: options.closed,
			error: function(c, ex) {
				ex.origin = ex.origin || (c.entity === tls.ConnectionEnd.client ? "client" : "server");
				if (ex.send) {
					tls.queue(c, tls.createAlert(c, ex.alert));
					tls.flush(c);
				}
				var fatal = ex.fatal !== false;
				if (fatal) c.fail = true;
				options.error(c, ex);
				if (fatal) c.close(false);
			},
			deflate: options.deflate || null,
			inflate: options.inflate || null
		};
		/**
		* Resets a closed TLS connection for reuse. Called in c.close().
		*
		* @param clearFail true to clear the fail flag (default: true).
		*/
		c.reset = function(clearFail) {
			c.version = {
				major: tls.Version.major,
				minor: tls.Version.minor
			};
			c.record = null;
			c.session = null;
			c.peerCertificate = null;
			c.state = {
				pending: null,
				current: null
			};
			c.expect = c.entity === tls.ConnectionEnd.client ? SHE : CHE;
			c.fragmented = null;
			c.records = [];
			c.open = false;
			c.handshakes = 0;
			c.handshaking = false;
			c.isConnected = false;
			c.fail = !(clearFail || typeof clearFail === "undefined");
			c.input.clear();
			c.tlsData.clear();
			c.data.clear();
			c.state.current = tls.createConnectionState(c);
		};
		c.reset();
		/**
		* Updates the current TLS engine state based on the given record.
		*
		* @param c the TLS connection.
		* @param record the TLS record to act on.
		*/
		var _update = function(c, record) {
			var aligned = record.type - tls.ContentType.change_cipher_spec;
			var handlers = ctTable[c.entity][c.expect];
			if (aligned in handlers) handlers[aligned](c, record);
			else tls.handleUnexpected(c, record);
		};
		/**
		* Reads the record header and initializes the next record on the given
		* connection.
		*
		* @param c the TLS connection with the next record.
		*
		* @return 0 if the input data could be processed, otherwise the
		*         number of bytes required for data to be processed.
		*/
		var _readRecordHeader = function(c) {
			var rval = 0;
			var b = c.input;
			var len = b.length();
			if (len < 5) rval = 5 - len;
			else {
				c.record = {
					type: b.getByte(),
					version: {
						major: b.getByte(),
						minor: b.getByte()
					},
					length: b.getInt16(),
					fragment: forge.util.createBuffer(),
					ready: false
				};
				var compatibleVersion = c.record.version.major === c.version.major;
				if (compatibleVersion && c.session && c.session.version) compatibleVersion = c.record.version.minor === c.version.minor;
				if (!compatibleVersion) c.error(c, {
					message: "Incompatible TLS version.",
					send: true,
					alert: {
						level: tls.Alert.Level.fatal,
						description: tls.Alert.Description.protocol_version
					}
				});
			}
			return rval;
		};
		/**
		* Reads the next record's contents and appends its message to any
		* previously fragmented message.
		*
		* @param c the TLS connection with the next record.
		*
		* @return 0 if the input data could be processed, otherwise the
		*         number of bytes required for data to be processed.
		*/
		var _readRecord = function(c) {
			var rval = 0;
			var b = c.input;
			var len = b.length();
			if (len < c.record.length) rval = c.record.length - len;
			else {
				c.record.fragment.putBytes(b.getBytes(c.record.length));
				b.compact();
				if (c.state.current.read.update(c, c.record)) {
					if (c.fragmented !== null) if (c.fragmented.type === c.record.type) {
						c.fragmented.fragment.putBuffer(c.record.fragment);
						c.record = c.fragmented;
					} else c.error(c, {
						message: "Invalid fragmented record.",
						send: true,
						alert: {
							level: tls.Alert.Level.fatal,
							description: tls.Alert.Description.unexpected_message
						}
					});
					c.record.ready = true;
				}
			}
			return rval;
		};
		/**
		* Performs a handshake using the TLS Handshake Protocol, as a client.
		*
		* This method should only be called if the connection is in client mode.
		*
		* @param sessionId the session ID to use, null to start a new one.
		*/
		c.handshake = function(sessionId) {
			if (c.entity !== tls.ConnectionEnd.client) c.error(c, {
				message: "Cannot initiate handshake as a server.",
				fatal: false
			});
			else if (c.handshaking) c.error(c, {
				message: "Handshake already in progress.",
				fatal: false
			});
			else {
				if (c.fail && !c.open && c.handshakes === 0) c.fail = false;
				c.handshaking = true;
				sessionId = sessionId || "";
				var session = null;
				if (sessionId.length > 0) {
					if (c.sessionCache) session = c.sessionCache.getSession(sessionId);
					if (session === null) sessionId = "";
				}
				if (sessionId.length === 0 && c.sessionCache) {
					session = c.sessionCache.getSession();
					if (session !== null) sessionId = session.id;
				}
				c.session = {
					id: sessionId,
					version: null,
					cipherSuite: null,
					compressionMethod: null,
					serverCertificate: null,
					certificateRequest: null,
					clientCertificate: null,
					sp: {},
					md5: forge.md.md5.create(),
					sha1: forge.md.sha1.create()
				};
				if (session) {
					c.version = session.version;
					c.session.sp = session.sp;
				}
				c.session.sp.client_random = tls.createRandom().getBytes();
				c.open = true;
				tls.queue(c, tls.createRecord(c, {
					type: tls.ContentType.handshake,
					data: tls.createClientHello(c)
				}));
				tls.flush(c);
			}
		};
		/**
		* Called when TLS protocol data has been received from somewhere and should
		* be processed by the TLS engine.
		*
		* @param data the TLS protocol data, as a string, to process.
		*
		* @return 0 if the data could be processed, otherwise the number of bytes
		*         required for data to be processed.
		*/
		c.process = function(data) {
			var rval = 0;
			if (data) c.input.putBytes(data);
			if (!c.fail) {
				if (c.record !== null && c.record.ready && c.record.fragment.isEmpty()) c.record = null;
				if (c.record === null) rval = _readRecordHeader(c);
				if (!c.fail && c.record !== null && !c.record.ready) rval = _readRecord(c);
				if (!c.fail && c.record !== null && c.record.ready) _update(c, c.record);
			}
			return rval;
		};
		/**
		* Requests that application data be packaged into a TLS record. The
		* tlsDataReady handler will be called when the TLS record(s) have been
		* prepared.
		*
		* @param data the application data, as a raw 'binary' encoded string, to
		*          be sent; to send utf-16/utf-8 string data, use the return value
		*          of util.encodeUtf8(str).
		*
		* @return true on success, false on failure.
		*/
		c.prepare = function(data) {
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.application_data,
				data: forge.util.createBuffer(data)
			}));
			return tls.flush(c);
		};
		/**
		* Requests that a heartbeat request be packaged into a TLS record for
		* transmission. The tlsDataReady handler will be called when TLS record(s)
		* have been prepared.
		*
		* When a heartbeat response has been received, the heartbeatReceived
		* handler will be called with the matching payload. This handler can
		* be used to clear a retransmission timer, etc.
		*
		* @param payload the heartbeat data to send as the payload in the message.
		* @param [payloadLength] the payload length to use, defaults to the
		*          actual payload length.
		*
		* @return true on success, false on failure.
		*/
		c.prepareHeartbeatRequest = function(payload, payloadLength) {
			if (payload instanceof forge.util.ByteBuffer) payload = payload.bytes();
			if (typeof payloadLength === "undefined") payloadLength = payload.length;
			c.expectedHeartbeatPayload = payload;
			tls.queue(c, tls.createRecord(c, {
				type: tls.ContentType.heartbeat,
				data: tls.createHeartbeat(tls.HeartbeatMessageType.heartbeat_request, payload, payloadLength)
			}));
			return tls.flush(c);
		};
		/**
		* Closes the connection (sends a close_notify alert).
		*
		* @param clearFail true to clear the fail flag (default: true).
		*/
		c.close = function(clearFail) {
			if (!c.fail && c.sessionCache && c.session) {
				var session = {
					id: c.session.id,
					version: c.session.version,
					sp: c.session.sp
				};
				session.sp.keys = null;
				c.sessionCache.setSession(session.id, session);
			}
			if (c.open) {
				c.open = false;
				c.input.clear();
				if (c.isConnected || c.handshaking) {
					c.isConnected = c.handshaking = false;
					tls.queue(c, tls.createAlert(c, {
						level: tls.Alert.Level.warning,
						description: tls.Alert.Description.close_notify
					}));
					tls.flush(c);
				}
				c.closed(c);
			}
			c.reset(clearFail);
		};
		return c;
	};
	module.exports = forge.tls = forge.tls || {};
	for (var key in tls) if (typeof tls[key] !== "function") forge.tls[key] = tls[key];
	forge.tls.prf_tls1 = prf_TLS1;
	forge.tls.hmac_sha1 = hmac_sha1;
	forge.tls.createSessionCache = tls.createSessionCache;
	/**
	* Creates a new TLS connection. This does not make any assumptions about the
	* transport layer that TLS is working on top of, ie: it does not assume there
	* is a TCP/IP connection or establish one. A TLS connection is totally
	* abstracted away from the layer is runs on top of, it merely establishes a
	* secure channel between a client" and a "server".
	*
	* A TLS connection contains 4 connection states: pending read and write, and
	* current read and write.
	*
	* At initialization, the current read and write states will be null. Only once
	* the security parameters have been set and the keys have been generated can
	* the pending states be converted into current states. Current states will be
	* updated for each record processed.
	*
	* A custom certificate verify callback may be provided to check information
	* like the common name on the server's certificate. It will be called for
	* every certificate in the chain. It has the following signature:
	*
	* variable func(c, certs, index, preVerify)
	* Where:
	* c         The TLS connection
	* verified  Set to true if certificate was verified, otherwise the alert
	*           tls.Alert.Description for why the certificate failed.
	* depth     The current index in the chain, where 0 is the server's cert.
	* certs     The certificate chain, *NOTE* if the server was anonymous then
	*           the chain will be empty.
	*
	* The function returns true on success and on failure either the appropriate
	* tls.Alert.Description or an object with 'alert' set to the appropriate
	* tls.Alert.Description and 'message' set to a custom error message. If true
	* is not returned then the connection will abort using, in order of
	* availability, first the returned alert description, second the preVerify
	* alert description, and lastly the default 'bad_certificate'.
	*
	* There are three callbacks that can be used to make use of client-side
	* certificates where each takes the TLS connection as the first parameter:
	*
	* getCertificate(conn, hint)
	*   The second parameter is a hint as to which certificate should be
	*   returned. If the connection entity is a client, then the hint will be
	*   the CertificateRequest message from the server that is part of the
	*   TLS protocol. If the connection entity is a server, then it will be
	*   the servername list provided via an SNI extension the ClientHello, if
	*   one was provided (empty array if not). The hint can be examined to
	*   determine which certificate to use (advanced). Most implementations
	*   will just return a certificate. The return value must be a
	*   PEM-formatted certificate or an array of PEM-formatted certificates
	*   that constitute a certificate chain, with the first in the array/chain
	*   being the client's certificate.
	* getPrivateKey(conn, certificate)
	*   The second parameter is an forge.pki X.509 certificate object that
	*   is associated with the requested private key. The return value must
	*   be a PEM-formatted private key.
	* getSignature(conn, bytes, callback)
	*   This callback can be used instead of getPrivateKey if the private key
	*   is not directly accessible in javascript or should not be. For
	*   instance, a secure external web service could provide the signature
	*   in exchange for appropriate credentials. The second parameter is a
	*   string of bytes to be signed that are part of the TLS protocol. These
	*   bytes are used to verify that the private key for the previously
	*   provided client-side certificate is accessible to the client. The
	*   callback is a function that takes 2 parameters, the TLS connection
	*   and the RSA encrypted (signed) bytes as a string. This callback must
	*   be called once the signature is ready.
	*
	* @param options the options for this connection:
	*   server: true if the connection is server-side, false for client.
	*   sessionId: a session ID to reuse, null for a new connection.
	*   caStore: an array of certificates to trust.
	*   sessionCache: a session cache to use.
	*   cipherSuites: an optional array of cipher suites to use,
	*     see tls.CipherSuites.
	*   connected: function(conn) called when the first handshake completes.
	*   virtualHost: the virtual server name to use in a TLS SNI extension.
	*   verifyClient: true to require a client certificate in server mode,
	*     'optional' to request one, false not to (default: false).
	*   verify: a handler used to custom verify certificates in the chain.
	*   verifyOptions: an object with options for the certificate chain validation.
	*     See documentation of pki.verifyCertificateChain for possible options.
	*     verifyOptions.verify is ignored. If you wish to specify a verify handler
	*     use the verify key.
	*   getCertificate: an optional callback used to get a certificate or
	*     a chain of certificates (as an array).
	*   getPrivateKey: an optional callback used to get a private key.
	*   getSignature: an optional callback used to get a signature.
	*   tlsDataReady: function(conn) called when TLS protocol data has been
	*     prepared and is ready to be used (typically sent over a socket
	*     connection to its destination), read from conn.tlsData buffer.
	*   dataReady: function(conn) called when application data has
	*     been parsed from a TLS record and should be consumed by the
	*     application, read from conn.data buffer.
	*   closed: function(conn) called when the connection has been closed.
	*   error: function(conn, error) called when there was an error.
	*   deflate: function(inBytes) if provided, will deflate TLS records using
	*     the deflate algorithm if the server supports it.
	*   inflate: function(inBytes) if provided, will inflate TLS records using
	*     the deflate algorithm if the server supports it.
	*
	* @return the new TLS connection.
	*/
	forge.tls.createConnection = tls.createConnection;
}));
//#endregion
//#region node_modules/node-forge/lib/aesCipherSuites.js
var require_aesCipherSuites = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* A Javascript implementation of AES Cipher Suites for TLS.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2009-2015 Digital Bazaar, Inc.
	*
	*/
	var forge = require_forge();
	require_aes();
	require_tls();
	var tls = module.exports = forge.tls;
	/**
	* Supported cipher suites.
	*/
	tls.CipherSuites["TLS_RSA_WITH_AES_128_CBC_SHA"] = {
		id: [0, 47],
		name: "TLS_RSA_WITH_AES_128_CBC_SHA",
		initSecurityParameters: function(sp) {
			sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
			sp.cipher_type = tls.CipherType.block;
			sp.enc_key_length = 16;
			sp.block_length = 16;
			sp.fixed_iv_length = 16;
			sp.record_iv_length = 16;
			sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
			sp.mac_length = 20;
			sp.mac_key_length = 20;
		},
		initConnectionState
	};
	tls.CipherSuites["TLS_RSA_WITH_AES_256_CBC_SHA"] = {
		id: [0, 53],
		name: "TLS_RSA_WITH_AES_256_CBC_SHA",
		initSecurityParameters: function(sp) {
			sp.bulk_cipher_algorithm = tls.BulkCipherAlgorithm.aes;
			sp.cipher_type = tls.CipherType.block;
			sp.enc_key_length = 32;
			sp.block_length = 16;
			sp.fixed_iv_length = 16;
			sp.record_iv_length = 16;
			sp.mac_algorithm = tls.MACAlgorithm.hmac_sha1;
			sp.mac_length = 20;
			sp.mac_key_length = 20;
		},
		initConnectionState
	};
	function initConnectionState(state, c, sp) {
		var client = c.entity === forge.tls.ConnectionEnd.client;
		state.read.cipherState = {
			init: false,
			cipher: forge.cipher.createDecipher("AES-CBC", client ? sp.keys.server_write_key : sp.keys.client_write_key),
			iv: client ? sp.keys.server_write_IV : sp.keys.client_write_IV
		};
		state.write.cipherState = {
			init: false,
			cipher: forge.cipher.createCipher("AES-CBC", client ? sp.keys.client_write_key : sp.keys.server_write_key),
			iv: client ? sp.keys.client_write_IV : sp.keys.server_write_IV
		};
		state.read.cipherFunction = decrypt_aes_cbc_sha1;
		state.write.cipherFunction = encrypt_aes_cbc_sha1;
		state.read.macLength = state.write.macLength = sp.mac_length;
		state.read.macFunction = state.write.macFunction = tls.hmac_sha1;
	}
	/**
	* Encrypts the TLSCompressed record into a TLSCipherText record using AES
	* in CBC mode.
	*
	* @param record the TLSCompressed record to encrypt.
	* @param s the ConnectionState to use.
	*
	* @return true on success, false on failure.
	*/
	function encrypt_aes_cbc_sha1(record, s) {
		var rval = false;
		var mac = s.macFunction(s.macKey, s.sequenceNumber, record);
		record.fragment.putBytes(mac);
		s.updateSequenceNumber();
		var iv;
		if (record.version.minor === tls.Versions.TLS_1_0.minor) iv = s.cipherState.init ? null : s.cipherState.iv;
		else iv = forge.random.getBytesSync(16);
		s.cipherState.init = true;
		var cipher = s.cipherState.cipher;
		cipher.start({ iv });
		if (record.version.minor >= tls.Versions.TLS_1_1.minor) cipher.output.putBytes(iv);
		cipher.update(record.fragment);
		if (cipher.finish(encrypt_aes_cbc_sha1_padding)) {
			record.fragment = cipher.output;
			record.length = record.fragment.length();
			rval = true;
		}
		return rval;
	}
	/**
	* Handles padding for aes_cbc_sha1 in encrypt mode.
	*
	* @param blockSize the block size.
	* @param input the input buffer.
	* @param decrypt true in decrypt mode, false in encrypt mode.
	*
	* @return true on success, false on failure.
	*/
	function encrypt_aes_cbc_sha1_padding(blockSize, input, decrypt) {
		if (!decrypt) {
			var padding = blockSize - input.length() % blockSize;
			input.fillWithByte(padding - 1, padding);
		}
		return true;
	}
	/**
	* Handles padding for aes_cbc_sha1 in decrypt mode.
	*
	* @param blockSize the block size.
	* @param output the output buffer.
	* @param decrypt true in decrypt mode, false in encrypt mode.
	*
	* @return true on success, false on failure.
	*/
	function decrypt_aes_cbc_sha1_padding(blockSize, output, decrypt) {
		var rval = true;
		if (decrypt) {
			var len = output.length();
			var paddingLength = output.last();
			for (var i = len - 1 - paddingLength; i < len - 1; ++i) rval = rval && output.at(i) == paddingLength;
			if (rval) output.truncate(paddingLength + 1);
		}
		return rval;
	}
	/**
	* Decrypts a TLSCipherText record into a TLSCompressed record using
	* AES in CBC mode.
	*
	* @param record the TLSCipherText record to decrypt.
	* @param s the ConnectionState to use.
	*
	* @return true on success, false on failure.
	*/
	function decrypt_aes_cbc_sha1(record, s) {
		var rval = false;
		var iv;
		if (record.version.minor === tls.Versions.TLS_1_0.minor) iv = s.cipherState.init ? null : s.cipherState.iv;
		else iv = record.fragment.getBytes(16);
		s.cipherState.init = true;
		var cipher = s.cipherState.cipher;
		cipher.start({ iv });
		cipher.update(record.fragment);
		rval = cipher.finish(decrypt_aes_cbc_sha1_padding);
		var macLen = s.macLength;
		var mac = forge.random.getBytesSync(macLen);
		var len = cipher.output.length();
		if (len >= macLen) {
			record.fragment = cipher.output.getBytes(len - macLen);
			mac = cipher.output.getBytes(macLen);
		} else record.fragment = cipher.output.getBytes();
		record.fragment = forge.util.createBuffer(record.fragment);
		record.length = record.fragment.length();
		var mac2 = s.macFunction(s.macKey, s.sequenceNumber, record);
		s.updateSequenceNumber();
		rval = compareMacs(s.macKey, mac, mac2) && rval;
		return rval;
	}
	/**
	* Safely compare two MACs. This function will compare two MACs in a way
	* that protects against timing attacks.
	*
	* TODO: Expose elsewhere as a utility API.
	*
	* See: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2011/february/double-hmac-verification/
	*
	* @param key the MAC key to use.
	* @param mac1 as a binary-encoded string of bytes.
	* @param mac2 as a binary-encoded string of bytes.
	*
	* @return true if the MACs are the same, false if not.
	*/
	function compareMacs(key, mac1, mac2) {
		var hmac = forge.hmac.create();
		hmac.start("SHA1", key);
		hmac.update(mac1);
		mac1 = hmac.digest().getBytes();
		hmac.start(null, null);
		hmac.update(mac2);
		mac2 = hmac.digest().getBytes();
		return mac1 === mac2;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/sha512.js
var require_sha512 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Secure Hash Algorithm with a 1024-bit block size implementation.
	*
	* This includes: SHA-512, SHA-384, SHA-512/224, and SHA-512/256. For
	* SHA-256 (block size 512 bits), see sha256.js.
	*
	* See FIPS 180-4 for details.
	*
	* @author Dave Longley
	*
	* Copyright (c) 2014-2015 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_md();
	require_util();
	var sha512 = module.exports = forge.sha512 = forge.sha512 || {};
	forge.md.sha512 = forge.md.algorithms.sha512 = sha512;
	var sha384 = forge.sha384 = forge.sha512.sha384 = forge.sha512.sha384 || {};
	sha384.create = function() {
		return sha512.create("SHA-384");
	};
	forge.md.sha384 = forge.md.algorithms.sha384 = sha384;
	forge.sha512.sha256 = forge.sha512.sha256 || { create: function() {
		return sha512.create("SHA-512/256");
	} };
	forge.md["sha512/256"] = forge.md.algorithms["sha512/256"] = forge.sha512.sha256;
	forge.sha512.sha224 = forge.sha512.sha224 || { create: function() {
		return sha512.create("SHA-512/224");
	} };
	forge.md["sha512/224"] = forge.md.algorithms["sha512/224"] = forge.sha512.sha224;
	/**
	* Creates a SHA-2 message digest object.
	*
	* @param algorithm the algorithm to use (SHA-512, SHA-384, SHA-512/224,
	*          SHA-512/256).
	*
	* @return a message digest object.
	*/
	sha512.create = function(algorithm) {
		if (!_initialized) _init();
		if (typeof algorithm === "undefined") algorithm = "SHA-512";
		if (!(algorithm in _states)) throw new Error("Invalid SHA-512 algorithm: " + algorithm);
		var _state = _states[algorithm];
		var _h = null;
		var _input = forge.util.createBuffer();
		var _w = new Array(80);
		for (var wi = 0; wi < 80; ++wi) _w[wi] = new Array(2);
		var digestLength = 64;
		switch (algorithm) {
			case "SHA-384":
				digestLength = 48;
				break;
			case "SHA-512/256":
				digestLength = 32;
				break;
			case "SHA-512/224":
				digestLength = 28;
				break;
		}
		var md = {
			algorithm: algorithm.replace("-", "").toLowerCase(),
			blockLength: 128,
			digestLength,
			messageLength: 0,
			fullMessageLength: null,
			messageLengthSize: 16
		};
		/**
		* Starts the digest.
		*
		* @return this digest object.
		*/
		md.start = function() {
			md.messageLength = 0;
			md.fullMessageLength = md.messageLength128 = [];
			var int32s = md.messageLengthSize / 4;
			for (var i = 0; i < int32s; ++i) md.fullMessageLength.push(0);
			_input = forge.util.createBuffer();
			_h = new Array(_state.length);
			for (var i = 0; i < _state.length; ++i) _h[i] = _state[i].slice(0);
			return md;
		};
		md.start();
		/**
		* Updates the digest with the given message input. The given input can
		* treated as raw input (no encoding will be applied) or an encoding of
		* 'utf8' maybe given to encode the input using UTF-8.
		*
		* @param msg the message input to update with.
		* @param encoding the encoding to use (default: 'raw', other: 'utf8').
		*
		* @return this digest object.
		*/
		md.update = function(msg, encoding) {
			if (encoding === "utf8") msg = forge.util.encodeUtf8(msg);
			var len = msg.length;
			md.messageLength += len;
			len = [len / 4294967296 >>> 0, len >>> 0];
			for (var i = md.fullMessageLength.length - 1; i >= 0; --i) {
				md.fullMessageLength[i] += len[1];
				len[1] = len[0] + (md.fullMessageLength[i] / 4294967296 >>> 0);
				md.fullMessageLength[i] = md.fullMessageLength[i] >>> 0;
				len[0] = len[1] / 4294967296 >>> 0;
			}
			_input.putBytes(msg);
			_update(_h, _w, _input);
			if (_input.read > 2048 || _input.length() === 0) _input.compact();
			return md;
		};
		/**
		* Produces the digest.
		*
		* @return a byte buffer containing the digest value.
		*/
		md.digest = function() {
			var finalBlock = forge.util.createBuffer();
			finalBlock.putBytes(_input.bytes());
			var overflow = md.fullMessageLength[md.fullMessageLength.length - 1] + md.messageLengthSize & md.blockLength - 1;
			finalBlock.putBytes(_padding.substr(0, md.blockLength - overflow));
			var next, carry;
			var bits = md.fullMessageLength[0] * 8;
			for (var i = 0; i < md.fullMessageLength.length - 1; ++i) {
				next = md.fullMessageLength[i + 1] * 8;
				carry = next / 4294967296 >>> 0;
				bits += carry;
				finalBlock.putInt32(bits >>> 0);
				bits = next >>> 0;
			}
			finalBlock.putInt32(bits);
			var h = new Array(_h.length);
			for (var i = 0; i < _h.length; ++i) h[i] = _h[i].slice(0);
			_update(h, _w, finalBlock);
			var rval = forge.util.createBuffer();
			var hlen;
			if (algorithm === "SHA-512") hlen = h.length;
			else if (algorithm === "SHA-384") hlen = h.length - 2;
			else hlen = h.length - 4;
			for (var i = 0; i < hlen; ++i) {
				rval.putInt32(h[i][0]);
				if (i !== hlen - 1 || algorithm !== "SHA-512/224") rval.putInt32(h[i][1]);
			}
			return rval;
		};
		return md;
	};
	var _padding = null;
	var _initialized = false;
	var _k = null;
	var _states = null;
	/**
	* Initializes the constant tables.
	*/
	function _init() {
		_padding = String.fromCharCode(128);
		_padding += forge.util.fillString(String.fromCharCode(0), 128);
		_k = [
			[1116352408, 3609767458],
			[1899447441, 602891725],
			[3049323471, 3964484399],
			[3921009573, 2173295548],
			[961987163, 4081628472],
			[1508970993, 3053834265],
			[2453635748, 2937671579],
			[2870763221, 3664609560],
			[3624381080, 2734883394],
			[310598401, 1164996542],
			[607225278, 1323610764],
			[1426881987, 3590304994],
			[1925078388, 4068182383],
			[2162078206, 991336113],
			[2614888103, 633803317],
			[3248222580, 3479774868],
			[3835390401, 2666613458],
			[4022224774, 944711139],
			[264347078, 2341262773],
			[604807628, 2007800933],
			[770255983, 1495990901],
			[1249150122, 1856431235],
			[1555081692, 3175218132],
			[1996064986, 2198950837],
			[2554220882, 3999719339],
			[2821834349, 766784016],
			[2952996808, 2566594879],
			[3210313671, 3203337956],
			[3336571891, 1034457026],
			[3584528711, 2466948901],
			[113926993, 3758326383],
			[338241895, 168717936],
			[666307205, 1188179964],
			[773529912, 1546045734],
			[1294757372, 1522805485],
			[1396182291, 2643833823],
			[1695183700, 2343527390],
			[1986661051, 1014477480],
			[2177026350, 1206759142],
			[2456956037, 344077627],
			[2730485921, 1290863460],
			[2820302411, 3158454273],
			[3259730800, 3505952657],
			[3345764771, 106217008],
			[3516065817, 3606008344],
			[3600352804, 1432725776],
			[4094571909, 1467031594],
			[275423344, 851169720],
			[430227734, 3100823752],
			[506948616, 1363258195],
			[659060556, 3750685593],
			[883997877, 3785050280],
			[958139571, 3318307427],
			[1322822218, 3812723403],
			[1537002063, 2003034995],
			[1747873779, 3602036899],
			[1955562222, 1575990012],
			[2024104815, 1125592928],
			[2227730452, 2716904306],
			[2361852424, 442776044],
			[2428436474, 593698344],
			[2756734187, 3733110249],
			[3204031479, 2999351573],
			[3329325298, 3815920427],
			[3391569614, 3928383900],
			[3515267271, 566280711],
			[3940187606, 3454069534],
			[4118630271, 4000239992],
			[116418474, 1914138554],
			[174292421, 2731055270],
			[289380356, 3203993006],
			[460393269, 320620315],
			[685471733, 587496836],
			[852142971, 1086792851],
			[1017036298, 365543100],
			[1126000580, 2618297676],
			[1288033470, 3409855158],
			[1501505948, 4234509866],
			[1607167915, 987167468],
			[1816402316, 1246189591]
		];
		_states = {};
		_states["SHA-512"] = [
			[1779033703, 4089235720],
			[3144134277, 2227873595],
			[1013904242, 4271175723],
			[2773480762, 1595750129],
			[1359893119, 2917565137],
			[2600822924, 725511199],
			[528734635, 4215389547],
			[1541459225, 327033209]
		];
		_states["SHA-384"] = [
			[3418070365, 3238371032],
			[1654270250, 914150663],
			[2438529370, 812702999],
			[355462360, 4144912697],
			[1731405415, 4290775857],
			[2394180231, 1750603025],
			[3675008525, 1694076839],
			[1203062813, 3204075428]
		];
		_states["SHA-512/256"] = [
			[573645204, 4230739756],
			[2673172387, 3360449730],
			[596883563, 1867755857],
			[2520282905, 1497426621],
			[2519219938, 2827943907],
			[3193839141, 1401305490],
			[721525244, 746961066],
			[246885852, 2177182882]
		];
		_states["SHA-512/224"] = [
			[2352822216, 424955298],
			[1944164710, 2312950998],
			[502970286, 855612546],
			[1738396948, 1479516111],
			[258812777, 2077511080],
			[2011393907, 79989058],
			[1067287976, 1780299464],
			[286451373, 2446758561]
		];
		_initialized = true;
	}
	/**
	* Updates a SHA-512 state with the given byte buffer.
	*
	* @param s the SHA-512 state to update.
	* @param w the array to use to store words.
	* @param bytes the byte buffer to update with.
	*/
	function _update(s, w, bytes) {
		var t1_hi, t1_lo;
		var t2_hi, t2_lo;
		var s0_hi, s0_lo;
		var s1_hi, s1_lo;
		var ch_hi, ch_lo;
		var maj_hi, maj_lo;
		var a_hi, a_lo;
		var b_hi, b_lo;
		var c_hi, c_lo;
		var d_hi, d_lo;
		var e_hi, e_lo;
		var f_hi, f_lo;
		var g_hi, g_lo;
		var h_hi, h_lo;
		var i, hi, lo, w2, w7, w15, w16;
		var len = bytes.length();
		while (len >= 128) {
			for (i = 0; i < 16; ++i) {
				w[i][0] = bytes.getInt32() >>> 0;
				w[i][1] = bytes.getInt32() >>> 0;
			}
			for (; i < 80; ++i) {
				w2 = w[i - 2];
				hi = w2[0];
				lo = w2[1];
				t1_hi = ((hi >>> 19 | lo << 13) ^ (lo >>> 29 | hi << 3) ^ hi >>> 6) >>> 0;
				t1_lo = ((hi << 13 | lo >>> 19) ^ (lo << 3 | hi >>> 29) ^ (hi << 26 | lo >>> 6)) >>> 0;
				w15 = w[i - 15];
				hi = w15[0];
				lo = w15[1];
				t2_hi = ((hi >>> 1 | lo << 31) ^ (hi >>> 8 | lo << 24) ^ hi >>> 7) >>> 0;
				t2_lo = ((hi << 31 | lo >>> 1) ^ (hi << 24 | lo >>> 8) ^ (hi << 25 | lo >>> 7)) >>> 0;
				w7 = w[i - 7];
				w16 = w[i - 16];
				lo = t1_lo + w7[1] + t2_lo + w16[1];
				w[i][0] = t1_hi + w7[0] + t2_hi + w16[0] + (lo / 4294967296 >>> 0) >>> 0;
				w[i][1] = lo >>> 0;
			}
			a_hi = s[0][0];
			a_lo = s[0][1];
			b_hi = s[1][0];
			b_lo = s[1][1];
			c_hi = s[2][0];
			c_lo = s[2][1];
			d_hi = s[3][0];
			d_lo = s[3][1];
			e_hi = s[4][0];
			e_lo = s[4][1];
			f_hi = s[5][0];
			f_lo = s[5][1];
			g_hi = s[6][0];
			g_lo = s[6][1];
			h_hi = s[7][0];
			h_lo = s[7][1];
			for (i = 0; i < 80; ++i) {
				s1_hi = ((e_hi >>> 14 | e_lo << 18) ^ (e_hi >>> 18 | e_lo << 14) ^ (e_lo >>> 9 | e_hi << 23)) >>> 0;
				s1_lo = ((e_hi << 18 | e_lo >>> 14) ^ (e_hi << 14 | e_lo >>> 18) ^ (e_lo << 23 | e_hi >>> 9)) >>> 0;
				ch_hi = (g_hi ^ e_hi & (f_hi ^ g_hi)) >>> 0;
				ch_lo = (g_lo ^ e_lo & (f_lo ^ g_lo)) >>> 0;
				s0_hi = ((a_hi >>> 28 | a_lo << 4) ^ (a_lo >>> 2 | a_hi << 30) ^ (a_lo >>> 7 | a_hi << 25)) >>> 0;
				s0_lo = ((a_hi << 4 | a_lo >>> 28) ^ (a_lo << 30 | a_hi >>> 2) ^ (a_lo << 25 | a_hi >>> 7)) >>> 0;
				maj_hi = (a_hi & b_hi | c_hi & (a_hi ^ b_hi)) >>> 0;
				maj_lo = (a_lo & b_lo | c_lo & (a_lo ^ b_lo)) >>> 0;
				lo = h_lo + s1_lo + ch_lo + _k[i][1] + w[i][1];
				t1_hi = h_hi + s1_hi + ch_hi + _k[i][0] + w[i][0] + (lo / 4294967296 >>> 0) >>> 0;
				t1_lo = lo >>> 0;
				lo = s0_lo + maj_lo;
				t2_hi = s0_hi + maj_hi + (lo / 4294967296 >>> 0) >>> 0;
				t2_lo = lo >>> 0;
				h_hi = g_hi;
				h_lo = g_lo;
				g_hi = f_hi;
				g_lo = f_lo;
				f_hi = e_hi;
				f_lo = e_lo;
				lo = d_lo + t1_lo;
				e_hi = d_hi + t1_hi + (lo / 4294967296 >>> 0) >>> 0;
				e_lo = lo >>> 0;
				d_hi = c_hi;
				d_lo = c_lo;
				c_hi = b_hi;
				c_lo = b_lo;
				b_hi = a_hi;
				b_lo = a_lo;
				lo = t1_lo + t2_lo;
				a_hi = t1_hi + t2_hi + (lo / 4294967296 >>> 0) >>> 0;
				a_lo = lo >>> 0;
			}
			lo = s[0][1] + a_lo;
			s[0][0] = s[0][0] + a_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[0][1] = lo >>> 0;
			lo = s[1][1] + b_lo;
			s[1][0] = s[1][0] + b_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[1][1] = lo >>> 0;
			lo = s[2][1] + c_lo;
			s[2][0] = s[2][0] + c_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[2][1] = lo >>> 0;
			lo = s[3][1] + d_lo;
			s[3][0] = s[3][0] + d_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[3][1] = lo >>> 0;
			lo = s[4][1] + e_lo;
			s[4][0] = s[4][0] + e_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[4][1] = lo >>> 0;
			lo = s[5][1] + f_lo;
			s[5][0] = s[5][0] + f_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[5][1] = lo >>> 0;
			lo = s[6][1] + g_lo;
			s[6][0] = s[6][0] + g_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[6][1] = lo >>> 0;
			lo = s[7][1] + h_lo;
			s[7][0] = s[7][0] + h_hi + (lo / 4294967296 >>> 0) >>> 0;
			s[7][1] = lo >>> 0;
			len -= 128;
		}
	}
}));
//#endregion
//#region node_modules/node-forge/lib/asn1-validator.js
var require_asn1_validator = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	/**
	* Copyright (c) 2019 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_asn1();
	var asn1 = forge.asn1;
	exports.privateKeyValidator = {
		name: "PrivateKeyInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		value: [
			{
				name: "PrivateKeyInfo.version",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.INTEGER,
				constructed: false,
				capture: "privateKeyVersion"
			},
			{
				name: "PrivateKeyInfo.privateKeyAlgorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.SEQUENCE,
				constructed: true,
				value: [{
					name: "AlgorithmIdentifier.algorithm",
					tagClass: asn1.Class.UNIVERSAL,
					type: asn1.Type.OID,
					constructed: false,
					capture: "privateKeyOid"
				}]
			},
			{
				name: "PrivateKeyInfo",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OCTETSTRING,
				constructed: false,
				capture: "privateKey"
			}
		]
	};
	exports.publicKeyValidator = {
		name: "SubjectPublicKeyInfo",
		tagClass: asn1.Class.UNIVERSAL,
		type: asn1.Type.SEQUENCE,
		constructed: true,
		captureAsn1: "subjectPublicKeyInfo",
		value: [{
			name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.SEQUENCE,
			constructed: true,
			value: [{
				name: "AlgorithmIdentifier.algorithm",
				tagClass: asn1.Class.UNIVERSAL,
				type: asn1.Type.OID,
				constructed: false,
				capture: "publicKeyOid"
			}]
		}, {
			tagClass: asn1.Class.UNIVERSAL,
			type: asn1.Type.BITSTRING,
			constructed: false,
			composed: true,
			captureBitStringValue: "ed25519PublicKey"
		}]
	};
}));
//#endregion
//#region node_modules/node-forge/lib/ed25519.js
var require_ed25519 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* JavaScript implementation of Ed25519.
	*
	* Copyright (c) 2017-2019 Digital Bazaar, Inc.
	*
	* This implementation is based on the most excellent TweetNaCl which is
	* in the public domain. Many thanks to its contributors:
	*
	* https://github.com/dchest/tweetnacl-js
	*/
	var forge = require_forge();
	require_jsbn();
	require_random();
	require_sha512();
	require_util();
	var asn1Validator = require_asn1_validator();
	var publicKeyValidator = asn1Validator.publicKeyValidator;
	var privateKeyValidator = asn1Validator.privateKeyValidator;
	if (typeof BigInteger === "undefined") var BigInteger = forge.jsbn.BigInteger;
	var ByteBuffer = forge.util.ByteBuffer;
	var NativeBuffer = typeof Buffer === "undefined" ? Uint8Array : Buffer;
	forge.pki = forge.pki || {};
	module.exports = forge.pki.ed25519 = forge.ed25519 = forge.ed25519 || {};
	var ed25519 = forge.ed25519;
	ed25519.constants = {};
	ed25519.constants.PUBLIC_KEY_BYTE_LENGTH = 32;
	ed25519.constants.PRIVATE_KEY_BYTE_LENGTH = 64;
	ed25519.constants.SEED_BYTE_LENGTH = 32;
	ed25519.constants.SIGN_BYTE_LENGTH = 64;
	ed25519.constants.HASH_BYTE_LENGTH = 64;
	ed25519.generateKeyPair = function(options) {
		options = options || {};
		var seed = options.seed;
		if (seed === void 0) seed = forge.random.getBytesSync(ed25519.constants.SEED_BYTE_LENGTH);
		else if (typeof seed === "string") {
			if (seed.length !== ed25519.constants.SEED_BYTE_LENGTH) throw new TypeError("\"seed\" must be " + ed25519.constants.SEED_BYTE_LENGTH + " bytes in length.");
		} else if (!(seed instanceof Uint8Array)) throw new TypeError("\"seed\" must be a node.js Buffer, Uint8Array, or a binary string.");
		seed = messageToNativeBuffer({
			message: seed,
			encoding: "binary"
		});
		var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
		var sk = new NativeBuffer(ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
		for (var i = 0; i < 32; ++i) sk[i] = seed[i];
		crypto_sign_keypair(pk, sk);
		return {
			publicKey: pk,
			privateKey: sk
		};
	};
	/**
	* Converts a private key from a RFC8410 ASN.1 encoding.
	*
	* @param obj - The asn1 representation of a private key.
	*
	* @returns {Object} keyInfo - The key information.
	* @returns {Buffer|Uint8Array} keyInfo.privateKeyBytes - 32 private key bytes.
	*/
	ed25519.privateKeyFromAsn1 = function(obj) {
		var capture = {};
		var errors = [];
		if (!forge.asn1.validate(obj, privateKeyValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Invalid Key.");
			error.errors = errors;
			throw error;
		}
		var oid = forge.asn1.derToOid(capture.privateKeyOid);
		var ed25519Oid = forge.oids.EdDSA25519;
		if (oid !== ed25519Oid) throw new Error("Invalid OID \"" + oid + "\"; OID must be \"" + ed25519Oid + "\".");
		var privateKey = capture.privateKey;
		return { privateKeyBytes: messageToNativeBuffer({
			message: forge.asn1.fromDer(privateKey).value,
			encoding: "binary"
		}) };
	};
	/**
	* Converts a public key from a RFC8410 ASN.1 encoding.
	*
	* @param obj - The asn1 representation of a public key.
	*
	* @return {Buffer|Uint8Array} - 32 public key bytes.
	*/
	ed25519.publicKeyFromAsn1 = function(obj) {
		var capture = {};
		var errors = [];
		if (!forge.asn1.validate(obj, publicKeyValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Invalid Key.");
			error.errors = errors;
			throw error;
		}
		var oid = forge.asn1.derToOid(capture.publicKeyOid);
		var ed25519Oid = forge.oids.EdDSA25519;
		if (oid !== ed25519Oid) throw new Error("Invalid OID \"" + oid + "\"; OID must be \"" + ed25519Oid + "\".");
		var publicKeyBytes = capture.ed25519PublicKey;
		if (publicKeyBytes.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) throw new Error("Key length is invalid.");
		return messageToNativeBuffer({
			message: publicKeyBytes,
			encoding: "binary"
		});
	};
	ed25519.publicKeyFromPrivateKey = function(options) {
		options = options || {};
		var privateKey = messageToNativeBuffer({
			message: options.privateKey,
			encoding: "binary"
		});
		if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) throw new TypeError("\"options.privateKey\" must have a byte length of " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
		var pk = new NativeBuffer(ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
		for (var i = 0; i < pk.length; ++i) pk[i] = privateKey[32 + i];
		return pk;
	};
	ed25519.sign = function(options) {
		options = options || {};
		var msg = messageToNativeBuffer(options);
		var privateKey = messageToNativeBuffer({
			message: options.privateKey,
			encoding: "binary"
		});
		if (privateKey.length === ed25519.constants.SEED_BYTE_LENGTH) privateKey = ed25519.generateKeyPair({ seed: privateKey }).privateKey;
		else if (privateKey.length !== ed25519.constants.PRIVATE_KEY_BYTE_LENGTH) throw new TypeError("\"options.privateKey\" must have a byte length of " + ed25519.constants.SEED_BYTE_LENGTH + " or " + ed25519.constants.PRIVATE_KEY_BYTE_LENGTH);
		var signedMsg = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
		crypto_sign(signedMsg, msg, msg.length, privateKey);
		var sig = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH);
		for (var i = 0; i < sig.length; ++i) sig[i] = signedMsg[i];
		return sig;
	};
	ed25519.verify = function(options) {
		options = options || {};
		var msg = messageToNativeBuffer(options);
		if (options.signature === void 0) throw new TypeError("\"options.signature\" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a binary string.");
		var sig = messageToNativeBuffer({
			message: options.signature,
			encoding: "binary"
		});
		if (sig.length !== ed25519.constants.SIGN_BYTE_LENGTH) throw new TypeError("\"options.signature\" must have a byte length of " + ed25519.constants.SIGN_BYTE_LENGTH);
		var publicKey = messageToNativeBuffer({
			message: options.publicKey,
			encoding: "binary"
		});
		if (publicKey.length !== ed25519.constants.PUBLIC_KEY_BYTE_LENGTH) throw new TypeError("\"options.publicKey\" must have a byte length of " + ed25519.constants.PUBLIC_KEY_BYTE_LENGTH);
		var sm = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
		var m = new NativeBuffer(ed25519.constants.SIGN_BYTE_LENGTH + msg.length);
		var i;
		for (i = 0; i < ed25519.constants.SIGN_BYTE_LENGTH; ++i) sm[i] = sig[i];
		for (i = 0; i < msg.length; ++i) sm[i + ed25519.constants.SIGN_BYTE_LENGTH] = msg[i];
		return crypto_sign_open(m, sm, sm.length, publicKey) >= 0;
	};
	function messageToNativeBuffer(options) {
		var message = options.message;
		if (message instanceof Uint8Array || message instanceof NativeBuffer) return message;
		var encoding = options.encoding;
		if (message === void 0) if (options.md) {
			message = options.md.digest().getBytes();
			encoding = "binary";
		} else throw new TypeError("\"options.message\" or \"options.md\" not specified.");
		if (typeof message === "string" && !encoding) throw new TypeError("\"options.encoding\" must be \"binary\" or \"utf8\".");
		if (typeof message === "string") {
			if (typeof Buffer !== "undefined") return Buffer.from(message, encoding);
			message = new ByteBuffer(message, encoding);
		} else if (!(message instanceof ByteBuffer)) throw new TypeError("\"options.message\" must be a node.js Buffer, a Uint8Array, a forge ByteBuffer, or a string with \"options.encoding\" specifying its encoding.");
		var buffer = new NativeBuffer(message.length());
		for (var i = 0; i < buffer.length; ++i) buffer[i] = message.at(i);
		return buffer;
	}
	var gf0 = gf();
	var gf1 = gf([1]);
	var D = gf([
		30883,
		4953,
		19914,
		30187,
		55467,
		16705,
		2637,
		112,
		59544,
		30585,
		16505,
		36039,
		65139,
		11119,
		27886,
		20995
	]);
	var D2 = gf([
		61785,
		9906,
		39828,
		60374,
		45398,
		33411,
		5274,
		224,
		53552,
		61171,
		33010,
		6542,
		64743,
		22239,
		55772,
		9222
	]);
	var X = gf([
		54554,
		36645,
		11616,
		51542,
		42930,
		38181,
		51040,
		26924,
		56412,
		64982,
		57905,
		49316,
		21502,
		52590,
		14035,
		8553
	]);
	var Y = gf([
		26200,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214,
		26214
	]);
	var L = new Float64Array([
		237,
		211,
		245,
		92,
		26,
		99,
		18,
		88,
		214,
		156,
		247,
		162,
		222,
		249,
		222,
		20,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		16
	]);
	var I = gf([
		41136,
		18958,
		6951,
		50414,
		58488,
		44335,
		6150,
		12099,
		55207,
		15867,
		153,
		11085,
		57099,
		20417,
		9344,
		11139
	]);
	function sha512(msg, msgLen) {
		var md = forge.md.sha512.create();
		var buffer = new ByteBuffer(msg);
		md.update(buffer.getBytes(msgLen), "binary");
		var hash = md.digest().getBytes();
		if (typeof Buffer !== "undefined") return Buffer.from(hash, "binary");
		var out = new NativeBuffer(ed25519.constants.HASH_BYTE_LENGTH);
		for (var i = 0; i < 64; ++i) out[i] = hash.charCodeAt(i);
		return out;
	}
	function crypto_sign_keypair(pk, sk) {
		var p = [
			gf(),
			gf(),
			gf(),
			gf()
		];
		var i;
		var d = sha512(sk, 32);
		d[0] &= 248;
		d[31] &= 127;
		d[31] |= 64;
		scalarbase(p, d);
		pack(pk, p);
		for (i = 0; i < 32; ++i) sk[i + 32] = pk[i];
		return 0;
	}
	function crypto_sign(sm, m, n, sk) {
		var i, j, x = /* @__PURE__ */ new Float64Array(64);
		var p = [
			gf(),
			gf(),
			gf(),
			gf()
		];
		var d = sha512(sk, 32);
		d[0] &= 248;
		d[31] &= 127;
		d[31] |= 64;
		var smlen = n + 64;
		for (i = 0; i < n; ++i) sm[64 + i] = m[i];
		for (i = 0; i < 32; ++i) sm[32 + i] = d[32 + i];
		var r = sha512(sm.subarray(32), n + 32);
		reduce(r);
		scalarbase(p, r);
		pack(sm, p);
		for (i = 32; i < 64; ++i) sm[i] = sk[i];
		var h = sha512(sm, n + 64);
		reduce(h);
		for (i = 32; i < 64; ++i) x[i] = 0;
		for (i = 0; i < 32; ++i) x[i] = r[i];
		for (i = 0; i < 32; ++i) for (j = 0; j < 32; j++) x[i + j] += h[i] * d[j];
		modL(sm.subarray(32), x);
		return smlen;
	}
	function crypto_sign_open(m, sm, n, pk) {
		var i, mlen;
		var t = new NativeBuffer(32);
		var p = [
			gf(),
			gf(),
			gf(),
			gf()
		], q = [
			gf(),
			gf(),
			gf(),
			gf()
		];
		mlen = -1;
		if (n < 64) return -1;
		if (unpackneg(q, pk)) return -1;
		if (!_isCanonicalSignatureScalar(sm, 32)) return -1;
		for (i = 0; i < n; ++i) m[i] = sm[i];
		for (i = 0; i < 32; ++i) m[i + 32] = pk[i];
		var h = sha512(m, n);
		reduce(h);
		scalarmult(p, q, h);
		scalarbase(q, sm.subarray(32));
		add(p, q);
		pack(t, p);
		n -= 64;
		if (crypto_verify_32(sm, 0, t, 0)) {
			for (i = 0; i < n; ++i) m[i] = 0;
			return -1;
		}
		for (i = 0; i < n; ++i) m[i] = sm[i + 64];
		mlen = n;
		return mlen;
	}
	function _isCanonicalSignatureScalar(bytes, offset) {
		var i;
		for (i = 31; i >= 0; --i) {
			if (bytes[offset + i] < L[i]) return true;
			if (bytes[offset + i] > L[i]) return false;
		}
		return false;
	}
	function modL(r, x) {
		var carry, i, j, k;
		for (i = 63; i >= 32; --i) {
			carry = 0;
			for (j = i - 32, k = i - 12; j < k; ++j) {
				x[j] += carry - 16 * x[i] * L[j - (i - 32)];
				carry = x[j] + 128 >> 8;
				x[j] -= carry * 256;
			}
			x[j] += carry;
			x[i] = 0;
		}
		carry = 0;
		for (j = 0; j < 32; ++j) {
			x[j] += carry - (x[31] >> 4) * L[j];
			carry = x[j] >> 8;
			x[j] &= 255;
		}
		for (j = 0; j < 32; ++j) x[j] -= carry * L[j];
		for (i = 0; i < 32; ++i) {
			x[i + 1] += x[i] >> 8;
			r[i] = x[i] & 255;
		}
	}
	function reduce(r) {
		var x = /* @__PURE__ */ new Float64Array(64);
		for (var i = 0; i < 64; ++i) {
			x[i] = r[i];
			r[i] = 0;
		}
		modL(r, x);
	}
	function add(p, q) {
		var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
		Z(a, p[1], p[0]);
		Z(t, q[1], q[0]);
		M(a, a, t);
		A(b, p[0], p[1]);
		A(t, q[0], q[1]);
		M(b, b, t);
		M(c, p[3], q[3]);
		M(c, c, D2);
		M(d, p[2], q[2]);
		A(d, d, d);
		Z(e, b, a);
		Z(f, d, c);
		A(g, d, c);
		A(h, b, a);
		M(p[0], e, f);
		M(p[1], h, g);
		M(p[2], g, f);
		M(p[3], e, h);
	}
	function cswap(p, q, b) {
		for (var i = 0; i < 4; ++i) sel25519(p[i], q[i], b);
	}
	function pack(r, p) {
		var tx = gf(), ty = gf(), zi = gf();
		inv25519(zi, p[2]);
		M(tx, p[0], zi);
		M(ty, p[1], zi);
		pack25519(r, ty);
		r[31] ^= par25519(tx) << 7;
	}
	function pack25519(o, n) {
		var i, j, b;
		var m = gf(), t = gf();
		for (i = 0; i < 16; ++i) t[i] = n[i];
		car25519(t);
		car25519(t);
		car25519(t);
		for (j = 0; j < 2; ++j) {
			m[0] = t[0] - 65517;
			for (i = 1; i < 15; ++i) {
				m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
				m[i - 1] &= 65535;
			}
			m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
			b = m[15] >> 16 & 1;
			m[14] &= 65535;
			sel25519(t, m, 1 - b);
		}
		for (i = 0; i < 16; i++) {
			o[2 * i] = t[i] & 255;
			o[2 * i + 1] = t[i] >> 8;
		}
	}
	function unpackneg(r, p) {
		var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
		set25519(r[2], gf1);
		unpack25519(r[1], p);
		S(num, r[1]);
		M(den, num, D);
		Z(num, num, r[2]);
		A(den, r[2], den);
		S(den2, den);
		S(den4, den2);
		M(den6, den4, den2);
		M(t, den6, num);
		M(t, t, den);
		pow2523(t, t);
		M(t, t, num);
		M(t, t, den);
		M(t, t, den);
		M(r[0], t, den);
		S(chk, r[0]);
		M(chk, chk, den);
		if (neq25519(chk, num)) M(r[0], r[0], I);
		S(chk, r[0]);
		M(chk, chk, den);
		if (neq25519(chk, num)) return -1;
		if (par25519(r[0]) === p[31] >> 7) Z(r[0], gf0, r[0]);
		M(r[3], r[0], r[1]);
		return 0;
	}
	function unpack25519(o, n) {
		var i;
		for (i = 0; i < 16; ++i) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
		o[15] &= 32767;
	}
	function pow2523(o, i) {
		var c = gf();
		var a;
		for (a = 0; a < 16; ++a) c[a] = i[a];
		for (a = 250; a >= 0; --a) {
			S(c, c);
			if (a !== 1) M(c, c, i);
		}
		for (a = 0; a < 16; ++a) o[a] = c[a];
	}
	function neq25519(a, b) {
		var c = new NativeBuffer(32);
		var d = new NativeBuffer(32);
		pack25519(c, a);
		pack25519(d, b);
		return crypto_verify_32(c, 0, d, 0);
	}
	function crypto_verify_32(x, xi, y, yi) {
		return vn(x, xi, y, yi, 32);
	}
	function vn(x, xi, y, yi, n) {
		var i, d = 0;
		for (i = 0; i < n; ++i) d |= x[xi + i] ^ y[yi + i];
		return (1 & d - 1 >>> 8) - 1;
	}
	function par25519(a) {
		var d = new NativeBuffer(32);
		pack25519(d, a);
		return d[0] & 1;
	}
	function scalarmult(p, q, s) {
		var b, i;
		set25519(p[0], gf0);
		set25519(p[1], gf1);
		set25519(p[2], gf1);
		set25519(p[3], gf0);
		for (i = 255; i >= 0; --i) {
			b = s[i / 8 | 0] >> (i & 7) & 1;
			cswap(p, q, b);
			add(q, p);
			add(p, p);
			cswap(p, q, b);
		}
	}
	function scalarbase(p, s) {
		var q = [
			gf(),
			gf(),
			gf(),
			gf()
		];
		set25519(q[0], X);
		set25519(q[1], Y);
		set25519(q[2], gf1);
		M(q[3], X, Y);
		scalarmult(p, q, s);
	}
	function set25519(r, a) {
		var i;
		for (i = 0; i < 16; i++) r[i] = a[i] | 0;
	}
	function inv25519(o, i) {
		var c = gf();
		var a;
		for (a = 0; a < 16; ++a) c[a] = i[a];
		for (a = 253; a >= 0; --a) {
			S(c, c);
			if (a !== 2 && a !== 4) M(c, c, i);
		}
		for (a = 0; a < 16; ++a) o[a] = c[a];
	}
	function car25519(o) {
		var i, v, c = 1;
		for (i = 0; i < 16; ++i) {
			v = o[i] + c + 65535;
			c = Math.floor(v / 65536);
			o[i] = v - c * 65536;
		}
		o[0] += c - 1 + 37 * (c - 1);
	}
	function sel25519(p, q, b) {
		var t, c = ~(b - 1);
		for (var i = 0; i < 16; ++i) {
			t = c & (p[i] ^ q[i]);
			p[i] ^= t;
			q[i] ^= t;
		}
	}
	function gf(init) {
		var i, r = /* @__PURE__ */ new Float64Array(16);
		if (init) for (i = 0; i < init.length; ++i) r[i] = init[i];
		return r;
	}
	function A(o, a, b) {
		for (var i = 0; i < 16; ++i) o[i] = a[i] + b[i];
	}
	function Z(o, a, b) {
		for (var i = 0; i < 16; ++i) o[i] = a[i] - b[i];
	}
	function S(o, a) {
		M(o, a, a);
	}
	function M(o, a, b) {
		var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
		v = a[0];
		t0 += v * b0;
		t1 += v * b1;
		t2 += v * b2;
		t3 += v * b3;
		t4 += v * b4;
		t5 += v * b5;
		t6 += v * b6;
		t7 += v * b7;
		t8 += v * b8;
		t9 += v * b9;
		t10 += v * b10;
		t11 += v * b11;
		t12 += v * b12;
		t13 += v * b13;
		t14 += v * b14;
		t15 += v * b15;
		v = a[1];
		t1 += v * b0;
		t2 += v * b1;
		t3 += v * b2;
		t4 += v * b3;
		t5 += v * b4;
		t6 += v * b5;
		t7 += v * b6;
		t8 += v * b7;
		t9 += v * b8;
		t10 += v * b9;
		t11 += v * b10;
		t12 += v * b11;
		t13 += v * b12;
		t14 += v * b13;
		t15 += v * b14;
		t16 += v * b15;
		v = a[2];
		t2 += v * b0;
		t3 += v * b1;
		t4 += v * b2;
		t5 += v * b3;
		t6 += v * b4;
		t7 += v * b5;
		t8 += v * b6;
		t9 += v * b7;
		t10 += v * b8;
		t11 += v * b9;
		t12 += v * b10;
		t13 += v * b11;
		t14 += v * b12;
		t15 += v * b13;
		t16 += v * b14;
		t17 += v * b15;
		v = a[3];
		t3 += v * b0;
		t4 += v * b1;
		t5 += v * b2;
		t6 += v * b3;
		t7 += v * b4;
		t8 += v * b5;
		t9 += v * b6;
		t10 += v * b7;
		t11 += v * b8;
		t12 += v * b9;
		t13 += v * b10;
		t14 += v * b11;
		t15 += v * b12;
		t16 += v * b13;
		t17 += v * b14;
		t18 += v * b15;
		v = a[4];
		t4 += v * b0;
		t5 += v * b1;
		t6 += v * b2;
		t7 += v * b3;
		t8 += v * b4;
		t9 += v * b5;
		t10 += v * b6;
		t11 += v * b7;
		t12 += v * b8;
		t13 += v * b9;
		t14 += v * b10;
		t15 += v * b11;
		t16 += v * b12;
		t17 += v * b13;
		t18 += v * b14;
		t19 += v * b15;
		v = a[5];
		t5 += v * b0;
		t6 += v * b1;
		t7 += v * b2;
		t8 += v * b3;
		t9 += v * b4;
		t10 += v * b5;
		t11 += v * b6;
		t12 += v * b7;
		t13 += v * b8;
		t14 += v * b9;
		t15 += v * b10;
		t16 += v * b11;
		t17 += v * b12;
		t18 += v * b13;
		t19 += v * b14;
		t20 += v * b15;
		v = a[6];
		t6 += v * b0;
		t7 += v * b1;
		t8 += v * b2;
		t9 += v * b3;
		t10 += v * b4;
		t11 += v * b5;
		t12 += v * b6;
		t13 += v * b7;
		t14 += v * b8;
		t15 += v * b9;
		t16 += v * b10;
		t17 += v * b11;
		t18 += v * b12;
		t19 += v * b13;
		t20 += v * b14;
		t21 += v * b15;
		v = a[7];
		t7 += v * b0;
		t8 += v * b1;
		t9 += v * b2;
		t10 += v * b3;
		t11 += v * b4;
		t12 += v * b5;
		t13 += v * b6;
		t14 += v * b7;
		t15 += v * b8;
		t16 += v * b9;
		t17 += v * b10;
		t18 += v * b11;
		t19 += v * b12;
		t20 += v * b13;
		t21 += v * b14;
		t22 += v * b15;
		v = a[8];
		t8 += v * b0;
		t9 += v * b1;
		t10 += v * b2;
		t11 += v * b3;
		t12 += v * b4;
		t13 += v * b5;
		t14 += v * b6;
		t15 += v * b7;
		t16 += v * b8;
		t17 += v * b9;
		t18 += v * b10;
		t19 += v * b11;
		t20 += v * b12;
		t21 += v * b13;
		t22 += v * b14;
		t23 += v * b15;
		v = a[9];
		t9 += v * b0;
		t10 += v * b1;
		t11 += v * b2;
		t12 += v * b3;
		t13 += v * b4;
		t14 += v * b5;
		t15 += v * b6;
		t16 += v * b7;
		t17 += v * b8;
		t18 += v * b9;
		t19 += v * b10;
		t20 += v * b11;
		t21 += v * b12;
		t22 += v * b13;
		t23 += v * b14;
		t24 += v * b15;
		v = a[10];
		t10 += v * b0;
		t11 += v * b1;
		t12 += v * b2;
		t13 += v * b3;
		t14 += v * b4;
		t15 += v * b5;
		t16 += v * b6;
		t17 += v * b7;
		t18 += v * b8;
		t19 += v * b9;
		t20 += v * b10;
		t21 += v * b11;
		t22 += v * b12;
		t23 += v * b13;
		t24 += v * b14;
		t25 += v * b15;
		v = a[11];
		t11 += v * b0;
		t12 += v * b1;
		t13 += v * b2;
		t14 += v * b3;
		t15 += v * b4;
		t16 += v * b5;
		t17 += v * b6;
		t18 += v * b7;
		t19 += v * b8;
		t20 += v * b9;
		t21 += v * b10;
		t22 += v * b11;
		t23 += v * b12;
		t24 += v * b13;
		t25 += v * b14;
		t26 += v * b15;
		v = a[12];
		t12 += v * b0;
		t13 += v * b1;
		t14 += v * b2;
		t15 += v * b3;
		t16 += v * b4;
		t17 += v * b5;
		t18 += v * b6;
		t19 += v * b7;
		t20 += v * b8;
		t21 += v * b9;
		t22 += v * b10;
		t23 += v * b11;
		t24 += v * b12;
		t25 += v * b13;
		t26 += v * b14;
		t27 += v * b15;
		v = a[13];
		t13 += v * b0;
		t14 += v * b1;
		t15 += v * b2;
		t16 += v * b3;
		t17 += v * b4;
		t18 += v * b5;
		t19 += v * b6;
		t20 += v * b7;
		t21 += v * b8;
		t22 += v * b9;
		t23 += v * b10;
		t24 += v * b11;
		t25 += v * b12;
		t26 += v * b13;
		t27 += v * b14;
		t28 += v * b15;
		v = a[14];
		t14 += v * b0;
		t15 += v * b1;
		t16 += v * b2;
		t17 += v * b3;
		t18 += v * b4;
		t19 += v * b5;
		t20 += v * b6;
		t21 += v * b7;
		t22 += v * b8;
		t23 += v * b9;
		t24 += v * b10;
		t25 += v * b11;
		t26 += v * b12;
		t27 += v * b13;
		t28 += v * b14;
		t29 += v * b15;
		v = a[15];
		t15 += v * b0;
		t16 += v * b1;
		t17 += v * b2;
		t18 += v * b3;
		t19 += v * b4;
		t20 += v * b5;
		t21 += v * b6;
		t22 += v * b7;
		t23 += v * b8;
		t24 += v * b9;
		t25 += v * b10;
		t26 += v * b11;
		t27 += v * b12;
		t28 += v * b13;
		t29 += v * b14;
		t30 += v * b15;
		t0 += 38 * t16;
		t1 += 38 * t17;
		t2 += 38 * t18;
		t3 += 38 * t19;
		t4 += 38 * t20;
		t5 += 38 * t21;
		t6 += 38 * t22;
		t7 += 38 * t23;
		t8 += 38 * t24;
		t9 += 38 * t25;
		t10 += 38 * t26;
		t11 += 38 * t27;
		t12 += 38 * t28;
		t13 += 38 * t29;
		t14 += 38 * t30;
		c = 1;
		v = t0 + c + 65535;
		c = Math.floor(v / 65536);
		t0 = v - c * 65536;
		v = t1 + c + 65535;
		c = Math.floor(v / 65536);
		t1 = v - c * 65536;
		v = t2 + c + 65535;
		c = Math.floor(v / 65536);
		t2 = v - c * 65536;
		v = t3 + c + 65535;
		c = Math.floor(v / 65536);
		t3 = v - c * 65536;
		v = t4 + c + 65535;
		c = Math.floor(v / 65536);
		t4 = v - c * 65536;
		v = t5 + c + 65535;
		c = Math.floor(v / 65536);
		t5 = v - c * 65536;
		v = t6 + c + 65535;
		c = Math.floor(v / 65536);
		t6 = v - c * 65536;
		v = t7 + c + 65535;
		c = Math.floor(v / 65536);
		t7 = v - c * 65536;
		v = t8 + c + 65535;
		c = Math.floor(v / 65536);
		t8 = v - c * 65536;
		v = t9 + c + 65535;
		c = Math.floor(v / 65536);
		t9 = v - c * 65536;
		v = t10 + c + 65535;
		c = Math.floor(v / 65536);
		t10 = v - c * 65536;
		v = t11 + c + 65535;
		c = Math.floor(v / 65536);
		t11 = v - c * 65536;
		v = t12 + c + 65535;
		c = Math.floor(v / 65536);
		t12 = v - c * 65536;
		v = t13 + c + 65535;
		c = Math.floor(v / 65536);
		t13 = v - c * 65536;
		v = t14 + c + 65535;
		c = Math.floor(v / 65536);
		t14 = v - c * 65536;
		v = t15 + c + 65535;
		c = Math.floor(v / 65536);
		t15 = v - c * 65536;
		t0 += c - 1 + 37 * (c - 1);
		c = 1;
		v = t0 + c + 65535;
		c = Math.floor(v / 65536);
		t0 = v - c * 65536;
		v = t1 + c + 65535;
		c = Math.floor(v / 65536);
		t1 = v - c * 65536;
		v = t2 + c + 65535;
		c = Math.floor(v / 65536);
		t2 = v - c * 65536;
		v = t3 + c + 65535;
		c = Math.floor(v / 65536);
		t3 = v - c * 65536;
		v = t4 + c + 65535;
		c = Math.floor(v / 65536);
		t4 = v - c * 65536;
		v = t5 + c + 65535;
		c = Math.floor(v / 65536);
		t5 = v - c * 65536;
		v = t6 + c + 65535;
		c = Math.floor(v / 65536);
		t6 = v - c * 65536;
		v = t7 + c + 65535;
		c = Math.floor(v / 65536);
		t7 = v - c * 65536;
		v = t8 + c + 65535;
		c = Math.floor(v / 65536);
		t8 = v - c * 65536;
		v = t9 + c + 65535;
		c = Math.floor(v / 65536);
		t9 = v - c * 65536;
		v = t10 + c + 65535;
		c = Math.floor(v / 65536);
		t10 = v - c * 65536;
		v = t11 + c + 65535;
		c = Math.floor(v / 65536);
		t11 = v - c * 65536;
		v = t12 + c + 65535;
		c = Math.floor(v / 65536);
		t12 = v - c * 65536;
		v = t13 + c + 65535;
		c = Math.floor(v / 65536);
		t13 = v - c * 65536;
		v = t14 + c + 65535;
		c = Math.floor(v / 65536);
		t14 = v - c * 65536;
		v = t15 + c + 65535;
		c = Math.floor(v / 65536);
		t15 = v - c * 65536;
		t0 += c - 1 + 37 * (c - 1);
		o[0] = t0;
		o[1] = t1;
		o[2] = t2;
		o[3] = t3;
		o[4] = t4;
		o[5] = t5;
		o[6] = t6;
		o[7] = t7;
		o[8] = t8;
		o[9] = t9;
		o[10] = t10;
		o[11] = t11;
		o[12] = t12;
		o[13] = t13;
		o[14] = t14;
		o[15] = t15;
	}
}));
//#endregion
//#region node_modules/node-forge/lib/kem.js
var require_kem = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of RSA-KEM.
	*
	* @author Lautaro Cozzani Rodriguez
	* @author Dave Longley
	*
	* Copyright (c) 2014 Lautaro Cozzani <lautaro.cozzani@scytl.com>
	* Copyright (c) 2014 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	require_random();
	require_jsbn();
	module.exports = forge.kem = forge.kem || {};
	var BigInteger = forge.jsbn.BigInteger;
	/**
	* The API for the RSA Key Encapsulation Mechanism (RSA-KEM) from ISO 18033-2.
	*/
	forge.kem.rsa = {};
	/**
	* Creates an RSA KEM API object for generating a secret asymmetric key.
	*
	* The symmetric key may be generated via a call to 'encrypt', which will
	* produce a ciphertext to be transmitted to the recipient and a key to be
	* kept secret. The ciphertext is a parameter to be passed to 'decrypt' which
	* will produce the same secret key for the recipient to use to decrypt a
	* message that was encrypted with the secret key.
	*
	* @param kdf the KDF API to use (eg: new forge.kem.kdf1()).
	* @param options the options to use.
	*          [prng] a custom crypto-secure pseudo-random number generator to use,
	*            that must define "getBytesSync".
	*/
	forge.kem.rsa.create = function(kdf, options) {
		options = options || {};
		var prng = options.prng || forge.random;
		var kem = {};
		/**
		* Generates a secret key and its encapsulation.
		*
		* @param publicKey the RSA public key to encrypt with.
		* @param keyLength the length, in bytes, of the secret key to generate.
		*
		* @return an object with:
		*   encapsulation: the ciphertext for generating the secret key, as a
		*     binary-encoded string of bytes.
		*   key: the secret key to use for encrypting a message.
		*/
		kem.encrypt = function(publicKey, keyLength) {
			var byteLength = Math.ceil(publicKey.n.bitLength() / 8);
			var r;
			do
				r = new BigInteger(forge.util.bytesToHex(prng.getBytesSync(byteLength)), 16).mod(publicKey.n);
			while (r.compareTo(BigInteger.ONE) <= 0);
			r = forge.util.hexToBytes(r.toString(16));
			var zeros = byteLength - r.length;
			if (zeros > 0) r = forge.util.fillString(String.fromCharCode(0), zeros) + r;
			return {
				encapsulation: publicKey.encrypt(r, "NONE"),
				key: kdf.generate(r, keyLength)
			};
		};
		/**
		* Decrypts an encapsulated secret key.
		*
		* @param privateKey the RSA private key to decrypt with.
		* @param encapsulation the ciphertext for generating the secret key, as
		*          a binary-encoded string of bytes.
		* @param keyLength the length, in bytes, of the secret key to generate.
		*
		* @return the secret key as a binary-encoded string of bytes.
		*/
		kem.decrypt = function(privateKey, encapsulation, keyLength) {
			var r = privateKey.decrypt(encapsulation, "NONE");
			return kdf.generate(r, keyLength);
		};
		return kem;
	};
	/**
	* Creates a key derivation API object that implements KDF1 per ISO 18033-2.
	*
	* @param md the hash API to use.
	* @param [digestLength] an optional digest length that must be positive and
	*          less than or equal to md.digestLength.
	*
	* @return a KDF1 API object.
	*/
	forge.kem.kdf1 = function(md, digestLength) {
		_createKDF(this, md, 0, digestLength || md.digestLength);
	};
	/**
	* Creates a key derivation API object that implements KDF2 per ISO 18033-2.
	*
	* @param md the hash API to use.
	* @param [digestLength] an optional digest length that must be positive and
	*          less than or equal to md.digestLength.
	*
	* @return a KDF2 API object.
	*/
	forge.kem.kdf2 = function(md, digestLength) {
		_createKDF(this, md, 1, digestLength || md.digestLength);
	};
	/**
	* Creates a KDF1 or KDF2 API object.
	*
	* @param md the hash API to use.
	* @param counterStart the starting index for the counter.
	* @param digestLength the digest length to use.
	*
	* @return the KDF API object.
	*/
	function _createKDF(kdf, md, counterStart, digestLength) {
		/**
		* Generate a key of the specified length.
		*
		* @param x the binary-encoded byte string to generate a key from.
		* @param length the number of bytes to generate (the size of the key).
		*
		* @return the key as a binary-encoded string.
		*/
		kdf.generate = function(x, length) {
			var key = new forge.util.ByteBuffer();
			var k = Math.ceil(length / digestLength) + counterStart;
			var c = new forge.util.ByteBuffer();
			for (var i = counterStart; i < k; ++i) {
				c.putInt32(i);
				md.start();
				md.update(x + c.getBytes());
				var hash = md.digest();
				key.putBytes(hash.getBytes(digestLength));
			}
			key.truncate(key.length() - length);
			return key.getBytes();
		};
	}
}));
//#endregion
//#region node_modules/node-forge/lib/log.js
var require_log = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Cross-browser support for logging in a web application.
	*
	* @author David I. Lehn <dlehn@digitalbazaar.com>
	*
	* Copyright (c) 2008-2013 Digital Bazaar, Inc.
	*/
	var forge = require_forge();
	require_util();
	module.exports = forge.log = forge.log || {};
	/**
	* Application logging system.
	*
	* Each logger level available as it's own function of the form:
	*   forge.log.level(category, args...)
	* The category is an arbitrary string, and the args are the same as
	* Firebug's console.log API. By default the call will be output as:
	*   'LEVEL [category] <args[0]>, args[1], ...'
	* This enables proper % formatting via the first argument.
	* Each category is enabled by default but can be enabled or disabled with
	* the setCategoryEnabled() function.
	*/
	forge.log.levels = [
		"none",
		"error",
		"warning",
		"info",
		"debug",
		"verbose",
		"max"
	];
	var sLevelInfo = {};
	var sLoggers = [];
	/**
	* Standard console logger. If no console support is enabled this will
	* remain null. Check before using.
	*/
	var sConsoleLogger = null;
	/**
	* Lock the level at the current value. Used in cases where user config may
	* set the level such that only critical messages are seen but more verbose
	* messages are needed for debugging or other purposes.
	*/
	forge.log.LEVEL_LOCKED = 2;
	/**
	* Always call log function. By default, the logging system will check the
	* message level against logger.level before calling the log function. This
	* flag allows the function to do its own check.
	*/
	forge.log.NO_LEVEL_CHECK = 4;
	/**
	* Perform message interpolation with the passed arguments. "%" style
	* fields in log messages will be replaced by arguments as needed. Some
	* loggers, such as Firebug, may do this automatically. The original log
	* message will be available as 'message' and the interpolated version will
	* be available as 'fullMessage'.
	*/
	forge.log.INTERPOLATE = 8;
	for (var i = 0; i < forge.log.levels.length; ++i) {
		var level = forge.log.levels[i];
		sLevelInfo[level] = {
			index: i,
			name: level.toUpperCase()
		};
	}
	/**
	* Message logger. Will dispatch a message to registered loggers as needed.
	*
	* @param message message object
	*/
	forge.log.logMessage = function(message) {
		var messageLevelIndex = sLevelInfo[message.level].index;
		for (var i = 0; i < sLoggers.length; ++i) {
			var logger = sLoggers[i];
			if (logger.flags & forge.log.NO_LEVEL_CHECK) logger.f(message);
			else if (messageLevelIndex <= sLevelInfo[logger.level].index) logger.f(logger, message);
		}
	};
	/**
	* Sets the 'standard' key on a message object to:
	* "LEVEL [category] " + message
	*
	* @param message a message log object
	*/
	forge.log.prepareStandard = function(message) {
		if (!("standard" in message)) message.standard = sLevelInfo[message.level].name + " [" + message.category + "] " + message.message;
	};
	/**
	* Sets the 'full' key on a message object to the original message
	* interpolated via % formatting with the message arguments.
	*
	* @param message a message log object.
	*/
	forge.log.prepareFull = function(message) {
		if (!("full" in message)) {
			var args = [message.message];
			args = args.concat([]);
			message.full = forge.util.format.apply(this, args);
		}
	};
	/**
	* Applies both preparseStandard() and prepareFull() to a message object and
	* store result in 'standardFull'.
	*
	* @param message a message log object.
	*/
	forge.log.prepareStandardFull = function(message) {
		if (!("standardFull" in message)) {
			forge.log.prepareStandard(message);
			message.standardFull = message.standard;
		}
	};
	var levels = [
		"error",
		"warning",
		"info",
		"debug",
		"verbose"
	];
	for (var i = 0; i < levels.length; ++i) (function(level) {
		forge.log[level] = function(category, message) {
			var args = Array.prototype.slice.call(arguments).slice(2);
			var msg = {
				timestamp: /* @__PURE__ */ new Date(),
				level,
				category,
				message,
				"arguments": args
			};
			forge.log.logMessage(msg);
		};
	})(levels[i]);
	/**
	* Creates a new logger with specified custom logging function.
	*
	* The logging function has a signature of:
	*   function(logger, message)
	* logger: current logger
	* message: object:
	*   level: level id
	*   category: category
	*   message: string message
	*   arguments: Array of extra arguments
	*   fullMessage: interpolated message and arguments if INTERPOLATE flag set
	*
	* @param logFunction a logging function which takes a log message object
	*          as a parameter.
	*
	* @return a logger object.
	*/
	forge.log.makeLogger = function(logFunction) {
		var logger = {
			flags: 0,
			f: logFunction
		};
		forge.log.setLevel(logger, "none");
		return logger;
	};
	/**
	* Sets the current log level on a logger.
	*
	* @param logger the target logger.
	* @param level the new maximum log level as a string.
	*
	* @return true if set, false if not.
	*/
	forge.log.setLevel = function(logger, level) {
		var rval = false;
		if (logger && !(logger.flags & forge.log.LEVEL_LOCKED)) {
			for (var i = 0; i < forge.log.levels.length; ++i) if (level == forge.log.levels[i]) {
				logger.level = level;
				rval = true;
				break;
			}
		}
		return rval;
	};
	/**
	* Locks the log level at its current value.
	*
	* @param logger the target logger.
	* @param lock boolean lock value, default to true.
	*/
	forge.log.lock = function(logger, lock) {
		if (typeof lock === "undefined" || lock) logger.flags |= forge.log.LEVEL_LOCKED;
		else logger.flags &= ~forge.log.LEVEL_LOCKED;
	};
	/**
	* Adds a logger.
	*
	* @param logger the logger object.
	*/
	forge.log.addLogger = function(logger) {
		sLoggers.push(logger);
	};
	if (typeof console !== "undefined" && "log" in console) {
		var logger;
		if (console.error && console.warn && console.info && console.debug) {
			var levelHandlers = {
				error: console.error,
				warning: console.warn,
				info: console.info,
				debug: console.debug,
				verbose: console.debug
			};
			var f = function(logger, message) {
				forge.log.prepareStandard(message);
				var handler = levelHandlers[message.level];
				var args = [message.standard];
				args = args.concat(message["arguments"].slice());
				handler.apply(console, args);
			};
			logger = forge.log.makeLogger(f);
		} else {
			var f = function(logger, message) {
				forge.log.prepareStandardFull(message);
				console.log(message.standardFull);
			};
			logger = forge.log.makeLogger(f);
		}
		forge.log.setLevel(logger, "debug");
		forge.log.addLogger(logger);
		sConsoleLogger = logger;
	} else console = { log: function() {} };
	if (sConsoleLogger !== null && typeof window !== "undefined" && window.location) {
		var query = new URL(window.location.href).searchParams;
		if (query.has("console.level")) forge.log.setLevel(sConsoleLogger, query.get("console.level").slice(-1)[0]);
		if (query.has("console.lock")) {
			if (query.get("console.lock").slice(-1)[0] == "true") forge.log.lock(sConsoleLogger);
		}
	}
	forge.log.consoleLogger = sConsoleLogger;
}));
//#endregion
//#region node_modules/node-forge/lib/md.all.js
var require_md_all = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Node.js module for all known Forge message digests.
	*
	* @author Dave Longley
	*
	* Copyright 2011-2017 Digital Bazaar, Inc.
	*/
	module.exports = require_md();
	require_md5();
	require_sha1();
	require_sha256();
	require_sha512();
}));
//#endregion
//#region node_modules/node-forge/lib/pkcs7.js
var require_pkcs7 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Javascript implementation of PKCS#7 v1.5.
	*
	* @author Stefan Siegl
	* @author Dave Longley
	*
	* Copyright (c) 2012 Stefan Siegl <stesie@brokenpipe.de>
	* Copyright (c) 2012-2015 Digital Bazaar, Inc.
	*
	* Currently this implementation only supports ContentType of EnvelopedData,
	* EncryptedData, or SignedData at the root level. The top level elements may
	* contain only a ContentInfo of ContentType Data, i.e. plain data. Further
	* nesting is not (yet) supported.
	*
	* The Forge validators for PKCS #7's ASN.1 structures are available from
	* a separate file pkcs7asn1.js, since those are referenced from other
	* PKCS standards like PKCS #12.
	*/
	var forge = require_forge();
	require_aes();
	require_asn1();
	require_des();
	require_oids();
	require_pem();
	require_pkcs7asn1();
	require_random();
	require_util();
	require_x509();
	var asn1 = forge.asn1;
	var p7 = module.exports = forge.pkcs7 = forge.pkcs7 || {};
	/**
	* Converts a PKCS#7 message from PEM format.
	*
	* @param pem the PEM-formatted PKCS#7 message.
	*
	* @return the PKCS#7 message.
	*/
	p7.messageFromPem = function(pem) {
		var msg = forge.pem.decode(pem)[0];
		if (msg.type !== "PKCS7") {
			var error = /* @__PURE__ */ new Error("Could not convert PKCS#7 message from PEM; PEM header type is not \"PKCS#7\".");
			error.headerType = msg.type;
			throw error;
		}
		if (msg.procType && msg.procType.type === "ENCRYPTED") throw new Error("Could not convert PKCS#7 message from PEM; PEM is encrypted.");
		var obj = asn1.fromDer(msg.body);
		return p7.messageFromAsn1(obj);
	};
	/**
	* Converts a PKCS#7 message to PEM format.
	*
	* @param msg The PKCS#7 message object
	* @param maxline The maximum characters per line, defaults to 64.
	*
	* @return The PEM-formatted PKCS#7 message.
	*/
	p7.messageToPem = function(msg, maxline) {
		var pemObj = {
			type: "PKCS7",
			body: asn1.toDer(msg.toAsn1()).getBytes()
		};
		return forge.pem.encode(pemObj, { maxline });
	};
	/**
	* Converts a PKCS#7 message from an ASN.1 object.
	*
	* @param obj the ASN.1 representation of a ContentInfo.
	*
	* @return the PKCS#7 message.
	*/
	p7.messageFromAsn1 = function(obj) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, p7.asn1.contentInfoValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read PKCS#7 message. ASN.1 object is not an PKCS#7 ContentInfo.");
			error.errors = errors;
			throw error;
		}
		var contentType = asn1.derToOid(capture.contentType);
		var msg;
		switch (contentType) {
			case forge.pki.oids.envelopedData:
				msg = p7.createEnvelopedData();
				break;
			case forge.pki.oids.encryptedData:
				msg = p7.createEncryptedData();
				break;
			case forge.pki.oids.signedData:
				msg = p7.createSignedData();
				break;
			default: throw new Error("Cannot read PKCS#7 message. ContentType with OID " + contentType + " is not (yet) supported.");
		}
		msg.fromAsn1(capture.content.value[0]);
		return msg;
	};
	p7.createSignedData = function() {
		var msg = null;
		msg = {
			type: forge.pki.oids.signedData,
			version: 1,
			certificates: [],
			crls: [],
			signers: [],
			digestAlgorithmIdentifiers: [],
			contentInfo: null,
			signerInfos: [],
			fromAsn1: function(obj) {
				_fromAsn1(msg, obj, p7.asn1.signedDataValidator);
				msg.certificates = [];
				msg.crls = [];
				msg.digestAlgorithmIdentifiers = [];
				msg.contentInfo = null;
				msg.signerInfos = [];
				if (msg.rawCapture.certificates) {
					var certs = msg.rawCapture.certificates.value;
					for (var i = 0; i < certs.length; ++i) msg.certificates.push(forge.pki.certificateFromAsn1(certs[i]));
				}
			},
			toAsn1: function() {
				if (!msg.contentInfo) msg.sign();
				var certs = [];
				for (var i = 0; i < msg.certificates.length; ++i) certs.push(forge.pki.certificateToAsn1(msg.certificates[i]));
				var crls = [];
				var signedData = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
					asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
					asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.digestAlgorithmIdentifiers),
					msg.contentInfo
				])]);
				if (certs.length > 0) signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, certs));
				if (crls.length > 0) signedData.value[0].value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, crls));
				signedData.value[0].value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, msg.signerInfos));
				return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()), signedData]);
			},
			/**
			* Add (another) entity to list of signers.
			*
			* Note: If authenticatedAttributes are provided, then, per RFC 2315,
			* they must include at least two attributes: content type and
			* message digest. The message digest attribute value will be
			* auto-calculated during signing and will be ignored if provided.
			*
			* Here's an example of providing these two attributes:
			*
			* forge.pkcs7.createSignedData();
			* p7.addSigner({
			*   issuer: cert.issuer.attributes,
			*   serialNumber: cert.serialNumber,
			*   key: privateKey,
			*   digestAlgorithm: forge.pki.oids.sha1,
			*   authenticatedAttributes: [{
			*     type: forge.pki.oids.contentType,
			*     value: forge.pki.oids.data
			*   }, {
			*     type: forge.pki.oids.messageDigest
			*   }]
			* });
			*
			* TODO: Support [subjectKeyIdentifier] as signer's ID.
			*
			* @param signer the signer information:
			*          key the signer's private key.
			*          [certificate] a certificate containing the public key
			*            associated with the signer's private key; use this option as
			*            an alternative to specifying signer.issuer and
			*            signer.serialNumber.
			*          [issuer] the issuer attributes (eg: cert.issuer.attributes).
			*          [serialNumber] the signer's certificate's serial number in
			*           hexadecimal (eg: cert.serialNumber).
			*          [digestAlgorithm] the message digest OID, as a string, to use
			*            (eg: forge.pki.oids.sha1).
			*          [authenticatedAttributes] an optional array of attributes
			*            to also sign along with the content.
			*/
			addSigner: function(signer) {
				var issuer = signer.issuer;
				var serialNumber = signer.serialNumber;
				if (signer.certificate) {
					var cert = signer.certificate;
					if (typeof cert === "string") cert = forge.pki.certificateFromPem(cert);
					issuer = cert.issuer.attributes;
					serialNumber = cert.serialNumber;
				}
				var key = signer.key;
				if (!key) throw new Error("Could not add PKCS#7 signer; no private key specified.");
				if (typeof key === "string") key = forge.pki.privateKeyFromPem(key);
				var digestAlgorithm = signer.digestAlgorithm || forge.pki.oids.sha1;
				switch (digestAlgorithm) {
					case forge.pki.oids.sha1:
					case forge.pki.oids.sha256:
					case forge.pki.oids.sha384:
					case forge.pki.oids.sha512:
					case forge.pki.oids.md5: break;
					default: throw new Error("Could not add PKCS#7 signer; unknown message digest algorithm: " + digestAlgorithm);
				}
				var authenticatedAttributes = signer.authenticatedAttributes || [];
				if (authenticatedAttributes.length > 0) {
					var contentType = false;
					var messageDigest = false;
					for (var i = 0; i < authenticatedAttributes.length; ++i) {
						var attr = authenticatedAttributes[i];
						if (!contentType && attr.type === forge.pki.oids.contentType) {
							contentType = true;
							if (messageDigest) break;
							continue;
						}
						if (!messageDigest && attr.type === forge.pki.oids.messageDigest) {
							messageDigest = true;
							if (contentType) break;
							continue;
						}
					}
					if (!contentType || !messageDigest) throw new Error("Invalid signer.authenticatedAttributes. If signer.authenticatedAttributes is specified, then it must contain at least two attributes, PKCS #9 content-type and PKCS #9 message-digest.");
				}
				msg.signers.push({
					key,
					version: 1,
					issuer,
					serialNumber,
					digestAlgorithm,
					signatureAlgorithm: forge.pki.oids.rsaEncryption,
					signature: null,
					authenticatedAttributes,
					unauthenticatedAttributes: []
				});
			},
			/**
			* Signs the content.
			* @param options Options to apply when signing:
			*    [detached] boolean. If signing should be done in detached mode. Defaults to false.
			*/
			sign: function(options) {
				options = options || {};
				if (typeof msg.content !== "object" || msg.contentInfo === null) {
					msg.contentInfo = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes())]);
					if ("content" in msg) {
						var content;
						if (msg.content instanceof forge.util.ByteBuffer) content = msg.content.bytes();
						else if (typeof msg.content === "string") content = forge.util.encodeUtf8(msg.content);
						if (options.detached) msg.detachedContent = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content);
						else msg.contentInfo.value.push(asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, content)]));
					}
				}
				if (msg.signers.length === 0) return;
				addSignerInfos(addDigestAlgorithmIds());
			},
			verify: function() {
				throw new Error("PKCS#7 signature verification not yet implemented.");
			},
			/**
			* Add a certificate.
			*
			* @param cert the certificate to add.
			*/
			addCertificate: function(cert) {
				if (typeof cert === "string") cert = forge.pki.certificateFromPem(cert);
				msg.certificates.push(cert);
			},
			/**
			* Add a certificate revokation list.
			*
			* @param crl the certificate revokation list to add.
			*/
			addCertificateRevokationList: function(crl) {
				throw new Error("PKCS#7 CRL support not yet implemented.");
			}
		};
		return msg;
		function addDigestAlgorithmIds() {
			var mds = {};
			for (var i = 0; i < msg.signers.length; ++i) {
				var signer = msg.signers[i];
				var oid = signer.digestAlgorithm;
				if (!(oid in mds)) mds[oid] = forge.md[forge.pki.oids[oid]].create();
				if (signer.authenticatedAttributes.length === 0) signer.md = mds[oid];
				else signer.md = forge.md[forge.pki.oids[oid]].create();
			}
			msg.digestAlgorithmIdentifiers = [];
			for (var oid in mds) msg.digestAlgorithmIdentifiers.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(oid).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]));
			return mds;
		}
		function addSignerInfos(mds) {
			var content;
			if (msg.detachedContent) content = msg.detachedContent;
			else {
				content = msg.contentInfo.value[1];
				content = content.value[0];
			}
			if (!content) throw new Error("Could not sign PKCS#7 message; there is no content to sign.");
			var contentType = asn1.derToOid(msg.contentInfo.value[0].value);
			var bytes = asn1.toDer(content);
			bytes.getByte();
			asn1.getBerValueLength(bytes);
			bytes = bytes.getBytes();
			for (var oid in mds) mds[oid].start().update(bytes);
			var signingTime = /* @__PURE__ */ new Date();
			for (var i = 0; i < msg.signers.length; ++i) {
				var signer = msg.signers[i];
				if (signer.authenticatedAttributes.length === 0) {
					if (contentType !== forge.pki.oids.data) throw new Error("Invalid signer; authenticatedAttributes must be present when the ContentInfo content type is not PKCS#7 Data.");
				} else {
					signer.authenticatedAttributesAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, []);
					var attrsAsn1 = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, []);
					for (var ai = 0; ai < signer.authenticatedAttributes.length; ++ai) {
						var attr = signer.authenticatedAttributes[ai];
						if (attr.type === forge.pki.oids.messageDigest) attr.value = mds[signer.digestAlgorithm].digest();
						else if (attr.type === forge.pki.oids.signingTime) {
							if (!attr.value) attr.value = signingTime;
						}
						attrsAsn1.value.push(_attributeToAsn1(attr));
						signer.authenticatedAttributesAsn1.value.push(_attributeToAsn1(attr));
					}
					bytes = asn1.toDer(attrsAsn1).getBytes();
					signer.md.start().update(bytes);
				}
				signer.signature = signer.key.sign(signer.md, "RSASSA-PKCS1-V1_5");
			}
			msg.signerInfos = _signersToAsn1(msg.signers);
		}
	};
	/**
	* Creates an empty PKCS#7 message of type EncryptedData.
	*
	* @return the message.
	*/
	p7.createEncryptedData = function() {
		var msg = null;
		msg = {
			type: forge.pki.oids.encryptedData,
			version: 0,
			encryptedContent: { algorithm: forge.pki.oids["aes256-CBC"] },
			/**
			* Reads an EncryptedData content block (in ASN.1 format)
			*
			* @param obj The ASN.1 representation of the EncryptedData content block
			*/
			fromAsn1: function(obj) {
				_fromAsn1(msg, obj, p7.asn1.encryptedDataValidator);
			},
			/**
			* Decrypt encrypted content
			*
			* @param key The (symmetric) key as a byte buffer
			*/
			decrypt: function(key) {
				if (key !== void 0) msg.encryptedContent.key = key;
				_decryptContent(msg);
			}
		};
		return msg;
	};
	/**
	* Creates an empty PKCS#7 message of type EnvelopedData.
	*
	* @return the message.
	*/
	p7.createEnvelopedData = function() {
		var msg = null;
		msg = {
			type: forge.pki.oids.envelopedData,
			version: 0,
			recipients: [],
			encryptedContent: { algorithm: forge.pki.oids["aes256-CBC"] },
			/**
			* Reads an EnvelopedData content block (in ASN.1 format)
			*
			* @param obj the ASN.1 representation of the EnvelopedData content block.
			*/
			fromAsn1: function(obj) {
				var capture = _fromAsn1(msg, obj, p7.asn1.envelopedDataValidator);
				msg.recipients = _recipientsFromAsn1(capture.recipientInfos.value);
			},
			toAsn1: function() {
				return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(msg.type).getBytes()), asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
					asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(msg.version).getBytes()),
					asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, _recipientsToAsn1(msg.recipients)),
					asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, _encryptedContentToAsn1(msg.encryptedContent))
				])])]);
			},
			/**
			* Find recipient by X.509 certificate's issuer.
			*
			* @param cert the certificate with the issuer to look for.
			*
			* @return the recipient object.
			*/
			findRecipient: function(cert) {
				var sAttr = cert.issuer.attributes;
				for (var i = 0; i < msg.recipients.length; ++i) {
					var r = msg.recipients[i];
					var rAttr = r.issuer;
					if (r.serialNumber !== cert.serialNumber) continue;
					if (rAttr.length !== sAttr.length) continue;
					var match = true;
					for (var j = 0; j < sAttr.length; ++j) if (rAttr[j].type !== sAttr[j].type || rAttr[j].value !== sAttr[j].value) {
						match = false;
						break;
					}
					if (match) return r;
				}
				return null;
			},
			/**
			* Decrypt enveloped content
			*
			* @param recipient The recipient object related to the private key
			* @param privKey The (RSA) private key object
			*/
			decrypt: function(recipient, privKey) {
				if (msg.encryptedContent.key === void 0 && recipient !== void 0 && privKey !== void 0) switch (recipient.encryptedContent.algorithm) {
					case forge.pki.oids.rsaEncryption:
					case forge.pki.oids.desCBC:
						var key = privKey.decrypt(recipient.encryptedContent.content);
						msg.encryptedContent.key = forge.util.createBuffer(key);
						break;
					default: throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
				}
				_decryptContent(msg);
			},
			/**
			* Add (another) entity to list of recipients.
			*
			* @param cert The certificate of the entity to add.
			*/
			addRecipient: function(cert) {
				msg.recipients.push({
					version: 0,
					issuer: cert.issuer.attributes,
					serialNumber: cert.serialNumber,
					encryptedContent: {
						algorithm: forge.pki.oids.rsaEncryption,
						key: cert.publicKey
					}
				});
			},
			/**
			* Encrypt enveloped content.
			*
			* This function supports two optional arguments, cipher and key, which
			* can be used to influence symmetric encryption.  Unless cipher is
			* provided, the cipher specified in encryptedContent.algorithm is used
			* (defaults to AES-256-CBC).  If no key is provided, encryptedContent.key
			* is (re-)used.  If that one's not set, a random key will be generated
			* automatically.
			*
			* @param [key] The key to be used for symmetric encryption.
			* @param [cipher] The OID of the symmetric cipher to use.
			*/
			encrypt: function(key, cipher) {
				if (msg.encryptedContent.content === void 0) {
					cipher = cipher || msg.encryptedContent.algorithm;
					key = key || msg.encryptedContent.key;
					var keyLen, ivLen, ciphFn;
					switch (cipher) {
						case forge.pki.oids["aes128-CBC"]:
							keyLen = 16;
							ivLen = 16;
							ciphFn = forge.aes.createEncryptionCipher;
							break;
						case forge.pki.oids["aes192-CBC"]:
							keyLen = 24;
							ivLen = 16;
							ciphFn = forge.aes.createEncryptionCipher;
							break;
						case forge.pki.oids["aes256-CBC"]:
							keyLen = 32;
							ivLen = 16;
							ciphFn = forge.aes.createEncryptionCipher;
							break;
						case forge.pki.oids["des-EDE3-CBC"]:
							keyLen = 24;
							ivLen = 8;
							ciphFn = forge.des.createEncryptionCipher;
							break;
						default: throw new Error("Unsupported symmetric cipher, OID " + cipher);
					}
					if (key === void 0) key = forge.util.createBuffer(forge.random.getBytes(keyLen));
					else if (key.length() != keyLen) throw new Error("Symmetric key has wrong length; got " + key.length() + " bytes, expected " + keyLen + ".");
					msg.encryptedContent.algorithm = cipher;
					msg.encryptedContent.key = key;
					msg.encryptedContent.parameter = forge.util.createBuffer(forge.random.getBytes(ivLen));
					var ciph = ciphFn(key);
					ciph.start(msg.encryptedContent.parameter.copy());
					ciph.update(msg.content);
					if (!ciph.finish()) throw new Error("Symmetric encryption failed.");
					msg.encryptedContent.content = ciph.output;
				}
				for (var i = 0; i < msg.recipients.length; ++i) {
					var recipient = msg.recipients[i];
					if (recipient.encryptedContent.content !== void 0) continue;
					switch (recipient.encryptedContent.algorithm) {
						case forge.pki.oids.rsaEncryption:
							recipient.encryptedContent.content = recipient.encryptedContent.key.encrypt(msg.encryptedContent.key.data);
							break;
						default: throw new Error("Unsupported asymmetric cipher, OID " + recipient.encryptedContent.algorithm);
					}
				}
			}
		};
		return msg;
	};
	/**
	* Converts a single recipient from an ASN.1 object.
	*
	* @param obj the ASN.1 RecipientInfo.
	*
	* @return the recipient object.
	*/
	function _recipientFromAsn1(obj) {
		var capture = {};
		var errors = [];
		if (!asn1.validate(obj, p7.asn1.recipientInfoValidator, capture, errors)) {
			var error = /* @__PURE__ */ new Error("Cannot read PKCS#7 RecipientInfo. ASN.1 object is not an PKCS#7 RecipientInfo.");
			error.errors = errors;
			throw error;
		}
		return {
			version: capture.version.charCodeAt(0),
			issuer: forge.pki.RDNAttributesAsArray(capture.issuer),
			serialNumber: forge.util.createBuffer(capture.serial).toHex(),
			encryptedContent: {
				algorithm: asn1.derToOid(capture.encAlgorithm),
				parameter: capture.encParameter ? capture.encParameter.value : void 0,
				content: capture.encKey
			}
		};
	}
	/**
	* Converts a single recipient object to an ASN.1 object.
	*
	* @param obj the recipient object.
	*
	* @return the ASN.1 RecipientInfo.
	*/
	function _recipientToAsn1(obj) {
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(obj.serialNumber))]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.encryptedContent.algorithm).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.encryptedContent.content)
		]);
	}
	/**
	* Map a set of RecipientInfo ASN.1 objects to recipient objects.
	*
	* @param infos an array of ASN.1 representations RecipientInfo (i.e. SET OF).
	*
	* @return an array of recipient objects.
	*/
	function _recipientsFromAsn1(infos) {
		var ret = [];
		for (var i = 0; i < infos.length; ++i) ret.push(_recipientFromAsn1(infos[i]));
		return ret;
	}
	/**
	* Map an array of recipient objects to ASN.1 RecipientInfo objects.
	*
	* @param recipients an array of recipientInfo objects.
	*
	* @return an array of ASN.1 RecipientInfos.
	*/
	function _recipientsToAsn1(recipients) {
		var ret = [];
		for (var i = 0; i < recipients.length; ++i) ret.push(_recipientToAsn1(recipients[i]));
		return ret;
	}
	/**
	* Converts a single signerInfo object to an ASN.1 object.
	*
	* @param obj the signerInfo object.
	*
	* @return the ASN.1 representation of a SignerInfo.
	*/
	function _signerToAsn1(obj) {
		var rval = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, asn1.integerToDer(obj.version).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [forge.pki.distinguishedNameToAsn1({ attributes: obj.issuer }), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.INTEGER, false, forge.util.hexToBytes(obj.serialNumber))]),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.digestAlgorithm).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")])
		]);
		if (obj.authenticatedAttributesAsn1) rval.value.push(obj.authenticatedAttributesAsn1);
		rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(obj.signatureAlgorithm).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, "")]));
		rval.value.push(asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, obj.signature));
		if (obj.unauthenticatedAttributes.length > 0) {
			var attrsAsn1 = asn1.create(asn1.Class.CONTEXT_SPECIFIC, 1, true, []);
			for (var i = 0; i < obj.unauthenticatedAttributes.length; ++i) {
				var attr = obj.unauthenticatedAttributes[i];
				attrsAsn1.values.push(_attributeToAsn1(attr));
			}
			rval.value.push(attrsAsn1);
		}
		return rval;
	}
	/**
	* Map an array of signer objects to ASN.1 objects.
	*
	* @param signers an array of signer objects.
	*
	* @return an array of ASN.1 SignerInfos.
	*/
	function _signersToAsn1(signers) {
		var ret = [];
		for (var i = 0; i < signers.length; ++i) ret.push(_signerToAsn1(signers[i]));
		return ret;
	}
	/**
	* Convert an attribute object to an ASN.1 Attribute.
	*
	* @param attr the attribute object.
	*
	* @return the ASN.1 Attribute.
	*/
	function _attributeToAsn1(attr) {
		var value;
		if (attr.type === forge.pki.oids.contentType) value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.value).getBytes());
		else if (attr.type === forge.pki.oids.messageDigest) value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, attr.value.bytes());
		else if (attr.type === forge.pki.oids.signingTime) {
			var jan_1_1950 = /* @__PURE__ */ new Date("1950-01-01T00:00:00Z");
			var jan_1_2050 = /* @__PURE__ */ new Date("2050-01-01T00:00:00Z");
			var date = attr.value;
			if (typeof date === "string") {
				var timestamp = Date.parse(date);
				if (!isNaN(timestamp)) date = new Date(timestamp);
				else if (date.length === 13) date = asn1.utcTimeToDate(date);
				else date = asn1.generalizedTimeToDate(date);
			}
			if (date >= jan_1_1950 && date < jan_1_2050) value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.UTCTIME, false, asn1.dateToUtcTime(date));
			else value = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.GENERALIZEDTIME, false, asn1.dateToGeneralizedTime(date));
		}
		return asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(attr.type).getBytes()), asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SET, true, [value])]);
	}
	/**
	* Map messages encrypted content to ASN.1 objects.
	*
	* @param ec The encryptedContent object of the message.
	*
	* @return ASN.1 representation of the encryptedContent object (SEQUENCE).
	*/
	function _encryptedContentToAsn1(ec) {
		return [
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.data).getBytes()),
			asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(ec.algorithm).getBytes()), !ec.parameter ? void 0 : asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.parameter.getBytes())]),
			asn1.create(asn1.Class.CONTEXT_SPECIFIC, 0, true, [asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, ec.content.getBytes())])
		];
	}
	/**
	* Reads the "common part" of an PKCS#7 content block (in ASN.1 format)
	*
	* This function reads the "common part" of the PKCS#7 content blocks
	* EncryptedData and EnvelopedData, i.e. version number and symmetrically
	* encrypted content block.
	*
	* The result of the ASN.1 validate and capture process is returned
	* to allow the caller to extract further data, e.g. the list of recipients
	* in case of a EnvelopedData object.
	*
	* @param msg the PKCS#7 object to read the data to.
	* @param obj the ASN.1 representation of the content block.
	* @param validator the ASN.1 structure validator object to use.
	*
	* @return the value map captured by validator object.
	*/
	function _fromAsn1(msg, obj, validator) {
		var capture = {};
		if (!asn1.validate(obj, validator, capture, [])) {
			var error = /* @__PURE__ */ new Error("Cannot read PKCS#7 message. ASN.1 object is not a supported PKCS#7 message.");
			error.errors = error;
			throw error;
		}
		if (asn1.derToOid(capture.contentType) !== forge.pki.oids.data) throw new Error("Unsupported PKCS#7 message. Only wrapped ContentType Data supported.");
		if (capture.encryptedContent) {
			var content = "";
			if (forge.util.isArray(capture.encryptedContent)) for (var i = 0; i < capture.encryptedContent.length; ++i) {
				if (capture.encryptedContent[i].type !== asn1.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting encrypted content constructed of only OCTET STRING objects.");
				content += capture.encryptedContent[i].value;
			}
			else content = capture.encryptedContent;
			msg.encryptedContent = {
				algorithm: asn1.derToOid(capture.encAlgorithm),
				parameter: forge.util.createBuffer(capture.encParameter.value),
				content: forge.util.createBuffer(content)
			};
		}
		if (capture.content) {
			var content = "";
			if (forge.util.isArray(capture.content)) for (var i = 0; i < capture.content.length; ++i) {
				if (capture.content[i].type !== asn1.Type.OCTETSTRING) throw new Error("Malformed PKCS#7 message, expecting content constructed of only OCTET STRING objects.");
				content += capture.content[i].value;
			}
			else content = capture.content;
			msg.content = forge.util.createBuffer(content);
		}
		msg.version = capture.version.charCodeAt(0);
		msg.rawCapture = capture;
		return capture;
	}
	/**
	* Decrypt the symmetrically encrypted content block of the PKCS#7 message.
	*
	* Decryption is skipped in case the PKCS#7 message object already has a
	* (decrypted) content attribute.  The algorithm, key and cipher parameters
	* (probably the iv) are taken from the encryptedContent attribute of the
	* message object.
	*
	* @param The PKCS#7 message object.
	*/
	function _decryptContent(msg) {
		if (msg.encryptedContent.key === void 0) throw new Error("Symmetric key not available.");
		if (msg.content === void 0) {
			var ciph;
			switch (msg.encryptedContent.algorithm) {
				case forge.pki.oids["aes128-CBC"]:
				case forge.pki.oids["aes192-CBC"]:
				case forge.pki.oids["aes256-CBC"]:
					ciph = forge.aes.createDecryptionCipher(msg.encryptedContent.key);
					break;
				case forge.pki.oids["desCBC"]:
				case forge.pki.oids["des-EDE3-CBC"]:
					ciph = forge.des.createDecryptionCipher(msg.encryptedContent.key);
					break;
				default: throw new Error("Unsupported symmetric cipher, OID " + msg.encryptedContent.algorithm);
			}
			ciph.start(msg.encryptedContent.parameter);
			ciph.update(msg.encryptedContent.content);
			if (!ciph.finish()) throw new Error("Symmetric decryption failed.");
			msg.content = ciph.output;
		}
	}
}));
//#endregion
//#region node_modules/node-forge/lib/ssh.js
var require_ssh = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Functions to output keys in SSH-friendly formats.
	*
	* This is part of the Forge project which may be used under the terms of
	* either the BSD License or the GNU General Public License (GPL) Version 2.
	*
	* See: https://github.com/digitalbazaar/forge/blob/cbebca3780658703d925b61b2caffb1d263a6c1d/LICENSE
	*
	* @author https://github.com/shellac
	*/
	var forge = require_forge();
	require_aes();
	require_hmac();
	require_md5();
	require_sha1();
	require_util();
	var ssh = module.exports = forge.ssh = forge.ssh || {};
	/**
	* Encodes (and optionally encrypts) a private RSA key as a Putty PPK file.
	*
	* @param privateKey the key.
	* @param passphrase a passphrase to protect the key (falsy for no encryption).
	* @param comment a comment to include in the key file.
	*
	* @return the PPK file as a string.
	*/
	ssh.privateKeyToPutty = function(privateKey, passphrase, comment) {
		comment = comment || "";
		passphrase = passphrase || "";
		var algorithm = "ssh-rsa";
		var encryptionAlgorithm = passphrase === "" ? "none" : "aes256-cbc";
		var ppk = "PuTTY-User-Key-File-2: " + algorithm + "\r\n";
		ppk += "Encryption: " + encryptionAlgorithm + "\r\n";
		ppk += "Comment: " + comment + "\r\n";
		var pubbuffer = forge.util.createBuffer();
		_addStringToBuffer(pubbuffer, algorithm);
		_addBigIntegerToBuffer(pubbuffer, privateKey.e);
		_addBigIntegerToBuffer(pubbuffer, privateKey.n);
		var pub = forge.util.encode64(pubbuffer.bytes(), 64);
		var length = Math.floor(pub.length / 66) + 1;
		ppk += "Public-Lines: " + length + "\r\n";
		ppk += pub;
		var privbuffer = forge.util.createBuffer();
		_addBigIntegerToBuffer(privbuffer, privateKey.d);
		_addBigIntegerToBuffer(privbuffer, privateKey.p);
		_addBigIntegerToBuffer(privbuffer, privateKey.q);
		_addBigIntegerToBuffer(privbuffer, privateKey.qInv);
		var priv;
		if (!passphrase) priv = forge.util.encode64(privbuffer.bytes(), 64);
		else {
			var encLen = privbuffer.length() + 16 - 1;
			encLen -= encLen % 16;
			var padding = _sha1(privbuffer.bytes());
			padding.truncate(padding.length() - encLen + privbuffer.length());
			privbuffer.putBuffer(padding);
			var aeskey = forge.util.createBuffer();
			aeskey.putBuffer(_sha1("\0\0\0\0", passphrase));
			aeskey.putBuffer(_sha1("\0\0\0", passphrase));
			var cipher = forge.aes.createEncryptionCipher(aeskey.truncate(8), "CBC");
			cipher.start(forge.util.createBuffer().fillWithByte(0, 16));
			cipher.update(privbuffer.copy());
			cipher.finish();
			var encrypted = cipher.output;
			encrypted.truncate(16);
			priv = forge.util.encode64(encrypted.bytes(), 64);
		}
		length = Math.floor(priv.length / 66) + 1;
		ppk += "\r\nPrivate-Lines: " + length + "\r\n";
		ppk += priv;
		var mackey = _sha1("putty-private-key-file-mac-key", passphrase);
		var macbuffer = forge.util.createBuffer();
		_addStringToBuffer(macbuffer, algorithm);
		_addStringToBuffer(macbuffer, encryptionAlgorithm);
		_addStringToBuffer(macbuffer, comment);
		macbuffer.putInt32(pubbuffer.length());
		macbuffer.putBuffer(pubbuffer);
		macbuffer.putInt32(privbuffer.length());
		macbuffer.putBuffer(privbuffer);
		var hmac = forge.hmac.create();
		hmac.start("sha1", mackey);
		hmac.update(macbuffer.bytes());
		ppk += "\r\nPrivate-MAC: " + hmac.digest().toHex() + "\r\n";
		return ppk;
	};
	/**
	* Encodes a public RSA key as an OpenSSH file.
	*
	* @param key the key.
	* @param comment a comment.
	*
	* @return the public key in OpenSSH format.
	*/
	ssh.publicKeyToOpenSSH = function(key, comment) {
		var type = "ssh-rsa";
		comment = comment || "";
		var buffer = forge.util.createBuffer();
		_addStringToBuffer(buffer, type);
		_addBigIntegerToBuffer(buffer, key.e);
		_addBigIntegerToBuffer(buffer, key.n);
		return type + " " + forge.util.encode64(buffer.bytes()) + " " + comment;
	};
	/**
	* Encodes a private RSA key as an OpenSSH file.
	*
	* @param key the key.
	* @param passphrase a passphrase to protect the key (falsy for no encryption).
	*
	* @return the public key in OpenSSH format.
	*/
	ssh.privateKeyToOpenSSH = function(privateKey, passphrase) {
		if (!passphrase) return forge.pki.privateKeyToPem(privateKey);
		return forge.pki.encryptRsaPrivateKey(privateKey, passphrase, {
			legacy: true,
			algorithm: "aes128"
		});
	};
	/**
	* Gets the SSH fingerprint for the given public key.
	*
	* @param options the options to use.
	*          [md] the message digest object to use (defaults to forge.md.md5).
	*          [encoding] an alternative output encoding, such as 'hex'
	*            (defaults to none, outputs a byte buffer).
	*          [delimiter] the delimiter to use between bytes for 'hex' encoded
	*            output, eg: ':' (defaults to none).
	*
	* @return the fingerprint as a byte buffer or other encoding based on options.
	*/
	ssh.getPublicKeyFingerprint = function(key, options) {
		options = options || {};
		var md = options.md || forge.md.md5.create();
		var type = "ssh-rsa";
		var buffer = forge.util.createBuffer();
		_addStringToBuffer(buffer, type);
		_addBigIntegerToBuffer(buffer, key.e);
		_addBigIntegerToBuffer(buffer, key.n);
		md.start();
		md.update(buffer.getBytes());
		var digest = md.digest();
		if (options.encoding === "hex") {
			var hex = digest.toHex();
			if (options.delimiter) return hex.match(/.{2}/g).join(options.delimiter);
			return hex;
		} else if (options.encoding === "binary") return digest.getBytes();
		else if (options.encoding) throw new Error("Unknown encoding \"" + options.encoding + "\".");
		return digest;
	};
	/**
	* Adds len(val) then val to a buffer.
	*
	* @param buffer the buffer to add to.
	* @param val a big integer.
	*/
	function _addBigIntegerToBuffer(buffer, val) {
		var hexVal = val.toString(16);
		if (hexVal[0] >= "8") hexVal = "00" + hexVal;
		var bytes = forge.util.hexToBytes(hexVal);
		buffer.putInt32(bytes.length);
		buffer.putBytes(bytes);
	}
	/**
	* Adds len(val) then val to a buffer.
	*
	* @param buffer the buffer to add to.
	* @param val a string.
	*/
	function _addStringToBuffer(buffer, val) {
		buffer.putInt32(val.length);
		buffer.putString(val);
	}
	/**
	* Hashes the arguments into one value using SHA-1.
	*
	* @return the sha1 hash of the provided arguments.
	*/
	function _sha1() {
		var sha = forge.md.sha1.create();
		var num = arguments.length;
		for (var i = 0; i < num; ++i) sha.update(arguments[i]);
		return sha.digest();
	}
}));
//#endregion
//#region node_modules/node-forge/lib/index.js
var require_lib = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	/**
	* Node.js module for Forge.
	*
	* @author Dave Longley
	*
	* Copyright 2011-2016 Digital Bazaar, Inc.
	*/
	module.exports = require_forge();
	require_aes();
	require_aesCipherSuites();
	require_asn1();
	require_cipher();
	require_des();
	require_ed25519();
	require_hmac();
	require_kem();
	require_log();
	require_md_all();
	require_mgf1();
	require_pbkdf2();
	require_pem();
	require_pkcs1();
	require_pkcs12();
	require_pkcs7();
	require_pki();
	require_prime();
	require_prng();
	require_pss();
	require_random();
	require_rc2();
	require_ssh();
	require_tls();
	require_util();
}));
require_lib$1();
require_pretty_bytes();
var import_lib$1 = /* @__PURE__ */ require_esm.__toESM(require_lib(), 1);
var SIGNATURE_HEADER = "MCPB_SIG_V1";
var SIGNATURE_FOOTER = "MCPB_SIG_END";
var execFileAsync = (0, util.promisify)(child_process.execFile);
/**
* Verifies a signed MCPB file using OS certificate store
*
* @param mcpbPath Path to the signed MCPB file
* @returns Signature information including verification status
*/
async function verifyMcpbFile(mcpbPath) {
	try {
		const { originalContent, pkcs7Signature } = extractSignatureBlock((0, fs.readFileSync)(mcpbPath));
		if (!pkcs7Signature) return { status: "unsigned" };
		const asn1 = import_lib$1.default.asn1.fromDer(pkcs7Signature.toString("binary"));
		const p7Message = import_lib$1.default.pkcs7.messageFromAsn1(asn1);
		if (!("type" in p7Message) || p7Message.type !== import_lib$1.default.pki.oids.signedData) return { status: "unsigned" };
		const p7 = p7Message;
		const certificates = p7.certificates || [];
		if (certificates.length === 0) return { status: "unsigned" };
		const signingCert = certificates[0];
		const contentBuf = import_lib$1.default.util.createBuffer(originalContent);
		try {
			p7.verify({ authenticatedAttributes: true });
			const signerInfo = p7.signerInfos?.[0];
			if (signerInfo) {
				const md = import_lib$1.default.md.sha256.create();
				md.update(contentBuf.getBytes());
				const digest = md.digest().getBytes();
				let messageDigest = null;
				for (const attr of signerInfo.authenticatedAttributes) if (attr.type === import_lib$1.default.pki.oids.messageDigest) {
					messageDigest = attr.value;
					break;
				}
				if (!messageDigest || messageDigest !== digest) return { status: "unsigned" };
			}
		} catch (error) {
			return { status: "unsigned" };
		}
		const certPem = import_lib$1.default.pki.certificateToPem(signingCert);
		const intermediatePems = certificates.slice(1).map((cert) => Buffer.from(import_lib$1.default.pki.certificateToPem(cert)));
		if (!await verifyCertificateChain(Buffer.from(certPem), intermediatePems)) return { status: "unsigned" };
		return {
			status: signingCert.issuer.getField("CN")?.value === signingCert.subject.getField("CN")?.value ? "self-signed" : "signed",
			publisher: signingCert.subject.getField("CN")?.value || "Unknown",
			issuer: signingCert.issuer.getField("CN")?.value || "Unknown",
			valid_from: signingCert.validity.notBefore.toISOString(),
			valid_to: signingCert.validity.notAfter.toISOString(),
			fingerprint: import_lib$1.default.md.sha256.create().update(import_lib$1.default.asn1.toDer(import_lib$1.default.pki.certificateToAsn1(signingCert)).getBytes()).digest().toHex()
		};
	} catch (error) {
		throw new Error(`Failed to verify MCPB file: ${error}`);
	}
}
/**
* Extracts the signature block from a signed MCPB file
*/
function extractSignatureBlock(fileContent) {
	const footerBytes = Buffer.from(SIGNATURE_FOOTER, "utf-8");
	const footerIndex = fileContent.lastIndexOf(footerBytes);
	if (footerIndex === -1) return { originalContent: fileContent };
	const headerBytes = Buffer.from(SIGNATURE_HEADER, "utf-8");
	let headerIndex = -1;
	for (let i = footerIndex - 1; i >= 0; i--) if (fileContent.slice(i, i + headerBytes.length).equals(headerBytes)) {
		headerIndex = i;
		break;
	}
	if (headerIndex === -1) return { originalContent: fileContent };
	const originalContent = fileContent.slice(0, headerIndex);
	let offset = headerIndex + headerBytes.length;
	try {
		const sigLength = fileContent.readUInt32LE(offset);
		offset += 4;
		return {
			originalContent,
			pkcs7Signature: fileContent.slice(offset, offset + sigLength)
		};
	} catch {
		return { originalContent: fileContent };
	}
}
/**
* Verifies certificate chain against OS trust store
*/
async function verifyCertificateChain(certificate, intermediates) {
	let tempDir = null;
	try {
		tempDir = await (0, fs_promises.mkdtemp)((0, path.join)((0, os.tmpdir)(), "mcpb-verify-"));
		const certChainPath = (0, path.join)(tempDir, "chain.pem");
		await (0, fs_promises.writeFile)(certChainPath, [certificate, ...intermediates || []].join("\n"));
		if (process.platform === "darwin") try {
			await execFileAsync("security", [
				"verify-cert",
				"-c",
				certChainPath,
				"-p",
				"codeSign"
			]);
			return true;
		} catch (error) {
			return false;
		}
		else if (process.platform === "win32") {
			const { stdout } = await execFileAsync("powershell.exe", [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				`
        $ErrorActionPreference = 'Stop'
        $certCollection = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2Collection
        $certCollection.Import('${certChainPath}')
        
        if ($certCollection.Count -eq 0) {
          Write-Error 'No certificates found'
          exit 1
        }
        
        $leafCert = $certCollection[0]
        $chain = New-Object System.Security.Cryptography.X509Certificates.X509Chain
        
        # Enable revocation checking
        $chain.ChainPolicy.RevocationMode = 'Online'
        $chain.ChainPolicy.RevocationFlag = 'EntireChain'
        $chain.ChainPolicy.UrlRetrievalTimeout = New-TimeSpan -Seconds 30
        
        # Add code signing application policy
        $codeSignOid = New-Object System.Security.Cryptography.Oid '1.3.6.1.5.5.7.3.3'
        $chain.ChainPolicy.ApplicationPolicy.Add($codeSignOid)
        
        # Add intermediate certificates to extra store
        for ($i = 1; $i -lt $certCollection.Count; $i++) {
          [void]$chain.ChainPolicy.ExtraStore.Add($certCollection[$i])
        }
        
        # Build and validate chain
        $result = $chain.Build($leafCert)
        
        if ($result) { 
          'Valid' 
        } else { 
          $chain.ChainStatus | ForEach-Object { 
            Write-Error "$($_.Status): $($_.StatusInformation)"
          }
          exit 1 
        }
      `.trim()
			]);
			return stdout.includes("Valid");
		} else try {
			await execFileAsync("openssl", [
				"verify",
				"-purpose",
				"codesigning",
				"-CApath",
				"/etc/ssl/certs",
				certChainPath
			]);
			return true;
		} catch (error) {
			return false;
		}
	} catch (error) {
		return false;
	} finally {
		if (tempDir) try {
			await (0, fs_promises.rm)(tempDir, {
				recursive: true,
				force: true
			});
		} catch {}
	}
}
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/helpers/util.js
var util$1;
(function(util) {
	util.assertEqual = (_) => {};
	function assertIs(_arg) {}
	util.assertIs = assertIs;
	function assertNever(_x) {
		throw new Error();
	}
	util.assertNever = assertNever;
	util.arrayToEnum = (items) => {
		const obj = {};
		for (const item of items) obj[item] = item;
		return obj;
	};
	util.getValidEnumValues = (obj) => {
		const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
		const filtered = {};
		for (const k of validKeys) filtered[k] = obj[k];
		return util.objectValues(filtered);
	};
	util.objectValues = (obj) => {
		return util.objectKeys(obj).map(function(e) {
			return obj[e];
		});
	};
	util.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
		const keys = [];
		for (const key in object) if (Object.prototype.hasOwnProperty.call(object, key)) keys.push(key);
		return keys;
	};
	util.find = (arr, checker) => {
		for (const item of arr) if (checker(item)) return item;
	};
	util.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
	function joinValues(array, separator = " | ") {
		return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
	}
	util.joinValues = joinValues;
	util.jsonStringifyReplacer = (_, value) => {
		if (typeof value === "bigint") return value.toString();
		return value;
	};
})(util$1 || (util$1 = {}));
var objectUtil;
(function(objectUtil) {
	objectUtil.mergeShapes = (first, second) => {
		return {
			...first,
			...second
		};
	};
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util$1.arrayToEnum([
	"string",
	"nan",
	"number",
	"integer",
	"float",
	"boolean",
	"date",
	"bigint",
	"symbol",
	"function",
	"undefined",
	"null",
	"array",
	"object",
	"unknown",
	"promise",
	"void",
	"never",
	"map",
	"set"
]);
var getParsedType = (data) => {
	switch (typeof data) {
		case "undefined": return ZodParsedType.undefined;
		case "string": return ZodParsedType.string;
		case "number": return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
		case "boolean": return ZodParsedType.boolean;
		case "function": return ZodParsedType.function;
		case "bigint": return ZodParsedType.bigint;
		case "symbol": return ZodParsedType.symbol;
		case "object":
			if (Array.isArray(data)) return ZodParsedType.array;
			if (data === null) return ZodParsedType.null;
			if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") return ZodParsedType.promise;
			if (typeof Map !== "undefined" && data instanceof Map) return ZodParsedType.map;
			if (typeof Set !== "undefined" && data instanceof Set) return ZodParsedType.set;
			if (typeof Date !== "undefined" && data instanceof Date) return ZodParsedType.date;
			return ZodParsedType.object;
		default: return ZodParsedType.unknown;
	}
};
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/ZodError.js
var ZodIssueCode = util$1.arrayToEnum([
	"invalid_type",
	"invalid_literal",
	"custom",
	"invalid_union",
	"invalid_union_discriminator",
	"invalid_enum_value",
	"unrecognized_keys",
	"invalid_arguments",
	"invalid_return_type",
	"invalid_date",
	"invalid_string",
	"too_small",
	"too_big",
	"invalid_intersection_types",
	"not_multiple_of",
	"not_finite"
]);
var ZodError = class ZodError extends Error {
	get errors() {
		return this.issues;
	}
	constructor(issues) {
		super();
		this.issues = [];
		this.addIssue = (sub) => {
			this.issues = [...this.issues, sub];
		};
		this.addIssues = (subs = []) => {
			this.issues = [...this.issues, ...subs];
		};
		const actualProto = new.target.prototype;
		if (Object.setPrototypeOf) Object.setPrototypeOf(this, actualProto);
		else this.__proto__ = actualProto;
		this.name = "ZodError";
		this.issues = issues;
	}
	format(_mapper) {
		const mapper = _mapper || function(issue) {
			return issue.message;
		};
		const fieldErrors = { _errors: [] };
		const processError = (error) => {
			for (const issue of error.issues) if (issue.code === "invalid_union") issue.unionErrors.map(processError);
			else if (issue.code === "invalid_return_type") processError(issue.returnTypeError);
			else if (issue.code === "invalid_arguments") processError(issue.argumentsError);
			else if (issue.path.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < issue.path.length) {
					const el = issue.path[i];
					if (!(i === issue.path.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		};
		processError(this);
		return fieldErrors;
	}
	static assert(value) {
		if (!(value instanceof ZodError)) throw new Error(`Not a ZodError: ${value}`);
	}
	toString() {
		return this.message;
	}
	get message() {
		return JSON.stringify(this.issues, util$1.jsonStringifyReplacer, 2);
	}
	get isEmpty() {
		return this.issues.length === 0;
	}
	flatten(mapper = (issue) => issue.message) {
		const fieldErrors = {};
		const formErrors = [];
		for (const sub of this.issues) if (sub.path.length > 0) {
			const firstEl = sub.path[0];
			fieldErrors[firstEl] = fieldErrors[firstEl] || [];
			fieldErrors[firstEl].push(mapper(sub));
		} else formErrors.push(mapper(sub));
		return {
			formErrors,
			fieldErrors
		};
	}
	get formErrors() {
		return this.flatten();
	}
};
ZodError.create = (issues) => {
	return new ZodError(issues);
};
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
	let message;
	switch (issue.code) {
		case ZodIssueCode.invalid_type:
			if (issue.received === ZodParsedType.undefined) message = "Required";
			else message = `Expected ${issue.expected}, received ${issue.received}`;
			break;
		case ZodIssueCode.invalid_literal:
			message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util$1.jsonStringifyReplacer)}`;
			break;
		case ZodIssueCode.unrecognized_keys:
			message = `Unrecognized key(s) in object: ${util$1.joinValues(issue.keys, ", ")}`;
			break;
		case ZodIssueCode.invalid_union:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_union_discriminator:
			message = `Invalid discriminator value. Expected ${util$1.joinValues(issue.options)}`;
			break;
		case ZodIssueCode.invalid_enum_value:
			message = `Invalid enum value. Expected ${util$1.joinValues(issue.options)}, received '${issue.received}'`;
			break;
		case ZodIssueCode.invalid_arguments:
			message = `Invalid function arguments`;
			break;
		case ZodIssueCode.invalid_return_type:
			message = `Invalid function return type`;
			break;
		case ZodIssueCode.invalid_date:
			message = `Invalid date`;
			break;
		case ZodIssueCode.invalid_string:
			if (typeof issue.validation === "object") if ("includes" in issue.validation) {
				message = `Invalid input: must include "${issue.validation.includes}"`;
				if (typeof issue.validation.position === "number") message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
			} else if ("startsWith" in issue.validation) message = `Invalid input: must start with "${issue.validation.startsWith}"`;
			else if ("endsWith" in issue.validation) message = `Invalid input: must end with "${issue.validation.endsWith}"`;
			else util$1.assertNever(issue.validation);
			else if (issue.validation !== "regex") message = `Invalid ${issue.validation}`;
			else message = "Invalid";
			break;
		case ZodIssueCode.too_small:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "bigint") message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.too_big:
			if (issue.type === "array") message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
			else if (issue.type === "string") message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
			else if (issue.type === "number") message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "bigint") message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
			else if (issue.type === "date") message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
			else message = "Invalid input";
			break;
		case ZodIssueCode.custom:
			message = `Invalid input`;
			break;
		case ZodIssueCode.invalid_intersection_types:
			message = `Intersection results could not be merged`;
			break;
		case ZodIssueCode.not_multiple_of:
			message = `Number must be a multiple of ${issue.multipleOf}`;
			break;
		case ZodIssueCode.not_finite:
			message = "Number must be finite";
			break;
		default:
			message = _ctx.defaultError;
			util$1.assertNever(issue);
	}
	return { message };
};
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/errors.js
var overrideErrorMap = errorMap;
function getErrorMap() {
	return overrideErrorMap;
}
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
	const { data, path, errorMaps, issueData } = params;
	const fullPath = [...path, ...issueData.path || []];
	const fullIssue = {
		...issueData,
		path: fullPath
	};
	if (issueData.message !== void 0) return {
		...issueData,
		path: fullPath,
		message: issueData.message
	};
	let errorMessage = "";
	const maps = errorMaps.filter((m) => !!m).slice().reverse();
	for (const map of maps) errorMessage = map(fullIssue, {
		data,
		defaultError: errorMessage
	}).message;
	return {
		...issueData,
		path: fullPath,
		message: errorMessage
	};
};
function addIssueToContext(ctx, issueData) {
	const overrideMap = getErrorMap();
	const issue = makeIssue({
		issueData,
		data: ctx.data,
		path: ctx.path,
		errorMaps: [
			ctx.common.contextualErrorMap,
			ctx.schemaErrorMap,
			overrideMap,
			overrideMap === errorMap ? void 0 : errorMap
		].filter((x) => !!x)
	});
	ctx.common.issues.push(issue);
}
var ParseStatus = class ParseStatus {
	constructor() {
		this.value = "valid";
	}
	dirty() {
		if (this.value === "valid") this.value = "dirty";
	}
	abort() {
		if (this.value !== "aborted") this.value = "aborted";
	}
	static mergeArray(status, results) {
		const arrayValue = [];
		for (const s of results) {
			if (s.status === "aborted") return INVALID;
			if (s.status === "dirty") status.dirty();
			arrayValue.push(s.value);
		}
		return {
			status: status.value,
			value: arrayValue
		};
	}
	static async mergeObjectAsync(status, pairs) {
		const syncPairs = [];
		for (const pair of pairs) {
			const key = await pair.key;
			const value = await pair.value;
			syncPairs.push({
				key,
				value
			});
		}
		return ParseStatus.mergeObjectSync(status, syncPairs);
	}
	static mergeObjectSync(status, pairs) {
		const finalObject = {};
		for (const pair of pairs) {
			const { key, value } = pair;
			if (key.status === "aborted") return INVALID;
			if (value.status === "aborted") return INVALID;
			if (key.status === "dirty") status.dirty();
			if (value.status === "dirty") status.dirty();
			if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) finalObject[key.value] = value.value;
		}
		return {
			status: status.value,
			value: finalObject
		};
	}
};
var INVALID = Object.freeze({ status: "aborted" });
var DIRTY = (value) => ({
	status: "dirty",
	value
});
var OK = (value) => ({
	status: "valid",
	value
});
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil) {
	errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
	errorUtil.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));
//#endregion
//#region node_modules/@anthropic-ai/mcpb/node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
	constructor(parent, value, path, key) {
		this._cachedPath = [];
		this.parent = parent;
		this.data = value;
		this._path = path;
		this._key = key;
	}
	get path() {
		if (!this._cachedPath.length) if (Array.isArray(this._key)) this._cachedPath.push(...this._path, ...this._key);
		else this._cachedPath.push(...this._path, this._key);
		return this._cachedPath;
	}
};
var handleResult = (ctx, result) => {
	if (isValid(result)) return {
		success: true,
		data: result.value
	};
	else {
		if (!ctx.common.issues.length) throw new Error("Validation failed but no issues detected.");
		return {
			success: false,
			get error() {
				if (this._error) return this._error;
				const error = new ZodError(ctx.common.issues);
				this._error = error;
				return this._error;
			}
		};
	}
};
function processCreateParams(params) {
	if (!params) return {};
	const { errorMap, invalid_type_error, required_error, description } = params;
	if (errorMap && (invalid_type_error || required_error)) throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
	if (errorMap) return {
		errorMap,
		description
	};
	const customMap = (iss, ctx) => {
		const { message } = params;
		if (iss.code === "invalid_enum_value") return { message: message ?? ctx.defaultError };
		if (typeof ctx.data === "undefined") return { message: message ?? required_error ?? ctx.defaultError };
		if (iss.code !== "invalid_type") return { message: ctx.defaultError };
		return { message: message ?? invalid_type_error ?? ctx.defaultError };
	};
	return {
		errorMap: customMap,
		description
	};
}
var ZodType = class {
	get description() {
		return this._def.description;
	}
	_getType(input) {
		return getParsedType(input.data);
	}
	_getOrReturnCtx(input, ctx) {
		return ctx || {
			common: input.parent.common,
			data: input.data,
			parsedType: getParsedType(input.data),
			schemaErrorMap: this._def.errorMap,
			path: input.path,
			parent: input.parent
		};
	}
	_processInputParams(input) {
		return {
			status: new ParseStatus(),
			ctx: {
				common: input.parent.common,
				data: input.data,
				parsedType: getParsedType(input.data),
				schemaErrorMap: this._def.errorMap,
				path: input.path,
				parent: input.parent
			}
		};
	}
	_parseSync(input) {
		const result = this._parse(input);
		if (isAsync(result)) throw new Error("Synchronous parse encountered promise.");
		return result;
	}
	_parseAsync(input) {
		const result = this._parse(input);
		return Promise.resolve(result);
	}
	parse(data, params) {
		const result = this.safeParse(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	safeParse(data, params) {
		const ctx = {
			common: {
				issues: [],
				async: params?.async ?? false,
				contextualErrorMap: params?.errorMap
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		return handleResult(ctx, this._parseSync({
			data,
			path: ctx.path,
			parent: ctx
		}));
	}
	"~validate"(data) {
		const ctx = {
			common: {
				issues: [],
				async: !!this["~standard"].async
			},
			path: [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		if (!this["~standard"].async) try {
			const result = this._parseSync({
				data,
				path: [],
				parent: ctx
			});
			return isValid(result) ? { value: result.value } : { issues: ctx.common.issues };
		} catch (err) {
			if (err?.message?.toLowerCase()?.includes("encountered")) this["~standard"].async = true;
			ctx.common = {
				issues: [],
				async: true
			};
		}
		return this._parseAsync({
			data,
			path: [],
			parent: ctx
		}).then((result) => isValid(result) ? { value: result.value } : { issues: ctx.common.issues });
	}
	async parseAsync(data, params) {
		const result = await this.safeParseAsync(data, params);
		if (result.success) return result.data;
		throw result.error;
	}
	async safeParseAsync(data, params) {
		const ctx = {
			common: {
				issues: [],
				contextualErrorMap: params?.errorMap,
				async: true
			},
			path: params?.path || [],
			schemaErrorMap: this._def.errorMap,
			parent: null,
			data,
			parsedType: getParsedType(data)
		};
		const maybeAsyncResult = this._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
		return handleResult(ctx, await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult)));
	}
	refine(check, message) {
		const getIssueProperties = (val) => {
			if (typeof message === "string" || typeof message === "undefined") return { message };
			else if (typeof message === "function") return message(val);
			else return message;
		};
		return this._refinement((val, ctx) => {
			const result = check(val);
			const setError = () => ctx.addIssue({
				code: ZodIssueCode.custom,
				...getIssueProperties(val)
			});
			if (typeof Promise !== "undefined" && result instanceof Promise) return result.then((data) => {
				if (!data) {
					setError();
					return false;
				} else return true;
			});
			if (!result) {
				setError();
				return false;
			} else return true;
		});
	}
	refinement(check, refinementData) {
		return this._refinement((val, ctx) => {
			if (!check(val)) {
				ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
				return false;
			} else return true;
		});
	}
	_refinement(refinement) {
		return new ZodEffects({
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "refinement",
				refinement
			}
		});
	}
	superRefine(refinement) {
		return this._refinement(refinement);
	}
	constructor(def) {
		/** Alias of safeParseAsync */
		this.spa = this.safeParseAsync;
		this._def = def;
		this.parse = this.parse.bind(this);
		this.safeParse = this.safeParse.bind(this);
		this.parseAsync = this.parseAsync.bind(this);
		this.safeParseAsync = this.safeParseAsync.bind(this);
		this.spa = this.spa.bind(this);
		this.refine = this.refine.bind(this);
		this.refinement = this.refinement.bind(this);
		this.superRefine = this.superRefine.bind(this);
		this.optional = this.optional.bind(this);
		this.nullable = this.nullable.bind(this);
		this.nullish = this.nullish.bind(this);
		this.array = this.array.bind(this);
		this.promise = this.promise.bind(this);
		this.or = this.or.bind(this);
		this.and = this.and.bind(this);
		this.transform = this.transform.bind(this);
		this.brand = this.brand.bind(this);
		this.default = this.default.bind(this);
		this.catch = this.catch.bind(this);
		this.describe = this.describe.bind(this);
		this.pipe = this.pipe.bind(this);
		this.readonly = this.readonly.bind(this);
		this.isNullable = this.isNullable.bind(this);
		this.isOptional = this.isOptional.bind(this);
		this["~standard"] = {
			version: 1,
			vendor: "zod",
			validate: (data) => this["~validate"](data)
		};
	}
	optional() {
		return ZodOptional.create(this, this._def);
	}
	nullable() {
		return ZodNullable.create(this, this._def);
	}
	nullish() {
		return this.nullable().optional();
	}
	array() {
		return ZodArray.create(this);
	}
	promise() {
		return ZodPromise.create(this, this._def);
	}
	or(option) {
		return ZodUnion.create([this, option], this._def);
	}
	and(incoming) {
		return ZodIntersection.create(this, incoming, this._def);
	}
	transform(transform) {
		return new ZodEffects({
			...processCreateParams(this._def),
			schema: this,
			typeName: ZodFirstPartyTypeKind.ZodEffects,
			effect: {
				type: "transform",
				transform
			}
		});
	}
	default(def) {
		const defaultValueFunc = typeof def === "function" ? def : () => def;
		return new ZodDefault({
			...processCreateParams(this._def),
			innerType: this,
			defaultValue: defaultValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodDefault
		});
	}
	brand() {
		return new ZodBranded({
			typeName: ZodFirstPartyTypeKind.ZodBranded,
			type: this,
			...processCreateParams(this._def)
		});
	}
	catch(def) {
		const catchValueFunc = typeof def === "function" ? def : () => def;
		return new ZodCatch({
			...processCreateParams(this._def),
			innerType: this,
			catchValue: catchValueFunc,
			typeName: ZodFirstPartyTypeKind.ZodCatch
		});
	}
	describe(description) {
		const This = this.constructor;
		return new This({
			...this._def,
			description
		});
	}
	pipe(target) {
		return ZodPipeline.create(this, target);
	}
	readonly() {
		return ZodReadonly.create(this);
	}
	isOptional() {
		return this.safeParse(void 0).success;
	}
	isNullable() {
		return this.safeParse(null).success;
	}
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
	let secondsRegexSource = `[0-5]\\d`;
	if (args.precision) secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
	else if (args.precision == null) secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
	const secondsQuantifier = args.precision ? "+" : "?";
	return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
	return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
	let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
	const opts = [];
	opts.push(args.local ? `Z?` : `Z`);
	if (args.offset) opts.push(`([+-]\\d{2}:?\\d{2})`);
	regex = `${regex}(${opts.join("|")})`;
	return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
	if ((version === "v4" || !version) && ipv4Regex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6Regex.test(ip)) return true;
	return false;
}
function isValidJWT(jwt, alg) {
	if (!jwtRegex.test(jwt)) return false;
	try {
		const [header] = jwt.split(".");
		if (!header) return false;
		const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
		const decoded = JSON.parse(atob(base64));
		if (typeof decoded !== "object" || decoded === null) return false;
		if ("typ" in decoded && decoded?.typ !== "JWT") return false;
		if (!decoded.alg) return false;
		if (alg && decoded.alg !== alg) return false;
		return true;
	} catch {
		return false;
	}
}
function isValidCidr(ip, version) {
	if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) return true;
	if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) return true;
	return false;
}
var ZodString = class ZodString extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = String(input.data);
		if (this._getType(input) !== ZodParsedType.string) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.string,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.length < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.length > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "length") {
			const tooBig = input.data.length > check.value;
			const tooSmall = input.data.length < check.value;
			if (tooBig || tooSmall) {
				ctx = this._getOrReturnCtx(input, ctx);
				if (tooBig) addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				else if (tooSmall) addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "string",
					inclusive: true,
					exact: true,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "email") {
			if (!emailRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "email",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "emoji") {
			if (!emojiRegex) emojiRegex = new RegExp(_emojiRegex, "u");
			if (!emojiRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "emoji",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "uuid") {
			if (!uuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "uuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "nanoid") {
			if (!nanoidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "nanoid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid") {
			if (!cuidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cuid2") {
			if (!cuid2Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cuid2",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ulid") {
			if (!ulidRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ulid",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "url") try {
			new URL(input.data);
		} catch {
			ctx = this._getOrReturnCtx(input, ctx);
			addIssueToContext(ctx, {
				validation: "url",
				code: ZodIssueCode.invalid_string,
				message: check.message
			});
			status.dirty();
		}
		else if (check.kind === "regex") {
			check.regex.lastIndex = 0;
			if (!check.regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "regex",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "trim") input.data = input.data.trim();
		else if (check.kind === "includes") {
			if (!input.data.includes(check.value, check.position)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: {
						includes: check.value,
						position: check.position
					},
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "toLowerCase") input.data = input.data.toLowerCase();
		else if (check.kind === "toUpperCase") input.data = input.data.toUpperCase();
		else if (check.kind === "startsWith") {
			if (!input.data.startsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { startsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "endsWith") {
			if (!input.data.endsWith(check.value)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: { endsWith: check.value },
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "datetime") {
			if (!datetimeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "datetime",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "date") {
			if (!dateRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "date",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "time") {
			if (!timeRegex(check).test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_string,
					validation: "time",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "duration") {
			if (!durationRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "duration",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "ip") {
			if (!isValidIP(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "ip",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "jwt") {
			if (!isValidJWT(input.data, check.alg)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "jwt",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "cidr") {
			if (!isValidCidr(input.data, check.version)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "cidr",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64") {
			if (!base64Regex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "base64url") {
			if (!base64urlRegex.test(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					validation: "base64url",
					code: ZodIssueCode.invalid_string,
					message: check.message
				});
				status.dirty();
			}
		} else util$1.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_regex(regex, validation, message) {
		return this.refinement((data) => regex.test(data), {
			validation,
			code: ZodIssueCode.invalid_string,
			...errorUtil.errToObj(message)
		});
	}
	_addCheck(check) {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	email(message) {
		return this._addCheck({
			kind: "email",
			...errorUtil.errToObj(message)
		});
	}
	url(message) {
		return this._addCheck({
			kind: "url",
			...errorUtil.errToObj(message)
		});
	}
	emoji(message) {
		return this._addCheck({
			kind: "emoji",
			...errorUtil.errToObj(message)
		});
	}
	uuid(message) {
		return this._addCheck({
			kind: "uuid",
			...errorUtil.errToObj(message)
		});
	}
	nanoid(message) {
		return this._addCheck({
			kind: "nanoid",
			...errorUtil.errToObj(message)
		});
	}
	cuid(message) {
		return this._addCheck({
			kind: "cuid",
			...errorUtil.errToObj(message)
		});
	}
	cuid2(message) {
		return this._addCheck({
			kind: "cuid2",
			...errorUtil.errToObj(message)
		});
	}
	ulid(message) {
		return this._addCheck({
			kind: "ulid",
			...errorUtil.errToObj(message)
		});
	}
	base64(message) {
		return this._addCheck({
			kind: "base64",
			...errorUtil.errToObj(message)
		});
	}
	base64url(message) {
		return this._addCheck({
			kind: "base64url",
			...errorUtil.errToObj(message)
		});
	}
	jwt(options) {
		return this._addCheck({
			kind: "jwt",
			...errorUtil.errToObj(options)
		});
	}
	ip(options) {
		return this._addCheck({
			kind: "ip",
			...errorUtil.errToObj(options)
		});
	}
	cidr(options) {
		return this._addCheck({
			kind: "cidr",
			...errorUtil.errToObj(options)
		});
	}
	datetime(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "datetime",
			precision: null,
			offset: false,
			local: false,
			message: options
		});
		return this._addCheck({
			kind: "datetime",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			offset: options?.offset ?? false,
			local: options?.local ?? false,
			...errorUtil.errToObj(options?.message)
		});
	}
	date(message) {
		return this._addCheck({
			kind: "date",
			message
		});
	}
	time(options) {
		if (typeof options === "string") return this._addCheck({
			kind: "time",
			precision: null,
			message: options
		});
		return this._addCheck({
			kind: "time",
			precision: typeof options?.precision === "undefined" ? null : options?.precision,
			...errorUtil.errToObj(options?.message)
		});
	}
	duration(message) {
		return this._addCheck({
			kind: "duration",
			...errorUtil.errToObj(message)
		});
	}
	regex(regex, message) {
		return this._addCheck({
			kind: "regex",
			regex,
			...errorUtil.errToObj(message)
		});
	}
	includes(value, options) {
		return this._addCheck({
			kind: "includes",
			value,
			position: options?.position,
			...errorUtil.errToObj(options?.message)
		});
	}
	startsWith(value, message) {
		return this._addCheck({
			kind: "startsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	endsWith(value, message) {
		return this._addCheck({
			kind: "endsWith",
			value,
			...errorUtil.errToObj(message)
		});
	}
	min(minLength, message) {
		return this._addCheck({
			kind: "min",
			value: minLength,
			...errorUtil.errToObj(message)
		});
	}
	max(maxLength, message) {
		return this._addCheck({
			kind: "max",
			value: maxLength,
			...errorUtil.errToObj(message)
		});
	}
	length(len, message) {
		return this._addCheck({
			kind: "length",
			value: len,
			...errorUtil.errToObj(message)
		});
	}
	/**
	* Equivalent to `.min(1)`
	*/
	nonempty(message) {
		return this.min(1, errorUtil.errToObj(message));
	}
	trim() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "trim" }]
		});
	}
	toLowerCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toLowerCase" }]
		});
	}
	toUpperCase() {
		return new ZodString({
			...this._def,
			checks: [...this._def.checks, { kind: "toUpperCase" }]
		});
	}
	get isDatetime() {
		return !!this._def.checks.find((ch) => ch.kind === "datetime");
	}
	get isDate() {
		return !!this._def.checks.find((ch) => ch.kind === "date");
	}
	get isTime() {
		return !!this._def.checks.find((ch) => ch.kind === "time");
	}
	get isDuration() {
		return !!this._def.checks.find((ch) => ch.kind === "duration");
	}
	get isEmail() {
		return !!this._def.checks.find((ch) => ch.kind === "email");
	}
	get isURL() {
		return !!this._def.checks.find((ch) => ch.kind === "url");
	}
	get isEmoji() {
		return !!this._def.checks.find((ch) => ch.kind === "emoji");
	}
	get isUUID() {
		return !!this._def.checks.find((ch) => ch.kind === "uuid");
	}
	get isNANOID() {
		return !!this._def.checks.find((ch) => ch.kind === "nanoid");
	}
	get isCUID() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid");
	}
	get isCUID2() {
		return !!this._def.checks.find((ch) => ch.kind === "cuid2");
	}
	get isULID() {
		return !!this._def.checks.find((ch) => ch.kind === "ulid");
	}
	get isIP() {
		return !!this._def.checks.find((ch) => ch.kind === "ip");
	}
	get isCIDR() {
		return !!this._def.checks.find((ch) => ch.kind === "cidr");
	}
	get isBase64() {
		return !!this._def.checks.find((ch) => ch.kind === "base64");
	}
	get isBase64url() {
		return !!this._def.checks.find((ch) => ch.kind === "base64url");
	}
	get minLength() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxLength() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodString.create = (params) => {
	return new ZodString({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodString,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
function floatSafeRemainder(val, step) {
	const valDecCount = (val.toString().split(".")[1] || "").length;
	const stepDecCount = (step.toString().split(".")[1] || "").length;
	const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
	return Number.parseInt(val.toFixed(decCount).replace(".", "")) % Number.parseInt(step.toFixed(decCount).replace(".", "")) / 10 ** decCount;
}
var ZodNumber = class ZodNumber extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
		this.step = this.multipleOf;
	}
	_parse(input) {
		if (this._def.coerce) input.data = Number(input.data);
		if (this._getType(input) !== ZodParsedType.number) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.number,
				received: ctx.parsedType
			});
			return INVALID;
		}
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "int") {
			if (!util$1.isInteger(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.invalid_type,
					expected: "integer",
					received: "float",
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: check.value,
					type: "number",
					inclusive: check.inclusive,
					exact: false,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (floatSafeRemainder(input.data, check.value) !== 0) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "finite") {
			if (!Number.isFinite(input.data)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_finite,
					message: check.message
				});
				status.dirty();
			}
		} else util$1.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodNumber({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	int(message) {
		return this._addCheck({
			kind: "int",
			message: errorUtil.toString(message)
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: 0,
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	finite(message) {
		return this._addCheck({
			kind: "finite",
			message: errorUtil.toString(message)
		});
	}
	safe(message) {
		return this._addCheck({
			kind: "min",
			inclusive: true,
			value: Number.MIN_SAFE_INTEGER,
			message: errorUtil.toString(message)
		})._addCheck({
			kind: "max",
			inclusive: true,
			value: Number.MAX_SAFE_INTEGER,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
	get isInt() {
		return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util$1.isInteger(ch.value));
	}
	get isFinite() {
		let max = null;
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") return true;
		else if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		} else if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return Number.isFinite(min) && Number.isFinite(max);
	}
};
ZodNumber.create = (params) => {
	return new ZodNumber({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodNumber,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodBigInt = class ZodBigInt extends ZodType {
	constructor() {
		super(...arguments);
		this.min = this.gte;
		this.max = this.lte;
	}
	_parse(input) {
		if (this._def.coerce) try {
			input.data = BigInt(input.data);
		} catch {
			return this._getInvalidInput(input);
		}
		if (this._getType(input) !== ZodParsedType.bigint) return this._getInvalidInput(input);
		let ctx = void 0;
		const status = new ParseStatus();
		for (const check of this._def.checks) if (check.kind === "min") {
			if (check.inclusive ? input.data < check.value : input.data <= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					type: "bigint",
					minimum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (check.inclusive ? input.data > check.value : input.data >= check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					type: "bigint",
					maximum: check.value,
					inclusive: check.inclusive,
					message: check.message
				});
				status.dirty();
			}
		} else if (check.kind === "multipleOf") {
			if (input.data % check.value !== BigInt(0)) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.not_multiple_of,
					multipleOf: check.value,
					message: check.message
				});
				status.dirty();
			}
		} else util$1.assertNever(check);
		return {
			status: status.value,
			value: input.data
		};
	}
	_getInvalidInput(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.bigint,
			received: ctx.parsedType
		});
		return INVALID;
	}
	gte(value, message) {
		return this.setLimit("min", value, true, errorUtil.toString(message));
	}
	gt(value, message) {
		return this.setLimit("min", value, false, errorUtil.toString(message));
	}
	lte(value, message) {
		return this.setLimit("max", value, true, errorUtil.toString(message));
	}
	lt(value, message) {
		return this.setLimit("max", value, false, errorUtil.toString(message));
	}
	setLimit(kind, value, inclusive, message) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, {
				kind,
				value,
				inclusive,
				message: errorUtil.toString(message)
			}]
		});
	}
	_addCheck(check) {
		return new ZodBigInt({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	positive(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	negative(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: false,
			message: errorUtil.toString(message)
		});
	}
	nonpositive(message) {
		return this._addCheck({
			kind: "max",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	nonnegative(message) {
		return this._addCheck({
			kind: "min",
			value: BigInt(0),
			inclusive: true,
			message: errorUtil.toString(message)
		});
	}
	multipleOf(value, message) {
		return this._addCheck({
			kind: "multipleOf",
			value,
			message: errorUtil.toString(message)
		});
	}
	get minValue() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min;
	}
	get maxValue() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max;
	}
};
ZodBigInt.create = (params) => {
	return new ZodBigInt({
		checks: [],
		typeName: ZodFirstPartyTypeKind.ZodBigInt,
		coerce: params?.coerce ?? false,
		...processCreateParams(params)
	});
};
var ZodBoolean = class extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = Boolean(input.data);
		if (this._getType(input) !== ZodParsedType.boolean) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.boolean,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodBoolean.create = (params) => {
	return new ZodBoolean({
		typeName: ZodFirstPartyTypeKind.ZodBoolean,
		coerce: params?.coerce || false,
		...processCreateParams(params)
	});
};
var ZodDate = class ZodDate extends ZodType {
	_parse(input) {
		if (this._def.coerce) input.data = new Date(input.data);
		if (this._getType(input) !== ZodParsedType.date) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.date,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (Number.isNaN(input.data.getTime())) {
			addIssueToContext(this._getOrReturnCtx(input), { code: ZodIssueCode.invalid_date });
			return INVALID;
		}
		const status = new ParseStatus();
		let ctx = void 0;
		for (const check of this._def.checks) if (check.kind === "min") {
			if (input.data.getTime() < check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					message: check.message,
					inclusive: true,
					exact: false,
					minimum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else if (check.kind === "max") {
			if (input.data.getTime() > check.value) {
				ctx = this._getOrReturnCtx(input, ctx);
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					message: check.message,
					inclusive: true,
					exact: false,
					maximum: check.value,
					type: "date"
				});
				status.dirty();
			}
		} else util$1.assertNever(check);
		return {
			status: status.value,
			value: new Date(input.data.getTime())
		};
	}
	_addCheck(check) {
		return new ZodDate({
			...this._def,
			checks: [...this._def.checks, check]
		});
	}
	min(minDate, message) {
		return this._addCheck({
			kind: "min",
			value: minDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	max(maxDate, message) {
		return this._addCheck({
			kind: "max",
			value: maxDate.getTime(),
			message: errorUtil.toString(message)
		});
	}
	get minDate() {
		let min = null;
		for (const ch of this._def.checks) if (ch.kind === "min") {
			if (min === null || ch.value > min) min = ch.value;
		}
		return min != null ? new Date(min) : null;
	}
	get maxDate() {
		let max = null;
		for (const ch of this._def.checks) if (ch.kind === "max") {
			if (max === null || ch.value < max) max = ch.value;
		}
		return max != null ? new Date(max) : null;
	}
};
ZodDate.create = (params) => {
	return new ZodDate({
		checks: [],
		coerce: params?.coerce || false,
		typeName: ZodFirstPartyTypeKind.ZodDate,
		...processCreateParams(params)
	});
};
var ZodSymbol = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.symbol) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.symbol,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodSymbol.create = (params) => {
	return new ZodSymbol({
		typeName: ZodFirstPartyTypeKind.ZodSymbol,
		...processCreateParams(params)
	});
};
var ZodUndefined = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.undefined,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodUndefined.create = (params) => {
	return new ZodUndefined({
		typeName: ZodFirstPartyTypeKind.ZodUndefined,
		...processCreateParams(params)
	});
};
var ZodNull = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.null) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.null,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodNull.create = (params) => {
	return new ZodNull({
		typeName: ZodFirstPartyTypeKind.ZodNull,
		...processCreateParams(params)
	});
};
var ZodAny = class extends ZodType {
	constructor() {
		super(...arguments);
		this._any = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodAny.create = (params) => {
	return new ZodAny({
		typeName: ZodFirstPartyTypeKind.ZodAny,
		...processCreateParams(params)
	});
};
var ZodUnknown = class extends ZodType {
	constructor() {
		super(...arguments);
		this._unknown = true;
	}
	_parse(input) {
		return OK(input.data);
	}
};
ZodUnknown.create = (params) => {
	return new ZodUnknown({
		typeName: ZodFirstPartyTypeKind.ZodUnknown,
		...processCreateParams(params)
	});
};
var ZodNever = class extends ZodType {
	_parse(input) {
		const ctx = this._getOrReturnCtx(input);
		addIssueToContext(ctx, {
			code: ZodIssueCode.invalid_type,
			expected: ZodParsedType.never,
			received: ctx.parsedType
		});
		return INVALID;
	}
};
ZodNever.create = (params) => {
	return new ZodNever({
		typeName: ZodFirstPartyTypeKind.ZodNever,
		...processCreateParams(params)
	});
};
var ZodVoid = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.undefined) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.void,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK(input.data);
	}
};
ZodVoid.create = (params) => {
	return new ZodVoid({
		typeName: ZodFirstPartyTypeKind.ZodVoid,
		...processCreateParams(params)
	});
};
var ZodArray = class ZodArray extends ZodType {
	_parse(input) {
		const { ctx, status } = this._processInputParams(input);
		const def = this._def;
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (def.exactLength !== null) {
			const tooBig = ctx.data.length > def.exactLength.value;
			const tooSmall = ctx.data.length < def.exactLength.value;
			if (tooBig || tooSmall) {
				addIssueToContext(ctx, {
					code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
					minimum: tooSmall ? def.exactLength.value : void 0,
					maximum: tooBig ? def.exactLength.value : void 0,
					type: "array",
					inclusive: true,
					exact: true,
					message: def.exactLength.message
				});
				status.dirty();
			}
		}
		if (def.minLength !== null) {
			if (ctx.data.length < def.minLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.minLength.message
				});
				status.dirty();
			}
		}
		if (def.maxLength !== null) {
			if (ctx.data.length > def.maxLength.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxLength.value,
					type: "array",
					inclusive: true,
					exact: false,
					message: def.maxLength.message
				});
				status.dirty();
			}
		}
		if (ctx.common.async) return Promise.all([...ctx.data].map((item, i) => {
			return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		})).then((result) => {
			return ParseStatus.mergeArray(status, result);
		});
		const result = [...ctx.data].map((item, i) => {
			return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
		});
		return ParseStatus.mergeArray(status, result);
	}
	get element() {
		return this._def.type;
	}
	min(minLength, message) {
		return new ZodArray({
			...this._def,
			minLength: {
				value: minLength,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxLength, message) {
		return new ZodArray({
			...this._def,
			maxLength: {
				value: maxLength,
				message: errorUtil.toString(message)
			}
		});
	}
	length(len, message) {
		return new ZodArray({
			...this._def,
			exactLength: {
				value: len,
				message: errorUtil.toString(message)
			}
		});
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodArray.create = (schema, params) => {
	return new ZodArray({
		type: schema,
		minLength: null,
		maxLength: null,
		exactLength: null,
		typeName: ZodFirstPartyTypeKind.ZodArray,
		...processCreateParams(params)
	});
};
function deepPartialify(schema) {
	if (schema instanceof ZodObject) {
		const newShape = {};
		for (const key in schema.shape) {
			const fieldSchema = schema.shape[key];
			newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
		}
		return new ZodObject({
			...schema._def,
			shape: () => newShape
		});
	} else if (schema instanceof ZodArray) return new ZodArray({
		...schema._def,
		type: deepPartialify(schema.element)
	});
	else if (schema instanceof ZodOptional) return ZodOptional.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodNullable) return ZodNullable.create(deepPartialify(schema.unwrap()));
	else if (schema instanceof ZodTuple) return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
	else return schema;
}
var ZodObject = class ZodObject extends ZodType {
	constructor() {
		super(...arguments);
		this._cached = null;
		/**
		* @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
		* If you want to pass through unknown properties, use `.passthrough()` instead.
		*/
		this.nonstrict = this.passthrough;
		/**
		* @deprecated Use `.extend` instead
		*  */
		this.augment = this.extend;
	}
	_getCached() {
		if (this._cached !== null) return this._cached;
		const shape = this._def.shape();
		const keys = util$1.objectKeys(shape);
		this._cached = {
			shape,
			keys
		};
		return this._cached;
	}
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.object) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const { status, ctx } = this._processInputParams(input);
		const { shape, keys: shapeKeys } = this._getCached();
		const extraKeys = [];
		if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
			for (const key in ctx.data) if (!shapeKeys.includes(key)) extraKeys.push(key);
		}
		const pairs = [];
		for (const key of shapeKeys) {
			const keyValidator = shape[key];
			const value = ctx.data[key];
			pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
				alwaysSet: key in ctx.data
			});
		}
		if (this._def.catchall instanceof ZodNever) {
			const unknownKeys = this._def.unknownKeys;
			if (unknownKeys === "passthrough") for (const key of extraKeys) pairs.push({
				key: {
					status: "valid",
					value: key
				},
				value: {
					status: "valid",
					value: ctx.data[key]
				}
			});
			else if (unknownKeys === "strict") {
				if (extraKeys.length > 0) {
					addIssueToContext(ctx, {
						code: ZodIssueCode.unrecognized_keys,
						keys: extraKeys
					});
					status.dirty();
				}
			} else if (unknownKeys === "strip") {} else throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
		} else {
			const catchall = this._def.catchall;
			for (const key of extraKeys) {
				const value = ctx.data[key];
				pairs.push({
					key: {
						status: "valid",
						value: key
					},
					value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
					alwaysSet: key in ctx.data
				});
			}
		}
		if (ctx.common.async) return Promise.resolve().then(async () => {
			const syncPairs = [];
			for (const pair of pairs) {
				const key = await pair.key;
				const value = await pair.value;
				syncPairs.push({
					key,
					value,
					alwaysSet: pair.alwaysSet
				});
			}
			return syncPairs;
		}).then((syncPairs) => {
			return ParseStatus.mergeObjectSync(status, syncPairs);
		});
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get shape() {
		return this._def.shape();
	}
	strict(message) {
		errorUtil.errToObj;
		return new ZodObject({
			...this._def,
			unknownKeys: "strict",
			...message !== void 0 ? { errorMap: (issue, ctx) => {
				const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
				if (issue.code === "unrecognized_keys") return { message: errorUtil.errToObj(message).message ?? defaultError };
				return { message: defaultError };
			} } : {}
		});
	}
	strip() {
		return new ZodObject({
			...this._def,
			unknownKeys: "strip"
		});
	}
	passthrough() {
		return new ZodObject({
			...this._def,
			unknownKeys: "passthrough"
		});
	}
	extend(augmentation) {
		return new ZodObject({
			...this._def,
			shape: () => ({
				...this._def.shape(),
				...augmentation
			})
		});
	}
	/**
	* Prior to zod@1.0.12 there was a bug in the
	* inferred type of merged objects. Please
	* upgrade if you are experiencing issues.
	*/
	merge(merging) {
		return new ZodObject({
			unknownKeys: merging._def.unknownKeys,
			catchall: merging._def.catchall,
			shape: () => ({
				...this._def.shape(),
				...merging._def.shape()
			}),
			typeName: ZodFirstPartyTypeKind.ZodObject
		});
	}
	setKey(key, schema) {
		return this.augment({ [key]: schema });
	}
	catchall(index) {
		return new ZodObject({
			...this._def,
			catchall: index
		});
	}
	pick(mask) {
		const shape = {};
		for (const key of util$1.objectKeys(mask)) if (mask[key] && this.shape[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	omit(mask) {
		const shape = {};
		for (const key of util$1.objectKeys(this.shape)) if (!mask[key]) shape[key] = this.shape[key];
		return new ZodObject({
			...this._def,
			shape: () => shape
		});
	}
	/**
	* @deprecated
	*/
	deepPartial() {
		return deepPartialify(this);
	}
	partial(mask) {
		const newShape = {};
		for (const key of util$1.objectKeys(this.shape)) {
			const fieldSchema = this.shape[key];
			if (mask && !mask[key]) newShape[key] = fieldSchema;
			else newShape[key] = fieldSchema.optional();
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	required(mask) {
		const newShape = {};
		for (const key of util$1.objectKeys(this.shape)) if (mask && !mask[key]) newShape[key] = this.shape[key];
		else {
			let newField = this.shape[key];
			while (newField instanceof ZodOptional) newField = newField._def.innerType;
			newShape[key] = newField;
		}
		return new ZodObject({
			...this._def,
			shape: () => newShape
		});
	}
	keyof() {
		return createZodEnum(util$1.objectKeys(this.shape));
	}
};
ZodObject.create = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.strictCreate = (shape, params) => {
	return new ZodObject({
		shape: () => shape,
		unknownKeys: "strict",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate = (shape, params) => {
	return new ZodObject({
		shape,
		unknownKeys: "strip",
		catchall: ZodNever.create(),
		typeName: ZodFirstPartyTypeKind.ZodObject,
		...processCreateParams(params)
	});
};
var ZodUnion = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const options = this._def.options;
		function handleResults(results) {
			for (const result of results) if (result.result.status === "valid") return result.result;
			for (const result of results) if (result.result.status === "dirty") {
				ctx.common.issues.push(...result.ctx.common.issues);
				return result.result;
			}
			const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
		if (ctx.common.async) return Promise.all(options.map(async (option) => {
			const childCtx = {
				...ctx,
				common: {
					...ctx.common,
					issues: []
				},
				parent: null
			};
			return {
				result: await option._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				}),
				ctx: childCtx
			};
		})).then(handleResults);
		else {
			let dirty = void 0;
			const issues = [];
			for (const option of options) {
				const childCtx = {
					...ctx,
					common: {
						...ctx.common,
						issues: []
					},
					parent: null
				};
				const result = option._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: childCtx
				});
				if (result.status === "valid") return result;
				else if (result.status === "dirty" && !dirty) dirty = {
					result,
					ctx: childCtx
				};
				if (childCtx.common.issues.length) issues.push(childCtx.common.issues);
			}
			if (dirty) {
				ctx.common.issues.push(...dirty.ctx.common.issues);
				return dirty.result;
			}
			const unionErrors = issues.map((issues) => new ZodError(issues));
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union,
				unionErrors
			});
			return INVALID;
		}
	}
	get options() {
		return this._def.options;
	}
};
ZodUnion.create = (types, params) => {
	return new ZodUnion({
		options: types,
		typeName: ZodFirstPartyTypeKind.ZodUnion,
		...processCreateParams(params)
	});
};
var getDiscriminator = (type) => {
	if (type instanceof ZodLazy) return getDiscriminator(type.schema);
	else if (type instanceof ZodEffects) return getDiscriminator(type.innerType());
	else if (type instanceof ZodLiteral) return [type.value];
	else if (type instanceof ZodEnum) return type.options;
	else if (type instanceof ZodNativeEnum) return util$1.objectValues(type.enum);
	else if (type instanceof ZodDefault) return getDiscriminator(type._def.innerType);
	else if (type instanceof ZodUndefined) return [void 0];
	else if (type instanceof ZodNull) return [null];
	else if (type instanceof ZodOptional) return [void 0, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodNullable) return [null, ...getDiscriminator(type.unwrap())];
	else if (type instanceof ZodBranded) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodReadonly) return getDiscriminator(type.unwrap());
	else if (type instanceof ZodCatch) return getDiscriminator(type._def.innerType);
	else return [];
};
var ZodDiscriminatedUnion = class ZodDiscriminatedUnion extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const discriminator = this.discriminator;
		const discriminatorValue = ctx.data[discriminator];
		const option = this.optionsMap.get(discriminatorValue);
		if (!option) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_union_discriminator,
				options: Array.from(this.optionsMap.keys()),
				path: [discriminator]
			});
			return INVALID;
		}
		if (ctx.common.async) return option._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
		else return option._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
	get discriminator() {
		return this._def.discriminator;
	}
	get options() {
		return this._def.options;
	}
	get optionsMap() {
		return this._def.optionsMap;
	}
	/**
	* The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
	* However, it only allows a union of objects, all of which need to share a discriminator property. This property must
	* have a different value for each object in the union.
	* @param discriminator the name of the discriminator property
	* @param types an array of object schemas
	* @param params
	*/
	static create(discriminator, options, params) {
		const optionsMap = /* @__PURE__ */ new Map();
		for (const type of options) {
			const discriminatorValues = getDiscriminator(type.shape[discriminator]);
			if (!discriminatorValues.length) throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
			for (const value of discriminatorValues) {
				if (optionsMap.has(value)) throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
				optionsMap.set(value, type);
			}
		}
		return new ZodDiscriminatedUnion({
			typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
			discriminator,
			options,
			optionsMap,
			...processCreateParams(params)
		});
	}
};
function mergeValues(a, b) {
	const aType = getParsedType(a);
	const bType = getParsedType(b);
	if (a === b) return {
		valid: true,
		data: a
	};
	else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
		const bKeys = util$1.objectKeys(b);
		const sharedKeys = util$1.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return { valid: false };
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	} else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
		if (a.length !== b.length) return { valid: false };
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return { valid: false };
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	} else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) return {
		valid: true,
		data: a
	};
	else return { valid: false };
}
var ZodIntersection = class extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const handleParsed = (parsedLeft, parsedRight) => {
			if (isAborted(parsedLeft) || isAborted(parsedRight)) return INVALID;
			const merged = mergeValues(parsedLeft.value, parsedRight.value);
			if (!merged.valid) {
				addIssueToContext(ctx, { code: ZodIssueCode.invalid_intersection_types });
				return INVALID;
			}
			if (isDirty(parsedLeft) || isDirty(parsedRight)) status.dirty();
			return {
				status: status.value,
				value: merged.data
			};
		};
		if (ctx.common.async) return Promise.all([this._def.left._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		})]).then(([left, right]) => handleParsed(left, right));
		else return handleParsed(this._def.left._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}), this._def.right._parseSync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}));
	}
};
ZodIntersection.create = (left, right, params) => {
	return new ZodIntersection({
		left,
		right,
		typeName: ZodFirstPartyTypeKind.ZodIntersection,
		...processCreateParams(params)
	});
};
var ZodTuple = class ZodTuple extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.array) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.array,
				received: ctx.parsedType
			});
			return INVALID;
		}
		if (ctx.data.length < this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_small,
				minimum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			return INVALID;
		}
		if (!this._def.rest && ctx.data.length > this._def.items.length) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.too_big,
				maximum: this._def.items.length,
				inclusive: true,
				exact: false,
				type: "array"
			});
			status.dirty();
		}
		const items = [...ctx.data].map((item, itemIndex) => {
			const schema = this._def.items[itemIndex] || this._def.rest;
			if (!schema) return null;
			return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
		}).filter((x) => !!x);
		if (ctx.common.async) return Promise.all(items).then((results) => {
			return ParseStatus.mergeArray(status, results);
		});
		else return ParseStatus.mergeArray(status, items);
	}
	get items() {
		return this._def.items;
	}
	rest(rest) {
		return new ZodTuple({
			...this._def,
			rest
		});
	}
};
ZodTuple.create = (schemas, params) => {
	if (!Array.isArray(schemas)) throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
	return new ZodTuple({
		items: schemas,
		typeName: ZodFirstPartyTypeKind.ZodTuple,
		rest: null,
		...processCreateParams(params)
	});
};
var ZodRecord = class ZodRecord extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.object) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.object,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const pairs = [];
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		for (const key in ctx.data) pairs.push({
			key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
			value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
			alwaysSet: key in ctx.data
		});
		if (ctx.common.async) return ParseStatus.mergeObjectAsync(status, pairs);
		else return ParseStatus.mergeObjectSync(status, pairs);
	}
	get element() {
		return this._def.valueType;
	}
	static create(first, second, third) {
		if (second instanceof ZodType) return new ZodRecord({
			keyType: first,
			valueType: second,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(third)
		});
		return new ZodRecord({
			keyType: ZodString.create(),
			valueType: first,
			typeName: ZodFirstPartyTypeKind.ZodRecord,
			...processCreateParams(second)
		});
	}
};
var ZodMap = class extends ZodType {
	get keySchema() {
		return this._def.keyType;
	}
	get valueSchema() {
		return this._def.valueType;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.map) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.map,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const keyType = this._def.keyType;
		const valueType = this._def.valueType;
		const pairs = [...ctx.data.entries()].map(([key, value], index) => {
			return {
				key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
				value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
			};
		});
		if (ctx.common.async) {
			const finalMap = /* @__PURE__ */ new Map();
			return Promise.resolve().then(async () => {
				for (const pair of pairs) {
					const key = await pair.key;
					const value = await pair.value;
					if (key.status === "aborted" || value.status === "aborted") return INVALID;
					if (key.status === "dirty" || value.status === "dirty") status.dirty();
					finalMap.set(key.value, value.value);
				}
				return {
					status: status.value,
					value: finalMap
				};
			});
		} else {
			const finalMap = /* @__PURE__ */ new Map();
			for (const pair of pairs) {
				const key = pair.key;
				const value = pair.value;
				if (key.status === "aborted" || value.status === "aborted") return INVALID;
				if (key.status === "dirty" || value.status === "dirty") status.dirty();
				finalMap.set(key.value, value.value);
			}
			return {
				status: status.value,
				value: finalMap
			};
		}
	}
};
ZodMap.create = (keyType, valueType, params) => {
	return new ZodMap({
		valueType,
		keyType,
		typeName: ZodFirstPartyTypeKind.ZodMap,
		...processCreateParams(params)
	});
};
var ZodSet = class ZodSet extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.set) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.set,
				received: ctx.parsedType
			});
			return INVALID;
		}
		const def = this._def;
		if (def.minSize !== null) {
			if (ctx.data.size < def.minSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_small,
					minimum: def.minSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.minSize.message
				});
				status.dirty();
			}
		}
		if (def.maxSize !== null) {
			if (ctx.data.size > def.maxSize.value) {
				addIssueToContext(ctx, {
					code: ZodIssueCode.too_big,
					maximum: def.maxSize.value,
					type: "set",
					inclusive: true,
					exact: false,
					message: def.maxSize.message
				});
				status.dirty();
			}
		}
		const valueType = this._def.valueType;
		function finalizeSet(elements) {
			const parsedSet = /* @__PURE__ */ new Set();
			for (const element of elements) {
				if (element.status === "aborted") return INVALID;
				if (element.status === "dirty") status.dirty();
				parsedSet.add(element.value);
			}
			return {
				status: status.value,
				value: parsedSet
			};
		}
		const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
		if (ctx.common.async) return Promise.all(elements).then((elements) => finalizeSet(elements));
		else return finalizeSet(elements);
	}
	min(minSize, message) {
		return new ZodSet({
			...this._def,
			minSize: {
				value: minSize,
				message: errorUtil.toString(message)
			}
		});
	}
	max(maxSize, message) {
		return new ZodSet({
			...this._def,
			maxSize: {
				value: maxSize,
				message: errorUtil.toString(message)
			}
		});
	}
	size(size, message) {
		return this.min(size, message).max(size, message);
	}
	nonempty(message) {
		return this.min(1, message);
	}
};
ZodSet.create = (valueType, params) => {
	return new ZodSet({
		valueType,
		minSize: null,
		maxSize: null,
		typeName: ZodFirstPartyTypeKind.ZodSet,
		...processCreateParams(params)
	});
};
var ZodFunction = class ZodFunction extends ZodType {
	constructor() {
		super(...arguments);
		this.validate = this.implement;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.function) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.function,
				received: ctx.parsedType
			});
			return INVALID;
		}
		function makeArgsIssue(args, error) {
			return makeIssue({
				data: args,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_arguments,
					argumentsError: error
				}
			});
		}
		function makeReturnsIssue(returns, error) {
			return makeIssue({
				data: returns,
				path: ctx.path,
				errorMaps: [
					ctx.common.contextualErrorMap,
					ctx.schemaErrorMap,
					getErrorMap(),
					errorMap
				].filter((x) => !!x),
				issueData: {
					code: ZodIssueCode.invalid_return_type,
					returnTypeError: error
				}
			});
		}
		const params = { errorMap: ctx.common.contextualErrorMap };
		const fn = ctx.data;
		if (this._def.returns instanceof ZodPromise) {
			const me = this;
			return OK(async function(...args) {
				const error = new ZodError([]);
				const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
					error.addIssue(makeArgsIssue(args, e));
					throw error;
				});
				const result = await Reflect.apply(fn, this, parsedArgs);
				return await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
					error.addIssue(makeReturnsIssue(result, e));
					throw error;
				});
			});
		} else {
			const me = this;
			return OK(function(...args) {
				const parsedArgs = me._def.args.safeParse(args, params);
				if (!parsedArgs.success) throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
				const result = Reflect.apply(fn, this, parsedArgs.data);
				const parsedReturns = me._def.returns.safeParse(result, params);
				if (!parsedReturns.success) throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
				return parsedReturns.data;
			});
		}
	}
	parameters() {
		return this._def.args;
	}
	returnType() {
		return this._def.returns;
	}
	args(...items) {
		return new ZodFunction({
			...this._def,
			args: ZodTuple.create(items).rest(ZodUnknown.create())
		});
	}
	returns(returnType) {
		return new ZodFunction({
			...this._def,
			returns: returnType
		});
	}
	implement(func) {
		return this.parse(func);
	}
	strictImplement(func) {
		return this.parse(func);
	}
	static create(args, returns, params) {
		return new ZodFunction({
			args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
			returns: returns || ZodUnknown.create(),
			typeName: ZodFirstPartyTypeKind.ZodFunction,
			...processCreateParams(params)
		});
	}
};
var ZodLazy = class extends ZodType {
	get schema() {
		return this._def.getter();
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		return this._def.getter()._parse({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		});
	}
};
ZodLazy.create = (getter, params) => {
	return new ZodLazy({
		getter,
		typeName: ZodFirstPartyTypeKind.ZodLazy,
		...processCreateParams(params)
	});
};
var ZodLiteral = class extends ZodType {
	_parse(input) {
		if (input.data !== this._def.value) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_literal,
				expected: this._def.value
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
	get value() {
		return this._def.value;
	}
};
ZodLiteral.create = (value, params) => {
	return new ZodLiteral({
		value,
		typeName: ZodFirstPartyTypeKind.ZodLiteral,
		...processCreateParams(params)
	});
};
function createZodEnum(values, params) {
	return new ZodEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodEnum,
		...processCreateParams(params)
	});
}
var ZodEnum = class ZodEnum extends ZodType {
	_parse(input) {
		if (typeof input.data !== "string") {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				expected: util$1.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(this._def.values);
		if (!this._cache.has(input.data)) {
			const ctx = this._getOrReturnCtx(input);
			const expectedValues = this._def.values;
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get options() {
		return this._def.values;
	}
	get enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Values() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	get Enum() {
		const enumValues = {};
		for (const val of this._def.values) enumValues[val] = val;
		return enumValues;
	}
	extract(values, newDef = this._def) {
		return ZodEnum.create(values, {
			...this._def,
			...newDef
		});
	}
	exclude(values, newDef = this._def) {
		return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
			...this._def,
			...newDef
		});
	}
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
	_parse(input) {
		const nativeEnumValues = util$1.getValidEnumValues(this._def.values);
		const ctx = this._getOrReturnCtx(input);
		if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
			const expectedValues = util$1.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				expected: util$1.joinValues(expectedValues),
				received: ctx.parsedType,
				code: ZodIssueCode.invalid_type
			});
			return INVALID;
		}
		if (!this._cache) this._cache = new Set(util$1.getValidEnumValues(this._def.values));
		if (!this._cache.has(input.data)) {
			const expectedValues = util$1.objectValues(nativeEnumValues);
			addIssueToContext(ctx, {
				received: ctx.data,
				code: ZodIssueCode.invalid_enum_value,
				options: expectedValues
			});
			return INVALID;
		}
		return OK(input.data);
	}
	get enum() {
		return this._def.values;
	}
};
ZodNativeEnum.create = (values, params) => {
	return new ZodNativeEnum({
		values,
		typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
		...processCreateParams(params)
	});
};
var ZodPromise = class extends ZodType {
	unwrap() {
		return this._def.type;
	}
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.promise,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return OK((ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data)).then((data) => {
			return this._def.type.parseAsync(data, {
				path: ctx.path,
				errorMap: ctx.common.contextualErrorMap
			});
		}));
	}
};
ZodPromise.create = (schema, params) => {
	return new ZodPromise({
		type: schema,
		typeName: ZodFirstPartyTypeKind.ZodPromise,
		...processCreateParams(params)
	});
};
var ZodEffects = class extends ZodType {
	innerType() {
		return this._def.schema;
	}
	sourceType() {
		return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
	}
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		const effect = this._def.effect || null;
		const checkCtx = {
			addIssue: (arg) => {
				addIssueToContext(ctx, arg);
				if (arg.fatal) status.abort();
				else status.dirty();
			},
			get path() {
				return ctx.path;
			}
		};
		checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
		if (effect.type === "preprocess") {
			const processed = effect.transform(ctx.data, checkCtx);
			if (ctx.common.async) return Promise.resolve(processed).then(async (processed) => {
				if (status.value === "aborted") return INVALID;
				const result = await this._def.schema._parseAsync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			});
			else {
				if (status.value === "aborted") return INVALID;
				const result = this._def.schema._parseSync({
					data: processed,
					path: ctx.path,
					parent: ctx
				});
				if (result.status === "aborted") return INVALID;
				if (result.status === "dirty") return DIRTY(result.value);
				if (status.value === "dirty") return DIRTY(result.value);
				return result;
			}
		}
		if (effect.type === "refinement") {
			const executeRefinement = (acc) => {
				const result = effect.refinement(acc, checkCtx);
				if (ctx.common.async) return Promise.resolve(result);
				if (result instanceof Promise) throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
				return acc;
			};
			if (ctx.common.async === false) {
				const inner = this._def.schema._parseSync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				executeRefinement(inner.value);
				return {
					status: status.value,
					value: inner.value
				};
			} else return this._def.schema._parseAsync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			}).then((inner) => {
				if (inner.status === "aborted") return INVALID;
				if (inner.status === "dirty") status.dirty();
				return executeRefinement(inner.value).then(() => {
					return {
						status: status.value,
						value: inner.value
					};
				});
			});
		}
		if (effect.type === "transform") if (ctx.common.async === false) {
			const base = this._def.schema._parseSync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			});
			if (!isValid(base)) return INVALID;
			const result = effect.transform(base.value, checkCtx);
			if (result instanceof Promise) throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
			return {
				status: status.value,
				value: result
			};
		} else return this._def.schema._parseAsync({
			data: ctx.data,
			path: ctx.path,
			parent: ctx
		}).then((base) => {
			if (!isValid(base)) return INVALID;
			return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
				status: status.value,
				value: result
			}));
		});
		util$1.assertNever(effect);
	}
};
ZodEffects.create = (schema, effect, params) => {
	return new ZodEffects({
		schema,
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		effect,
		...processCreateParams(params)
	});
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
	return new ZodEffects({
		schema,
		effect: {
			type: "preprocess",
			transform: preprocess
		},
		typeName: ZodFirstPartyTypeKind.ZodEffects,
		...processCreateParams(params)
	});
};
var ZodOptional = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.undefined) return OK(void 0);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodOptional.create = (type, params) => {
	return new ZodOptional({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodOptional,
		...processCreateParams(params)
	});
};
var ZodNullable = class extends ZodType {
	_parse(input) {
		if (this._getType(input) === ZodParsedType.null) return OK(null);
		return this._def.innerType._parse(input);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodNullable.create = (type, params) => {
	return new ZodNullable({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodNullable,
		...processCreateParams(params)
	});
};
var ZodDefault = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		let data = ctx.data;
		if (ctx.parsedType === ZodParsedType.undefined) data = this._def.defaultValue();
		return this._def.innerType._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	removeDefault() {
		return this._def.innerType;
	}
};
ZodDefault.create = (type, params) => {
	return new ZodDefault({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodDefault,
		defaultValue: typeof params.default === "function" ? params.default : () => params.default,
		...processCreateParams(params)
	});
};
var ZodCatch = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const newCtx = {
			...ctx,
			common: {
				...ctx.common,
				issues: []
			}
		};
		const result = this._def.innerType._parse({
			data: newCtx.data,
			path: newCtx.path,
			parent: { ...newCtx }
		});
		if (isAsync(result)) return result.then((result) => {
			return {
				status: "valid",
				value: result.status === "valid" ? result.value : this._def.catchValue({
					get error() {
						return new ZodError(newCtx.common.issues);
					},
					input: newCtx.data
				})
			};
		});
		else return {
			status: "valid",
			value: result.status === "valid" ? result.value : this._def.catchValue({
				get error() {
					return new ZodError(newCtx.common.issues);
				},
				input: newCtx.data
			})
		};
	}
	removeCatch() {
		return this._def.innerType;
	}
};
ZodCatch.create = (type, params) => {
	return new ZodCatch({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodCatch,
		catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
		...processCreateParams(params)
	});
};
var ZodNaN = class extends ZodType {
	_parse(input) {
		if (this._getType(input) !== ZodParsedType.nan) {
			const ctx = this._getOrReturnCtx(input);
			addIssueToContext(ctx, {
				code: ZodIssueCode.invalid_type,
				expected: ZodParsedType.nan,
				received: ctx.parsedType
			});
			return INVALID;
		}
		return {
			status: "valid",
			value: input.data
		};
	}
};
ZodNaN.create = (params) => {
	return new ZodNaN({
		typeName: ZodFirstPartyTypeKind.ZodNaN,
		...processCreateParams(params)
	});
};
var ZodBranded = class extends ZodType {
	_parse(input) {
		const { ctx } = this._processInputParams(input);
		const data = ctx.data;
		return this._def.type._parse({
			data,
			path: ctx.path,
			parent: ctx
		});
	}
	unwrap() {
		return this._def.type;
	}
};
var ZodPipeline = class ZodPipeline extends ZodType {
	_parse(input) {
		const { status, ctx } = this._processInputParams(input);
		if (ctx.common.async) {
			const handleAsync = async () => {
				const inResult = await this._def.in._parseAsync({
					data: ctx.data,
					path: ctx.path,
					parent: ctx
				});
				if (inResult.status === "aborted") return INVALID;
				if (inResult.status === "dirty") {
					status.dirty();
					return DIRTY(inResult.value);
				} else return this._def.out._parseAsync({
					data: inResult.value,
					path: ctx.path,
					parent: ctx
				});
			};
			return handleAsync();
		} else {
			const inResult = this._def.in._parseSync({
				data: ctx.data,
				path: ctx.path,
				parent: ctx
			});
			if (inResult.status === "aborted") return INVALID;
			if (inResult.status === "dirty") {
				status.dirty();
				return {
					status: "dirty",
					value: inResult.value
				};
			} else return this._def.out._parseSync({
				data: inResult.value,
				path: ctx.path,
				parent: ctx
			});
		}
	}
	static create(a, b) {
		return new ZodPipeline({
			in: a,
			out: b,
			typeName: ZodFirstPartyTypeKind.ZodPipeline
		});
	}
};
var ZodReadonly = class extends ZodType {
	_parse(input) {
		const result = this._def.innerType._parse(input);
		const freeze = (data) => {
			if (isValid(data)) data.value = Object.freeze(data.value);
			return data;
		};
		return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
	}
	unwrap() {
		return this._def.innerType;
	}
};
ZodReadonly.create = (type, params) => {
	return new ZodReadonly({
		innerType: type,
		typeName: ZodFirstPartyTypeKind.ZodReadonly,
		...processCreateParams(params)
	});
};
ZodObject.lazycreate;
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {
	ZodFirstPartyTypeKind["ZodString"] = "ZodString";
	ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
	ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
	ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
	ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
	ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
	ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
	ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
	ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
	ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
	ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
	ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
	ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
	ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
	ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
	ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
	ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
	ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
	ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
	ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
	ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
	ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
	ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
	ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
	ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
	ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
	ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
	ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
	ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
	ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
	ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
	ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
	ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
	ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
	ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
	ZodFirstPartyTypeKind["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var stringType = ZodString.create;
var numberType = ZodNumber.create;
ZodNaN.create;
ZodBigInt.create;
var booleanType = ZodBoolean.create;
ZodDate.create;
ZodSymbol.create;
ZodUndefined.create;
ZodNull.create;
var anyType = ZodAny.create;
ZodUnknown.create;
ZodNever.create;
ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
ZodDiscriminatedUnion.create;
ZodIntersection.create;
ZodTuple.create;
var recordType = ZodRecord.create;
ZodMap.create;
ZodSet.create;
ZodFunction.create;
ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
ZodNativeEnum.create;
ZodPromise.create;
ZodEffects.create;
ZodOptional.create;
ZodNullable.create;
ZodEffects.createWithPreprocess;
ZodPipeline.create;
var McpServerConfigSchema$7 = strictObjectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$7 = strictObjectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$7 = strictObjectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$7 = McpServerConfigSchema$7.partial();
var McpbManifestMcpConfigSchema$7 = McpServerConfigSchema$7.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$7).optional() });
var McpbManifestServerSchema$7 = strictObjectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$7
});
var McpbManifestCompatibilitySchema$7 = strictObjectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: strictObjectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
});
var McpbManifestToolSchema$7 = strictObjectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$7 = strictObjectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$7 = strictObjectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestSchema$8 = strictObjectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.1").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.1").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$7,
	repository: McpbManifestRepositorySchema$7.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	screenshots: arrayType(stringType()).optional(),
	server: McpbManifestServerSchema$7,
	tools: arrayType(McpbManifestToolSchema$7).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$7).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	compatibility: McpbManifestCompatibilitySchema$7.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$7).optional()
}).refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var McpServerConfigSchema$6 = strictObjectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$6 = strictObjectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$6 = strictObjectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$6 = McpServerConfigSchema$6.partial();
var McpbManifestMcpConfigSchema$6 = McpServerConfigSchema$6.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$6).optional() });
var McpbManifestServerSchema$6 = strictObjectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$6
});
var McpbManifestCompatibilitySchema$6 = strictObjectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: strictObjectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
});
var McpbManifestToolSchema$6 = strictObjectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$6 = strictObjectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$6 = strictObjectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestSchema$7 = strictObjectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.2").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.2").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$6,
	repository: McpbManifestRepositorySchema$6.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	screenshots: arrayType(stringType()).optional(),
	server: McpbManifestServerSchema$6,
	tools: arrayType(McpbManifestToolSchema$6).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$6).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema$6.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$6).optional()
}).refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var LOCALE_PLACEHOLDER_REGEX$3 = /\$\{locale\}/i;
var BCP47_REGEX$3 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
var ICON_SIZE_REGEX$3 = /^\d+x\d+$/;
var McpServerConfigSchema$5 = strictObjectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$5 = strictObjectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$5 = strictObjectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$5 = McpServerConfigSchema$5.partial();
var McpbManifestMcpConfigSchema$5 = McpServerConfigSchema$5.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$5).optional() });
var McpbManifestServerSchema$5 = strictObjectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$5
});
var McpbManifestCompatibilitySchema$5 = strictObjectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: strictObjectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
});
var McpbManifestToolSchema$5 = strictObjectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$5 = strictObjectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$5 = strictObjectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestLocalizationSchema$3 = strictObjectType({
	resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX$3, "resources must include a \"${locale}\" placeholder"),
	default_locale: stringType().regex(BCP47_REGEX$3, "default_locale must be a valid BCP 47 locale identifier")
});
var McpbManifestIconSchema$3 = strictObjectType({
	src: stringType(),
	size: stringType().regex(ICON_SIZE_REGEX$3, "size must be in the format \"WIDTHxHEIGHT\" (e.g., \"16x16\")"),
	theme: stringType().min(1, "theme cannot be empty when provided").optional()
});
var McpbManifestSchema$6 = strictObjectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.3").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.3").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$5,
	repository: McpbManifestRepositorySchema$5.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	icons: arrayType(McpbManifestIconSchema$3).optional(),
	screenshots: arrayType(stringType()).optional(),
	localization: McpbManifestLocalizationSchema$3.optional(),
	server: McpbManifestServerSchema$5,
	tools: arrayType(McpbManifestToolSchema$5).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$5).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema$5.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$5).optional(),
	_meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
}).refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var LOCALE_PLACEHOLDER_REGEX$2 = /\$\{locale\}/i;
var BCP47_REGEX$2 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
var ICON_SIZE_REGEX$2 = /^\d+x\d+$/;
var McpServerConfigSchema$4 = strictObjectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$4 = strictObjectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$4 = strictObjectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$4 = McpServerConfigSchema$4.partial();
var McpbManifestMcpConfigSchema$4 = McpServerConfigSchema$4.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$4).optional() });
var McpbManifestServerSchema$4 = strictObjectType({
	type: enumType([
		"python",
		"node",
		"binary",
		"uv"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$4
});
var McpbManifestCompatibilitySchema$4 = strictObjectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: strictObjectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
});
var McpbManifestToolSchema$4 = strictObjectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$4 = strictObjectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$4 = strictObjectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestLocalizationSchema$2 = strictObjectType({
	resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX$2, "resources must include a \"${locale}\" placeholder"),
	default_locale: stringType().regex(BCP47_REGEX$2, "default_locale must be a valid BCP 47 locale identifier")
});
var McpbManifestIconSchema$2 = strictObjectType({
	src: stringType(),
	size: stringType().regex(ICON_SIZE_REGEX$2, "size must be in the format \"WIDTHxHEIGHT\" (e.g., \"16x16\")"),
	theme: stringType().min(1, "theme cannot be empty when provided").optional()
});
var McpbManifestSchema$5 = strictObjectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.4").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.4").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$4,
	repository: McpbManifestRepositorySchema$4.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	icons: arrayType(McpbManifestIconSchema$2).optional(),
	screenshots: arrayType(stringType()).optional(),
	localization: McpbManifestLocalizationSchema$2.optional(),
	server: McpbManifestServerSchema$4,
	tools: arrayType(McpbManifestToolSchema$4).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$4).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema$4.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$4).optional(),
	_meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
}).refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var McpServerConfigSchema$3 = objectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$3 = objectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$3 = objectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$3 = McpServerConfigSchema$3.partial();
var McpbManifestMcpConfigSchema$3 = McpServerConfigSchema$3.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$3).optional() });
var McpbManifestServerSchema$3 = objectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$3
});
var McpbManifestCompatibilitySchema$3 = objectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: objectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
}).passthrough();
var McpbManifestToolSchema$3 = objectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$3 = objectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$3 = objectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
objectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.1").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.1").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$3,
	repository: McpbManifestRepositorySchema$3.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	screenshots: arrayType(stringType()).optional(),
	server: McpbManifestServerSchema$3,
	tools: arrayType(McpbManifestToolSchema$3).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$3).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	compatibility: McpbManifestCompatibilitySchema$3.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$3).optional()
}).refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var McpServerConfigSchema$2 = objectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$2 = objectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$2 = objectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$2 = McpServerConfigSchema$2.partial();
var McpbManifestMcpConfigSchema$2 = McpServerConfigSchema$2.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$2).optional() });
var McpbManifestServerSchema$2 = objectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$2
});
var McpbManifestCompatibilitySchema$2 = objectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: objectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
}).passthrough();
var McpbManifestToolSchema$2 = objectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$2 = objectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$2 = objectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
objectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.2").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.2").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$2,
	repository: McpbManifestRepositorySchema$2.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	screenshots: arrayType(stringType()).optional(),
	server: McpbManifestServerSchema$2,
	tools: arrayType(McpbManifestToolSchema$2).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$2).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema$2.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$2).optional()
}).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var LOCALE_PLACEHOLDER_REGEX$1 = /\$\{locale\}/i;
var BCP47_REGEX$1 = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
var ICON_SIZE_REGEX$1 = /^\d+x\d+$/;
var McpServerConfigSchema$1 = objectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema$1 = objectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema$1 = objectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema$1 = McpServerConfigSchema$1.partial();
var McpbManifestMcpConfigSchema$1 = McpServerConfigSchema$1.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema$1).optional() });
var McpbManifestServerSchema$1 = objectType({
	type: enumType([
		"python",
		"node",
		"binary"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema$1
});
var McpbManifestCompatibilitySchema$1 = objectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: objectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
}).passthrough();
var McpbManifestToolSchema$1 = objectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema$1 = objectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema$1 = objectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestLocalizationSchema$1 = objectType({
	resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX$1, "resources must include a \"${locale}\" placeholder"),
	default_locale: stringType().regex(BCP47_REGEX$1, "default_locale must be a valid BCP 47 locale identifier")
}).passthrough();
var McpbManifestIconSchema$1 = objectType({
	src: stringType(),
	size: stringType().regex(ICON_SIZE_REGEX$1, "size must be in the format \"WIDTHxHEIGHT\" (e.g., \"16x16\")"),
	theme: stringType().min(1).optional()
}).passthrough();
objectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.3").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.3").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema$1,
	repository: McpbManifestRepositorySchema$1.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	icons: arrayType(McpbManifestIconSchema$1).optional(),
	screenshots: arrayType(stringType()).optional(),
	localization: McpbManifestLocalizationSchema$1.optional(),
	server: McpbManifestServerSchema$1,
	tools: arrayType(McpbManifestToolSchema$1).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema$1).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema$1.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema$1).optional(),
	_meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
}).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
var LOCALE_PLACEHOLDER_REGEX = /\$\{locale\}/i;
var BCP47_REGEX = /^[A-Za-z0-9]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
var ICON_SIZE_REGEX = /^\d+x\d+$/;
var McpServerConfigSchema = objectType({
	command: stringType(),
	args: arrayType(stringType()).optional(),
	env: recordType(stringType(), stringType()).optional()
});
var McpbManifestAuthorSchema = objectType({
	name: stringType(),
	email: stringType().email().optional(),
	url: stringType().url().optional()
});
var McpbManifestRepositorySchema = objectType({
	type: stringType(),
	url: stringType().url()
});
var McpbManifestPlatformOverrideSchema = McpServerConfigSchema.partial();
var McpbManifestMcpConfigSchema = McpServerConfigSchema.extend({ platform_overrides: recordType(stringType(), McpbManifestPlatformOverrideSchema).optional() });
var McpbManifestServerSchema = objectType({
	type: enumType([
		"python",
		"node",
		"binary",
		"uv"
	]),
	entry_point: stringType(),
	mcp_config: McpbManifestMcpConfigSchema.optional()
});
var McpbManifestCompatibilitySchema = objectType({
	claude_desktop: stringType().optional(),
	platforms: arrayType(enumType([
		"darwin",
		"win32",
		"linux"
	])).optional(),
	runtimes: objectType({
		python: stringType().optional(),
		node: stringType().optional()
	}).optional()
}).passthrough();
var McpbManifestToolSchema = objectType({
	name: stringType(),
	description: stringType().optional()
});
var McpbManifestPromptSchema = objectType({
	name: stringType(),
	description: stringType().optional(),
	arguments: arrayType(stringType()).optional(),
	text: stringType()
});
var McpbUserConfigurationOptionSchema = objectType({
	type: enumType([
		"string",
		"number",
		"boolean",
		"directory",
		"file"
	]),
	title: stringType(),
	description: stringType(),
	required: booleanType().optional(),
	default: unionType([
		stringType(),
		numberType(),
		booleanType(),
		arrayType(stringType())
	]).optional(),
	multiple: booleanType().optional(),
	sensitive: booleanType().optional(),
	min: numberType().optional(),
	max: numberType().optional()
});
var McpbManifestLocalizationSchema = objectType({
	resources: stringType().regex(LOCALE_PLACEHOLDER_REGEX, "resources must include a \"${locale}\" placeholder"),
	default_locale: stringType().regex(BCP47_REGEX, "default_locale must be a valid BCP 47 locale identifier")
}).passthrough();
var McpbManifestIconSchema = objectType({
	src: stringType(),
	size: stringType().regex(ICON_SIZE_REGEX, "size must be in the format \"WIDTHxHEIGHT\" (e.g., \"16x16\")"),
	theme: stringType().min(1).optional()
}).passthrough();
objectType({
	$schema: stringType().optional(),
	dxt_version: literalType("0.4").optional().describe("@deprecated Use manifest_version instead"),
	manifest_version: literalType("0.4").optional(),
	name: stringType(),
	display_name: stringType().optional(),
	version: stringType(),
	description: stringType(),
	long_description: stringType().optional(),
	author: McpbManifestAuthorSchema,
	repository: McpbManifestRepositorySchema.optional(),
	homepage: stringType().url().optional(),
	documentation: stringType().url().optional(),
	support: stringType().url().optional(),
	icon: stringType().optional(),
	icons: arrayType(McpbManifestIconSchema).optional(),
	screenshots: arrayType(stringType()).optional(),
	localization: McpbManifestLocalizationSchema.optional(),
	server: McpbManifestServerSchema,
	tools: arrayType(McpbManifestToolSchema).optional(),
	tools_generated: booleanType().optional(),
	prompts: arrayType(McpbManifestPromptSchema).optional(),
	prompts_generated: booleanType().optional(),
	keywords: arrayType(stringType()).optional(),
	license: stringType().optional(),
	privacy_policies: arrayType(stringType().url()).optional(),
	compatibility: McpbManifestCompatibilitySchema.optional(),
	user_config: recordType(stringType(), McpbUserConfigurationOptionSchema).optional(),
	_meta: recordType(stringType(), recordType(stringType(), anyType())).optional()
}).passthrough().refine((data) => !!(data.dxt_version || data.manifest_version), { message: "Either 'dxt_version' (deprecated) or 'manifest_version' must be provided" });
unionType([
	McpbManifestSchema$8,
	McpbManifestSchema$7,
	McpbManifestSchema$6,
	McpbManifestSchema$5
]);
recordType(stringType(), unionType([
	stringType(),
	numberType(),
	booleanType(),
	arrayType(stringType())
]));
strictObjectType({
	status: enumType([
		"signed",
		"unsigned",
		"self-signed"
	]),
	publisher: stringType().optional(),
	issuer: stringType().optional(),
	valid_from: stringType().optional(),
	valid_to: stringType().optional(),
	fingerprint: stringType().optional()
});
//#endregion
exports.verifyMcpbFile = verifyMcpbFile;
