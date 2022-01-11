import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { from, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import {
  BeneficiarioModels,
  BeneficiarioModels as Models
} from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { TagList } from 'src/app/_store/_modules/beneficiario/beneficiario.state'
import { SubSink } from 'subsink'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { ProfissionalActions } from 'src/app/_store/_modules/profissional/profissional.actions'
import { FormGroup, FormBuilder } from '@angular/forms'
import { AuthActions } from 'src/app/_store/_modules/auth/auth.actions'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { Errors } from 'src/app/_store/_modules/errors/errors.models'
import { AgendamentoActions } from 'src/app/_store/_modules/agendamento/agendamento.action'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { LocalActions } from 'src/app/_store/_modules/local/local.actions'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { ParametrosService } from 'src/app/_store/services/parametros/parametros.service'
import { ToastService } from 'angular-toastify'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { BeneficiarioActions } from 'src/app/_store/_modules/beneficiario/beneficiario.action'
export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
}

interface BeneficiarioFormatado extends Models.DadosPessoais {
  name: string
  born: string

  css: {
    border: string
    background: string
    level: number
  }

  gender: {
    type?: string
    picture?: string
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('popover', { static: false }) popover: ElementRef
  @ViewChild('fullTagList', { static: false }) fullTagList: ElementRef
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  @ViewChild('modalHistorico', { static: true }) modalHistorico: TemplateRef<any>

  @Output() apply: EventEmitter<TimelineFilters>
  form: FormGroup
  error: string = ''

  constructor(
    private formB: FormBuilder,
    private bServ: BeneficiarioService,
    private router: Router,
    private render: Renderer2,
    private uServ: UtilsService,
    private modalService: NgbModal,
    private store: Store<PEPState>,
    private aServ: AtendimentoService,
    private parametrosService: ParametrosService,
    private tipoServicoServ: TipoServicoService,
    private classificacaoServ: ClassificacaoService,
    private toastService: ToastService
  ) {
    this.apply = new EventEmitter<TimelineFilters>(undefined)
  }

  value: string = ''
  selectedIndex: number
  listPacientes = []
  loadingList = false

  tags$ = new Observable<TagList>()
  key$ = new Subject<string>()
  selected$ = new Subject<any>()
  loading$ = new Subject<boolean>()
  subs$ = new SubSink()

  loadingStart: Boolean = false
  profissional: Profissional
  local: LocalAtendimentoModels.LocalAtendimento

  tipoServicoParam: string
  classificacaoParam: string

  listTipoServico: TipoServicoModels.TipoServico[]
  listClassificacao: ClassificacaoModels.Classificacao[]

  pacienteSelecionado: any

  isAgendador = false

  prof: Observable<Profissional>
  msgDataInvalida = ''

  currentTag$: Observable<BeneficiarioModels.Tag[]>
  currentFullList: BeneficiarioModels.Tag[]
  headerModal: string
  orbs = [
    { active: false, inactive: false },
    { active: false, inactive: false },
    { active: false, inactive: false }
  ]

  hidePopOver: boolean
  expandeOrb: boolean

  params: any

  relatorioEnable: boolean

  atendimentos: Observable<any>
  searchLocal = ''
  url = 'asq'
  ngOnInit() {
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
    this.pacienteSelecionado = undefined
    this.loadingStart = false
    this.isAgendador = false
    this.form = this.formB.group({
      dataInicio: [undefined],
      dataFim: [undefined]
    })

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe((res: any) => {
        this.profissional = { ...res }
        this.setFlagAgendador()
      })
    )

    this.hidePopOver = true
    this.loadingList = false
    this.loadTipoServicoClassificacao()
  }

  filteredLocais() {
    return this.profissional.locais
      .filter(local => {
        if (this.searchLocal) {
          return local.razao_social.toLowerCase().includes(this.searchLocal.toLowerCase())
        } else {
          return local.razao_social
        }
      })
      .sort((a, b) => {
        return a.razao_social.toLowerCase() < b.razao_social.toLowerCase() ? -1 : 1
      })
  }

