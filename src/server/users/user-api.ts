import { Router } from 'express'
import { rpcMethods } from '../../common/constants'
import { userDao, UserDao } from './user-dao'

export const userApiFactory = (userDao: UserDao) => ({
  [rpcMethods.users.getList]: async () => {
    const { rows } = await userDao.select()
    return rows
  },
  [rpcMethods.users.getOne]: async ({ params }) => {
    const { id } = params
    const { rows: [user] } = await userDao.select({ id }, { limit: 1 })
    return user
  },
})

export const userApi = userApiFactory(userDao)
