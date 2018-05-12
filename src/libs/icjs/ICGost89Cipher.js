var { ICBuffer } = require('./ICBuffer');

var D_A = new Uint8Array([
  0x1, 0x3, 0xa, 0x9, 0x5, 0xb, 0x4, 0xf, 0x8, 0x6, 0x7, 0xe, 0xd, 0x0, 0x2, 0xc,
  0xd, 0xe, 0x4, 0x1, 0x7, 0x0, 0x5, 0xa, 0x3, 0xc, 0x8, 0xf, 0x6, 0x2, 0x9, 0xb,
  0x7, 0x6, 0x2, 0x4, 0xd, 0x9, 0xf, 0x0, 0xa, 0x1, 0x5, 0xb, 0x8, 0xe, 0xc, 0x3,
  0x7, 0x6, 0x4, 0xb, 0x9, 0xc, 0x2, 0xa, 0x1, 0x8, 0x0, 0xe, 0xf, 0xd, 0x3, 0x5,
  0x4, 0xa, 0x7, 0xc, 0x0, 0xf, 0x2, 0x8, 0xe, 0x1, 0x6, 0x5, 0xd, 0xb, 0x9, 0x3,
  0x7, 0xf, 0xc, 0xe, 0x9, 0x4, 0x1, 0x0, 0x3, 0xb, 0x5, 0x2, 0x6, 0xa, 0x8, 0xd,
  0x5, 0xf, 0x4, 0x0, 0x2, 0xd, 0xb, 0x9, 0x1, 0x7, 0x6, 0x3, 0xc, 0xe, 0xa, 0x8,
  0xa, 0x4, 0x5, 0x6, 0x8, 0x1, 0x3, 0x7, 0xd, 0xc, 0xe, 0x0, 0x9, 0x2, 0xb, 0xf,
]);
var k = new Uint32Array(8);
var s0 = new Uint32Array(256);
var s1 = new Uint32Array(256);
var s2 = new Uint32Array(256);
var s3 = new Uint32Array(256);

var ICGost89Cipher = exports.ICGost89Cipher = function ICGost89Cipher(sbox) {
  if (!sbox) {
    sbox = D_A;
  }
  for (var i = 0; i < 256; i++) {
    var hi = i >>> 4;
    var lo = i & 15;
    s3[i] = (sbox[hi] << 4 | sbox[16 + lo]) << 24;
    s2[i] = (sbox[32 + hi] << 4 | sbox[48 + lo]) << 16;
    s1[i] = (sbox[64 + hi] << 4 | sbox[80 + lo]) << 8;
    s0[i] = (sbox[96 + hi] << 4 | sbox[112 + lo]);
  }
}
function _f(x) {
  x = s3[x >>> 24 & 0xff] | s2[x >>> 16 & 0xff] | s1[x >>> 8 & 0xff] | s0[x & 0xff];
  return ((x << 11) | (x >>> 21)) & 0xffffffff;
}

ICGost89Cipher.prototype.reset = function () {
};

ICGost89Cipher.prototype.setKey = function (key) {
  var i, j;
  for (i = 0, j = 0; i < 8; i++ , j += 4) {
    k[i] = key[j] | (key[j + 1] << 8) | (key[j + 2] << 16) | (key[j + 3] << 24);
  }
};

ICGost89Cipher.prototype.encryptBlock = function (input, output) {
  var n = new Uint32Array(2);
  n[0] = input[0] | (input[1] << 8) | (input[2] << 16) | (input[3] << 24);
  n[1] = input[4] | (input[5] << 8) | (input[6] << 16) | (input[7] << 24);

  n[1] ^= _f(n[0] + k[0]); n[0] ^= _f(n[1] + k[1]);
  n[1] ^= _f(n[0] + k[2]); n[0] ^= _f(n[1] + k[3]);
  n[1] ^= _f(n[0] + k[4]); n[0] ^= _f(n[1] + k[5]);
  n[1] ^= _f(n[0] + k[6]); n[0] ^= _f(n[1] + k[7]);

  n[1] ^= _f(n[0] + k[0]); n[0] ^= _f(n[1] + k[1]);
  n[1] ^= _f(n[0] + k[2]); n[0] ^= _f(n[1] + k[3]);
  n[1] ^= _f(n[0] + k[4]); n[0] ^= _f(n[1] + k[5]);
  n[1] ^= _f(n[0] + k[6]); n[0] ^= _f(n[1] + k[7]);

  n[1] ^= _f(n[0] + k[0]); n[0] ^= _f(n[1] + k[1]);
  n[1] ^= _f(n[0] + k[2]); n[0] ^= _f(n[1] + k[3]);
  n[1] ^= _f(n[0] + k[4]); n[0] ^= _f(n[1] + k[5]);
  n[1] ^= _f(n[0] + k[6]); n[0] ^= _f(n[1] + k[7]);

  n[1] ^= _f(n[0] + k[7]); n[0] ^= _f(n[1] + k[6]);
  n[1] ^= _f(n[0] + k[5]); n[0] ^= _f(n[1] + k[4]);
  n[1] ^= _f(n[0] + k[3]); n[0] ^= _f(n[1] + k[2]);
  n[1] ^= _f(n[0] + k[1]); n[0] ^= _f(n[1] + k[0]);

  output[0] = n[1] & 0xff;
  output[1] = (n[1] >>> 8) & 0xff;
  output[2] = (n[1] >>> 16) & 0xff;
  output[3] = n[1] >>> 24;
  output[4] = n[0] & 0xff;
  output[5] = (n[0] >>> 8) & 0xff;
  output[6] = (n[0] >>> 16) & 0xff;
  output[7] = n[0] >>> 24;
};

