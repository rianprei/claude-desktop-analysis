Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_esm = require("./esm-BotMe_9_.js");
let node_fs_promises = require("node:fs/promises");
node_fs_promises = require_esm.__toESM(node_fs_promises);
let node_path = require("node:path");
node_path = require_esm.__toESM(node_path);
let node_stream_promises = require("node:stream/promises");
let node_crypto = require("node:crypto");
let node_fs = require("node:fs");
node_fs = require_esm.__toESM(node_fs);
let node_timers_promises = require("node:timers/promises");
let node_os = require("node:os");
node_os = require_esm.__toESM(node_os);
let node_util = require("node:util");
//#region node_modules/pend/index.js
var require_pend = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	module.exports = Pend;
	function Pend() {
		this.pending = 0;
		this.max = Infinity;
		this.listeners = [];
		this.waiting = [];
		this.error = null;
	}
	Pend.prototype.go = function(fn) {
		if (this.pending < this.max) pendGo(this, fn);
		else this.waiting.push(fn);
	};
	Pend.prototype.wait = function(cb) {
		if (this.pending === 0) cb(this.error);
		else this.listeners.push(cb);
	};
	Pend.prototype.hold = function() {
		return pendHold(this);
	};
	function pendHold(self) {
		self.pending += 1;
		var called = false;
		return onCb;
		function onCb(err) {
			if (called) throw new Error("callback called twice");
			called = true;
			self.error = self.error || err;
			self.pending -= 1;
			if (self.waiting.length > 0 && self.pending < self.max) pendGo(self, self.waiting.shift());
			else if (self.pending === 0) {
				var listeners = self.listeners;
				self.listeners = [];
				listeners.forEach(cbListener);
			}
		}
		function cbListener(listener) {
			listener(self.error);
		}
	}
	function pendGo(self, fn) {
		fn(pendHold(self));
	}
}));
//#endregion
//#region node_modules/yauzl/fd-slicer.js
var require_fd_slicer = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var fs$4 = require("fs");
	var util$1 = require("util");
	var stream = require("stream");
	var Readable = stream.Readable;
	var PassThrough = stream.PassThrough;
	var Pend = require_pend();
	var EventEmitter$3 = require("events").EventEmitter;
	exports.BufferSlicer = BufferSlicer;
	exports.FdSlicer = FdSlicer;
	util$1.inherits(FdSlicer, EventEmitter$3);
	function FdSlicer(fd) {
		EventEmitter$3.call(this);
		this.fd = fd;
		this.pend = new Pend();
		this.pend.max = 1;
		this.refCount = 0;
	}
	FdSlicer.prototype.read = function(buffer, offset, length, position, callback) {
		var self = this;
		self.pend.go(function(cb) {
			fs$4.read(self.fd, buffer, offset, length, position, function(err, bytesRead, buffer) {
				cb();
				callback(err, bytesRead, buffer);
			});
		});
	};
	FdSlicer.prototype.createReadStream = function(options) {
		return new ReadStream(this, options);
	};
	FdSlicer.prototype.ref = function() {
		this.refCount += 1;
	};
	FdSlicer.prototype.unref = function() {
		var self = this;
		self.refCount -= 1;
		if (self.refCount < 0) throw new Error("invalid unref");
		if (self.refCount > 0) return;
		fs$4.close(self.fd, onCloseDone);
		function onCloseDone(err) {
			if (err) self.emit("error", err);
			else self.emit("close");
		}
	};
	util$1.inherits(ReadStream, Readable);
	function ReadStream(context, options) {
		options = options || {};
		Readable.call(this, options);
		this.context = context;
		this.context.ref();
		this.start = options.start || 0;
		this.endOffset = options.end;
		this.pos = this.start;
	}
	ReadStream.prototype._read = function(n) {
		var self = this;
		var toRead = Math.min(self._readableState.highWaterMark, n);
		if (self.endOffset != null) toRead = Math.min(toRead, self.endOffset - self.pos);
		if (toRead <= 0) {
			self.push(null);
			this._cleanup();
			return;
		}
		self.context.pend.go(function(cb) {
			var buffer = Buffer.allocUnsafe(toRead);
			fs$4.read(self.context.fd, buffer, 0, toRead, self.pos, function(err, bytesRead) {
				if (err) self.destroy(err);
				else if (bytesRead === 0) {
					self.push(null);
					self._cleanup();
				} else {
					self.pos += bytesRead;
					self.push(buffer.slice(0, bytesRead));
				}
				cb();
			});
		});
	};
	ReadStream.prototype._destroy = function(err, cb) {
		this._cleanup();
		cb(err);
	};
	ReadStream.prototype._cleanup = function() {
		if (this.context != null) {
			this.context.unref();
			this.context = null;
		}
	};
	util$1.inherits(BufferSlicer, EventEmitter$3);
	function BufferSlicer(buffer) {
		EventEmitter$3.call(this);
		this.refCount = 0;
		this.buffer = buffer;
	}
	BufferSlicer.prototype.read = function(buffer, offset, length, position, callback) {
		if (!(0 <= offset && offset <= buffer.length)) throw new RangeError("offset outside buffer: 0 <= " + offset + " <= " + buffer.length);
		if (position < 0) throw new RangeError("position is negative: " + position);
		if (offset + length > buffer.length) length = buffer.length - offset;
		if (position + length > this.buffer.length) length = this.buffer.length - position;
		if (length <= 0) {
			setImmediate(function() {
				callback(null, 0);
			});
			return;
		}
		this.buffer.copy(buffer, offset, position, position + length);
		setImmediate(function() {
			callback(null, length);
		});
	};
	BufferSlicer.prototype.createReadStream = function(options) {
		options = options || {};
		var readStream = new PassThrough(options);
		readStream.start = options.start || 0;
		readStream.endOffset = options.end;
		readStream.pos = readStream.endOffset || this.buffer.length;
		var entireSlice = this.buffer.slice(readStream.start, readStream.pos);
		var maxChunkSize = 65536;
		var offset = 0;
		while (true) {
			var nextOffset = offset + maxChunkSize;
			if (nextOffset >= entireSlice.length) {
				if (offset < entireSlice.length) readStream.write(entireSlice.slice(offset, entireSlice.length));
				break;
			}
			readStream.write(entireSlice.slice(offset, nextOffset));
			offset = nextOffset;
		}
		readStream.end();
		return readStream;
	};
	BufferSlicer.prototype.ref = function() {
		this.refCount += 1;
	};
	BufferSlicer.prototype.unref = function() {
		this.refCount -= 1;
		if (this.refCount < 0) throw new Error("invalid unref");
	};
}));
//#endregion
//#region node_modules/yauzl/crc32.js
var require_crc32 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
	var CRC_TABLE = new Int32Array([
		0,
		1996959894,
		3993919788,
		2567524794,
		124634137,
		1886057615,
		3915621685,
		2657392035,
		249268274,
		2044508324,
		3772115230,
		2547177864,
		162941995,
		2125561021,
		3887607047,
		2428444049,
		498536548,
		1789927666,
		4089016648,
		2227061214,
		450548861,
		1843258603,
		4107580753,
		2211677639,
		325883990,
		1684777152,
		4251122042,
		2321926636,
		335633487,
		1661365465,
		4195302755,
		2366115317,
		997073096,
		1281953886,
		3579855332,
		2724688242,
		1006888145,
		1258607687,
		3524101629,
		2768942443,
		901097722,
		1119000684,
		3686517206,
		2898065728,
		853044451,
		1172266101,
		3705015759,
		2882616665,
		651767980,
		1373503546,
		3369554304,
		3218104598,
		565507253,
		1454621731,
		3485111705,
		3099436303,
		671266974,
		1594198024,
		3322730930,
		2970347812,
		795835527,
		1483230225,
		3244367275,
		3060149565,
		1994146192,
		31158534,
		2563907772,
		4023717930,
		1907459465,
		112637215,
		2680153253,
		3904427059,
		2013776290,
		251722036,
		2517215374,
		3775830040,
		2137656763,
		141376813,
		2439277719,
		3865271297,
		1802195444,
		476864866,
		2238001368,
		4066508878,
		1812370925,
		453092731,
		2181625025,
		4111451223,
		1706088902,
		314042704,
		2344532202,
		4240017532,
		1658658271,
		366619977,
		2362670323,
		4224994405,
		1303535960,
		984961486,
		2747007092,
		3569037538,
		1256170817,
		1037604311,
		2765210733,
		3554079995,
		1131014506,
		879679996,
		2909243462,
		3663771856,
		1141124467,
		855842277,
		2852801631,
		3708648649,
		1342533948,
		654459306,
		3188396048,
		3373015174,
		1466479909,
		544179635,
		3110523913,
		3462522015,
		1591671054,
		702138776,
		2966460450,
		3352799412,
		1504918807,
		783551873,
		3082640443,
		3233442989,
		3988292384,
		2596254646,
		62317068,
		1957810842,
		3939845945,
		2647816111,
		81470997,
		1943803523,
		3814918930,
		2489596804,
		225274430,
		2053790376,
		3826175755,
		2466906013,
		167816743,
		2097651377,
		4027552580,
		2265490386,
		503444072,
		1762050814,
		4150417245,
		2154129355,
		426522225,
		1852507879,
		4275313526,
		2312317920,
		282753626,
		1742555852,
		4189708143,
		2394877945,
		397917763,
		1622183637,
		3604390888,
		2714866558,
		953729732,
		1340076626,
		3518719985,
		2797360999,
		1068828381,
		1219638859,
		3624741850,
		2936675148,
		906185462,
		1090812512,
		3747672003,
		2825379669,
		829329135,
		1181335161,
		3412177804,
		3160834842,
		628085408,
		1382605366,
		3423369109,
		3138078467,
		570562233,
		1426400815,
		3317316542,
		2998733608,
		733239954,
		1555261956,
		3268935591,
		3050360625,
		752459403,
		1541320221,
		2607071920,
		3965973030,
		1969922972,
		40735498,
		2617837225,
		3943577151,
		1913087877,
		83908371,
		2512341634,
		3803740692,
		2075208622,
		213261112,
		2463272603,
		3855990285,
		2094854071,
		198958881,
		2262029012,
		4057260610,
		1759359992,
		534414190,
		2176718541,
		4139329115,
		1873836001,
		414664567,
		2282248934,
		4279200368,
		1711684554,
		285281116,
		2405801727,
		4167216745,
		1634467795,
		376229701,
		2685067896,
		3608007406,
		1308918612,
		956543938,
		2808555105,
		3495958263,
		1231636301,
		1047427035,
		2932959818,
		3654703836,
		1088359270,
		936918e3,
		2847714899,
		3736837829,
		1202900863,
		817233897,
		3183342108,
		3401237130,
		1404277552,
		615818150,
		3134207493,
		3453421203,
		1423857449,
		601450431,
		3009837614,
		3294710456,
		1567103746,
		711928724,
		3020668471,
		3272380065,
		1510334235,
		755167117
	]);
	function crc32(buf) {
		let crc = -1;
		for (let x of buf) crc = CRC_TABLE[(crc ^ x) & 255] ^ crc >>> 8;
		return (crc ^ -1) >>> 0;
	}
	module.exports = crc32;
}));
//#endregion
//#region node_modules/yauzl/index.js
var require_yauzl = /* @__PURE__ */ require_esm.__commonJSMin(((exports) => {
	var fs$3 = require("fs");
	var zlib = require("zlib");
	var fd_slicer = require_fd_slicer();
	var util = require("util");
	var EventEmitter$2 = require("events").EventEmitter;
	var Transform = require("stream").Transform;
	var PassThrough = require("stream").PassThrough;
	var Writable = require("stream").Writable;
	var crc32 = typeof zlib.crc32 === "function" ? zlib.crc32 : require_crc32();
	exports.open = open;
	exports.fromFd = fromFd;
	function open(path, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = null;
		}
		if (options == null) options = {};
		if (options.autoClose == null) options.autoClose = true;
		if (options.lazyEntries == null) options.lazyEntries = false;
		if (options.decodeStrings == null) options.decodeStrings = true;
		if (options.validateEntrySizes == null) options.validateEntrySizes = true;
		if (options.strictFileNames == null) options.strictFileNames = false;
		if (callback == null) callback = defaultCallback;
		fs$3.open(path, "r", function(err, fd) {
			if (err) return callback(err);
			fromFd(fd, options, function(err, zipfile) {
				if (err) fs$3.close(fd, defaultCallback);
				callback(err, zipfile);
			});
		});
	}
	function fromFd(fd, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = null;
		}
		if (options == null) options = {};
		if (options.autoClose == null) options.autoClose = false;
		if (options.lazyEntries == null) options.lazyEntries = false;
		if (options.decodeStrings == null) options.decodeStrings = true;
		if (options.validateEntrySizes == null) options.validateEntrySizes = true;
		if (options.strictFileNames == null) options.strictFileNames = false;
		if (callback == null) callback = defaultCallback;
		fs$3.fstat(fd, function(err, stats) {
			if (err) return callback(err);
			fromRandomAccessReader(new fd_slicer.FdSlicer(fd), stats.size, options, callback);
		});
	}
	function fromRandomAccessReader(reader, totalSize, options, callback) {
		if (typeof options === "function") {
			callback = options;
			options = null;
		}
		if (options == null) options = {};
		if (options.autoClose == null) options.autoClose = true;
		if (options.lazyEntries == null) options.lazyEntries = false;
		if (options.decodeStrings == null) options.decodeStrings = true;
		var decodeStrings = !!options.decodeStrings;
		if (options.validateEntrySizes == null) options.validateEntrySizes = true;
		if (options.strictFileNames == null) options.strictFileNames = false;
		if (callback == null) callback = defaultCallback;
		if (typeof totalSize !== "number") throw new Error("expected totalSize parameter to be a number");
		if (totalSize > Number.MAX_SAFE_INTEGER) throw new Error("zip file too large. only file sizes up to 2^52 are supported due to JavaScript's Number type being an IEEE 754 double.");
		reader.ref();
		var eocdrWithoutCommentSize = 22;
		var zip64EocdlSize = 20;
		var bufferSize = Math.min(zip64EocdlSize + eocdrWithoutCommentSize + 65535, totalSize);
		var buffer = newBuffer(bufferSize);
		readAndAssertNoEof(reader, buffer, 0, bufferSize, totalSize - buffer.length, function(err) {
			if (err) return callback(err);
			for (var i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
				if (buffer.readUInt32LE(i) !== 101010256) continue;
				var eocdrBuffer = buffer.subarray(i);
				var diskNumber = eocdrBuffer.readUInt16LE(4);
				var entryCount = eocdrBuffer.readUInt16LE(10);
				var centralDirectoryOffset = eocdrBuffer.readUInt32LE(16);
				var commentLength = eocdrBuffer.readUInt16LE(20);
				var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
				if (commentLength !== expectedCommentLength) return callback(/* @__PURE__ */ new Error("Invalid comment length. Expected: " + expectedCommentLength + ". Found: " + commentLength + ". Are there extra bytes at the end of the file? Or is the end of central dir signature `PK☺☻` in the comment?"));
				var comment = decodeStrings ? decodeBuffer(eocdrBuffer.subarray(22), false) : eocdrBuffer.subarray(22);
				if (i - zip64EocdlSize >= 0 && buffer.readUInt32LE(i - zip64EocdlSize) === 117853008) {
					var zip64EocdrOffset = readUInt64LE(buffer.subarray(i - zip64EocdlSize, i - zip64EocdlSize + zip64EocdlSize), 8);
					var zip64EocdrBuffer = newBuffer(56);
					return readAndAssertNoEof(reader, zip64EocdrBuffer, 0, zip64EocdrBuffer.length, zip64EocdrOffset, function(err) {
						if (err) return callback(err);
						if (zip64EocdrBuffer.readUInt32LE(0) !== 101075792) return callback(/* @__PURE__ */ new Error("invalid zip64 end of central directory record signature"));
						diskNumber = zip64EocdrBuffer.readUInt32LE(16);
						if (diskNumber !== 0) return callback(/* @__PURE__ */ new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
						entryCount = readUInt64LE(zip64EocdrBuffer, 32);
						centralDirectoryOffset = readUInt64LE(zip64EocdrBuffer, 48);
						return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
					});
				}
				if (diskNumber !== 0) return callback(/* @__PURE__ */ new Error("multi-disk zip files are not supported: found disk number: " + diskNumber));
				return callback(null, new ZipFile(reader, centralDirectoryOffset, totalSize, entryCount, comment, options.autoClose, options.lazyEntries, decodeStrings, options.validateEntrySizes, options.strictFileNames));
			}
			callback(/* @__PURE__ */ new Error("End of central directory record signature not found. Either not a zip file, or file is truncated."));
		});
	}
	util.inherits(ZipFile, EventEmitter$2);
	function ZipFile(reader, centralDirectoryOffset, fileSize, entryCount, comment, autoClose, lazyEntries, decodeStrings, validateEntrySizes, strictFileNames) {
		var self = this;
		EventEmitter$2.call(self);
		self.reader = reader;
		self.reader.on("error", function(err) {
			emitError(self, err);
		});
		self.reader.once("close", function() {
			self.emit("close");
		});
		self.readEntryCursor = centralDirectoryOffset;
		self.fileSize = fileSize;
		self.entryCount = entryCount;
		self.comment = comment;
		self.entriesRead = 0;
		self.autoClose = !!autoClose;
		self.lazyEntries = !!lazyEntries;
		self.decodeStrings = !!decodeStrings;
		self.validateEntrySizes = !!validateEntrySizes;
		self.strictFileNames = !!strictFileNames;
		self.isOpen = true;
		self.emittedError = false;
		if (!self.lazyEntries) self._readEntry();
	}
	ZipFile.prototype.close = function() {
		if (!this.isOpen) return;
		this.isOpen = false;
		this.reader.unref();
	};
	function emitErrorAndAutoClose(self, err) {
		if (self.autoClose) self.close();
		emitError(self, err);
	}
	function emitError(self, err) {
		if (self.emittedError) return;
		self.emittedError = true;
		self.emit("error", err);
	}
	ZipFile.prototype.readEntry = function() {
		if (!this.lazyEntries) throw new Error("readEntry() called without lazyEntries:true");
		this._readEntry();
	};
	ZipFile.prototype._readEntry = function() {
		var self = this;
		if (self.entryCount === self.entriesRead) {
			setImmediate(function() {
				if (self.autoClose) self.close();
				if (self.emittedError) return;
				self.emit("end");
			});
			return;
		}
		if (self.emittedError) return;
		var buffer = newBuffer(46);
		readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
			if (err) return emitErrorAndAutoClose(self, err);
			if (self.emittedError) return;
			var entry = new Entry();
			var signature = buffer.readUInt32LE(0);
			if (signature !== 33639248) return emitErrorAndAutoClose(self, /* @__PURE__ */ new Error("invalid central directory file header signature: 0x" + signature.toString(16)));
			entry.versionMadeBy = buffer.readUInt16LE(4);
			entry.versionNeededToExtract = buffer.readUInt16LE(6);
			entry.generalPurposeBitFlag = buffer.readUInt16LE(8);
			entry.compressionMethod = buffer.readUInt16LE(10);
			entry.lastModFileTime = buffer.readUInt16LE(12);
			entry.lastModFileDate = buffer.readUInt16LE(14);
			entry.crc32 = buffer.readUInt32LE(16);
			entry.compressedSize = buffer.readUInt32LE(20);
			entry.uncompressedSize = buffer.readUInt32LE(24);
			entry.fileNameLength = buffer.readUInt16LE(28);
			entry.extraFieldLength = buffer.readUInt16LE(30);
			entry.fileCommentLength = buffer.readUInt16LE(32);
			entry.internalFileAttributes = buffer.readUInt16LE(36);
			entry.externalFileAttributes = buffer.readUInt32LE(38);
			entry.relativeOffsetOfLocalHeader = buffer.readUInt32LE(42);
			if (entry.generalPurposeBitFlag & 64) return emitErrorAndAutoClose(self, /* @__PURE__ */ new Error("strong encryption is not supported"));
			self.readEntryCursor += 46;
			buffer = newBuffer(entry.fileNameLength + entry.extraFieldLength + entry.fileCommentLength);
			readAndAssertNoEof(self.reader, buffer, 0, buffer.length, self.readEntryCursor, function(err) {
				if (err) return emitErrorAndAutoClose(self, err);
				if (self.emittedError) return;
				entry.fileNameRaw = buffer.subarray(0, entry.fileNameLength);
				var fileCommentStart = entry.fileNameLength + entry.extraFieldLength;
				entry.extraFieldRaw = buffer.subarray(entry.fileNameLength, fileCommentStart);
				entry.fileCommentRaw = buffer.subarray(fileCommentStart, fileCommentStart + entry.fileCommentLength);
				try {
					entry.extraFields = parseExtraFields(entry.extraFieldRaw);
				} catch (err) {
					return emitErrorAndAutoClose(self, err);
				}
				if (self.decodeStrings) {
					var isUtf8 = (entry.generalPurposeBitFlag & 2048) !== 0;
					entry.fileComment = decodeBuffer(entry.fileCommentRaw, isUtf8);
					entry.fileName = getFileNameLowLevel(entry.generalPurposeBitFlag, entry.fileNameRaw, entry.extraFields, self.strictFileNames);
					var errorMessage = validateFileName(entry.fileName);
					if (errorMessage != null) return emitErrorAndAutoClose(self, new Error(errorMessage));
				} else {
					entry.fileComment = entry.fileCommentRaw;
					entry.fileName = entry.fileNameRaw;
				}
				entry.comment = entry.fileComment;
				self.readEntryCursor += buffer.length;
				self.entriesRead += 1;
				for (var i = 0; i < entry.extraFields.length; i++) {
					var extraField = entry.extraFields[i];
					if (extraField.id !== 1) continue;
					var zip64EiefBuffer = extraField.data;
					var index = 0;
					if (entry.uncompressedSize === 4294967295) {
						if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, /* @__PURE__ */ new Error("zip64 extended information extra field does not include uncompressed size"));
						entry.uncompressedSize = readUInt64LE(zip64EiefBuffer, index);
						index += 8;
					}
					if (entry.compressedSize === 4294967295) {
						if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, /* @__PURE__ */ new Error("zip64 extended information extra field does not include compressed size"));
						entry.compressedSize = readUInt64LE(zip64EiefBuffer, index);
						index += 8;
					}
					if (entry.relativeOffsetOfLocalHeader === 4294967295) {
						if (index + 8 > zip64EiefBuffer.length) return emitErrorAndAutoClose(self, /* @__PURE__ */ new Error("zip64 extended information extra field does not include relative header offset"));
						entry.relativeOffsetOfLocalHeader = readUInt64LE(zip64EiefBuffer, index);
						index += 8;
					}
					break;
				}
				if (self.validateEntrySizes && entry.compressionMethod === 0) {
					var expectedCompressedSize = entry.uncompressedSize;
					if (entry.isEncrypted()) expectedCompressedSize += 12;
					if (entry.compressedSize !== expectedCompressedSize) {
						var msg = "compressed/uncompressed size mismatch for stored file: " + entry.compressedSize + " != " + entry.uncompressedSize;
						return emitErrorAndAutoClose(self, new Error(msg));
					}
				}
				self.emit("entry", entry);
				if (!self.lazyEntries) self._readEntry();
			});
		});
	};
	ZipFile.prototype.openReadStream = function(entry, options, callback) {
		var self = this;
		var relativeStart = 0;
		var relativeEnd = entry.compressedSize;
		if (callback == null) {
			callback = options;
			options = null;
		}
		if (options == null) options = {};
		else {
			if (options.decodeFileData === false) {
				if (options.decrypt != null) throw new Error("cannot use options.decrypt when options.decodeFileData === false");
				if (options.decompress != null) throw new Error("cannot use options.decompress when options.decodeFileData === false");
			} else {
				if (options.decrypt != null) {
					if (!entry.isEncrypted()) throw new Error("options.decrypt can only be specified for encrypted entries. See also option decodeFileData.");
					if (options.decrypt !== false) throw new Error("invalid options.decrypt value: " + options.decrypt);
					if (entry.isCompressed()) {
						if (options.decompress !== false) throw new Error("entry is encrypted and compressed, and options.decompress !== false. See also option decodeFileData.");
					}
				}
				if (options.decompress != null) {
					if (!entry.isCompressed()) throw new Error("options.decompress can only be specified for compressed entries. See also option decodeFileData.");
					if (!(options.decompress === false || options.decompress === true)) throw new Error("invalid options.decompress value: " + options.decompress);
					decompress = options.decompress;
				}
			}
			if (options.start != null) {
				relativeStart = options.start;
				if (relativeStart < 0) throw new Error("options.start < 0");
				if (relativeStart > entry.compressedSize) throw new Error("options.start > entry.compressedSize");
			}
			if (options.end != null) {
				relativeEnd = options.end;
				if (relativeEnd < 0) throw new Error("options.end < 0");
				if (relativeEnd > entry.compressedSize) throw new Error("options.end > entry.compressedSize");
				if (relativeEnd < relativeStart) throw new Error("options.end < options.start");
			}
		}
		var rawMode = options.decodeFileData === false || (entry.compressionMethod === 0 || entry.compressionMethod === 8 && options.decompress === false) && (!entry.isEncrypted() || options.decrypt === false);
		if (options.start != null || options.end != null) {
			if (!rawMode) throw new Error("start/end range require options.decodeFileData === false for non-trivial encoded entries.");
		}
		if (!self.isOpen) return callback(/* @__PURE__ */ new Error("closed"));
		if (entry.isEncrypted() && !rawMode) {
			if (options.decrypt !== false) return callback(/* @__PURE__ */ new Error("entry is encrypted, and options.decodeFileData !== false"));
		}
		var decompress;
		if (rawMode) decompress = false;
		else if (entry.compressionMethod === 8) decompress = options.decodeFileData !== true;
		else return callback(/* @__PURE__ */ new Error("unsupported compression method: " + entry.compressionMethod));
		self.readLocalFileHeader(entry, { minimal: true }, function(err, localFileHeader) {
			if (err) return callback(err);
			self.openReadStreamLowLevel(localFileHeader.fileDataStart, entry.compressedSize, relativeStart, relativeEnd, decompress, entry.uncompressedSize, callback);
		});
	};
	ZipFile.prototype.openReadStreamLowLevel = function(fileDataStart, compressedSize, relativeStart, relativeEnd, decompress, uncompressedSize, callback) {
		var self = this;
		fileDataStart + compressedSize;
		var readStream = self.reader.createReadStream({
			start: fileDataStart + relativeStart,
			end: fileDataStart + relativeEnd
		});
		var endpointStream = readStream;
		if (decompress) {
			var destroyed = false;
			var inflateFilter = zlib.createInflateRaw();
			readStream.on("error", function(err) {
				setImmediate(function() {
					if (!destroyed) inflateFilter.emit("error", err);
				});
			});
			readStream.pipe(inflateFilter);
			if (self.validateEntrySizes) {
				endpointStream = new AssertByteCountStream(uncompressedSize);
				inflateFilter.on("error", function(err) {
					setImmediate(function() {
						if (!destroyed) endpointStream.emit("error", err);
					});
				});
				inflateFilter.pipe(endpointStream);
			} else endpointStream = inflateFilter;
			installDestroyFn(endpointStream, function() {
				destroyed = true;
				if (inflateFilter !== endpointStream) inflateFilter.unpipe(endpointStream);
				readStream.unpipe(inflateFilter);
				readStream.destroy();
			});
		}
		callback(null, endpointStream);
	};
	ZipFile.prototype.readLocalFileHeader = function(entry, options, callback) {
		var self = this;
		if (callback == null) {
			callback = options;
			options = null;
		}
		if (options == null) options = {};
		self.reader.ref();
		var buffer = newBuffer(30);
		readAndAssertNoEof(self.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader, function(err) {
			try {
				if (err) return callback(err);
				var signature = buffer.readUInt32LE(0);
				if (signature !== 67324752) return callback(/* @__PURE__ */ new Error("invalid local file header signature: 0x" + signature.toString(16)));
				var fileNameLength = buffer.readUInt16LE(26);
				var extraFieldLength = buffer.readUInt16LE(28);
				var fileDataStart = entry.relativeOffsetOfLocalHeader + 30 + fileNameLength + extraFieldLength;
				if (fileDataStart + entry.compressedSize > self.fileSize) return callback(/* @__PURE__ */ new Error("file data overflows file bounds: " + fileDataStart + " + " + entry.compressedSize + " > " + self.fileSize));
				if (options.minimal) return callback(null, { fileDataStart });
				var localFileHeader = new LocalFileHeader();
				localFileHeader.fileDataStart = fileDataStart;
				localFileHeader.versionNeededToExtract = buffer.readUInt16LE(4);
				localFileHeader.generalPurposeBitFlag = buffer.readUInt16LE(6);
				localFileHeader.compressionMethod = buffer.readUInt16LE(8);
				localFileHeader.lastModFileTime = buffer.readUInt16LE(10);
				localFileHeader.lastModFileDate = buffer.readUInt16LE(12);
				localFileHeader.crc32 = buffer.readUInt32LE(14);
				localFileHeader.compressedSize = buffer.readUInt32LE(18);
				localFileHeader.uncompressedSize = buffer.readUInt32LE(22);
				localFileHeader.fileNameLength = fileNameLength;
				localFileHeader.extraFieldLength = extraFieldLength;
				buffer = newBuffer(fileNameLength + extraFieldLength);
				self.reader.ref();
				readAndAssertNoEof(self.reader, buffer, 0, buffer.length, entry.relativeOffsetOfLocalHeader + 30, function(err) {
					try {
						if (err) return callback(err);
						localFileHeader.fileName = buffer.subarray(0, fileNameLength);
						localFileHeader.extraField = buffer.subarray(fileNameLength);
						return callback(null, localFileHeader);
					} finally {
						self.reader.unref();
					}
				});
			} finally {
				self.reader.unref();
			}
		});
	};
	function Entry() {}
	Entry.prototype.getLastModDate = function(options) {
		if (options == null) options = {};
		if (!options.forceDosFormat) for (var i = 0; i < this.extraFields.length; i++) {
			var extraField = this.extraFields[i];
			if (extraField.id === 21589) {
				var data = extraField.data;
				if (data.length < 5) continue;
				if (!(data[0] & 1)) continue;
				var posixTimestamp = data.readInt32LE(1);
				return /* @__PURE__ */ new Date(posixTimestamp * 1e3);
			} else if (extraField.id === 10) {
				var data = extraField.data;
				if (data.length !== 32) continue;
				if (data.readUInt16LE(4) !== 1) continue;
				if (data.readUInt16LE(6) !== 24) continue;
				var millisecondsSince1970 = (data.readUInt32LE(8) + 4294967296 * data.readInt32LE(12)) / 1e4 - 0xa9730b66800;
				return new Date(millisecondsSince1970);
			}
		}
		return dosDateTimeToDate(this.lastModFileDate, this.lastModFileTime, options.timezone);
	};
	Entry.prototype.canDecodeFileData = function() {
		return !this.isEncrypted() && (this.compressionMethod === 0 || this.compressionMethod === 8);
	};
	Entry.prototype.isEncrypted = function() {
		return (this.generalPurposeBitFlag & 1) !== 0;
	};
	Entry.prototype.isCompressed = function() {
		return this.compressionMethod === 8;
	};
	function LocalFileHeader() {}
	function dosDateTimeToDate(date, time, timezone) {
		var day = date & 31;
		var month = (date >> 5 & 15) - 1;
		var year = (date >> 9 & 127) + 1980;
		var millisecond = 0;
		var second = (time & 31) * 2;
		var minute = time >> 5 & 63;
		var hour = time >> 11 & 31;
		if (timezone == null || timezone === "local") return new Date(year, month, day, hour, minute, second, millisecond);
		else if (timezone === "UTC") return new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
		else throw new Error("unrecognized options.timezone: " + options.timezone);
	}
	function getFileNameLowLevel(generalPurposeBitFlag, fileNameBuffer, extraFields, strictFileNames) {
		var fileName = null;
		for (var i = 0; i < extraFields.length; i++) {
			var extraField = extraFields[i];
			if (extraField.id === 28789) {
				if (extraField.data.length < 6) continue;
				if (extraField.data.readUInt8(0) !== 1) continue;
				var oldNameCrc32 = extraField.data.readUInt32LE(1);
				if (crc32(fileNameBuffer) !== oldNameCrc32) continue;
				fileName = decodeBuffer(extraField.data.subarray(5), true);
				break;
			}
		}
		if (fileName == null) fileName = decodeBuffer(fileNameBuffer, (generalPurposeBitFlag & 2048) !== 0);
		if (!strictFileNames) fileName = fileName.replace(/\\/g, "/");
		return fileName;
	}
	function validateFileName(fileName) {
		if (fileName.indexOf("\\") !== -1) return "invalid characters in fileName: " + fileName;
		if (/^[a-zA-Z]:/.test(fileName) || /^\//.test(fileName)) return "absolute path: " + fileName;
		if (fileName.split("/").indexOf("..") !== -1) return "invalid relative path: " + fileName;
		return null;
	}
	function parseExtraFields(extraFieldBuffer) {
		var extraFields = [];
		var i = 0;
		while (i < extraFieldBuffer.length - 3) {
			var headerId = extraFieldBuffer.readUInt16LE(i + 0);
			var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
			var dataStart = i + 4;
			var dataEnd = dataStart + dataSize;
			if (dataEnd > extraFieldBuffer.length) throw new Error("extra field length exceeds extra field buffer size");
			var dataBuffer = extraFieldBuffer.subarray(dataStart, dataEnd);
			extraFields.push({
				id: headerId,
				data: dataBuffer
			});
			i = dataEnd;
		}
		return extraFields;
	}
	function readAndAssertNoEof(reader, buffer, offset, length, position, callback) {
		if (length === 0) return setImmediate(function() {
			callback(null, newBuffer(0));
		});
		reader.read(buffer, offset, length, position, function(err, bytesRead) {
			if (err) return callback(err);
			if (bytesRead < length) return callback(/* @__PURE__ */ new Error("unexpected EOF"));
			callback();
		});
	}
	util.inherits(AssertByteCountStream, Transform);
	function AssertByteCountStream(byteCount) {
		Transform.call(this);
		this.actualByteCount = 0;
		this.expectedByteCount = byteCount;
	}
	AssertByteCountStream.prototype._transform = function(chunk, encoding, cb) {
		this.actualByteCount += chunk.length;
		if (this.actualByteCount > this.expectedByteCount) {
			var msg = "too many bytes in the stream. expected " + this.expectedByteCount + ". got at least " + this.actualByteCount;
			return cb(new Error(msg));
		}
		cb(null, chunk);
	};
	AssertByteCountStream.prototype._flush = function(cb) {
		if (this.actualByteCount < this.expectedByteCount) {
			var msg = "not enough bytes in the stream. expected " + this.expectedByteCount + ". got only " + this.actualByteCount;
			return cb(new Error(msg));
		}
		cb();
	};
	util.inherits(RandomAccessReader, EventEmitter$2);
	function RandomAccessReader() {
		EventEmitter$2.call(this);
		this.refCount = 0;
	}
	RandomAccessReader.prototype.ref = function() {
		this.refCount += 1;
	};
	RandomAccessReader.prototype.unref = function() {
		var self = this;
		self.refCount -= 1;
		if (self.refCount > 0) return;
		if (self.refCount < 0) throw new Error("invalid unref");
		self.close(onCloseDone);
		function onCloseDone(err) {
			if (err) return self.emit("error", err);
			self.emit("close");
		}
	};
	RandomAccessReader.prototype.createReadStream = function(options) {
		if (options == null) options = {};
		var start = options.start;
		var end = options.end;
		if (start === end) {
			var emptyStream = new PassThrough();
			setImmediate(function() {
				emptyStream.end();
			});
			return emptyStream;
		}
		var stream = this._readStreamForRange(start, end);
		var destroyed = false;
		var refUnrefFilter = new RefUnrefFilter(this);
		stream.on("error", function(err) {
			setImmediate(function() {
				if (!destroyed) refUnrefFilter.emit("error", err);
			});
		});
		installDestroyFn(refUnrefFilter, function() {
			stream.unpipe(refUnrefFilter);
			refUnrefFilter.unref();
			stream.destroy();
		});
		var byteCounter = new AssertByteCountStream(end - start);
		refUnrefFilter.on("error", function(err) {
			setImmediate(function() {
				if (!destroyed) byteCounter.emit("error", err);
			});
		});
		installDestroyFn(byteCounter, function() {
			destroyed = true;
			refUnrefFilter.unpipe(byteCounter);
			refUnrefFilter.destroy();
		});
		return stream.pipe(refUnrefFilter).pipe(byteCounter);
	};
	RandomAccessReader.prototype._readStreamForRange = function(start, end) {
		throw new Error("not implemented");
	};
	RandomAccessReader.prototype.read = function(buffer, offset, length, position, callback) {
		var readStream = this.createReadStream({
			start: position,
			end: position + length
		});
		var writeStream = new Writable();
		var written = 0;
		writeStream._write = function(chunk, encoding, cb) {
			chunk.copy(buffer, offset + written, 0, chunk.length);
			written += chunk.length;
			cb();
		};
		writeStream.on("finish", callback);
		readStream.on("error", function(error) {
			callback(error);
		});
		readStream.pipe(writeStream);
	};
	RandomAccessReader.prototype.close = function(callback) {
		setImmediate(callback);
	};
	util.inherits(RefUnrefFilter, PassThrough);
	function RefUnrefFilter(context) {
		PassThrough.call(this);
		this.context = context;
		this.context.ref();
		this.unreffedYet = false;
	}
	RefUnrefFilter.prototype._flush = function(cb) {
		this.unref();
		cb();
	};
	RefUnrefFilter.prototype.unref = function(cb) {
		if (this.unreffedYet) return;
		this.unreffedYet = true;
		this.context.unref();
	};
	var cp437 = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■\xA0";
	function decodeBuffer(buffer, isUtf8) {
		if (isUtf8) return buffer.toString("utf8");
		else {
			var result = "";
			for (var i = 0; i < buffer.length; i++) result += cp437[buffer[i]];
			return result;
		}
	}
	function readUInt64LE(buffer, offset) {
		var lower32 = buffer.readUInt32LE(offset);
		return buffer.readUInt32LE(offset + 4) * 4294967296 + lower32;
	}
	var newBuffer;
	if (typeof Buffer.allocUnsafe === "function") newBuffer = function(len) {
		return Buffer.allocUnsafe(len);
	};
	else newBuffer = function(len) {
		return new Buffer(len);
	};
	function installDestroyFn(stream, fn) {
		if (typeof stream.destroy === "function") stream._destroy = function(err, cb) {
			fn();
			if (cb != null) cb(err);
		};
		else stream.destroy = fn;
	}
	function defaultCallback(err) {
		if (err) throw err;
	}
}));
//#endregion
//#region src/main/helpers/trimTrailing.ts
var import_yauzl = /* @__PURE__ */ require_esm.__toESM(require_yauzl());
/** Linear trailing-trim: `value` with every trailing character matching
*  `singleCharRe` removed. The O(n) replacement for `/[…]+$/`-style
*  replaces, which re-scan long runs quadratically when the run isn't at
*  the end of the string (ant/no-super-linear-regex).
*  `singleCharRe` must match exactly one character — no quantifiers,
*  anchors, or the g flag. */
function trimTrailingCharsMatching(value, singleCharRe) {
	if (singleCharRe.global || singleCharRe.sticky) throw new Error("trimTrailingCharsMatching requires a non-global, non-sticky regex");
	let end = value.length;
	while (end > 0 && singleCharRe.test(value[end - 1])) end--;
	return value.slice(0, end);
}
//#endregion
//#region src/main/dxt/fileUtils.ts
/**
* Utility functions for DXT/MCPB archive file handling.
*/
/**
* Rejects an extracted archive whose entry names collide after filesystem
* normalization. Entries like `Manifest.json` (case-insensitive FS),
* `./manifest.json` (path.join drops the leading `./`), `.\manifest.json`
* on Windows (path.join treats `\` as a separator there), or
* `manifest.json.` (Win32 strips trailing dots/spaces from each component)
* can all land on the same on-disk path as `manifest.json`, so a later
* colliding entry could overwrite the one that was validated and shown in
* the consent dialog / passed to the blocklist check.
*
* The canonical form uses JS `toLowerCase()`, which is sufficient for
* the ASCII filenames that matter here (notably `manifest.json`); it
* does not attempt to match every filesystem's non-ASCII case-fold or
* Unicode-normalization rules.
*
* @throws Error on the first colliding entry, rejecting the whole archive
*/
function assertNoCollidingEntries(entryNames) {
	const seen = /* @__PURE__ */ new Set();
	for (const name of entryNames) {
		if (name.includes(":")) throw new Error(`Extension archive entry name contains ':': ${name}`);
		const canonical = node_path.default.posix.normalize(name.replace(/\\/g, "/")).split("/").map((seg) => trimTrailingCharsMatching(seg, /[. ]/)).filter(Boolean).join("/").toLowerCase();
		if (seen.has(canonical)) throw new Error(`Extension archive contains colliding entries: ${name}`);
		seen.add(canonical);
	}
}
//#endregion
//#region src/main/helpers/osMetadataFiles.ts
/**
* Check if a file path or name is OS-generated metadata that should be ignored.
*
* Works with both bare file/directory names (from readdir) and full paths
* (from zip entries). Case-insensitive — these files live on
* case-insensitive NTFS/APFS, where `Desktop.ini` and `THUMBS.DB` are the
* same droppings. Matches:
* - `.DS_Store` / `.localized` — macOS Finder metadata
* - `__MACOSX/` — Resource fork directory created by macOS Finder's "Compress"
* - `._*` — bare AppleDouble resource-fork siblings
* - `Thumbs.db` / `ehthumbs.db` — Windows Explorer thumbnail caches
* - `desktop.ini` — Windows Explorer folder customization
*/
function isOSMetadata(nameOrPath) {
	const lower = nameOrPath.toLowerCase();
	const name = (0, node_path.basename)(lower);
	return name === ".ds_store" || name === ".localized" || name === "__macosx" || name.startsWith("._") || name === "thumbs.db" || name === "ehthumbs.db" || name === "desktop.ini" || lower.startsWith("__macosx/");
}
//#endregion
//#region src/main/helpers/mutex.ts
/**
* A simple async mutex (write lock) that serializes access to a critical
* section. Callers are queued in FIFO order.
*
* Note: not reentrant. Calling `runExclusive` from within a held lock
* will deadlock.
*/
var Mutex = class {
	constructor() {
		this.tail = Promise.resolve();
		this.pendingCount = 0;
	}
	/**
	* Number of callers currently holding or queued for the lock. Lets
	* keyed-mutex-map owners evict entries only when nothing is in flight —
	* evicting a held mutex would let the next acquirer mint a fresh one and
	* run concurrently with the still-detached holder.
	*/
	get pending() {
		return this.pendingCount;
	}
	/**
	* Runs `fn` while holding the lock. The lock is released when `fn`
	* resolves or rejects.
	*/
	runExclusive(fn) {
		const prev = this.tail;
		let release;
		this.tail = new Promise((resolve) => {
			release = resolve;
		});
		this.pendingCount++;
		return (async () => {
			await prev;
			try {
				return await fn();
			} finally {
				this.pendingCount--;
				release();
			}
		})();
	}
};
//#endregion
//#region src/main/helpers/utilityProcessLogging.ts
/**
* Console stand-in for `@/main/logging` in utilityProcess worker bundles —
* the real module reads electron's `app` at module load. Every worker bundle
* gets the alias from `defineUtilityWorkerConfig`; the host relays each
* stdio line into the real logger, so no tag or level routing here.
*/
var logger = {
	debug: (...args) => console.debug(...args),
	info: (...args) => console.info(...args),
	warn: (...args) => console.warn(...args),
	error: (...args) => console.error(...args)
};
//#endregion
//#region src/main/safe-fs/unc.ts
/**
* UNC / symlink-hop primitives for safe-fs.
*
* These are the Windows-path guards that {@link SafeRoot.open} runs
* before `realpath` — they exist because on Windows, opening
* `\\host\share` (directly, or via a symlink/junction hop) initiates
* an SMB connection and leaks NTLM credentials to `host`. The guard
* therefore has to run *before* any syscall that would open the
* reparse target.
*
* Extracted from `helpers/path-safety.ts` so `safe-fs` has no outward
* dependency on `helpers/` (which transitively pulls in `logging` and
* half the app): this module imports node builtins only.
* `path-safety.ts` re-exports everything here for back-compat, and
* `helpers/privateFile.ts` imports the WSL/UNC predicates directly —
* privateFile sits in `index.pre`'s graph (indexPreGraphGuard), so
* keep it that way.
*/
var NT_NAMESPACE_RE = /^[\\/]\?\?[\\/]/;
function isUncPath(p) {
	if (NT_NAMESPACE_RE.test(p)) return true;
	const n = node_path.default.normalize(p);
	return n.startsWith("\\\\") || n.startsWith("//") || NT_NAMESPACE_RE.test(n);
}
var WSL_UNC_RE = /^[\\/]{2}(wsl\$|wsl\.localhost)(?=[\\/]|$)/i;
/** RAW \\wsl$ form — must fail closed at the gate: callers resolve the
*  ORIGINAL string, and MUP falls through wsl$ to SMB on non-WSL hosts
* . */
var RAW_WSL_DOLLAR_RE = /^[\\/]{2}wsl\$(?=[\\/]|$)/i;
/** Raw \\wsl$ test for consumers outside the hop walks (plugin copy
* filters etc.) — the walks check raw readlink
*  output internally; everything else that handles link targets must be
*  able to apply the same refusal. */
function isRawWslDollarPath(p) {
	return RAW_WSL_DOLLAR_RE.test(p);
}
function isWslUncPath(p) {
	return WSL_UNC_RE.test(p);
}
/**
* Canonicalize a WSL UNC path to a stable form for use as a map key.
* Windows surfaces the same WSL distro as both \\wsl$\… and \\wsl.localhost\…
* (and git returns //wsl.localhost/… with forward slashes), so without this
* the same directory produces different projects[...] keys depending on which
* component handed us the path.
*/
function canonicalizeWslPath(p) {
	if (!isWslUncPath(p)) return p;
	return p.replace(/\//g, "\\").replace(/^\\\\(wsl\$|wsl\.localhost)(\\[^\\]+)?/i, (_m, _host, distro = "") => `\\\\wsl.localhost${distro.toLowerCase()}`);
}
/** UNC path that could reach SMB (i.e. not a local WSL 9P mount). */
function isUnsafeUnc(p) {
	return isUncPath(p) && !isWslUncPath(p);
}
/** libuv's readlink TRANSLATES substitute names and is LOSSY: a
* \??\-prefixed target comes back with the prefix STRIPPED, so
* \??\GLOBALROOT\Device\Mup\... reads as the relative-looking
* GLOBALROOT\Device\Mup\... and sailed past the prefix regex
* (proven by win32 CI). Stripped forms are first-segment
* NT roots; a local dir literally named GLOBALROOT false-positives
* into fail-closed, which is the bizarre-name class we already
* accept. */
var NT_STRIPPED_TARGET_RE = /^(global\?\?|globalroot|unc|device|dosdevices|volume\{[^\\/]*\})[\\/]/i;
/** NT-native / DOS-device namespace shapes in a link TARGET,
* family-complete: libuv's readlink translates benign
*  junctions to plain `C:\...` or `\\host\share`; a RAW namespace
*  form surviving into readlink output is an exotic plant shape, and
*  several members reach the network redirector where mere resolution
*  authenticates (`\??\UNC\`, `\\?\UNC\`, `\\.\UNC\`,
*  `\??\GLOBALROOT\Device\Mup\`, `\Device\Mup\`,
*  `\Device\LanmanRedirector\`). Matching only the UNC member would
*  leave the siblings as live bypasses, so the whole family fails
*  closed: `\??\` / `\GLOBAL??\` / `\DosDevices\` object-manager
*  roots, `\\?\` / `\\.\` device prefixes, and raw `\Device\`,
*  case-insensitive, both slash kinds. Layering note: on win32, libuv
*  readlink only TRANSLATES `\??\<drive>` and `\??\UNC\` substitute
*  names and EINVALs on every other reparse form — so non-translatable
*  members are already covered by the readlink-failure→fail-closed
*  layer, and this regex is the belt for translatable and POSIX-raw
*  survivors. */
var NT_NAMESPACE_TARGET_RE = /^([\\/](\?\?|global\?\?|dosdevices)[\\/]|[\\/]{2}[?.][\\/]|[\\/]device[\\/])/i;
function isNtNamespaceTarget(p) {
	return NT_NAMESPACE_TARGET_RE.test(p);
}
/** THE hop-walk target check: the union of the UNC shape and the
* NT-namespace family, slightly wider than the name — the volume-GUID
* member is CONCEALMENT-PARITY rather than network-reaching (a
* \??\Volume{guid} substitute names the same local bytes a drive
* letter would, and its stripped form must classify like its
* drive-letter twin, not as dangling); refusal lands in the same
* fail-closed place either way. Both hop
*  walks (async + sync twins) call THIS, so a member cannot be present
*  in one twin and absent in the other by construction — the sync twin
*  missed the family exactly because the union used to be spelled out
*  at each site. Deliberately separate from isUnsafeUnc, whose ~36
*  plain-path callers should not silently change behavior. */
function isNetworkReachingTarget(p) {
	return isUnsafeUnc(p) || isNtNamespaceTarget(p) || process.platform === "win32" && NT_STRIPPED_TARGET_RE.test(p);
}
/**
* Lowercase UNC host of `p`, or null for non-UNC and local device
* namespaces (`\\?\C:\…`, `\\.\…`, and the NT-namespace `\??\…` forms —
* those are never host-scopable). Handles the long-path form
* `\\?\UNC\host\…`. Used by {@link assertNoUncSymlinkHop} to scope
* `allowRootUnc` to the host the input path is on.
*/
function uncHost(p) {
	const n = node_path.default.normalize(p).replace(/\//g, "\\");
	const long = n.match(/^\\\\[?.]\\UNC\\([^\\]+)/i);
	if (long) return long[1].toLowerCase();
	if (/^\\\\[?.]\\/.test(n)) return null;
	const m = n.match(/^\\\\([^\\]+)/);
	return m ? m[1].toLowerCase() : null;
}
/** Thrown by {@link assertNoUncSymlinkHop} when a hop targets UNC. */
var UncHopError = class extends Error {};
/** Thrown by {@link assertNoUncSymlinkHop} when MAX_SYMLINK_HOPS is exceeded. */
var HopLimitError = class extends Error {};
/**
* Thrown by {@link assertNoUncSymlinkHop} when a segment cannot be
* VERIFIED (transient EPERM/EBUSY/EACCES on the guard's own lstat — the
* AV/indexer-contention class), as opposed to a positively-detected UNC
* hop. Subclasses {@link UncHopError} so every existing `instanceof
* UncHopError` deny path keeps denying; consumers that surface messages
* (e.g. support-log sanitizers) can distinguish "rejected: UNC" from
* "couldn't verify, retry later". Carries the underlying errno as `code`
* so the errno-preserving classifiers (orgPluginEnumerator/-Scanner's
* "preserve a real errno when present" pattern) record the truth instead
* of falling through to their EUNCHOP default.
*/
var UncVerifyError = class extends UncHopError {
	constructor(message, code) {
		super(message);
		this.code = code;
	}
};
var MAX_SYMLINK_HOPS = 40;
var SEG_SPLIT = process.platform === "win32" ? /[\\/]+/ : /\/+/;
/**
* Gate: throws if any symlink hop along p's component chain has a UNC target.
* Call before fs.realpath / realpathWithAncestor — on Windows those open the
* reparse target via CreateFileW, which for \\host\share initiates SMB and
* leaks NTLM. This walks lstat+readlink (which read reparse data without
* opening the target) and rejects first. Not a resolver — fs.realpath does
* the actual canonicalization after this passes.
*/
async function assertNoUncSymlinkHop(p, opts) {
	p = canonicalizeWslPath(p);
	if (NT_NAMESPACE_RE.test(p)) throw new UncHopError(`UNC path not allowed: ${p}`);
	if (!opts?.allowRootUnc && isUnsafeUnc(p)) throw new UncHopError(`UNC path not allowed: ${p}`);
	const allowedHost = opts?.allowRootUnc ? uncHost(p) : null;
	if (opts?.refuseSubstitutedPath) return walkRefusedNamespaces(p, opts, allowedHost);
	let cur = node_path.default.resolve(p);
	let hops = 0;
	let wslRooted = false;
	for (;;) {
		if ((isUnsafeUnc(cur) || opts?.rejectWslHops && isWslUncPath(cur)) && !(allowedHost !== null && uncHost(cur) === allowedHost)) throw new UncHopError(`UNC path not allowed: ${cur}`);
		if (isWslUncPath(cur)) wslRooted = true;
		const { root } = node_path.default.parse(cur);
		const segs = cur.slice(root.length).split(SEG_SPLIT).filter(Boolean);
		let walked = root;
		let i = 0;
		let st = null;
		for (; i < segs.length; i++) {
			walked = node_path.default.join(walked, segs[i]);
			try {
				st = await (0, node_fs_promises.lstat)(walked) ?? null;
			} catch (err) {
				const code = err.code;
				if (code === "ENOENT" || code === "ENOTDIR") return null;
				throw new UncVerifyError(`Cannot verify segment: ${walked} (${code})`, code);
			}
			if (!st) return null;
			if (st.isSymbolicLink()) break;
		}
		if (i === segs.length) {
			if (segs.length === 0) try {
				const rootSt = await (0, node_fs_promises.lstat)(cur);
				return wslRooted ? "wslBoundary" : rootSt;
			} catch (e) {
				const code = e.code;
				if (code === "ENOENT" || code === "ENOTDIR") return null;
				throw new UncVerifyError(`Cannot verify bare-root chain terminus: ${cur}`, code);
			}
			return wslRooted ? "wslBoundary" : st;
		}
		if (++hops > MAX_SYMLINK_HOPS) throw new HopLimitError(`Symlink hop limit exceeded: ${p}`);
		let rawTarget;
		try {
			rawTarget = await (0, node_fs_promises.readlink)(walked);
		} catch (err) {
			const code = err.code;
			throw new UncVerifyError(`Cannot read link: ${walked} (${code})`, code);
		}
		const target = canonicalizeWslPath(rawTarget);
		if (RAW_WSL_DOLLAR_RE.test(rawTarget)) throw new UncHopError(`Symlink to raw wsl$ target: ${walked} -> ${rawTarget}`);
		if (isWslUncPath(target)) throw new UncHopError(`Symlink to UNC target: ${walked} -> ${target}`);
		if (isNetworkReachingTarget(target)) throw new UncHopError(`Symlink to UNC target: ${walked} -> ${target}`);
		cur = node_path.default.resolve(node_path.default.dirname(walked), target, ...segs.slice(i + 1));
		if (isWslUncPath(cur) && !wslRooted) throw new UncHopError(`Symlink chain into a WSL target: ${cur}`);
		wslRooted = isWslUncPath(cur);
	}
}
/**
* Physical worklist walk for callers that arm {@link
* AssertNoUncSymlinkHopOptions.refuseSubstitutedPath}: symlink targets are
* substituted segment-by-segment onto the worklist instead of being
* lexically collapsed, so a `..` inside a target pops only ground this walk
* has already lstat-verified — never a component whose symlink-ness is
* still unknown (the esc/../net shape). The predicate runs on every
* candidate BEFORE its lstat, so a refused namespace is never contacted.
* Same return contract as {@link assertNoUncSymlinkHop}; the terminal
* classification comes from a fresh lstat of the fully-verified endpoint
* — every component of `acc` was lstat-checked non-link above, and the
* per-candidate lstat can predate trailing `..` pops (or never ran, for
* a bare-root terminus), so the endpoint needs its own non-following
* stat. Keep in lockstep with {@link walkRefusedNamespacesSync}.
*/
async function walkRefusedNamespaces(p, opts, allowedHost) {
	const refuse = opts.refuseSubstitutedPath;
	const resolved = node_path.default.resolve(p);
	const { root } = node_path.default.parse(resolved);
	const stack = resolved.slice(root.length).split(SEG_SPLIT).filter(Boolean);
	let acc = root;
	let hops = 0;
	let wslRooted = false;
	while (stack.length > 0) {
		const seg = stack.shift();
		if (seg === ".") continue;
		if (seg === "..") {
			acc = node_path.default.dirname(acc);
			continue;
		}
		const candidate = node_path.default.join(acc, seg);
		if (refuse(candidate)) throw new UncHopError(`Path through refused namespace: ${candidate}`);
		if ((isUnsafeUnc(candidate) || opts.rejectWslHops && isWslUncPath(candidate)) && !(allowedHost !== null && uncHost(candidate) === allowedHost)) throw new UncHopError(`UNC path not allowed: ${candidate}`);
		{
			const candIsWsl = isWslUncPath(candidate);
			if (candIsWsl && !wslRooted && hops > 0) throw new UncHopError(`Symlink chain into a WSL target: ${candidate}`);
			wslRooted = candIsWsl;
		}
		let st;
		try {
			st = await (0, node_fs_promises.lstat)(candidate) ?? null;
		} catch (err) {
			const code = err.code;
			if (code === "ENOENT" || code === "ENOTDIR") return null;
			throw new UncVerifyError(`Cannot verify segment: ${candidate} (${code})`, code);
		}
		if (!st) return null;
		if (!st.isSymbolicLink()) {
			acc = candidate;
			continue;
		}
		if (++hops > MAX_SYMLINK_HOPS) throw new HopLimitError(`Symlink hop limit exceeded: ${p}`);
		let rawTarget;
		try {
			rawTarget = await (0, node_fs_promises.readlink)(candidate);
		} catch (err) {
			const code = err.code;
			throw new UncVerifyError(`Cannot read link: ${candidate} (${code})`, code);
		}
		const target = canonicalizeWslPath(rawTarget);
		if (RAW_WSL_DOLLAR_RE.test(rawTarget)) throw new UncHopError(`Symlink to raw wsl$ target: ${candidate} -> ${rawTarget}`);
		if (isWslUncPath(target)) throw new UncHopError(`Symlink to UNC target: ${candidate} -> ${target}`);
		if (isNetworkReachingTarget(target)) throw new UncHopError(`Symlink to UNC target: ${candidate} -> ${target}`);
		const targetRoot = node_path.default.parse(target).root;
		if (targetRoot !== "") {
			acc = /^[\\/]+$/.test(targetRoot) ? node_path.default.parse(acc).root : targetRoot;
			stack.unshift(...target.slice(targetRoot.length).split(SEG_SPLIT).filter(Boolean));
		} else stack.unshift(...target.split(SEG_SPLIT).filter(Boolean));
	}
	if (isWslUncPath(acc)) return "wslBoundary";
	let endSt;
	try {
		endSt = await (0, node_fs_promises.lstat)(acc) ?? null;
	} catch (e) {
		const code = e.code;
		if (code === "ENOENT" || code === "ENOTDIR") return null;
		throw new UncVerifyError(`Cannot verify chain terminus: ${acc} (${code})`, code);
	}
	if (endSt?.isSymbolicLink()) throw new UncVerifyError(`Chain terminus changed under the walk: ${acc}`, "EAGAIN");
	return endSt;
}
//#endregion
//#region src/shared/runtimeChecks.ts
/**
* Returns true if the app is running as an MSIX-packaged Windows app,
* as opposed to a Squirrel-installed app. Used to route to the correct
* auto-updater implementation.
*
* Checks two signals:
* 1. process.windowsStore — Electron's built-in detection (unreliable on some machines)
* 2. App exe path under C:\Program Files\WindowsApps\ — filesystem-based fallback
*/
function isRunningAsMsix() {
	return false;
}
/**
* Extract the MSIX Package Family Name from the app's executable path.
* Pure string manipulation — no native dependencies, safe for shared code.
*
* MSIX apps run from:
*   C:\Program Files\WindowsApps\{Name}_{Version}_{Arch}_{ResourceId}_{PublisherId}\...
* Package Family Name = {Name}_{PublisherId}
*
* Returns undefined if not running as MSIX or if extraction fails.
*/
function extractMsixPackageFamilyFromExePath() {
	if (!isRunningAsMsix()) return;
	try {
		const parts = process.execPath.split(/[\\/]/);
		const waIdx = parts.findIndex((p) => p.toLowerCase() === "windowsapps");
		if (waIdx === -1 || waIdx + 1 >= parts.length) return;
		const segments = parts[waIdx + 1].split("_");
		if (segments.length < 5) return;
		const name = segments[0];
		const publisherId = segments[segments.length - 1];
		if (!name || !publisherId) return;
		return `${name}_${publisherId}`;
	} catch {
		return;
	}
}
//#endregion
//#region src/main/helpers/privateFile.ts
/**
* Owner-only file write helpers. Default for anything written under
* userData — configs, session state, logs, credentials.
*
* Motivation: HackerOne #3508836 (and two prior reports) flagged files
* written with the default mode (0o666 − umask → 0o644 on macOS/Linux),
* letting any local process read conversation history, SSH configs, etc.
* Each report got a spot-fix; this module is the systemic one.
*
* Guarantees:
*  - New files are created 0o600 from the first byte — no transient window
*    where the inode exists with a permissive mode.
*  - Existing files are tightened to 0o600 on next write. For the atomic
*    path this falls out of rename replacing the inode; for streams we
*    chmod before opening.
*
* Windows: POSIX mode bits only control the read-only flag and don't map
* to ACLs. Passing `mode` is a harmless no-op; chmod is skipped. Per-user
* isolation on Windows comes from the default profile ACLs on %APPDATA%.
*/
var eventSink = null;
var pendingEvents = [];
var PENDING_EVENTS_CAP = 32;
function emitPrivateFileEvent(deliver) {
	if (eventSink !== null) deliver(eventSink);
	else if (pendingEvents.length < PENDING_EVENTS_CAP) pendingEvents.push(deliver);
}
var isWindows$2 = process.platform === "win32";
var LOCK_RETRY_ATTEMPTS = 3;
var LOCK_RETRY_BACKOFF_MS = 50;
var TRANSIENT_LOCK_ERRNOS = /* @__PURE__ */ new Set([
	"EPERM",
	"EBADF",
	"EACCES",
	"EBUSY"
]);
/** Errnos that indicate a TRANSIENT canonicalization failure (never a
*  reparse-shape signature): the lock set plus fd exhaustion and
*  concurrent removal. Used by {@link assertCanonicalLeafWin32} to keep
*  transient failures out of the PlantDetectedError-gated metric. */
var TRANSIENT_CANONICALIZE_ERRNOS = /* @__PURE__ */ new Set([
	...TRANSIENT_LOCK_ERRNOS,
	"EMFILE",
	"ENFILE",
	"ENOENT"
]);
/**
* Retry `op` on transient Windows file-lock errnos with linear backoff.
* Rethrows immediately on any other errno; rethrows the last lock errno
* once attempts are exhausted.
*
* Exported for callers that do their own cleanup `rm()` in the same
* directory and want the same lock tolerance (e.g., session orphan
* recovery).
*/
async function retryTransientLock(op) {
	let lastErr;
	for (let attempt = 0; attempt < LOCK_RETRY_ATTEMPTS; attempt++) try {
		return await op();
	} catch (err) {
		const code = err.code;
		if (code == null || !TRANSIENT_LOCK_ERRNOS.has(code)) throw err;
		lastErr = err;
		if (attempt < LOCK_RETRY_ATTEMPTS - 1) await (0, node_timers_promises.setTimeout)(LOCK_RETRY_BACKOFF_MS * (attempt + 1));
	}
	throw lastErr;
}
var writeMutexes = /* @__PURE__ */ new Map();
function acquireMutex(key) {
	let entry = writeMutexes.get(key);
	if (!entry) {
		entry = {
			mutex: new Mutex(),
			refs: 0
		};
		writeMutexes.set(key, entry);
	}
	entry.refs++;
	return entry.mutex;
}
function releaseMutex(key) {
	const entry = writeMutexes.get(key);
	if (entry && --entry.refs === 0) writeMutexes.delete(key);
}
/**
* The reviewed in-place private write: identity-pinned, handle-gated,
* symlink/hardlink/FIFO-refusing, permission-tightening — with the
* blind-pin (unverifiable-identity volume) branch falling back to
* detach-and-recreate. Extracted so every direct-write
* fallback shares ONE primitive instead of hand-rolling copies that
* drift (writeSessionToDisk's hand-rolled copy had re-introduced a
* rm+wx loss window this primitive closes).
*
* Callers own errno filtering: this throws honest errors (ELOOP/EINVAL/
* EMLINK/ENXIO/EEXIST/fs errnos) and never silently degrades.
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
async function writeFileInPlacePrivate(filePath, content, mode = 384) {
	await preTraversalReparseGate(filePath);
	await assertNoSymlinkBelowBoundary(filePath);
	await assertLeafNoNetworkLinkWin32(filePath);
	const pre = await (0, node_fs_promises.lstat)(filePath, { bigint: true }).catch((e) => {
		if (e.code === "ENOENT") return null;
		throw e;
	});
	if (pre && (!pre.isFile() || pre.nlink > 1n)) {
		const err = /* @__PURE__ */ new Error(pre.isFile() ? `refusing direct-write to multi-link inode (nlink=${pre.nlink}): ${filePath}` : `refusing direct-write through non-regular file: ${filePath}`);
		err.code = "ELOOP";
		throw err;
	}
	const fh = await (0, node_fs_promises.open)(filePath, node_fs.constants.O_WRONLY | (pre === null ? node_fs.constants.O_CREAT | node_fs.constants.O_EXCL : 0) | (node_fs.constants.O_NOFOLLOW ?? 0) | (node_fs.constants.O_NONBLOCK ?? 0), mode);
	let closed = false;
	let createBlindInPlace = false;
	let createIdentityMismatch = null;
	try {
		const st = await assertRegularSingleLink(fh, filePath, "direct-write");
		if (pre === null && (node_fs.constants.O_NOFOLLOW ?? 0) === 0) {
			const after = await (0, node_fs_promises.lstat)(filePath, { bigint: true });
			if (after.isSymbolicLink()) {
				const err = /* @__PURE__ */ new Error(`create-path redirected through a planted symlink: ${filePath}`);
				err.code = "ELOOP";
				throw err;
			}
			const id = classifyCreateIdentity(st, after);
			createBlindInPlace = id.needsReadback;
			createIdentityMismatch = id.mismatch;
			if (id.mismatch !== null) await proveCreatePathServesHandle(fh, filePath, id.mismatch);
		}
		if (isWindows$2 && pre !== null && (pre.ino === 0n || st.ino === 0n || pre.dev === 0n || st.dev === 0n)) {
			closed = true;
			await fh.close();
			await retryTransientLock(async () => {
				await (0, node_fs_promises.rm)(filePath, { force: true });
				await writeExclusiveVerifiedPrivate(filePath, content, mode);
			});
		} else {
			if (pre && (st.dev !== pre.dev || st.ino !== pre.ino)) {
				const err = /* @__PURE__ */ new Error(`refusing direct-write: file identity changed between check and open: ${filePath}`);
				err.code = "ELOOP";
				throw err;
			}
			if (!isWindows$2) await fh.chmod(mode);
			await fh.truncate(0);
			if (createIdentityMismatch !== null) await writeAllAt(fh, content);
			else await fh.writeFile(content);
			await fh.sync();
			if (createBlindInPlace) await assertPathServesHandleBytes(fh, filePath, content).catch((err) => {
				logIdentityMismatchRefusal(createIdentityMismatch, filePath);
				throw err;
			});
		}
	} finally {
		if (!closed) await fh.close().catch((closeErr) => {
			logger.warn("[private-file] cleanup close failed after direct write:", closeErr?.code);
		});
	}
}
/** Fd-shape gate for writeFileInPlacePrivate (its only caller): a
*  handle must be a regular, single-link file before any byte moves.
*  Hardlinks redirect exactly like symlinks. */
async function assertRegularSingleLink(fh, filePath, verb) {
	const st = await fh.stat({ bigint: true });
	if (!st.isFile() || st.nlink > 1n) {
		const err = /* @__PURE__ */ new Error(!st.isFile() ? `refusing ${verb} to non-regular file: ${filePath}` : `refusing ${verb} to multi-link inode (nlink=${st.nlink}): ${filePath}`);
		err.code = !st.isFile() ? "EINVAL" : "EMLINK";
		throw err;
	}
	return st;
}
/** Create-path identity classification where O_NOFOLLOW is absent: any
*  zero id proves nothing (ReFS/SMB report no file index), and unequal
*  NONZERO ids are not proof of a plant either — profile filter drivers
*  (FSLogix/Citrix-managed AppData) can serve the write handle and the
*  path lstat from different backing files. Both shapes demand the
*  content-anchored readback proof, and a mismatch additionally demands
*  the pre-payload nonce proof (proveCreatePathServesHandle) so no
*  private byte reaches an unproven target; `mismatch` carries both id
*  pairs for the logs. */
function classifyCreateIdentity(handle, path) {
	const blind = path.ino === 0n || path.dev === 0n || handle.ino === 0n || handle.dev === 0n;
	const mismatch = !blind && (path.dev !== handle.dev || path.ino !== handle.ino) ? `handle {dev=${handle.dev},ino=${handle.ino}} path {dev=${path.dev},ino=${path.ino}}` : null;
	return {
		needsReadback: blind || mismatch !== null,
		mismatch
	};
}
function logIdentityMismatchRefusal(mismatch, filePath) {
	if (mismatch !== null) logger.error(`[private-file] create-path readback refused after identity mismatch (${mismatch}): ${filePath}`);
}
async function writeAllAt(fh, content) {
	const buf = typeof content === "string" ? Buffer.from(content, "utf-8") : Buffer.from(content);
	let written = 0;
	while (written < buf.length) {
		const { bytesWritten } = await fh.write(buf, written, buf.length - written, written);
		written += bytesWritten;
	}
}
/** Pre-payload proof for a nonzero create-path identity mismatch: the
*  path must serve a random nonce written through the handle BEFORE any
*  private byte is written, so a redirected create discloses nothing —
*  a mirroring profile filter passes, a decoy swap cannot predict the
*  nonce and refuses with only random bytes at the redirect target. */
async function proveCreatePathServesHandle(fh, filePath, mismatch) {
	const nonce = (0, node_crypto.randomBytes)(32);
	await writeAllAt(fh, nonce);
	await fh.sync();
	try {
		await assertPathServesHandleBytes(fh, filePath, nonce);
	} catch (err) {
		logIdentityMismatchRefusal(mismatch, filePath);
		throw err;
	}
	await fh.truncate(0);
	logger.warn(`[private-file] create-path identity mismatch (${mismatch}) passed the content proof: ${filePath}`);
}
/**
* Write a file atomically (write to .tmp, then rename over the target)
* with owner-only permissions.
*
* The tmp file is a fresh inode created with `mode`, so the mode always
* applies. rename(2) moves that inode to the target path — replacing
* whatever was there — so a previously-0o644 target is fixed on next
* write with no chmod and no window where new data sits in a
* world-readable file.
*
* Windows quirks (see marketplaceFileOps history for context):
* - EPERM/EBADF/EACCES/EBUSY: transient AV or backup-sync lock on the
*   target — retried with backoff.
* - EXDEV: folder redirection / roaming profile backing AppData\Roaming
*   with a network share + Offline Files cache. The .tmp lands in the
*   local cache, the target lives on the share, rename crosses that
*   boundary. Never succeeds on retry — falls through to direct write.
*
* A per-path Mutex serializes concurrent writeFileAtomic calls to the
* same target so two writers can't interleave (or share a .tmp path)
* even when rename fails. Writes to different paths proceed in parallel.
*/
function writeFileAtomic(filePath, content, mode = 384) {
	const key = (0, node_path.resolve)(filePath);
	return acquireMutex(key).runExclusive(async () => {
		await preTraversalReparseGate(filePath);
		await assertNoSymlinkBelowBoundary(filePath);
		await (0, node_fs_promises.mkdir)((0, node_path.dirname)(filePath), { recursive: true });
		const tmpFile = `${filePath}.tmp`;
		await retryTransientLock(async () => {
			await (0, node_fs_promises.rm)(tmpFile, { force: true });
			await writeExclusiveVerifiedPrivate(tmpFile, content, mode);
		});
		let lastErr;
		for (let attempt = 0; attempt < LOCK_RETRY_ATTEMPTS; attempt++) try {
			await (0, node_fs_promises.rename)(tmpFile, filePath);
			return;
		} catch (err) {
			const errnoErr = err;
			const code = errnoErr.code;
			if (code === "EXDEV") {
				lastErr = errnoErr;
				break;
			}
			if (code != null && TRANSIENT_LOCK_ERRNOS.has(code)) {
				lastErr = errnoErr;
				if (attempt < LOCK_RETRY_ATTEMPTS - 1) await (0, node_timers_promises.setTimeout)(LOCK_RETRY_BACKOFF_MS * (attempt + 1));
				continue;
			}
			throw err;
		}
		logger.warn(`[privateFile] rename(${tmpFile} → ${filePath}) failed (${lastErr?.code}), falling back to direct write`, lastErr);
		await writeFileInPlacePrivate(filePath, content, mode);
		try {
			await (0, node_fs_promises.rm)(tmpFile, { force: true });
		} catch (rmErr) {
			logger.warn(`[privateFile] failed to clean up ${tmpFile}:`, rmErr);
		}
	}).finally(() => releaseMutex(key));
}
/**
* createWriteStream that opens the file 0o600. For append-mode log
* streams where atomic write+rename doesn't fit (MCP process output,
* winston transports that manage their own stream lifecycle).
*
* Tightens an existing file synchronously BEFORE opening the stream, so
* no bytes flow into a world-readable inode. Best-effort like tightenSync
* — a chmod failure (EPERM, EROFS) warns but doesn't prevent the stream
* from opening, since callers may use this at module load and a throw
* would crash the app. New files are still created 0o600 via the mode
* option regardless of the chmod outcome.
*/
function createWriteStreamPrivate(filePath, options = {}) {
	if (!options.flags?.includes("x")) tightenSync(filePath);
	return (0, node_fs.createWriteStream)(filePath, {
		...options,
		mode: 384
	});
}
/**
* Synchronously tighten an existing file to 0o600. Best-effort: no-op on
* Windows, when the file doesn't exist, or when chmod fails for any
* reason (EPERM, EROFS, etc.). Called at module load in several loggers
* — a throwing chmod here would crash the app on startup, which is worse
* than a permissive log file. Pair with PRIVATE_STREAM_OPTIONS so the
* file is tight whether it already exists or winston creates it fresh.
*/
function tightenSync(filePath) {
	if (isWindows$2) return;
	try {
		(0, node_fs.chmodSync)(filePath, 384);
	} catch (e) {
		const code = e.code;
		if (code !== "ENOENT") logger.warn(`[privateFile] tightenSync(${filePath}) failed: ${code}`);
	}
}
/** WIN32 LEAF SYMLINK GATE: where O_NOFOLLOW is 0 the leaf
*  open FOLLOWS whatever sits at the path. The original shape
*  readlink'd one hop and refused network-reaching targets — defeated
*  zero-race by a local-intermediate chain (leaf → local B →
*  \\attacker\\share): one readlink sees only the benign hop while the
*  kernel resolves recursively. Now: refuse ANY leaf symlink at these
*  sites — every caller already treats a leaf symlink as
*  refuse-worthy, and POSIX O_NOFOLLOW refuses them at the open, so
*  this makes win32 CONSISTENT with POSIX rather than weaker; the
*  chain bypass dies definitionally (no hop inspection to defeat).
*  lstat failures fail CLOSED except positively-verified absence
*  (ENOENT/ENOTDIR — the open's own create/ENOENT semantics apply):
*  a deny-ACE on a planted link must not restore the zero-race dial.
*  Residual: the lstat→open swap race remains (one fast race) — only
*  real O_NOFOLLOW closes the class. No-op where it is real. */
/** Exported for direct unit testing — the gate's static-symlink arm is
*  pre-empted by per-site belts in integration, so only direct calls
*  exercise ITS behavior; its production value is the shrunk
*  lstat→open gap, which no static test can isolate.
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
async function assertLeafNoNetworkLinkWin32(filePath) {
	if ((node_fs.constants.O_NOFOLLOW ?? 0) !== 0) return;
	let leaf;
	try {
		leaf = await (0, node_fs_promises.lstat)(filePath);
	} catch (err) {
		const code = err.code;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		const gateErr = /* @__PURE__ */ new Error(`cannot verify leaf before O_NOFOLLOW-less open (${code}): ${filePath}`);
		gateErr.code = "ELOOP";
		throw gateErr;
	}
	if (leaf.isSymbolicLink()) {
		const err = /* @__PURE__ */ new Error(`refusing O_NOFOLLOW-less open through a leaf symlink: ${filePath}`);
		err.code = "ELOOP";
		throw err;
	}
}
/** Blind-volume secondary proof: where dev/ino report 0
*  (ReFS/SMB redirected AppData — exactly the volume class the blind
*  arms exist for), the post-create identity compare proves nothing, so
*  a dangling-symlink redirect with a regular-file decoy swapped at the
*  path passes the lstat check. After write+sync the PATH must serve a
*  non-symlink regular file containing exactly the written bytes.
*
*  The readback itself is gated — a bare readFile would be the very
*  forbidden open this module prohibits (a symlink swapped in after
*  the create-time lstat would be followed, UNC targets dialing SMB):
*  lstat immediately before the read refuses symlinks, the read is
*  handle-based and gated on size equality before any bytes are
*  pulled, and a post-read
*  lstat refuses a swap that raced the first check — an attacker must
*  now win two opposite-direction swaps inside the sandwich AND place
*  matching bytes.
*
*  WHAT THIS DOES AND DOES NOT GUARANTEE: on detection the handle is
*  truncated, so DETECTED redirects never keep content. An attacker who
*  wins the double race can still leave a same-bytes COPY at the
*  redirect target while the path shows a matching decoy — this
*  primitive narrows the O_NOFOLLOW-less win32 create to
*  attacker-chooses-location-but-not-content with a multi-race
*  requirement; it cannot eliminate it. Callers must not treat it as a
*  containment guarantee (the jail boundary work is the containment). */
async function assertPathServesHandleBytes(fh, filePath, content) {
	const fail = async (cause) => {
		await fh.truncate(0).catch((truncErr) => {
			logger.error("[private-file] readback-mismatch truncate failed — redirected content may persist:", truncErr?.code);
		});
		const causeCode = cause instanceof Error && cause.message.startsWith("create-path readback mismatch") ? void 0 : cause?.code;
		const err = /* @__PURE__ */ new Error(`create-path readback mismatch on an identity-blind volume: ${filePath}${causeCode ? ` (${causeCode})` : ""}`);
		err.code = "ELOOP";
		throw err;
	};
	let rfh = null;
	try {
		const expected = typeof content === "string" ? Buffer.from(content, "utf-8") : Buffer.from(content);
		const preRead = await (0, node_fs_promises.lstat)(filePath).catch(() => null);
		if (preRead === null || preRead.isSymbolicLink() || !preRead.isFile()) return await fail();
		await assertLeafNoNetworkLinkWin32(filePath);
		rfh = await (0, node_fs_promises.open)(filePath, node_fs.constants.O_RDONLY | (node_fs.constants.O_NOFOLLOW ?? 0) | (node_fs.constants.O_NONBLOCK ?? 0));
		const rst = await rfh.stat();
		if (!rst.isFile() || rst.size !== expected.length) return await fail();
		const buf = Buffer.alloc(expected.length);
		let total = 0;
		while (total < expected.length) {
			const { bytesRead } = await rfh.read(buf, total, expected.length - total, total);
			if (bytesRead === 0) break;
			total += bytesRead;
		}
		if (total !== expected.length || Buffer.compare(buf, expected) !== 0) return await fail();
		const postRead = await (0, node_fs_promises.lstat)(filePath).catch(() => null);
		if (postRead === null || postRead.isSymbolicLink() || !postRead.isFile()) return await fail();
	} catch (err) {
		return await fail(err);
	} finally {
		if (rfh !== null) await rfh.close().catch(() => void 0);
	}
}
/** Handle-based exclusive create with the win32 create-path
*  verification: on Windows CREATE_NEW reparses a
*  DANGLING symlink and creates at its target — a co-writer who
*  replants one at a deterministic .tmp path in the rm→create window
*  redirects a privileged write. O_EXCL refuses an EXISTING symlink on
*  every platform; where O_NOFOLLOW is absent (win32: 0) the post-
*  create lstat identity check — readback-proven when identity is
*  blind or mismatched — closes the dangling case. fsync'd —
*  callers substitute this for rename-durability paths.
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
async function writeExclusiveVerifiedPrivate(filePath, content, mode = 384) {
	await preTraversalReparseGate(filePath);
	await assertNoSymlinkBelowBoundary(filePath);
	await assertLeafNoNetworkLinkWin32(filePath);
	const wfh = await (0, node_fs_promises.open)(filePath, node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_EXCL | (node_fs.constants.O_NOFOLLOW ?? 0), mode);
	try {
		let createBlind = false;
		let identityMismatch = null;
		if ((node_fs.constants.O_NOFOLLOW ?? 0) === 0) {
			const wst = await wfh.stat({ bigint: true });
			const after = await (0, node_fs_promises.lstat)(filePath, { bigint: true });
			if (after.isSymbolicLink()) {
				const err = /* @__PURE__ */ new Error(`create-path redirected through a planted symlink: ${filePath}`);
				err.code = "ELOOP";
				throw err;
			}
			const id = classifyCreateIdentity(wst, after);
			createBlind = id.needsReadback;
			identityMismatch = id.mismatch;
			if (id.mismatch !== null) await proveCreatePathServesHandle(wfh, filePath, id.mismatch);
		}
		if (identityMismatch !== null) await writeAllAt(wfh, content);
		else await wfh.writeFile(content);
		await wfh.sync();
		if (createBlind) await assertPathServesHandleBytes(wfh, filePath, content).catch((err) => {
			logIdentityMismatchRefusal(identityMismatch, filePath);
			throw err;
		});
	} finally {
		await wfh.close().catch((closeErr) => {
			logger.warn("[private-file] cleanup close failed after gated create:", closeErr?.code);
		});
	}
}
/** Typed plant signal for {@link ensurePrivateDirNoFollow}: the relocation-demand metric
*  gates on THIS TYPE, not a message substring — a reworded message
*  cannot silently stop the metric counting. Transient errnos at the
*  leaf arms propagate as raw ErrnoException, never as this; the one
*  exception is the below-boundary walk's unverifiable-component arm,
*  which fails closed as this type but carries the underlying errno in
*  `code` so result-taxonomy callers can keep a transient verify
*  failure (EBUSY/EACCES/EPERM on a parent lstat) out of the permanent
*  plant class. `code` is unset on every genuine link-detected arm.
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
var PlantDetectedError = class extends Error {
	constructor(message, code) {
		super(message);
		this.name = "PlantDetectedError";
		this.code = code;
	}
};
/** Pure candidate resolution for the posture gate's sibling match:
*  folded matching must not be first-match-ambiguous — on a
*  case-SENSITIVE APFS/HFS+ volume (opt-in, common on external drives)
*  case variants can COEXIST, and classifying whichever variant wins
*  readdir order would let a benign decoy dir mask a tampered
*  exact-case root (the caller readdirs the EXACT path, which the
*  posture then never looked at). Exact-case wins when present — it IS
*  what the caller will read; a folded variant is only the UNAMBIGUOUS
*  fallback for the accidental-re-case shape; multiple folded variants
*  with no exact match are attacker-constructible coexistence →
*  "ambiguous" (callers treat as tampered).
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
function resolveRootEntry(siblings, exactName, foldCase) {
	if (!foldCase) return siblings.find((d) => d.name === exactName);
	const wantName = exactName.toLowerCase();
	const candidates = siblings.filter((d) => d.name.toLowerCase() === wantName);
	const exact = candidates.find((d) => d.name === exactName);
	if (exact) return exact;
	if (candidates.length > 1) return "ambiguous";
	return candidates[0];
}
var PROBE_MAX_LINK_HOPS = 8;
/** App-known co-writable roots beyond the ~/.claude family: modules owning agent-writable trees with no .claude
*  segment (cowork plugin roots under userData) register them at
*  startup so the pre-traversal probe can anchor there instead of
*  regressing to leaf-only. Name-based boundary detection remains
*  best-effort for unregistered trees — the boundary tracks known
*  families, not every conceivable agent-writable path. */
var registeredProbeRoots = [];
var belowBoundaryRefusalLogged = false;
/** MID-CHAIN PLANT WALK: the leaf arms
*  and the win32 reparse gate together still PASSED an honest plain
*  symlink at a non-leaf component below the co-writable boundary
*  (e.g. ~/.claude/projects → attacker dir), so every "private" ensure
*  and write beneath it landed at the redirect target. This walk
*  lstats each component STRICTLY BELOW the co-writable boundary up to
*  the leaf's parent and refuses any symlink there — attacker-writable
*  components admit no links, period. Components AT or ABOVE the
*  boundary stay tolerated (symlinked $HOME, macOS /var, dotfile-
*  managed ~/.claude itself, FSLogix ancestry). Paths in no known
*  co-writable family skip the walk — same scoping as the reparse
*  gate. On win32, call AFTER preTraversalReparseGate so these lstats
*  never cross an unverified exotic component (honest-local prefixes
*  are safe to traverse); on POSIX lstat never dials, so the walk is
*  the whole gate. Boundary derivation shares the reparse gate's
*  candidate logic via deriveCoWritableBoundary — ONE copy, so the
*  scoping cannot drift between the siblings. */
async function assertNoSymlinkBelowBoundary(dirPath) {
	const norm = (0, node_path.resolve)(dirPath);
	const boundary = deriveCoWritableBoundary(norm);
	if (boundary === null || boundary === norm) return;
	const sep = isWindows$2 ? "\\" : "/";
	const strip = isWindows$2 ? /^[\\/]+/ : /^\/+/;
	const parts = norm.slice(boundary.length).replace(strip, "").split(SEG_SPLIT).filter(Boolean);
	let cur = boundary;
	for (let i = 0; i < parts.length - 1; i++) {
		cur = cur + sep + parts[i];
		let st;
		try {
			st = await (0, node_fs_promises.lstat)(cur);
		} catch (err) {
			const code = err.code;
			if (code === "ENOENT" || code === "ENOTDIR") return;
			throw new PlantDetectedError(`cannot verify component below the co-writable boundary (${code}): ${cur}`, code);
		}
		if (st.isSymbolicLink()) {
			if (!belowBoundaryRefusalLogged) {
				belowBoundaryRefusalLogged = true;
				emitPrivateFileEvent((sink) => sink.belowBoundarySymlinkRefused());
			}
			throw new PlantDetectedError(`symlink at a non-leaf component below the co-writable boundary: ${cur} — components under the config root may not be symlinks; supported relocations: symlink the whole config root at the home level (~/.claude) or point CLAUDE_CONFIG_DIR at the relocated directory via Desktop Settings`);
		}
	}
}
/** ONE copy of the co-writable boundary derivation, shared by the win32
*  reparse gate and the platform-neutral mid-chain walk. Returns the
*  boundary prefix, or null when the path is in no known co-writable
*  family. */
function deriveCoWritableBoundary(norm, extraCandidates) {
	const candidates = [...extraCandidates ?? []];
	const prefixMatch = (candNorm) => {
		if (norm.length < candNorm.length) return false;
		if (norm.slice(0, candNorm.length).toLowerCase() !== candNorm.toLowerCase()) return false;
		const isSep = (ch) => ch === "/" || isWindows$2 && ch === "\\";
		if (isSep(candNorm[candNorm.length - 1])) return true;
		return norm.length === candNorm.length || isSep(norm[candNorm.length]);
	};
	for (const root of registeredProbeRoots) if (prefixMatch(root.norm)) candidates.push(norm.slice(0, root.norm.length));
	const envDir = process.env.CLAUDE_CONFIG_DIR;
	if (envDir) {
		const envNorm = (0, node_path.resolve)(envDir);
		if (prefixMatch(envNorm)) candidates.push(norm.slice(0, envNorm.length));
	}
	{
		const first = isWindows$2 ? norm.match(/[\\/]\.claude(?=[\\/]|$)/i) : norm.match(/\/\.claude(?=\/|$)/i);
		if (first && first.index !== void 0) candidates.push(norm.slice(0, first.index + first[0].length));
	}
	if (candidates.length === 0) return null;
	return candidates.reduce((a, b) => b.length < a.length ? b : a);
}
/** ROOT-to-LEAF pre-traversal reparse gate.
*  Types every component BELOW the co-writable boundary from its
*  parent scandir listing (FindFirstFile attributes flag every reparse
*  form without opening the entry) before any syscall whose path would
*  traverse it. Boundary: the deepest prefix ending in \.claude, or a
*  registered co-writable root (registerCoWritableProbeRoot — the
*  Desktop-settings override registers there when the config-root
*  resolution adopts it; the process-env CLAUDE_CONFIG_DIR candidate
*  below is vestigial in the deterministic-resolution world, harmless
*  because a boundary anchored where the app never writes never
*  matches); above the boundary the attacker cannot write and
*  legitimate reparse dirs (FSLogix, folder mounts, OneDrive) live.
*  Paths outside any known boundary probe the leaf only (their parent
*  listing), preserving the leaf-only probe scope — override trees
*  keep that leaf-only scope until their root is registered. A link-typed
*  component that AGREES with lstat stops the descent — components
*  below it resolve through the target, which the (never-following)
*  hop walk validates; a disagreement (scandir link, lstat not) is the
*  exotic liar and refuses before anything touches it. */
async function preTraversalReparseGate(dirPath, hops = 0, probeFromOverride) {
	if (!isWindows$2) return;
	if (hops > PROBE_MAX_LINK_HOPS) throw new PlantDetectedError(`Link-hop budget exceeded during pre-traversal probe: ${dirPath}`);
	const norm = (0, node_path.resolve)(dirPath);
	const derived = deriveCoWritableBoundary(norm, probeFromOverride ? [(0, node_path.resolve)(probeFromOverride)] : void 0);
	let probeRoot;
	if (derived !== null) probeRoot = derived;
	else probeRoot = (0, node_path.dirname)(norm);
	if (probeRoot === norm) {
		if (probeFromOverride) try {
			const self = resolveRootEntry(await (0, node_fs_promises.readdir)((0, node_path.dirname)(norm), { withFileTypes: true }), (0, node_path.basename)(norm), true);
			if (self === "ambiguous") throw new PlantDetectedError(`Ambiguous case-variant coexistence at link target: ${norm}`);
			if (self && self.isSymbolicLink()) {
				const st = await (0, node_fs_promises.lstat)(norm).catch(() => null);
				if (st && !st.isSymbolicLink()) throw new PlantDetectedError(`Exotic reparse at link target (scandir/lstat disagreement): ${norm}`);
			}
		} catch (e) {
			if (e instanceof PlantDetectedError) throw e;
			const code = e.code;
			if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
		}
		return;
	}
	let cur = probeRoot;
	const relParts = norm.slice(probeRoot.length).split(/[\\/]+/).filter(Boolean);
	for (const [partIndex, part] of relParts.entries()) {
		let entries;
		try {
			entries = await (0, node_fs_promises.readdir)(cur, { withFileTypes: true });
		} catch (e) {
			const code = e.code;
			if (code === "ENOENT" || code === "ENOTDIR") return;
			if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
			throw new PlantDetectedError(`Unreadable component during pre-traversal probe: ${cur} (ensuring ${dirPath}) — ${e.message}`);
		}
		const resolved = resolveRootEntry(entries, part, true);
		if (resolved === "ambiguous") throw new PlantDetectedError(`Ambiguous case-variant coexistence on private dir chain: ${(0, node_path.join)(cur, part)} (ensuring ${dirPath})`);
		if (!resolved) return;
		const next = (0, node_path.join)(cur, resolved.name);
		if (resolved.isSymbolicLink()) {
			let st = null;
			try {
				st = await (0, node_fs_promises.lstat)(next);
			} catch (e) {
				const code = e.code;
				if (code === "ENOENT") return;
				if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
				throw new PlantDetectedError(`Unverifiable reparse on private dir chain: ${next} (ensuring ${dirPath}) — ${e.message}`);
			}
			if (st && !st.isSymbolicLink()) throw new PlantDetectedError(`Exotic reparse on private dir chain (scandir/lstat disagreement): ${next} (ensuring ${dirPath})`);
			let target;
			try {
				target = await (0, node_fs_promises.readlink)(next);
			} catch (e) {
				const code = e.code;
				if (code === "ENOENT") return;
				if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
				throw new PlantDetectedError(`Unreadable reparse data on private dir chain: ${next} (ensuring ${dirPath})`);
			}
			if (isNetworkReachingTarget(target) || isRawWslDollarPath(target)) throw new PlantDetectedError(`Network-reaching link target on private dir chain: ${next} (ensuring ${dirPath})`);
			if (isWslUncPath(target)) throw new PlantDetectedError(`WSL link target on private dir chain: ${next} (ensuring ${dirPath})`);
			const targetRoot = (0, node_path.resolve)((0, node_path.dirname)(next), target);
			await preTraversalReparseGate((0, node_path.join)(targetRoot, ...relParts.slice(partIndex + 1)), hops + 1, targetRoot);
			return;
		}
		cur = next;
	}
}
/** win32 canonical-equality tail: lstat reports drive-letter junctions as symlinks, but
*  non-drive-letter NT substitute names (\??\GLOBALROOT\Device\...,
*  \??\Volume{guid}\, \??\UNC\...) fail libuv's readlink and present as
*  PLAIN directories — the lstat belts pass them. realpath resolves
*  every reparse form (resolve.ts [C3] uses the same property), so the
*  leaf is required to canonicalize to exactly its parent's canonical
*  form plus its own name (or, when MSIX-packaged, our own container
*  mirror of it — see isOwnMsixContainerMirror). A relocated PARENT
*  stays legitimate — it canonicalizes identically on both sides. FAIL CLOSED on a realpath
*  error: for the exotic forms the resolution failure IS the plant
*  signature (resolve.ts's unresolvable→deny), never a pass-through.
*  One copy, applied to BOTH the pre-existing-dir and post-create arms
*  — a persistent pre-launch plant lands in the former. No-op on
*  POSIX (lstat types every reparse analogue there). Known residual:
*  an 8.3 short-name LEAF basename would false-refuse (long-form
*  leafCanon vs short basename); every current caller passes
*  app-authored leaf names, so this bites only a future caller with
*  externally-sourced paths. Exported: the
*  gated projects-root opener's post-open assert needs the same
*  parent-anchored form — its self-referential realpath compare
*  resolves through an absorbed plant and passes trivially.
*
* @public — consumed by the later durable-sessions slices (trust hardening, thin recovery, deferred store #52012).
*/
async function assertCanonicalLeafWin32(dirPath) {
	if (!isWindows$2) return;
	await preTraversalReparseGate(dirPath);
	await assertNoSymlinkBelowBoundary(dirPath);
	try {
		await assertNoUncSymlinkHop(dirPath);
	} catch (e) {
		const code = e.code;
		if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
		throw new PlantDetectedError(`Private dir chain refused pre-canonicalization (reparse plant?): ${dirPath} — ${e.message}`);
	}
	let leafCanon;
	let parentCanon;
	try {
		[leafCanon, parentCanon] = await Promise.all([(0, node_fs_promises.realpath)(dirPath), (0, node_fs_promises.realpath)((0, node_path.dirname)(dirPath))]);
	} catch (e) {
		const code = e.code;
		if (code && TRANSIENT_CANONICALIZE_ERRNOS.has(code)) throw e;
		throw new PlantDetectedError(`Private dir path did not canonicalize (reparse plant?): ${dirPath} — ${e.message}`);
	}
	const expectedCanon = (0, node_path.join)(parentCanon, (0, node_path.basename)(dirPath));
	if (leafCanon.toLowerCase() !== expectedCanon.toLowerCase() && !isOwnMsixContainerMirror(leafCanon, expectedCanon)) throw new PlantDetectedError(`Private dir leaf redirects (junction/substitute-name plant): ${dirPath} (leaf canonicalizes to ${leafCanon}, expected ${expectedCanon})`);
}
/** MSIX write redirection copy-on-writes <profile>\AppData\<X> into the
*  app's own package container at <profile>\AppData\Local\Packages\<PFN>\
*  LocalCache\<X>, so exactly at the overlay boundary a NEW leaf
*  canonicalizes to the container spelling while its parent keeps the
*  profile spelling. Accept ONLY our own package family's mirror at the
*  IDENTICAL relative subpath, and only under Roaming\ — the one
*  subtree our manifest virtualizes (the manifest's ExcludedDirectories
*  live under Local\, where a mirror spelling can only be a plant).
*  Never a bare LocalCache prefix, which is ordinary same-uid-writable
*  profile space: a junction would have to target the exact location
*  the OS redirects the write to anyway. */
function isOwnMsixContainerMirror(leafCanon, expectedCanon) {
	const family = extractMsixPackageFamilyFromExePath();
	const profile = process.env.USERPROFILE;
	if (family === void 0 || profile === void 0) return false;
	const norm = (p) => p.replaceAll("/", "\\").toLowerCase();
	const appData = norm((0, node_path.join)(profile, "AppData"));
	const expected = norm(expectedCanon);
	if (!expected.startsWith(`${appData}\\`)) return false;
	const rel = expected.slice(appData.length + 1);
	if (!rel.startsWith("roaming\\")) return false;
	const mirror = `${appData}\\local\\packages\\${family.toLowerCase()}\\localcache\\${rel}`;
	return norm(leafCanon) === mirror;
}
/** Gated ensure-create for a directory whose PARENT is co-writable:
*  the family roots open at
*  ~/.claude/projects, and ~/.claude is writable by the same-uid
*  attacker the family defends against — so a dangling-symlink plant
*  at the projects path meets this create FIRST, before any SafeRoot
*  exists to gate it. lstat-reject → mkdir(0o700, non-recursive,
*  EEXIST-tolerant) → lstat-verify. Failure is availability-sane by
*  contract: throw cleanly so the caller skips THIS batch and retries
*  next tick — never a capability rooted at the plant's target, never
*  a wedged family. (Not SafeRoot.open's job: a capability rooted at
*  a directory cannot create that directory.) */
async function ensurePrivateDirNoFollow(dirPath) {
	await preTraversalReparseGate(dirPath);
	await assertNoSymlinkBelowBoundary(dirPath);
	const probe = await (0, node_fs_promises.lstat)(dirPath).catch((e) => {
		if (e.code === "ENOENT") return null;
		throw e;
	});
	if (probe !== null) {
		if (probe.isSymbolicLink() || !probe.isDirectory()) throw new PlantDetectedError(`Refusing non-directory at private dir path (symlink/file plant): ${dirPath}`);
		await assertCanonicalLeafWin32(dirPath);
		return;
	}
	await (0, node_fs_promises.mkdir)(dirPath, {
		recursive: true,
		mode: 448
	}).catch((e) => {
		if (e.code !== "EEXIST") throw e;
	});
	const after = await (0, node_fs_promises.lstat)(dirPath);
	if (after.isSymbolicLink() || !after.isDirectory()) throw new PlantDetectedError(`Private dir path replaced during create (plant race): ${dirPath}`);
	await assertCanonicalLeafWin32(dirPath);
	if (!isWindows$2) {
		const dh = await (0, node_fs_promises.open)(dirPath, node_fs.constants.O_RDONLY | (node_fs.constants.O_DIRECTORY ?? 0) | (node_fs.constants.O_NOFOLLOW ?? 0));
		try {
			if (!(await dh.stat()).isDirectory()) throw new PlantDetectedError(`Private dir path replaced during create (plant race): ${dirPath}`);
			await dh.chmod(448);
		} finally {
			await dh.close();
		}
	}
}
/** mkdir -p with 0o700 on the leaf directory, behind the same
*  pre-traversal reparse gates as the write primitives (see the opts
*  doc for the gating and its opt-out). */
async function mkdirPrivate(dirPath, opts) {
	if (isWindows$2) {
		if (opts?.trustedRelocatable) {
			await (0, node_fs_promises.mkdir)(dirPath, {
				recursive: true,
				mode: 448
			});
			return;
		}
		await ensurePrivateDirNoFollow(dirPath);
		return;
	}
	if (!opts?.trustedRelocatable) await assertNoSymlinkBelowBoundary(dirPath);
	await (0, node_fs_promises.mkdir)(dirPath, {
		recursive: true,
		mode: 448
	});
	if (opts?.trustedRelocatable) {
		await (0, node_fs_promises.chmod)(dirPath, 448);
		return;
	}
	const dh = await (0, node_fs_promises.open)(dirPath, node_fs.constants.O_RDONLY | (node_fs.constants.O_DIRECTORY ?? 0) | (node_fs.constants.O_NOFOLLOW ?? 0));
	try {
		if (!(await dh.stat()).isDirectory()) throw new Error(`mkdirPrivate path is not a directory (plant race): ${dirPath}`);
		await dh.chmod(448);
	} finally {
		await dh.close();
	}
}
//#endregion
//#region src/main/safe-fs/lexical.ts
/**
* Lexical (string-only) path containment — no fs I/O, no Electron imports,
* loadable in a utilityProcess. `helpers/path-safety.ts` re-exports the
* pieces main-process callers use and layers the realpath-based checks on
* top.
*/
/**
* Lexical (string-only) containment via `path.relative` — no fs I/O.
* Most callers should use path-safety's `safeJoin`, `isRealpathWithin`,
* or `isSafeWriteDestination`, which encode the resolution step; direct
* use is for already-resolved values (allowlist checks, zip extraction
* plans).
*
* `allowEqual` (default true) controls whether `target === base` passes;
* set false when guarding `rm -rf` and similar where the base itself
* must survive.
*/
function isLexicallyWithin(target, base, opts, pathImpl = node_path.default) {
	const rel = pathImpl.relative(base, target);
	if (rel.length === 0) return opts?.allowEqual ?? true;
	return !pathImpl.isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${pathImpl.sep}`);
}
/** Rejects zip-entry-style relative paths containing traversal segments
* (any `..` substring) or resolving to an absolute path. */
function isPathSafe(filePath) {
	if (filePath.includes("..")) return false;
	return !node_path.default.isAbsolute(node_path.default.normalize(filePath));
}
//#endregion
//#region src/main/safe-fs/openNoFollow.ts
/**
* Open a guest-writable plugin file for reading with no-follow, no-block
* semantics: O_NOFOLLOW refuses a link swapped in after any path-based
* check (pass a realpath-resolved path so a contained, resolving link is
* still served), and O_NONBLOCK makes open() on a guest-planted
* writer-less FIFO return instead of blocking forever and wedging a
* libuv threadpool worker. Both constants are POSIX-only; on win32 the
* content-no-follow guarantee is reconstructed via an lstat → open →
* fstat identity check, which rejects reparse points and a path swap
* between the lstat and the open before any bytes are read (a swapped
* UNC target is refused before open() dials out; other reparse targets
* are still opened and then rejected by the identity check).
* Callers must fstat the HANDLE and read from the same descriptor —
* manifestParsing's `readPluginFileNoFollow` is the plain-text form of
* that pattern.
*
* @param opts.allowUnc - Skip the direct-UNC reject for trees rooted on
*   a UNC share the caller has decided to trust (folder-redirected
*   userData — SafeRoot's `allowUnc` equivalent). The per-segment walk
*   still refuses any symlink whose target is UNC, so containment holds.
*/
async function openPluginFileNoFollow(filePath, opts) {
	return node_fs_promises.default.open(filePath, node_fs_promises.default.constants.O_RDONLY | (node_fs_promises.default.constants.O_NOFOLLOW ?? 0) | (node_fs_promises.default.constants.O_NONBLOCK ?? 0));
}
//#endregion
//#region src/main/dxt/extractArchive.ts
/**
* Archive validation and extraction for .dxt/.mcpb and plugin zips. Pure
* Node — no Electron imports; the `runDxt*`/`runMcpb*` tasks run inside the
* heavy-work utilityProcess so the main process never holds archive bytes.
* Signature is verified before any entry is inflated; every entry is
* validated before anything is written. `validateZipEntry` is the one zip
* validation core; a {@link ZipEntryPolicy} keys each consumer's acceptance
* rules — the plugin/skill fetcher shares it.
*/
var LIMITS = {
	MAX_FILE_SIZE: 512 * 1024 * 1024,
	MAX_FILE_COUNT: 1e5,
	MAX_COMPRESSION_RATIO: 50,
	MAX_PATH_LENGTH: 1024,
	MAX_FILENAME_LENGTH: 255
};
var ZIP_POLICIES = Object.freeze({
	dxt: Object.freeze({
		lexicalPathSafety: true,
		perFileSizeCap: true,
		aggregateRatioCap: true,
		entryLengthCaps: false,
		nestedZipBan: false,
		perEntryRatioCap: false,
		skipOSMetadata: false
	}),
	plugin: Object.freeze({
		lexicalPathSafety: false,
		perFileSizeCap: false,
		aggregateRatioCap: false,
		entryLengthCaps: true,
		nestedZipBan: true,
		perEntryRatioCap: true,
		skipOSMetadata: true
	})
});
/** True when `policy` excludes this entry outright — it is neither
* validated nor extracted. Callers that install and callers that peek must
* both route through this so one never rejects what the other accepts. */
function isExcludedZipEntry(name, policy) {
	return ZIP_POLICIES[policy].skipOSMetadata && isOSMetadata(name);
}
/** Per-entry ratio violations carry the (attacker-controlled) entry name,
* so consumers keep their message out of user-facing copy. */
var ZipPerEntryRatioError = class extends Error {};
/** Validates one entry against the checks `policy` selects, accumulating
* into `state`, and throws on the first failing check — a traversal is
* never masked by a later size error. */
function validateZipEntry(entry, state, maxTotalSizeBytes, policy) {
	const checks = ZIP_POLICIES[policy];
	const { name, compressedSize } = entry;
	const uncompressedSize = name.endsWith("/") ? 0 : entry.uncompressedSize;
	state.fileCount++;
	if (state.fileCount > LIMITS.MAX_FILE_COUNT) throw new Error(`Archive contains too many files: ${state.fileCount} (max: ${LIMITS.MAX_FILE_COUNT})`);
	if (checks.lexicalPathSafety && !isPathSafe(name)) throw new Error(`Unsafe file path detected: "${name}". Path traversal or absolute paths are not allowed.`);
	if (checks.perFileSizeCap && uncompressedSize > LIMITS.MAX_FILE_SIZE) throw new Error(`File "${name}" is too large: ${Math.round(uncompressedSize / 1024 / 1024)}MB (max: ${Math.round(LIMITS.MAX_FILE_SIZE / 1024 / 1024)}MB)`);
	state.totalUncompressedSize += uncompressedSize;
	if (state.totalUncompressedSize > maxTotalSizeBytes) throw new Error(`Archive total size is too large: ${Math.round(state.totalUncompressedSize / 1024 / 1024)}MB (max: ${Math.round(maxTotalSizeBytes / 1024 / 1024)}MB)`);
	if (checks.aggregateRatioCap) {
		const currentRatio = state.totalUncompressedSize / state.compressedSize;
		if (currentRatio > LIMITS.MAX_COMPRESSION_RATIO) throw new Error(`Suspicious compression ratio detected: ${currentRatio.toFixed(1)}:1 (max: ${LIMITS.MAX_COMPRESSION_RATIO}:1). This may be a zip bomb.`);
	}
	if (checks.entryLengthCaps) {
		if (name.length > LIMITS.MAX_PATH_LENGTH) throw new Error(`Zip entry path too long: ${name.length} characters (max: ${LIMITS.MAX_PATH_LENGTH})`);
		const entryBasename = node_path.default.basename(name);
		if (entryBasename.length > LIMITS.MAX_FILENAME_LENGTH) throw new Error(`Zip entry filename too long: "${entryBasename}" is ${entryBasename.length} characters (max: ${LIMITS.MAX_FILENAME_LENGTH})`);
	}
	if (checks.nestedZipBan && node_path.default.extname(name).toLowerCase() === ".zip") throw new Error(`Nested zip files are not allowed: "${name}"`);
	if (checks.perEntryRatioCap && compressedSize > 0 && uncompressedSize / compressedSize > LIMITS.MAX_COMPRESSION_RATIO) throw new ZipPerEntryRatioError(`Suspicious compression ratio for "${name}": ${Math.round(uncompressedSize / compressedSize)}:1 (max: ${LIMITS.MAX_COMPRESSION_RATIO}:1)`);
}
/** Resolves entries to paths under `destDir`, rejecting root escapes and
* file/directory collisions. Entry names are pre-validated (validateZipEntry);
* this is the backstop on the resolved path. Each planned file carries its
* `source` through so the write loop streams exactly what was validated. */
function planZipExtraction(destDir, entries) {
	const root = node_path.default.join(destDir, ".");
	const dirs = /* @__PURE__ */ new Set();
	const files = [];
	for (const { name, isDirectory, mode, source } of entries) {
		const fullPath = node_path.default.join(destDir, name);
		if (node_path.default.relative(root, fullPath) === "") {
			if (isDirectory) continue;
			throw new Error(`Zip entry "${name}" resolves to the extraction root`);
		}
		if (!isLexicallyWithin(fullPath, root, { allowEqual: false })) throw new Error(`Zip entry "${name}" escapes the extraction root`);
		if (isDirectory) dirs.add(fullPath.replace(/[\\/]+$/, ""));
		else {
			dirs.add(node_path.default.dirname(fullPath));
			files.push({
				name,
				fullPath,
				mode,
				source
			});
		}
	}
	for (const d of Array.from(dirs)) {
		if (d === root) continue;
		let cur = node_path.default.dirname(d);
		while (cur !== root && cur !== node_path.default.dirname(cur)) {
			dirs.add(cur);
			cur = node_path.default.dirname(cur);
		}
	}
	for (const { fullPath } of files) if (dirs.has(fullPath)) throw new Error(`Zip entry "${node_path.default.relative(destDir, fullPath)}" is both a file and a directory`);
	return {
		dirs,
		files
	};
}
/** Carried as `code` on the worker's error envelope — see
* `extractService.isDxtSignatureRequiredError`. */
var DXT_SIGNATURE_REQUIRED_CODE = "DXT_SIGNATURE_REQUIRED";
function openZipFile(open) {
	return new Promise((resolve, reject) => {
		open((err, zipFile) => {
			if (err || !zipFile) {
				reject(err ?? /* @__PURE__ */ new Error("Failed to open zip file"));
				return;
			}
			resolve(zipFile);
		});
	});
}
/** Reads the central directory, validating each entry under `policy` as it
* streams so a bad archive is rejected without buffering the rest of its
* listing. */
function readAllEntries(zipFile, state, maxTotalSizeBytes, policy) {
	return new Promise((resolve, reject) => {
		const entries = [];
		let aborted = false;
		zipFile.on("entry", (entry) => {
			if (aborted) return;
			if (isExcludedZipEntry(entry.fileName, policy)) {
				zipFile.readEntry();
				return;
			}
			try {
				validateZipEntry({
					name: entry.fileName,
					uncompressedSize: entry.uncompressedSize,
					compressedSize: entry.compressedSize
				}, state, maxTotalSizeBytes, policy);
			} catch (err) {
				aborted = true;
				reject(err instanceof Error ? err : new Error(String(err)));
				return;
			}
			entries.push(entry);
			zipFile.readEntry();
		});
		zipFile.on("end", () => resolve(entries));
		zipFile.on("error", (err) => reject(err));
		zipFile.readEntry();
	});
}
function openEntryStream(zipFile, entry) {
	return new Promise((resolve, reject) => {
		zipFile.openReadStream(entry, (err, readStream) => {
			if (err || !readStream) {
				reject(err ?? /* @__PURE__ */ new Error(`Failed to read entry: ${entry.fileName}`));
				return;
			}
			resolve(readStream);
		});
	});
}
async function readEntryBytes(zipFile, entry) {
	const chunks = [];
	for await (const chunk of await openEntryStream(zipFile, entry)) chunks.push(chunk);
	return Buffer.concat(chunks);
}
/** Reads and validates the central directory under the dxt policy, then
* collapses exact-duplicate names keep-last — the `Record` shape installs
* consumed before the worker rework collapsed them the same way, so an
* appended-update archive installs its final copy instead of rejecting —
* and rejects names that still collide after filesystem canonicalization. */
async function readCollapsedDxtEntries(zipFile, compressedSize, maxTotalSizeBytes) {
	const raw = await readAllEntries(zipFile, {
		fileCount: 0,
		totalUncompressedSize: 0,
		compressedSize
	}, maxTotalSizeBytes, "dxt");
	const entries = [...new Map(raw.map((e) => [e.fileName, e])).values()];
	assertNoCollidingEntries(entries.map((entry) => entry.fileName));
	return entries;
}
async function extractValidatedEntries(zipFile, compressedSize, destinationDir, maxTotalSizeBytes) {
	const plan = planZipExtraction(destinationDir, (await readCollapsedDxtEntries(zipFile, compressedSize, maxTotalSizeBytes)).map((entry) => ({
		name: entry.fileName,
		isDirectory: entry.fileName.endsWith("/"),
		mode: entry.externalFileAttributes >>> 16 & 511,
		source: entry
	})));
	for (const dir of plan.dirs) await mkdirPrivate(dir);
	for (const file of plan.files) {
		const source = await openEntryStream(zipFile, file.source);
		try {
			await (0, node_stream_promises.pipeline)(source, createWriteStreamPrivate(file.fullPath, { flags: "wx" }));
		} catch (error) {
			if (error.code === "EEXIST") throw new Error(`Zip entry "${file.name}" collides with another entry after filesystem name normalization`);
			throw error;
		}
		if (file.mode && file.mode & 64) await (0, node_fs_promises.chmod)(file.fullPath, 448);
	}
	return { files: plan.files.map((file) => file.name) };
}
/** Shared verify-then-open prologue for the dxt tasks: signature first, so
* nothing is inflated from an archive that fails verification. */
async function openVerifiedDxtArchive(archivePath) {
	const { verifyMcpbFile } = await Promise.resolve().then(() => require("./dist-DOp9vUkV.js"));
	const verified = await verifyMcpbFile(archivePath);
	const { size: compressedSize } = await (0, node_fs_promises.stat)(archivePath);
	return {
		verified,
		compressedSize,
		zipFile: await openZipFile((cb) => import_yauzl.open(archivePath, {
			lazyEntries: true,
			autoClose: false
		}, cb))
	};
}
/**
* Verifies the archive signature, validates every central-directory entry,
* then streams entries to disk under `destinationDir`. Nothing is written
* until the whole entry listing has passed validation.
*/
async function runDxtExtractTask(params) {
	const { verified, compressedSize, zipFile } = await openVerifiedDxtArchive(params.archivePath);
	if (params.requireSigned && verified.status !== "signed") {
		zipFile.close();
		throw Object.assign(/* @__PURE__ */ new Error("Extension archive is not signed and a valid signature is required"), { code: DXT_SIGNATURE_REQUIRED_CODE });
	}
	try {
		const { files } = await extractValidatedEntries(zipFile, compressedSize, params.destinationDir, params.maxTotalSizeBytes);
		return {
			verified,
			manifestBytes: files.includes("manifest.json") ? await (0, node_fs_promises.readFile)(node_path.default.join(params.destinationDir, "manifest.json")) : null
		};
	} finally {
		zipFile.close();
	}
}
var MAX_PREVIEW_ICON_BYTES = 1024 * 1024;
/** The manifest's `icon` value when it names an archive entry (relative
* path, not a URL). Parse failures yield null — main re-parses and
* validates the manifest itself. */
function iconEntryName(manifestBytes) {
	try {
		const { icon } = JSON.parse(new TextDecoder().decode(manifestBytes));
		return typeof icon === "string" && !icon.startsWith("http") ? icon : null;
	} catch {
		return null;
	}
}
/**
* Verifies the archive signature and validates every central-directory
* entry, then decompresses only the manifest (and its referenced icon) into
* memory — one worker round-trip for the installation preview, nothing
* written to disk.
*/
async function runDxtPreviewTask(params) {
	const { verified, compressedSize, zipFile } = await openVerifiedDxtArchive(params.archivePath);
	try {
		const entries = await readCollapsedDxtEntries(zipFile, compressedSize, params.maxTotalSizeBytes);
		const byName = new Map(entries.map((entry) => [entry.fileName, entry]));
		const manifestEntry = byName.get("manifest.json");
		if (!manifestEntry) return {
			verified,
			manifestBytes: null,
			iconBytes: null
		};
		const manifestBytes = await readEntryBytes(zipFile, manifestEntry);
		const iconName = iconEntryName(manifestBytes);
		const iconEntry = iconName ? byName.get(iconName) : void 0;
		return {
			verified,
			manifestBytes,
			iconBytes: iconEntry && !iconEntry.fileName.endsWith("/") && iconEntry.uncompressedSize <= MAX_PREVIEW_ICON_BYTES ? await readEntryBytes(zipFile, iconEntry) : null
		};
	} finally {
		zipFile.close();
	}
}
function mcpbIdentityFromStats(st) {
	return {
		dev: st.dev.toString(),
		ino: st.ino.toString(),
		size: st.size.toString(),
		mtimeNs: st.mtimeNs.toString()
	};
}
/**
* Extracts a plugin-tree MCPB archive with the same validation and write
* discipline as the dxt task, but no signature verification: re-opens the
* archive no-follow and confirms it is still the exact file main validated
* before inflating anything.
*/
async function runMcpbExtractTask(params) {
	const fh = await openPluginFileNoFollow(params.realPath);
	try {
		const st = await fh.stat({ bigint: true });
		const actual = mcpbIdentityFromStats(st);
		const { expect } = params;
		if (!st.isFile() || actual.dev !== expect.dev || actual.ino !== expect.ino || actual.size !== expect.size || actual.mtimeNs !== expect.mtimeNs) throw new Error(`MCPB archive changed between validation and extraction: "${params.realPath}"`);
		await extractValidatedEntries(await openZipFile((cb) => import_yauzl.fromFd(fh.fd, {
			lazyEntries: true,
			autoClose: false
		}, cb)), Number(st.size), params.destinationDir, params.maxTotalSizeBytes);
		return null;
	} finally {
		await fh.close().catch(() => void 0);
	}
}
//#endregion
//#region src/main/helpers/safeErrorCode.ts
/**
* Error identity (errno or class name) that is safe to log where the error
* message may quote sensitive input. V8's JSON.parse SyntaxError embeds a
* verbatim snippet of its input around the failure offset, so interpolating
* or attaching the raw error writes file content — oauth/account data, env
* credentials (API keys, OTEL bearer tokens), hook command lines, decrypted
* secrets — into the desktop's persisted log files.
*
* Log `(${safeErrorCode(error)})` (or `{ errorType: safeErrorCode(error) }`
* in structured logs) instead of the error itself. The original bytes stay
* at their source for local forensics.
*/
function safeErrorCode(error) {
	let name;
	let current = error;
	for (let depth = 0; current != null && depth < 5; depth++) {
		const e = current;
		if (typeof e.code === "string") return e.code;
		if (typeof e.name === "string" && (name === void 0 || name === "Error")) name = e.name;
		current = e.cause;
	}
	return name ?? "unknown";
}
//#endregion
//#region src/main/helpers/telemetryScrubEnv.ts
/**
* Process-ambient appPath/homedir for the path redactors in
* `telemetry-scrub.ts`, split out so the scrubbers stay importable from
* utilityProcess worker bundles, where `import { app } from "electron"` is a
* build error (`forbidElectronPlugin`) and a runtime crash.
*
* Main binds the Electron source at `@/main/logging` module load — that
* module is main-only by construction (worker vite configs alias it away)
* and is imported by `telemetry-scrub.ts` itself, so the binding precedes
* any scrub. Workers bind the values main resolved into their request
* params (see `heavyWorkWorker.ts`).
*
* Unbound is fail-SAFE, not fail-open: `scrubFilesystemPaths` redacts
* `/Users/<x>`, `/home/<x>`, drive letters, and UNC by pattern regardless —
* these opts only add literal-prefix collapsing — and `homedir` (the
* PII-bearing one) still defaults from `os.homedir()`.
*/
var source = () => ({
	appPath: "",
	homedir: node_os.default.homedir()
});
var cached;
/** The source is a thunk so the Electron read stays lazy (first-scrub time).
*  Re-registering drops the cache. */
function setScrubEnvSource(next) {
	source = next;
	cached = void 0;
}
/** Lazy — first call caches. */
function getScrubEnv() {
	return cached ??= source();
}
//#endregion
//#region src/main/local-agent-mode/registryServerUuids.ts
/**
* Runtime allowlist of remote-connector registry UUIDs, for telemetry.
*
* `server_name` in `lam_mcp_*` events is per-org-salt-hashed at the sink
* (telemetry-scrub.ts) because user-chosen local server names can carry PII.
* Registry-assigned connector UUIDs (the `server.uuid` values that
* `ProxyMcpServerManager` proxies through) are Anthropic-assigned and
* content-free, and dbt's `mcp_usage` allowlist needs them unhashed for
* cross-org adoption joins.
*
* UUID **format** alone is not a sufficient gate: a user can name a local
* server with a UUID-shaped string. UUID format **plus membership in the set
* of UUIDs the backend's connector-sync response actually returned** is — a
* value only enters this set via `noteRegistryServerUuids`, which is called
* exclusively from `ProxyMcpServerManager.createProxyServers` with the
* `RemoteMcpServerMetadata[]` payload the renderer received from the backend
* `/api/organizations/:org/mcp/servers` sync. No user-editable config writes
* here.
*
* Leaf module (no imports from `@/main/*`) so both `ProxyMcpServerManager`
* (writer) and `telemetry-scrub.ts` (reader) can depend on it without the
* `event-logging → telemetry-scrub` cycle. Same pattern as the sibling
* `internalServerUuids.ts`.
*
* Fail-closed: an unsynced/empty set means {@link isRegistryServerUuid}
* returns false for everything, so the sink hashes as before.
*/
var UUID_RE$1 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Module-level — process-wide, append-only across the app session.
*  Exported for tests only (seed/clear); production callers use the
*  functions below. */
var _registryServerUuids = /* @__PURE__ */ new Set();
/** Record UUIDs observed in a backend connector-sync response. Called from
*  `ProxyMcpServerManager.createProxyServers` — the single chokepoint every
*  remote-connector `server.uuid` flows through before any telemetry emit
*  for that server can happen. Non-UUID-shaped values are dropped
*  (defense-in-depth; the backend only returns UUIDs). */
function noteRegistryServerUuids(uuids) {
	for (const u of uuids) if (UUID_RE$1.test(u)) _registryServerUuids.add(u);
}
/** True iff `s` is UUID-shaped AND was observed in a backend connector-sync
*  response this app session. Used by `telemetry-scrub.ts` to exempt
*  registry UUIDs from the per-org-salt `server_name` hash. Fail-closed:
*  empty set → false → hash. */
function isRegistryServerUuid(s) {
	return UUID_RE$1.test(s) && _registryServerUuids.has(s);
}
//#endregion
//#region src/main/sessions/claudeJsonRead.ts
/**
* Shared read → parse → project pipeline for the user's global
* `~/.claude.json` — imported by BOTH the Electron main process
* (ClaudeCodeConfig's under-threshold path and its tests) and the
* heavy-work utility process (the large-file path), so the two transports
* produce identical projections and identically-measured timings.
*
* Import discipline: this module must stay loadable inside the utility
* process — node builtins only; no electron, no logger, no event-logging.
* Failures are values, not throws: the caller on main logs and emits
* telemetry for both transports in one place (and a worker reply that
* carried a thrown JSON.parse error would quote file content — see the
* redaction note on ClaudeJsonReadFailure.code).
*/
/** Project one parsed `~/.claude.json` value down to the fields the
* desktop reads. Tolerates any JSON shape: non-object project entries
* become empty entries (their KEY still participates in trust walks,
* matching how the full-object reader treated them — field reads on a
* primitive were just undefined). */
function projectClaudeJson(parsed) {
	if (typeof parsed !== "object" || parsed === null) return {};
	const raw = parsed;
	const out = {};
	if (raw.mcpServers !== void 0) out.mcpServers = raw.mcpServers;
	if (typeof raw.projects === "object" && raw.projects !== null) {
		const projects = Object.create(null);
		for (const [key, value] of Object.entries(raw.projects)) {
			if (!value) continue;
			const entry = {};
			if (typeof value === "object") {
				const v = value;
				if (v.hasTrustDialogAccepted !== void 0) entry.hasTrustDialogAccepted = v.hasTrustDialogAccepted;
				if (v.disabledMcpServers !== void 0) entry.disabledMcpServers = v.disabledMcpServers;
				if (v.mcpServers !== void 0) entry.mcpServers = v.mcpServers;
			}
			projects[key] = entry;
		}
		out.projects = projects;
	}
	return out;
}
/**
* Read and parse `file`, returning the projection and the split timings.
* Runs wherever it is imported — the utility process for large files, the
* main process under the size threshold — with identical semantics.
*/
async function readClaudeJsonProjection(file) {
	const readStart = performance.now();
	let parseStart;
	try {
		const content = await (0, node_fs_promises.readFile)(file, { encoding: "utf-8" });
		parseStart = performance.now();
		const parsed = JSON.parse(content);
		const parseEnd = performance.now();
		return {
			ok: true,
			projection: projectClaudeJson(parsed),
			readMs: parseStart - readStart,
			parseMs: parseEnd - parseStart
		};
	} catch (error) {
		const failEnd = performance.now();
		return {
			ok: false,
			code: error?.code ?? error?.name ?? "unknown",
			readMs: (parseStart ?? failEnd) - readStart,
			parseMs: parseStart === void 0 ? null : failEnd - parseStart
		};
	}
}
//#endregion
//#region src/main/sessions/computeCodeStats.ts
/**
* Aggregates Claude Code usage stats from local transcript JSONL files.
*
* Port of the CLI's `src/utils/stats.ts` (`aggregateClaudeCodeStats`). Heavy
* users have tens of thousands of transcript files, so we read the CLI's
* `~/.claude/stats-cache.json` for historical days and only scan files whose
* mtime is on or after `lastComputedDate`. The desktop never *writes* the
* cache — that stays the CLI's responsibility.
*
* This module is pure Node (no Electron imports) so it can run in a
* utilityProcess worker. `claudeConfigDir` is passed in rather than
* re-derived so the worker operates on exactly the directory the main
* process resolved — otherwise a fork `env` override or Electron env-
* inheritance change could silently point the scan at a different dir.
* The host-side entry point and memo live in `./codeStats.ts`.
*/
var SYNTHETIC_MODEL = "<synthetic>";
/** When no CLI cache exists, cap the cold scan to this many days back so a
* first run doesn't lock the main process on a year of transcripts. Matches
* the renderer heatmap's "all" window. */
var COLD_SCAN_DAYS = 182;
/** Discard any JSONL line whose in-progress buffer reaches this many UTF-16
* code units — `boundedLines` stops accumulating mid-line at this point so a
* file that is one giant line never materialises more than this in heap.
* Sized above realistic entries (a pasted Retina screenshot as inline base64
* is ~10M chars). Worst-case transient heap is roughly
* `BATCH_SIZE × MAX_LINE_LEN × ~3` (two-byte V8 strings for non-ASCII content
* plus the coexisting `JSON.parse` result) ≈ 380 MB. */
var MAX_LINE_LEN = 16 * 1024 * 1024;
/** Skip files above this size in the mtime prefilter. `boundedLines` keeps
* heap bounded regardless, but still reads every byte, so a multi-GB
* plugin-bloat transcript would be re-streamed in full on every recompute
* to yield nothing. Legitimate transcripts don't approach this. */
var MAX_TRANSCRIPT_BYTES = 1024 * 1024 * 1024;
/** Concurrency for cheap fs metadata ops (stat, readdir). */
var STAT_BATCH_SIZE = 20;
/** Lower concurrency for `foldTranscript`, which can hold up to
* `MAX_LINE_LEN` of line buffer plus its `JSON.parse` result per stream. */
var BATCH_SIZE = 8;
function toDateString(d) {
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${d.getFullYear()}-${m}-${day}`;
}
async function loadCliStatsCache(claudeConfigDir) {
	const cachePath = (0, node_path.join)(claudeConfigDir, "stats-cache.json");
	try {
		const raw = await node_fs.promises.readFile(cachePath, "utf-8");
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed.dailyActivity) ? parsed : null;
	} catch {
		return null;
	}
}
/** Map `fn` over `items` with at most `batchSize` concurrent calls. */
async function mapBatched(items, batchSize, fn) {
	const out = [];
	for (let i = 0; i < items.length; i += batchSize) out.push(...await Promise.all(items.slice(i, i + batchSize).map((x) => fn(x))));
	return out;
}
async function getAllSessionFiles(claudeConfigDir) {
	const projectsDir = (0, node_path.join)(claudeConfigDir, "projects");
	let projectEntries;
	try {
		projectEntries = await node_fs.promises.readdir(projectsDir, { withFileTypes: true });
	} catch {
		return [];
	}
	return (await mapBatched(projectEntries.filter((d) => d.isDirectory()).map((d) => (0, node_path.join)(projectsDir, d.name)), STAT_BATCH_SIZE, async (projectDir) => {
		try {
			const entries = await node_fs.promises.readdir(projectDir, { withFileTypes: true });
			const mainFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".jsonl")).map((e) => (0, node_path.join)(projectDir, e.name));
			const subagentResults = await mapBatched(entries.filter((e) => e.isDirectory()), STAT_BATCH_SIZE, async (sd) => {
				const subDir = (0, node_path.join)(projectDir, sd.name, "subagents");
				try {
					return (await node_fs.promises.readdir(subDir, { withFileTypes: true })).filter((s) => s.isFile() && s.name.endsWith(".jsonl") && s.name.startsWith("agent-")).map((s) => (0, node_path.join)(subDir, s.name));
				} catch {
					return [];
				}
			});
			return [...mainFiles, ...subagentResults.flat()];
		} catch {
			return [];
		}
	})).flat();
}
/** Yield lines from `file`, discarding any line whose running buffer reaches
* `maxLen` — the discard happens mid-line so heap stays bounded at `maxLen`
* per concurrent stream regardless of file or line size. Tracks the skipped
* count via the `onSkip` callback. `maxReadBytes` bounds the underlying read
* so an all-oversized-lines file can't stream to EOF unyielding (a consumer
* break needs a yielded line). Exported for unit tests. */
async function* boundedLines(file, maxLen, onSkip, maxReadBytes) {
	const stream = (0, node_fs.createReadStream)(file, {
		encoding: "utf-8",
		...maxReadBytes !== void 0 && { end: maxReadBytes - 1 }
	});
	let buf = "";
	let discarding = false;
	let pendingCR = false;
	try {
		for await (let chunk of stream) {
			if (pendingCR && chunk[0] === "\n") chunk = chunk.slice(1);
			pendingCR = chunk.at(-1) === "\r";
			if (chunk.includes("\r")) chunk = chunk.replace(/\r\n?/g, "\n");
			let pos = 0;
			while (pos < chunk.length) {
				const nl = chunk.indexOf("\n", pos);
				const end = nl === -1 ? chunk.length : nl;
				if (discarding) {
					if (nl === -1) break;
					discarding = false;
					pos = nl + 1;
					continue;
				}
				buf += chunk.slice(pos, end);
				pos = end + 1;
				if (nl === -1) {
					if (buf.length > maxLen) {
						buf = "";
						discarding = true;
						onSkip?.();
					}
					break;
				}
				if (buf.length > maxLen) onSkip?.();
				else if (buf) yield buf;
				buf = "";
			}
		}
		if (buf && !discarding) if (buf.length > maxLen) onSkip?.();
		else yield buf;
	} finally {
		stream.destroy();
	}
}
/**
* Stream a transcript and fold each line into per-date summaries. Heap stays
* at O(one line + counters) regardless of file size — the parsed entry goes
* out of scope on the next iteration, and `boundedLines` caps per-line buffer
* at `MAX_LINE_LEN`. Entries dated before `fromDate` are skipped individually
* (those days are already in the cache, or outside the cold-scan window);
* returns null when nothing on or after `fromDate` was seen. `onSkip` is
* invoked for every oversized line regardless of the return value, so a
* shared scan-level counter stays accurate even for files that yield null.
*/
async function foldTranscript(file, isSubagentFile, fromDate, onSkip) {
	let firstTs = null;
	const days = Object.create(null);
	for await (const line of boundedLines(file, MAX_LINE_LEN, onSkip)) {
		let e;
		try {
			e = JSON.parse(line);
		} catch {
			continue;
		}
		if (e === null || typeof e !== "object") continue;
		if (e.type !== "user" && e.type !== "assistant") continue;
		if (!isSubagentFile && e.isSidechain) continue;
		if (!e.timestamp) continue;
		const entryTime = new Date(e.timestamp);
		if (isNaN(entryTime.getTime())) continue;
		firstTs ??= e.timestamp;
		const dateKey = toDateString(entryTime);
		if (dateKey < fromDate) continue;
		const day = days[dateKey] ??= {
			messageCount: 0,
			toolCallCount: 0,
			usageByModel: Object.create(null)
		};
		day.messageCount++;
		if (e.type !== "assistant") continue;
		const content = e.message?.content;
		if (Array.isArray(content)) {
			for (const block of content) if (block?.type === "tool_use") day.toolCallCount++;
		}
		const usage = e.message?.usage;
		const model = e.message?.model ?? "unknown";
		if (!usage || model === SYNTHETIC_MODEL) continue;
		const mu = day.usageByModel[model] ??= {
			inputTokens: 0,
			outputTokens: 0,
			cacheReadInputTokens: 0,
			cacheCreationInputTokens: 0
		};
		mu.inputTokens += usage.input_tokens ?? 0;
		mu.outputTokens += usage.output_tokens ?? 0;
		mu.cacheReadInputTokens += usage.cache_read_input_tokens ?? 0;
		mu.cacheCreationInputTokens += usage.cache_creation_input_tokens ?? 0;
	}
	if (firstTs === null || Object.keys(days).length === 0) return null;
	return {
		firstTs,
		days
	};
}
function calculateStreaks(activeDates) {
	if (activeDates.size === 0) return {
		currentStreak: 0,
		longestStreak: 0
	};
	const checkDate = /* @__PURE__ */ new Date();
	checkDate.setHours(0, 0, 0, 0);
	let currentStreak = 0;
	while (activeDates.has(toDateString(checkDate))) {
		currentStreak++;
		checkDate.setDate(checkDate.getDate() - 1);
	}
	const sorted = Array.from(activeDates).sort();
	let longestStreak = 1;
	let temp = 1;
	for (let i = 1; i < sorted.length; i++) {
		const prev = new Date(sorted[i - 1]);
		const curr = new Date(sorted[i]);
		if (Math.round((curr.getTime() - prev.getTime()) / (1e3 * 60 * 60 * 24)) === 1) temp++;
		else {
			longestStreak = Math.max(longestStreak, temp);
			temp = 1;
		}
	}
	longestStreak = Math.max(longestStreak, temp);
	return {
		currentStreak,
		longestStreak
	};
}
/** Day after `lastComputedDate` — the cache contract is inclusive, so the
* boundary day is already in `modelUsage`/`totalSessions`/`hourCounts`. */
function dayAfter(date) {
	const d = /* @__PURE__ */ new Date(`${date}T00:00:00`);
	d.setDate(d.getDate() + 1);
	return toDateString(d);
}
async function computeCodeStats(claudeConfigDir) {
	const cache = await loadCliStatsCache(claudeConfigDir);
	const fromDate = cache?.lastComputedDate ? dayAfter(cache.lastComputedDate) : toDateString(/* @__PURE__ */ new Date(Date.now() - COLD_SCAN_DAYS * 24 * 60 * 60 * 1e3));
	const fromMs = (/* @__PURE__ */ new Date(`${fromDate}T00:00:00`)).getTime();
	const sessionFiles = await getAllSessionFiles(claudeConfigDir);
	const dailyActivityMap = /* @__PURE__ */ new Map();
	for (const d of cache?.dailyActivity ?? []) if (d.date < fromDate) dailyActivityMap.set(d.date, { ...d });
	const dailyModelTokensMap = /* @__PURE__ */ new Map();
	for (const d of cache?.dailyModelTokens ?? []) if (d.date < fromDate) dailyModelTokensMap.set(d.date, { ...d.tokensByModel });
	const modelUsage = Object.create(null);
	for (const [model, u] of Object.entries(cache?.modelUsage ?? {})) modelUsage[model] = {
		inputTokens: u.inputTokens ?? 0,
		outputTokens: u.outputTokens ?? 0,
		cacheReadInputTokens: u.cacheReadInputTokens ?? 0,
		cacheCreationInputTokens: u.cacheCreationInputTokens ?? 0
	};
	const hourCounts = /* @__PURE__ */ new Map();
	for (const [h, c] of Object.entries(cache?.hourCounts ?? {})) hourCounts.set(Number(h), c);
	let totalSessions = cache?.totalSessions ?? 0;
	let totalMessages = cache?.totalMessages ?? 0;
	let firstSessionDate = cache?.firstSessionDate ?? null;
	let lastSessionDate = null;
	const candidateFiles = [];
	let skippedOversizedFiles = 0;
	await mapBatched(sessionFiles, STAT_BATCH_SIZE, async (file) => {
		try {
			const st = await node_fs.promises.stat(file);
			if (st.mtimeMs < fromMs) return;
			if (st.size > MAX_TRANSCRIPT_BYTES) {
				skippedOversizedFiles++;
				return;
			}
			candidateFiles.push(file);
		} catch {}
	});
	let totalSkippedLines = 0;
	let fileErrors = 0;
	for (let i = 0; i < candidateFiles.length; i += BATCH_SIZE) {
		const batch = candidateFiles.slice(i, i + BATCH_SIZE);
		const results = await Promise.all(batch.map(async (file) => {
			const isSubagentFile = file.includes(`${node_path.sep}subagents${node_path.sep}`);
			try {
				return {
					isSubagentFile,
					summary: await foldTranscript(file, isSubagentFile, fromDate, () => {
						totalSkippedLines++;
					})
				};
			} catch {
				fileErrors++;
				return {
					isSubagentFile,
					summary: null
				};
			}
		}));
		for (const { isSubagentFile, summary } of results) {
			if (!summary) continue;
			const firstTs = new Date(summary.firstTs);
			const startDateKey = toDateString(firstTs);
			if (!isSubagentFile && startDateKey >= fromDate) {
				const startDay = dailyActivityMap.get(startDateKey) ?? {
					date: startDateKey,
					messageCount: 0,
					sessionCount: 0,
					toolCallCount: 0
				};
				totalSessions++;
				startDay.sessionCount++;
				dailyActivityMap.set(startDateKey, startDay);
				const hour = firstTs.getHours();
				hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
				if (!firstSessionDate || summary.firstTs < firstSessionDate) firstSessionDate = summary.firstTs;
				if (!lastSessionDate || summary.firstTs > lastSessionDate) lastSessionDate = summary.firstTs;
			}
			for (const [dateKey, day] of Object.entries(summary.days)) {
				if (!isSubagentFile) {
					const dayActivity = dailyActivityMap.get(dateKey) ?? {
						date: dateKey,
						messageCount: 0,
						sessionCount: 0,
						toolCallCount: 0
					};
					totalMessages += day.messageCount;
					dayActivity.messageCount += day.messageCount;
					dailyActivityMap.set(dateKey, dayActivity);
				}
				const dayActivity = dailyActivityMap.get(dateKey);
				if (dayActivity) dayActivity.toolCallCount += day.toolCallCount;
				for (const [model, u] of Object.entries(day.usageByModel)) {
					const mu = modelUsage[model] ??= {
						inputTokens: 0,
						outputTokens: 0,
						cacheReadInputTokens: 0,
						cacheCreationInputTokens: 0
					};
					mu.inputTokens += u.inputTokens;
					mu.outputTokens += u.outputTokens;
					mu.cacheReadInputTokens += u.cacheReadInputTokens;
					mu.cacheCreationInputTokens += u.cacheCreationInputTokens;
					const total = u.inputTokens + u.outputTokens;
					if (total > 0) {
						const dayTokens = dailyModelTokensMap.get(dateKey) ?? Object.create(null);
						dayTokens[model] = (dayTokens[model] ?? 0) + total;
						dailyModelTokensMap.set(dateKey, dayTokens);
					}
				}
			}
		}
	}
	const dailyActivity = Array.from(dailyActivityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
	const dailyModelTokens = Array.from(dailyModelTokensMap.entries()).map(([date, tokensByModel]) => ({
		date,
		tokensByModel
	})).sort((a, b) => a.date.localeCompare(b.date));
	const activeDates = new Set(dailyActivity.map((d) => d.date));
	let peakActivityHour = null;
	let peakCount = 0;
	for (const [hour, count] of hourCounts) if (count > peakCount) {
		peakCount = count;
		peakActivityHour = hour;
	}
	return {
		payload: {
			totalSessions,
			totalMessages,
			activeDays: activeDates.size,
			firstSessionDate,
			lastSessionDate,
			peakActivityHour,
			streaks: calculateStreaks(activeDates),
			dailyActivity,
			dailyModelTokens,
			modelUsage
		},
		diag: {
			fromDate,
			totalFiles: sessionFiles.length,
			scannedFiles: candidateFiles.length,
			skippedOversizedFiles,
			skippedOversizedLines: totalSkippedLines,
			fileErrors
		}
	};
}
//#endregion
//#region src/main/sessions/copyWorktreeFiles.ts
/**
* Bulk file copy for worktree overlays (`.worktreeinclude` matches +
* gitignored `.claude/` files). Pure Node (no Electron imports) so it can
* run in a utilityProcess: a `.worktreeinclude` that lists build output
* makes the session-start overlay a node_modules-scale walk+copy. Host-side
* dispatch lives in `./worktreeInclude.ts`; the worker handler in
* `@/main/heavyWork/heavyWorkWorker.ts`.
*/
/** `failed` is capped so a mass failure (dest tree removed mid-copy) never
* echoes the input list back across the port; `failedCount` is the total. */
var MAX_REPORTED_FAILURES = 50;
var LARGE_FILE_BYTES = 8 * 1024 * 1024;
var O_NOFOLLOW$1 = "O_NOFOLLOW" in node_fs.constants ? node_fs.constants.O_NOFOLLOW : 0;
var TRUNCATING_WRITE_FLAGS = node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_TRUNC | O_NOFOLLOW$1;
var COPY_MODE = node_fs.constants.COPYFILE_FICLONE;
/** In-flight writes whose dest a SIGTERM sweep may unlink. A Set of
* per-write entries (not a single slot) so the sweep never leans on the
* host's request serialization. Recording rules — stated once, here: a
* truncating write records only once the dest is forfeit (plain copyFile:
* before dispatch; "w" stream: after its open SUCCEEDS, so a failed open
* can't get an intact pre-existing dest unlinked). A `skipExisting` write
* records BEFORE its "wx" probe open: sweeping a never-created dest is a
* no-op, an EEXIST probe unregisters in its `finally`, and the probe's
* one-syscall window is the only time a sweep can drop a pre-existing
* hook-written file — recopyable by a later gap-fill, never a truncation
* (worst case, kernel unlink/open reordering leaves a surviving EMPTY dest
* that later gap-fills EEXIST-skip: inert, never partial content).
* `sweeping` stops every copy loop from starting further files or
* dispatching its next write. */
var inFlightWrites = {
	entries: /* @__PURE__ */ new Set(),
	sweeping: false
};
/** Called from the worker's SIGTERM handler (POSIX only — a Windows
* TerminateProcess runs no handlers): a timeout kill lands mid-copy, and
* every half-written overlay file must end up missing, not truncated (a
* partial .env parses). Also halts the copy loops, so the exit that follows
* cannot land mid-write of a later, unswept file. */
async function sweepInFlightWrites() {
	inFlightWrites.sweeping = true;
	const entries = [...inFlightWrites.entries];
	inFlightWrites.entries.clear();
	await Promise.all(entries.map((e) => node_fs_promises.unlink(e.dest).catch(() => void 0)));
}
/**
* Build and verify `destDir/relativePath` one lstat-checked segment at a
* time: a hostile source branch can commit a symlink at any overlay path
* component, and `worktree add` materializes it before the copy runs — a
* recursive mkdir or truncating open on the raw path would follow it and
* write (or even just create directories) outside the worktree. Each
* segment must be a real directory (created here when missing, never
* recursively), and a final component that pre-exists as a non-regular
* file is refused. The lstat→write race needs a live same-user process —
* baseline privilege, outside this guard's threat model.
*/
async function verifiedDestPath(destDir, relativePath) {
	let dir = destDir;
	const segs = relativePath.split("/");
	for (const seg of segs.slice(0, -1)) {
		if (!seg || seg === ".") continue;
		if (seg === "..") throw new Error("destination path escapes the worktree");
		dir = node_path.join(dir, seg);
		const segStat = await node_fs_promises.lstat(dir).catch(() => null);
		if (segStat) {
			if (!segStat.isDirectory()) throw new Error("destination parent is not a real directory");
		} else await node_fs_promises.mkdir(dir);
	}
	const destPath = node_path.join(dir, segs[segs.length - 1]);
	const destStat = await node_fs_promises.lstat(destPath).catch(() => null);
	if (destStat && !destStat.isFile()) throw new Error("destination exists and is not a regular file");
	return destPath;
}
/**
* Copy `files` (paths relative to both directories) from `srcDir` to
* `destDir`, preserving directory structure. Per-file failures are
* reported, not thrown; an abort returns the partial result.
*/
async function copyFiles(srcDir, destDir, files, options = {}) {
	const result = {
		copiedCount: 0,
		skippedCount: 0,
		failedCount: 0,
		failed: []
	};
	for (const relativePath of files) {
		if (options.signal?.aborted || inFlightWrites.sweeping) return result;
		const srcPath = node_path.join(srcDir, relativePath);
		const write = { dest: node_path.join(destDir, relativePath) };
		let destForfeit = false;
		let fh;
		try {
			const destPath = await verifiedDestPath(destDir, relativePath);
			write.dest = destPath;
			if (options.skipExisting) {
				const srcStat = await node_fs_promises.stat(srcPath);
				if (inFlightWrites.sweeping) return result;
				inFlightWrites.entries.add(write);
				fh = await node_fs_promises.open(destPath, "wx", 384);
				destForfeit = true;
				if (inFlightWrites.sweeping) {
					await fh.close();
					await node_fs_promises.unlink(destPath).catch(() => void 0);
					return result;
				}
				if (options.signal && srcStat.size > LARGE_FILE_BYTES) await (0, node_stream_promises.pipeline)((0, node_fs.createReadStream)(srcPath), fh.createWriteStream(), { signal: options.signal });
				else {
					await fh.close();
					if (inFlightWrites.sweeping) {
						await node_fs_promises.unlink(destPath).catch(() => void 0);
						return result;
					}
					await node_fs_promises.copyFile(srcPath, destPath, COPY_MODE);
				}
				await node_fs_promises.chmod(destPath, srcStat.mode & 511).catch(() => void 0);
			} else {
				const srcStat = options.signal ? await node_fs_promises.stat(srcPath).catch(() => null) : null;
				if (inFlightWrites.sweeping) return result;
				if (srcStat && srcStat.size > LARGE_FILE_BYTES) {
					fh = await node_fs_promises.open(destPath, TRUNCATING_WRITE_FLAGS, 384);
					destForfeit = true;
					inFlightWrites.entries.add(write);
					if (inFlightWrites.sweeping) {
						await fh.close();
						await node_fs_promises.unlink(destPath).catch(() => void 0);
						return result;
					}
					await (0, node_stream_promises.pipeline)((0, node_fs.createReadStream)(srcPath), fh.createWriteStream(), { signal: options.signal });
					await node_fs_promises.chmod(destPath, srcStat.mode & 511).catch(() => void 0);
				} else {
					inFlightWrites.entries.add(write);
					await node_fs_promises.copyFile(srcPath, destPath, COPY_MODE);
				}
			}
			result.copiedCount++;
		} catch (err) {
			const e = err;
			if (options.skipExisting && e?.code === "EEXIST") {
				result.skippedCount++;
				continue;
			}
			await fh?.close().catch(() => void 0);
			if (e?.name === "AbortError") {
				if (inFlightWrites.entries.has(write)) await node_fs_promises.unlink(write.dest).catch(() => void 0);
				return result;
			}
			if (destForfeit && inFlightWrites.entries.has(write)) await node_fs_promises.unlink(write.dest).catch(() => void 0);
			result.failedCount++;
			if (result.failed.length < MAX_REPORTED_FAILURES) result.failed.push({
				file: relativePath,
				error: err instanceof Error ? err.message : "Unknown error"
			});
		} finally {
			inFlightWrites.entries.delete(write);
		}
	}
	return result;
}
/**
* DJB2 hash function used to convert human-readable feature names
* into the hashed keys that GrowthBook uses internally.
*
* When the input is a build-time pre-hashed key from the GB_FEATURE_KEY
* macro (marked by the {@link GB_HASHED_KEY_PREFIX} sentinel), this
* strips the prefix and returns the already-computed hash unchanged.
* Any other input — including bare digit strings — is hashed as before.
*/
function fasthashDjb2(name) {
	if (name.startsWith("__gb__")) return name.slice(6);
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash << 5) - hash + name.charCodeAt(i);
		hash = hash & hash;
	}
	return ((hash & 4294967295) >>> 0).toString();
}
new Set([
	"claudeai_safe_prompt_hashes",
	"proj-chalk-telemetry",
	"proj-chalk-k12-legal-links",
	"disable_destructive_mcp_tools_by_default",
	"cowork_show_tool_permissioning_always_allow",
	"sensitive_mcps_per_call_consent",
	"yukon_silver_tool_perms",
	"mcp_tool_approval_config",
	"sensitive_mcp_tools",
	"claude_ai_mcp_skip_schema_validation",
	"apps_mcp_apps_experimental_flags",
	"mcp_apps_frame_domains",
	"apps_redacted_strings_cilantro",
	"apps_redacted_strings_cubeb",
	"apps_redacted_strings_fennel",
	"apps_redacted_strings_fenugreek",
	"apps_redacted_strings_glass",
	"apps_redacted_strings_kunefeh",
	"apps_redacted_strings_parsley",
	"apps_redacted_strings_poppy",
	"apps_redacted_strings_scoville",
	"apps_redacted_strings_seltzer",
	"apps_redacted_strings_sesame",
	"apps_redacted_strings_shiso",
	"apps_redacted_strings_workbench",
	"cowork_bypass_permissions_mode",
	"cowork_auto_permission_mode",
	"ccr_auto_permission_mode",
	"cowork_auto_mode_include_allowed_write_mcp_web",
	"claudeai_permission_modes_managed_settings",
	"enforce_org_skill_disablement_main",
	"cowork_argonaut_org_policies_main",
	"ccd_deeplink_trusted_folder_skip_main",
	"claudeai_default_wiggle_egress_enabled",
	"claudeai_default_wiggle_egress_enabled_without_spotlight",
	"claudeai_default_wiggle_egress_hosts_template",
	"claude_ai_markdown_mermaid_render",
	"claude_ai_age_verification_hoc_gate",
	"onboarding_age_verification",
	"ccr_per_message_attestation_web",
	"trusted_device_self_attestation",
	"cowork_safety_banners",
	"post_upgrade_activation_flow",
	"ccd_disable_feature_discovery"
].map(fasthashDjb2));
//#endregion
//#region ../../packages/utils/telemetryRedact.ts
/**
* Shared telemetry redaction for user-chosen identifiers (plugin/marketplace/
* MCP server/tool names). Single source for the catalog-vs-custom PII boundary;
* see readme/analytics-pii.md.
*/
/**
* The subset of official marketplaces whose `anthropics/<name>` repo may be
* auto-cloned onto customer devices (see ALLOWED_DEFAULT_MARKETPLACE_REPOS).
* Every entry must also be in ALLOWED_OFFICIAL_MARKETPLACE_NAMES (a test
* enforces the subset).
*
* Backend-sync-only marketplaces (private repos served through the claude.ai
* default-marketplace pipeline, e.g. first-party-plugins) are official for
* telemetry/force-enable purposes but must NOT be listed here: the client
* clone would fail (private repo), and the auto-clone path assumes public
* fetchability.
*/
var AUTO_CLONE_MARKETPLACE_NAMES = /* @__PURE__ */ new Set([
	"claude-code-marketplace",
	"claude-code-plugins",
	"claude-plugins-official",
	"anthropic-marketplace",
	"anthropic-plugins",
	"agent-skills",
	"life-sciences",
	"knowledge-work-plugins"
]);
/**
* Anthropic-official plugin marketplaces. Plugin names from these are
* Anthropic-defined (not user/customer-defined) and safe to emit unredacted.
*
* Mirrors claude-cli-internal/src/utils/plugins/schemas.ts — keep in sync.
* SECURITY: names here are also eligible for force-enable via the
* cowork_fusion_metadata GrowthBook config (useSystemInternalPluginIds), so
* an entry asserts the marketplace's CONTENT is Anthropic-controlled. That
* holds via one of two bindings: membership in AUTO_CLONE_MARKETPLACE_NAMES
* (clients clone exactly anthropics/<name>), or a backend default
* marketplace whose source repo is pinned server-side
* (_DEFAULT_MARKETPLACE_PRIVATE_SOURCE_ALLOWLIST / owner allowlist in the
* anthropic monorepo). Never add a name with neither binding.
*/
var ALLOWED_OFFICIAL_MARKETPLACE_NAMES = /* @__PURE__ */ new Set([...AUTO_CLONE_MARKETPLACE_NAMES, "first-party-plugins"]);
new Set([...AUTO_CLONE_MARKETPLACE_NAMES].map((name) => `anthropics/${name}`));
[...ALLOWED_OFFICIAL_MARKETPLACE_NAMES];
/**
* Is this plugin from an Anthropic-official marketplace? Parses the
* `@marketplace` suffix; UUID ids (no `@`) return false.
*
* Ankur Rathi (Slack C08HG9SATJP, 2026-03-12): custom names are
* `TAXONOMY_TAG_PII_MODERATE_USER_DEFINED_TOOL`; official names are not PII.
*/
function isOfficialMarketplacePlugin(id) {
	const atIndex = id.lastIndexOf("@");
	if (atIndex <= 0) return false;
	return ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(id.slice(atIndex + 1));
}
/** Full pluginId only when from an official marketplace; else `<plugin>@other`. */
function redactPluginId(id) {
	return isOfficialMarketplacePlugin(id) ? id : "<plugin>@other";
}
/**
* Sink-side shape guard for `official-plugin__` tool-name segments. Mirrors
* INTERNAL_TOOL_SHAPE in desktop's telemetry-scrub.ts but additionally
* accepts `.`/`-`/`*` since plugin-author-defined cli/server/op names use
* them (and `*` is the documented "no op matched" fallback). Defense-in-
* depth, not the primary gate — the load-bearing check is
* {@link isOfficialMarketplacePlugin} on the pluginId segment.
*/
var OFFICIAL_PLUGIN_TOOL_SHAPE = /^[a-zA-Z0-9_.*-]{1,64}$/;
/** Mirrors claude-cli-internal/src/telemetry/pluginTelemetry.ts — keep in sync. */
var PLUGIN_ID_HASH_SALT = "claude-plugin-telemetry-v1";
var saltedHash = (s) => fasthashDjb2(PLUGIN_ID_HASH_SALT + s);
/** djb2 — callers must pass `orgUuid + name` (per-org salt) to defeat rainbow tables. */
var analyticsNameHash = fasthashDjb2;
/** Mask the AWS account-id segment of a Bedrock ARN; keep region + resource.
*  `aws[^:]*` covers GovCloud (`aws-us-gov`) and CN (`aws-cn`) partitions. */
var redactBedrockArnAccountId = (s) => s.replace(/^(arn:aws[^:]*:bedrock:[^:]*:)\d+(:)/, "$1***$2");
var EMAIL_SHAPE_RE = /[\w.+-]{1,64}@[\w-]{1,63}(?:\.[\w-]{1,63}){0,7}\.[A-Za-z][\w-]{0,62}/;
var SEGMENT_JWT_RE = /eyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{8,}/;
var SEGMENT_KEY_PREFIX_RES = [
	/(?<![A-Za-z0-9])sk-ant-[A-Za-z0-9._-]{8,}/,
	/(?<![A-Za-z0-9])[sr]k[-_][A-Za-z0-9_-]{20,}/,
	/\bAKIA[0-9A-Z]{16}\b/,
	/\bASIA[0-9A-Z]{16}\b/,
	/\bAIza[0-9A-Za-z_-]{35}(?![0-9A-Za-z_-])/,
	/\bgh[opusr]_[A-Za-z0-9]{36,}/,
	/\bgithub_pat_[A-Za-z0-9_]{22,}/,
	/\bxox[baprs]-[A-Za-z0-9-]{10,}/
];
var SEGMENT_AUTH_SCHEME_RE = /^(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}$/i;
var SEGMENT_AUTH_SCHEME_SUBSTRING_RE = /(?:^|[^A-Za-z0-9])(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{16,}/i;
var SEGMENT_BLOB_CHARSET_RE = /^[A-Za-z0-9+/=_-]{40,}$/;
var SEGMENT_HEX_RE = /^[0-9a-fA-F]{40,}$/;
function isSecretShapedBlobSegment(decoded) {
	if (!SEGMENT_BLOB_CHARSET_RE.test(decoded)) return false;
	const hasDigit = /[0-9]/.test(decoded);
	const hasLower = /[a-z]/.test(decoded);
	const hasUpper = /[A-Z]/.test(decoded);
	if (SEGMENT_HEX_RE.test(decoded) && hasDigit && /[a-fA-F]/.test(decoded)) return true;
	if (!hasDigit || !/[A-Za-z]/.test(decoded)) return false;
	if ((decoded.match(/[+/_-]/g)?.length ?? 0) > Math.max(4, Math.floor(decoded.length / 12))) return false;
	if ((decoded.match(/[aeiou]/gi)?.length ?? 0) / decoded.length >= .3) return false;
	if (hasLower && hasUpper) return true;
	return (decoded.match(/[0-9]/g)?.length ?? 0) >= 6;
}
/** Mask secret-shaped segments of a URL pathname. Ordinary path words,
*  version tags, and UUID-shaped resource ids pass through; see the section
*  comment above for shape rationale and the UUID decision. Exported for
*  direct testing and for sinks that hold a bare pathname. */
function redactSecretShapedPathSegments(pathname) {
	return pathname.split("/").map((raw) => maskSecretShapedSegment(raw)).join("/");
}
function classifySecretShapedSegment(raw) {
	if (raw.length < 6) return;
	if (raw.length > 2048) return {
		placeholder: "<blob>",
		matched: void 0
	};
	let decoded = raw;
	try {
		decoded = decodeURIComponent(raw);
	} catch {
		decoded = raw.replace(/(?:%[0-9A-Fa-f]{2})+/g, (m) => {
			try {
				return decodeURIComponent(m);
			} catch {
				return m.replace(/%[0-9A-Fa-f]{2}/g, (pair) => {
					try {
						return decodeURIComponent(pair);
					} catch {
						return pair;
					}
				});
			}
		});
	}
	decoded = decoded.replace(/[\u3002\uFF0E\uFF61]/g, ".");
	const strippedDetection = decoded.replace(/\p{Default_Ignorable_Code_Point}/gu, "");
	return classifyDetectionCopy(strippedDetection) ?? (strippedDetection === decoded ? void 0 : classifyDetectionCopy(decoded));
}
/** The rule battery, over one prepared detection copy (decoded, dotted,
*  and — on the primary pass — ignorable-stripped). Split out so the
*  ignorable handling above can classify two views. The rule order is
*  load-bearing: see the note after the placeholder canonicalization. */
function classifyDetectionCopy(decoded) {
	if (/^<(?:jwt|token|email|blob)>$/.test(decoded)) return {
		placeholder: decoded,
		matched: decoded
	};
	const jwtMatch = SEGMENT_JWT_RE.exec(decoded);
	if (jwtMatch) return {
		placeholder: "<jwt>",
		matched: jwtMatch[0]
	};
	if (SEGMENT_AUTH_SCHEME_RE.test(decoded)) return {
		placeholder: "<token>",
		matched: decoded
	};
	const authMatch = SEGMENT_AUTH_SCHEME_SUBSTRING_RE.exec(decoded);
	if (authMatch) return {
		placeholder: "<token>",
		matched: authMatch[0]
	};
	for (const re of SEGMENT_KEY_PREFIX_RES) {
		const keyMatch = re.exec(decoded);
		if (keyMatch) return {
			placeholder: "<token>",
			matched: keyMatch[0]
		};
	}
	const emailMatch = EMAIL_SHAPE_RE.exec(decoded);
	if (emailMatch) return {
		placeholder: "<email>",
		matched: emailMatch[0]
	};
	if (isSecretShapedBlobSegment(decoded)) return {
		placeholder: "<blob>",
		matched: decoded
	};
	if (/[\s"':=]/.test(decoded) && redactSecretLike(decoded) !== decoded) return {
		placeholder: "<token>",
		matched: void 0
	};
}
/** One URL segment — a path segment or a hostname label — through the
*  secret-shape battery: the placeholder when the (decoded) segment
*  matches a rule, the raw segment unchanged otherwise. The
*  placeholder-only view of {@link classifySecretShapedSegment}, which
*  redactSecretShapedPathSegments maps over path segments and
*  maskPreParseHost runs over hostname labels. */
function maskSecretShapedSegment(raw) {
	return classifySecretShapedSegment(raw)?.placeholder ?? raw;
}
var PLACEHOLDER_HOST_LABEL_RE = /^<(?:jwt|token|email|blob)>$/;
var NON_CANONICAL_HOST_BYTE_RE = /[^\x21-\x7e]|[#%/:<>?@[\\\]^|]/;
var SLASH_TOLERANT_SCHEME_RE = /^(?:https?|wss?|ftp):$/i;
var FILE_SCHEME_RE = /^file:$/i;
/** Locate the authority's host in the PRE-PARSE spelling of `cleaned` (a
*  URL string that already has the WHATWG pre-parse strips applied).
*  new URL() lowercases the hostname, which both case-folds a leaked
*  value and silently defeats the case-sensitive secret detectors
*  (SEGMENT_JWT_RE's "eyJ" anchor, the AKIA/ASIA/AIza rules — see the
*  /i note on SEGMENT_KEY_PREFIX_RES), so detection has to see the
*  original spelling. Returns undefined when the spelling has no
*  authority to scan; for every scheme family here, such spellings
*  cannot produce a nonempty parsed hostname either (special schemes
*  always enter the slash-skip; file: accepts any two-slash-ish run;
*  a non-special scheme without "//" parses as an opaque path), so
*  skipping the host scan loses no coverage. */
function extractPreParseHost(cleaned) {
	const scheme = /^[A-Za-z][A-Za-z0-9+.-]*:/.exec(cleaned);
	if (!scheme) return;
	let i = scheme[0].length;
	if (SLASH_TOLERANT_SCHEME_RE.test(scheme[0])) while (i < cleaned.length && (cleaned[i] === "/" || cleaned[i] === "\\")) i++;
	else if (FILE_SCHEME_RE.test(scheme[0]) ? /^[/\\]{2}/.test(cleaned.slice(i)) : cleaned.startsWith("//", i)) i += 2;
	else return;
	let end = i;
	while (end < cleaned.length && !"/\\?#".includes(cleaned.charAt(end))) end++;
	const authority = cleaned.slice(i, end);
	const hostStart = i + authority.lastIndexOf("@") + 1;
	const hostPart = cleaned.slice(hostStart, end);
	if (hostPart.startsWith("[")) return {
		host: hostPart,
		start: hostStart,
		end,
		ipv6: true
	};
	const colon = hostPart.indexOf(":");
	const host = colon === -1 ? hostPart : hostPart.slice(0, colon);
	return {
		host,
		start: hostStart,
		end: hostStart + host.length,
		ipv6: false
	};
}
/** Mask secret-shaped labels of a pre-parse host spelling, reusing the
*  path segments' classifier. Returns the masked host string, or
*  undefined when the host needs no override (nothing masked, no label
*  already a placeholder) — the caller then emits `parsed.hostname` and
*  behavior is byte-identical to the path-only version of this module.
*  `parsedHostname` supplies the canonical (lowercased, IDN/percent
*  normalized) spelling for labels that are KEPT; it is undefined when
*  the URL did not parse (the stand-in-parse path in redactMcpServerUrl).
*  Ordinary vendor hosts are untouched: every rule in the classifier is
*  anchored or composition-guarded (section comment above), and real DNS
*  labels — eTLD+1 and catalog-known MCP hosts included — don't hit
*  them; the verbatim-host vectors in the test table pin this. */
function maskPreParseHost(rawHost, parsedHostname) {
	rawHost = rawHost.replace(/\p{Default_Ignorable_Code_Point}/gu, "");
	rawHost = rawHost.replace(/[\u3002\uFF0E\uFF61]/g, ".");
	if (rawHost.length > 2048) return "<blob>";
	const wholeVerdict = classifySecretShapedSegment(rawHost);
	if (wholeVerdict?.matched?.includes(".") && (wholeVerdict.placeholder === "<jwt>" || wholeVerdict.placeholder === "<token>")) {
		if (wholeVerdict.placeholder === "<token>") return "<token>";
		let decodedHost = rawHost;
		try {
			decodedHost = decodeURIComponent(rawHost);
		} catch {}
		if (/(?<![A-Za-z0-9])eyJ/.test(rawHost) || /(?<![A-Za-z0-9])eyJ/.test(decodedHost)) return "<jwt>";
	}
	const rawLabels = rawHost.split(".");
	const parsedLabels = parsedHostname?.split(".");
	if (parsedLabels && parsedLabels.length !== rawLabels.length) {
		let decodedRawLabels = [];
		try {
			decodedRawLabels = decodeURIComponent(rawHost).replace(/[\u3002\uFF0E\uFF61]/g, ".").split(".");
		} catch {}
		for (const label of [
			...rawLabels,
			...parsedLabels ?? [],
			...decodedRawLabels
		]) {
			const masked = maskSecretShapedSegment(label);
			if (masked !== label) return masked;
		}
		return;
	}
	let needsOverride = false;
	let unvettedKeptLabel = false;
	const out = rawLabels.map((rawLabel, idx) => {
		if (PLACEHOLDER_HOST_LABEL_RE.test(rawLabel)) {
			needsOverride = true;
			return rawLabel;
		}
		const masked = maskSecretShapedSegment(rawLabel);
		if (masked !== rawLabel) {
			needsOverride = true;
			return masked;
		}
		const parsedLabel = parsedLabels?.[idx];
		if (parsedLabel === void 0) {
			if (NON_CANONICAL_HOST_BYTE_RE.test(rawLabel)) unvettedKeptLabel = true;
			return rawLabel.toLowerCase();
		}
		if (parsedLabel !== rawLabel.toLowerCase()) {
			let checkable;
			if (parsedLabel.startsWith("xn--")) {
				let decodedRaw = rawLabel;
				try {
					decodedRaw = decodeURIComponent(rawLabel);
				} catch {}
				checkable = decodedRaw.replace(/[^\x20-\x7e]+/g, "");
			} else checkable = parsedLabel;
			const maskedParsed = maskSecretShapedSegment(checkable);
			if (maskedParsed !== checkable) {
				needsOverride = true;
				return maskedParsed;
			}
		}
		return parsedLabel;
	});
	if (!needsOverride) return;
	if (unvettedKeptLabel) return;
	return out.join(".");
}
/** `scheme://host[:port]/path` — drops userinfo, query, and fragment, and
*  masks secret-shaped content in BOTH the path and the host: path
*  segments via {@link redactSecretShapedPathSegments}, and hostname
*  labels via the same classifier (per label, on the pre-parse spelling —
*  {@link maskPreParseHost} explains why the parsed hostname is too late),
*  so an MCP server URL is safe to log to analytics. Host labels mask
*  ONLY when secret-shaped — a signed JWT, a known key prefix, a
*  40+-char opaque blob, an encoded "Bearer …"/"Basic …" value (a
*  pasted bare token or whole JWT parses as the hostname and is
*  caught); emails do NOT mask in the host position — an email's
*  "@…domain" dot is the label separator, so no single label is
*  email-shaped and the whole-host collapse is deliberately not extended
*  to it (ledgered in the section comment: the only reachable spelling
*  is an opaque-host scheme, and under http(s) the "@"/"%40" host fails
*  to parse so nothing ships). Word-slug and short opaque per-tenant
*  capability hostnames pass through by design, the same shape bar that
*  keeps ordinary vendor hosts byte-identical to today's canonical
*  parsed spelling (see the section comment's ledger above). A matched
*  credential that spans a "." label separator (a JWT's three dotted
*  parts, a dotted sk-ant- key, a dotted Bearer/Basic token) collapses
*  the WHOLE host to its placeholder; every dot-free family masks only
*  its own label, so a vendor/cloud suffix survives ("<token>.vendor.com")
*  — see {@link maskPreParseHost}.
*
*  Returns undefined when the URL has no host (fail-closed — an
*  unparseable URL won't join to the catalog anyway).
*
*  A host placeholder makes the output an invalid URL by design ("<" is
*  a forbidden host code point). Like the %3Cjwt%3E note above, warehouse
*  consumers must accept a second spelling: the web Segment plugin's
*  URL-property scrub re-serializes a host-masked value to its
*  protocol-relative form ("//<token>/mcp" — redactUrlPropertyPath's
*  scheme re-entry for parse-rejected spellings), while desktop rows
*  carry the "https://<token>/mcp" form this function emits. Feeding the
*  output back through this function returns it unchanged for the
*  special schemes this field carries (http/https/ws/wss): kept labels
*  are already the parser's canonical spelling, and a masked-host output
*  takes the no-parse path whose kept-label guard admits exactly the
*  bytes a successful parse could itself have emitted. Two ledgered
*  exceptions, both over-redaction on a re-feed rather than leaks: (i) a
*  genuine non-ASCII IDN label whose punycoded (xn--…) first-pass
*  spelling is long and digit-bearing enough to read blob-shaped to a
*  re-feed that can no longer see the unicode original (it masks to
*  <blob>); (ii) a non-special/opaque-host scheme (mcp+custom://, foo://)
*  whose kept labels keep their raw case on the first pass but case-fold
*  on the no-parse re-feed once a masked sibling has made the host
*  unparseable.
*
*  Matches iOS `URL.analyticsSafeAbsoluteString` on the query/userinfo
*  strip; the path-segment and host-label masking are NOT yet mirrored
*  on iOS. */
function redactMcpServerUrl(url) {
	if (!url) return url;
	const cleaned = url.replace(/[\t\n\r]/g, "").replace(/^[\x00-\x20]+/, "").replace(/[\x00-\x20]+$/, "");
	let parsed;
	try {
		parsed = new URL(cleaned);
	} catch {
		parsed = void 0;
	}
	const pre = extractPreParseHost(cleaned);
	if (pre && !pre.ipv6 && pre.host !== "") {
		const maskedHost = maskPreParseHost(pre.host, parsed?.hostname);
		if (maskedHost !== void 0) {
			if (!parsed) try {
				parsed = new URL(`${cleaned.slice(0, pre.start)}host.invalid${cleaned.slice(pre.end)}`);
			} catch {
				return;
			}
			const port = parsed.port ? `:${parsed.port}` : "";
			return `${parsed.protocol}//${maskedHost}${port}${redactSecretShapedPathSegments(parsed.pathname)}`;
		}
	}
	if (!parsed || !parsed.hostname) return;
	const port = parsed.port ? `:${parsed.port}` : "";
	return `${parsed.protocol}//${parsed.hostname}${port}${redactSecretShapedPathSegments(parsed.pathname)}`;
}
/**
* SDK built-in tool names that are safe to log verbatim: a fixed product
* vocabulary with no user-chosen content. Sources: the desktop base-tool list
* (packages/managed-config/src/desktop/schema.ts BUILTIN_TOOL_NAMES) and the
* CC session tool vocabulary (the builtin tool names the Claude Code SDK
* emits). Anything not
* listed is salted-hashed by [redactToolName]'s terminal branch (fail-closed):
* listing a user-influenced name here would be a leak, while leaving a genuine
* builtin out only costs dashboard legibility — when in doubt, leave it out.
*/
var KNOWN_BUILTIN_TOOL_NAMES = /* @__PURE__ */ new Set([
	"AskUserQuestion",
	"Bash",
	"BashOutput",
	"Edit",
	"ExitPlanMode",
	"Glob",
	"Grep",
	"JavaScript",
	"KillBash",
	"MultiEdit",
	"NotebookEdit",
	"Read",
	"REPL",
	"SendUserMessage",
	"Skill",
	"Task",
	"TaskCreate",
	"TaskGet",
	"TaskList",
	"TaskStop",
	"TaskUpdate",
	"Tmux",
	"TodoWrite",
	"ToolSearch",
	"WebFetch",
	"WebSearch",
	"Workflow",
	"Write",
	"unknown"
]);
/**
* Fixed action vocabularies for the `computer:` / `browser:` sentinel tool
* prefixes. The pass-through is anchored to these names rather than the prefix
* alone because a user can name an MCP connector "computer" or "browser", and
* its tool names would otherwise ride the carve-out unredacted. `browser`
* merges the two Anthropic-defined vocabularies that reach the `browser:`
* prefix: BROWSER_TOOLS (claude-for-chrome-mcp browserTools.ts, via the
* chrome_bridge_tool_call_* emitters) and the extension permission ToolType
* enum (claude-browser-use tools/types.ts — `browser:${request.toolType}`
* via ToolPermissionBroker / chromeToolPermissions, plus the receiver's
* "unknown" fallback). An action missing here is hashed, which only costs
* legibility — extend when adding sentinel tools to either vocabulary.
*/
var COMPUTER_SENTINEL_ACTIONS = /* @__PURE__ */ new Set([
	"app_bring_to_current_space",
	"request_full_control",
	"request_access",
	"request_teach_access"
]);
var BROWSER_SENTINEL_ACTIONS = /* @__PURE__ */ new Set([
	"browser_batch",
	"click",
	"computer",
	"domain_transition",
	"execute_javascript",
	"file_upload",
	"find",
	"form_input",
	"get_page_text",
	"gif_creator",
	"javascript_tool",
	"list_connected_browsers",
	"navigate",
	"plan_approval",
	"read_console_messages",
	"read_network_requests",
	"read_page",
	"read_page_content",
	"remote_mcp",
	"resize_window",
	"select_browser",
	"shortcuts_execute",
	"shortcuts_list",
	"submit_credentials",
	"switch_browser",
	"tabs_close_mcp",
	"tabs_context_mcp",
	"tabs_create_mcp",
	"type",
	"unknown",
	"upload_image"
]);
/**
* Redact the user-chosen segments of a tool name. Known builtins
* ([KNOWN_BUILTIN_TOOL_NAMES]) and the fixed-enum `computer:*` / `browser:*`
* sentinel pair pass through unchanged; every other shape is hashed.
*
* `mcp__<server>__<tool>` → hash both segments.
* `plugin-shim:<plugin>:<cli>:<op>` → hash all three segments. `op` is
*   the plugin-author-defined PluginConfirmRule.op (manifestParsing.ts),
*   not a fixed enum — for custom/github plugins it can encode org
*   context (e.g. `export_acmecorp_payroll`), same PII class as plugin/cli.
* `webfetch:<hostname>` → hash hostname (user's browsing target).
* `<server>:<tool>` (any other colon-form) → hash both segments; the colon
*   form is the legacy/local MCP connector convention.
* Anything else → pass through only when it is a known builtin; otherwise
*   hash the whole name (fail-closed — bare names can be user-configured
*   MCP tool names reaching sinks without a prefix).
*
* `hashFn` defaults to the module's fixed-salt hash; sinks that have a
* per-org salt in scope (desktop's buildHashKeyHandlers) pass their own so
* every hashed segment gets rainbow-table resistance, not just `mcp__` names.
*/
function redactToolName(toolName, hashFn = saltedHash) {
	if (toolName.startsWith("mcp__")) {
		const parts = toolName.split("__");
		const server = parts[1] ?? "";
		const tool = parts.slice(2).join("__");
		return `mcp__${hashFn(server)}__${hashFn(tool)}`;
	}
	if (toolName.startsWith("plugin-shim:")) {
		const parts = toolName.split(":");
		const plugin = parts[1] ?? "";
		const cli = parts[2] ?? "";
		const op = parts.slice(3).join(":");
		return `plugin-shim:${hashFn(plugin)}:${hashFn(cli)}:${hashFn(op)}`;
	}
	if (toolName.startsWith("webfetch:")) return `webfetch:${hashFn(toolName.slice(9))}`;
	const colonIndex = toolName.indexOf(":");
	if (colonIndex !== -1) {
		const prefix = toolName.slice(0, colonIndex);
		const suffix = toolName.slice(colonIndex + 1);
		if ((prefix === "computer" ? COMPUTER_SENTINEL_ACTIONS : prefix === "browser" ? BROWSER_SENTINEL_ACTIONS : void 0)?.has(suffix)) return toolName;
		return `${hashFn(prefix)}:${hashFn(suffix)}`;
	}
	return KNOWN_BUILTIN_TOOL_NAMES.has(toolName) ? toolName : hashFn(toolName);
}
/**
* Hash a `${serverName}:${toolName}` map key. Unlike `redactToolName`,
* the first segment is always a user/admin-chosen server name — never a
* builtin namespace — so no prefix passes through unhashed. Uses the
* module's fixed salt (`saltedHash`), so segments are joinable with
* 1-arg `redactToolName` output but NOT with sinks that inject a
* per-org hash (desktop's `tool_name` via `hashMcpToolName`). For
* support-bundle map keys where no org context exists.
*/
function redactServerToolKey(key) {
	const colonIndex = key.indexOf(":");
	if (colonIndex === -1) return saltedHash(key);
	const server = key.slice(0, colonIndex);
	const tool = key.slice(colonIndex + 1);
	return `${saltedHash(server)}:${saltedHash(tool)}`;
}
/**
* Query params allowed through to observability sinks (Datadog RUM, Sentry).
* Everything else is stripped so user prompts, emails, tokens, and other PII
* in `?q=` / `?email=` / `?code=` never reach a third-party telemetry store.
*
* This base set is used where per-click-unique ad identifiers would blow up
* URL cardinality. The Segment/Antalytics sinks use
* {@link SAFE_QUERY_PARAMS_ANALYTICS} instead, which extends this with
* marketing-attribution params.
*
* Entries must be lowercase — {@link redactQueryParams} lowercases the key
* before lookup so mixed-case variants (`GCLID`, `UTM_Source`) match.
*/
var SAFE_QUERY_PARAMS = /* @__PURE__ */ new Set([
	"limit",
	"offset",
	"page",
	"page_size",
	"page_token",
	"after_id",
	"per_page",
	"cursor",
	"sort_by",
	"sort_order",
	"order_by",
	"start_date",
	"end_date",
	"date",
	"target_date",
	"days",
	"metric",
	"type",
	"granularity",
	"severity",
	"tab",
	"mode",
	"step"
]);
var UTM_QUERY_PARAMS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"utm_id"
];
var CLICK_ID_QUERY_PARAMS = [
	"gclid",
	"fbclid",
	"ttclid",
	"rdt_cid",
	"dclid",
	"msclkid",
	"twclid",
	"li_fat_id",
	"irclickid",
	"sccid",
	"epik",
	"wbraid",
	"gbraid",
	"yclid"
];
[.../* @__PURE__ */ new Set([...SAFE_QUERY_PARAMS, ...UTM_QUERY_PARAMS]), ...CLICK_ID_QUERY_PARAMS];
/** Recursively scrubString every string leaf; skipKeys/keyHandlers let callers
*  exempt structural ids or apply per-key redaction. Returns a copy.
*  Shared refs (DAGs) resolve to the same scrubbed copy; true cycles are
*  replaced with "[Circular]" — never the original object. */
function deepScrubStrings(obj, opts) {
	const seen = /* @__PURE__ */ new WeakMap();
	const safeScrubString = (s) => {
		try {
			return opts.scrubString(s);
		} catch {
			return "[scrub-error]";
		}
	};
	const walk = (v) => {
		if (typeof v === "string") return safeScrubString(v);
		if (typeof v !== "object" || v === null) return v;
		if (seen.has(v)) return seen.get(v);
		seen.set(v, "[Circular]");
		if (Array.isArray(v)) {
			const out = v.map(walk);
			seen.set(v, out);
			return out;
		}
		const out = Object.create(null);
		const nextSuffix = /* @__PURE__ */ new Map();
		for (const [k, val] of Object.entries(v)) {
			let outKey = safeScrubString(k);
			if (Object.hasOwn(out, outKey)) {
				const base = outKey;
				let i = nextSuffix.get(base) ?? 2;
				outKey = `${base}[${i}]`;
				while (Object.hasOwn(out, outKey)) {
					i++;
					outKey = `${base}[${i}]`;
				}
				nextSuffix.set(base, i + 1);
			}
			try {
				if (opts.skipKeys?.has(k)) out[outKey] = val;
				else if (opts.keyHandlers && Object.hasOwn(opts.keyHandlers, k)) out[outKey] = opts.keyHandlers[k](val, k);
				else out[outKey] = walk(val);
			} catch {
				out[outKey] = "[scrub-error]";
			}
		}
		seen.set(v, out);
		return out;
	};
	try {
		return walk(obj);
	} catch {
		return "[scrub-error]";
	}
}
/** Shipped in place of a single line when its lineScrub threw — withhold
*  just that line rather than the whole file, but never ship it raw. */
var SCRUB_FAILED_LINE_PLACEHOLDER = "[line withheld: scrub failed]";
/** Scrub a file destined for a diagnostics zip, in-memory. .log/.txt are
*  scrubbed line-wise, .json/.jsonl deep-walked, anything else (binary —
*  images, archives) passes through unchanged. Parse or scrub failures fall
*  back to line-level scrubbing of the raw text; a line whose scrub throws
*  is replaced with a placeholder rather than shipped raw. */
function scrubBufferForBundle(filename, bytes, opts) {
	const lower = filename.toLowerCase();
	const safeLineScrub = (line) => {
		try {
			return opts.lineScrub(line);
		} catch (err) {
			opts.onError?.(err, filename);
			return SCRUB_FAILED_LINE_PLACEHOLDER;
		}
	};
	const lineScrubWholeBuffer = () => Buffer.from(bytes.toString("utf8").split("\n").map(safeLineScrub).join("\n"), "utf8");
	try {
		if (lower.endsWith(".log") || lower.endsWith(".txt")) return lineScrubWholeBuffer();
		if (lower.endsWith(".json")) {
			const scrubbed = deepScrubStrings(JSON.parse(bytes.toString("utf8")), opts.jsonScrubOpts);
			return Buffer.from(JSON.stringify(scrubbed), "utf8");
		}
		if (lower.endsWith(".jsonl")) {
			const scrubbed = bytes.toString("utf8").split("\n").map((line) => {
				if (!line.trim()) return line;
				try {
					const parsed = JSON.parse(line);
					return JSON.stringify(deepScrubStrings(parsed, opts.jsonScrubOpts));
				} catch {
					return safeLineScrub(line);
				}
			}).join("\n");
			return Buffer.from(scrubbed, "utf8");
		}
	} catch (err) {
		opts.onError?.(err, filename);
		return lineScrubWholeBuffer();
	}
	return bytes;
}
/** The shared email shape (EMAIL_SHAPE_RE, defined with the path-segment
*  rules above), as the free-text /g scanner. */
var EMAIL_RE = new RegExp(EMAIL_SHAPE_RE.source, "g");
/** Replace email addresses with `<email>`. */
function redactEmail(text) {
	return text.replace(EMAIL_RE, "<email>");
}
var IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
var IPV6_RE = /\b(?:[A-Fa-f0-9]{1,4}:){2,7}(?::?[A-Fa-f0-9]{1,4}){1,7}\b/g;
var TIMESTAMP_LIKE = /^\d{1,2}:\d{2}:\d{2}$/;
/** Replace IPv4/IPv6 literals with `<ip>`. */
function redactIpAddress(text) {
	return text.replace(IPV4_RE, "<ip>").replace(IPV6_RE, (m) => TIMESTAMP_LIKE.test(m) ? m : "<ip>");
}
/**
* Redact each http(s)/ws(s) URL embedded in free text to
* `scheme://host[:port]/<path>` — drops the path as well as userinfo, query,
* and fragment. Falls back to `<url>` when unparseable or hostless.
*
* Contrast with `redactMcpServerUrl`, which keeps the path: MCP server URLs
* are operator-configured and their path identifies which server, but a URL
* echoed into an error message is usually user browsing data (Chrome-bridge
* failures, fetch errors) where the path is as sensitive as the query string.
*/
function redactEmbeddedUrlsToHost(text) {
	return text.replace(/\b(?:https?|wss?):\/\/\S+/gi, (u) => {
		const tailMatch = /[)\].,;:'"}]+$/.exec(u);
		let tail = tailMatch ? tailMatch[0] : "";
		let url = tail ? u.slice(0, -tail.length) : u;
		if (url.includes("[") && !url.includes("]")) {
			const closeIdx = tail.indexOf("]");
			if (closeIdx !== -1) {
				url += tail.slice(0, closeIdx + 1);
				tail = tail.slice(closeIdx + 1);
			}
		}
		try {
			const p = new URL(url);
			if (!p.hostname) return `<url>${tail}`;
			const port = p.port ? `:${p.port}` : "";
			return `${p.protocol}//${p.hostname}${port}/<path>${tail}`;
		} catch {
			return `<url>${tail}`;
		}
	});
}
var CREDENTIAL_KEY_RE = "(?:password|passwd|pwd|pass[-_]?phrase|secret|token|credential|auth|api[-_]?key|api[-_]?token|access[-_]?key|access[-_]?token|refresh[-_]?token|id[-_]?token|client[-_]?secret|private[-_]?key|session[-_]?(?:key|token|id)(?:[-_]?v\\d+)?|sessid|jsessionid|phpsessid|connect\\.sid|aws[-_]?secret[-_]?access[-_]?key)";
var KV_SEP = `(?:(?:\\\\\\\\)*\\\\["']|['"])?\\s*(?:[:=][:=>~|]*(?![:=>~|]))\\s*`;
var FLAG_KEY = `-{1,2}(?:[A-Za-z0-9]+[-_])*${CREDENTIAL_KEY_RE}`;
var FLAG_SEP = `(?:\\s+|\\s*=\\s*)`;
var branchOpener = (q, escaped) => escaped ? `(?:\\\\\\\\)*\\\\${q}` : `${q}`;
var UNQUOTED_UNIT = `(?:[^\\s'"\\\\]|\\\\[^\\s\\n\\r"']|\\\\$)`;
var placeholderGuard = (terminator) => `(?!(?:<(?:token|redacted|jwt|blob)>|(?:sk-|bedrock-api-key-)?\\[redacted(?:-[a-z-]+)?\\])(?=${terminator}))`;
var MARKER_TERMINATOR = "…<truncated>(?=[\\r\\n]|$)";
var GUARD_UNQUOTED = placeholderGuard(`$|['"\\s]|\\\\["']|\\\\(?=\\s)|${MARKER_TERMINATOR}`);
/**
* Build one quoted value branch — opener capture, placeholder guard, and
* content class — from two parameters: the branch's quote character and
* whether the delimiters are backslash-escaped (`\"…\"`) or bare (`"…"`).
*
* Deriving all three pieces from the same parameters makes two past bug
* shapes unwritable by construction (both found by bughunter security-mode
* reviews of earlier revisions of this code):
*  - a missing branch for one quote type (the escaped-single-quote gap):
*    branches are instantiated from the same builder, so quote-type
*    asymmetry cannot arise inside a branch;
*  - a guard terminator the content class can consume (the whitespace /
*    shared-terminator bugs): the terminator is computed as the complement
*    of the content class — exactly the branch's own bare quote, newline,
*    end, and (escaped style only) its own odd-backslash closing quote. A
*    placeholder followed by anything the content class CAN consume is a
*    prefix of a longer value and must redact, not keep its label.
*
* Content: anything except the branch's own quote, a backslash, or a
* newline — plus `\X` escape pairs. In the escaped style the pair must not
* consume the branch's own quote (odd-backslash + own quote is the closing
* delimiter); in the plain style there is NO pair reading — plain quoting styles
* don't self-escape, so the class stops at the first bare quote exactly
* as main's classes do (the pair-aware plain reading was reverted: its
* follower-swallow was worse than the fragment it saved). Both shapes are one-parse
* deterministic: at a backslash only the pair alternative applies (exactly
* two chars), anywhere else only the char class.
*/
var quotedBranch = (q, escaped) => {
	const opener = `(${branchOpener(q, escaped)})`;
	const content = escaped ? `(?:[^${q}\\\\\\n\\r]|\\\\[^"'\\n\\r]|\\\\$)*` : `[^${q}\\n\\r]*`;
	const oppositeQ = q === "\"" ? "'" : "\"";
	return opener + placeholderGuard(`$|[${q}\\n\\r]|${MARKER_TERMINATOR}` + (escaped ? `|\\\\(?=[\\n\\r])|(?:\\\\\\\\)*\\\\[${q}${oppositeQ}]` : "")) + content;
};
var CREDENTIAL_VALUE_RE = `(?:${`${quotedBranch("\"", false)}|${quotedBranch("'", false)}|${quotedBranch("\"", true)}|${quotedBranch("'", true)}`}|${`${GUARD_UNQUOTED}(?!${MARKER_TERMINATOR})(?!\\\\+["'])(?![{\\[]\\\\+["'])${UNQUOTED_UNIT}+`})`;
var redactValueReplacer = (...args) => {
	return args.slice(1, -2).filter((g) => typeof g === "string").join("") + "<redacted>";
};
var SECRET_PATTERNS = [
	[/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/gi, "Bearer <token>"],
	[/(:\s*)Basic\s+[A-Za-z0-9+/=]{8,}/gi, "$1Basic <token>"],
	[/\bsk-ant-[A-Za-z0-9._-]{8,}/g, "<token>"],
	[/\b[sr]k[-_][A-Za-z0-9_-]{20,}/g, "<token>"],
	[/\bAKIA[0-9A-Z]{16}\b/gi, "<token>"],
	[/\bASIA[0-9A-Z]{16}\b/gi, "<token>"],
	[/\bAIza[0-9A-Za-z_-]{35}(?![0-9A-Za-z_-])/gi, "<token>"],
	[/\bgh[opusr]_[A-Za-z0-9]{36,}/g, "<token>"],
	[/\bgithub_pat_[A-Za-z0-9_]{22,}/g, "<token>"],
	[/\bxox[baprs]-[A-Za-z0-9-]{10,}/g, "<token>"],
	[/\bey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, "<jwt>"],
	[new RegExp(`(?<![A-Za-z0-9])(${CREDENTIAL_KEY_RE})(${KV_SEP})${CREDENTIAL_VALUE_RE}`, "gi"), redactValueReplacer],
	[new RegExp(`(?<![\\w-])(${FLAG_KEY})(${FLAG_SEP})${CREDENTIAL_VALUE_RE}`, "gi"), redactValueReplacer],
	[/(?<![A-Za-z0-9+/_-])[A-Za-z0-9+/]{40,}={0,2}(?![A-Za-z0-9+/_-])/g, "<blob>"],
	[/(?<![A-Za-z0-9+_-])[A-Za-z0-9+_-]{40,}={0,2}(?![A-Za-z0-9+_-])/g, "<blob>"]
];
/** Replace bearer tokens, known key prefixes, JWTs, and long opaque blobs. */
function redactSecretLike(text) {
	let out = text;
	for (const [re, sub] of SECRET_PATTERNS) out = typeof sub === "string" ? out.replace(re, sub) : out.replace(re, sub);
	return out;
}
var SCRUB_LINE_MAX = 8 * 1024;
/** Match `://user[:password]@` with lookahead for a plausible host.
*
*  - `(?!\[)` after `://` rejects an IPv6-literal authority (`://[::1]:…`)
*    so its internal colons can't open the password group; a mid-username
*    `[` still matches (only a leading-`[` username — RFC-invalid — is
*    lost). Username `[^\s/:]*` excludes `/` so a portless `…/@scope/pkg`
*    or `…/img@2x.png` path is not misread as userinfo.
*  - Password `[^\s/]{0,8192}` allows `?#@` (so `:Tr0ub4dor#3@` and
*    `:p@ssw0rd@` redact — greedy last-`@`) but stops at the first `/`:
*    userinfo lives only in the authority, which ends at `/`. This means
*    a `host:port/path…@…` URL is left intact for redactEmail / the
*    kv-rule downstream. The 8192 bound (= SCRUB_LINE_MAX) means a miss
*    never leaks a realistic credential.
*  - Known miss (CFV 57f37dc2 — NOT fixed by this rule): a password
*    containing an unencoded `/` (RFC-invalid in userinfo) is not
*    redacted here. The blob rule downstream catches a ≥40-char secret
*    ONLY when the host has no dot; for a dotted host (`@db.internal`,
*    `*.amazonaws.com` — the common case for AWS keys), redactEmail
*    runs first, matches the post-last-`/` segment + host, and
*    fragments the key below 40 chars so most of it ships. Allowing
*    this rule to cross `/` introduces regressions on every
*    `host:port/path…@…` URL (greedy anchors on the path `@`; lazy
*    anchors on the first `@` and under-redacts `@`+`/` passwords).
*    Pre-PR parity; a URL-parser-based scrub is required for coverage.
*  - Known leak (PRE-PR PARITY): `://host:443?key=v@lue` / `…#…@…` (port,
*    no `/path`) — `[^\s/]` crosses `?`/`#`, strands the post-`@` tail;
*    the kv-rule runs after stripUrlUserinfo so the consumed `key=`
*    anchor is unrecoverable.
*  - Every character class excludes `\s`, so a match never spans
*    whitespace — stripUrlUserinfo relies on this. */
var URL_USERINFO_RE = /:\/\/(?!\[)[^\s/:]*(?::[^\s/]{0,8192})?@(?=[^@\s?#]*(?:[/:?#\s]|$))/g;
/** A single whitespace-free run with more `://` than this is redacted
*  wholesale by stripUrlUserinfo instead of regex-scanned. Real telemetry
*  has ≤ a handful of URLs per whitespace-free run; the main false
*  positive is a minified JSON array of URLs embedded as one string
*  leaf — redacting that is acceptable. */
var MAX_USERINFO_SCHEMES_PER_SEGMENT = 32;
/** Strip `://user[:password]@` from `text` in bounded time. scrubFreeText has
*  uncapped callers (support-bundle JSON leaves, Sentry event fields) that
*  feed untrusted MCP/tool output, so adversarial multi-MB input reaches
*  this path. This wrapper runs URL_USERINFO_RE per `\S+` segment (exactly
*  equivalent — no match spans whitespace) and redacts any segment with
*  > MAX_USERINFO_SCHEMES_PER_SEGMENT `://` wholesale.
*
*  With the current authority-only password class (`[^\s/]`) the density
*  cap is NOT load-bearing: each `://` contains a `/`, so every `/`-free
*  run has ≤1 start and the raw regex is already O(n) on dense input.
*  The cap is kept as a guard against a future regex change widening the
*  password class past `/`, which would reintroduce O(n·8192) per-start
*  backtracking and make the cap load-bearing again. */
function stripUrlUserinfo(text) {
	if (!text.includes("@")) return text;
	return text.replace(/\S+/g, (seg) => {
		if (!seg.includes("@")) return seg;
		let schemes = 0;
		for (let i = seg.indexOf("://"); i !== -1; i = seg.indexOf("://", i + 3)) if (++schemes > MAX_USERINFO_SCHEMES_PER_SEGMENT) return `<redacted:dense-urls:${seg.length}b>`;
		if (schemes === 0) return seg;
		return seg.replace(URL_USERINFO_RE, "://<userinfo>@");
	});
}
/**
* Composite free-text scrubber: URL userinfo → filesystem paths → emails →
* IPs → secrets. Paths first so a homedir-embedded username is normalised
* before the (non-existent) username rule would need to see it; secrets last
* so a token inside a URL query has already had the URL path normalised.
* No length cap — bounded-time userinfo stripping is handled inside
* stripUrlUserinfo; callers that want an 8KB hard cap use scrubLogLine.
*/
function scrubFreeText(text, opts) {
	return redactSecretLike(redactIpAddress(redactEmail(scrubFilesystemPaths(stripUrlUserinfo(text), opts))));
}
/** scrubFreeText with an 8KB hard cap — a single log line that long is itself
*  anomalous, and the tail is almost certainly a blob we'd redact anyway.
*  The truncation marker is appended AFTER scrubbing: if the cut lands
*  inside an unterminated quoted credential value, the escape-aware content
*  classes consume to end-of-text, and a marker appended first would be
*  folded into `<redacted>` — erasing the truncation signal diagnostics
*  rely on. */
function scrubLogLine(text, opts) {
	if (text.length > SCRUB_LINE_MAX) return scrubFreeText(text.slice(0, SCRUB_LINE_MAX), opts) + "…<truncated>";
	return scrubFreeText(text, opts);
}
/**
* Normalize filesystem paths in free text. Order matters: appPath before
* homedir (so a homedir prefix inside appPath doesn't eat it), homedir
* before the Users regex (so the current user becomes "<home>" not "<user>"),
* Users regex before UNC (UNC roaming profiles can contain a \Users\
* segment). Prod issue 7314143339: 2.22M events carrying usernames.
*/
function scrubFilesystemPaths(text, opts) {
	let httpCacheFor;
	let httpSchemeEnds = [];
	let httpTokenEnds = [];
	const inHttpUrl = (str, offset) => {
		if (str !== httpCacheFor) {
			httpSchemeEnds = [];
			httpTokenEnds = [];
			const re = /(https?:\/\/)[^\s'",;|()]*/gi;
			for (let m; (m = re.exec(str)) !== null;) {
				httpSchemeEnds.push(m.index + m[1].length);
				httpTokenEnds.push(m.index + m[0].length);
			}
		}
		httpCacheFor = str;
		if (httpSchemeEnds.length === 0) return false;
		let lo = 0;
		let hi = httpSchemeEnds.length;
		while (lo < hi) {
			const mid = lo + hi >> 1;
			if (httpSchemeEnds[mid] <= offset) lo = mid + 1;
			else hi = mid;
		}
		return lo > 0 && offset <= httpTokenEnds[lo - 1];
	};
	let out = text;
	if (opts.appPath) out = out.replaceAll(opts.appPath, "app://");
	if (opts.homedir) out = out.replaceAll(opts.homedir, "<home>");
	out = out.replace(/(?<![/\\])([/\\]+(?:Users|home)[/\\]+)[^/\\\n]+/gi, (m, p1, offset, str) => inHttpUrl(str, offset) ? m : `${p1}<user>`).replace(/(\/(?:Volumes|mnt|media)\/)[^/\n]+/g, (m, p1, offset, str) => inHttpUrl(str, offset) ? m : `${p1}<vol>`).replace(/((?:\/etc\/profiles|\/nix\/var\/nix\/profiles)\/per-user\/)[^/\n]+/g, (m, p1, offset, str) => inHttpUrl(str, offset) ? m : `${p1}<user>`);
	return out.replace(/\b([A-Za-z]):([\\/])/g, "<drv>:$2").replace(/\\\\[^\\]+\\[^\\\s'",:()]+/g, "<unc>").replace(/([\\/]\.wvm-tmp-)[A-Za-z0-9]{6}\b/g, "$1<rand>").replace(/\.zst\.[0-9a-f]{12}\.partial\b/g, ".zst.<sha>.partial").replace(/\bdownload\.([a-z0-9_-]{1,32}\.)?[0-9a-f]{12}\.zst\.partial\b/g, "download.$1<sha>.zst.partial").replace(/\.partial-[0-9a-f]{16,64}-\d{1,7}-\d{1,6}\b/g, ".partial-<sha>").replace(/([\\/]\.place-[A-Za-z0-9._-]{1,255})-\d{1,7}-\d{1,6}\b/g, "$1-<pid>");
}
//#endregion
//#region node_modules/eventemitter3/index.js
var require_eventemitter3 = /* @__PURE__ */ require_esm.__commonJSMin(((exports, module) => {
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
}));
//#endregion
//#region node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ require_esm.__toESM(require_eventemitter3(), 1);
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
(0, node_util.promisify)(node_fs.realpath);
/**
* Expand a base directory to [logical, realpath] when they differ. Resolve the
* BASE (which always exists), not the derived leaf paths — `~/.config/gcloud`
* may not exist on this machine (ENOENT), but a relocated `~` still needs both
* spellings of `~/.config/gcloud` in the deny list. realpathSync at module
* load is acceptable per the sync-fs ban's "before the event loop starts"
* carve-out — these prefixes are computed once.
*/
function basesWithRealpath(base) {
	if (!base) return [];
	try {
		const real = (0, node_fs.realpathSync)(base);
		return real.toLowerCase() !== base.toLowerCase() ? [base, real] : [base];
	} catch {
		return [base];
	}
}
function stripFirmlink(lowerSlashPath) {
	return lowerSlashPath.startsWith("/system/volumes/data/") ? lowerSlashPath.slice(20) : lowerSlashPath;
}
var homeBases = basesWithRealpath((0, node_os.homedir)());
var appdataBases = basesWithRealpath(process.env.APPDATA);
[
	"/etc",
	"/private/etc",
	"/Library/LaunchAgents",
	"/Library/LaunchDaemons",
	"/System/Library/LaunchAgents",
	"/System/Library/LaunchDaemons",
	...[
		...homeBases.flatMap((base) => [
			(0, node_path.join)(base, "Library", "LaunchAgents"),
			(0, node_path.join)(base, ".config", "gcloud"),
			(0, node_path.join)(base, ".config", "git"),
			(0, node_path.join)(base, ".config", "direnv"),
			(0, node_path.join)(base, ".config", "powershell"),
			(0, node_path.join)(base, ".gnupg"),
			...process.platform === "win32" ? [
				(0, node_path.join)(base, "Documents", "WindowsPowerShell"),
				(0, node_path.join)(base, "Documents", "PowerShell"),
				(0, node_path.join)(base, "OneDrive", "Documents", "WindowsPowerShell"),
				(0, node_path.join)(base, "OneDrive", "Documents", "PowerShell")
			] : []
		]),
		...appdataBases.flatMap((base) => [
			(0, node_path.join)(base, "gcloud"),
			(0, node_path.join)(base, "gnupg"),
			(0, node_path.join)(base, "Microsoft", "Windows", "Start Menu", "Programs", "Startup")
		]),
		...basesWithRealpath(process.env.SystemRoot).flatMap((base) => [(0, node_path.join)(base, "System32", "drivers", "etc")]),
		...basesWithRealpath(process.env.ProgramData).flatMap((base) => [(0, node_path.join)(base, "Microsoft", "Windows", "Start Menu", "Programs", "StartUp")])
	]
].map((p) => stripFirmlink(foldSlashPath(p.replaceAll("\\", "/"))));
/**
* Per-segment NFKC + lowercase fold + trailing-dot/space strip for deny-list
* compares on case-insensitive filesystems. `toLowerCase()` alone leaves
* compatibility-decomposable codepoints such as U+017F ſ unchanged (it is
* already lowercase), while APFS's case-insensitive name lookup folds ſ→s —
* so a bare-lowercase deny compare lets `juſtfile` reach the `justfile`
* inode. NFKC collapses that class before the compare. A segment whose NFKC
* form would become `.`/`..` or gain a separator keeps its raw lowercase
* form so NFKC cannot introduce path structure (U+FF0F → `/`, U+2025 →
* `..`). Shares the NFKC+guard core with `foldSegment` in
* darwin-path-aliases.ts; the trailing-strip is deny-list-only.
*
* Win32 strips trailing `.` and ` ` from each path segment at open time, so
* `.git ` and `.git.` both resolve to `.git`. The trailing `[. ]+$` strip
* runs after NFKC so compat-decomposable trailing characters (U+3000
* ideographic space, U+FF0E full-width full stop) are folded to ASCII
* before being stripped.
*
* NFKC may over-fold relative to the filesystem; in a deny-list that is
* fail-safe (extra rejections). Do NOT use this for allow-list containment
* — over-fold there can admit a path the filesystem resolves elsewhere. Use
* {@link lower} for allow-list compares.
*/
function foldPathSegment(seg) {
	const nfkc = seg.normalize("NFKC").toLowerCase();
	const folded = nfkc === "." || nfkc === ".." || /[/\\]/.test(nfkc) ? seg.toLowerCase() : nfkc;
	return trimTrailingCharsMatching(folded, /[. ]/) || folded;
}
/** {@link foldPathSegment} mapped over every `/`-separated segment. Callers
*  replaceAll `\\` → `/` first. */
function foldSlashPath(p) {
	return p.split("/").map(foldPathSegment).join("/");
}
/** Keying/refusal-only: APFS folds compatibility codepoints (U+017F ſ→s), so
*  a case-only fold under-matches; an over-fold can at worst refuse or re-key,
*  never grant. Allow-list compares must NOT use this — see the fold doctrine
*  on {@link foldPathSegment}. Preserves both separator styles. */
function foldPathForKeying(p) {
	return p.split(/([/\\])/).map((seg) => seg === "/" || seg === "\\" ? seg : foldPathSegment(seg)).join("");
}
//#endregion
//#region src/main/helpers/darwin-path-aliases.ts
var FOLD_SEP_RE = process.platform === "win32" ? /[/\\]/ : /\//;
var foldSegment = (seg) => {
	const folded = seg.normalize("NFKC").toLowerCase();
	return folded === ".." || folded === "." || FOLD_SEP_RE.test(folded) ? seg.toLowerCase() : folded;
};
/**
* macOS APFS data-volume firmlink prefix. `/System/Volumes/Data/<p>` aliases
* `/<p>` and `realpath(3)` preserves whichever spelling the caller used (a
* firmlink is not a symlink, so it isn't collapsed), so any path can reach a
* protected location under either spelling. Every rejection layer that
* folds paths — resolveTrustedFolderCandidate, the mount denylist and
* home/root guards — must fold both spellings.
*/
var DARWIN_DATA_VOLUME_PREFIX = "/System/Volumes/Data";
/**
* Firmlink-stripped form of `p` (`/System/Volumes/Data/x` → `/x`, the bare
* prefix → `/`), or null when `p` is not under the data-volume firmlink
* (non-darwin, or no prefix). Pure string op — no fs touch. Rejection/keying
* only, so a false match can at worst prompt or fold, never grant.
*/
function stripDarwinDataVolumeFirmlink(p) {
	if (process.platform !== "darwin") return null;
	const segs = p.split("/");
	const prefixSegs = DARWIN_DATA_VOLUME_PREFIX.split("/");
	if (segs.length < prefixSegs.length) return null;
	for (let i = 0; i < prefixSegs.length; i++) if (foldSegment(segs[i]) !== prefixSegs[i].toLowerCase()) return null;
	const rest = segs.slice(prefixSegs.length).join("/");
	return rest === "" ? "/" : `/${rest}`;
}
/** True when `p` (in raw, folded, or firmlink-stripped spelling) sits
*  under a stock automount root. /net is never a legitimate path on ANY
*  POSIX platform, so it is matched unconditionally; /home is an automount
*  root only on macOS — on Linux it is the real home tree. Lexical, zero
*  fs touch. Stock auto_master roots only; custom maps are an accepted
*  residual (PR checklist). */
function isAutomountRootPath(p) {
	const automountRoot = process.platform === "darwin" ? /^\/(net|home)(\/|$)/ : /^\/net(\/|$)/;
	return [p, stripDarwinDataVolumeFirmlink(p)].filter((q) => q !== null).some((q) => automountRoot.test(foldPathForKeying(q)));
}
//#endregion
//#region src/main/claudeNative.ts
/**
* Sometimes native modules don't load, because of AppLocker or
* antivirus or any other weird reason. If an API is required feel free
* to show a dialog and crash the app when this returns null.
*
* But if possible please code defensively
*/
var cachedClaudeNative = void 0;
var cachedClaudeNativeLoadError;
function maybeGetClaudeNative() {
	if (cachedClaudeNative !== void 0) return cachedClaudeNative;
	try {
		cachedClaudeNative = require("@ant/claude-native");
	} catch (err) {
		cachedClaudeNative = null;
		cachedClaudeNativeLoadError = err;
		logger.error("Failed to load Claude Native %o", err);
	}
	return cachedClaudeNative;
}
/**
* Same as {@link maybeGetClaudeNative} but throws when the module did not
* load. Use this for callers whose correctness is a security property —
* notably `@/main/safe-fs`, where the native `openBeneath` walk is the
* race-free containment guarantee (CC-2885) and silently degrading to a
* path-string lstat walk would be a fail-open. The thrown error includes
* the original load failure so AppLocker / AV / arch-mismatch is visible
* in the crash report.
*/
function getClaudeNativeOrThrow() {
	const native = maybeGetClaudeNative();
	if (native === null) throw new Error("@ant/claude-native is required for safe-fs containment but failed to load; refusing to fall back to a path-based open (CC-2885)", { cause: cachedClaudeNativeLoadError });
	return native;
}
//#endregion
//#region src/main/helpers/cloud-sync-roots.ts
/**
* Cloud-sync folder root detection. Surfaces OneDrive/SharePoint/Box/Dropbox/
* GDrive/iCloud roots so mount-path can classify them distinctly from plain
* local — these are local fs (stat-safe) but files-on-demand, so bash from
* the sandbox can't reach them and reads may block on download (PUB-588).
*/
//#endregion
//#region src/main/helpers/mount-path.ts
/**
* Mount-path resolution — classifying a user-supplied folder path as
* local, mapped-network-drive, literal UNC, or junction-to-UNC so that
* callers (folder picker, CC permission feed, VM mount prep) can treat
* each kind appropriately. Split out of `path-safety.ts` so that module
* carries only the containment primitives.
*/
//#endregion
//#region src/main/helpers/path-safety.ts
/**
* Realpath-based containment checks and lexical path helpers.
*
* The UNC / symlink-hop primitives that {@link SafeRoot} depends on
* live in `@/main/safe-fs/unc`; the mount-path classifier lives in
* `@/main/helpers/mount-path`. Both are re-exported below so existing
* importers of this module keep working unchanged while the
* `safe-fs → helpers/path-safety` edge is gone.
*/
/**
* Factory for a per-scan {@link isRealpathWithin} that resolves the container
* once. Use in directory walks where the container is fixed and the per-entry
* UNC-walk + realpath of the same container would dominate.
*/
function makeRealpathContainmentCheck(container, opts) {
	const hopOpts = {
		allowRootUnc: opts?.allowRootUnc,
		refuseSubstitutedPath: opts?.refuseSubstitutedPath
	};
	container = node_path.default.resolve(canonicalizeWslPath(container));
	const realContainer = opts?.refuseSubstitutedPath?.(container) === true ? Promise.reject(/* @__PURE__ */ new Error("container in refused namespace")) : assertNoUncSymlinkHop(container, hopOpts).then(() => (0, node_fs_promises.realpath)(container));
	realContainer.catch(() => void 0);
	return async (filePath) => {
		filePath = node_path.default.resolve(canonicalizeWslPath(filePath));
		try {
			if (opts?.refuseSubstitutedPath?.(filePath) === true) {
				logger.debug("[path-safety] containment check refused namespace %s", filePath);
				return false;
			}
			await assertNoUncSymlinkHop(filePath, hopOpts);
			const real = await (0, node_fs_promises.realpath)(filePath);
			return isLexicallyWithin(real, await realContainer, opts) ? real : false;
		} catch (e) {
			logger.debug("[path-safety] containment check denied %s in %s: %o", filePath, container, e);
			return false;
		}
	};
}
//#endregion
//#region src/main/custom3p/modelEntryName.ts
/** Defensive unwrap for IPC/persisted state where an InferenceModel
*  ({name, supports1m}) or DiscoveredModel ({id, name}) arrives where the
*  type says string. */
function modelEntryName(model) {
	if (typeof model === "string") return model;
	if (model && typeof model === "object") {
		const m = model;
		if (typeof m.id === "string") return m.id;
		if (typeof m.name === "string") return m.name;
	}
}
//#endregion
//#region src/main/local-agent-mode/internalServerUuids.ts
var INTERNAL_SERVER_UUIDS = {
	"claude-in-chrome": "a8f3c7e2-4b9d-4f1a-8c3e-9d2a5b7f8e1c",
	office: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
	"computer-use": "b0a3b6e5-7ca0-462a-8e6f-bac087408b17",
	workspace: "a05f2752-b0d0-4e5e-97f4-0c85957a5eb7",
	"mcp-registry": "8e22a1f5-ee4a-4ab4-b99b-c82e971ebd28",
	plugins: "7f50c7a2-4369-4ac9-9666-83ab8d7f6bea",
	skills: "5f89cf73-627e-46ed-893a-750e52d0a50b",
	"cowork-onboarding": "9105c415-238f-4baa-8790-396b4db1be09",
	"dev-debug": "7e5c02ee-f301-4a0f-918e-d324e58d554f",
	"Claude Preview": "bda6af03-834c-4496-98d1-c0e6d52b99ce",
	"Claude Browser": "bda6af03-834c-4496-98d1-c0e6d52b99ce",
	Framebuffer: "10013aa5-ba71-498e-9a4e-10c1504a45c1",
	visualize: "34c3fca1-1148-457c-893f-b629d47bc9d7",
	"Window Halo": "636ab6f5-a669-4adb-b932-26595ced3e89",
	ccd_session: "3a47babc-65de-4869-b865-47a0d3f0c1ed",
	ccd_directory: "1a92b889-f135-4008-9061-80f87e958751",
	ccd_session_mgmt: "8e0701d5-8683-4b58-9860-a2cc1cfc9422",
	terminal: "b94dfe7c-203b-402b-9c46-4dcd448f0c3b",
	"Claude Code iOS Simulator": "57ee2155-2a58-490d-a966-7ccf8491571c",
	"Claude Code Android Emulator": "07f65f9d-33a1-4654-ba37-5f9e10aa5689",
	"remote-devices": "63c20b00-cc9f-44b6-b75f-b541980465b7"
};
//#endregion
//#region src/main/helpers/telemetry-scrub.ts
/**
* Telemetry scrubbers for the desktop main process — Sentry extras and
* BQ event-logging both. Scrubbing is unconditional (PUB-147).
* See readme/analytics-pii.md for the full redaction policy table.
*/
/** scrubFilesystemPaths with the process's appPath/homedir. */
function scrubPaths(text) {
	return scrubFilesystemPaths(text, getScrubEnv());
}
/** scrubFreeText with the process's appPath/homedir. */
function scrubText(text) {
	return scrubFreeText(text, getScrubEnv());
}
/** Last-resort URL scrub for inputs `redactMcpServerUrl` rejects (no host,
*  `file:`/`mailto:`/`data:`, unparseable). Strips query, fragment, and
*  `user:pass@` by string split so credentials don't reach Sentry. */
function stripUrlSecrets(s) {
	const noQueryOrHash = s.split("?")[0].split("#")[0];
	const at = noQueryOrHash.lastIndexOf("@");
	return at >= 0 ? noQueryOrHash.slice(at + 1) : noQueryOrHash;
}
/** Redact each http(s) URL embedded in free text to origin+path (no userinfo,
*  no query, no fragment). Falls back to `<url>` when unparseable. */
function redactEmbeddedUrls(s) {
	return s.replace(/\bhttps?:\/\/\S+/gi, (u) => redactMcpServerUrl(u) ?? "<url>");
}
var REDACTED_OUTPUT_MAX_CHARS = 300;
/** Transcript-envelope type values that mark a JSON fragment as carrying
*  conversation content. Matched anywhere in the string, not only at the
*  start, so a stdout-polluted fragment (warning line + envelope) still
*  routes to the collapse branch. */
var TRANSCRIPT_TYPE_RE = /"type"\s*:\s*"(user|assistant|system|result|stream_event|text|tool_use|tool_result|thinking|image|control_request|control_response|bash_command|auth_status|prompt_suggestion|rate_limit_event)"/;
/** Strict enum shape for `type`/`subtype` values captured from unanchored
*  regex scans over the raw CLI output. Both captures scan the *whole* raw
*  string — including nested `tool_use.input` objects and stdout pollution
*  preceding the envelope — so a character-class strip isn't enough: free
*  text like `"/Users/alice leaked this"` survives a `[^a-z_]` strip as
*  `"sersaliceleakedthis"`. Fail-closed allowlist: if the captured value
*  doesn't look like a snake_case enum identifier, drop it rather than try
*  to sanitize it. */
var ENUM_VALUE_RE = /^[a-z_]{1,32}$/;
/** JSON-shaped CLI output is a transcript fragment — collapse to a label.
*  Non-JSON is a real runtime error — keep path-scrubbed. Sentry 7313510507. */
function redactCliOutput(raw) {
	const typeMatch = raw.match(TRANSCRIPT_TYPE_RE);
	if (raw.trimStart().startsWith("{") || typeMatch) {
		const fallbackType = raw.match(/"type"\s*:\s*"([^"]+)"/)?.[1];
		const type = typeMatch?.[1] ?? (fallbackType !== void 0 && ENUM_VALUE_RE.test(fallbackType) ? fallbackType : "json");
		const rawSubtype = raw.match(/"subtype"\s*:\s*"([^"]+)"/)?.[1];
		const subtype = rawSubtype !== void 0 && ENUM_VALUE_RE.test(rawSubtype) ? rawSubtype : void 0;
		return `[${subtype ? `${type}/${subtype}` : type} envelope, ${raw.length} chars]`;
	}
	return redactSecretLike(redactCredentialPatterns(scrubPaths(raw))).slice(0, REDACTED_OUTPUT_MAX_CHARS);
}
/** Spawn-output and breadcrumb strings can carry credentials when admin
*  scripts use `set -x` or echo tokens. Covers Bedrock bearer, AWS access-key
*  IDs, Anthropic-style sk- keys, and Entra client secrets. Pattern-based —
*  not exhaustive. */
function redactCredentialPatterns(s) {
	return s.replace(/bedrock-api-key-[A-Za-z0-9+/=]{20,}/g, "bedrock-api-key-[redacted]").replace(/\bA[SK]IA[A-Z0-9]{16}\b/g, "[redacted-aws-key-id]").replace(/\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}\b/g, "sk-[redacted]").replace(/(?<![A-Za-z0-9_~.-])[A-Za-z0-9_~.-]{3}[78]Q~[A-Za-z0-9_~.-]{31,34}(?![A-Za-z0-9_~.-])/g, "[redacted-entra-secret]");
}
/** Adapt a string redactor to the DeepScrubOpts keyHandler shape. */
var ifString = (fn) => (v) => typeof v === "string" ? fn(v) : v;
/** String-array variant of a single-value redactor. */
var eachString = (fn) => (v) => Array.isArray(v) ? v.map((x) => typeof x === "string" ? fn(x) : x) : typeof v === "string" ? fn(v) : v;
/** Sink-side normalizer so emitters that pass an InferenceModel object
*  (or a Bedrock ARN) can't leak — see PUB-326. */
var normalizeModelField = (v) => {
	const name = modelEntryName(v);
	return name === void 0 ? v : redactBedrockArnAccountId(name);
};
/** Fallback salt for hash-scrubbed identifiers when no org context is
*  available. `scrubLogEventMetadata` overrides this per-call with the
*  event's `organization_id` so hashes can't be reversed with a global
*  rainbow table (analytics-pii.md rule 3; `analyticsNameHash` docstring
*  requires a per-org salt for the same reason).
*  Exported for debug.ts — the support bundle has no org context, so the
*  same fallback is used to hash MCP server names written there. */
var FALLBACK_HASH_SALT = "desktop-telemetry-scrub-v1:";
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/**
* keyHandlers that salted-hash user-/model-chosen identifiers. Built as a
* function of `salt` so `scrubLogEventMetadata` can pass the per-event
* `organization_id`. Returned handlers preserve per-entity joinability
* within an org without the raw content; cross-org joins are intentionally
* broken (these are ❌-Never / ⚠️-Medium fields per analytics-pii.md).
*/
function buildHashKeyHandlers(salt) {
	const hash = (s) => analyticsNameHash(salt + s);
	const hashIfString = ifString(hash);
	const hashEachString = eachString(hash);
	const internalServerNames = new Set(Object.keys(INTERNAL_SERVER_UUIDS));
	const normalizeMcpServerName = (name) => name.replace(/[^a-zA-Z0-9_-]/g, "_");
	const INTERNAL_TOOL_SHAPE = /^[a-zA-Z0-9_]{1,64}$/;
	const hashMcpToolName = ifString((s) => {
		if (s.startsWith("internal__")) {
			const rest = s.slice(10);
			const sep = rest.indexOf("__");
			const server = sep >= 0 ? rest.slice(0, sep) : rest;
			if (!internalServerNames.has(server)) return hash(s);
			const tool = sep >= 0 ? rest.slice(sep + 2) : "";
			if (INTERNAL_TOOL_SHAPE.test(tool)) return s;
			return `internal__${server}__${hash(tool)}`;
		}
		if (s.startsWith("official-plugin__")) {
			const rest = s.slice(17);
			const sep = rest.indexOf("__");
			const pluginId = sep >= 0 ? rest.slice(0, sep) : rest;
			const at = pluginId.lastIndexOf("@");
			const pluginName = at > 0 ? pluginId.slice(0, at) : "";
			if (!isOfficialMarketplacePlugin(pluginId) || !OFFICIAL_PLUGIN_TOOL_SHAPE.test(pluginName)) return hash(s);
			const tail = sep >= 0 ? rest.slice(sep + 2) : "";
			if (tail.split("__").every((p) => OFFICIAL_PLUGIN_TOOL_SHAPE.test(p))) return s;
			return `official-plugin__${pluginId}__${hash(tail)}`;
		}
		if (!s.startsWith("mcp__")) return redactToolName(s, hash);
		const parts = normalizeMcpServerName(s.slice(5)).split("__");
		const server = parts[0] ?? "";
		const tool = parts.slice(1).join("__");
		return `mcp__${isRegistryServerUuid(server) ? server : hash(server)}__${hash(tool)}`;
	});
	return {
		scheduled_task_id: hashIfString,
		artifact_id: hashIfString,
		tool_name: hashMcpToolName,
		last_tool_name: hashMcpToolName,
		tool: hashMcpToolName,
		server_name: ifString((s) => isRegistryServerUuid(s) ? s : hash(s)),
		extension_name: hashIfString,
		extension_author: hashIfString,
		mcp_server_keys: (v) => Array.isArray(v) ? v.map((k) => typeof k === "string" && !UUID_RE.test(k) ? hash(k) : k) : v,
		connected_vpns: hashEachString,
		vpn_interfaces: hashEachString,
		bridge_interfaces: hashEachString,
		source: ifString((s) => /^[a-z0-9_-]{1,24}$/.test(s) ? s : hash(s)),
		available_remote_mcp_servers: (v) => Array.isArray(v) ? v.map((s) => {
			if (s && typeof s === "object") {
				const o = s;
				return {
					uuid: o.uuid,
					name: typeof o.name === "string" ? hash(o.name) : o.name
				};
			}
			return s;
		}) : v
	};
}
/** Full free-text redaction for untrusted CLI output at any sink
*  (renderer → Slack feedback, local logger, Sentry/BQ stderrTail).
*  Order matters: credential-pattern labels first (so sk-/AKIA become
*  `sk-[redacted]`/`[redacted-aws-key-id]` rather than the generic
*  `<token>` from redactSecretLike), then embedded URLs (reduced to
*  origin+path while still parseable, before IP redaction), then the
*  canonical scrubFreeText chain via scrubText (URL-userinfo + paths +
*  email + IP + secret-like blobs). No length cap. */
function scrubFreeTextForSink(s) {
	return scrubText(redactEmbeddedUrls(redactCredentialPatterns(s)));
}
/** Sentry/BQ keyHandler for stderrTail / cli_stderr_tail — same coverage
*  as the renderer and logger emit sites. */
var scrubStderrTail = ifString(scrubFreeTextForSink);
/** Pass through any value that doesn't contain PII-carrying characters.
*  Format-agnostic so operator-set labels (any punctuation except the listed
*  five) never need a regex update; still redacts emails/paths/URLs if this
*  field name is ever reused with different content. */
var scrubOverrideLabel = ifString((s) => s.length <= 64 && !/[@/\\:=]/.test(s) ? s : "[redacted]");
/** Hostname-only redactor for fields that carry a bare host (no scheme). */
var redactBareHost = ifString((s) => {
	const h = s.toLowerCase();
	if (h.endsWith(".anthropic.com") || h.endsWith(".claude.ai") || h === "localhost" || h.startsWith("127.") || h.startsWith("10.") || h.startsWith("192.168.") || /^172\.(?:1[6-9]|2\d|3[01])\./.test(h)) return s;
	if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(h)) return "<ip>";
	const tld = h.split(".").pop();
	return tld ? `<host>.${tld}` : "<host>";
});
/** Desktop binding for scrubBufferForBundle. JSON leaves use uncapped
*  scrubFreeText so transcript content isn't truncated at 8KB. */
var SUPPORT_BUNDLE_SCRUB_OPTS = {
	lineScrub: (s) => scrubLogLine(s, getScrubEnv()),
	jsonScrubOpts: {
		scrubString: scrubPaths,
		skipKeys: /* @__PURE__ */ new Set([
			"product_surface",
			"desktop_variant",
			"deployment_mode",
			"config_source",
			"config_source_remote",
			"inference_provider",
			"inference_host",
			"inference_host_kind",
			"app_version",
			"commit_hash",
			"platform",
			"arch",
			"os_version",
			"os_release",
			"os_build",
			"linux_distro_id",
			"linux_distro_version_id",
			"linux_session_type",
			"linux_desktop_environment",
			"cpu_model",
			"app_session_id",
			"organization_id",
			"vm_network_mode",
			"error_code",
			"error_kind",
			"backend_error_code",
			"nest_local_user"
		]),
		keyHandlers: {
			inference_base_url: ifString(redactSecretLike),
			linkUrl: ifString((s) => scrubPaths(redactMcpServerUrl(s) ?? stripUrlSecrets(s))),
			model: normalizeModelField,
			last_message_model: normalizeModelField,
			override_label: scrubOverrideLabel,
			plugin_id: ifString(redactPluginId),
			target_id: ifString(redactPluginId),
			plugin_uuid: ifString((s) => UUID_RE.test(s) ? s : "<non-uuid>"),
			marketplace_uuid: ifString((s) => UUID_RE.test(s) ? s : "<non-uuid>"),
			renderer_build_id: (v) => v === void 0 ? void 0 : typeof v === "string" && /^[A-Za-z0-9._-]{1,64}$/.test(v) ? v : "<invalid>",
			enabledMcpTools: (v) => {
				if (typeof v !== "object" || v === null) return v;
				const out = Object.create(null);
				for (const [k, val] of Object.entries(v)) out[redactServerToolKey(k)] = val;
				return out;
			},
			approvedToolNames: eachString((name) => name.startsWith("mcp__") || !name.includes(":") ? redactToolName(name) : redactServerToolKey(name)),
			raw_output: ifString(redactCliOutput),
			raw_output_prefix: ifString(redactCliOutput),
			cli_stderr_tail: scrubStderrTail,
			shipit_stderr_tail: scrubStderrTail,
			error_message: ifString((s) => redactSecretLike(redactEmbeddedUrlsToHost(scrubPaths(s)))),
			decision_reason: ifString((s) => redactSecretLike(scrubPaths(s)).slice(0, 200)),
			extension_id: ifString(redactPluginId),
			mcp_cmd: ifString((s) => redactSecretLike(scrubPaths(s))),
			coworkd_upstream_error: ifString((s) => redactSecretLike(redactEmbeddedUrlsToHost(scrubPaths(s))).slice(0, 300)),
			console_tail: ifString(scrubText),
			kernel_console_tail: ifString(scrubText),
			kernel_context: ifString(scrubText),
			vm_stat_output: ifString(scrubText),
			vz_footprint_output: ifString(scrubText),
			session_allowed: eachString((s) => redactBareHost(s)),
			ext_saw: redactBareHost,
			once_approved: redactBareHost,
			host: redactBareHost,
			rejected_model: normalizeModelField,
			feedback_url: ifString((s) => redactMcpServerUrl(s) ?? "<url>"),
			bridge_url: ifString((s) => redactMcpServerUrl(s) ?? "<url>"),
			error: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			errorMessage: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			error_description: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			error_detail: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			error_line: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			diagnostic_error: ifString((s) => redactSecretLike(redactEmbeddedUrls(scrubPaths(s)))),
			...buildHashKeyHandlers(FALLBACK_HASH_SALT)
		},
		scrubString: (s) => scrubFreeText(s, getScrubEnv())
	},
	onError: (e, f) => logger.warn("bundle scrub failed for %s; falling back: %o", f, e)
};
//#endregion
//#region src/main/safe-fs/errors.ts
/**
* Error types for {@link SafeRoot}. All safe-fs rejections throw a
* SafeFsError subclass so callers can distinguish "the module refused
* this" from an underlying I/O error.
*/
/** Base class. `code` mirrors NodeJS.ErrnoException so callers that
*  already branch on `.code` keep working. */
var SafeFsError = class extends Error {
	constructor(code, message) {
		super(message);
		this.name = "SafeFsError";
		this.code = code;
	}
};
/** A relative path argument lexically escapes the root (`..`, absolute,
*  UNC, null byte, Windows drive / device prefix). Rejected before any
*  syscall — no fs I/O has happened. */
var PathEscapeError = class extends SafeFsError {
	constructor(rel) {
		super("ERR_SAFE_FS_ESCAPE", `Path escapes root: ${JSON.stringify(rel)}`);
		this.name = "PathEscapeError";
	}
};
/** A path component under the root is a symlink. Includes both the
*  leaf-symlink case (open returned ELOOP via O_NOFOLLOW) and the
*  intermediate-symlink case (segment walk found one). */
var SymlinkEncounteredError = class extends SafeFsError {
	constructor(at) {
		super("ERR_SAFE_FS_SYMLINK", `Refusing to follow symlink under root at: ${at}`);
		this.name = "SymlinkEncounteredError";
	}
};
/** The opened leaf is a multi-link inode (nlink > 1). A hardlink
*  redirects exactly like a symlink — link(2) passes
*  protected_hardlinks for same-uid targets, and on Windows hardlink
*  creation needs no privilege at all — but `O_NOFOLLOW` does not
*  reject it; only a post-open fstat can. Rejected by default on
*  non-"appdata" tiers. */
var MultiLinkEncounteredError = class extends SafeFsError {
	constructor(at, nlink) {
		super("ERR_SAFE_FS_MULTILINK", `Refusing multi-link inode (nlink=${nlink}) under root at: ${at}`);
		this.name = "MultiLinkEncounteredError";
	}
};
/** The leaf opened under `O_NOFOLLOW` is not a regular file — a FIFO,
*  socket, directory, or device node. Distinct from
*  {@link SymlinkEncounteredError}: by the time this is thrown the
*  symlink case has already been ruled out by `O_NOFOLLOW`. */
var NotRegularFileError = class extends SafeFsError {
	constructor(at) {
		super("ERR_SAFE_FS_NOT_REGULAR", `Not a regular file: ${at}`);
		this.name = "NotRegularFileError";
	}
};
/** `maxBytes` was exceeded on a read, or `maxBytes` was omitted on a
*  non-appdata tier where it's required. */
var SizeLimitError = class extends SafeFsError {
	constructor(message) {
		super("ERR_SAFE_FS_SIZE", message);
		this.name = "SizeLimitError";
	}
};
/** The candidate root itself is unsafe — UNC / `\\?\` / dangling /
*  not a directory. Thrown only from {@link SafeRoot.open}. */
var UnsafeRootError = class extends SafeFsError {
	constructor(message, opts) {
		super("ERR_SAFE_FS_ROOT", message);
		this.name = "UnsafeRootError";
		if (opts?.cause !== void 0) this.cause = opts.cause;
	}
};
//#endregion
//#region src/main/safe-fs/resolve.ts
/**
* Internal path resolution for safe-fs.
*
* Every SafeRoot operation that takes a `rel` argument funnels through
* {@link resolveUnder}. The contract is:
*
*   1. Lexical containment first. `rel` is normalized with the POSIX
*      rules (on Windows both separators are treated as separators; on
*      POSIX `\` is a valid filename character and is preserved so
*      `SafeDirent.path` round-trips)
*      and rejected if it is absolute, starts with `..`, contains a
*      NUL byte, or carries a Windows drive / device prefix. This step
*      does no I/O, so nothing on disk can influence it.
*
*   2. Segment walk. Each intermediate directory component below the
*      root is `lstat`'d and rejected if it is a symlink. This is the
*      same per-segment guard as `isPathSymlinkFree` / `assertNoUncSymlinkHop`
*      in `helpers/path-safety.ts`, scoped to the untrusted suffix only
*      (the root itself was realpath'd once at {@link SafeRoot.open}).
*
*   3. The caller opens the leaf via {@link openLeaf}, which delegates to
*      `@ant/claude-native`'s `openBeneath`: a chained `openat(O_NOFOLLOW)`
*      walk on POSIX (with `openat2(RESOLVE_BENEATH)` fast-path on Linux)
*      and a chained `NtCreateFile` walk with `RootDirectory` +
*      `FILE_OPEN_REPARSE_POINT` on Windows. Every component is resolved
*      relative to a kernel-pinned directory inode, so a concurrent
*      symlink/junction swap on the path string cannot redirect the open.
*      This closes the intermediate-component TOCTOU that the lstat walk
*      in step 2 could not (CC-2885), including the NTFS junction gap on
*      Windows.
*
* Step 2 ({@link walkIntermediates}) is retained for operations that do
* not open a leaf fd — `rm` / `copyFile` / `link` / `cp` / `readdir` /
* `stat` / `exists` / `access` / `statfs` / `readlink` — where it
* remains best-effort (the same defence every ad-hoc caller in
* `src/main` previously relied on; see `debug.ts`, `globalMemory.ts`).
* `writeFileAtomic` and `rename` are fd-relative; converting the
* remaining ops to `unlinkat`/`fdopendir`/`fcopyfile` is tracked
* separately.
*/
var pFstat$1 = (fd) => new Promise((res, rej) => (0, node_fs.fstat)(fd, (e, s) => e ? rej(e) : res(s)));
var pFtruncate$1 = (fd, len) => new Promise((res, rej) => (0, node_fs.ftruncate)(fd, len, (e) => e ? rej(e) : res()));
var pClose$1 = (fd) => new Promise((res, rej) => (0, node_fs.close)(fd, (e) => e ? rej(e) : res()));
node_fs.constants.O_NOFOLLOW;
node_fs.constants.O_DIRECTORY;
node_fs.constants.O_NONBLOCK;
var isWindows$1 = process.platform === "win32";
var WIN_DRIVE_RE = /^[A-Za-z]:/;
var WIN_DEVICE_RE = /^[\\/]{2}[?.][\\/]/;
var UNC_RE = /^[\\/]{2}/;
/** Per-platform filename validity. Rejects names the host OS treats
*  specially (Windows reserved device names, trailing dot/space). Applied
*  per segment after splitting, so `con.txt` under a directory is caught
*  even though the full path doesn't start with it. */
var WIN_RESERVED_RE = /^(con|prn|aux|nul|com[0-9\u00b9\u00b2\u00b3]|lpt[0-9\u00b9\u00b2\u00b3])(\.|$)/i;
function isBadSegment(seg) {
	if (seg.length === 0 || seg === "." || seg === "..") return seg === "..";
	if (isWindows$1) {
		if (WIN_RESERVED_RE.test(seg)) return true;
		if (/[. ]$/.test(seg)) return true;
		if (seg.includes(":")) return true;
	}
	return false;
}
/**
* Lexically validate `rel` against `rootCanonical` and return the joined
* absolute path plus its segment breakdown. Throws {@link PathEscapeError}
* on any lexical violation. Does no fs I/O.
*/
function lexicalResolve(rootCanonical, rel) {
	if (typeof rel !== "string") throw new PathEscapeError(String(rel));
	if (rel.includes("\0")) throw new PathEscapeError(rel);
	const unified = isWindows$1 ? rel.replace(/\\/g, "/") : rel;
	if (UNC_RE.test(rel) || WIN_DEVICE_RE.test(rel) || isWindows$1 && WIN_DRIVE_RE.test(unified)) throw new PathEscapeError(rel);
	if (node_path.default.posix.isAbsolute(unified)) throw new PathEscapeError(rel);
	let normalized = node_path.default.posix.normalize(unified);
	if (normalized.length > 1 && normalized.endsWith("/")) normalized = normalized.slice(0, -1);
	if (normalized === ".." || normalized.startsWith("../")) throw new PathEscapeError(rel);
	const segments = normalized === "." ? [] : normalized.split("/").filter(Boolean);
	for (const seg of segments) if (isBadSegment(seg)) throw new PathEscapeError(rel);
	const full = segments.length === 0 ? rootCanonical : node_path.default.join(rootCanonical, ...segments);
	const leaf = segments.length > 0 ? segments[segments.length - 1] : void 0;
	return {
		full,
		rel: segments.join("/"),
		dirSegments: segments.slice(0, -1),
		leaf
	};
}
/**
* Walk the intermediate directory segments of a {@link Resolved} and throw
* {@link SymlinkEncounteredError} if any is a symlink (or not a directory).
* ENOENT on an intermediate is re-thrown unchanged — the caller decides
* whether to mkdir or fail.
*
* The root itself is NOT re-checked: it was `realpath`'d at
* {@link SafeRoot.open}, and re-stat'ing it on every op would add a syscall
* without closing any race (an attacker who can replace the root directory
* itself can also replace whatever we'd check it against).
*/
async function walkIntermediates(rootCanonical, r) {
	let walked = rootCanonical;
	for (const seg of r.dirSegments) {
		walked = node_path.default.join(walked, seg);
		const st = await (0, node_fs_promises.lstat)(walked);
		if (st.isSymbolicLink() || !st.isDirectory()) throw new SymlinkEncounteredError(walked);
	}
}
/**
* Full resolve: lexical check + intermediate walk. Returns the {@link Resolved}
* for the caller to open the leaf on. Kept separate from {@link openLeaf} so
* operations that don't open a leaf fd (readdir, rm, mkdir) share the same
* validation.
*/
async function resolveUnder(rootCanonical, rel) {
	const r = lexicalResolve(rootCanonical, rel);
	await walkIntermediates(rootCanonical, r);
	return r;
}
/** Lift the leading `"ENOENT: "` token from a native `openBeneath` error
*  into `.code` so the existing `isErrno(err, …)` and `SafeFsError`
*  classification ladders work unchanged. The native side deliberately
*  omits the host path from the message (see safe_fs.rs errno_err). */
function toNativeErrno(e) {
	if (e instanceof Error) {
		const m = /^([A-Z]{3,12}): /.exec(e.message);
		if (m) e.code = m[1];
		return e;
	}
	return Object.assign(new Error(String(e)), { code: "EUNKNOWN" });
}
async function openLeaf(rootFd, r, flags, mode, opts) {
	if (r.leaf === void 0) throw new PathEscapeError(r.rel);
	const wantTrunc = (flags & node_fs.constants.O_TRUNC) !== 0;
	const openFlags = flags & ~node_fs.constants.O_TRUNC;
	const native = getClaudeNativeOrThrow();
	let fd;
	try {
		fd = await native.openBeneath(rootFd, [...r.dirSegments, r.leaf], openFlags, mode ?? 384);
	} catch (e) {
		const err = toNativeErrno(e);
		if (err.code === "ELOOP" || err.code === "ENOTDIR" || err.code === "EXDEV") throw new SymlinkEncounteredError(r.full);
		throw err;
	}
	try {
		if (!opts?.allowMultiLink) {
			const st = await pFstat$1(fd);
			if (st.isFile() && st.nlink > 1) throw new MultiLinkEncounteredError(r.full, st.nlink);
		}
		if (wantTrunc) await pFtruncate$1(fd, 0);
		return fd;
	} catch (e) {
		await pClose$1(fd).catch(() => void 0);
		throw e;
	}
}
/** Native root-directory open. Returns the int fd `SafeRoot` holds for
*  its lifetime and passes as `rootFd` to {@link openLeaf} /
*  {@link mkdirAt}. */
async function openRootHandle(canonical) {
	const native = getClaudeNativeOrThrow();
	try {
		return await native.openRootDir(canonical);
	} catch (e) {
		throw toNativeErrno(e);
	}
}
/** Race-free rename under `rootFd`. POSIX `renameat` / Windows
*  `NtSetInformationFile(FileRenameInformationEx)` with the destination's
*  parent handle as `RootDirectory` — neither side follows a
*  symlink/junction at any component. ELOOP/ENOTDIR on either walk maps
*  to {@link SymlinkEncounteredError}; other errnos surface unchanged. */
async function renameAt(rootFd, src, dst) {
	const native = getClaudeNativeOrThrow();
	try {
		await native.renameBeneath(rootFd, [...src], [...dst]);
	} catch (e) {
		const err = toNativeErrno(e);
		if (err.code === "ELOOP" || err.code === "ENOTDIR") throw new SymlinkEncounteredError(dst.join("/"));
		throw err;
	}
}
/** Race-free unlink of a single non-directory entry under `rootFd`.
*  A symlink at the leaf is removed, not followed. */
async function unlinkAt(rootFd, segments) {
	const native = getClaudeNativeOrThrow();
	try {
		await native.unlinkBeneath(rootFd, [...segments]);
	} catch (e) {
		const err = toNativeErrno(e);
		if (err.code === "ELOOP" || err.code === "ENOTDIR") throw new SymlinkEncounteredError(segments.join("/"));
		throw err;
	}
}
/** Race-free single-component mkdir under `rootFd`. `SafeRoot.mkdir`'s
*  recursive mode calls this once per new segment, top-down, so the
*  parent (segments[..-1]) is guaranteed to exist on each call. */
async function mkdirAt(rootFd, segments, mode) {
	const native = getClaudeNativeOrThrow();
	try {
		await native.mkdirBeneath(rootFd, [...segments], mode);
	} catch (e) {
		const err = toNativeErrno(e);
		if (err.code === "ELOOP" || err.code === "ENOTDIR") throw new SymlinkEncounteredError(segments.join("/"));
		throw err;
	}
}
//#endregion
//#region src/main/safe-fs/SafeFile.ts
/**
* A file handle obtained through a {@link SafeRoot}. Thin wrapper over a
* raw int fd returned by `@ant/claude-native`'s `openBeneath`, which
* resolves every path component fd-relatively (`openat`/`NtCreateFile`
* with `RootDirectory`) so the inode this wraps is race-free under the
* root — see `safe_fs.rs`.
*
* Why an int fd rather than `fs.promises.FileHandle`: Node has no public
* way to construct a `FileHandle` from an fd obtained outside
* `fs.promises.open`, so the native open hands back the kernel fd directly
* and this class calls the fd-taking `fs.*` callback APIs. The public
* surface (`stat`/`readFile`/`write`/`truncate`/`createReadStream`/
* `createWriteStream`/`close`) is unchanged.
*
* Construct via {@link SafeRoot.withFile} or {@link SafeRoot.openFile};
* the constructor is module-internal.
*/
var pClose = (fd) => new Promise((res, rej) => (0, node_fs.close)(fd, (e) => e ? rej(e) : res()));
var pFstat = (fd) => new Promise((res, rej) => (0, node_fs.fstat)(fd, (e, s) => e ? rej(e) : res(s)));
var pFstatBig = (fd) => new Promise((res, rej) => (0, node_fs.fstat)(fd, { bigint: true }, (e, s) => e ? rej(e) : res(s)));
var pFtruncate = (fd, len) => new Promise((res, rej) => (0, node_fs.ftruncate)(fd, len, (e) => e ? rej(e) : res()));
var pFchmod = (fd, mode) => new Promise((res, rej) => (0, node_fs.fchmod)(fd, mode, (e) => e ? rej(e) : res()));
var pFsync = (fd) => new Promise((res, rej) => (0, node_fs.fsync)(fd, (e) => e ? rej(e) : res()));
var pRead = (fd, buf, off, len, pos) => new Promise((res, rej) => (0, node_fs.read)(fd, buf, off, len, pos, (e, n) => e ? rej(e) : res(n)));
var pWriteAt = (fd, data, off) => new Promise((res, rej) => (0, node_fs.write)(fd, data, off, data.byteLength - off, null, (e, n) => e ? rej(e) : res(n)));
var pWrite = async (fd, data) => {
	let off = 0;
	while (off < data.byteLength) {
		const n = await pWriteAt(fd, data, off);
		if (n === 0) throw Object.assign(/* @__PURE__ */ new Error("short write: 0 bytes written"), { code: "EIO" });
		off += n;
	}
	return off;
};
var SafeFile = class {
	#fd;
	#tier;
	#closed = false;
	/** @internal */
	constructor(fd, tier) {
		this.#fd = fd;
		this.#tier = tier;
	}
	#requireMaxBytes(opts) {
		if (this.#tier !== "appdata" && opts?.maxBytes === void 0) throw new SizeLimitError(`maxBytes is required for reads on a "${this.#tier}"-tier file`);
		return opts?.maxBytes;
	}
	/** fstat the open handle — pinned to the inode opened race-free under
	*  the root, so `nlink` / `mode` / `mtime` here describe the same
	*  object the subsequent `truncate`/`write` will affect. */
	stat() {
		return pFstat(this.#fd);
	}
	/** Read the entire file. When `maxBytes` applies (always, on
	*  workspace/vm tiers), reads into a buffer initially sized to the
	*  file's stat'd size and grown only if the file grows during the
	*  read; {@link SizeLimitError} is thrown if it grows past `maxBytes`.
	*  Without `maxBytes` (appdata tier only), reads to EOF. */
	async readFile(opts) {
		const max = this.#requireMaxBytes(opts);
		const { size } = await pFstat(this.#fd);
		if (max === void 0) return boundedReadFd(this.#fd, size, Math.max(size, 1 << 20), false, opts?.signal);
		if (size > max) throw new SizeLimitError(`File is ${size} bytes; maxBytes is ${max}`);
		return boundedReadFd(this.#fd, size, max, true, opts?.signal);
	}
	async readText(opts) {
		return (await this.readFile(opts)).toString("utf-8");
	}
	/** Read up to `length` bytes at `position`. No maxBytes gate — the
	*  caller has already bounded the read by choosing `length`. */
	async read(buffer, offset, length, position) {
		return {
			bytesRead: await pRead(this.#fd, buffer, offset, length, position),
			buffer
		};
	}
	async write(data) {
		const buf = typeof data === "string" ? Buffer.from(data, "utf-8") : data;
		return { bytesWritten: await pWrite(this.#fd, buf) };
	}
	truncate(len = 0) {
		return pFtruncate(this.#fd, len);
	}
	/** fsync the pinned fd — used by `SafeRoot.writeFileAtomic` so the tmp
	*  inode's data is durable before the rename makes it visible at the
	*  target name. */
	sync() {
		return pFsync(this.#fd);
	}
	/** @internal — fchmod on the pinned fd; SafeRoot.chmod is the public
	*  entrypoint. */
	chmod(mode) {
		return pFchmod(this.#fd, mode);
	}
	/** `fs.createReadStream` bound to this fd (not a path). `end` is
	*  derived from `maxBytes` so the stream self-terminates instead of
	*  reading an adversary-controlled file to EOF. On workspace/vm
	*  tiers `maxBytes` is required. The returned stream does NOT close
	*  the fd (`autoClose: false`); the SafeFile's own disposal does. */
	createReadStream(opts) {
		const max = this.#requireMaxBytes(opts);
		const start = opts?.start ?? 0;
		const end = max !== void 0 ? start + max - 1 : void 0;
		return (0, node_fs.createReadStream)("", {
			fd: this.#fd,
			autoClose: false,
			start,
			end
		});
	}
	/** `fs.createWriteStream` bound to this fd — a `pipeline` sink for
	*  downloads / archive extraction where {@link write} would buffer
	*  the whole payload.
	*
	*  The returned stream **consumes the handle**: when it finishes (or
	*  errors) the fd is closed, and further operations on this `SafeFile`
	*  fail with EBADF. With `autoClose: false` an fd-backed write stream
	*  never releases its internal ref and the enclosing `withFile` /
	*  `await using` would hang on `close()`; `autoClose: true` is the
	*  only shape that works, and `fs.close` is idempotent so this
	*  SafeFile's own disposal is a no-op afterward. */
	createWriteStream(opts) {
		this.#closed = true;
		return (0, node_fs.createWriteStream)("", {
			fd: this.#fd,
			autoClose: true,
			...opts?.start !== void 0 && { start: opts.start }
		});
	}
	async close() {
		if (this.#closed) return;
		this.#closed = true;
		await pClose(this.#fd);
	}
	[Symbol.asyncDispose]() {
		return this.close();
	}
};
/**
* Read an int fd to EOF without exceeding `max` bytes. The initial buffer
* is sized to `knownSize` (from an fstat the caller has already done) plus
* one probe byte, and doubled — up to `max+1` — only if the file grows
* during the read. When `enforce` is false (appdata tier with no explicit
* maxBytes), `max` is a growth hint, not a cap.
*
* `signal` is checked before every chunk read (never mid-read), so an
* abort rejection guarantees no in-flight `fs.read` remains on the fd.
*
* @internal
*/
async function boundedReadFd(fd, knownSize, max, enforce, signal) {
	let buf = Buffer.allocUnsafe(Math.min(knownSize, max) + 1);
	let off = 0;
	for (;;) {
		signal?.throwIfAborted();
		if (off === buf.length) {
			const ceiling = enforce ? max + 1 : buf.length * 2;
			const next = Buffer.allocUnsafe(Math.min(buf.length * 2, ceiling));
			buf.copy(next, 0, 0, off);
			buf = next;
		}
		const n = await pRead(fd, buf, off, buf.length - off, off);
		if (n === 0) break;
		off += n;
		if (enforce && off > max) throw new SizeLimitError(`File grew past maxBytes (${max}) during read`);
	}
	return Buffer.from(buf.subarray(0, off));
}
/** @internal — close a raw fd; used by SafeRoot for the root dir handle. */
var closeFd = pClose;
/** @internal — fstat a raw fd; used by SafeRoot's one-shot helpers. */
var fstatFd = pFstat;
/** @internal — BigInt fstat for identity pins: float-truncated 64-bit
*  file IDs (ReFS, network redirectors) read 0 through plain Stats,
*  which silently disables dev/ino comparisons. */
var fstatFdBigInt = pFstatBig;
//#endregion
//#region src/main/safe-fs/SafeRoot.ts
/**
* SafeRoot — a capability for filesystem access rooted at one directory.
*
* ## Model
*
* A `SafeRoot` is obtained once (via {@link SafeRoot.open}) for a trusted,
* canonicalized directory, and every subsequent operation takes a path
* *relative to that root*. The relative path is treated as untrusted:
* it is lexically validated (no `..`, no absolute, no UNC / device / drive
* prefix, no NUL, no NTFS reserved names), then for every leaf-opening or
* write/rename op the leaf is opened fd-relative under a kernel-pinned
* root inode via the native `openBeneath` walk
* (`openat`/`openat2(RESOLVE_BENEATH)` on POSIX; `NtCreateFile` with
* `RootDirectory` on Windows), so a concurrent symlink/junction swap on
* any component cannot redirect the open (CC-2885).
*
* This replaces the ad-hoc `lstat → open(O_NOFOLLOW) → fstat` pattern that
* appears throughout `src/main` (see `debug.ts`, `local-agent-mode/globalMemory.ts`,
* `sessions/utils/transcriptExport.ts`) with one implementation that every
* caller shares. See `resolve.ts` for the details. The remaining
* path-based ops (`rm`/`copyFile`/`link`/`cp`/`readdir`/`stat`/`exists`/
* `access`/`statfs`/`readlink`) still use the best-effort lstat segment
* walk; see `resolve.ts` § "Step 2" for what that covers.
*
* ## Tiers
*
* The `tier` passed to {@link SafeRoot.open} records who controls the
* directory's contents and tightens defaults accordingly:
*
*  - `"appdata"`   — our own userData / logs / config dirs. Only we write
*    here under normal operation. `maxBytes` is optional on reads.
*  - `"workspace"` — a user-chosen directory (project folder, file picker
*    result). The user can put anything here, including symlinks and very
*    large files. `maxBytes` is required on reads.
*  - `"vm"`        — a directory mounted read-write into the Cowork VM.
*    A prompt-injected guest can race us. `maxBytes` is required.
*
* The tier does not change the resolution algorithm — it changes which
* omissions are compile-time / runtime errors.
*
* ## Lifetime
*
* A directory fd is held for the root on every platform (via
* `@ant/claude-native.openRootDir`). Every leaf-opening operation
* (`openFile`, `readFile`, `appendFile`, `createReadStream`, `chmod`) and
* `mkdir` resolves relative to that fd through the native `openBeneath` /
* `mkdirBeneath` walk, so a concurrent rename/symlink swap on the path
* string cannot redirect the open (CC-2885). `SafeRoot` implements
* `AsyncDisposable` — hold it with `await using` for scoped roots, or
* keep module-level roots for the app's lifetime; disposal closes the fd.
*/
var isWindows = process.platform === "win32";
/** Windows `\\?\` / `\\.\` extended-length and device-namespace prefixes.
*  Rejected at root-open time — they bypass Win32 path normalization and
*  can address raw devices. Checked separately from the generic UNC test
*  because `\\?\C:\…` is not a network path but is still unsafe here. */
var WIN_DEVICE_PREFIX_RE = /^[\\/]{2}[?.][\\/]/;
var SafeRoot = class SafeRoot {
	#canonical;
	#tier;
	#allowUnc;
	/** Kernel fd for the canonical root directory, obtained via
	*  `@ant/claude-native.openRootDir`. Every fd-relative operation
	*  (`openLeaf` / `mkdirAt`) walks from this. */
	#rootFd;
	/** Set by {@link SafeRoot.scratch}: `rm -rf` the root directory on
	*  dispose. Only ever true for a `mkdtemp`-created root. */
	#removeOnDispose;
	#disposed = false;
	/** Count of fd-relative ops currently between `#assertLive` and the
	*  native call returning — see {@link #withRootFd}. */
	#inflight = 0;
	/** Resolver `[Symbol.asyncDispose]` parks on while `#inflight > 0`. */
	#drained;
	constructor(canonical, tier, allowUnc, rootFd, removeOnDispose = false) {
		this.#canonical = canonical;
		this.#tier = tier;
		this.#allowUnc = allowUnc;
		this.#rootFd = rootFd;
		this.#removeOnDispose = removeOnDispose;
	}
	/** The canonical (realpath'd) absolute root. Exposed for logging and
	*  for interop with code that still needs a path string (e.g.
	*  `shell.showItemInFolder`). Do NOT `path.join` this with untrusted
	*  input — use the instance methods. */
	get path() {
		return this.#canonical;
	}
	get tier() {
		return this.#tier;
	}
	/**
	* Re-verify the root's liveness and identity. Ordinary operations
	* never re-check the root — fd-relative ops under `#rootFd` are
	* immune to path-string replacement by construction. This exists
	* for callers that HOLD a root across batches under an attacker-
	* co-writable tree and want a clean UnsafeRootError when the root
	* inode has been swapped or unlinked, rather than confusing per-op
	* errors. AVAILABLE API, currently uncalled in production.
	*/
	async assertRootLive() {
		this.#assertLive();
		let st;
		try {
			st = await (0, node_fs_promises.lstat)(this.#canonical, { bigint: true });
		} catch (e) {
			throw new UnsafeRootError(`Root vanished: ${this.#canonical} (${e.code ?? e})`);
		}
		if (st.isSymbolicLink() || !st.isDirectory()) throw new UnsafeRootError(`Root replaced by a non-directory or link: ${this.#canonical}`);
		const fst = await this.#withRootFd((rootFd) => fstatFdBigInt(rootFd));
		if (!(st.dev === 0n || st.ino === 0n || fst.dev === 0n || fst.ino === 0n) && (st.dev !== fst.dev || st.ino !== fst.ino)) throw new UnsafeRootError(`Root identity changed under us: ${this.#canonical}`);
	}
	/**
	* Open a root capability at `abs`.
	*
	* `abs` must be an absolute path. It is passed through the UNC /
	* symlink-hop guard from `./unc` (so a `\\host\share`
	* root, or one reached via a junction to UNC, is rejected *before*
	* any SMB connect could leak NTLM), then `realpath`'d once. The
	* resulting canonical path is what every later operation is resolved
	* under.
	*
	* Throws {@link UnsafeRootError} when `abs` is relative, UNC (unless
	* `opts.allowUnc`), `\\?\`-prefixed, nonexistent, or not a directory.
	*/
	static async open(abs, tier, opts) {
		if (typeof abs !== "string" || abs.length === 0 || abs.includes("\0")) throw new UnsafeRootError(`Invalid root path: ${JSON.stringify(abs)}`);
		if (WIN_DEVICE_PREFIX_RE.test(abs)) throw new UnsafeRootError(`Windows device-namespace root not allowed: ${abs}`);
		const isUnc = isUncPath(abs) && !isWslUncPath(abs);
		if (isUnc && !opts?.allowUnc) throw new UnsafeRootError(`UNC root not allowed: ${abs}`);
		if (!isUnc && !node_path.default.isAbsolute(abs)) throw new UnsafeRootError(`Root must be absolute: ${abs}`);
		try {
			await assertNoUncSymlinkHop(abs, { allowRootUnc: opts?.allowUnc });
		} catch (e) {
			throw new UnsafeRootError(`Root failed symlink/UNC guard: ${e instanceof Error ? e.message : String(e)}`, { cause: e });
		}
		let canonical;
		try {
			canonical = await (0, node_fs_promises.realpath)(abs);
		} catch (e) {
			throw new UnsafeRootError(`Root does not exist or is unreadable: ${abs} (${e.code ?? e})`, { cause: e });
		}
		if (!opts?.allowUnc && isUncPath(canonical) && !isWslUncPath(canonical)) throw new UnsafeRootError(`Root resolves to UNC: ${canonical}`);
		let rootFd;
		try {
			rootFd = await openRootHandle(canonical);
		} catch (e) {
			throw new UnsafeRootError(`Root is not an accessible directory: ${canonical} (${e.code ?? e})`, { cause: e });
		}
		return new SafeRoot(canonical, tier, opts?.allowUnc ?? false, rootFd);
	}
	/**
	* `mkdir -p` then {@link SafeRoot.open}. For the bootstrap case where
	* an appdata directory doesn't exist on first run. `abs` is trusted
	* (same contract as `open`) — the recursive mkdir is a plain
	* `fs.mkdir`, not the per-segment guarded walk that {@link mkdir}
	* applies to untrusted relative paths. Mode defaults to 0o700.
	*/
	static async openEnsured(abs, tier, opts) {
		await (0, node_fs_promises.mkdir)(abs, {
			recursive: true,
			mode: opts?.mode ?? 448
		});
		return SafeRoot.open(abs, tier, opts);
	}
	/**
	* Create a fresh `mkdtemp` directory under `os.tmpdir()` and open it
	* as a root. The directory is 0o700 with an unpredictable suffix, so
	* it is process-private by construction; the default `"appdata"` tier
	* reflects that. Disposing the returned root (`await using` /
	* `Symbol.asyncDispose`) removes the directory and everything under
	* it — pair with `await using` or a `try`/`finally` so the scratch
	* tree is cleaned up on every exit path.
	*/
	static async scratch(prefix = "claude-scratch-", tier = "appdata") {
		const dir = await (0, node_fs_promises.mkdtemp)(node_path.default.join((0, node_os.tmpdir)(), prefix));
		let canonical;
		let rootFd;
		try {
			canonical = await (0, node_fs_promises.realpath)(dir);
			rootFd = await openRootHandle(canonical);
		} catch (e) {
			await (0, node_fs_promises.rm)(dir, {
				recursive: true,
				force: true
			}).catch(() => void 0);
			throw new UnsafeRootError(`Scratch root not openable: ${dir} (${e.code ?? e})`);
		}
		return new SafeRoot(canonical, tier, false, rootFd, true);
	}
	/**
	* Open a root at `abs`, run `fn` with it, and dispose it on return or
	* throw. In an `async` scope, `await using root = await SafeRoot.open(…)`
	* is the equivalent idiom; this static exists for callers that can't
	* `await` — a sync event handler or a `(): void` helper — where the
	* only alternative is the verbose `open().then(async r => { try { … }
	* finally { await r[Symbol.asyncDispose](); } })` chain. Those callers
	* write `void SafeRoot.with(abs, tier, fn).catch(…)` and still get
	* guaranteed disposal on both the fulfilled and rejected path.
	*/
	static async with(abs, tier, fn, opts) {
		const root = await SafeRoot.open(abs, tier, opts);
		try {
			return await fn(root);
		} finally {
			await root[Symbol.asyncDispose]();
		}
	}
	#assertLive() {
		if (this.#disposed) throw new SafeFsDisposedError();
	}
	#requireMaxBytes(opts) {
		if (this.#tier !== "appdata" && opts?.maxBytes === void 0) throw new SizeLimitError(`maxBytes is required for reads on a "${this.#tier}"-tier root`);
		return opts?.maxBytes;
	}
	/** Resolve `rel` and reject when it names the root itself. Shared by
	*  every path-string op where acting on the root would be wrong (rm,
	*  copyFile, link, cp, rmdir, access, statfs, readlink). Runs the lstat
	*  segment walk — those ops are not yet fd-relative (see resolve.ts
	*  header). */
	async #resolveLeaf(rel) {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel);
		if (r.leaf === void 0) throw new PathEscapeError(rel);
		return r;
	}
	/** Lexical-only resolve for fd-relative ops. The native `openBeneath`
	*  walk does the per-segment no-follow check itself, so the lstat
	*  pre-walk in {@link resolveUnder} is redundant (and a wasted N
	*  syscalls per call). */
	#lexicalLeaf(rel) {
		this.#assertLive();
		const r = lexicalResolve(this.#canonical, rel);
		if (r.leaf === void 0) throw new PathEscapeError(rel);
		return r;
	}
	/** Hold `#rootFd` alive across `fn`. Every fd-relative op routes
	*  through this so a concurrent {@link [Symbol.asyncDispose]} cannot
	*  close (and have the kernel reuse) the fd number while a native
	*  `openBeneath`/`mkdirBeneath`/`renameBeneath` is in flight — that
	*  would walk under whatever unrelated directory got the recycled fd.
	*  Dispose sets `#disposed` (so new ops are rejected by `#assertLive`)
	*  and then awaits `#inflight === 0` before `closeFd`. */
	async #withRootFd(fn) {
		this.#assertLive();
		this.#inflight++;
		try {
			return await fn(this.#rootFd);
		} finally {
			this.#inflight--;
			if (this.#inflight === 0 && this.#drained !== void 0) {
				const resolve = this.#drained;
				this.#drained = void 0;
				resolve();
			}
		}
	}
	/** Reject a symlink at the leaf for operations that cannot use
	*  `O_NOFOLLOW` because Node's API takes a path, not an fd (`rename`,
	*  `copyFile`, `link`, `cp`). Same documented TOCTOU gap as the
	*  intermediate walk — see `resolve.ts`. Returns `null` on ENOENT so
	*  callers that tolerate a missing destination can proceed. */
	async #assertNotSymlinkLeaf(r) {
		const st = await (0, node_fs_promises.lstat)(r.full).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		});
		if (st?.isSymbolicLink()) throw new SymlinkEncounteredError(r.full);
		return st;
	}
	/** Multi-link gate default by tier: non-"appdata" roots reject
	*  nlink > 1 leaves unless the call site opts out — a hardlink
	*  redirects like a symlink and only the post-open fstat in
	*  {@link openLeaf} can catch it. "appdata" roots are exempt (only
	*  the app writes there, and it never hardlinks files it later
	*  opens through a SafeRoot). */
	#leafOpts(allowMultiLink) {
		return { allowMultiLink: this.#tier === "appdata" || allowMultiLink === true };
	}
	/** Read a file under the root. See {@link ReadFileOptions.maxBytes}. */
	async readFile(rel, opts) {
		const max = this.#requireMaxBytes(opts);
		const r = this.#lexicalLeaf(rel);
		const fd = await this.#withRootFd((rootFd) => openLeaf(rootFd, r, node_fs.constants.O_RDONLY, void 0, this.#leafOpts(opts?.allowMultiLink)));
		try {
			const st = await fstatFd(fd);
			if (!st.isFile()) throw new NotRegularFileError(r.full);
			if (max !== void 0 && st.size > max) throw new SizeLimitError(`${r.rel} is ${st.size} bytes; maxBytes is ${max}`);
			return await boundedReadFd(fd, st.size, max ?? Math.max(st.size, 1 << 20), max !== void 0);
		} finally {
			await closeFd(fd).catch(() => void 0);
		}
	}
	async readText(rel, opts) {
		return (await this.readFile(rel, opts)).toString("utf-8");
	}
	/** Read and `JSON.parse` a file. When `schema` is given, the result is
	*  validated and narrowed to `T`; without it the return type is `unknown`
	*  so callers must narrow explicitly. */
	async readJson(rel, opts) {
		const parsed = JSON.parse(await this.readText(rel, opts));
		return opts?.schema ? opts.schema.parse(parsed) : parsed;
	}
	/** `lstat` the leaf — does NOT follow a symlink at the leaf, so callers
	*  can distinguish symlink / file / directory. Intermediate symlinks are
	*  rejected as usual. */
	async stat(rel) {
		this.#assertLive();
		return (0, node_fs_promises.lstat)((await resolveUnder(this.#canonical, rel)).full);
	}
	/** `true` when `rel` names an existing entry under the root. Lexical
	*  escapes and intermediate symlinks still throw — only ENOENT maps
	*  to `false`. Prefer this over `access()` for plain existence. */
	async exists(rel) {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		});
		if (r === null) return false;
		try {
			await (0, node_fs_promises.lstat)(r.full);
			return true;
		} catch (e) {
			if (e.code === "ENOENT") return false;
			throw e;
		}
	}
	/** `fs.access` under the root — checks the calling process's
	*  permission bits (e.g. `fs.constants.X_OK` for executability).
	*  Throws on failure with the underlying errno. A symlink at the
	*  leaf is rejected rather than followed; use {@link exists} for a
	*  boolean existence check. */
	async access(rel, mode) {
		const r = await this.#resolveLeaf(rel);
		await this.#assertNotSymlinkLeaf(r);
		await (0, node_fs_promises.access)(r.full, mode);
	}
	/** Read a symbolic link's target string. Intermediate symlinks are
	*  rejected as usual; the leaf is the link being read and is not
	*  followed (that's what `readlink` does). Throws EINVAL when the
	*  leaf is not a symlink, matching `fs.readlink`. */
	async readlink(rel) {
		return (0, node_fs_promises.readlink)((await this.#resolveLeaf(rel)).full);
	}
	/** Filesystem stats (`statfs`) for the volume the root lives on —
	*  free-block / free-inode preflight before a large download. `rel`
	*  defaults to the root itself since every path under one root is on
	*  the same filesystem. */
	async statfs(rel = ".") {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel);
		if (r.leaf !== void 0) await this.#assertNotSymlinkLeaf(r);
		return (0, node_fs_promises.statfs)(r.full);
	}
	/** List a directory under the root. Entries are reported with `lstat`
	*  semantics (a symlink entry has `isSymbolicLink: true` and is NOT
	*  followed). `path` on each entry is root-relative so it feeds straight
	*  back into another SafeRoot call.
	*
	*  With `{recursive: true}` the subtree under `rel` is walked
	*  breadth-first. Symlink entries are still reported but never
	*  descended into, so the walk cannot escape the root — this is the
	*  difference from `fs.readdir({recursive})`, which follows symlinked
	*  directories. */
	async readdir(rel = ".", opts) {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel);
		if (r.leaf !== void 0) {
			const st = await (0, node_fs_promises.lstat)(r.full);
			if (st.isSymbolicLink() || !st.isDirectory()) throw new SymlinkEncounteredError(r.full);
		}
		const listOne = async (full, base) => {
			return (await (0, node_fs_promises.readdir)(full, { withFileTypes: true })).map((e) => ({
				name: e.name,
				path: base.length > 0 ? `${base}/${e.name}` : e.name,
				isFile: e.isFile(),
				isDirectory: e.isDirectory(),
				isSymbolicLink: e.isSymbolicLink()
			}));
		};
		if (!opts?.recursive) return listOne(r.full, r.rel);
		const out = [];
		const queue = [[r.full, r.rel]];
		while (queue.length > 0) {
			const [full, base] = queue.shift();
			for (const e of await listOne(full, base)) {
				out.push(e);
				if (e.isDirectory && !e.isSymbolicLink) queue.push([node_path.default.join(full, e.name), e.path]);
			}
		}
		return out;
	}
	/**
	* Atomic write: write to `{leaf}.{rand}.tmp`, fsync, rename over the
	* target, fsync the parent directory. The tmp file is a fresh inode
	* created at `mode` (default 0o600), so a previously world-readable
	* target is fixed on next write with no window where new bytes sit in
	* a permissive file — same guarantee as `helpers/privateFile.writeFileAtomic`,
	* which this supersedes for callers under a SafeRoot.
	*
	* Both the tmp open and the rename are fd-relative (`openBeneath` /
	* `renameBeneath`), so a concurrent symlink/junction swap on any
	* intermediate component cannot redirect either step (CC-2885). On
	* Windows, transient AV/backup-sync locks on the target
	* (EBUSY/EACCES/EPERM) are retried with backoff; EXDEV (folder
	* redirection / Offline Files) falls back to a direct fd-pinned
	* truncate+write of the target — that fallback is NOT atomic (a crash
	* mid-write leaves an empty file), matching `privateFile`'s behaviour.
	*
	* Parent directories are NOT created implicitly — call {@link mkdir}
	* first. Implicit mkdir would let a `rel` with a typo silently create
	* a new tree.
	*
	* No `allowMultiLink` opt-out here, deliberately (the `Omit` is the
	* contract): the tmp leaf is a fresh `O_EXCL` inode (always nlink=1,
	* nothing to opt out of), and the EXDEV/retry-exhaustion fallback is
	* an in-place write of the existing destination — honoring an opt-out
	* there would write host-authored bytes *through* a hardlink alias
	* into a possibly-external inode, the exact hazard the multi-link
	* gate closes. The fallback stays fail-closed for every caller.
	*/
	async writeFileAtomic(rel, data, opts) {
		const r = this.#lexicalLeaf(rel);
		const mode = opts?.mode ?? 384;
		return withTargetSerialized(r.full, () => this.#writeFileAtomicSerialized(r, data, mode));
	}
	async #writeFileAtomicSerialized(r, data, mode) {
		const tmpLeaf = `.${r.leaf}.${process.pid}.${Math.random().toString(36).slice(2, 8)}.tmp`;
		const tmpSegs = [...r.dirSegments, tmpLeaf];
		const dstSegs = [...r.dirSegments, r.leaf];
		let tmp;
		try {
			tmp = new SafeFile(await this.#withRootFd((rootFd) => openLeaf(rootFd, {
				...r,
				leaf: tmpLeaf,
				rel: tmpSegs.join("/")
			}, node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_EXCL, mode, this.#leafOpts())), this.#tier);
			await tmp.write(data);
			await tmp.sync();
			await tmp.close();
		} catch (e) {
			await tmp?.close().catch(() => void 0);
			await this.#withRootFd((rootFd) => unlinkAt(rootFd, tmpSegs)).catch(() => void 0);
			throw e;
		}
		try {
			await this.#renameTmp(tmpSegs, dstSegs, data, mode);
		} catch (e) {
			await this.#withRootFd((rootFd) => unlinkAt(rootFd, tmpSegs)).catch(() => void 0);
			throw e;
		}
	}
	/** rename(tmp → dst) via the fd-relative `renameAt`. Windows
	*  EBUSY/EACCES/EPERM (transient AV / backup-sync lock) is retried
	*  with backoff; EXDEV (folder redirection / Offline Files) and retry
	*  exhaustion fall back to a direct fd-pinned truncate+write of `dst`
	*  via `openBeneath` — same containment guarantee as the rename path,
	*  not atomic. The caller cleans up `tmp` on throw. */
	async #renameTmp(tmpSegs, dstSegs, data, mode) {
		for (let attempt = 0; attempt < 3; attempt++) try {
			await this.#withRootFd((rootFd) => renameAt(rootFd, tmpSegs, dstSegs));
			return;
		} catch (e) {
			const code = e.code;
			if (code === "EXDEV") break;
			if (code !== void 0 && RETRYABLE_RENAME_ERRNOS.has(code)) {
				if (attempt < 2) await (0, node_timers_promises.setTimeout)(50 * (attempt + 1));
				continue;
			}
			throw e;
		}
		await this.withFile(dstSegs.join("/"), node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT, async (f) => {
			if (!isWindows) await f.chmod(mode);
			await f.truncate(0);
			await f.write(data);
			await f.sync();
		});
		await this.#withRootFd((rootFd) => unlinkAt(rootFd, tmpSegs)).catch(() => void 0);
	}
	/** Atomic JSON write, 2-space indent. */
	writeJsonAtomic(rel, data, opts) {
		return this.writeFileAtomic(rel, JSON.stringify(data, null, 2), opts);
	}
	/** Append to a file under the root, creating it at `mode` (default
	*  0o600) if it does not exist. The append goes through an
	*  `O_NOFOLLOW` open, so a symlink at the leaf is rejected rather
	*  than followed. Not atomic — callers that need atomicity should
	* read-modify-{@link writeFileAtomic}. Like every write sink, the
	* multi-link gate is not optional here: a hardlink inside the root
	* aliases an inode whose other name may live outside it. */
	async appendFile(rel, data, opts) {
		const r = this.#lexicalLeaf(rel);
		const mode = opts?.mode ?? 384;
		const f = new SafeFile(await this.#withRootFd((rootFd) => openLeaf(rootFd, r, node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_APPEND, mode, this.#leafOpts())), this.#tier);
		try {
			const st = await f.stat();
			if (!st.isFile()) throw new NotRegularFileError(r.full);
			if (!isWindows && (st.mode & 63) !== 0) await f.chmod(mode);
			await f.write(data);
		} finally {
			await f.close();
		}
	}
	/** Rename `srcRel` to `dstRel`, both under the root, via the
	*  fd-relative `renameAt` (POSIX `renameat` / Windows
	*  `NtSetInformationFile` with `RootDirectory`). A symlink/junction at
	*  any component of either side is refused; a symlink at `srcRel`
	*  itself is moved, not followed (rename operates on the link). The
	*  parent of `dstRel` must already exist. Refuses to rename the root
	*  itself. */
	async rename(srcRel, dstRel) {
		const src = this.#lexicalLeaf(srcRel);
		const dst = this.#lexicalLeaf(dstRel);
		await this.#withRootFd((rootFd) => renameAt(rootFd, [...src.dirSegments, src.leaf], [...dst.dirSegments, dst.leaf]));
	}
	/** Copy a single file from `srcRel` to `dstRel` as a GATED FD PUMP:
	*  both ends go through {@link openLeaf} (fd-relative, multi-link
	*  gate, deferred-truncate) and the bytes move handle-to-handle —
	*  no path re-enters after the opens, so the lstat→copy TOCTOU the
	*  path-based `fs.copyFile` carries (and its hardlink blindness:
	*  copying ONTO an nlink>1 alias writes through to the alias
	*  target) is gone.
	*
	*  `flags`: `COPYFILE_EXCL` maps to an O_CREAT|O_EXCL destination
	*  open. `COPYFILE_FICLONE` is advisory reflink and is accepted as
	*  a no-op — the pump always byte-copies. `COPYFILE_FICLONE_FORCE`
	*  demands a reflink a gated pump cannot provide and is rejected.
	*
	*  The destination inode is created at `opts.mode` (default 0o600 —
	*  SafeRoot's owner-only posture). `opts.maxBytes` bounds the bytes
	*  pumped — optional even on vm/workspace tiers because the pump is
	*  streaming (O(chunk) memory, no OOM vector). Not atomic: a
	*  NON-EXCL mid-pump failure leaves the destination
	*  truncated+partial with no restore — a caller with a precious
	*  destination copies EXCL to a temp name and renames. */
	async copyFile(srcRel, dstRel, flags, opts) {
		const src = this.#lexicalLeaf(srcRel);
		const dst = this.#lexicalLeaf(dstRel);
		const KNOWN_COPY_FLAGS = node_fs.constants.COPYFILE_EXCL | node_fs.constants.COPYFILE_FICLONE | node_fs.constants.COPYFILE_FICLONE_FORCE;
		if (flags !== void 0 && (flags & ~KNOWN_COPY_FLAGS) !== 0) throw new SafeFsError("EINVAL", `copyFile flags accepts only COPYFILE_* constants; got ${flags}`);
		const excl = ((flags ?? 0) & node_fs.constants.COPYFILE_EXCL) !== 0;
		if (((flags ?? 0) & node_fs.constants.COPYFILE_FICLONE_FORCE) !== 0) throw new SafeFsError("ERR_SAFE_FS_NOT_SUPPORTED", "COPYFILE_FICLONE_FORCE is not supported by the gated pump copy");
		const srcF = new SafeFile(await this.#withRootFd((rootFd) => openLeaf(rootFd, src, node_fs.constants.O_RDONLY, void 0, this.#leafOpts(opts?.allowMultiLink))), this.#tier);
		try {
			const srcSt = await srcF.stat();
			if (!srcSt.isFile()) throw new NotRegularFileError(src.full);
			if (opts?.maxBytes !== void 0 && srcSt.size > opts.maxBytes) throw new SizeLimitError(`copyFile source ${src.rel} is ${srcSt.size} bytes (bound ${opts.maxBytes})`);
			const dstF = new SafeFile(await this.#withRootFd((rootFd) => openLeaf(rootFd, dst, node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | (excl ? node_fs.constants.O_EXCL : node_fs.constants.O_TRUNC), opts?.mode ?? 384, this.#leafOpts())), this.#tier);
			try {
				const dstShape = await dstF.stat();
				if (!dstShape.isFile()) throw new SafeFsError("ENOTREG", `copy destination is not a regular file: ${dst.full}`);
				if (!isWindows && opts?.mode !== void 0) await dstF.chmod(opts.mode);
				else if (!isWindows && !excl) {
					if ((dstShape.mode & 63) !== 0) await dstF.chmod(384);
				}
				const CHUNK = 64 * 1024;
				const buf = Buffer.allocUnsafe(CHUNK);
				let total = 0;
				for (;;) {
					const { bytesRead } = await srcF.read(buf, 0, CHUNK, -1);
					if (bytesRead === 0) break;
					total += bytesRead;
					if (opts?.maxBytes !== void 0 && total > opts.maxBytes) throw new SizeLimitError(`copyFile source ${src.rel} exceeded ${opts.maxBytes} bytes mid-copy`);
					await dstF.write(buf.subarray(0, bytesRead));
				}
				if (opts?.sync) await dstF.sync();
			} catch (e) {
				await dstF.close().catch(() => void 0);
				if (excl) await this.#withRootFd((rootFd) => unlinkAt(rootFd, [...dst.dirSegments, dst.leaf])).catch(() => void 0);
				throw e;
			}
			await dstF.close();
		} finally {
			await srcF.close().catch(() => void 0);
		}
	}
	/** Hard-link `srcRel` to `dstRel`. Both must be under the root and on
	*  the same filesystem (EXDEV otherwise). A symlink at `srcRel` is
	*  rejected — POSIX leaves `link(2)` on a symlink implementation-
	*  defined, and a staging caller wants the file, not the link.
	*  NOTE: the one sanctioned production consumer is sessionBranching's
	*  copy→link→rm branch-outputs staging — link(2)'s atomic no-clobber
	*  is load-bearing there (the branch CLI's own newer write must never
	*  be clobbered, and rename clobbers). It manufactures a transient
	*  nlink=2 window by construction; the crash-residue case (dest at
	*  nlink=2 with an orphan tmp beside it) self-heals via the stale-tmp
	*  sweep at dir-copy start. A new caller should justify why an alias
	*  window is acceptable. */
	async link(srcRel, dstRel) {
		const src = await this.#resolveLeaf(srcRel);
		const dst = await this.#resolveLeaf(dstRel);
		await this.#assertNotSymlinkLeaf(src);
		await (0, node_fs_promises.link)(src.full, dst.full);
	}
	/** Change the mode bits of a file under the root. Goes through an
	*  `O_NOFOLLOW` open + `fchmod` on the resulting fd, so the inode
	*  whose mode changes is pinned — a symlink at the leaf is rejected,
	*  not followed. No-op on Windows (POSIX mode bits don't map to
	*  ACLs; see {@link writeFileAtomic}'s fallback). */
	async chmod(rel, mode) {
		if (isWindows) return;
		const r = this.#lexicalLeaf(rel);
		const f = new SafeFile(await this.#withRootFd((rootFd) => openLeaf(rootFd, r, node_fs.constants.O_RDONLY, void 0, this.#leafOpts())), this.#tier);
		try {
			await f.chmod(mode);
		} finally {
			await f.close();
		}
	}
	/** mkdir under the root. Each component is created via the native
	*  fd-relative `mkdirat` walk, so an existing symlink/junction at any
	*  component fails the call rather than being followed. Mode defaults
	*  to 0o700 (PRIVATE_DIR_MODE). */
	async mkdir(rel, opts) {
		this.#assertLive();
		const r = lexicalResolve(this.#canonical, rel);
		if (r.leaf === void 0) return;
		const mode = opts?.mode ?? 448;
		const all = [...r.dirSegments, r.leaf];
		if (!opts?.recursive) {
			await this.#withRootFd((rootFd) => mkdirAt(rootFd, all, mode));
			return;
		}
		for (let i = 1; i <= all.length; i++) try {
			await this.#withRootFd((rootFd) => mkdirAt(rootFd, all.slice(0, i), mode));
		} catch (e) {
			if (e.code !== "EEXIST") throw e;
			if (i === all.length) {
				const st = await (0, node_fs_promises.lstat)(r.full);
				if (st.isSymbolicLink() || !st.isDirectory()) throw new SymlinkEncounteredError(r.full);
			}
		}
	}
	/** Remove a path under the root. `recursive` removes a directory tree.
	*  `maxRetries` / `retryDelay` are passed through to `fs.rm` for the
	*  Windows AV-lock case. Refuses to remove the root itself (`rel`
	*  resolving to `"."`). */
	async rm(rel, opts) {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel);
		if (r.leaf === void 0) throw new PathEscapeError(rel);
		const st = await (0, node_fs_promises.lstat)(r.full).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		});
		if (st === null) return;
		if (st.isSymbolicLink()) {
			await (0, node_fs_promises.unlink)(r.full);
			return;
		}
		await (0, node_fs_promises.rm)(r.full, {
			recursive: opts?.recursive ?? false,
			force: true,
			...opts?.maxRetries !== void 0 && { maxRetries: opts.maxRetries },
			...opts?.retryDelay !== void 0 && { retryDelay: opts.retryDelay }
		});
	}
	/** Remove a single empty directory. Fails with ENOTEMPTY when the
	*  directory has entries — use this instead of {@link rm} when
	*  "delete only if nothing is left" is the intended semantics (e.g.
	*  pruning an index directory after its last item is removed). */
	async rmdir(rel) {
		const r = await this.#resolveLeaf(rel);
		await this.#assertNotSymlinkLeaf(r);
		await (0, node_fs_promises.rmdir)(r.full);
	}
	/** Copy a file or (with `{recursive: true}`) a directory tree from
	*  `srcRel` to `dstRel`. The tree walk uses this root's own
	*  `lstat`-guarded `readdir`, so a symlink anywhere under `srcRel`
	*  throws {@link SymlinkEncounteredError} rather than being followed
	*  or silently copied — callers that need to preserve symlinks should
	*  keep their raw `fs.cp` escape hatch. Directory mode defaults to
	*  0o700; file mode is preserved from the source. */
	async cp(srcRel, dstRel, opts) {
		const src = await this.#resolveLeaf(srcRel);
		const dst = await this.#resolveLeaf(dstRel);
		const srcSt = await this.#assertNotSymlinkLeaf(src);
		if (srcSt === null) {
			await this.copyFile(srcRel, dstRel);
			return;
		}
		if (srcSt.isFile()) {
			await this.copyFile(srcRel, dstRel, void 0, { mode: srcSt.mode & 511 });
			return;
		}
		if (!srcSt.isDirectory()) throw new NotRegularFileError(src.full);
		if (!opts?.recursive) {
			const err = /* @__PURE__ */ new Error(`cp: ${src.rel} is a directory (pass {recursive: true})`);
			err.code = "EISDIR";
			throw err;
		}
		await this.mkdir(dst.rel, { recursive: true });
		for (const e of await this.readdir(src.rel, { recursive: true })) {
			if (e.isSymbolicLink) throw new SymlinkEncounteredError(node_path.default.join(this.#canonical, e.path));
			const sub = e.path.slice(src.rel.length + 1);
			const dstEntry = `${dst.rel}/${sub}`;
			if (e.isDirectory) await this.mkdir(dstEntry, { recursive: true });
			else if (e.isFile) {
				const entrySt = await this.stat(e.path);
				await this.copyFile(e.path, dstEntry, void 0, { mode: entrySt.mode & 511 });
			}
		}
	}
	/** Open a {@link SafeFile} at `rel`. Prefer {@link withFile} for scoped
	*  access — this variant is for callers that need to hold the handle
	*  across an await point the `withFile` callback shape doesn't fit.
	*
	*  `allowMultiLink` is honored on read-only opens ONLY — same
	*  source-vs-sink split as {@link copyFile}. A write-capable open
	*  (`O_WRONLY`/`O_RDWR`, or any of `O_CREAT`/`O_TRUNC`/`O_APPEND`)
	*  ignores the opt-out and stays fail-closed on nlink > 1: writing
	*  through a hardlink alias lands bytes in an inode whose other name
	*  may live outside the root, the exact hazard the multi-link gate
	*  closes for every write sink. One boundary the read-only honor
	*  does NOT close: metadata mutators on the returned handle (fchmod
	*  succeeds on an O_RDONLY fd), so an opted-out open of a hardlinked
	*  leaf can still change the shared inode's mode — byte writes and
	*  truncate cannot cross a read-only fd. */
	async openFile(rel, flags, mode = 384, opts) {
		const r = this.#lexicalLeaf(rel);
		const numFlags = typeof flags === "string" ? stringFlagsToInt(flags) : flags;
		const writeCapable = (numFlags & (node_fs.constants.O_WRONLY | node_fs.constants.O_RDWR | node_fs.constants.O_CREAT | node_fs.constants.O_TRUNC | node_fs.constants.O_APPEND)) !== 0;
		const fd = await this.#withRootFd((rootFd) => openLeaf(rootFd, r, numFlags, mode, this.#leafOpts(writeCapable ? void 0 : opts?.allowMultiLink)));
		try {
			if (!(await fstatFd(fd)).isFile()) throw new NotRegularFileError(r.full);
		} catch (e) {
			await closeFd(fd).catch(() => void 0);
			throw e;
		}
		return new SafeFile(fd, this.#tier);
	}
	/**
	* Open `rel` and return a detached `ReadStream` that owns its fd.
	*
	* This exists for callers that must hand a stream to code outside
	* the `SafeRoot`'s lifetime — `form-data` multipart upload,
	* `readline.createInterface`, `tar.create`, an `electron.net`
	* response body — where {@link SafeFile.createReadStream} would
	* require holding the `SafeFile` open until the consumer finishes.
	* The returned stream has `.path` set to the resolved absolute path
	* so `form-data` can infer filename / Content-Type, and (by default)
	* closes the fd itself when the stream ends or errors.
	*
	* The fd is obtained via `O_NOFOLLOW` and `fstat`-checked for
	* `isFile()` before the stream is created, so a symlink or FIFO at
	* the leaf is rejected with the same errors as {@link readFile}.
	* `maxBytes` is translated to the stream's `end` offset (required on
	* workspace/vm tiers).
	*/
	async createReadStream(rel, opts) {
		const max = this.#requireMaxBytes(opts);
		const r = this.#lexicalLeaf(rel);
		const fd = await this.#withRootFd((rootFd) => openLeaf(rootFd, r, node_fs.constants.O_RDONLY, void 0, this.#leafOpts(opts?.allowMultiLink)));
		try {
			if (!(await fstatFd(fd)).isFile()) throw new NotRegularFileError(r.full);
		} catch (e) {
			await closeFd(fd).catch(() => void 0);
			throw e;
		}
		const start = opts?.start ?? 0;
		const end = max !== void 0 ? start + max - 1 : void 0;
		const stream = (0, node_fs.createReadStream)("", {
			fd,
			autoClose: opts?.autoClose ?? true,
			start,
			end
		});
		stream.path = r.full;
		return stream;
	}
	/** Run `fn` with a {@link SafeFile} open at `rel`; the handle is closed
	*  on return or throw. */
	async withFile(rel, flags, fn) {
		const f = await this.openFile(rel, flags);
		try {
			return await fn(f);
		} finally {
			await f.close();
		}
	}
	/** Derive a sub-capability rooted at `rel`. The child's canonical path
	*  is under this root's, and its tier is inherited, so handing a child
	*  to less-trusted code narrows what that code can reach. */
	async child(rel) {
		this.#assertLive();
		const r = await resolveUnder(this.#canonical, rel);
		const opts = { allowUnc: this.#allowUnc };
		if (r.leaf === void 0) return SafeRoot.open(this.#canonical, this.#tier, opts);
		const st = await (0, node_fs_promises.lstat)(r.full);
		if (st.isSymbolicLink() || !st.isDirectory()) throw new SymlinkEncounteredError(r.full);
		const child = await SafeRoot.open(r.full, this.#tier, opts);
		const parentWithSep = this.#canonical.endsWith(node_path.default.sep) ? this.#canonical : this.#canonical + node_path.default.sep;
		if (!(child.#canonical + node_path.default.sep).startsWith(parentWithSep)) {
			await child[Symbol.asyncDispose]();
			throw new SymlinkEncounteredError(r.full);
		}
		return child;
	}
	async [Symbol.asyncDispose]() {
		if (this.#disposed) return;
		this.#disposed = true;
		if (this.#inflight > 0) await new Promise((resolve) => {
			this.#drained = resolve;
		});
		await closeFd(this.#rootFd).catch(() => void 0);
		if (this.#removeOnDispose) await (0, node_fs_promises.rm)(this.#canonical, {
			recursive: true,
			force: true,
			maxRetries: 3
		}).catch(() => void 0);
	}
};
/** Thrown when a method is called on a SafeRoot after it was disposed. */
var SafeFsDisposedError = class extends SafeFsError {
	constructor() {
		super("ERR_SAFE_FS_DISPOSED", "SafeRoot used after dispose");
		this.name = "SafeFsDisposedError";
	}
};
var STRING_FLAGS = {
	r: node_fs.constants.O_RDONLY,
	"r+": node_fs.constants.O_RDWR,
	w: node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_TRUNC,
	wx: node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_TRUNC | node_fs.constants.O_EXCL,
	a: node_fs.constants.O_WRONLY | node_fs.constants.O_CREAT | node_fs.constants.O_APPEND
};
/** Transient Windows AV / backup-sync lock errnos that
*  {@link SafeRoot.#renameTmp} retries with backoff before falling back
*  to a direct fd-pinned write. */
/** Per-target write serialization for {@link SafeRoot.writeFileAtomic}'s
*  in-place fallback. Refcounted so the map never grows unbounded. */
var atomicWriteChains = /* @__PURE__ */ new Map();
async function withTargetSerialized(key, fn) {
	let entry = atomicWriteChains.get(key);
	if (!entry) {
		entry = {
			chain: Promise.resolve(),
			refs: 0
		};
		atomicWriteChains.set(key, entry);
	}
	entry.refs++;
	const run = entry.chain.then(fn, fn);
	entry.chain = run.catch(() => void 0);
	try {
		return await run;
	} finally {
		if (--entry.refs === 0) atomicWriteChains.delete(key);
	}
}
var RETRYABLE_RENAME_ERRNOS = /* @__PURE__ */ new Set([
	"EPERM",
	"EBADF",
	"EACCES",
	"EBUSY"
]);
function stringFlagsToInt(flags) {
	const n = STRING_FLAGS[flags];
	if (n === void 0) throw new TypeError(`SafeRoot: unsupported flag string ${JSON.stringify(flags)}; pass numeric fs.constants`);
	return n;
}
//#endregion
//#region \0@oxc-project+runtime@0.138.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region src/main/sessions/utils/transcriptExport.ts
/**
* Shared transcript-export helper for CCD (LocalSessionManager) and
* Cowork/LAM (LocalAgentModeSessionManager) shareSession() implementations.
*
* Both managers previously had near-identical zip-and-save logic; this module
* extracts the common pipeline. Callers supply the paths that differ between
* surfaces (CCD reads from the host's ~/.claude, LAM reads from a per-session
* VM storage dir) and this module handles transcript discovery, recursive
* directory collection, zipping, and saving to ~/Downloads.
*
* `exportSessionTranscript` runs in the heavy-work utilityProcess (main
* callers go through `./transcriptExportHost.ts`), so this module stays pure
* Node: Electron-derived paths arrive as params resolved on main, and
* `@/main/logging` is aliased to a console shim in worker bundles. Do not
* import `electron` here — `forbidElectronPlugin` fails the worker build.
*
* All filesystem calls are async (fs.promises) per the desktop CLAUDE.md ban
* on sync fs operations — the old LAM implementation used sync calls.
*/
/** Cap on bytes read from any single VM-writable file we bundle.
*  Transcript .jsonl files from long agent sessions legitimately reach
*  tens of MB; 50 MB is an upper bound that still stops a VM from
*  OOM-ing the reading process (the heavy-work worker for exports, main
*  for LAM's feedback walk) with a synthetic file. The previous
*  implementation was unbounded. */
var MAX_BUNDLE_FILE_BYTES = 50 * 1024 * 1024;
/** Caps on the session-scoped fallback: sibling count and total bytes. */
var MAX_FALLBACK_TRANSCRIPTS = 20;
var MAX_FALLBACK_BYTES = 100 * 1024 * 1024;
/**
* The CLI only ever writes UUID-named transcripts (`{uuid}.jsonl`). The
* session-scoped fallback discovers files by `readdir` of a VM-guest-writable
* dir, so reject any other name before it becomes a zip entry name or a
* subagent-dir prefix: a hostile name like `...jsonl` (→ `..` prefix) or one
* carrying `\` / control chars is a zip-slip vector in an export handed to
* raters and extracted elsewhere.
*/
var FALLBACK_TRANSCRIPT_NAME_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jsonl$/i;
/**
* Read a regular file without following a symlink at `filePath`. Returns
* null on any error (including "leaf is a symlink") to keep the existing
* swallow-and-skip behaviour callers rely on.
*
* Now a thin wrapper over {@link SafeRoot}: open a root at the parent
* directory (tier `"vm"` — the call sites below read from VM-mounted
* `.claude/projects`), then `readFile` the leaf. SafeRoot does the lstat
* + O_NOFOLLOW + fstat-is-regular-file dance that used to live here, and
* adds the `maxBytes` cap that was missing.
*/
async function readRegularFileNoFollow(filePath) {
	try {
		try {
			var _usingCtx$1 = _usingCtx();
			return await _usingCtx$1.a(await SafeRoot.open((0, node_path.dirname)(filePath), "vm", { allowUnc: true })).readFile((0, node_path.basename)(filePath), { maxBytes: MAX_BUNDLE_FILE_BYTES });
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			await _usingCtx$1.d();
		}
	} catch {
		return null;
	}
}
/**
* Log-dir entries we never bundle in an export:
*  - echo.log / echo1.log contain verbatim screen-activity descriptions
*    (kept in sync with EXCLUDED_LOG_FILES in main/debug.ts — not imported
*    from there to avoid a debug → LAM → transcriptExport → debug cycle)
*  - traces/ holds CPU profiles from main/profiling.ts, not log files
*/
var EXCLUDED_LOG_ENTRIES = /* @__PURE__ */ new Set([
	"echo.log",
	"echo1.log",
	"traces"
]);
var SESSION_EXPORT_PREFIX = "session-export-";
/** Old enough that a matching `.zip.tmp` can't be another app instance's
*  in-flight staged write (instances share ~/Downloads). */
var STALE_EXPORT_TMP_AGE_MS = 600 * 1e3;
/**
* Find and zip a CLI session's transcript + subagent outputs + metadata,
* then save to {downloadsDir}.
*
* Runs inside the heavy-work utilityProcess; main-process callers go through
* `runSessionTranscriptExport` (./transcriptExportHost.ts). Returns
* `{ success: false, error }` only for the handled missing/unreadable
* transcript cases; anything unexpected throws to the worker seam, and the
* host maps it to a message-less `{ success: false }` — a raw fs error can
* carry paths, which belong in local logs, never the renderer toast.
*/
async function exportSessionTranscript({ cliSessionId, projectsDir, metadataFilePath, extraFiles, sessionScopedProjectsDir, logsDir, downloadsDir }) {
	const zipData = {};
	let transcriptFound = false;
	let transcriptUnreadable = false;
	let transcriptTooLarge = false;
	let projectDirs = [];
	let scanRoot = projectsDir;
	let withinScanRoot = null;
	if (sessionScopedProjectsDir) {
		const stat0 = await node_fs.default.promises.lstat(projectsDir, { bigint: true }).catch(() => null);
		if (!stat0 || stat0.isSymbolicLink() || !stat0.isDirectory()) logger.warn("[transcriptExport] session-scoped projects dir is missing or a symlink — refusing to scan it", { projectsDir });
		else {
			const within = makeRealpathContainmentCheck(projectsDir, {
				allowRootUnc: true,
				refuseSubstitutedPath: isAutomountRootPath
			});
			const resolvedRoot = await within(projectsDir);
			const statPinned = resolvedRoot ? await node_fs.default.promises.lstat(resolvedRoot, { bigint: true }).catch(() => null) : null;
			if (!resolvedRoot || !statPinned || statPinned.dev !== stat0.dev || statPinned.ino !== stat0.ino) logger.warn("[transcriptExport] session-scoped projects dir changed identity during the symlink check — refusing to scan it", { projectsDir });
			else if (await within((0, node_path.dirname)(resolvedRoot))) logger.warn("[transcriptExport] session-scoped projects dir containment anchor failed its canary check — refusing to scan it", { projectsDir });
			else {
				scanRoot = resolvedRoot;
				withinScanRoot = within;
				projectDirs = await node_fs.default.promises.readdir(scanRoot).catch(() => {
					logger.warn("[transcriptExport] projects directory not found", { projectsDir });
					return [];
				});
			}
		}
	} else try {
		projectDirs = await node_fs.default.promises.readdir(projectsDir);
	} catch {
		logger.warn("[transcriptExport] projects directory not found", { projectsDir });
	}
	const hits = await new PQueue({ concurrency: 20 }).addAll(projectDirs.map((projectHash) => async () => {
		const projectPath = (0, node_path.join)(scanRoot, projectHash);
		const stats = await node_fs.default.promises.lstat(projectPath).catch(() => null);
		if (!stats || stats.isSymbolicLink() || !stats.isDirectory()) return null;
		const transcriptPath = (0, node_path.join)(projectPath, `${cliSessionId}.jsonl`);
		const transcriptStat = await node_fs.default.promises.lstat(transcriptPath).catch(() => null);
		if (!transcriptStat?.isFile()) return null;
		return {
			projectPath,
			transcriptPath,
			size: transcriptStat.size
		};
	}));
	for (const hit of hits) {
		if (!hit) continue;
		let readPath = hit.transcriptPath;
		if (withinScanRoot) {
			const resolved = await withinScanRoot(hit.transcriptPath);
			if (!resolved) {
				logger.warn("[transcriptExport] transcript no longer resolves within the scan root — skipping", { transcriptPath: hit.transcriptPath });
				transcriptUnreadable = true;
				continue;
			}
			readPath = resolved;
		}
		const content = await readRegularFileNoFollow(readPath);
		if (content === null) {
			logger.warn("[transcriptExport] Transcript present but unreadable — skipping", {
				transcriptPath: hit.transcriptPath,
				size: hit.size
			});
			transcriptUnreadable = true;
			if (hit.size > MAX_BUNDLE_FILE_BYTES) transcriptTooLarge = true;
			continue;
		}
		const transcriptBytes = new Uint8Array(content);
		zipData["transcript.jsonl"] = transcriptBytes;
		zipData[`${cliSessionId}.jsonl`] = transcriptBytes;
		transcriptFound = true;
		await addSessionSubdirToZip(hit.projectPath, cliSessionId, zipData, withinScanRoot);
		break;
	}
	if (!transcriptFound && !transcriptUnreadable && withinScanRoot) {
		const fallback = await bundleSessionScopedTranscripts(scanRoot, projectDirs, cliSessionId, zipData, withinScanRoot);
		transcriptFound = fallback.foundPrimary;
		transcriptUnreadable ||= fallback.newestUnreadable;
		transcriptTooLarge ||= fallback.newestTooLarge;
	}
	if (!transcriptFound) {
		logger.warn("[transcriptExport] No transcript found — failing export", {
			cliSessionId,
			projectsDir,
			projectDirCount: projectDirs.length,
			transcriptUnreadable,
			transcriptTooLarge
		});
		return {
			success: false,
			error: transcriptTooLarge ? "Transcript is too large to export." : transcriptUnreadable ? "Transcript couldn't be read. You can try again." : "Transcript not found for this session. You can try again."
		};
	}
	if (metadataFilePath) try {
		const metadataContent = await node_fs.default.promises.readFile(metadataFilePath, "utf-8");
		zipData["metadata.json"] = new TextEncoder().encode(metadataContent);
	} catch {
		logger.warn("[transcriptExport] Failed to read session metadata — omitting", { metadataFilePath });
	}
	const reservedNames = /* @__PURE__ */ new Set([
		"transcript.jsonl",
		`${cliSessionId}.jsonl`,
		"metadata.json"
	]);
	for (const [name, bytes] of Object.entries(extraFiles ?? {})) {
		if (reservedNames.has(name)) {
			logger.warn("[transcriptExport] Ignoring extraFiles entry with reserved name", { name });
			continue;
		}
		zipData[name] = new Uint8Array(scrubBufferForBundle(name, Buffer.from(bytes), SUPPORT_BUNDLE_SCRUB_OPTS));
	}
	try {
		await addDirectoryToZip(logsDir, "logs", zipData, EXCLUDED_LOG_ENTRIES, (name, buf) => scrubBufferForBundle(name, buf, SUPPORT_BUNDLE_SCRUB_OPTS));
	} catch (error) {
		logger.warn("[transcriptExport] Failed to include app logs — omitting", { error });
	}
	const compressed = require_esm.zipSync(zipData, { level: 6 });
	for (const entry of await node_fs.default.promises.readdir(downloadsDir).catch(() => [])) {
		if (!entry.startsWith(SESSION_EXPORT_PREFIX) || !entry.endsWith(".zip.tmp")) continue;
		const tmpPath = (0, node_path.join)(downloadsDir, entry);
		const tmpStat = await node_fs.default.promises.stat(tmpPath).catch(() => null);
		if (tmpStat && Date.now() - tmpStat.mtimeMs > STALE_EXPORT_TMP_AGE_MS) await node_fs.default.promises.rm(tmpPath).catch(() => void 0);
	}
	const outputPath = (0, node_path.join)(downloadsDir, `${SESSION_EXPORT_PREFIX}${Date.now()}.zip`);
	await writeFileAtomic(outputPath, compressed, 438);
	logger.info(`[transcriptExport] Session ${cliSessionId} exported to ${outputPath} (${compressed.length} bytes, ${Object.keys(zipData).length} files)`);
	return {
		success: true,
		filePath: outputPath
	};
}
/**
* Bundle the `{projectPath}/{cliSessionId}/` subdirectory (subagent
* transcripts, tool-results/, …) if it exists.
*
* In the session-scoped regime, pass `withinScanRoot` so the directory is
* re-verified against the pinned anchor immediately before the walk and the
* walk runs over the resolved realpath — without this, a project-hash entry
* swapped to a host-directory symlink after the transcript read would hand
* the whole walk to a host subtree (a far wider window than the single-file
* check-to-open residual). A component swap during the walk itself remains
* part of that documented residual class until an fd-relative walk exists.
*/
async function addSessionSubdirToZip(projectPath, cliSessionId, zipData, withinScanRoot) {
	const sessionDir = (0, node_path.join)(projectPath, cliSessionId);
	try {
		if (!(await node_fs.default.promises.lstat(sessionDir)).isDirectory()) return;
		let walkDir = sessionDir;
		if (withinScanRoot) {
			const resolved = await withinScanRoot(sessionDir);
			if (!resolved) {
				logger.warn("[transcriptExport] session subdir no longer resolves within the scan root — omitting it", { sessionDir });
				return;
			}
			walkDir = resolved;
		}
		await addDirectoryToZip(walkDir, cliSessionId, zipData);
	} catch {}
}
/**
* Stale-id rescue for session-scoped projects dirs (see
* {@link ExportTranscriptOptions.sessionScopedProjectsDir}): collect every
* top-level `*.jsonl` across project dirs, newest first. The newest readable
* one becomes `transcript.jsonl` (plus its own `{id}.jsonl` name and its
* subagent subdir); up to {@link MAX_FALLBACK_TRANSCRIPTS} older siblings
* ride along under their own names so the bundle stays complete even if the
* CLI didn't carry history forward across an id rotation.
*
* Returns `foundPrimary` true when a transcript made it into the zip.
*/
async function bundleSessionScopedTranscripts(scanRoot, projectDirs, cliSessionId, zipData, withinScanRoot) {
	const candidates = [];
	let collectionIncomplete = false;
	const isAbsence = (e) => {
		const code = e.code;
		return code === "ENOENT" || code === "ENOTDIR";
	};
	for (const projectHash of projectDirs) {
		const projectPath = (0, node_path.join)(scanRoot, projectHash);
		let stats;
		try {
			stats = await node_fs.default.promises.lstat(projectPath);
		} catch (error) {
			collectionIncomplete ||= !isAbsence(error);
			continue;
		}
		if (stats.isSymbolicLink() || !stats.isDirectory()) continue;
		if (!await withinScanRoot(projectPath)) {
			collectionIncomplete = true;
			continue;
		}
		let entries;
		try {
			entries = await node_fs.default.promises.readdir(projectPath);
		} catch (error) {
			collectionIncomplete ||= !isAbsence(error);
			continue;
		}
		for (const entry of entries) {
			if (!FALLBACK_TRANSCRIPT_NAME_RE.test(entry)) continue;
			const path = (0, node_path.join)(projectPath, entry);
			let st;
			try {
				st = await node_fs.default.promises.lstat(path);
			} catch (error) {
				collectionIncomplete ||= !isAbsence(error);
				continue;
			}
			if (!st.isFile()) continue;
			candidates.push({
				path,
				projectPath,
				name: entry,
				mtimeMs: st.mtimeMs,
				size: st.size
			});
		}
	}
	if (collectionIncomplete) {
		logger.warn("[transcriptExport] fallback collection was incomplete — failing instead of promoting a surviving sibling", { candidateCount: candidates.length });
		return {
			foundPrimary: false,
			newestUnreadable: true,
			newestTooLarge: false
		};
	}
	if (candidates.length === 0) return {
		foundPrimary: false,
		newestUnreadable: false,
		newestTooLarge: false
	};
	candidates.sort((a, b) => b.mtimeMs - a.mtimeMs || b.size - a.size);
	if (candidates.length > MAX_FALLBACK_TRANSCRIPTS) logger.warn("[transcriptExport] fallback found more transcripts than the bundle cap — bundling the newest ones", {
		found: candidates.length,
		cap: MAX_FALLBACK_TRANSCRIPTS
	});
	let foundPrimary = false;
	let bundledBytes = 0;
	for (const candidate of candidates.slice(0, MAX_FALLBACK_TRANSCRIPTS)) {
		if (candidate.name in zipData) continue;
		if (foundPrimary && bundledBytes + candidate.size > MAX_FALLBACK_BYTES) {
			logger.warn("[transcriptExport] fallback byte budget reached — skipping older siblings", {
				bundledBytes,
				skipped: candidate.name
			});
			break;
		}
		const resolved = await withinScanRoot(candidate.path);
		if (!resolved) {
			logger.warn("[transcriptExport] fallback candidate no longer resolves within the scan root — skipping", { name: candidate.name });
			if (!foundPrimary) return {
				foundPrimary: false,
				newestUnreadable: true,
				newestTooLarge: false
			};
			continue;
		}
		const content = await readRegularFileNoFollow(resolved);
		if (content === null) {
			if (!foundPrimary) return {
				foundPrimary: false,
				newestUnreadable: true,
				newestTooLarge: candidate.size > MAX_BUNDLE_FILE_BYTES
			};
			continue;
		}
		const bytes = new Uint8Array(content);
		zipData[candidate.name] = bytes;
		bundledBytes += bytes.length;
		if (!foundPrimary) {
			foundPrimary = true;
			zipData["transcript.jsonl"] = bytes;
			await addSessionSubdirToZip(candidate.projectPath, candidate.name.slice(0, -6), zipData, withinScanRoot);
		}
	}
	if (foundPrimary) logger.warn("[transcriptExport] tracked transcript missing — bundled session-scoped transcripts instead", {
		cliSessionId,
		candidateCount: candidates.length
	});
	return {
		foundPrimary,
		newestUnreadable: false,
		newestTooLarge: false
	};
}
/**
* Reject archive entry basenames that could misbehave when the export is
* extracted on another machine — path traversal ("zip slip") and the
* Linux-name vs Windows-extractor differentials. `readdir` yields single
* components, so `/` is unusual, but on the Linux VM guest a name may
* legally contain `\` (a separator to Windows extractors), `:` (NTFS
* alternate-data-stream / drive-relative syntax), a `..` component,
* control chars, a Win32 reserved device basename (CON, NUL, COM1…), or
* trailing dots/spaces (Win32 strips them, so such a name can silently
* overwrite a sibling entry on extraction).
*/
function isSafeZipEntryName(name) {
	if (name.length === 0 || /[. ]$/.test(name)) return false;
	if (name.includes("/") || name.includes("\\") || name.includes(":")) return false;
	if (/^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name)) return false;
	for (let i = 0; i < name.length; i++) if (name.charCodeAt(i) < 32) return false;
	return true;
}
/**
* Recursively adds all files from a directory to a zip data map.
* Symlinks are skipped (not followed) to prevent traversal attacks — the
* transcript dir is under user control and could contain malicious links.
*
* Exported because LocalAgentModeSessionManager.getTranscriptFiles() needs
* the same recursive walk for its feedback-zip path.
*/
async function addDirectoryToZip(dirPath, zipPrefix, zipData, exclude, transform) {
	const entries = await node_fs.default.promises.readdir(dirPath);
	for (const entry of entries) {
		if (exclude?.has(entry)) continue;
		if (!isSafeZipEntryName(entry)) {
			logger.warn("[transcriptExport] skipping entry with unsafe name", {
				dirPath,
				entry
			});
			continue;
		}
		const fullPath = (0, node_path.join)(dirPath, entry);
		const zipPath = `${zipPrefix}/${entry}`;
		try {
			const stats = await node_fs.default.promises.lstat(fullPath);
			if (stats.isSymbolicLink()) continue;
			if (stats.isDirectory()) await addDirectoryToZip(fullPath, zipPath, zipData, exclude, transform);
			else if (stats.isFile()) {
				const content = await readRegularFileNoFollow(fullPath);
				if (content !== null) zipData[zipPath] = new Uint8Array(transform ? transform(entry, content) : content);
			}
		} catch (error) {
			logger.warn("[transcriptExport] Skipping unreadable entry", {
				fullPath,
				error
			});
		}
	}
}
//#endregion
//#region src/main/heavyWork/heavyWorkWorker.ts
var handlers = {
	claudeJsonProjection: ({ file }) => readClaudeJsonProjection(file),
	codeStats: ({ claudeConfigDir }) => computeCodeStats(claudeConfigDir),
	dxtExtract: (params) => runDxtExtractTask(params),
	dxtPreview: (params) => runDxtPreviewTask(params),
	mcpbExtract: (params) => runMcpbExtractTask(params),
	transcriptExport: ({ scrubEnv, registryServerUuids, ...params }) => {
		setScrubEnvSource(() => scrubEnv);
		noteRegistryServerUuids(registryServerUuids);
		return exportSessionTranscript(params);
	},
	copyWorktreeFiles: ({ srcDir, destDir, files, skipExisting }, signal) => copyFiles(srcDir, destDir, files, {
		skipExisting,
		signal
	})
};
/** Live per-request abort controllers. Populated synchronously when a
* request arrives and removed when its handler settles, so a later `cancel`
* (main always posts the request first) either finds its controller or is a
* stale no-op. */
var inflightAborts = /* @__PURE__ */ new Map();
function postToParent(port, message) {
	try {
		port.postMessage(message);
	} catch {}
}
function isHeavyWorkRequest(data) {
	if (typeof data !== "object" || data === null) return false;
	const c = data;
	return typeof c.requestId === "number" && typeof c.task === "string" && c.task in handlers && typeof c.params === "object" && c.params !== null;
}
function isUtilityWorkerCancel(data) {
	if (typeof data !== "object" || data === null) return false;
	const c = data;
	return c.type === "cancel" && typeof c.requestId === "number";
}
async function handle(port, req, signal) {
	try {
		const result = await handlers[req.task](req.params, signal);
		postToParent(port, {
			type: "result",
			requestId: req.requestId,
			task: req.task,
			result
		});
	} catch (err) {
		postToParent(port, {
			type: "error",
			requestId: req.requestId,
			message: err instanceof Error ? err.message : String(err),
			stack: err instanceof Error ? err.stack : void 0,
			code: safeErrorCode(err)
		});
	}
}
/** Wire a port to the dispatch loop. Extracted from the `parentPort` hookup
* (and exported via `_test`) so cancel routing and the abort-map lifecycle
* are testable without a real utilityProcess parent. */
function attachPort(port) {
	port.on("message", (event) => {
		const data = event.data;
		if (isUtilityWorkerCancel(data)) {
			inflightAborts.get(data.requestId)?.abort();
			return;
		}
		if (!isHeavyWorkRequest(data)) return;
		if (!data.cancellable) {
			handle(port, data, void 0);
			return;
		}
		const abort = new AbortController();
		inflightAborts.set(data.requestId, abort);
		handle(port, data, abort.signal).finally(() => inflightAborts.delete(data.requestId));
	});
	port.start();
}
process.parentPort?.once("message", (e) => {
	const [port] = e.ports;
	attachPort(port);
});
process.on("SIGTERM", () => {
	const exit = () => process.exit(0);
	setTimeout(exit, 2e3);
	sweepInFlightWrites().then(exit, exit);
});
process.on("SIGINT", () => process.exit(0));
var _test = {
	handlers,
	isHeavyWorkRequest,
	attachPort,
	inflightAborts
};
//#endregion
exports._test = _test;
