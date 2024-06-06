// @ts-ignore
import { describe, expect, test } from 'bun:test'
import { createStatementData } from './createStatementData'
import { Invoices, Plays } from './data'
import { statement } from './statement'
import { usd } from './utils/format'

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

describe('statement', () => {
  const { text, html } = statement(Invoices[0], Plays)
  test('plain text statement', () => {
    const result = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $580.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,730.00
You earned 47 credits
`
    expect(text).toBe(result)
  })


  test('html statement', () => {
    const result = `<h1>Statement for BigCo</h1>
<table>
<tr><th>play</th><th>seats</th><th>cost</th></tr> <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>
 <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>
 <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>
</table>
<p>Amount owed is <em>$1,730.00</em></p>
<p>You earned <em>47</em> credits</p>
`
    expect(html).toBe(result)
  })
})

describe('format', () => {
  test('usd', () => {
    expect(usd(123456789)).toBe('$1,234,567.89')
  })
})