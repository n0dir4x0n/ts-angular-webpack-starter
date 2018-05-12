// import { ICCipher } from '../ICCipher'
// import { ICCipherKey } from '../ICCipherKey'
// import {ICMath} from '../ICMath'
// import * as ICUzdst1106IIDigest from '../ICUzdst1106IIDigest'

// const input = {
//     code: 12345,
//     message: 'привет мир',
//   }

//   const Alice = new ICCipherKey()
//   const Bob = new ICCipherKey()

//   const AlicePublicKey = Alice.getPublicKey()
//   const AlicePrivateKey = Alice.getPrivateKey()

//   const BobPublicKey = Bob.getPublicKey().toHex()
//   const BobPrivateKey = Bob.getPrivateKey().toHex()

//   const AliceDh = ICCipherKey.dh(AlicePrivateKey, BobPublicKey)
//   const BobDh = ICCipherKey.dh(BobPrivateKey, AlicePublicKey)

//   const hash = ICUzdst1106IIDigest.digest(input)

// // var res = ICMath.modPow(new BigInteger(publicKey, 16), new BigInteger(privateKey, 16), _r, _p);

// let p = Alice.getP()
// let r = Alice.getR()

//   // console.log(hash)
//   const sign = ICMath.modPow(new BigInteger(hash, 16), new BigInteger(AlicePrivateKey, 16), _r, _p)

//   console.log(sign)

//   // const encrypted = ICCipher.encrypt(AliceDh, JSON.stringify(input))
//   // const decrypted = ICCipher.decrypt(BobDh, encrypted)
//   //
//   console.log(sign)


