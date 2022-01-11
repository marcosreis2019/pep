import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { BeneficiarioModels as Models } from 'src/app/_store/_modules/beneficiario/beneficiario.model'

@Component({
  selector: 'form-medicamento',
  templateUrl: './form-medicamento.component.html',
  styleUrls: ['./form-medicamento.component.scss']
})
export class FormMedicamentoComponent implements OnInit {
  @Output() add: EventEmitter<Models.MedicamentoPost>
  @Output() edit: EventEmitter<Models.Medicamento>
  @Output() cancel: EventEmitter<any>

  @Input() medication: Models.Medicamento

  form: FormGroup
  isAdding: boolean
  isEditing: boolean

  constructor(private formB: FormBuilder) {
    this.add = new EventEmitter()
    this.edit = new EventEmitter()
    this.cancel = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      medicamento: [
        this.medication ? this.medication.medicamento : undefined,
        Validators.required
      ],
      principio_ativo: [
        this.medication ? this.medication.principio_ativo : undefined,
        Validators.required
      ],
      dosagem: [
        this.medication ? this.medication.dosagem : undefined,
        Validators.required
      ],
      uso_continuo: [this.medication ? this.medication.uso_continuo : false],
      ativo: [this.medication ? this.medication.ativo : true],
      obs: ['']
    })

    // if there is a medication setted, user is editing, else user is adding one
    this.medication ? this.isEditing = true : this.isAdding = true
  }

  cancelForm() {
    this.cancel.emit(undefined)
  }

  send() {
    if (this.isAdding) {
      const medication = this.form.value
      this.add.emit(medication)
    }
    if (this.isEditing) {
      const medication = this.medication
      medication.medicamento = this.form.value.medicamento
      medication.principio_ativo = this.form.value.principio_ativo
      medication.dosagem = this.form.value.dosagem
      medication.uso_continuo = this.form.value.uso_continuo
      medication.ativo = this.form.value.ativo
      medication.obs = this.form.value.obs
      this.edit.emit(medication)
    }
  }
}
