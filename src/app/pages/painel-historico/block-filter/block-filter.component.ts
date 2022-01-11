import {
  Component,
  HostListener,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { TimelineFilters } from 'src/app/components/form-timeline-filter/form-timeline-filter.component'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import { SubSink } from 'subsink'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'

@Component({
  selector: 'block-filter',
  templateUrl: './block-filter.component.html',
  styleUrls: ['./block-filter.component.scss']
})
export class BlockFilterComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll', ['$event']) onScrollEvent($event: any) {} // TODO add zoom function
  @Input() classificacoes: Array<ClassificacaoModels.Classificacao>
  @Input() tiposServicos: Array<TipoServicoModels.TipoServico>

  list: any[] = []
  @Output() filtrarLista = new EventEmitter<any[]>()

  listErrorMsg: string
  filterActived: string

  isLoaded: boolean
  expanded: boolean
  error: string = ''

  dataFim = ''
  dataInicio = ''
  dataInicioFormatada: string = ''
  dataFimFormatada : string = ''
  nameProfissional = ''

  config: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    suppressScrollX: false,
    useBothWheelAxes: true
  }

  private mpi: string
  private subs$ = new SubSink()

  constructor(
    private router: Router,
    private eventServ: EventosService,
    private utilsService: UtilsService,
    private store: Store<PEPState>,
  ) {}

  ngOnInit() {
    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(mpi => {
        if (mpi) {
          this.mpi = mpi
        }
      })
    )
  
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  async loadEvents(mpi: string, filters?: TimelineFilters, isFirstTime: boolean = false) {
    
    const loadTime = isFirstTime ? 0 : 1200
    try{
      this.setLoaded(false, 0)
      const res = filters
        ? await this.eventServ.getWithFilter(
          mpi,
          filters.dataInicio,
          filters.dataFim,
          filters.tipo,
          filters.nameProfissional
        )
        : await this.eventServ.getLatests(mpi)

      this.listErrorMsg = res.message

      if (res.status === 'error') {
        return
      }

      if (!res.data.length) {
        this.listErrorMsg = filters
          ? 'Nenhum evento registrado no ' + this.filterActived
          : 'Nenhum evento registrado nos últimos 18 meses'

        this.list = []
        this.filtrarLista.emit(this.list)
        this.setLoaded(true, loadTime)
        return
      }

      this.list = [...res.data]
      this.filtrarLista.emit(this.list)
      this.setLoaded(true, loadTime)
    } catch (e) {
      this.setLoaded(true, loadTime)
      console.error(e)
    }

  }

  private setLoaded(state: boolean, time: number) {
    setTimeout(() => (this.isLoaded = state), time)
  }

  formatString(data) {
    if (data) {
      return this.toCamelCase(
        data
          .toString()
          .split('_')
          .join(' ')
      )
    } else {
      return ''
    }
  }

  filter() {
    this.filterActived = 'Últimos 18 meses'

    if (this.dataInicio) {
      this.filterActived = `período de ${this.dataInicio}`
      this.dataInicioFormatada = this.utilsService.formatterDateToISOWithGMT(this.dataInicio);
    }

    if (this.dataFim) {
      this.filterActived += ` à ${this.dataFim}`
      this.dataFimFormatada =  this.utilsService.formatterEndDateToISOWithGMT(this.dataFim)
    }

    if (this.nameProfissional) {
      this.filterActived += ` com nome do profissional ${this.nameProfissional}`
    }
   
    let filters : TimelineFilters = 
    { 
      dataFim : this.dataFimFormatada,
      dataInicio: this.dataInicioFormatada,
      nameProfissional: this.nameProfissional
    }

    this.loadEvents(this.mpi, filters)
  }

  clearFilter() {
    this.filterActived = 'Últimos 18 meses'
    this.loadEvents(this.mpi)
  }

  toCamelCase(name: string) {
    if (name) return this.utilsService.toCamelCase(name)
    return name
  }

  showError(msg: string = '') {
    this.error = msg
  }

  resetToast() {
    this.error = ''
  }

  print(param) {
    this.router.navigate([]).then(result => window.open('relatorio-geral-historico?eventoSequencial='+param, '_blank'))
  }
}
