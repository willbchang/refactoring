class PerformanceCalculator {
  public performance: Performance
  public plays: Play[]

  constructor(performance: Performance, plays: Play[]) {
    this.performance = performance
    this.plays = plays
  }

   get play() {
    return this.plays.find(item => item.id === this.performance.playID)!
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
    const calculator = new PerformanceCalculator(performance, plays)

    return  {
      ...performance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    } as StatementPerformance
  }


  function getTotalAmount() {
    return result.performances.reduce((sum, item) => sum + item.amount, 0)
  }

  function getTotalVolumeCredits() {
    return result.performances.reduce((sum, item) => sum + item.volumeCredits, 0)
  }
}