ICGost89Cipher.prototype.decryptBlock = function (input, output) {
  var n = new Uint32Array(2);
  n[0] = input[0] | (input[1] << 8) | (input[2] << 16) | (input[3] << 24);
  n[1] = input[4] | (input[5] << 8) | (input[6] << 16) | (input[7] << 24);

  n[1] ^= _f(n[0] + k[0]); n[0] ^= _f(n[1] + k[1]);
  n[1] ^= _f(n[0] + k[2]); n[0] ^= _f(n[1] + k[3]);
  n[1] ^= _f(n[0] + k[4]); n[0] ^= _f(n[1] + k[5]);
  n[1] ^= _f(n[0] + k[6]); n[0] ^= _f(n[1] + k[7]);

  n[1] ^= _f(n[0] + k[7]); n[0] ^= _f(n[1] + k[6]);
  n[1] ^= _f(n[0] + k[5]); n[0] ^= _f(n[1] + k[4]);
  n[1] ^= _f(n[0] + k[3]); n[0] ^= _f(n[1] + k[2]);
  n[1] ^= _f(n[0] + k[1]); n[0] ^= _f(n[1] + k[0]);

  n[1] ^= _f(n[0] + k[7]); n[0] ^= _f(n[1] + k[6]);
  n[1] ^= _f(n[0] + k[5]); n[0] ^= _f(n[1] + k[4]);
  n[1] ^= _f(n[0] + k[3]); n[0] ^= _f(n[1] + k[2]);
  n[1] ^= _f(n[0] + k[1]); n[0] ^= _f(n[1] + k[0]);

  n[1] ^= _f(n[0] + k[7]); n[0] ^= _f(n[1] + k[6]);
  n[1] ^= _f(n[0] + k[5]); n[0] ^= _f(n[1] + k[4]);
  n[1] ^= _f(n[0] + k[3]); n[0] ^= _f(n[1] + k[2]);
  n[1] ^= _f(n[0] + k[1]); n[0] ^= _f(n[1] + k[0]);

  output[0] = n[1] & 0xff;
  output[1] = (n[1] >>> 8) & 0xff;
  output[2] = (n[1] >>> 16) & 0xff;
  output[3] = n[1] >>> 24;
  output[4] = n[0] & 0xff;
  output[5] = (n[0] >>> 8) & 0xff;
  output[6] = (n[0] >>> 16) & 0xff;
  output[7] = n[0] >>> 24;
};

ICGost89Cipher.cfbe = function (key, input, iv) {
  var cipher = new ICGost89Cipher();
  var cur_iv = iv.slice(0);
  var blocks = ((input.length() + 7) >>> 3) - 1;
  var tail = input.length() - blocks * 8;
  var gamma = [0, 0, 0, 0, 0, 0, 0, 0];
  var output = ICBuffer.createBuffer();
  cipher.setKey(key);
  var inblock, j;
  for (var i = 0; i < blocks; i++) {
    cipher.encryptBlock(cur_iv, gamma);
    inblock = input.getBytes(8);
    for (j = 0; j < 8; j++) {
      output.putByte(cur_iv[j] = inblock[j] ^ gamma[j]);
    }
  }
  if (tail > 0) {
    cipher.encryptBlock(cur_iv, gamma);
    inblock = input.getBytes(tail);
    for (j = 0; j < tail; j++) {
      output.putByte(cur_iv[j] = inblock[j] ^ gamma[j]);
    }
  }
  return output;
}

ICGost89Cipher.cfbd = function (key, input, iv) {
  var cipher = new ICGost89Cipher();
  var cur_iv = iv.slice(0);
  var blocks = ((input.length() + 7) >>> 3) - 1;
  var tail = input.length() - blocks * 8;
  var gamma = [0, 0, 0, 0, 0, 0, 0, 0];
  var output = ICBuffer.createBuffer();
  cipher.setKey(key);
  for (var i = 0; i < blocks; i++) {
    cipher.encryptBlock(cur_iv, gamma);
    var inblock = input.getBytes(8);
    for (var j = 0; j < 8; j++) {
      output.putByte((cur_iv[j] = inblock[j]) ^ gamma[j]);
    }
  }
  if (tail > 0) {
    cipher.encryptBlock(cur_iv, gamma);
    inblock = input.getBytes(tail);
    for (j = 0; j < tail; j++) {
      output.putByte((cur_iv[j] = inblock[j]) ^ gamma[j]);
    }
  }
  return output;
}
