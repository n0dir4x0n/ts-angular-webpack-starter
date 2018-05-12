var { BigInteger } = require('jsbn');
var { ICBuffer } = require('../ICBuffer');

const d =  new BigInteger('2b49ff78bf90389458483e00984d5866270614655532ad6b3542dd75637c18c1', 16);
const n = new BigInteger('9e82e2c658109805f66587597c52bd7d20635089f9422f3db30fdb27b96c5f6d', 16);
const e = new BigInteger('10001', 16);

var _p = new BigInteger('C785650493E1E736C482FD9F125176EF53E315EA71CCC52098F0D9D512F63B2F', 16);
var _q = new BigInteger('6071a4ef45b4047a033485fabee04d0efb9ca6914d49d010c4033790ebe7866d', 16);
var _r = new BigInteger('f09e19dfcb6b66eec7f86b88d8fd8ef7e1c3a6096e336766266e10856908c5d9', 16);

const { ICCipher } = require('../ICCipher');
const { ICCipherKey } = require('../ICCipherKey');
const { ICMath } = require('../ICMath');
const ICUzdst1106IIDigest = require('../ICUzdst1106IIDigest');

const some = new ICCipherKey();
const somePrk = some.getPrivateKey();
const somePbk = some.getPublicKey();
const somePrkToHex = somePrk.toHex();
const somePbkToHex = somePbk.toHex();

function bigIntegerToArray(bigInteger, length) {
  let byteArray = bigInteger.toByteArray();
  if (byteArray.length < length) {
    for (let i = byteArray.length; i < length; i++) {
      byteArray.unshift(0);
    }
  } else if (byteArray.length > length) {
    byteArray = byteArray.slice(byteArray.length - length);
  }
  return byteArray;
}


// console.log(somePrk)

const input = 'sdgjsfdjglsjdfgjdfg';
const hash = ICUzdst1106IIDigest.digest(input);
const hashToHex = hash.toHex()
// console.log(hash.toHex())


let bigHash = new BigInteger(hashToHex)
// console.log(bigHash)

const sign = bigHash.modPow(n, d)

const checksign = sign.modPow(n, e)



// let numbr = new BigInteger('4564654654');
// let res = numbr.modPow(_p, _q)
//
console.log(sign == checksign)
// console.log(checksign)





// const preSign = ICMath.modPow(new BigInteger(hash.toHex(), 16), new BigInteger(somePrk.toHex(), 16), _r, _p)
// const postSign = ICBuffer.createBuffer(bigIntegerToArray(preSign, 32));
// const sign = postSign.toHex()
//
//
// const preCheckSign = ICMath.modPow(new BigInteger(somePbk.toHex(), 16), new BigInteger(sign, 16), _r, _p)
// const postCheckSign = ICBuffer.createBuffer(bigIntegerToArray(preCheckSign, 32));
// const checkSign = postCheckSign.toHex()
//
// console.log(`public key => ${somePbkToHex}`)
// console.log(`private key -> ${somePrkToHex}`)
// console.log(`hash => ${hashToHex}`)
// console.log(`sign => ${sign}`)
// console.log('check sign => ' + checkSign == hashToHex)
// console.log(4-"5")
