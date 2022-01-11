import { Component, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'

import { ExamesModels as Models } from 'src/app/_store/_modules/exames/exames.models'
import { ExamesActions } from 'src/app/_store/_modules/exames/exames.actions'
import { ExamesSelectors } from 'src/app/_store/_modules/exames/exames.selectors'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'

import { SubSink } from 'subsink'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { map } from 'rxjs/operators'
import { ArquivoService } from 'src/app/_store/services/arquivos/arquivo.service'
import { environment } from 'src/environments/environment'
import { ToastService } from 'angular-toastify'

@Component({
  selector: 'block-changeable-resultados-exames',
  templateUrl: './block-changeable-resultados-exames.component.html',
  styleUrls: ['./block-changeable-resultados-exames.component.scss']
})
export class BlockChangeableResultadosExamesComponent implements OnInit, OnDestroy {
  isEditingResults$: Observable<boolean>

  loadingFile = false
  uploadedFiles: any[] = []
  private baseDownloadDigitalSigner

  constructor(
    private store: Store<PEPState>,
    private formBuilder: FormBuilder,
    private router: Router,
    private arquivoService: ArquivoService,
    private toastService: ToastService
  ) {
    this.baseDownloadDigitalSigner = `${environment.QDS_URL_API}/download?fileId=`
  }

  get dataExecucao() {
    return this.formResults.get('dataExecucao')
  }
  get unidade() {
    return this.formResults.get('unidade')
  }
  get clinica() {
    return this.formResults.get('clinica')
  }
  get valorReferenciaMinimo() {
    return this.formResults.get('valorReferenciaMinimo')
  }
  get valorReferenciaMaximo() {
    return this.formResults.get('valorReferenciaMaximo')
  }
  get valor() {
    return this.formResults.get('valor')
  }
  decodedFiles: void
  // variaveis para controle de fluxo
  isExpanded: boolean
  isSendingExam: boolean
  isEditingExam: boolean
  showExameResultsPage: boolean
  isLoading$: Observable<boolean>

  exames$: Observable<Models.Exame[]>
  exame: Models.Exame
  selectedExame: Models.Exame
  selectedExameIndex: number
  activeItem: number

  local$: Observable<LocalAtendimentoModels.LocalAtendimento>
  mpi: string

  // propriedades usadas para popular as textareas com ngModel
  observationText: string
  interpretationText: string

  error$: Observable<string>
  success$: Observable<string>

  private subscriptions = new SubSink()

  examesLabList: Models.Exame[]
  examesImagemList: Models.Exame[]
  examesList: Models.Exame[]

  formResults: FormGroup

  examFile

  perfectScrollbarConfig: PerfectScrollbarConfigInterface = {
    // wheelPropagation: true,
    suppressScrollX: true
    // useBothWheelAxes: false,
    // minScrollbarLength: 100
  }

  ngOnInit() {
    this.isEditingExam = false
    this.examesLabList = []
    this.examesImagemList = []

    this.subscriptions.add(
      this.store.select(ExamesSelectors.exames).subscribe(exames => {
        if (exames) {
          this.examesLabList = exames.filter(exame => exame.tipo === 'laboratorial')
          this.examesImagemList = exames.filter(exame => exame.tipo === 'imagem')
        }
        this.examesList = exames || []
      }),
      // evento que vem do block exames pra solicitar cancelar edição de resultados
      this.store.select(ExamesSelectors.isEditingResults).subscribe(cancel => {
        cancel ? (this.isEditingExam = true) : (this.isEditingExam = false)
      })
    )

    const onlyNumbersRegex = /^[0-9]*$/

    var anoAtual = new Date().getFullYear()

    const ddmmYYRegexString =
      '^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](199[0-9]|200[0-9]|201[0-9]|' +
      (anoAtual - 1) +
      '|' +
      anoAtual +
      ')$'

    const ddmmYYRegex = new RegExp(ddmmYYRegexString)

    this.formResults = this.formBuilder.group({
      descricao: [undefined, Validators.required],
      observacoes: [undefined],
      dataSolicitacao: [
        undefined,
        Validators.compose([Validators.required, Validators.pattern(ddmmYYRegex)])
      ],
      dataExecucao: [
        undefined,
        Validators.compose([Validators.required, Validators.pattern(ddmmYYRegex)])
      ],
      clinica: [undefined, Validators.required],
      unidade: [undefined, Validators.required],
      valorReferenciaMinimo: [
        undefined,
        Validators.compose([Validators.required, Validators.pattern(onlyNumbersRegex)])
      ],
      valorReferenciaMaximo: [
        undefined,
        Validators.compose([Validators.required, Validators.pattern(onlyNumbersRegex)])
      ],
      valor: [
        undefined,
        Validators.compose([Validators.required, Validators.pattern(onlyNumbersRegex)])
      ],
      interpretacao: [undefined],
      arquivo: [undefined]
    })

    this.subscriptions.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(res => {
        if (res) {
          this.mpi = res
        }
      })
    )

    this.isLoading$ = this.store.select(ExamesSelectors.loading)
    this.error$ = this.store.select(ExamesSelectors.error)
    this.success$ = this.store.select(ExamesSelectors.success)
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe()
  }

  reload() {
    this.store.dispatch(ExamesActions.getAll({ payload: this.mpi }))
  }

  reset() {
    this.isEditingExam = false
    this.selectedExame = undefined
    this.formResults.reset()
    this.store.dispatch(ExamesActions.setSuccess({ payload: undefined }))
    this.store.dispatch(ExamesActions.setError({ payload: undefined }))
    this.store.dispatch(ExamesActions.toggleEditingResults({ payload: false }))
  }

  toggleItemDetails(index: number, exame: Models.Exame) {
    // Se está editando uma observacao no exame e clica em outro, a edição deve parar
    this.isEditingExam = true
    this.store.dispatch(ExamesActions.toggleEditingResults({ payload: true }))

    // this.reset()
    this.selectedExame = exame
    this.selectedExameIndex = index
    this.fillFields(exame)

    this.activeItem = this.activeItem === index ? undefined : index
    // this.selectedExame = !this.selectedExame ? exame : undefined
  }

  fillFields(exame: Models.Exame) {
    this.uploadedFiles = []
    if (exame) {
      this.formResults.controls.observacoes.setValue(exame.observacoes)
      this.formResults.patchValue({
        descricao: exame ? exame.descricao : '',
        dataSolicitacao: exame ? exame.dataSolicitacao : '',
        dataExecucao: exame ? exame.dataExecucao : ''
      })
      if (exame.resultados) {
        this.formResults.controls.interpretacao.setValue(
          exame.resultados.interpretacao ? exame.resultados.interpretacao : ''
        )
        this.formResults.patchValue({
          unidade: exame.resultados.unidade ? exame.resultados.unidade : '',
          clinica: exame.resultados.clinica ? exame.resultados.clinica : '',
          valorReferenciaMinimo: exame.resultados.valorReferenciaMinimo
            ? exame.resultados.valorReferenciaMinimo
            : '',
          valorReferenciaMaximo: exame.resultados.valorReferenciaMaximo
            ? exame.resultados.valorReferenciaMaximo
            : '',
          valor: exame.resultados.valor ? exame.resultados.valor : '',
          arquivos: exame.resultados.arquivos ? exame.resultados.arquivos : []
        })
        this.uploadedFiles = exame.resultados.arquivos
          ? exame.resultados.arquivos.map(item => {
              return {
                downloadUrl: `${this.baseDownloadDigitalSigner}${item}`,
                fileName: item
              }
            })
          : []
      }
    }
  }

  uploadFile(files) {
    this.arquivoService.getSignedUrl().subscribe(
      data => {
        const signedUrl = data.url
        const fileName = data.fileId
        const fileData = {
          downloadUrl: `${this.baseDownloadDigitalSigner}${fileName}`,
          fileName
        }
        this.loadingFile = true
        this.arquivoService.putFile(files[0], signedUrl).subscribe(
          _ => {
            this.loadingFile = false
            this.uploadedFiles.push(fileData)
            this.toastService.success('Arquivo enviado.')
          },
          err => {
            this.loadingFile = false
            this.toastService.error('Não foi possível enviar o arquivo do exame.')
            console.error(err)
          }
        )
      },
      err => {
        this.toastService.error('Não foi possível enviar o arquivo do exame.')
        console.error(err)
      }
    )
  }

  saveResults(exam: Models.Exame, index: number) {
    this.selectedExame = exam

    const exameWithResults = { ...exam }
    exameWithResults.resultados = { ...exam.resultados }

    exameWithResults['descricao'] = this.formResults.value.descricao
    exameWithResults['observacoes'] = this.formResults.value.observacoes
    exameWithResults['dataSolicitacao'] = this.formResults.value.dataSolicitacao
    exameWithResults['dataExecucao'] = this.formResults.value.dataExecucao
    exameWithResults['resultados']['clinica'] = this.formResults.value.clinica
    exameWithResults['resultados']['unidade'] = this.formResults.value.unidade
    exameWithResults['resultados'][
      'valorReferenciaMinimo'
    ] = this.formResults.value.valorReferenciaMinimo
    exameWithResults['resultados'][
      'valorReferenciaMaximo'
    ] = this.formResults.value.valorReferenciaMaximo
    exameWithResults['resultados']['valor'] = this.formResults.value.valor
    exameWithResults['resultados']['interpretacao'] = this.formResults.value.interpretacao
    exameWithResults['resultados']['arquivos'] = this.uploadedFiles.map(item => {
      return item.fileName
    })

    this.store.dispatch(
      ExamesActions.put({ payload: { exame: exameWithResults, index: index, mpi: this.mpi } })
    )
    setTimeout(() => {
      if (!this.isLoading$) {
        this.cancelEdit()
      }
    }, 1500)
  }

  editResults(exam: Models.Exame, index?: number) {
    if (exam.observacoes) {
      this.formResults.patchValue({
        existingObservations: exam.observacoes
      })
    }
    this.isEditingExam = true
  }

  removeExame(exame: Models.Exame) {
    this.store.dispatch(ExamesActions.remove({ payload: exame }))
  }

  toggleExamResults(event) {
    this.showExameResultsPage = !this.showExameResultsPage
  }

  cancelEdit() {
    this.isEditingExam = false
    this.reset()
  }
}
