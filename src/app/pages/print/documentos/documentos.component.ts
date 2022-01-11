import { Component, HostListener, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { ReferenciasModels } from 'src/app/_store/_modules/referencias/referencias.models'
import { AtestadoComponent } from './atestado/atestado.component'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { SubSink } from 'subsink'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { DocumentoModels } from 'src/app/_store/_modules/documento/documento.model'
import { DocumentoService } from 'src/app/_store/_modules/documento/documento.service'
import { ToastService } from 'angular-toastify'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'

@Component({
  selector: 'documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit, OnDestroy {
  @ViewChild('signModal', { static: false }) signModal: ElementRef
  @ViewChild('loadingModal', { static: false }) loadingModal: ElementRef

  signDocumentDownloadUrl: SafeUrl
  signedFileSuffix: string = '-signed'
  signFileId: string = 'filename.pdf'
  documentoAssinado: boolean = false
  documentId: string = ''
  saved: boolean = false
  error: string = ''
  success: string = ''
  message: string = ''
  subject: string = ''
  phone: string = ''
  documentoModel = Object.values(DocumentoModels.DOCUMENTO_MODELOS).sort()

  type: string
  doc: DocumentoModels.Documento = DocumentoModels.getDefault()
  form: FormGroup

  beneficiario: any
  local: LocalAtendimentoModels.LocalAtendimento
  ref: ReferenciasModels.Referencia
  mpi: string
  certificado: any = undefined
  listCertificados = []
  atendimentoSequential: Number
  private subs$ = new SubSink()
  isPdfOpen: boolean = false

  @ViewChild(AtestadoComponent, { static: false })
  atestadoMedico: AtestadoComponent
  verifyRequired =
    "carteiraProfissionalNumero.hasError('required') && !carteiraProfissionalNumero.dirty"
  verifyPattern =
    "carteiraProfissionalNumero.hasError('pattern') && carteiraProfissionalNumero.dirty"
  verifyBoth =
    "(carteiraProfissionalNumero.hasError('required') && !carteiraProfissionalNumero.dirty) || (carteiraProfissionalNumero.hasError('pattern') && carteiraProfissionalNumero.dirty)"

  url = ''

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private store: Store<PEPState>,
    private atendimentoService: AtendimentoService,
    private documentoService: DocumentoService,
    protected sanitizer: DomSanitizer,
    private router: Router,
    private toastService: ToastService
  ) {
    this.form = this.formBuilder.group(
      {
        municipioNome: [null, [Validators.required]],
        data: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(
              // /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/
              /^([0-2]?[0-9]|(3)[0-1])(\/)(((0)[0-9])|([0-9])|((1)[0-2]))(\/)\d{4}$/
            )
          ])
        ],
        horario: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
          ])
        ],
        email: [null, null],
        phone: [null, null]
      },
      { updateOn: 'change' }
    )
  }

  ngOnInit() {
    this.documentoAssinado = false
    this.loadDocumentByIdParams()

    this.subs$.add(
      this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(data => {
        this.atendimentoSequential = data.sequencial
      })
    )
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event) {
    console.info('Before print')
  }

  loadDocumentByIdParams() {
    this.route.queryParams.subscribe(data => {
      const idDocumento = Number(data['idDocumento'])
      this.documentoService.getDocById(idDocumento).subscribe(
        (res: any) => {
          if (res.data.atendimento_sequencial == this.atendimentoSequential) {
            this.doc = { ...res.data }
          } else {
            console.error('Documento não pertence a este atendimento!')
            this.router.navigate(['login'])
          }
        },
        err => {
          console.error(err.error)
        }
      )
    })
  }

  onChange(event: any) {
    this.form.get(event.target.name).patchValue(event.target.value)
    this.doc[`${event.target.name}`] = event.target.value
  }

  onChildChange(event: any) {
    Object.assign(this.doc, event)
  }

  print() {
    window.print()
  }

  public signDocument = async () => {
    this.openLoading()
    this.isPdfOpen = true
    await this.hideFields()
    html2canvas(document.querySelector('#documentoMedico')).then(canvas => {
      var pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height])
      var imgData = canvas.toDataURL('image/jpeg', 1.0)
      pdf.addImage(imgData, 100, 0, canvas.width - 150, canvas.height)

      this.atendimentoService.pdfUpload(pdf.output('blob')).subscribe(
        (data: any) => {
          this.closeAllModal()
          this.signFileId = data.fileId
          this.signDocumentDownloadUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.signUrl)
          this.signedFileSuffix = data.signedFileSuffix
          this.openSignModal()
        },
        err => {
          this.closeAllModal()
          this.toastService.warn('Serviço de assinatura não disponível!')
        }
      )
    })
  }

  public openSignModal = () => {
    this.modalService.open(this.signModal, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
  }

  public closeSignModal = async () => {
    this.closeAllModal()
    this.openLoading()
    let prefix = this.signFileId.replace('.pdf', '')
    this.atendimentoService.getDocumentList(prefix).subscribe(
      (data: Array<any>) => {
        let originalFileId = ''
        let signedFileId = ''
        data.forEach(item => {
          if (item.Key.includes(this.signedFileSuffix)) {
            signedFileId = item.Key
          } else {
            originalFileId = item.Key
          }
        })
        if (signedFileId) {
          this.postSignedDocument(originalFileId, signedFileId)
        } else {
          this.toastService.warn(
            'Não foi possível encontrar o documento assinado, tente novamente!'
          )
          this.closeAllModal()
        }
      },
      err => {
        this.toastService.error('Ocorreu um erro, tente novamente!')
        this.closeAllModal()
      }
    )
  }

  private postSignedDocument(originalFileId, signedFileId) {
    const fileId = this.signFileId.replace('.pdf', '')
    const atendimentoSequential = this.atendimentoSequential
    const patientMpi = this.doc.beneficiario_mpi
    const professionalMpi = this.doc.profissional_mpi
    const documentos_id = this.doc.id
    this.atendimentoService
      .postSignedDocument(
        documentos_id,
        atendimentoSequential,
        patientMpi,
        professionalMpi,
        originalFileId,
        signedFileId,
        fileId
      )
      .subscribe(
        res => {
          this.documentoAssinado = true
          this.closeAllModal()
        },
        err => {
          this.documentoAssinado = false
          this.toastService.error(
            'Não foi possível registrar o documento no atendimento, entre em contato com o administrador!'
          )
          this.closeAllModal()
        }
      )
  }

  navigateToDocuments() {
    this.router.navigate([`${this.url}/documentos`])
  }

  public openLoading = () => {
    this.modalService.open(this.loadingModal, {
      centered: true,
      size: 'sm',
      backdrop: 'static'
    })
  }

  public closeAllModal = () => {
    this.modalService.dismissAll()
  }

  get municipioNome() {
    return this.form.get('municipioNome')
  }
  get data() {
    return this.form.get('data')
  }

  hideFields = async () => {
    await document
      .querySelector('#documentoMedico')
      .querySelectorAll('.hide-pdf')
      .forEach(element => {
        element.classList.add('hide')
        element.classList.remove('show')
      })
    await document
      .querySelector('#documentoMedico')
      .querySelectorAll('.show-pdf')
      .forEach(element => {
        element.classList.add('show')
        element.classList.remove('hide')
      })
  }

  showFields = async () => {
    await document
      .querySelector('#documentoMedico')
      .querySelectorAll('.show-pdf')
      .forEach(element => {
        element.classList.add('hide')
        element.classList.remove('show')
      })
    await document
      .querySelector('#documentoMedico')
      .querySelectorAll('.hide-pdf')
      .forEach(element => {
        element.classList.add('show')
        element.classList.remove('hide')
      })
  }

  save() {
    this.saved = true
    this.hideFields()
  }

  back() {
    this.saved = false
    this.showFields()
  }

  resetToast() {
    this.error = ''
    this.success = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }

  showSuccess(msg: string = '') {
    this.success = msg
  }
}
