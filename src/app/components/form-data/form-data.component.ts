import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { BeneficiarioModels as Models } from 'src/app/_store/_modules/beneficiario/beneficiario.model'

import moment from 'moment-timezone'
export interface FormDateModel {
  especific_date: string
  date_start: string
  date_end: string
}
@Component({
  selector: 'form-data',
  templateUrl: './form-data.component.html',
  styleUrls: ['./form-data.component.scss']
})
export class FormDataComponent implements OnInit {
  @Output() add: EventEmitter<Models.MedicamentoPost>
  @Output() cancel: EventEmitter<any>

  form: FormGroup
  showDataRange = false

  constructor(private formBuilder: FormBuilder) {
    this.add = new EventEmitter()
    this.cancel = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      especific_date: [],
      date_start: [],
      date_end: []
    })
  }

  cancelForm() {
    this.cancel.emit(undefined)
  }

  showDatasRange(showDataRange: boolean) {
    this.showDataRange = showDataRange
  }

  send() {
    this.add.emit(this.form.value)
  }

  filterByPeriods(lastWeek: boolean = true) {
    this.form.patchValue({
      date_start: moment().format('YYYY-MM-DD'),
      date_end: lastWeek ? this.subWeek() : this.subMonth()
    })

    this.send()
  }

  private subWeek() {
    return moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD')
  }

  private subMonth() {
    return moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD')
  }
}
