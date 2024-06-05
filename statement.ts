export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0
  let volumeCredits = 0
  let result = `Statement for ${invoice.customer}\n`

  for (let perf of invoice.performances) {
    // add volume credits
    volumeCredits += Math.max(perf.audience - 30, 0)
    // add extra credit for every ten comedy attendees
    if ('comedy' === getPlay(perf).type) volumeCredits += Math.floor(perf.audience / 5)
    // print line for this order
    result += ` ${getPlay(perf).name}: ${format(getAmount(perf) / 100)} (${perf.audience} seats)\n`
    totalAmount += getAmount(perf)
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`

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

  function format(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }
}
