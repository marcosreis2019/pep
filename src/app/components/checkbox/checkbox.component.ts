import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'

/**
 * Para usar este component, import o ReactiveFormsModule e FormsModule, 
 * no modulo pai.
 * @author Thiago Honorato
 */
@Component({
  selector: 'checkbox-custom',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
    }
  ]
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {

  @Input() checked: string
  @Input() label  : string
  @Output() update: EventEmitter<boolean>
  
  check: boolean
  value: boolean
  constructor() { 
    this.update = new EventEmitter()
  }

  ngOnInit() {
    this.check = (this.checked === 'true')
  }

  modify(value) {
    this.update.emit(value)
    this.propagateChange(value)
  }

  /**
   * As funções abaixo são responsável por permitir o uso deste component 
   * como as diretivas de ngModelChange e ngModel, geralmente utilizadas em 
   * forms e ReactiveForms
   * 
   * @author Thiago Honorato
   */
  writeValue(value: any) { this.value = value }

  registerOnTouched() { }

  registerOnChange(fn) { this.propagateChange = fn }

  propagateChange = (_: any) => { }
}
