import { sql } from 'mongo-sql'

describe('mongo-sql', () => {
  test('sql()', () => {
    const { query, values } = sql({
      type: 'select',
      table: 'table1',
      alias: 't1',
    })
    expect(query).toBe('select "t1".* from "table1" "t1"')
    expect(values).toEqual([])
  })
})
