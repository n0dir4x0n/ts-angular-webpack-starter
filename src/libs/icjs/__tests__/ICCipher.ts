import { ICCipher } from '../ICCipher'
import { ICCipherKey } from '../ICCipherKey'

describe('ICCipher', () => {
  test('encrypt/decrypt', () => {
    const input = {
      code: 12345,
      message: 'привет мир',
    }
    const cipherKey1 = new ICCipherKey()
    const cipherKey2 = new ICCipherKey()
    const dh1 = ICCipherKey.dh(cipherKey1.getPrivateKey().toHex(), cipherKey2.getPublicKey().toHex())
    const dh2 = ICCipherKey.dh(cipherKey2.getPrivateKey().toHex(), cipherKey1.getPublicKey().toHex())
    const encrypted = ICCipher.encrypt(dh1, JSON.stringify(input))
    expect(typeof encrypted).toBe('string')
    const decrypted = ICCipher.decrypt(dh2, encrypted)
    expect(typeof decrypted).toBe('string')
    expect(JSON.parse(decrypted)).toEqual(input)
  })
})
