import { Invoices, Plays } from './utils/data'
import { statement } from './src/statement'

const { text, html } = statement(Invoices[0], Plays)
console.log(text, '\n', html)