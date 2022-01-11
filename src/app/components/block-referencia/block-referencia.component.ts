import { DatePipe } from '@angular/common'
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core'
import { NgbActiveModal, NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { PEPState } from 'src/app/_store/store.models'
import { ReferenciasActions } from 'src/app/_store/_modules/referencias/referencias.actions'
import { ReferenciasModels as Models } from 'src/app/_store/_modules/referencias/referencias.models'
import { ReferenciasSelectors } from 'src/app/_store/_modules/referencias/referencias.selectors'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { SubSink } from 'subsink'
import { BeneficiarioActions } from 'src/app/_store/_modules/beneficiario/beneficiario.action'

@Component({
  selector: 'block-referencia',
  templateUrl: './block-referencia.component.html',
  styleUrls: ['./block-referencia.component.scss']
})
export class BlockReferenciaComponent implements OnInit, OnDestroy {
  @ViewChild('addRefForm', { static: false }) addRefForm: ElementRef
  @ViewChild('refHistory', { static: false }) refHistory: ElementRef
  @ViewChild('p1', { static: false }) popover: NgbPopover

  refs: Models.Referencia[]
  refs$: Observable<Models.Referencia[]>
  refSelected: Models.Referencia
  profissional$
  key = undefined
  dateStart = undefined
  dateEnd = undefined
  date = undefined
  fromInit = true

  isLoading$: Observable<boolean>
  error$: Observable<string>
  success$: Observable<string>

  collapsed: boolean
  msgAlert: string
  activeItem: number

  addRefFormIsVisible: boolean
  addXRefFormIsVisible: boolean
  historyIsVisible: boolean
  activeModal: NgbActiveModal
  mpi: string

  private subs$ = new SubSink()

  isAddingRef: boolean
  isAddingXRef: boolean
  isSendingRef: boolean
  isSendingXRef: boolean
  isAddingAndPrintingRef: boolean
  closeResult: string
  filterReference: Models.ReferenciaHistoricoFiltro = undefined
  filterReferenceDigitando: Models.ReferenciaHistoricoFiltro = undefined

  constructor(
    private renderer: Renderer2,
    private modalService: NgbModal,
    private store: Store<PEPState>,
    private datePipe: DatePipe
  ) {
    this.addRefFormIsVisible = false
    this.addXRefFormIsVisible = false
    this.historyIsVisible = false
    this.collapsed = false
    this.isAddingRef = false
    this.isAddingXRef = false
  }

  ngOnInit() {
    this.refs$ = this.store.select(ReferenciasSelectors.referencias)
    this.isLoading$ = this.store.select(ReferenciasSelectors.loading)
    this.error$ = this.store.select(ReferenciasSelectors.error)
    this.success$ = this.store.select(ReferenciasSelectors.success)

    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(res => {
        if (res) {
          this.mpi = res
        }
      })
    )
  }

  openPopOver() {
    this.popover.open()
  }

  ngOnDestroy() {
    this.refSelected = undefined
    this.subs$.unsubscribe()
  }

  async addReferencia(ref: Models.ReferenciaPost): Promise<any> {
    ref.modified_by = this.mpi
    this.store.dispatch(ReferenciasActions.post({ payload: { ref: ref, mpi: this.mpi } }))
  }

  async addContraReferencia(xref: Models.ReferenciaPut) {
    this.isSendingXRef = true
    this.store.dispatch(ReferenciasActions.put({ payload: { ref: this.refSelected, xref: xref } }))
    this.isSendingXRef = false
  }

  resetSuccess() {
    ReferenciasActions.setSuccess({ payload: undefined })
  }

  resetError() {
    ReferenciasActions.setError({ payload: undefined })
  }

  collapse() {
    this.collapsed = !this.collapsed
  }

  close() {
    this.addRefFormIsVisible = false
    setTimeout(() => {
      if (!this.addRefFormIsVisible) {
        this.renderer.setStyle(this.addRefForm.nativeElement, 'display', 'none')
      }
    }, 10)
  }

  closeHistory() {
    this.activeModal.close()
  }

  toggleAddRefForm() {
    this.isAddingRef = true
    if (this.isAddingRef) {
      this.activeModal = this.modalService.open(this.addRefForm, {
        centered: true
      })
    }
  }

  toggleAddXRefForm(e) {
    e.stopPropagation()
    this.isAddingXRef = !this.isAddingXRef
  }

  toggleRefHistory() {
    this.activeModal = this.modalService.open(this.refHistory, {
      centered: true,
      size: 'xl'
    })
    return
  }

  addRefAndPrint(ref, modal) {
    ref.modified_by = this.mpi
    ReferenciasActions.setReferencia({ payload: ref })
    this.store.dispatch(ReferenciasActions.post({ payload: { ref: ref, mpi: this.mpi } }))
    setTimeout(() => {
      this.printRef()
      modal.dismiss()
    }, 2000)
  }

  printRef(referencia?: any) {
    const ref = referencia !== undefined ? JSON.stringify(referencia) : 'REFERÊNCIA NÂO DISPONÍVEL'
    window.open('print-referencia')
  }

  reset() {
    this.isAddingRef = false
    this.isAddingXRef = false
    this.isSendingRef = false
    this.isSendingXRef = false
    this.refSelected = undefined
    this.store.dispatch(ReferenciasActions.setSuccess({ payload: undefined }))
    this.store.dispatch(ReferenciasActions.setError({ payload: undefined }))
  }

  reload() {}
}
