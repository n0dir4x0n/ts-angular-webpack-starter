var { ICGost89Cipher } = require('./ICGost89Cipher');
var { ICBuffer } = require('./ICBuffer');

var ICUzdst1106IIDigest = exports.ICUzdst1106IIDigest = function ICUzdst1106IIDigest() {
  this._len = 0;
  this._cipher = new ICGost89Cipher();
  this._left = 0;
  this._H = new Uint8Array(32);
  this._S = new Uint8Array(32);
  this._remainder = new Uint8Array(32);
  this.algorithm = "uzdst1106II";
  this.blockLength = 32;
  this.digestLength = 32;
}
var _arrayCopy = function (dest, destOff, src, srcOff, len) {
  for (var i = 0; i < len; i++)
    dest[destOff + i] = src[srcOff + i];
};
var _arrayXorCopy = function (dest, destOff, a, b, len) {
  for (var i = 0; i < len; i++)
    dest[destOff + i] = a[i] ^ b[i];
};
var _arrayFill = function (dest, destOff, val, len) {
  for (var i = 0; i < len; i++)
    dest[destOff + i] = val;
};
var _swapBytes = function (w, k) {
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 8; j++)
      k[i + 4 * j] = w[8 * i + j];
}
var _circleXor8 = function (w, k) {
  var buf = new Uint8Array(8);
  _arrayCopy(buf, 0, w, 0, 8);
  _arrayCopy(k, 0, w, 8, 24);
  _arrayXorCopy(k, 24, buf, k, 8);
};

var _transform3 = function (data) {
  var t16;
  t16 = (data[0] ^ data[2] ^ data[4] ^ data[6] ^ data[24] ^ data[30]) |
    ((data[1] ^ data[3] ^ data[5] ^ data[7] ^ data[25] ^ data[31]) << 8);

  _arrayCopy(data, 0, data, 2, 30);
  data[30] = t16 & 0xff;
  data[31] = t16 >>> 8;
};

var _addBlocks = function (n, left, right) {
  var sum = 0;
  var carry = 0;
  for (var i = 0; i < n; i++) {
    sum = left[i] + right[i] + carry;
    left[i] = sum & 0xff;
    carry = sum >>> 8;
  }

  return carry;
};

var _xorBlocks = function (ret, a, b) {
  _arrayXorCopy(ret, 0, a, b, a.length);
};
var _encrypt = function (key, input, output, offset) {
  this._cipher.setKey(key);
  this._cipher.encryptBlock(input.subarray(offset, offset + 8), output.subarray(offset, offset + 8));
}
var _compress = function (H, M) {
  var U = new Uint8Array(32);
  var W = new Uint8Array(32);
  var V = new Uint8Array(32);
  var T = new Uint8Array(32);
  var Key = new Uint8Array(32);

  var i;
  /* Compute first key */
  _xorBlocks(W, H, M);
  _swapBytes(W, Key);
  /* Encrypt first 8 bytes of H with first key*/
  _encrypt.call(this, Key, H, T, 0);
  /* Compute second key*/
  _circleXor8(H, U);
  _circleXor8(M, V);
  _circleXor8(V, V);
  _xorBlocks(W, U, V);
  _swapBytes(W, Key);
  /* encrypt second 8 bytes of H with second key*/
  _encrypt.call(this, Key, H, T, 8);
  /* compute third key */
  _circleXor8(U, U);
  U[31] = ~U[31]; U[29] = ~U[29]; U[28] = ~U[28]; U[24] = ~U[24];
  U[23] = ~U[23]; U[20] = ~U[20]; U[18] = ~U[18]; U[17] = ~U[17];
  U[14] = ~U[14]; U[12] = ~U[12]; U[10] = ~U[10]; U[8] = ~U[8];
  U[7] = ~U[7]; U[5] = ~U[5]; U[3] = ~U[3]; U[1] = ~U[1];
  _circleXor8(V, V);
  _circleXor8(V, V);
  _xorBlocks(W, U, V);
  _swapBytes(W, Key);
  /* encrypt third 8 bytes of H with third key*/
  _encrypt.call(this, Key, H, T, 16);
  /* Compute fourth key */
  _circleXor8(U, U);
  _circleXor8(V, V);
  _circleXor8(V, V);
  _xorBlocks(W, U, V);
  _swapBytes(W, Key);
  /* Encrypt last 8 bytes with fourth key */
  _encrypt.call(this, Key, H, T, 24);
  for (i = 0; i < 12; i++) {
    _transform3(T);
  }

  _xorBlocks(T, T, M);
  _transform3(T);
  _xorBlocks(T, T, H);

  for (i = 0; i < 61; i++) {
    _transform3(T);
  }

  _arrayCopy(H, 0, T, 0, 32);
};

ICUzdst1106IIDigest.prototype.reset = function () {
  this._len = 0;
  this._cipher.reset();
  this._left = 0;
  for (var i = 0; i < 32; i++) {
    this._H[i] = 0;
    this._S[i] = 0;
    this._remainder[i] = 0;
  }
};

ICUzdst1106IIDigest.prototype.update = function (input) {
  if (typeof input === 'string') {
    input = ICBuffer.fromUtf8(input);
  }
  input = new Uint8Array(input);
  var length = input.length;
  var cur = 0;
  if (this._left) {
    var addBytes = 32 - this._left;
    if (addBytes > length)
      addBytes = length;
    _arrayCopy(this._remainder, this._left, input, 0, addBytes);
    this._left += addBytes;
    if (this._left < 32) {
      return;
    }
    cur = addBytes;
    _compress.call(this, this._H, this._remainder);
    _addBlocks(32, this._S, this._remainder);
    this._len += 32;
    this._left = 0;
  }
  while (cur <= length - 32) {
    _compress.call(this, this._H, input.subarray(cur, cur + 32));
    _addBlocks(32, this._S, input.subarray(cur, cur + 32));
    this._len += 32;
    cur += 32;
  }
  if (cur != length) {
    this._left = length - cur;
    _arrayCopy(this._remainder, 0, input, cur, this._left);
  }
};

ICUzdst1106IIDigest.prototype.digest = function (result) {
  var hash = result;
  if (!hash) {
    hash = ICBuffer.createBuffer(32);
  }
  var h = new Uint8Array(32);
  var buf = new Uint8Array(32);
  var s = new Uint8Array(32);
  var fin_len = this._len;
  _arrayCopy(h, 0, this._H, 0, 32);
  _arrayCopy(s, 0, this._S, 0, 32);
  if (this._left) {
    _arrayCopy(buf, 0, this._remainder, 0, this._left);
    _compress.call(this, h, buf);
    _addBlocks(32, s, buf);
    fin_len += this._left;
  }
  _arrayFill(buf, 0, 0, 32);
  fin_len <<= 3; /* Hash length in BITS!!*/
  var i = 0;
  while (fin_len > 0) {
    buf[i++] = fin_len & 0xff;
    fin_len >>>= 8;
  }
  _compress.call(this, h, buf);
  _compress.call(this, h, s);
  _arrayCopy(hash.data, 0, h, 0, 32);
  if (!result)
    return hash;
};

ICUzdst1106IIDigest.digest = function (input) {
  var d = new ICUzdst1106IIDigest();
  d.update(input);
  return d.digest();
}

module.exports.digest = ICUzdst1106IIDigest.digest;



