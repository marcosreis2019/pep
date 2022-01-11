import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { merge, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { BeneficiarioModels } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import {
  AlertEvent,
  BlockList
} from 'src/app/components/block-list/block-list.component'

import { BeneficiarioActions } from 'src/app/_store/_modules/beneficiario/beneficiario.action'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'

import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core'
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { SubSink } from 'subsink'

interface ActionEvent {
  type: string
  label: string
  data?: any
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'block-conditions-historico',
  templateUrl: './block-conditions-historico.component.html',
  styleUrls: ['./block-conditions-historico.component.scss']
})
export class BlockConditionsHistoricoComponent implements OnInit, OnDestroy {
  @ViewChild('formC', { static: false }) formCondicao: NgbPopover
  @ViewChild('formM', { static: false }) formMedicamento: NgbPopover
  @ViewChild('formA', { static: false }) formAlergia: NgbPopover

  @Input() acoes:boolean = true

  condicao: BlockList<BeneficiarioModels.Condicao[]>
  medicamento: BlockList<BeneficiarioModels.Medicamento[]>
  alergia: BlockList<BeneficiarioModels.Alergia[]>

  emitEventToCondicao = new Subject<AlertEvent>()
  emitEventToMedicamento = new Subject<AlertEvent>()
  emitEventToAlergia = new Subject<AlertEvent>()
  
  private subs$ = new SubSink()

  public config: PerfectScrollbarConfigInterface = {}

  public mpi: string
  
  constructor(private store: Store<PEPState>) { }

  ngOnInit() {
    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(res => {
        if (res) {
          this.mpi = res
          this.loadCondicao()
          this.loadMedicamento()
          this.loadAlergia()
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  private loadCondicao() {
    this.store.dispatch(BeneficiarioActions.getAllCondicao({payload: this.mpi}))
    this.condicao = {
      title: 'Condições de saúde',
      label: 'condicao',
      filters: ['condicao', 'CID'],
      data$: this.store.select(BeneficiarioSelect.condicoes),
      notifySuccess$: this.listenerSuccess(
        BeneficiarioSelect.condicoesDeleteS,
        BeneficiarioSelect.condicoesPostS
      ),
      notifyFail$: this.listenerFail(
        BeneficiarioSelect.condicoesPostF,
        BeneficiarioSelect.condicoesPostF
      )
    }
  }

  private loadMedicamento() {
    this.store.dispatch(BeneficiarioActions.getAllMedicamento({ payload: this.mpi }))
    this.medicamento = {
      title: 'Medicamentos',
      label: 'medicamento',
      filters: ['medicamento', 'medicamento'],
      data$: this.store.select(BeneficiarioSelect.medicamentos),
      notifySuccess$: this.listenerSuccess(
        BeneficiarioSelect.medicamentosDeleteS,
        BeneficiarioSelect.medicamentosPostS
      ),
      notifyFail$: this.listenerFail(
        BeneficiarioSelect.medicamentosDeleteF,
        BeneficiarioSelect.medicamentosPostF
      )
    }
  }

  private loadAlergia() {
    this.store.dispatch(BeneficiarioActions.getAllAlergia({ payload: this.mpi }))
    this.alergia = {
      title: 'Alergias',
      label: 'agente',
      filters: ['agente', 'tipo'],
      data$: this.store.select(BeneficiarioSelect.alergias),
      notifySuccess$: this.listenerSuccess(
        BeneficiarioSelect.alergiasDeleteS,
        BeneficiarioSelect.alergiasPostS
      ),
      notifyFail$: this.listenerFail(
        BeneficiarioSelect.alergiasDeleteF,
        BeneficiarioSelect.alergiasPostF
      )
    }
  }

  listenerSuccess(del: any, post: any) {
    return merge(this.store.select(del), this.store.select(post))
      .pipe(
        map(r => this.createTooltipAlert('success', r))
      )
  }

  listenerFail(del: any, post: any) {
    return merge(this.store.select(del), this.store.select(post)).pipe(
      map(r => this.createTooltipAlert('error', r))
    )
  }

  // NOTE ---- Condicoes
  eventTriggerCondicao(event: ActionEvent) {
    if (event.type === 'update') {
      this.store.dispatch(
        BeneficiarioActions.putCondicao({ payload: {data: event.data, mpi: this.mpi} })
      )
      return
    }
    if (event.type === 'remove') {
      this.store.dispatch(
        BeneficiarioActions.deleteCondicao({ payload: {data: event.data, mpi: this.mpi} })
      )
      return
    }
    this.formCondicao.open()
  }

  trigAddCondicao(condicao: BeneficiarioModels.CondicaoPost) {
    this.formCondicao.close()
    this.store.dispatch(BeneficiarioActions.postCondicao({ payload: { data: condicao, mpi: this.mpi } }))
  }

  // NOTE ---- Medicamentos
  eventTriggerMedicamento(event: ActionEvent) {
    event.type === 'remove'
      ? this.store.dispatch(
          BeneficiarioActions.deleteMedicamento({ payload: {data: event.data, mpi: this.mpi} })
        )
      : this.formMedicamento.open()
  }

  trigAddMedicamento(medicamento: BeneficiarioModels.MedicamentoPost) {
    this.formMedicamento.close()
    this.store.dispatch(
      BeneficiarioActions.postMedicamento({ payload: { data: medicamento, mpi: this.mpi }})
    )
  }

  //  NOTE ---- Alergias
  eventTriggerAlergia(event: ActionEvent) {
    event.type === 'remove'
      ? this.store.dispatch(
          BeneficiarioActions.deleteAlergia({ payload: {data: event.data, mpi: this.mpi} })
        )
      : this.formAlergia.open()
  }

  trigAddAlergia(alergia: BeneficiarioModels.AlergiaPost) {
    this.formAlergia.close()
    this.store.dispatch(BeneficiarioActions.postAlergia({ payload: { data: alergia, mpi: this.mpi } }))
  }

  async trigAction(data, service, method, emitter, loadAft) {
    const response = await this[service][method](data)

    const tooltipContent = {
      type: response.status === 'OK' ? 'success' : 'error',
      message: response.message
    }

    this[emitter].next(tooltipContent)

    if (response.status === 'OK') {
      this[loadAft]()
    }
  }

  private createTooltipAlert(type: string, message: string): AlertEvent {
    return { type, message }
  }

  cancelAddFormC() {
    this.formCondicao.close()
  }
  cancelAddFormM() {
    this.formMedicamento.close()
  }
  cancelAddFormA() {
    this.formAlergia.close()
  }
}
