import invoices from './invoices.json'
import plays from './plays.json'
import { statement } from './statement'

console.log(statement(invoices[0], plays))