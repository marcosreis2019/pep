import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { ReferenciasModels as Models } from 'src/app/_store/_modules/referencias/referencias.models'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { ReferenciasModels } from 'src/app/_store/_modules/referencias/referencias.models'

@Component({
  selector: 'form-referencias-contra',
  templateUrl: './form-referencias-contra.component.html',
  styleUrls: ['./form-referencias-contra.component.scss']
})
export class FormReferenciasContraComponent implements OnInit {
  @Output() event: EventEmitter<Models.ReferenciaPut>
  form: FormGroup

  constructor(
    private formB: FormBuilder,
    private utilsServ: UtilsService
  ) {
    this.event = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      dataRealizacaoContraReferencia: [undefined, Validators.required],
      textoContraReferencia         : [undefined, Validators.required]
    })
  }

  save() {
    if (this.form.invalid) { return }

    const v = this.form.value
    const d: Models.ReferenciaPut = {
      dataRealizacaoContraReferencia: this.utilsServ.formatterDateToISOWithGMT(v.dataRealizacaoContraReferencia),
      textoContraReferencia         : v.textoContraReferencia,
      localAtendimento              : undefined,
    }
    this.event.emit(d)
    this.form.reset()
  }
}
