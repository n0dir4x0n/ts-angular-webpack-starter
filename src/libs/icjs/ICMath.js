var { BigInteger } = require('jsbn');

var ICMath = exports.ICMath = function ICMath() { };

ICMath.multiply = function (x, y, R) {
  return x.multiply(R).add(BigInteger.ONE).multiply(y).add(x);
};

ICMath.modMultiply = function (x, y, R, p) {
  return ICMath.multiply(x, y, R).mod(p);
};

ICMath.modPow = function (x, y, R, p) {
  return x.multiply(R).add(BigInteger.ONE).modPow(y, p).subtract(BigInteger.ONE).multiply(R.modInverse(p)).mod(p);
};

ICMath.modPow2 = function (x, y) {
  return x.multiply(y);
}

ICMath.modInverse = function (x, R, p) {
  return x.multiply(R).add(BigInteger.ONE).mod(p).modInverse(p).multiply(p.subtract(x)).mod(p);
};
