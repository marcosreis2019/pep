import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { CronogramaModels } from 'src/app/_store/_modules/cronograma/cronograma.model'
import { CronogramaService } from 'src/app/_store/_modules/cronograma/cronograma.service'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'

@Component({
  selector: 'cadastro-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CadastroCronogramaComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()

  infoListaCronograma = true
  cadastro = false

  vigenciaSelected: any = undefined

  cronogramaTemp: CronogramaModels.Cronograma = {
    id: null,
    profissional_id: 0,
    dia_da_semana: 0,
    hora_inicio: '',
    hora_fim: '',
    vigencia_inicio: '',
    vigencia_fim: '',
    local_id: 0,
    local_razao_social: ''
  }

  diaDaSemana = {
    1: 'Domingo',
    2: 'Segunda-feira',
    3: 'Terça-feira',
    4: 'Quarta-feira',
    5: 'Quinta-feira',
    6: 'Sexta-feira',
    7: 'Sábado'
  }

  listDiaSemana = []
  search = ''

  cronograma = {
    vigencia_inicio: '',
    vigencia_fim: '',
    local_id: 0,
    local_razao_social: ''
  }

  listProfissional = []
  listLocal = []

  listPeriodo: CronogramaModels.Cronograma[] = []

  vigenciaList: CronogramaModels.Vigencia[] = []

  profissional: any

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingListProfissional = false

  filterRoles = [UsuarioModels.Role.MEDICO]

  @ViewChild('modalEvent', { static: true }) modalEvent: TemplateRef<any>
  title = 'Selecione um Profissional...'
  constructor(
    private cronogramaService: CronogramaService,
    private toastService: ToastService,
    private profissionalService: ProfissionalService,
    private localService: LocalService,
    private modalService: NgbModal,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.loadingListProfissional = true
    this.listPeriodo = []
    this.infoListaCronograma = true
    this.inicializaCronograma()
    this.loadProfissionais()
    this.loadLocais()
    this.montaDiasSemana()
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(nome => this.profissionalService.getAll(this.filterRoles, nome))
        )
        .subscribe((data: any) => {
          this.listProfissional = data.data
            ? data.data.sort((a, b) => {
                return a.nome_completo > b.nome_completo ? -1 : 1
              })
            : []
          this.loadingListProfissional = false
        })
    )
  }

  inicializaCronograma() {
    this.cronograma = {
      vigencia_inicio: null,
      vigencia_fim: null,
      local_id: 0,
      local_razao_social: ''
    }
  }

  change(key: string) {
    this.key$.next(key)
  }

  montaDiasSemana() {
    for (let i = 0; i < Object.values(this.diaDaSemana).length; i++) {
      const element = {
        key: Number(Object.keys(this.diaDaSemana)[i]),
        value: Object.values(this.diaDaSemana)[i]
      }
      this.listDiaSemana.push(element)
    }
  }

  loadProfissionais() {
    this.subs$.add(
      this.profissionalService.getAll(this.filterRoles, '').subscribe(
        (res: any) => {
          this.loadingListProfissional = false
          if (res) {
            this.listProfissional = res.data.sort((a, b) => {
              return a.nome_completo > b.nome_completo ? -1 : 1
            })
          }
        },
        err => {
          this.loadingListProfissional = false
          this.toastService.error('Não foi possível carregar lista de profissionais!')
          console.error(err)
        }
      )
    )
  }

  loadLocais() {
    this.subs$.add(
      this.localService.getAll().subscribe(
        (res: any) => {
          if (res) {
            this.listLocal = res.data
          }
        },
        err => {
          this.toastService.error('Não foi possível carregar lista de locais!')
          console.error(err)
        }
      )
    )
  }

  sortByDiaDaSemana(items) {
    return items.sort((a, b) => {
      return a.dia_da_semana < b.dia_da_semana ? -1 : 1
    })
  }

  deleteCronograma(listCronogramasDel) {
    let listCronogramasIds = []
    listCronogramasDel.forEach(element => {
      listCronogramasIds.push(element.id)
    })
    this.subs$.add(
      this.cronogramaService.delete(listCronogramasIds).subscribe(
        (res: any) => {
          this.toastService.success('Cronograma removido com sucesso!')
          this.setProfissional(this.profissional)
          this.loading = false
        },
        err => {
          this.toastService.error('Não foi possível remover cronograma(s)!')
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  setVigencia(vigencia) {
    if (this.vigenciaSelected) {
      this.vigenciaSelected.items = []
      this.vigenciaSelected = undefined
    }
    this.vigenciaSelected = { ...vigencia }
    this.modalService.open(this.modalEvent, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    })
  }

  deletePeriodo(CronogramaPeriodo) {
    this.listPeriodo = this.listPeriodo.filter(
      cronogramaItem => cronogramaItem != CronogramaPeriodo
    )
  }

  addCronograma() {
    this.listPeriodo.push({ ...this.cronogramaTemp })
  }

  ativaCadastro() {
    this.listPeriodo = []
    this.cadastro = true
    this.infoListaCronograma = false
  }

  back() {
    this.cadastro = false
    this.infoListaCronograma = true
  }

  setProfissional(profissional) {
    this.profissional = { ...profissional }
    this.title = this.profissional.pessoa.nome_completo
    this.listPeriodo = []
    this.loadLocais()
    this.cadastro = false
    this.infoListaCronograma = true
    this.loadListCronogramas(profissional.id)
  }

  loadListCronogramas(idProfissional) {
    this.inicializaCronograma()
    this.vigenciaList = []
    this.subs$.add(
      this.cronogramaService.getAllCronogramaByProfissional(idProfissional).subscribe(
        (res: any) => {
          if (res && res.data) {
            let cont = 0
            res.data.forEach(item => {
              let vigencia: CronogramaModels.Vigencia = {
                id: ++cont,
                cronograma_id: item.id,
                dataInicio: item.vigencia_inicio,
                dataFim: item.vigencia_fim,
                items: [],
                profissional: item.profissional_id,
                local_id: item.local_id,
                local_razao_social: item.local_razao_social || `Id do local: ${item.local_id}`
              }
              let cronograma: CronogramaModels.Cronograma = {
                id: item.id,
                profissional_id: item.profissional_id,
                dia_da_semana: item.dia_da_semana,
                hora_inicio: item.hora_inicio,
                hora_fim: item.hora_fim,
                local_id: item.local_id,
                local_razao_social: item.local_razao_social,
                vigencia_inicio: item.vigencia_inicio,
                vigencia_fim: item.vigencia_fim
              }
              let index = this.vigenciaList.findIndex(listItem => {
                return (
                  listItem.dataInicio === vigencia.dataInicio &&
                  listItem.dataFim === vigencia.dataFim &&
                  listItem.local_id === vigencia.local_id
                )
              })
              if (index === -1) {
                if (
                  vigencia.items.filter(cronogramaItem => cronogramaItem == cronograma).length <= 0
                ) {
                  vigencia.items.push(cronograma)
                  this.vigenciaList.push(vigencia)
                }
              } else {
                if (
                  this.vigenciaList[index].items.filter(
                    cronogramaItem => cronogramaItem == cronograma
                  ).length <= 0
                ) {
                  this.vigenciaList[index].items.push(cronograma)
                }
              }
            })
          }
        },
        err => {
          this.toastService.error('Não foi possível carregar lista de cronogramas!')
          console.error(err)
        }
      )
    )
  }

  verificaSalvar(): boolean {
    if (
      this.listPeriodo.length > 0 &&
      this.cronograma.local_id != 0 &&
      this.cronograma.vigencia_fim != '' &&
      this.cronograma.vigencia_inicio != ''
    ) {
      return this.verificaPeriodosPreenchidos()
    } else {
      return false
    }
  }

  verificaPeriodosPreenchidos(): boolean {
    let retorno = true
    this.listPeriodo.forEach(periodo => {
      if (periodo.dia_da_semana == 0 || periodo.hora_fim == '' || periodo.hora_inicio == '') {
        retorno = false
        return retorno
      }
    })
    if (retorno) {
      return retorno
    }
  }

  salvar() {
    if (this.verificaSalvar()) {
      this.loading = true
      let listPeriodoPayload = this.listPeriodo.slice()
      listPeriodoPayload.forEach(periodo => {
        periodo.dia_da_semana = Number(periodo.dia_da_semana)
        periodo.vigencia_inicio = this.utils.dateBrToDb(this.cronograma.vigencia_inicio)
        periodo.vigencia_fim = this.utils.dateBrToDb(this.cronograma.vigencia_fim)
        periodo.local_id = this.cronograma.local_id
        periodo.local_razao_social = this.cronograma.local_razao_social
        periodo.profissional_id = this.profissional.id
      })
      this.create(listPeriodoPayload)
    } else {
      this.toastService.error('Preencha todos os campos obrigatórios!')
    }
  }

  create(listCronograma) {
    this.subs$.add(
      this.cronogramaService.post(listCronograma).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Cronograma cadastrado com sucesso!')
          this.listPeriodo = []
          this.setProfissional(this.profissional)
          this.cadastro = false
          this.infoListaCronograma = true
        },
        err => {
          this.toastService.error('Não foi possível criar o cronograma!')
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  replaceAll(string, search, replace) {
    return string.split(search).join(replace)
  }

  formatWeekDay(day) {
    return this.utils.formatWeekDay(day)
  }

  close() {
    this.modalService.dismissAll()
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }
}
