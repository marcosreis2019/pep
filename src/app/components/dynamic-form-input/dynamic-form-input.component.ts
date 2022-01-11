import { Component, OnInit, forwardRef, Input } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { Observable } from 'rxjs'

@Component({
  selector: 'dynamic-form-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['./dynamic-form-input.component.scss'],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormInputComponent)
    }
  ]
})
export class DynamicFormInputComponent implements OnInit, ControlValueAccessor {
  @Input() input: QuestionariosModels.DynamicFormInput
  @Input() parent: ''
  @Input() forceCloseSelectCheck$?: Observable<boolean>

  data: QuestionariosModels.DynamicFormInput
  value

  constructor() {}

  ngOnInit() {
    this.data = { ...this.input }
    if (!this.data.plcholder) {
      this.data.plcholder = 'Valor'
    }
  }

  changeValue(value) {
    this.value = value
    this.modify(value)
  }

  /**
   * As funções abaixo são responsáveis por permitir o uso deste component
   * como as diretivas de ngModelChange e ngModel, geralmente utilizadas em
   * forms e ReactiveForms
   *
   * @author Thiago Honorato
   */
  writeValue(value: any) {
    this.value = value
  }

  registerOnTouched() {}

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  propagateChange = (_: any) => {}

  modify(value: any) {
    this.propagateChange(value)
  }
}
