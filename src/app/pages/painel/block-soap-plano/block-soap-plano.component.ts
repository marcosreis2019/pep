import { Location } from '@angular/common'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Events } from 'src/app/providers/events/events.service'

import { Observable } from 'rxjs'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { BeneficiarioModels as Beneficiario } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'

import { SubSink } from 'subsink'
import { DocumentoModels } from 'src/app/_store/_modules/documento/documento.model'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'

export interface SoapItem {
  letter: string
  color: string
  type: string
  limit: number
  action: any
}

@Component({
  selector: 'block-soap-plano',
  templateUrl: './block-soap-plano.component.html',
  styleUrls: ['./block-soap-plano.component.scss']
})
export class BlockSoapPlanoComponent implements OnInit, OnDestroy {
  @Output() event: EventEmitter<any>
  @Output() closeEvent: EventEmitter<any>
  @Output() dataChanged: EventEmitter<{ dataType: string; data: any }>

  @Input() item: SoapItem
  @Input() plano: any

  @ViewChild('prescHistory', { static: false }) refHistory: ElementRef

  beneficiario: Beneficiario.DadosPessoais
  profissional: Profissional
  local: LocalAtendimentoModels.LocalAtendimento

  current: string
  value: string
  hasFocus: boolean
  root: string
  docs: any[]
  sequencialAtendimento: number

  beneficiario$: Observable<Beneficiario.DadosPessoais>
  profissional$: Observable<Profissional>
  mpi: string

  descricao$: Observable<string>

  retorno$: Observable<AtendimentoModel.Retorno>

  private subs$ = new SubSink()

  url = ''

  constructor(
    private loc: Location,
    private events: Events,
    private router: Router,
    private bServ: BeneficiarioService,
    private store: Store<PEPState>,
    private modalService: NgbModal
  ) {
    this.event = new EventEmitter()
    this.closeEvent = new EventEmitter()
    this.dataChanged = new EventEmitter()
    this.value = ''
    this.current = 'documentos'
    this.docs = [
      {
        label: 'Atestado Médico',
        type: 'atestado-medico'
      },
      {
        label: 'Atestado de Aptidão Física',
        type: 'atestado-medico-exame-aptidao-fisica'
      },
      {
        label: 'Declaração de Comparecimento',
        type: 'declaracao-comparecimento'
      },
      {
        label: 'Licença Maternidade',
        type: 'atestado-licenca-maternidade'
      }
    ]
  }

  ngOnInit() {
    if (!this.plano) {
      this.plano = {}
    }
    // TODO remove - use router/location/activedRouter
    this.root = window.location.href.replace(this.loc.path(), '')
    this.listenerPrescricao()

    this.subs$.add(this.store.select(BeneficiarioSelect.mpi).subscribe(mpi => (this.mpi = mpi)))

    this.subs$.add(
      this.store.select(AtendimentoSelect.planoDesc).subscribe(v => (this.value = v || ''))
    )

    this.subs$.add(
      this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(data => {
        this.sequencialAtendimento = data.sequencial
      })
    )

    this.retorno$ = this.store.select(AtendimentoSelect.retorno)

    this.store
      .select(AtendimentoSelect.planoDesc)
      .subscribe(description => (this.value = description || ''))

    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  showCounter(state: boolean) {
    if (state) {
      this.emitFocus()
    }
  }

  send(v: string) {
    if (this.item.action) {
      this.store.dispatch(this.item.action({ payload: v }))
    }
  }

  toggleFocus() {
    this.hasFocus = !this.hasFocus
    this.emitFocus()
  }

  emitFocus() {
    this.event.emit({ action: 'focus', type: this.item.type })
  }

  toggleExamResults() {
    this.event.emit({ action: 'focus', type: 'resultados-exames' })
  }

  changeCurrent(page: string) {
    this.current = page
    this.emitFocus()
  }

  listenerRetorno(evt: AtendimentoModel.Retorno) {
    this.store.dispatch(AtendimentoActions.setRetorno({ payload: evt }))
    // this.dataChanged.emit({ dataType: 'retorno', data: evt })
  }

  listenerPrescricao() {
    this.events.subscribe('nova-prescricao', (data: any) => {
      return this.addPrescricao(data)
    })
  }

  private async addPrescricao(prescricao: any) {
    if (!prescricao) {
      return
    }

    await this.bServ.postPrescricao(this.mpi, prescricao, this.sequencialAtendimento).then(() => {
      return this.events.publish('reload-prescricoes', true)
    })
  }

  showPrescHistory() {
    this.modalService.open(this.refHistory, {
      centered: true
    })
    return
  }

  navigateToDocuments() {
    const url = `${this.url}/documentos`
    window.open(url, '_blank')
  }
}
