import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

interface Option {
  value: string
  label: string
}

@Component({
  selector: 'form-retorno',
  templateUrl: './form-retorno.component.html',
  styleUrls: ['./form-retorno.component.scss']
})
export class FormRetornoComponent implements OnInit {
  @Output() event: EventEmitter<any>
  @Input() data: any

  form: FormGroup
  period: string
  periods: Option[]
  editable: boolean

  constructor(private formB: FormBuilder) {
    this.event = new EventEmitter()
    this.periods = [
      { label: 'Dia(s)', value: 'DIA' },
      { label: 'Semana(s)', value: 'SEMANA' },
      { label: 'Mês(es)', value: 'MES' },
      { label: 'Ano(s)', value: 'ANO' }
    ]
  }

  ngOnInit() {
    this.form = this.formB.group({
      digito: [undefined, Validators.required],
      tempo: [undefined, Validators.required],
      com_exames: [false]
    })

    if (!this.data) {
      this.editable = true
    }

    if (this.data) {
      this.period = this.getPeriod(this.data.tempo)
    }
  }

  edit(state: boolean = true) {
    this.form.setValue({
      digito: this.data.digito,
      tempo: this.data.tempo,
      com_exames: this.data.com_exames
    })

    this.editable = state
  }

  save() {
    if (this.form.invalid) {
      return
    }

    this.data = this.form.value
    if (this.data) {
      this.period = this.getPeriod(this.data.tempo)
    }
    this.editable = false
    this.event.emit(this.data)
  }

  getPeriod(period: string) {
    const result = this.periods.find(item => {
      return item.value.toLowerCase() === period.toLowerCase()
    })
    return result.label
  }
}
