import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbActiveModal, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { merge, Observable, of, Subject } from 'rxjs'
import { debounceTime, filter, mergeMap } from 'rxjs/operators'
import { CidModel, CidService } from 'src/app/_store/services/cid/cid.service'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'

export interface SoapItem {
  letter: string
  color: string
  type: string
  limit: number
}

@Component({
  selector: 'block-motivo-atendimento',
  templateUrl: './block-motivo-atendimento.component.html',
  styleUrls: ['./block-motivo-atendimento.component.scss']
})
export class BlockMotivoAtendimentoComponent implements OnInit {
  @Output() event: EventEmitter<any>
  @Input() item: SoapItem
  @Input() collapse: boolean
  @ViewChild('refCIDs', { static: false }) refCIDs: ElementRef

  @ViewChild('instance', { static: true }) instance: NgbTypeahead

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  activeModal: NgbActiveModal
  cidPrincipalConfirmado: boolean

  form: FormGroup
  selectedCID: any
  cidPrincipalTxt: string

  value: CidModel
  hasFocus: boolean

  constructor(
    private store: Store<PEPState>,
    private formB: FormBuilder,
    private modalService: NgbModal,
    private cidServ: CidService
  ) {
    this.event = new EventEmitter()
  }

  ngOnInit() {
    this.form = this.formB.group({
      CID: [undefined],
      CIDconfirmado: false
    })
    this.store.select(AtendimentoSelect.avaliacaoCID).subscribe((data: any) => {
      if (!this.value) {
        this.value = data ? data : {}
        this.cidPrincipalConfirmado = data ? data.confirmado : false
        this.form.patchValue({
          CID: this.value,
          CIDconfirmado: this.cidPrincipalConfirmado
        })
        this.selectedCID = data ? { ...data } : undefined
      }
    })
  }

  toggleFocus() {
    this.hasFocus = !this.hasFocus
    this.emitFocus()
  }

  emitFocus() {
    this.event.emit({ action: 'focus', type: this.item.type })
  }

  saveCIDAtendimento(v: any) {
    if (v) {
      this.selectedCID = { ...v.item }
    }
    if (this.selectedCID) {
      this.selectedCID.confirmado = this.cidPrincipalConfirmado
      this.store.dispatch(
        AtendimentoActions.setCIDAtendimento({ payload: { ...this.selectedCID } })
      )
    }
  }

  // functions from form-condicao
  search = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$

    return merge(text, focus, click).pipe(mergeMap(term => this.autoComplete(term)))
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
      CID: evt.item.descricao
    })
  }

  closeModalCids() {
    this.activeModal.close()
  }

  toggleRefCids() {
    this.activeModal = this.modalService.open(this.refCIDs, {
      centered: true,
      size: 'xl'
    })
    return
  }

  checkSelectedCID() {
    if (!this.selectedCID) {
      this.form.patchValue({
        CID: undefined
      })
    }
  }
}
