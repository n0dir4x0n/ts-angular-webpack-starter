import { Pool } from 'pg'
import { BaseDao } from '../base-dao'
import { pool } from '../pool'

export class AccessTokenDao extends BaseDao {
  constructor(pool: Pool) {
    super(pool, 'accessTokens')
  }
}

export const accessTokenDao = new AccessTokenDao(pool)
