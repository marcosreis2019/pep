import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { NgbDateParserFormatter, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap'
import { CalendarParseFormatter, format, formatRevert } from './calendar.formatter'

interface CalendarDate {
  year: number
  month: number
  day: number
}
@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CalendarParseFormatter },
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalendarComponent)
    }
  ]
})
export class CalendarComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder: string
  @Input() min?: boolean
  @Input() max?: boolean
  @Input() initValue?: Date
  @Output() value = new EventEmitter<any>()

  minDate: CalendarDate
  maxDate: CalendarDate
  today: CalendarDate
  valueCalendar

  constructor(private calendar: NgbCalendar) {
    this.today = {} as CalendarDate
  }

  ngOnInit() {
    const day = new Date()
    const today = {
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      day: day.getDate()
    }

    if (this.min) {
      this.minDate = today
    }

    if (this.max) {
      this.maxDate = today
    }

    this.initValue = new Date(this.initValue)
    if (this.initValue) {
      this.valueCalendar = {
        year: this.initValue.getFullYear(),
        month: this.initValue.getMonth() + 1,
        day: this.initValue.getDate()
      }
    }
    this.placeholder = this.placeholder ? this.placeholder : 'Data'
  }

  isDisabled = (date: NgbDate, current: { month: number }) => date.month !== current.month
  isWeekend = (date: NgbDate) => this.calendar.getWeekday(date) >= 6

  writeValue(valueTemp: any) {
    if (valueTemp) {
      this.valueCalendar = formatRevert(valueTemp)
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  registerOnTouched() {}

  propagateChange = (_: any) => {}

  modify(valueTemp) {
    const dateToExport = format(valueTemp)
    let dateValue = new Date()
    dateValue.setFullYear(valueTemp.year)
    dateValue.setMonth(valueTemp.month - 1)
    dateValue.setDate(valueTemp.day)
    this.value.emit(dateValue)
    this.propagateChange(dateToExport)
  }
}
