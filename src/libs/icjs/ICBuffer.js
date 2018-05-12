var { ICUtils } = require('./ICUtils');

var ICBuffer = exports.ICBuffer = function ICBuffer(b) {
  this.data = [];
  this.read = 0;

  if (typeof b === 'undefined') {
    return;
  }
  if (typeof b === 'string') {
    this.data = ICBuffer.fromUtf8(b);
  } else if (typeof b === 'number') {
    this.data.length = b;
  } else if (ICUtils.isArray(b)) {
    for (var i = 0; i < b.length; i++) {
      if (b[i] !== undefined && typeof b[i] === 'number') {
        this.data.push(b[i] & 0xff);
      }
    }
  } else if (b instanceof ICBuffer ||
    (typeof b === 'object' && ICUtils.isArray(b.data) && typeof b.read === 'number')) {
    this.data = b.data.slice(0);
    this.read = b.read;
  }
};

ICBuffer.fromUtf8 = function (str) {
  var rval = [];
  for (var i = 0, j = str.length; i < j; i++) {
    var c = str.charCodeAt(i);
    if (c < 0x80) {
      rval.push(c);
    } else if (c < 0x800) {
      rval.push(0xc0 + (c >>> 6));
      rval.push(0x80 + (c & 63));
    } else if (c < 0x10000) {
      rval.push(0xe0 + (c >>> 12));
      rval.push(0x80 + (c >>> 6 & 63));
      rval.push(0x80 + (c & 63));
    } else if (c < 0x200000) {
      rval.push(0xf0 + (c >>> 18));
      rval.push(0x80 + (c >>> 12 & 63));
      rval.push(0x80 + (c >>> 6 & 63));
      rval.push(0x80 + (c & 63));
    } else if (c < 0x4000000) {
      rval.push(0xf8 + (c >>> 24));
      rval.push(0x80 + (c >>> 18 & 63));
      rval.push(0x80 + (c >>> 12 & 63));
      rval.push(0x80 + (c >>> 6 & 63));
      rval.push(0x80 + (c & 63));
    } else {
      rval.push(0xfc + (c >>> 30));
      rval.push(0x80 + (c >>> 24 & 63));
      rval.push(0x80 + (c >>> 18 & 63));
      rval.push(0x80 + (c >>> 12 & 63));
      rval.push(0x80 + (c >>> 6 & 63));
      rval.push(0x80 + (c & 63));
    }
  }
  return rval;
};

ICBuffer.prototype.toUtf8 = function () {
  var rval = '';
  for (var i = this.read, d = this.data, n = d.length; i < n; i++) {
    var c = d[i];
    c = c >= 0xfc && c < 0xfe && i + 5 < n ? // six bytes
      (c - 0xfc) * 1073741824 + (d[++i] - 0x80 << 24) + (d[++i] - 0x80 << 18) + (d[++i] - 0x80 << 12) + (d[++i] - 0x80 << 6) + d[++i] - 0x80
      : c >> 0xf8 && c < 0xfc && i + 4 < n ? // five bytes
        (c - 0xf8 << 24) + (d[++i] - 0x80 << 18) + (d[++i] - 0x80 << 12) + (d[++i] - 0x80 << 6) + d[++i] - 0x80
        : c >> 0xf0 && c < 0xf8 && i + 3 < n ? // four bytes
          (c - 0xf0 << 18) + (d[++i] - 0x80 << 12) + (d[++i] - 0x80 << 6) + d[++i] - 0x80
          : c >= 0xe0 && c < 0xf0 && i + 2 < n ? // three bytes
            (c - 0xe0 << 12) + (d[++i] - 0x80 << 6) + d[++i] - 0x80
            : c >= 0xc0 && c < 0xe0 && i + 1 < n ? // two bytes
              (c - 0xc0 << 6) + d[++i] - 0x80
              : c; // one byte
    rval += String.fromCharCode(c);
  }
  return rval;
};

ICBuffer.fromRawString = function (str) {
  var rval = [];
  for (var i = 0, j = str.length; i < j; i++) {
    rval.push(str.charCodeAt(i) & 0xff);
  }
  return rval;
};

