import { ICCipher } from '../ICCipher'
import { ICCipherKey } from '../ICCipherKey'

const input = {
  code: 12345,
  message: 'привет мир',
}

const Alice = new ICCipherKey()
const Bob = new ICCipherKey()

const AlicePublikKey = Alice.getPublicKey().toHex()
const AlicePrivateKey = Alice.getPrivateKey().toHex()

const BobPublicKey = Bob.getPublicKey().toHex()
const BobPrivateKey = Bob.getPrivateKey().toHex()

const AliceDh = ICCipherKey.dh(AlicePrivateKey, BobPublicKey)
const BobDh = ICCipherKey.dh(BobPrivateKey, AlicePublikKey)

const encrypted = ICCipher.encrypt(AliceDh, JSON.stringify(input))
const decrypted = ICCipher.decrypt(BobDh, encrypted)

console.log(decrypted)





