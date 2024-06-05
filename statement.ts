export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  for (let perf of invoice.performances) {
    totalAmount += getAmount(perf)
  }
  for (let perf of invoice.performances) {
    volumeCredits += Math.max(perf.audience - 30, 0)
    if ('comedy' === getPlay(perf).type) volumeCredits += Math.floor(perf.audience / 5)
  }
  for (let perf of invoice.performances) {
    result += ` ${getPlay(perf).name}: ${usd(getAmount(perf))} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(totalAmount)}\n`
  result += `You earned ${volumeCredits} credits\n`

  return result

  function getAmount(perf: Performance) {
    let result = 0
    switch (getPlay(perf).type) {
      case 'tragedy':
        result = 40000
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20)
        }
        result += 300 * perf.audience
        break
      default:
        throw new Error(`unknown type: ${getPlay(perf).type}`)
    }
    return result
  }

  function getPlay(perf: Performance) {
    return plays[perf.playID]
  }

  function usd(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100)
  }
}