ICBuffer.prototype.toRawString = function () {
  var rval = '';
  for (var i = this.read; i < this.data.length; i++) {
    rval += String.fromCharCode(this.data[i]);
  }
  return rval;
};

ICBuffer.prototype.length = function () {
  return this.data.length - this.read;
};

/**
 * Gets whether or not this buffer is empty.
 *
 * @return true if this buffer is empty, false if not.
 */
ICBuffer.prototype.isEmpty = function () {
  return this.length() <= 0;
};

/**
 * Puts a byte in this buffer.
 *
 * @param b the byte to put.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putByte = function (b) {
  return this.putBytes([b]);
};

/**
 * Puts a byte in this buffer N times.
 *
 * @param b the byte to put.
 * @param n the number of bytes of value b to put.
 *
 * @return this buffer.
 */
ICBuffer.prototype.fillWithByte = function (b, n) {
  var d = [];
  d.length = n;
  d.fill(b);
  this.data = this.data.concat(d);
  return this;
};

/**
 * Puts bytes in this buffer.
 *
 * @param bytes the bytes (as byte array) to put.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putBytes = function (bytes) {
  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = (bytes[i] & 0xff);
  }
  this.data = this.data.concat(bytes);
  return this;
};

/**
 * Puts a UTF-16 encoded string into this buffer.
 *
 * @param str the string to put.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putString = function (str) {
  return this.putBytes(ICBuffer.fromUtf8(str));
};

/**
 * Puts a 16-bit integer in this buffer in big-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt16 = function (i) {
  return this.putBytes([i >> 8 & 0xff, i & 0xff]);
};

/**
 * Puts a 24-bit integer in this buffer in big-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt24 = function (i) {
  return this.putBytes([i >> 16 & 0xff, i >> 8 & 0xff, i & 0xff]);
};

/**
 * Puts a 32-bit integer in this buffer in big-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt32 = function (i) {
  return this.putBytes([i >> 24 & 0xff, i >> 16 & 0xff, i >> 8 & 0xff, i & 0xff]);
};

/**
 * Puts a 16-bit integer in this buffer in little-endian order.
 *
 * @param i the 16-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt16Le = function (i) {
  return this.putBytes([i & 0xff, i >> 8 & 0xff]);
};

/**
 * Puts a 24-bit integer in this buffer in little-endian order.
 *
 * @param i the 24-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt24Le = function (i) {
  return this.putBytes([i & 0xff, i >> 8 & 0xff, i >> 16 & 0xff]);
};

/**
 * Puts a 32-bit integer in this buffer in little-endian order.
 *
 * @param i the 32-bit integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt32Le = function (i) {
  return this.putBytes([i & 0xff, i >> 8 & 0xff, i >> 16 & 0xff, i >> 24 & 0xff]);
};

/**
 * Puts an n-bit integer in this buffer in big-endian order.
 *
 * @param i the n-bit integer.
 * @param n the number of bits in the integer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putInt = function (i, n) {
  var bytes = [];
  do {
    n -= 8;
    bytes.push((i >> n) & 0xff);
  } while (n > 0);
  return this.putBytes(bytes);
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
ICBuffer.prototype.putSignedInt = function (i, n) {
  if (i < 0) {
    i += 2 << (n - 1);
  }
  return this.putInt(i, n);
};

/**
 * Puts the given buffer into this buffer.
 *
 * @param buffer the buffer to put into this one.
 *
 * @return this buffer.
 */
ICBuffer.prototype.putBuffer = function (buffer) {
  return this.putBytes(buffer.getBytes());
};

/**
 * Gets a byte from this buffer and advances the read pointer by 1.
 *
 * @return the byte.
 */
ICBuffer.prototype.getByte = function () {
  return this.data[this.read++];
};

