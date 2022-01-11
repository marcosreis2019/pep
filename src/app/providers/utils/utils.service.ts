import { Injectable } from '@angular/core'
import moment from 'moment-timezone'
const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor() {}

  toCamelCase(s: string): string {
    return s
      .split(' ')
      .map(e => (e ? e[0].toUpperCase() + e.substr(1, e.length - 1).toLowerCase() : ''))
      .join(' ')
  }

  toCamelCaseWithPrepositions(espec: string) {
    const regexFirst = new RegExp(/^(.{3} -)/g)

    let es = espec.replace(/_/g, ' ')
    let sub = ''

    if (espec.length <= 3) {
      return es
    }

    if (regexFirst.test(es)) {
      sub = es.substr(0, 6)
      es = es.substr(6, es.length - 1)
    }

    es = this.toCamelCase(es)
    es = es.replace(/De /g, 'de ')
    es = es.replace(/Da /g, 'da ')
    es = es.replace(/Do /g, 'do ')
    es = es.replace(/E /g, 'e ')
    es = es.replace(/A /g, 'a ')
    es = es.replace(/O /g, 'o ')
    return sub + es
  }

  formatterDateToISOWithGMT(date: string): string {
    const d = date
      .split('/')
      .reverse()
      .join('-')
    return moment(d)
      .tz(TMZ)
      .format()
  }

  formatterEndDateToISOWithGMT(date: string): string {
    const d = date
      .split('/')
      .reverse()
      .join('-')
    return moment(d)
      .tz(TMZ)
      .endOf('day')
      .format()
  }

  getDateTime(): string {
    return moment()
      .tz(TMZ)
      .format()
  }

  dateBrToDb(date): string {
    if (!date) return ''
    const split = date.split('/')
    return `${split[2]}-${split[1]}-${split[0]}`
  }

  getFormattedDate(value, format = 'DD/MM/YYYY') {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .format(format)
  }

  getFormattedHour(value, format = 'HH:mm') {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .format(format)
  }

  getFormattedDateHour(value, format = 'DD/MM/YYYY HH:mm') {
    if (!value) {
      return ''
    }

    return moment(value).format(format)
  }

  getToday() {
    return moment().tz(TMZ)
  }

  getDate(date) {
    return moment(date).tz(TMZ)
  }

  diffDays(date1, date2) {
    return this.getDate(date1)
      .set({
        hours: 0,
        minutes: 0,
        seconds: 0
      })
      .diff(
        this.getDate(date2).set({
          hours: 0,
          minutes: 0,
          seconds: 0
        }),
        'days'
      )
  }

  diffMinutes(date1, date2) {
    return this.getDate(date1).diff(this.getDate(date2), 'minutes')
  }

  subtractMonths(value, months) {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .subtract(months, 'months')
  }

  subtractDays(value, days) {
    if (!value) {
      return ''
    }

    return this.getDate(value).subtract(days, 'days')
  }

  addMonths(value, months) {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .add(months, 'months')
  }

  addDays(value, days) {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .add(days, 'days')
  }

  addMinutesDate(data, minutos) {
    return new Date(data.getTime() + minutos * 60000)
  }

  addMinutes(value, minutes) {
    if (!value) {
      return ''
    }

    return moment(value)
      .tz(TMZ)
      .add(minutes, 'minutes')
  }

  startMonth(date) {
    return moment(date)
      .tz(TMZ)
      .date(1)
      .format('YYYY-MM-DD')
  }

  getWeekDay(date) {
    return moment(date)
      .tz(TMZ)
      .day()
  }

  startWeek(date) {
    let week = this.getWeekDay(date)
    let newDate = moment(date)
      .tz(TMZ)
      .subtract(week, 'days')
      .format('YYYY-MM-DD')
    return newDate
  }

  endWeek(date) {
    let week = this.getWeekDay(date)
    let newDate = moment(date)
      .tz(TMZ)
      .add(6 - week, 'days')
      .format('YYYY-MM-DD')
    return newDate
  }

  endMonth(date) {
    return moment(date)
      .tz(TMZ)
      .add(1, 'months')
      .date(1)
      .subtract(1, 'days')
      .format('YYYY-MM-DD')
  }

  formatWeekDay(day) {
    const weekDays = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ]
    return weekDays[day - 1] ? weekDays[day - 1] : ''
  }

  removeDuplicates<T>(
    a: T[],
    callback // function like i => i.id
  ): T[] {
    const seen = {}
    return a.filter(function(item) {
      const k = callback(item)
      return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
  }

  checkEmpty(obj: object): boolean {
    for (const key in obj) {
      if (obj[key]) {
        /*
        if (typeof obj[key] == 'function' || typeof obj[key] == 'object') {
          return this.checkEmpty(obj)
        }
        */
        return false
      }
    }
    return true
  }
}