  resetLocal() {
    this.value = ''
    this.local = null
    this.pacienteSelecionado = null
    this.selectedIndex = null
    this.listPacientes = []
    this.selected$ = new Subject<any>()
  }

  setLocal(local) {
    if (local) {
      if (!local.operadoras || !local.operadoras.length) {
        this.toastService.error('Não há operadoras cadastradas para este local de atendimento!')
        return
      }
      let operadorasIds = local.operadoras
        .map(item => {
          return item.codigo
        })
        .join(',')

      this.loadingList = true

      this.subs$.add(
        this.key$
          .pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(name => this.bServ.getByName(name, operadorasIds)),
            map(l => l.map(i => this.generateData(i)).filter(item => item.mpi))
          )
          .subscribe(
            value => {
              if (!value || !value.length) {
                this.toastService.error(
                  'Não há beneficiários vinculados às operadoras deste local!'
                )
              } else {
                this.local = local
                this.listPacientes = value
                this.loadingList = false
              }
            },
            err => {
              this.toastService.error('Ocorreu um erro ao buscar os beneficiários!')
              this.listPacientes = []
              this.loadingList = false
            }
          )
      )
      this.key$.next('a')
    }
  }

  loadTipoServicoClassificacao() {
    this.subs$.add(
      this.tipoServicoServ.getTiposServicos().subscribe(
        (data: TipoServicoModels.TipoServicoPEPApi) => {
          this.listTipoServico = data.data
        },
        err => {
          console.error(err)
        }
      )
    )
    this.subs$.add(
      this.classificacaoServ.getClassificacoes().subscribe(
        (data: Array<ClassificacaoModels.Classificacao>) => {
          this.listClassificacao = data
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  openModalHistorico() {
    this.modalService.open(this.modalHistorico, { size: 'lg' })
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  setFlagAgendador() {
    const roles = this.profissional.roles
    this.isAgendador =
      roles.includes(UsuarioModels.Role.AGENDADOR) || roles.includes(UsuarioModels.Role.ADMIN)
  }

  isMedico() {
    const roles = this.profissional.roles
    return roles.includes(UsuarioModels.Role.MEDICO)
  }

  change(key: string) {
    this.key$.next(key)
  }

  selectPaciente(paciente: any, index: number) {
    this.selected$.next(paciente)
    this.selectedIndex = index
    this.pacienteSelecionado = paciente
    this.loading$.next(true)
    this.tags$ = this.bServ.getTags(paciente.mpi).pipe(map(r => this.getTagsByCategories(r)))
    this.loading$.next(false)
  }

  private generateData(ben: any): BeneficiarioFormatado {
    let beneficiario: BeneficiarioFormatado = {
      ...ben,
      name: this.uServ.toCamelCase(ben.nomeCompleto),
      css: this.generateCss(ben.nivelComplexidade),
      born: ben.dataNascimento,
      gender: this.generateGender(ben.sexo, ben['gender'], ben['fotoAvatar'])
    }
    if (!beneficiario.nivelComplexidade) {
      beneficiario.nivelComplexidade = {
        codigoNivel: 0,
        descricao: '',
        indice: 0,
        nome: ''
      }
    }
    return beneficiario
  }

  logout() {
    let pp
    this.prof = this.store.select(ProfissionalSelect.profissional)
    this.prof
      .pipe(
        map(p => {
          try {
            pp = p
          } catch (error) {
            console.error(error)
          }
        })
      )
      .subscribe()
    this.store.dispatch(ProfissionalActions.deleteProfissional({ payload: pp }))
    this.router.navigate(['login'])
  }

  private generateCss(nivel?: Models.NivelComplexidadeModel) {
    let level: number = nivel && typeof nivel !== 'string' ? nivel.codigoNivel : 0
    level -= 1
    const mapCss = ['one', 'two', 'three', 'four', 'five']
    const base = mapCss[level] ? mapCss[level] : 'default'

    return {
      border: `bo-${base}`,
      background: `bg-${base}`,
      level: level ? level + 1 : 0
    }
  }

  private generateGender(sex: string, gender: string, pic?: string) {
    let g = sex ? sex.toLowerCase() : ''
    g = !sex && gender ? gender : g
    if (g === 'feminino') {
      return {
        type: 'Mulher',
        picture: pic ? pic : 'assets/imgs/female.svg'
      }
    }

    if (g === 'masculino') {
      return {
        type: 'Homem',
        picture: pic ? pic : 'assets/imgs/male.svg'
      }
    }

    return {
      picture: pic ? pic : 'assets/imgs/avatar.svg'
    }
  }

  private getTagsByCategories(list: any[]): TagList | any {
    const uniqueTags = [...new Set(list.map(item => item.tag))]
    let filterIndex = {
      admin: this.filterTags(list, 1, uniqueTags),
      auth: this.filterTags(list, 2, uniqueTags),
      health: this.filterTags(list, 3, uniqueTags)
    }
    return filterIndex
  }

  private filterTags(tags: BeneficiarioModels.Tag[], index: number, uniqueTags: any[]) {
    if (!tags.length) {
      return []
    }
    const filterByIndex = tags.filter((elem: BeneficiarioModels.Tag) => {
      if (elem.grau === index) {
        return elem
      }
    })

    if (filterByIndex.length > 0) {
      return uniqueTags.map(nomeTag => {
        const filteredNameTags = this.filterNameTag(filterByIndex, nomeTag)

        let cor
        if (filteredNameTags.length > 0) {
          cor = filteredNameTags[0].cor
          return { tag: nomeTag, cor: cor, data: filteredNameTags }
        }
        return []
      })
    } else {
      return []
    }
  }

  private filterNameTag(tags: BeneficiarioModels.Tag[], nameTag: string) {
    if (!tags.length) {
      return []
    }
    return tags.filter((elem: BeneficiarioModels.Tag) => {
      if (elem.tag === nameTag) {
        return elem
      }
    })
  }

  async togglePopOver(e: any, arrayTag?: BeneficiarioModels.FilterTag, orb?: number) {
    this.expandeOrb = false
    e = this.stopPrapagation(e)

    if (this.hidePopOver) {
      if (arrayTag && arrayTag.data) {
        const tag = arrayTag.data
        if (tag.length > 5) {
          this.currentFullList = tag
          this.headerModal = this.currentFullList[0].tag
          this.expandeOrb = true
        }
        this.currentTag$ = from([tag])
        await this.showPop(e.target.parentNode.getBoundingClientRect())
        this.setStyle2(orb, true)
      }
    } else {
      this.hidePop().then(() => {
        this.currentTag$ = undefined
        this.setStyle2(orb)
      })
    }
    this.hidePopOver = !this.hidePopOver
  }

  async showModal(e: any) {
    // this.currentFullList$ = this.currentTag$
    this.modalService.open(this.fullTagList, {
      centered: true,
      size: 'lg'
    })
    this.hidePop().then(() => {
      this.currentTag$ = undefined
    })
  }

  private showPop(position: any): Promise<void> {
    return new Promise(resolve => {
      this.render.setStyle(this.popover.nativeElement, 'top', position.y - 20 + 'px')
      this.render.setStyle(this.popover.nativeElement, 'left', position.x - 20 + 'px')
      resolve()
    })
  }

  private hidePop(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.render.setStyle(this.popover.nativeElement, 'top', '-200px')
        this.render.setStyle(this.popover.nativeElement, 'left', '-200px')
        resolve()
      }, 300)
    })
  }

  private stopPrapagation(e) {
    if (!e) {
      e = window.event
    }
    e.cancelBubble = true
    if (e.stopPropagation) {
      e.stopPropagation()
    }
    return e
  }

  setStyle(e: any, ref: number, toPut: boolean = false) {
    for (let i = 0; i < this.orbs.length; i++) {
      if (toPut) {
        if (i === ref) {
          this.orbs[i].active = true
        } else {
          this.orbs[i].active = false
          this.orbs[i].inactive = true
        }
      } else {
        this.orbs[i].active = false
        this.orbs[i].inactive = false
      }
    }
  }

  setStyle2(ref: number, toPut: boolean = false) {
    for (let i = 0; i < this.orbs.length; i++) {
      if (toPut) {
        if (i === ref) {
          this.orbs[i].active = true
        } else {
          this.orbs[i].active = false
          this.orbs[i].inactive = true
        }
      } else {
        this.orbs[i].active = false
        this.orbs[i].inactive = false
      }
    }
  }

  iniciar(beneficiario: BeneficiarioModels.DadosPessoais) {
    if (
      !this.listClassificacao ||
      !this.listTipoServico ||
      !this.listClassificacao.length ||
      !this.listTipoServico.length
    ) {
      this.toastService.error('Classificações e tipos de serviços não carregados! Tente novamente.')
      this.loadingStart = false
      return
    }
    this.store.dispatch(AuthActions.reset({ payload: beneficiario.mpi }))
    this.store.dispatch(AgendamentoActions.setAgendamento({ payload: undefined }))
    if (this.local) {
      this.store.dispatch(LocalActions.setLocal({ payload: this.local }))
      this.loadingStart = true
      this.aServ.start(beneficiario).subscribe(
        (res: any) => {
          let atendimento = {
            id: res.count,
            beneficiario
          }
          this.loadCodOperadora(beneficiario, atendimento)
        },
        err => {
          this.toastService.error('Erro ao iniciar atendimento!')
          this.loadingStart = false
        }
      )
    } else {
      this.toastService.info('Não é possível iniciar o atendimento sem um local selecionado.')
      this.toastService.error('Selecione um local!')
      this.loadingStart = false
    }
  }

  iniciarHistorico(paciente) {
    this.router.navigateByUrl(`${this.url}/painel-historico`)
    this.store.dispatch(BeneficiarioActions.set({ payload: paciente }))
  }

  loadCodOperadora(beneficiario, atendimento) {
    this.aServ.getCodigoOperadora(beneficiario.mpi).subscribe(
      data => {
        if (data.length) {
          atendimento.codigoOperadora = data[0].codigoOperadora
          this.loadSequential(atendimento)
        } else {
          this.toastService.error('Código da operadora não cadastrado!')
          this.loadingStart = false
        }
      },
      err => {
        this.toastService.error('Código da operadora não cadastrado!')
        this.loadingStart = false
      }
    )
  }

  loadSequential(atendimento) {
    this.aServ.getAtendimentoSequential().subscribe(
      sequencial => {
        atendimento.sequencial = sequencial
        this.navigateToPainel(atendimento)
      },
      err => {
        console.error('Erro ao gerar o sequencial de atendimento! err = ', err)
        this.toastService.error('Não foi possível iniciar atendimento!')
        this.loadingStart = false
      }
    )
  }

  navigateToPainel(atendimento) {
    try {
      this.listClassificacao.forEach(classificacao => {
        if (this.local.classificacao_padrao_id == classificacao.id) {
          atendimento.classificacao = { ...classificacao }
        }
      })

      this.listTipoServico.forEach(tipoServico => {
        if (this.local.tipo_servico_padrao_id == tipoServico.id) {
          atendimento.tipo_servico = { ...tipoServico }
        }
      })
      atendimento.tipo = this.local.tipo_id

      if (atendimento.classificacao && atendimento.tipo_servico && atendimento.tipo) {
        this.store.dispatch(AtendimentoActions.start({ payload: atendimento }))
        this.router.navigate([`${this.url}/painel`])
        this.toastService.success('Atendimento iniciado com sucesso!')
      } else {
        this.toastService.error('Local sem Classificação Padrão, tipo e Tipo Serviço Padrão!')
        this.toastService.error('Não foi possível iniciar atendimento!')
        this.loadingStart = false
      }
    } catch (e) {
      console.error(e)
      this.loadingStart = false
    }
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.loadingStart = false
    this.error = msg ? msg : Errors.Atendimento.START.msg
  }

  get stateName() {
    return this.hidePopOver ? 'hide' : 'show'
  }
}