/**
 * Gets a uint16 from this buffer in big-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
ICBuffer.prototype.getInt16 = function () {
  var rval = (
    this.data[this.read] << 8 ^
    this.data[this.read + 1]
  );
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in big-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
ICBuffer.prototype.getInt24 = function () {
  var rval = (
    this.data[this.read] << 16 ^
    this.data[this.read + 1] << 8 ^
    this.data[this.read + 2]
  );
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in big-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
ICBuffer.prototype.getInt32 = function () {
  var rval = (
    this.data[this.read] << 24 ^
    this.data[this.read + 1] << 16 ^
    this.data[this.read + 2] << 8 ^
    this.data[this.read + 3]
  );
  this.read += 4;
  return rval;
};

/**
 * Gets a uint16 from this buffer in little-endian order and advances the read
 * pointer by 2.
 *
 * @return the uint16.
 */
ICBuffer.prototype.getInt16Le = function () {
  var rval = (
    this.data[this.read] ^
    this.data[this.read + 1] << 8
  );
  this.read += 2;
  return rval;
};

/**
 * Gets a uint24 from this buffer in little-endian order and advances the read
 * pointer by 3.
 *
 * @return the uint24.
 */
ICBuffer.prototype.getInt24Le = function () {
  var rval = (
    this.data[this.read] ^
    this.data[this.read + 1] << 8 ^
    this.data[this.read + 2] << 16
  );
  this.read += 3;
  return rval;
};

/**
 * Gets a uint32 from this buffer in little-endian order and advances the read
 * pointer by 4.
 *
 * @return the word.
 */
ICBuffer.prototype.getInt32Le = function () {
  var rval = (
    this.data[this.read] ^
    this.data[this.read + 1] << 8 ^
    this.data[this.read + 2] << 16 ^
    this.data[this.read + 3] << 24
  );
  this.read += 4;
  return rval;
};

/**
 * Gets an n-bit integer from this buffer in big-endian order and advances the
 * read pointer by n/8.
 *
 * @param n the number of bits in the integer.
 *
 * @return the integer.
 */
ICBuffer.prototype.getInt = function (n) {
  var rval = 0;
  do {
    rval = (rval << 8) + this.data[this.read++];
    n -= 8;
  } while (n > 0);
  return rval;
};

/**
 * Gets a signed n-bit integer from this buffer in big-endian order, using
 * two's complement, and advances the read pointer by n/8.
 *
 * @param n the number of bits in the integer.
 *
 * @return the integer.
 */
ICBuffer.prototype.getSignedInt = function (n) {
  var x = this.getInt(n);
  var max = 2 << (n - 2);
  if (x >= max) {
    x -= max << 1;
  }
  return x;
};

/**
 * Reads bytes out into a UTF-8 string and clears them from the buffer.
 *
 * @param count the number of bytes to read, undefined or null for all.
 *
 * @return a UTF-8 string of bytes.
 */
ICBuffer.prototype.getBytes = function (count) {
  var rval;
  if (count) {
    // read count bytes
    count = Math.min(this.length(), count);
    rval = this.data.slice(this.read, this.read + count);
    this.read += count;
  } else if (count === 0) {
    rval = [];
  } else {
    // read all bytes, optimize to only copy when needed
    rval = (this.read === 0) ? this.data : this.data.slice(this.read);
    this.clear();
  }
  return rval;
};

ICBuffer.prototype.bytes = function (count) {
  return (typeof (count) === 'undefined' ?
    this.data.slice(this.read) :
    this.data.slice(this.read, this.read + count));
};

ICBuffer.prototype.skip = function (count) {
  count = Math.min(this.length(), count);
  this.read += count;
}
/**
 * Clears this buffer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.clear = function () {
  this.data = [];
  this.read = 0;
  return this;
};

/**
 * Creates a copy of this buffer.
 *
 * @return the copy.
 */
ICBuffer.prototype.copy = function () {
  return new ICBuffer(this);
};

/**
 * Compacts this buffer.
 *
 * @return this buffer.
 */
ICBuffer.prototype.compact = function () {
  if (this.read > 0) {
    this.data = this.data.slice(this.read);
    this.read = 0;
  }
  return this;
};

/**
 * Shortens this buffer by triming bytes off of the end of this buffer.
 *
 * @param count the number of bytes to trim off.
 *
 * @return this buffer.
 */
