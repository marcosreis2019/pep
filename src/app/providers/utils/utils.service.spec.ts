import { TestBed } from '@angular/core/testing'
import { UtilsService } from './utils.service'

import moment from 'moment-timezone'
const TMZ = 'America/Sao_Paulo'

describe('UtilsService', () => {
  let service: UtilsService
  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.get(UtilsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should toCamelCase return a camelcase string', () => {
    const test = 'teste do camelcase'
    expect(service.toCamelCase(test)).toBe('Teste Do Camelcase')
  })

  it('should toCamelCaseWithPrepositions return a camelcase string without prepositions', () => {
    const test = 'teste do camelcase'
    expect(service.toCamelCaseWithPrepositions(test)).toBe('Teste do Camelcase')
  })

  it('should formatterDateToISOWithGMT return a ISO date with GMT', () => {
    const date = '01/01/1990'
    const expected = moment(
      date
        .split('/')
        .reverse()
        .join('-')
    )
      .tz(TMZ)
      .format()
    expect(service.formatterDateToISOWithGMT(date)).toBe(expected)
  })

  it('should getDateTime return a date', () => {
    const date = moment()
      .tz(TMZ)
      .format()
    expect(service.getDateTime()).toBe(date)
  })

  it('should getFormattedDate return a formatted date', () => {
    const format = 'DD/MM/YYYY'
    const date = '1990-01-01'
    const expected = moment(date)
      .tz(TMZ)
      .format(format)
    expect(service.getFormattedDate(date)).toBe(expected)
  })

  it('should getFormattedDateHour return a formatted date', () => {
    const format = 'DD/MM/YYYY HH:mm'
    const date = '1990-01-01 12:00'
    const expected = moment(date).format(format)
    expect(service.getFormattedDateHour(date)).toBe(expected)
  })

  it('should getToday return a today date', () => {
    const date = moment().tz(TMZ)
    expect(service.getToday().toString()).toBe(date.toString())
  })

  it('should diffDays return a day diff', () => {
    const date1 = '1990-01-01'
    const date2 = '1990-02-05'
    const expected = -35
    expect(service.diffDays(date1, date2)).toBe(expected)
  })

  it('should subtractMonths return date substracted', () => {
    const date1 = '1991-01-01 00:00'
    const sub = 3
    const expected = moment('1990-10-01')
      .tz(TMZ)
      .format('YYYY-MM-DD')
    const received = moment(service.subtractMonths(date1, sub)).format('YYYY-MM-DD')
    expect(received).toBe(expected)
  })

  it('should addMonths return date added', () => {
    const date1 = '1991-01-01'
    const add = 3
    const expected = moment('1991-04-01')
      .tz(TMZ)
      .format('YYYY-MM-DD')
    const received = moment(service.addMonths(date1, add)).format('YYYY-MM-DD')
    expect(received).toBe(expected)
  })

  it('should startMonth return started month date', () => {
    const date1 = '1991-01-20'
    const expected = '1991-01-01'
    expect(service.startMonth(date1)).toBe(expected)
  })

  it('should endMonth return end month date', () => {
    const date1 = '1991-04-05'
    const expected = '1991-04-30'
    expect(service.endMonth(date1)).toBe(expected)
  })

  it('should formatWeekDay return Domingo', () => {
    const day = 1
    const expected = 'Domingo'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Segunda-feira', () => {
    const day = 2
    const expected = 'Segunda-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Segunda-feira', () => {
    const day = 2
    const expected = 'Segunda-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Terça-feira', () => {
    const day = 3
    const expected = 'Terça-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Quarta-feira', () => {
    const day = 4
    const expected = 'Quarta-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Quinta-feira', () => {
    const day = 5
    const expected = 'Quinta-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Sexta-feira', () => {
    const day = 6
    const expected = 'Sexta-feira'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should formatWeekDay return Sábado', () => {
    const day = 7
    const expected = 'Sábado'
    expect(service.formatWeekDay(day)).toBe(expected)
  })

  it('should checkEmpty return true', () => {
    const obj = {
      a: ''
    }
    expect(service.checkEmpty(obj)).toBeTruthy()
  })

  it('should checkEmpty return false', () => {
    const obj = {
      a: 123
    }
    expect(service.checkEmpty(obj)).toBeFalsy()
  })

  it('should removeDuplicates return array with unique key', () => {
    const array = [
      {
        id: 1
      },
      {
        id: 1
      }
    ]
    const callback = item => item.id
    const received = JSON.stringify(service.removeDuplicates(array, callback))
    const expected = JSON.stringify([
      {
        id: 1
      }
    ])
    expect(received).toBe(expected)
  })
})
