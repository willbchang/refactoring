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
        break
      default:
        throw new Error(`unknown type: ${this.play.type}`)
    }
    return result
  }


   get volumeCredits() {
    let result = 0
    result += Math.max(this.performance.audience - 30, 0)
    if ('comedy' === this.play.type) result += Math.floor(this.performance.audience / 5)

    return result
  }

}

export function createStatementData(invoice: Invoice, plays: Play[]) {
  const result: Statement = {
    customer: invoice.customer,
    performances: invoice.performances.map(getStatementPerformance),
    totalAmount: 0,
    totalVolumeCredits: 0,
  }

  result.totalAmount = getTotalAmount()
  result.totalVolumeCredits = getTotalVolumeCredits()

  return result

  function getStatementPerformance(performance: Performance) {
    const calculator = getPerformanceCalculator()

    return {
      ...performance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    } as StatementPerformance


    function getPerformanceCalculator() {
      return new PerformanceCalculator(performance, getPlay(performance))
    }
  }

  function getPlay(perf: Performance) {
    return plays.find(item => item.id === perf.playID)!
  }

  function getTotalAmount() {
    return result.performances.reduce((sum, item) => sum + item.amount, 0)
  }

  function getTotalVolumeCredits() {
    return result.performances.reduce((sum, item) => sum + item.volumeCredits, 0)
  }
}