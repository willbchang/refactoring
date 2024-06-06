class PerformanceCalculator {
  private performance: Performance

  constructor(performance: Performance) {
    this.performance = performance
  }

}

export function createStatementData(invoice: Invoice, plays: Play[]) {
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
    const calculator = new PerformanceCalculator(performance)
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
    return plays.find(item => item.id === perf.playID)!
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
    return data.performances.reduce((sum, item) => sum + item.amount, 0)
  }

  function getTotalVolumeCredits() {
    return data.performances.reduce((sum, item) => sum + item.volumeCredits, 0)
  }
}