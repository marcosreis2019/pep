import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'form-exame',
  templateUrl: './form-exame.component.html',
  styleUrls: ['./form-exame.component.scss']
})
export class FormExameComponent implements OnInit {
  @Output() saveEvent: EventEmitter<any>
  @Output() printEvent: EventEmitter<any>

  @Input() tipoExame: string

  form: FormGroup
  constructor(private formB: FormBuilder) {
    this.saveEvent = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      exame: [undefined, Validators.required],
      observations: [undefined]
    })
  }

  addExame() {
    if (this.form.invalid) {
      return
    }

    const exame = {
      descricao: this.form.value.exame,
      tipo: this.tipoExame,
      observations: this.form.value.observations
    }
    this.saveEvent.emit(exame)

    this.form.reset()
    return exame
  }
}
