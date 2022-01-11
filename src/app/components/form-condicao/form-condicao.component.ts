import {Component, OnInit, Output, EventEmitter, ViewChild, Input} from '@angular/core'
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap'

import {of, merge, Observable, Subject} from 'rxjs'
import {mergeMap, debounceTime, filter} from 'rxjs/operators'

import {CidService, CidModel} from 'src/app/_store/services/cid/cid.service'

import {BeneficiarioModels as Models} from 'src/app/_store/_modules/beneficiario/beneficiario.model'
@Component({
  selector: 'form-condicao',
  templateUrl: './form-condicao.component.html',
  styleUrls: ['./form-condicao.component.scss']
})
export class FormCondicaoComponent implements OnInit {
  @Output() add: EventEmitter<Models.CondicaoPost>
  @Output() cancel: EventEmitter<any>

  @Input() mpiPaciente: string

  @ViewChild('instance', {static: true}) instance: NgbTypeahead

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  form: FormGroup
  selectedCID: any

  constructor(private formB: FormBuilder, private cidServ: CidService) {
    this.add = new EventEmitter()
    this.cancel = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      condicao: [undefined, Validators.required],
      CID: [undefined, Validators.required],
      CIDID: [undefined],
      confirmado: [false],
      ativo: [true]
    })
  }

  search = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$

    return merge(text, focus, click).pipe(
      mergeMap(term => this.autoComplete(term))
    )
  }

  private autoComplete(key: string) {
    if (!key) {
      return of([])
    }
    return this.cidServ.get(key)
  }

  formatter = (cid: CidModel) => {
    return cid ? cid.descricao : ''
  }

  formatterToShow(cid: CidModel): string {
    return `${cid.codigo}, ${cid.descricao}`
  }

  selectCID(evt) {
    this.selectedCID = evt.item
    this.form.patchValue({
      CID: evt.item,
      CIDID: evt.item._id,
      condicao: evt.item.descricao
    })
  }

  checkSelectedCID() {
    if (!this.selectedCID) {
      this.form.patchValue({
        condicao: undefined,
        CID: undefined,
        CIDID: undefined
      })
    }
  }

  cancelForm() {
    this.cancel.emit(undefined)
  }

  send() {
    const newCond = this.form.value
    newCond.pessoa = this.mpiPaciente
    delete newCond.CIDID
    this.add.emit(newCond)
  }
}
