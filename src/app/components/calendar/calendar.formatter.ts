import { Injectable } from '@angular/core'
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'

function isNumber(value) {
  return typeof value === 'number' && isFinite(value)
}

function toInteger(value: any): number {
  return +value
}

function padNumber(value: number): string {
  if (value < 10) {
    return '0' + value
  }
  return '' + value
}

export function format(date) {
  return date ?
    `${isNumber(date.day) ? padNumber(date.day) : ''}/${isNumber(date.month) ? padNumber(date.month) : ''}/${date.year}` :
    ''
}

export function formatRevert(date: string) {
  const d = date.split('/')
  return {
    day  : +d[0],
    month: +d[1],
    year : +d[2]
  }
}
@Injectable()
export class CalendarParseFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/')
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { day: toInteger(dateParts[0]), month: null, year: null }
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null }
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2]) }
      }
    }
    return null
  }

  format(date: NgbDateStruct): string {
    return format(date)
  }
}
