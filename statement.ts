export function statement(invoice: Invoice, plays: Plays) {
  return getPlainText(createStatementData(invoice, plays))
}

export function createStatementData(invoice: Invoice, plays: Plays) {
  const data: Statement = {
    customer: invoice.customer,
    performances: invoice.performances.map(getStatementPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  }

  data.totalAmount = getTotalAmount()
  data.totalVolumeCredits = getTotalVolumeCredits()

  return data

  function getStatementPerformance(performance: Performance) {
    let result: StatementPerformance = {
      ...performance,
      play: getPlay(performance),
      amount: 0,
      volumeCredits: 0,
    }

    result.amount = getAmount(result)
    result.volumeCredits = getVolumeCredits(result)
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

  function getVolumeCredits(perf: StatementPerformance) {
    let result = 0
    result += Math.max(perf.audience - 30, 0)
    if ('comedy' === perf.play.type) result += Math.floor(perf.audience / 5)

    return result
  }

  function getTotalAmount() {
    return data.performances.reduce((sum, item) => sum + item.amount, 0 )
  }

  function getTotalVolumeCredits() {
    return data.performances.reduce((sum, item) => sum + item.volumeCredits, 0 )
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


  function usd(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount / 100)
  }
}
