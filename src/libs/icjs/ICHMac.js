var { ICAlgorithms } = require('./ICAlgorithms');
var { ICBuffer } = require('./ICBuffer');
var { ICUtils } = require('./ICUtils');

var _key = null;
var _md = null;
var _ipadding = null;
var _opadding = null;

var ICHMac = exports.ICHMac = function ICHMac() { }

ICHMac.prototype.start = function (md, key) {
  if (md !== null) {
    if (typeof md === 'string') {
      md = md.toUpperCase();
      if (md in ICAlgorithms.Digest) {
        _md = ICAlgorithms.Digest[md].create();
      } else {
        throw new Error('Unknown hash algorithm "' + md + '"');
      }
    } else {
      // store message digest
      _md = md;
    }
  }
  this.blockLength = _md.blockLength;
  this.digestLength = _md.digestLength;
  if (key === null) {
    // reuse previous key
    key = _key;
  } else {
    if (typeof key === 'string') {
      key = ICBuffer.createBuffer(key);
    } else if (ICUtils.isArray(key)) {
      key = ICBuffer.createBuffer(key);
    }

    // if key is longer than blocksize, hash it
    var keylen = key.length();
    if (keylen > _md.blockLength) {
      _md.update(key.bytes());
      key = _md.digest();
    }

    // mix key into inner and outer padding
    // ipadding = [0x36 * blocksize] ^ key
    // opadding = [0x5C * blocksize] ^ key
    _ipadding = ICBuffer.createBuffer();
    _opadding = ICBuffer.createBuffer();
    keylen = key.length();
    var i, tmp;
    for (i = 0; i < keylen; ++i) {
      tmp = key.at(i);
      _ipadding.putByte(0x36 ^ tmp);
      _opadding.putByte(0x5C ^ tmp);
    }

    // if key is shorter than blocksize, add additional padding
    if (keylen < _md.blockLength) {
      tmp = _md.blockLength - keylen;
      for (i = 0; i < tmp; ++i) {
        _ipadding.putByte(0x36);
        _opadding.putByte(0x5C);
      }
    }
    _key = key;
    _ipadding = _ipadding.bytes();
    _opadding = _opadding.bytes();
  }

  // digest is done like so: hash(opadding | hash(ipadding | message))

  // prepare to do inner hash
  // hash(ipadding | message)
  _md.reset();
  _md.update(_ipadding);
}

/**
 * Updates the HMAC with the given message bytes.
 *
 * @param bytes the bytes to update with.
 */
ICHMac.prototype.update = function (bytes) {
  _md.update(bytes);
};

/**
 * Produces the Message Authentication Code (MAC).
 *
 * @return a byte buffer containing the digest value.
 */
ICHMac.prototype.digest = function () {
  var inner = _md.digest().bytes();
  _md.reset();
  _md.update(_opadding);
  _md.update(inner);
  return _md.digest();
};

ICHMac.digest = function (md, key, bytes) {
  var rval = new ICHMac();
  rval.start(md, key);
  rval.update(bytes);
  return rval.digest();
};
