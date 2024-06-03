export const Invoices: Invoice[] = [
  {
    customer: 'BigCo',
    performances: <Performance[]>[
      {
        playID: 'hamlet',
        audience: 55
      },
      {
        playID: 'as-like',
        audience: 35
      },
      {
        playID: 'othello',
        audience: 40
      }
    ]
  },
]

export const Plays: Plays = {
  hamlet: {
    name: 'Hamlet',
    type: 'tragedy'
  },
  'as-like': {
    name: 'As You Like It',
    type: 'comedy'
  },
  othello: {
    name: 'Othello',
    type: 'tragedy'
  }
}