var { ICBuffer } = require('./ICBuffer');
var { ICHMac } = require('./ICHMac');

var ICPkcs5 = exports.ICPkcs5 = function ICPkcs5() { };

ICPkcs5.pbkdf2 = function (md, key, salt, iterations, length) {
  var rval = new ICBuffer();
  key = ICBuffer.createBuffer(key);
  salt = ICBuffer.createBuffer(salt);

  var hmac = new ICHMac();
  hmac.start(md, key);

  var block_count = Math.ceil(length / hmac.digestLength);
  var tail = length - (block_count - 1) * hmac.digestLength;
  var u, ui, i, j, k;
  for (i = 1; i <= block_count; i++) {
    hmac.update(salt.copy().putInt32(i).bytes());
    u = ui = hmac.digest();

    for (j = 1; j < iterations; j++) {
      hmac.start(md, key);
      hmac.update(u.bytes());
      u = hmac.digest();

      for (k = 0; k < u.length(); k++) {
        ui.data[k] ^= u.data[k];
      }
    }

    var len = (i == block_count ? tail : hmac.digestLength);
    rval.putBytes(ui.bytes(len));
    if (i < block_count)
      hmac.start(md, key);
  }

  return rval;
};
