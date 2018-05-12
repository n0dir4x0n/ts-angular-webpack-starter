import { ICCipherKey } from '../ICCipherKey'

const cipherKey = new ICCipherKey()

describe('ICCipherKey', () => {
  test('length', () => {
    const privateKey = cipherKey.getPrivateKey()
    const publicKey = cipherKey.getPublicKey()
    expect(privateKey.toHex()).toHaveLength(64)
    expect(publicKey.toHex()).toHaveLength(64)
  })

  test('dh', () => {
    const cipherKey1 = new ICCipherKey()
    const cipherKey2 = new ICCipherKey()
    const dh1 = ICCipherKey.dh(cipherKey1.getPrivateKey().toHex(), cipherKey2.getPublicKey().toHex())
    const dh2 = ICCipherKey.dh(cipherKey2.getPrivateKey().toHex(), cipherKey1.getPublicKey().toHex())
    expect(dh1).toEqual(dh2)
  })
})
