var { ICUzdst1106IIDigest } = require('./ICUzdst1106IIDigest');

var ICAlgorithms = exports.ICAlgorithms = {};

ICAlgorithms.Digest = {};
ICAlgorithms.Digest.SHA1 = {};

ICAlgorithms.Digest.UZDST1106II = {};

ICAlgorithms.Digest.UZDST1106II.create = function () {
  return new ICUzdst1106IIDigest();
};