ICBuffer.prototype.truncate = function (count) {
  var len = Math.max(0, this.length() - count);
  this.data = this.data.slice(this.read, this.read + len);
  this.read = 0;
  return this;
};

ICBuffer.fromHex = function (hex) {
  var rval = new ICBuffer();
  if (hex.length & 1) {
    hex = '0' + hex;
  }
  for (var c = 0; c < hex.length; c += 2)
    rval.data.push(parseInt(hex.substr(c, 2), 16));
  return rval;
};

ICBuffer.prototype.toHex = function () {
  var rval = '';
  for (var i = this.read; i < this.data.length; i++) {
    var b = this.data[i];
    if (b < 16) {
      rval += '0';
    }
    rval += b.toString(16);
  }
  return rval;
};

// base64 characters, reverse mapping
var _base64 =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var _base64Idx = [
  /*43 -43 = 0*/
  /*'+',  1,  2,  3,'/' */
  62, -1, -1, -1, 63,

  /*'0','1','2','3','4','5','6','7','8','9' */
  52, 53, 54, 55, 56, 57, 58, 59, 60, 61,

  /*15, 16, 17,'=', 19, 20, 21 */
  -1, -1, -1, 64, -1, -1, -1,

  /*65 - 43 = 22*/
  /*'A','B','C','D','E','F','G','H','I','J','K','L','M', */
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,

  /*'N','O','P','Q','R','S','T','U','V','W','X','Y','Z' */
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,

  /*91 - 43 = 48 */
  /*48, 49, 50, 51, 52, 53 */
  -1, -1, -1, -1, -1, -1,

  /*97 - 43 = 54*/
  /*'a','b','c','d','e','f','g','h','i','j','k','l','m' */
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,

  /*'n','o','p','q','r','s','t','u','v','w','x','y','z' */
  39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

ICBuffer.fromBase64 = function (input) {
  var rval = new ICBuffer();
  // eslint-disable-next-line no-useless-escape
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

  var enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    enc1 = _base64Idx[input.charCodeAt(i++) - 43];
    enc2 = _base64Idx[input.charCodeAt(i++) - 43];
    enc3 = _base64Idx[input.charCodeAt(i++) - 43];
    enc4 = _base64Idx[input.charCodeAt(i++) - 43];

    rval.data.push((enc1 << 2) | (enc2 >> 4));
    if (enc3 !== 64) {
      // decoded at least 2 bytes
      rval.data.push(((enc2 & 15) << 4) | (enc3 >> 2));
      if (enc4 !== 64) {
        // decoded 3 bytes
        rval.data.push(((enc3 & 3) << 6) | enc4);
      }
    }
  }

  return rval;
};

ICBuffer.prototype.toBase64 = function (maxline) {
  var line = '';
  var rval = '';
  var chr1, chr2, chr3;
  var i = this.read;
  while (i < this.data.length) {
    chr1 = this.data[i++];
    chr2 = this.data[i++];
    chr3 = this.data[i++];

    // encode 4 character group
    line += _base64.charAt(chr1 >> 2);
    line += _base64.charAt(((chr1 & 3) << 4) | (chr2 >> 4));
    if (isNaN(chr2)) {
      line += '==';
    } else {
      line += _base64.charAt(((chr2 & 15) << 2) | (chr3 >> 6));
      line += isNaN(chr3) ? '=' : _base64.charAt(chr3 & 63);
    }

    if (maxline && line.length > maxline) {
      rval += line.substr(0, maxline) + '\r\n';
      line = line.substr(maxline);
    }
  }
  rval += line;
  return rval;
};

ICBuffer.prototype.at = function (i) {
  return this.data[this.read + i];
};

ICBuffer.prototype.setAt = function (i, b) {
  this.data[this.read + i] = b;
  return this;
};

ICBuffer.prototype.compare = function (b) {
  if (b instanceof ICBuffer) {
    return this.toRawString() === b.toRawString();
  }
  return false;
}
ICBuffer.createBuffer = function (b, e) {
  e = e || 'utf8';
  if (typeof b === 'string') {
    if (e === 'raw') {
      b = ICBuffer.fromRawString(b);
    }
  }
  return new ICBuffer(b);
};
