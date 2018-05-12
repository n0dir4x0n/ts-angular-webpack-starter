import { ObjectID } from 'bson'
import { rpcMethods } from '../../../common/constants'
import { ICCipher } from '../../../libs/icjs/ICCipher'
import { ICCipherKey } from '../../../libs/icjs/ICCipherKey'
import { sessionApiFactory } from '../session-api'
import { SessionDao } from '../session-dao'

describe('sessionApiFactory', () => {
  const sessionId = new ObjectID()
  const sessionDao: any = {
    insert: jest.fn(async ({ dh }) => ({ rows: [{ id: sessionId, dh }] })),
  }
  const sessionApi = sessionApiFactory(sessionDao)

  test('create', async () => {
    const cipherKey = new ICCipherKey()
    const result = await sessionApi[rpcMethods.sessions.create]({
      params: { publicKey: cipherKey.getPublicKey().toHex() },
    })
    const dh = ICCipherKey.dh(cipherKey.getPrivateKey().toHex(), result.publicKey)
    expect(result.id).toBe(sessionId)
    expect(result.publicKey).toHaveLength(64)
  })
})
