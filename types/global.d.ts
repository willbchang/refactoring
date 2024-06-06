interface Invoice {
  customer: string
  performances: Performance[]
}

interface Performance {
  playID: string
  audience: number
}

interface Play {
  id: string
  name: string
  type: string
}

interface Statement {
  customer: string
  performances: StatementPerformance[]
  totalAmount: number
  totalVolumeCredits: number
}

interface StatementPerformance extends Performance {
  play: Play
  amount: number
  volumeCredits: number
}