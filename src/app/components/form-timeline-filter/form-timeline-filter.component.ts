import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'

export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
  tipo?: string
  nameProfissional?: string
  nameSpecialty?: string
}
@Component({
  selector: 'form-timeline-filter',
  templateUrl: './form-timeline-filter.component.html',
  styleUrls: ['./form-timeline-filter.component.scss']
})
export class FormTimelineFilterComponent implements OnInit {
  @Output() apply: EventEmitter<TimelineFilters>
  form: FormGroup
  constructor(private formBuilder: FormBuilder) {
    this.apply = new EventEmitter<TimelineFilters>(undefined)
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      dataInicio: [undefined],
      dataFim: [undefined],
      tipo: [undefined],
      nameProfissional: [undefined],
      nameSpecialty: [undefined]
    })
  }

  emit() {
    const value = this.form.value as TimelineFilters
    this.apply.emit(value)
  }
}
