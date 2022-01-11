import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { NgbPopover, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { merge, Observable, of, Subject, Subscription } from 'rxjs'
import { debounceTime, filter, mergeMap, switchMap } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { ReferenciasModels as Models } from 'src/app/_store/_modules/referencias/referencias.models'
import { ReferenciasService } from 'src/app/_store/_modules/referencias/referencias.service'
import { ReferenciasSelectors } from 'src/app/_store/_modules/referencias/referencias.selectors'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { CidModel, CidService } from 'src/app/_store/services/cid/cid.service'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'

interface PgConfig {
  page: number
  maxPage: number
  offset: number
  size: number
}
@Component({
  selector: 'modal-cids',
  templateUrl: './modal-cids.component.html',
  styleUrls: ['./modal-cids.component.scss']
})
export class ModalCIDsComponent implements OnInit, OnDestroy {
  @ViewChild('p1', { static: false }) popover: NgbPopover
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  valuePesquisaConfirmado: any
  valuePesquisaSuspeito: any

  loadingSearch = false

  @Output() close = new EventEmitter<boolean>()
  isLoading$: Observable<boolean>
  error$: Observable<string>
  success$: Observable<string>
  pgConfigInit: PgConfig
  pgConfig: PgConfig
  filterNull: Models.ReferenciaHistoricoFiltro
  filter: Models.ReferenciaHistoricoFiltro
  filterSearch: Models.ReferenciaHistoricoFiltro
  filterActived = false
  refs: any[]
  key: string
  sub$: Subscription
  dateStart: any
  dateEnd: any
  date: any
  errorMsg: any
  isAddingXRef: any
  successMsg: any
  activeItem: any
  refSelected: any
  isAddingRef: any
  isSendingXRef: any
  isSendingRef: any

  listCIDsSecundariosConfirmados: any[] = []
  cidSecundarioConfirmado:any = null

  listCIDsSecundariosSuspeitos: any[] = []
  cidSecundarioSuspeito: any = null

  constructor(
    private store: Store<PEPState>,
    private refServ: ReferenciasService,
    private cidServ: CidService
  ) {}

  ngOnInit() {
    this.error$ = this.store.select(ReferenciasSelectors.error)
    this.isLoading$ = this.store.select(ReferenciasSelectors.loading)
    this.success$ = this.store.select(ReferenciasSelectors.success)
    this.pgConfigInit = {
      page: 1,
      maxPage: 2,
      offset: 0,
      size: 10
    }

    this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(
      dataAtendimento => {
        this.listCIDsSecundariosConfirmados = [...dataAtendimento.avaliacao.cidSecundariosConfirmados]
        this.listCIDsSecundariosSuspeitos = [...dataAtendimento.avaliacao.cidSecundariosSuspeitos]
      },
      err => {
        console.error(err)
      }
    )

    this.pgConfig = { ...this.pgConfigInit }
    this.initFilter()
  }

  setCidSecundarioConfirmado(cid: any) {
    this.cidSecundarioConfirmado = cid;
  }

  setCIDsSecundariosConfirmados() {
    this.valuePesquisaConfirmado = null
    if (this.cidSecundarioConfirmado) {
      this.listCIDsSecundariosConfirmados.push({...this.cidSecundarioConfirmado})
      this.cidSecundarioConfirmado = null
      this.setStoreCIDsSecundariosConfirmados()
    }
  }

  setCidSecundarioSuspeito(cid: any) {
    this.cidSecundarioSuspeito = cid;
  }

  setCIDsSecundariosSuspeitos() {
    this.valuePesquisaSuspeito = null
    if (this.cidSecundarioSuspeito) {
      this.listCIDsSecundariosSuspeitos.push(this.cidSecundarioSuspeito)
      this.cidSecundarioSuspeito = null
      this.setStoreCIDsSecundariosSuspeitos()
    }
  }

  removeCIDsSecundariosConfirmados(cidParam: any) {
    if (cidParam) {
      this.listCIDsSecundariosConfirmados = this.listCIDsSecundariosConfirmados.filter(cid => cid != cidParam)
      this.setStoreCIDsSecundariosConfirmados()
    }
  }

  removeCIDsSecundariosSuspeitos(cidParam: any) {
    if (cidParam) {
      this.listCIDsSecundariosSuspeitos = this.listCIDsSecundariosSuspeitos.filter(cid => cid != cidParam)
      this.setStoreCIDsSecundariosSuspeitos()
    }
  }

  search = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$
    this.loadingSearch = true
    return merge(text, focus, click).pipe(
      mergeMap(term => this.autoComplete(term))
    )
  }

  private autoComplete(key: string) {
    if (!key) {
      return of([])
    }
    this.loadingSearch = false
    console.log('Lista de  cid retornada do banco', this.cidServ.get(key))
    return this.cidServ.get(key)
  }

  setStoreCIDsSecundariosConfirmados = () => {
    this.store.dispatch(AtendimentoActions.setCIDsConfirmadosAtendimento({ payload: [...this.listCIDsSecundariosConfirmados] }))
  }

  setStoreCIDsSecundariosSuspeitos = () => {
    this.store.dispatch(AtendimentoActions.setCIDsSuspeitosAtendimento({ payload: [...this.listCIDsSecundariosSuspeitos] }))
  }

  formatter = (cid: CidModel) => {
    return cid ? cid.descricao : ''
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe()
    }
  }

  private initFilter() {
    this.filterNull = {
      dataRealizacao: null,
      dataRealizacaoInicio: null,
      dataRealizacaoFim: null,
      especialidade: null
    }
    this.clear()
  }

  private load(config: PgConfig, filter?: Models.ReferenciaHistoricoFiltro) {
    return this.store.select(BeneficiarioSelect.mpi).pipe(
      switchMap(mpi => {
        return this.refServ.getAllByFiltro(mpi, config.offset, 20, filter)
      })
    )
  }

  clear() {
    this.filter = { ...this.filterNull }
    this.filterSearch = { ...this.filterNull }
  }

  disableSearch() {}

  dismiss() {
    this.close.emit(true)
  }

  cancelarPopover() {
    this.popover.close()
  }
}
