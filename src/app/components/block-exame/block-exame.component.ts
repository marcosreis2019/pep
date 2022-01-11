import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { ExamesActions } from 'src/app/_store/_modules/exames/exames.actions'
import { ExamesModels as Models } from 'src/app/_store/_modules/exames/exames.models'
import { ExamesSelectors } from 'src/app/_store/_modules/exames/exames.selectors'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { SubSink } from 'subsink'

@Component({
  selector: 'block-exame',
  templateUrl: './block-exame.component.html',
  styleUrls: ['./block-exame.component.scss']
})
export class BlockExameComponent implements OnInit, OnDestroy {
  @ViewChild('addExamForm', { static: false }) addExamForm: ElementRef
  @ViewChild('examHistory', { static: false }) examHistory: ElementRef

  @Input() mpi: string

  @Output() toggleExamResultsToParent: EventEmitter<boolean>

  local: any
  exames$: Observable<Models.Exame[]>
  exameList: Models.Exame[]
  selectedExame: Models.Exame

  isLoading$: Observable<boolean>
  isExpanded: boolean
  isAddingExam: boolean
  isSendingExam: boolean
  isAddingAndPrintingExam: boolean
  isEditingObservation: boolean

  activeItem: number

  error$: Observable<string>
  success$: Observable<string>
  msgAlert: string
  closeResult: string
  observationText: string

  formLab: FormGroup
  formImagem: FormGroup
  local$: Observable<LocalAtendimentoModels.LocalAtendimento>
  exame: Models.Exame
  showExameResultsPage: boolean
  isEditingExam = true
  private subs$ = new SubSink()

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store<PEPState>,
    private formBuilder: FormBuilder
  ) {
    this.toggleExamResultsToParent = new EventEmitter()
    this.isAddingExam = false
  }

  ngOnInit() {
    this.formLab = this.formBuilder.group({
      descricao: [undefined, Validators.required]
    })

    this.formImagem = this.formBuilder.group({
      descricao: [undefined, Validators.required],
      observacoes: [undefined],
      existingObservations: [undefined]
    })

    this.local$ = this.store.select(LocalSelect.local)

    this.exames$ = this.store.select(ExamesSelectors.exames)

    this.isLoading$ = this.store.select(ExamesSelectors.loading).pipe(
      map(response => {
        return response
      })
    )

    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(data => {
        if (data) {
          this.mpi = data
        }
      })
    )

    this.error$ = this.store.select(ExamesSelectors.error)
    this.success$ = this.store.select(ExamesSelectors.success)
  }

  ngOnDestroy() {
    this.selectedExame = undefined
    this.subs$.unsubscribe()
  }

  addExame(examType) {
    if (examType === 'laboratorial' && this.formLab.invalid) {
      return
    }
    if (examType === 'imagem' && this.formImagem.invalid) {
      return
    }

    if (examType === 'laboratorial') {
      this.exame = {
        descricao: this.formLab.value.descricao,
        tipo: examType,
        observacoes: this.formLab.value.observacoes,
        dataSolicitacao: this.setDocumentDate()
      }
      this.formLab.reset()
    }

    if (examType === 'imagem') {
      this.exame = {
        descricao: this.formImagem.value.descricao,
        tipo: examType,
        observacoes: this.formImagem.value.observacoes,
        dataSolicitacao: this.setDocumentDate()
      }
      this.formImagem.reset()
    }

    this.store.dispatch(ExamesActions.add({ payload: this.exame }))
    return this.exame
  }

  setDocumentDate() {
    const date = new Date()
    const formatedDate = date.toLocaleDateString('pt-BR', {
      // you can skip the first argument
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    return formatedDate
  }

  saveObservation(exam, index) {
    this.selectedExame = exam

    const exameWithObservations = { ...exam }
    exameWithObservations['observacoes'] = this.formImagem.value.existingObservations

    this.store.dispatch(
      ExamesActions.put({ payload: { exame: exameWithObservations, index: index, mpi: this.mpi } })
    )
    this.isEditingObservation = false
  }

  editObservation(exam, index) {
    if (exam.observacoes) {
      this.formImagem.patchValue({
        existingObservations: exam.observacoes
      })
    }
    this.isEditingObservation = true
  }

  removeExame(exame: Models.Exame) {
    this.store.dispatch(ExamesActions.remove({ payload: exame }))
  }

  toggleItemDetails(index: number, exam: Models.Exame) {
    // Se está editando uma observacao no exame e clica em outro, a edição deve parar
    this.isEditingObservation = false

    this.reset()
    this.activeItem = this.activeItem === index ? undefined : index
    this.selectedExame = !this.selectedExame ? exam : undefined
  }

  reset() {
    this.isAddingExam = false
    this.isSendingExam = false
    this.selectedExame = undefined
    this.store.dispatch(ExamesActions.setSuccess({ payload: undefined }))
    this.store.dispatch(ExamesActions.setError({ payload: undefined }))
  }

  reload() {
    this.store.dispatch(ExamesActions.getAll({ payload: this.mpi }))
  }

  toggleAddExamForm() {
    this.isAddingExam = true

    // envia sinal para que o block changeable de resultsdos cancele a edição de exames
    this.store.dispatch(ExamesActions.toggleEditingResults({ payload: false }))

    if (this.isAddingExam) {
      this.modalService.open(this.addExamForm, {
        centered: true,
        size: 'lg'
      })
    }
  }

  toggleExamHistory() {
    this.modalService.open(this.examHistory, {
      centered: true,
      size: 'lg'
    })
    return
  }

  toggleExamResults() {
    this.toggleExamResultsToParent.emit(true)
    this.store.dispatch(ExamesActions.toggleEditingResults({ payload: false }))
  }
}
