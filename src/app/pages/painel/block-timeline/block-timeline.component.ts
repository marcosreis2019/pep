import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  OnDestroy
} from '@angular/core'
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { TimelineFilters } from 'src/app/components/form-timeline-filter/form-timeline-filter.component'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import { BlockTimelineAux, TimeLineCol } from './block-timeline.aux'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { DocumentoDigitalAssinadoService } from 'src/app/_store/_modules/documento-digital-assinado/documento-digital-assinado.service'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'

@Component({
  selector: 'block-timeline',
  templateUrl: './block-timeline.component.html',
  styleUrls: ['./block-timeline.component.scss']
})
export class BlockTimelineComponent extends BlockTimelineAux implements OnInit, OnDestroy {
  @HostListener('window:scroll', ['$event']) onScrollEvent($event: any) {} // TODO add zoom function
  @ViewChild('eventPopover', { static: false }) eventPopover: ElementRef
  @ViewChild('eventDetails', { static: false }) eventDetails: ElementRef
  @ViewChild('form', { static: false }) formC: NgbPopover
  @ViewChild('timeline', { static: false }) timeline: ElementRef
  @Input() classificacoes: Array<ClassificacaoModels.Classificacao>
  @Input() tiposServicos: Array<TipoServicoModels.TipoServico>

  list: any[]
  listErrorMsg: string
  filterActived: string

  isLoaded: boolean
  aligned: boolean
  popover: any
  popoverIsHovered: boolean
  expanded: boolean
  error: string = ''

  currentItem: TimeLineCol
  examesLaboratorial: Array<any>
  examesImagem: Array<any>

