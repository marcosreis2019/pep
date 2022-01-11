import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { DocumentoDigitalAssinadoService } from 'src/app/_store/_modules/documento-digital-assinado/documento-digital-assinado.service'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { DocumentoDigitalAssinadoModels } from 'src/app/_store/_modules/documento-digital-assinado/documento-digital-assinado.model'
import { environment } from 'src/environments/environment'
import { SafeUrl } from '@angular/platform-browser'
import { ToastService } from 'angular-toastify'

enum MessageType {
  email = 'email',
  sms = 'sms'
}

@Component({
  selector: 'block-docs-ass-digital',
  templateUrl: './block-docs-ass-digital.component.html',
  styleUrls: ['./block-docs-ass-digital.component.scss']
})
export class BlockDocsAssDigitalComponent implements OnInit, OnDestroy {
  @Input() sequencialAtendimento: number
  @ViewChild('docsAssinados', { static: false }) modalDocsAssinados: ElementRef
  @ViewChild('sendEmailModal', { static: false }) sendEmailModal: ElementRef
  @ViewChild('sendSmsModal', { static: false }) sendSmsModal: ElementRef
  @ViewChild('loadingModal', { static: false }) loadingModal: ElementRef
  listDocsAssinados: DocumentoDigitalAssinadoModels.ItemDocumentoDigital[]
  private subs$ = new SubSink()

  signDocumentDownloadUrl: SafeUrl
  signedFileSuffix = '-signed'
  signFileId = 'filename.pdf'
  documentCode = ''
  documentId = ''
  saved = false
  error = ''
  success = ''
  message = ''
  email = ''
  smsEmailTitle = 'Documentos Digitais'
  subject = ''
  phone = ''
  selectedItem: any
  waitingToConfirmDocDelete = false
  activeItem

  type: string
  doc: any

  arrayOfDocsToSend = []
  form: FormGroup
  mpi = ''
  profissionalNome

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private store: Store<PEPState>,
    private docAssinadoServ: DocumentoDigitalAssinadoService,
    private atendimentoService: AtendimentoService,
    private toastService: ToastService
  ) {
    this.form = this.formBuilder.group(
      {
        email: [null, null],
        phone: [null, null]
      },
      { updateOn: 'change' }
    )
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  getDocumentoAssinadoByIdAtendimento() {
    this.subs$.add(
      this.docAssinadoServ
        .getDocumentosBySequencialAtendimento(this.sequencialAtendimento)
        .subscribe(
          (res: any) => {
            if (res) {
              this.listDocsAssinados = res.data
              this.modalService.open(this.modalDocsAssinados, {
                centered: true,
                size: 'lg'
              })
            }
          },
          err => {
            this.toastService.error("Não foi possível carregar histórico de documentos assinados!")
            console.error(err)
          }
        )
    )
  }

  openModalDocAssinados() {
    this.arrayOfDocsToSend = []
    this.getDocumentoAssinadoByIdAtendimento()
    return
  }

  showError(msg: string = '') {
    this.error = msg
  }

  getDownloadLink(item) {
    return `${environment.QDS_URL_API}/download?fileId=${item.link_assinado}`
  }

  toggleDocToSendArray = doc => {
    if (this.arrayOfDocsToSend.includes(doc)) {
      this.arrayOfDocsToSend = this.arrayOfDocsToSend.filter(item => item !== doc)
      return
    }
    this.arrayOfDocsToSend.push(doc)
  }

  public openSendEmail = () => {
    this.openLoading()
    const assinaturas_id = this.arrayOfDocsToSend.map(item => {
      return item.id
    })
    this.atendimentoService
      .getMessages(assinaturas_id, MessageType.email, this.sequencialAtendimento)
      .subscribe(
        data => {
          this.closeAllModal()
          this.message = data.data
          this.modalService.open(this.sendEmailModal, {
            centered: true,
            size: 'lg'
          })
        },
        err => {
          this.toastService.error(`Erro ao tentar buscar mensagem do email: ${err.error}.`)
        }
      )
  }

  sendEmail = () => {
    const email = this.form.get('email').value
    if (!email) {
      this.toastService.info("Email inválido!")
      return
    }
    let assinaturas_id = this.arrayOfDocsToSend.map(item => {
      return item.id
    })
    this.atendimentoService
      .sendEmailSms(this.sequencialAtendimento, assinaturas_id, email, 'email')
      .subscribe(
        data => {
          this.showSuccess('Email enviado.')
          this.closeAllModal()
          this.arrayOfDocsToSend = []
        },
        err => {
          console.error(`Error: ${err.Error}`)
          this.toastService.warn("Serviço de Email indisponível!")
        }
      )
  }

  // open send SMS modal
  public openSendSMS = () => {
    this.openLoading()
    const assinaturas_id = this.arrayOfDocsToSend.map(item => {
      return item.id
    })
    this.atendimentoService
      .getMessages(assinaturas_id, MessageType.sms, this.sequencialAtendimento)
      .subscribe(
        data => {
          this.message = data.data
          this.modalService.open(this.sendSmsModal, {
            centered: true,
            size: 'lg'
          })
        },
        err => {
          console.error(`Error: ${err}`)
          this.toastService.warn("Serviço de SMS indisponível!")
        }
      )
  }

  sendSms = () => {
    let phone = '55' + this.form.get('phone').value
    phone = phone.replace(/[^\d]+/g, '')
    if (phone && phone.length === 13) {
      let assinaturas_id = this.arrayOfDocsToSend.map(item => {
        return item.id
      })
      this.atendimentoService
        .sendEmailSms(this.sequencialAtendimento, assinaturas_id, phone, 'sms')
        .subscribe(
          data => {
            this.showSuccess('Sms enviado.')
            this.closeAllModal()
            this.arrayOfDocsToSend = []
          },
          err => {
            console.error(`Error sending SMS: ${err.error}`)
            this.toastService.warn("Serviço de SMS indisponível!")
          }
        )
    } else {
      this.toastService.info("Número do celular inválido!")
    }
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

  resetToast() {
    this.error = ''
    this.success = ''
  }

  showSuccess(msg: string = '') {
    this.success = msg
  }

  toggleDocDelete(index) {
    this.activeItem = this.activeItem === index ? undefined : index
    this.waitingToConfirmDocDelete = !this.waitingToConfirmDocDelete
  }

  deleteDoc(index, doc) {
    this.docAssinadoServ.deleteDocument(doc.id).subscribe(
      (res: any) => {
        if (res) {
          this.showSuccess('Documento exluido!')
        }
      },
      err => {
        this.toastService.error("Ocorreu um erro ao tentar excluir o documento!")
        console.error(err)
      }
    )
    this.activeItem = this.activeItem === index ? undefined : index
    this.waitingToConfirmDocDelete = !this.waitingToConfirmDocDelete
    if (this.listDocsAssinados.includes(doc)) {
      this.listDocsAssinados = this.listDocsAssinados.filter(item => item !== doc)
    }
  }
}
