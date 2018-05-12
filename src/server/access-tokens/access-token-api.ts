import { ok } from 'assert'
import { rpcMethods } from '../../common/constants'
import { UserDao, userDao } from '../users/user-dao'
import { AccessTokenDao, accessTokenDao } from './access-token-dao'

export const accessTokenApiFactory = (accessTokenDao: AccessTokenDao, userDao: UserDao) => ({
  [rpcMethods.authTokens.create]: async ({ params }) => {
    const { username, password } = params
    const { rows: [user] } = await userDao.select({ username, password })
    ok(user, 'invalid__user')
    const { rows: [accessToken] } = await accessTokenDao.insert({
      userId: user.id,
    })
    return accessToken
  },
})

export const accessTokenApi = accessTokenApiFactory(accessTokenDao, userDao)
