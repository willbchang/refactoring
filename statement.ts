import { createStatementData } from './createStatementData'
import { usd } from './utils'

export function statement(invoice: Invoice, plays: Plays) {
  const data = createStatementData(invoice, plays)
  return {
    text: getPlainText(data),
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