  config: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    suppressScrollX: false,
    useBothWheelAxes: true
  }

  private mpi: string
  private subs$ = new SubSink()

  url = ''
  constructor(
    private render: Renderer2,
    private router: Router,
    private eventServ: EventosService,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private store: Store<PEPState>,
    private documentoDigitalAssinadoService: DocumentoDigitalAssinadoService
  ) {
    super()
    this.popover = {
      isOpen: false
    }
  }
  ngOnInit() {
    this.subs$.add(
      this.store.select(BeneficiarioSelect.mpi).subscribe(mpi => {
        if (mpi) {
          this.mpi = mpi
          this.loadEvents(mpi, undefined, true)
        }
      })
    )
    this.filterActived = 'Últimos 18 meses'
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  ngAfterViewChecked() {
    if (this.isLoaded && this.timeline && !this.aligned) {
      this.render.setProperty(this.timeline.nativeElement, 'scrollLeft', 200000)
      this.aligned = true
    }
  }

  async loadEvents(mpi: string, filters?: TimelineFilters, isFirstTime: boolean = false) {
    const loadTime = isFirstTime ? 0 : 1200
    try {
      this.setLoaded(false, 0)
      const res = filters
        ? await this.eventServ.getWithFilter(
            mpi,
            filters.dataInicio,
            filters.dataFim,
            filters.tipo,
            filters.nameProfissional,
            filters.nameSpecialty
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
        this.setLoaded(true, loadTime)
        return
      }
      let list = await this.startTransform(res.data, isFirstTime)
      this.list = list.sort((a, b) => {
        return this.utilsService.diffDays(a.date, b.date) > 0 ? 1 : -1
      })
      this.setLoaded(true, loadTime)
    } catch (e) {
      this.setLoaded(true, loadTime)
      console.error(e)
    }
  }

  private setLoaded(state: boolean, time: number) {
    setTimeout(() => (this.isLoaded = state), time)
  }

  getTipoServicoDescription(id) {
    const tipoServico = this.tiposServicos.find(item => {
      return item.id === id
    })
    return tipoServico ? tipoServico.descricao : ''
  }

  getClassificacaoDescription(id) {
    const classificacao = this.classificacoes.find(item => {
      return item.id === id
    })

    return classificacao ? classificacao.descricao : ''
  }

  openPopover(ev: any, item: any) {
    this.currentItem = item
    this.examesLaboratorial =
      item.event.exames && item.event.exames.length
        ? item.event.exames
            .filter(exame => {
              return exame.tipo == 'laboratorial'
            })
            .map(item => {
              if (!item.resultados) {
                item.resultados = {
                  arquivos: []
                }
              } else if (!item.resultados.arquivos) {
                item.resultados.arquivos = []
              }
              return item
            })
        : []
    this.examesImagem =
      item.event.exames && item.event.exames.length
        ? item.event.exames
            .filter(exame => {
              return exame.tipo == 'imagem'
            })
            .map(item => {
              if (!item.resultados) {
                item.resultados = {
                  arquivos: []
                }
              } else if (!item.resultados.arquivos) {
                item.resultados.arquivos = []
              }
              return item
            })
        : []

    const rect = ev.target.getBoundingClientRect()
    const x = ev.target.offsetWidth / (7 / 4) + rect.x // NOTE sete quartos da largura do elemento mais posição horizontal
    const y = ev.target.offsetHeight / 1.5 + rect.y // NOTE metade de altura do elemento mais posição vertical
    this.render.setStyle(this.eventPopover.nativeElement, 'top', `${y}px`)
    this.render.setStyle(this.eventPopover.nativeElement, 'left', `${x}px`)
    this.render.setStyle(this.eventPopover.nativeElement, 'display', 'initial')
  }

  haveArquivoLaboratorial() {
    const count = this.examesLaboratorial.filter(item => {
      return item.resultados && item.resultados.arquivos.length
    }).length
    return count > 0
  }

  haveArquivoImagem() {
    const count = this.examesImagem.filter(item => {
      return item.resultados && item.resultados.arquivos.length
    }).length
    return count > 0
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

  closePopover(event: any) {
    setTimeout(() => {
      if (!this.popoverIsHovered) {
        this.currentItem = undefined
        this.render.setStyle(this.eventPopover.nativeElement, 'display', 'none')
      }
    }, 10)
  }

  enterPopover(_: any) {
    this.popoverIsHovered = true
  }

  leavePopover(_: any) {
    this.popoverIsHovered = false
    this.render.setStyle(this.eventPopover.nativeElement, 'display', 'none')
  }

  expand() {
    this.leavePopover('')
    this.currentItem.event['documentos'] = []
    const sequencial = this.currentItem.event ? this.currentItem.event.sequencial : 0
    if (sequencial) {
      this.documentoDigitalAssinadoService
        .getDocumentosBySequencialAtendimento(sequencial)
        .subscribe(
          data => {
            this.currentItem.event['documentos'] = data.data
          },
          err => {
            console.error(err)
          }
        )
    }
    this.modalService.open(this.eventDetails, {
      centered: true,
      size: 'lg'
    })
  }

  trigApplyFilter(filters: TimelineFilters) {
    this.filterActived = 'Últimos 18 meses'

    if (filters.dataInicio) {
      this.filterActived = `período de ${filters.dataInicio}`
      filters.dataInicio = this.revertDate(filters.dataInicio)
    }

    if (filters.dataFim) {
      this.filterActived += ` à ${filters.dataFim}`
      filters.dataFim = this.revertDate(filters.dataFim)
    }

    if (filters.tipo) {
      this.filterActived += ` com tipo ${filters.tipo}`
    }

    if (filters.nameProfissional) {
      this.filterActived += ` com nome do profissional ${filters.nameProfissional}`
    }

    if (filters.nameSpecialty) {
      this.filterActived += ` com nome da especialidade ${filters.nameSpecialty}`
    }

    this.formC.close()
    this.loadEvents(this.mpi, filters)
  }

  clearFilter() {
    this.filterActived = 'Últimos 18 meses'
    this.loadEvents(this.mpi)
  }

  private revertDate(str: string) {
    return str
      .split('/')
      .reverse()
      .join('-')
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

  getDownloadLink(item) {
    return `${environment.QDS_URL_API}/download?fileId=${item}`
  }

  print(param) {
    this.router
      .navigate([])
      .then(result =>
        window.open(`${this.url}/relatorio-geral-historico?eventoSequencial=` + param, '_blank')
      )
  }
}
