import { createStatementData } from './createStatementData'
import { usd } from '../utils/format'

export function statement(invoice: Invoice, plays: Plays) {
  const data = createStatementData(invoice, plays)
  return {
    text: getPlainText(data),
    html: getHtml(data),
  }
}

function getPlainText(data: Statement) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(data.totalAmount)}\n`
  result += `You earned ${data.totalVolumeCredits} credits\n`

  return result
}

function getHtml(data: Statement) {
  let result = `<h1>Statement for ${data.customer}</h1>\n`
  result += '<table>\n'
  result += '<tr><th>play</th><th>seats</th><th>cost</th></tr>'
  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += '</table>\n'
  result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`
  return result
}