interface Invoice {
  customer: string
  performances: Performance[]
}

interface Performance {
  playID: string
  audience: number
}

interface Plays {
  [key: string]: Play
}

interface Play {
  name: string
  type: string
}

interface Statement {
  customer: string
  performances: StatementPerformance[]
}

interface StatementPerformance extends Performance {
  play: Play
  amount: number
  volumeCredits: number
}