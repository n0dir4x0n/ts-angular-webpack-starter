var { ICRandom } = require('./ICRandom');
var { ICGost89Cipher } = require('./ICGost89Cipher');
var { ICBuffer } = require('./ICBuffer');
var { ICHMac } = require('./ICHMac');

exports.ICCipher = class ICCipher {
  static encrypt(dh, data) {
    var iv = ICRandom.generate(8);
    var enc = ICGost89Cipher.cfbe(dh.bytes(), ICBuffer.createBuffer(data), iv.bytes());
    var dig = ICHMac.digest("UZDST1106II", iv, enc.bytes());
    iv.putBuffer(enc);
    iv.putBuffer(dig);
    return iv.toRawString();
  }

  static decrypt(dh, rawString) {
    var buffer = ICBuffer.createBuffer(ICBuffer.fromRawString(rawString));
    if (buffer.length() < 41) {
      throw new Error('Invalid input data!');
    }
    var iv = buffer.getBytes(8);
    var enc = buffer.getBytes(buffer.length() - 32);
    var dig = ICBuffer.createBuffer(buffer.getBytes());
    var dig1 = ICHMac.digest("UZDST1106II", ICBuffer.createBuffer(iv), enc);
    if (dig.toHex() !== dig1.toHex()) {
      throw new Error('Invalid checksum!');
    }
    return ICGost89Cipher.cfbd(dh.bytes(), ICBuffer.createBuffer(enc), iv).toUtf8();
  }
};
