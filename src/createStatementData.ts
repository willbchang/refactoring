class PerformanceCalculator {
  public performance: Performance
  public play: Play

  constructor(performance: Performance, play: Play) {
    this.performance = performance
    this.play = play
  }


   get amount() {
    let result = 0
    switch (this.play.type) {
      case 'tragedy':
        result = 40000
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30)
        }
        break
      case 'comedy':
        result = 30000
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20)
        }
        result += 300 * this.performance.audience
        break
      default:
        throw new Error(`unknown type: ${this.play.type}`)
    }
    return result
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
    const calculator = new PerformanceCalculator(performance, getPlay(performance))
    let result: StatementPerformance = {
      ...performance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: 0,
    }

    result.volumeCredits = getVolumeCredits(result)
    return result
  }

  function getPlay(perf: Performance) {
    return plays.find(item => item.id === perf.playID)!
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