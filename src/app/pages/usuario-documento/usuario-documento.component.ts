import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { ActivatedRoute } from "@angular/router"
import moment from 'moment-timezone'

export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-usuario-documento',
  templateUrl: './usuario-documento.component.html',
  styleUrls: ['./usuario-documento.component.scss']
})
export class UsuarioDocumentoComponent implements OnInit {
  @Output() apply: EventEmitter<TimelineFilters>
  form: FormGroup

  documentId: string = undefined
  err: string = ''
  code: string = ''
  document = {
    downloadUrl: '',
    printUrl: '',
    signature: {
      _signers: []
    }
  }
  loading: boolean = true

  constructor(
    private aServ: AtendimentoService,
    private formB: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.apply = new EventEmitter<TimelineFilters>(undefined)
  }

  ngOnInit() {
    this.documentId = this.route.snapshot.paramMap.get("documentId")
    if (this.documentId) {
      this.getDocument()
    } else {
      this.loading = false
    }
  }

  getDocument () {
    this.aServ.getDocumentByCode(this.documentId).subscribe(data => {
      this.getSigners(data.data.link_assinado)
    }, err => {
      this.loading = false
      this.err = 'Documento não encontrado'
    })
  }

  getSigners (fileId) {
    this.aServ.getSigners(fileId).subscribe(data => {
      this.document = data
      this.loading = false
    }, err => {
      this.loading = false
      this.err = 'Ocorreu um erro ao validar as assinaturas.'
    })
  }

  verificarCodigo() {
    const value = this.form.value
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY HH:mm')
  }

  isValid(signer) {
    return !signer._validationResults._errors.length
  }

  getPrintUrl() {
    return `${this.document.printUrl}${this.documentId}`
  }

  isUpload() {
    return !this.documentId && !this.loading
  }

  isInfo() {
    return this.documentId && !this.loading
  }

  fileChange(event) {
    this.loading = true
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.aServ.pdfUpload(file)
      .subscribe((data: any) => {
        this.loading = false
        this.documentId = data.fileId
        this.getSigners(this.documentId)
      }, err => {
        this.loading = false
        this.err = 'Ocorreu um erro ao validar as assinaturas.'
      })
    }
  }
}
