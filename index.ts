import { Invoices, Plays } from './data'
import { statement } from './statement'

const { text, html } = statement(Invoices[0], Plays)
console.log(text, '\n', html)