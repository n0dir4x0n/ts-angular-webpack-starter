import { Pool } from 'pg'
import { BaseDao } from '../base-dao'
import { pool } from '../pool'

export class SessionDao extends BaseDao {
  constructor(pool: Pool) {
    super(pool, 'sessions')
  }
}

export const sessionDao = new SessionDao(pool)
