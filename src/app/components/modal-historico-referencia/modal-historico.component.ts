import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { Observable, Subscription } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { ReferenciasModels as Models } from 'src/app/_store/_modules/referencias/referencias.models'
import { ReferenciasService } from 'src/app/_store/_modules/referencias/referencias.service'
import { FormDateModel } from '../form-data/form-data.component'
import { ReferenciasSelectors } from 'src/app/_store/_modules/referencias/referencias.selectors'
import { ReferenciasActions } from 'src/app/_store/_modules/referencias/referencias.actions'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { SubSink } from 'subsink'

interface PgConfig {
  page: number
  maxPage: number
  offset: number
  size: number
}
@Component({
  selector: 'modal-historico',
  templateUrl: './modal-historico.component.html',
  styleUrls: ['./modal-historico.component.scss']
})
export class ModalHistoricoComponent implements OnInit, OnDestroy {
  @ViewChild('p1', { static: false }) popover: NgbPopover
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
  url = 'asq'
  private subs$ = new SubSink()
  constructor(
    private store: Store<PEPState>,
    private refServ: ReferenciasService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
    this.error$ = this.store.select(ReferenciasSelectors.error)
    this.isLoading$ = this.store.select(ReferenciasSelectors.loading)
    this.success$ = this.store.select(ReferenciasSelectors.success)
    this.pgConfigInit = {
      page: 1,
      maxPage: 2,
      offset: 0,
      size: 10
    }

    this.pgConfig = { ...this.pgConfigInit }
    this.initFilter()
    this.attrRefs(this.pgConfig, undefined, false)
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

  loadMore(pg: number) {
    if (pg >= this.pgConfig.maxPage) {
      this.pgConfig.offset = pg * this.pgConfig.size
      this.pgConfig.maxPage += 2
      this.attrRefs(this.pgConfig, { ...this.filter }, true)
    }
  }

  calcSliceInit() {
    return (this.pgConfig.page - 1) * this.pgConfig.size
  }

  calcSliceEnd() {
    return (this.pgConfig.page - 1) * this.pgConfig.size + this.pgConfig.size
  }

  setEspeciality(key: string) {
    this.filterSearch.especialidade = key
  }

  clear() {
    this.filter = { ...this.filterNull }
    this.filterSearch = { ...this.filterNull }
  }

  disableSearch() {}

  doSearchFilter(ref?: any) {
    this.key = undefined

    if (this.filterSearch) {
      this.filter = { ...this.filterSearch }
    }

    this.pgConfig = { ...this.pgConfigInit }
    this.attrRefs(this.pgConfig, this.filter, false)

    if (ref) {
      this.clear()
    }
  }

  doClearFilter() {
    this.pgConfig = { ...this.pgConfigInit }
    this.clear()
    this.attrRefs(this.pgConfig, undefined, false)
  }

  private attrRefs(
    configs: PgConfig,
    filters: Models.ReferenciaHistoricoFiltro,
    toConcat: boolean
  ) {
    if (this.sub$) {
      this.sub$.unsubscribe()
      this.sub$ = undefined
    }

    this.filterActived = this.utilsService.checkEmpty(this.filterSearch) ? false : true

    const objTest = {
      dataRealizacao: null,
      dataRealizacaoInicio: null,
      dataRealizacaoFim: null,
      especialidade: null,
      teste: Object
    }
    this.sub$ = this.load(configs, filters).subscribe(r => {
      toConcat ? this.refs.push(...r) : (this.refs = r)
    })
  }

  toggleItemDetails(index: number, ref: Models.Referencia) {
    this.reset()
    this.activeItem = this.activeItem === index ? undefined : index
    this.refSelected = !this.refSelected ? ref : undefined
  }

  reset() {
    this.isAddingRef = false
    this.isAddingXRef = false
    this.isSendingRef = false
    this.isSendingXRef = false
    this.refSelected = undefined
    this.successMsg = undefined
    this.errorMsg = undefined
  }

  toggleAddXRefForm(e: Event) {
    e.stopPropagation()
    this.isAddingXRef = !this.isAddingXRef
  }

  printRef(referencia?: any) {
    this.store.dispatch(ReferenciasActions.setReferencia({ payload: referencia }))
    window.open(this.url + '/print-referencia')
  }

  dismiss() {
    this.close.emit(true)
  }

  addBuscaFiltroHistorio(form: FormDateModel) {
    const reg = new RegExp(/(\d){4}-(\d){2}-(\d){2}/g)
    if (this.filterSearch) {
    }

    this.filterSearch = {
      ...this.filterSearch,
      dataRealizacaoInicio: form.date_start
        ? reg.test(form.date_start)
          ? form.date_start
          : this.convertDateFormat(form.date_start)
        : undefined,
      dataRealizacaoFim: form.date_end
        ? reg.test(form.date_end)
          ? form.date_end
          : this.convertDateFormat(form.date_end)
        : undefined,
      dataRealizacao: form.especific_date ? this.convertDateFormat(form.especific_date) : undefined
    }

    if ((form.date_end && form.date_start) || form.especific_date) {
      this.cancelarPopover()
    }
  }

  convertDateFormat(dateString: string) {
    return dateString
      .split('/')
      .reverse()
      .join('-')
  }

  cancelarPopover() {
    this.popover.close()
  }

  async addContraReferencia(xref: Models.ReferenciaPut) {
    this.isSendingXRef = true
    let mpi = ''
    this.store.select(BeneficiarioSelect.mpi).subscribe(data => {
      mpi = data
    })

    await this.refServ.put(mpi, this.refSelected, xref)

    this.attrRefs(this.pgConfig, this.filter, false)
    this.isAddingXRef = false
    this.isSendingXRef = false
  }
}
