export function statement(invoice: Invoice, plays: Plays) {
  const data: Statement = {
    customer: invoice.customer,
    performances: invoice.performances.map(getStatementPerformance),
  }
  return getPlainText(data)

  function getStatementPerformance(performance: Performance) {
    let result: StatementPerformance = {
      ...performance,
      play: getPlay(performance),
      amount: 0,
    }

    result.amount = getAmount(result)
    return result
  }

  function getPlay(perf: Performance) {
    return plays[perf.playID]
  }

  function getAmount(perf: StatementPerformance) {
    let result = 0
    switch (perf.play.type) {
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
        throw new Error(`unknown type: ${perf.play.type}`)
    }
    return result
  }
}

function getPlainText(data: Statement) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
  }

  result += `Amount owed is ${usd(getTotalAmount())}\n`
  result += `You earned ${getTotalVolumeCredits()} credits\n`

  return result


  function usd(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100)
  }

  function getTotalAmount() {
    let result = 0
    for (let perf of data.performances) {
      result += perf.amount
    }
    return result
  }

  function getTotalVolumeCredits() {
    let result = 0
    for (let perf of data.performances) {
      result += Math.max(perf.audience - 30, 0)
      if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 5)
    }
    return result
  }
}
