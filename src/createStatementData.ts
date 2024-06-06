class PerformanceCalculator {
  public performance: Performance
  public play: Play

  constructor(performance: Performance, play: Play) {
    this.performance = performance
    this.play = play
  }

  get amount() {
     return 0
  }

  get volumeCredits() {
    return  Math.max(this.performance.audience - 30, 0)
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30)
    }

    return result
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20)
    }
    result += 300 * this.performance.audience

    return result
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
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
    const calculator = getPerformanceCalculator(performance, getPlay(performance))

    return {
      ...performance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    } as StatementPerformance
  }

  function getPerformanceCalculator(performance: Performance, play: Play) {
    switch (play.type) {
      case 'tragedy': return new TragedyCalculator(performance, play)
      case 'comedy':  return new ComedyCalculator(performance, play)
      default: throw new Error('Unknown play type')
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