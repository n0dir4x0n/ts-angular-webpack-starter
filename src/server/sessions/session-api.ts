import { rpcMethods } from '../../common/constants'
import { ICCipherKey } from '../../libs/icjs/ICCipherKey'
import { SessionDao, sessionDao } from './session-dao'

export const sessionApiFactory = (sessionDao: SessionDao) => ({
  [rpcMethods.sessions.create]: async ({ params }) => {
    const { publicKey } = params
    console.log("incoming pbk =>" + publicKey)
    const cipherKey = new ICCipherKey()
    const dh = ICCipherKey.dh(cipherKey.getPrivateKey().toHex(), publicKey).toHex()
    const { rows: [session] } = await sessionDao.insert({ dh })
    console.log("server dh=>" + dh)
    console.log("outgoing pbk =>" + cipherKey.getPublicKey().toHex())
    return {
      id: session.id,
      publicKey: cipherKey.getPublicKey().toHex(),
    }
  },
})

export const sessionApi = sessionApiFactory(sessionDao)
