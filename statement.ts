export function statement(invoice: Invoice, plays: Plays) {
  const data: Statement = {
    customer: invoice.customer,
    performances: invoice.performances,
  }
  return getPlainText(data, plays)
}

function getPlainText(data: Statement, plays: Plays) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${getPlay(perf).name}: ${usd(getAmount(perf))} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(getTotalAmount())}\n`
  result += `You earned ${getTotalVolumeCredits()} credits\n`

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

  function getTotalAmount() {
    let result = 0
    for (let perf of data.performances) {
      result += getAmount(perf)
    }
    return result
  }

  function getTotalVolumeCredits() {
    let result = 0
    for (let perf of data.performances) {
      result += Math.max(perf.audience - 30, 0)
      if ('comedy' === getPlay(perf).type) result += Math.floor(perf.audience / 5)
    }
    return result
  }
}
