import { sql } from 'mongo-sql'
import { Pool } from 'pg'
import { preInsertCheck } from './utils'

export class BaseDao {
  constructor(
    protected pool: Pool,
    protected table: string,
  ) { }

  async runMongoSqlQuery(mongoSqlQuery) {
    const { query, values } = sql(mongoSqlQuery)
    return this.pool.query(query, values)
  }

  selectQuery(where, options) {
    const { limit, offset } = options
    return {
      type: 'select',
      table: this.table,
      where,
      limit,
      offset,
    }
  }

  async select(where = {}, options = {}) {
    return this.runMongoSqlQuery(this.selectQuery(where, options))
  }

  insertQuery(values, options) {
    const { returning = ['*'] } = options
    return {
      type: 'insert',
      table: this.table,
      values,
      returning,
    }
  }

  async insert(values, options = {}) {
    preInsertCheck(values)
    return this.runMongoSqlQuery(this.insertQuery(values, options))
  }

  updateQuery(where, values, options) {
    const { returning = ['*'] } = options
    return {
      type: 'update',
      table: this.table,
      values,
      where,
      returning,
    }
  }

  async update(where, values, options = {}) {
    return this.runMongoSqlQuery(this.updateQuery(where, values, options))
  }

  deleteQuery(where, options) {
    const { returning = ['*'] } = options
    return {
      type: 'delete',
      table: this.table,
      where,
      returning,
    }
  }

  async delete(where, options = {}) {
    return this.runMongoSqlQuery(this.deleteQuery(where, options))
  }
}
