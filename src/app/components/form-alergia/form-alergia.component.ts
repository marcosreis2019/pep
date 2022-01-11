import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { BeneficiarioModels as Models } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
@Component({
  selector: 'form-alergia',
  templateUrl: './form-alergia.component.html',
  styleUrls: ['./form-alergia.component.scss']
})
export class FormAlergiaComponent implements OnInit {
  @Output() add   : EventEmitter<Models.AlergiaPost>
  @Output() cancel: EventEmitter<any>

  form : FormGroup
  tipos: any[]
  constructor(
    private formB: FormBuilder
  ) {
    this.tipos  = [
      { label: 'Qual o tipo?*', value: null},
      ...Models.ALERGIA_TIPOS
    ]
    this.add    = new EventEmitter()
    this.cancel = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      tipo  : [undefined, Validators.required],
      agente: [undefined, Validators.required],
      ativo : [true],
      notas : [''],
    })
  }

  cancelForm() {
    this.cancel.emit(undefined)
  }

  send() {
    const newMed = this.form.value
    this.add.emit(newMed)
  }
}
