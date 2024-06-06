// @ts-ignore
import { expect, test } from 'bun:test'
import { Invoices, Plays } from './data'
import { statement } from './statement'

test('statement', () => {
  const result = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`
  expect(statement(Invoices[0], Plays).text).toBe(result)
})