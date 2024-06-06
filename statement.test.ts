// @ts-ignore
import { expect, describe, test } from 'bun:test'
import { createStatementData } from './createStatementData'
import { Invoices, Plays } from './data'
import { statement } from './statement'

describe('createStatementData', () => {
  const data = createStatementData(Invoices[0], Plays)

  test('tragedy', () => {
    const target = data.performances.find(item => item.play.type === 'tragedy')!
    expect(target.amount).toBe(65000)
    expect(target.volumeCredits).toBe(25)
  })

  test('comedy', () => {
    const target = data.performances.find(item => item.play.type === 'comedy')!
    expect(target.amount).toBe(58000)
    expect(target.volumeCredits).toBe(12)
  })

  test('totalVolumeCredits', () => {
    expect(data.totalVolumeCredits).toBe(47)
  })

  test('totalAmount', () => {
    expect(data.totalAmount).toBe(173000)
  })
})

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