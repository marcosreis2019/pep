import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { Observable, of } from 'rxjs'
import { SoapItem } from 'src/app/pages/painel/block-soap/block-soap.component'
import { MemedService } from 'src/app/_store/services/memed/memed.service'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { SubSink } from 'subsink'
import { AVALIACAO, MOTIVO, OBJETIVO, PLANO, SUBJETIVO } from './painel-historico.default-values'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
@Component({
  selector: 'painel-historico',
  templateUrl: './painel-historico.component.html',
  styleUrls: ['./painel-historico.component.scss']
})
export class PainelHistoricoComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) modal: NgbModal
  @ViewChild('soapPlano', { static: false }) plan: ElementRef
  form: FormGroup
  collapse: boolean

  $loading: Observable<boolean>
  listProntuariosSelecionados: any[] = []
  list: any[] = []

  new: boolean
  sending: boolean
  msgError: string
  motivo: SoapItem = MOTIVO
  subjetivo: SoapItem = SUBJETIVO
  objetivo: SoapItem = OBJETIVO
  plano: SoapItem = PLANO
  avaliacao: SoapItem = AVALIACAO
  currentFocus: string
  loading: boolean = false
  pepRightExpandido: boolean = false

  public config: PerfectScrollbarConfigInterface = {}

  private subs$ = new SubSink()

  sequential: Number
  tiposServicos: Array<TipoServicoModels.TipoServico> = []
  classificacoes: Array<ClassificacaoModels.Classificacao> = []

  mpi: string
  listErrorMsg: string

  constructor(
    config: NgbModalConfig,
    private memedService: MemedService,
    private router: Router,
    private modalServ: NgbModal,
    private tipoServicoServ: TipoServicoService,
    private classificacaoServ: ClassificacaoService,
    private store: Store<PEPState>,
    private eventServ: EventosService
  ) {
    config.backdrop = 'static'
    config.keyboard = false
    this.subjetivo = { ...this.subjetivo, action: AtendimentoActions.updateDescSubjetivo }
    this.objetivo = { ...this.objetivo, action: AtendimentoActions.updateDescObjetivo }
    this.avaliacao = { ...this.avaliacao, action: AtendimentoActions.updateDescAvaliacao }
    this.plano = { ...this.plano, action: AtendimentoActions.updateDescPlano }
  }

  ngOnInit() {
    this.tipoServicoServ.getTiposServicos().subscribe(
      (data: TipoServicoModels.TipoServicoPEPApi) => {
        this.tiposServicos = data.data
      },
      err => {
        console.error(err)
      }
    )
    this.classificacaoServ.getClassificacoes().subscribe(
      (data: Array<ClassificacaoModels.Classificacao>) => {
        this.classificacoes = data
      },
      err => {
        console.error(err)
      }
    )
    this.store.select(ProfissionalSelect.profissional).subscribe(
      (data: Profissional) => {
        if (data && data.memedAtivo) {
          this.memedService.checkMemed()
        }
      },
      err => {
        console.error(err)
      }
    )

    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(mpi => {
        if (mpi) {
          this.mpi = mpi
          this.loadEvents(mpi)
        }
      })
    )

    this.currentFocus = 'subjetivo' // TODO ajustar para subjetivo

    setTimeout(() => {
      this.$loading = of(false)
    }, 2000)
  }

  expandirPepRight() {
    this.pepRightExpandido = !this.pepRightExpandido
  }

  ngOnDestroy() {
    if (this.subs$) {
      this.subs$.unsubscribe()
    }
  }

  setListProntuario(list: any) {
    this.listProntuariosSelecionados = list
  }

  setLoading(value: boolean): void {
    this.loading = value
  }

  foundData(evt: any, typ?: string) {
    if (!evt) {
      this.router.navigate(['not-found', { type: typ }])
      return
    }
  }

  getPlano() {
    return this.form.get('plano').value
  }

  handlerToggleInSoap(event: { action: string; type?: string; value?: any }) {
    if (event.action === 'focus') {
      if (event.type === 'plano') {
        this.collapse = event.type === 'plano'
        this.scrollPlan()
      }
      return this.soapActionFocus(event.type)
    }
  }

  private soapActionFocus(type: string) {
    this.currentFocus = type
  }

  handlerDataInPlano(event: any) {
    this.form
      .get('plano')
      .get(event.dataType)
      .setValue(event.data)
  }

  open() {
    this.modalServ.open(this.modal)
  }

  scrollPlan() {
    this.plan.nativeElement.scrollIntoView({ behavior: 'smooth' })
  }

  filtrarLista(list: any[]) {
    this.list = list
  }

  async loadEvents(mpi: string) {
    try {
      const res = await this.eventServ.getLatests(mpi)

      this.listErrorMsg = res.message

      if (res.status === 'error') {
        return
      }

      if (!res.data.length) {
        this.listErrorMsg = 'Nenhum evento registrado nos últimos 18 meses'

        this.list = []
        return
      }
      this.list = [...res.data]
    } catch (e) {
      console.error(e)
    }
  }
}
