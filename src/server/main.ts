import { server } from './server'
import { ICCipher } from '../libs/icjs/ICCipher'
import { ICCipherKey } from '../libs/icjs/ICCipherKey'
import { ICUtils } from '../libs/icjs/ICUtils'


server.listen(9000, () => {
  console.info('HTTP server up on port 9000')
})


const input = {
  code: 12345,
  message: 'привет мир',
}

const Alice = new ICCipherKey()
const Bob = new ICCipherKey()
const AlicePublikKey = Alice.getPublicKey().toHex()
const AlicePrivateKey = Alice.getPrivateKey().toHex()
const BobPublicKey = Bob.getPublicKey().toHex()

// console.log(`Alices public key: ${AlicePublikKey} private key ${AlicePrivateKey}`)
const BobPrivateKey = Bob.getPrivateKey().toHex()

// console.log(`Bobs public key: ${BobPublicKey.length} private key ${BobPrivateKey.length}`)

const AliceDh = ICCipherKey.dh(AlicePrivateKey, BobPublicKey)
const AliceDhHex = AliceDh.toHex()
const icUtils = new ICUtils()
// const parseAliceDh = ICUtils.binary.hex.decode(AliceDhHex)

let anti = function (hex) {
  var out = new Uint8Array(Math.ceil(hex.length / 2));
  var i = 0, j = 0;
  if (hex.length & 1) {
    // odd number of characters, convert first character alone
    i = 1;
    out[j++] = parseInt(hex[0], 16);
  }
  // convert 2 characters (1 byte) at a time
  for (; i < hex.length; i += 2) {
    out[j++] = parseInt(hex.substr(i, 2), 16);
  }
  return out;
};

// const parseAliceDh = AliceDh.hexToBytes()
const asd = anti(AliceDhHex)

// console.log(parseAliceDh)
console.log(`Alice dh hex string ${asd}`)
console.log(`Alice Dh array of int ${AliceDh.data}`)

const BobDh = ICCipherKey.dh(BobPrivateKey, AlicePublikKey).toHex()

// console.log(`Bob Dh ${BobDh}`)
// const encrypted = ICCipher.encrypt(AliceDh, JSON.stringify(input))
// const decrypted = ICCipher.decrypt(BobDh, encrypted)
// console.log(decrypted)

