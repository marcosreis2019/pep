import { EspecialidadeModels } from 'src/app/_store/_modules/especialidade/especialidade.model';
import { EspecialidadeService } from 'src/app/_store/_modules/especialidade/especialidade.service';
import { FilaAtendimentoService } from './../../_store/_modules/fila-atendimento/fila-atendimento.service';
import {FilaAtendimentoModels } from './../../_store/_modules/fila-atendimento/fila-atendimento.model';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy
} from '@angular/core'
import { DatePipe } from '@angular/common'
import { WeekDay } from 'calendar-utils'
import { Subject, Observable } from 'rxjs'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { AuthActions } from 'src/app/_store/_modules/auth/auth.actions'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { ActivatedRoute, Router } from '@angular/router'
import { SubSink } from 'subsink'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { AgendamentoModels } from 'src/app/_store/_modules/agendamento/agendamento.model'
import { ProfissionalModels } from 'src/app/_store/_modules/profissional/profissional.model'
import { AgendamentoActions } from 'src/app/_store/_modules/agendamento/agendamento.action'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { ErrorsActions } from 'src/app/_store/_modules/errors/errors.actions'
import { ErrorsSelect } from 'src/app/_store/_modules/errors/errors.selectors'
import { PEPError } from 'src/app/_store/_modules/errors/errors.models'
import { EspecialidadeModel } from 'src/app/_store/services/especialidades/especialidades.service'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { IDropdownSettings } from 'ng-multiselect-dropdown'
import { HttpClient } from '@angular/common/http'
import { LocalActions } from 'src/app/_store/_modules/local/local.actions'
import { CronogramaService } from 'src/app/_store/_modules/cronograma/cronograma.service'
import { ToastService } from 'angular-toastify'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { PacienteService } from 'src/app/_store/_modules/paciente/paciente.service'
import { PacienteModels } from 'src/app/_store/_modules/paciente/paciente.model'
import { parse, string } from 'yargs'
import moment from 'moment'
import { BeneficiarioModels } from 'src/app/_store/_modules/beneficiario/beneficiario.model';
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service';

@Component({
  selector: 'app-agendamento',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['agendamento.component.scss'],
  templateUrl: 'agendamento.component.html'
})
export class AgendamentoComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>
  @ViewChild('modalEvent', { static: true }) modalEvent: TemplateRef<any>
  @ViewChild('modalagendaEvent', { static: true }) modalContentCadastro: TemplateRef<any>
  @ViewChild('modalContentConfirmDelete', { static: true }) modalContentConfirmDelete: TemplateRef<
    any
  >
  @ViewChild('instanceEspec', { static: true }) instanceEspec: NgbTypeahead
  @ViewChild('modalContentConfirmCancelar', { static: true })
  modalContentConfirmCancelar: TemplateRef<any>
  @ViewChild('modalCronograma', { static: true }) modalCronograma: TemplateRef<any>
  @ViewChild('modalHistorico', { static: true }) modalHistorico: TemplateRef<any>
  @ViewChild('modalTransferir', { static: true }) modalTransferir: TemplateRef<any>

  duracaoDaConsulta = 30

  private subs$ = new SubSink()

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  viewWeek: CalendarView = CalendarView.Week
  viewMonth: CalendarView = CalendarView.Month
  view: any = CalendarView.Week

  profissional = null
  profissionalLogado = null
  localSelected = null
  localList: Array<LocalAtendimentoModels.LocalAtendimentoCombo> = []

  dataFiltro = null
  tipo_servicoFiltro = 0
  localFiltro = 0

  loading = false
  loadingSave = false
  loadingAgendamentos = false

  filtro = { dataInicio: '', dataFim: '' }

  dataNasc = ''
  matricula = ''

  listarTodos = true

  CalendarView = CalendarView

  isAgendador = false

  viewDate: Date = new Date()
  diaSelecionado: Date = new Date()

  agendaEvent: any

  list = []

  evento: any

  modalDetalhesAgenda: {
    action: string
    event: any // CalendarEvent << para saber os atributos originais porem mais atributos estao sendo colocados
  }

  modalDetalhesAgendaDelete: {
    action: string
    event: any
  }

  modalDetalhesAgendaCancelar: {
    action: string
    event: any
  }

  loadingSearch = false
  loadingEspec = false

  refresh: Subject<any> = new Subject()

  events: any[] = []

  activeDayIsOpen = false // Começar evento de hj fechado
  listTipoServico: Array<TipoServicoModels.TipoServico> = []
  listClassificacao: Array<ClassificacaoModels.Classificacao> = []
  listTipoAgendamento: Array<AgendamentoModels.TipoAgendamento> = []
  listStatusAgendamento: Array<AgendamentoModels.StatusAgendamento> = []
  especialidade: any
  listStatus = Object.values(AgendamentoModels.STATUS).sort()
  error$: Observable<PEPError>
  currentDate: any
  locaisComboList: Array<LocalAtendimentoModels.LocalAtendimentoCombo> = [] // array do combo de interseccao profissional agendador

  profissionalList: Array<ProfissionalModels.ProfissionalCombo> = []
  searchProfissional = ''
  searchLocal = ''

  dropdownList = []
  selectedItems = []
  dropdownSettings: IDropdownSettings = {}
  locaisComboListAgendador: Array<LocalAtendimentoModels.LocalAtendimentoCombo> = []

  cronograma = []
  isAvailableHour = false

  agendamentoToStart: AgendamentoModels.Agendamento

  dateFilter
  isRetroativo = false
  url = 'asq'
  isExpanded = true
  pacientes: Array<FilaAtendimentoModels.FilaAtendimento> = []
  atendimentoPaciente: FilaAtendimentoModels.FilaAtendimento

  grupoEspecialidades: EspecialidadeModels.Especialidade [] = []

  infoPacientes: PacienteModels.Paciente[] = []
  infoPaciente: PacienteModels.Paciente = {
    id: 0,
    codigoOperadora: 0,
    matricula: '',
    codigoBeneficiario: 0,
    nome: '',
    cpf: '',
    numeroValidador: '',
    sexo: '',
    dataNascimento: '',
    situacao: 0,
    estadoCivil: '',
    dsMpi: '',
    newRecord: false,
    enderecos: [],
    telefones: [],
    emails: []
  }

  local: LocalAtendimentoModels.LocalAtendimento
  idade: string;
  tempoHoras: number
  tempoMinutos: number
  tempoEsperaHoras: any;
  tempoEsperaMinutos: any;
  horaInicial: any;
  horaFinal: any;

  constructor(
    private modalService: NgbModal,
    private classificacaoService: ClassificacaoService,
    private tipoServicoService: TipoServicoService,
    private agendamentoService: AgendamentoService,
    private profissionalService: ProfissionalService,
    public utilsService: UtilsService,
    private store: Store<PEPState>,
    private aServ: AtendimentoService,
    private datePipe: DatePipe,
    private router: Router,
    private localService: LocalService,
    private cronogramaService: CronogramaService,
    private toastService: ToastService,
    private pacienteService: PacienteService,
    private FilaAtendimentoService: FilaAtendimentoService,
    private route: ActivatedRoute,
    private especialidadeService: EspecialidadeService,
    private bServ: BeneficiarioService
  ) {}

  public calcTempoEspera(tempoEspera = this.atendimentoPaciente.datIni){

    const today = new Date();
    const birthTime = new Date(tempoEspera);
    this.tempoHoras = today.getUTCHours() - birthTime.getUTCHours();
    this.tempoMinutos = today.getUTCMinutes() - birthTime.getUTCMinutes();

    if(this.tempoMinutos < 0){
      this.tempoMinutos = - today.getUTCMinutes() + birthTime.getUTCMinutes();
      this.tempoEsperaHoras = this.tempoHoras.toString();
      this.tempoEsperaMinutos = this.tempoMinutos.toString();
      return this.tempoEsperaHoras + "h " + this.tempoEsperaMinutos + " min";
    }

    if(this.tempoHoras > 0){
      this.tempoEsperaHoras = this.tempoHoras.toString();
      this.tempoEsperaMinutos = this.tempoMinutos.toString();
      return this.tempoEsperaHoras + "h " + this.tempoEsperaMinutos + " min";
    }

    else{
      this.tempoEsperaMinutos = this.tempoMinutos.toString();
      return this.tempoEsperaMinutos + " min";
    }
  }

  iniciarAtendimento(id){
    this.FilaAtendimentoService.updateAtendimento(id).subscribe(info =>{
    console.log(info)
    this.playCamera();
    this.goAtendimentoPep();

    });
  }

  public debouncedInputValue = this.searchProfissional
  private searchDecouncer$: Subject<string> = new Subject()

  public onSearchInputChange(term: string): void {
    this.searchDecouncer$.next(term)
  }

  private setupSearchDebouncer(): void {
    this.searchDecouncer$
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((term: string) => {
        this.debouncedInputValue = term
        this.loadProfissionais(term)
      })
  }


  ngOnInit() {

    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )

    this.setupSearchDebouncer()

    this.view = this.viewWeek

    this.profissional = undefined
    this.loadingAgendamentos = false
    this.isAgendador = false
    const today = this.utilsService.getToday()
    if (this.view == this.viewMonth) {
      this.currentDate = this.utilsService.startMonth(today)
    } else {
      this.currentDate = today
    }

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(
        (data: any) => {
          this.profissionalLogado = { ...data }
          if (
            data.roles !== undefined && data.roles.includes(UsuarioModels.Role.AGENDADOR) ||
            data.roles.includes(UsuarioModels.Role.ADMIN)
          ) {
            this.locaisComboListAgendador = this.profissionalLogado.locais.map(item => {
              return {
                id: item.id,
                razao_social: item.razao_social
              }
            })
            this.loadProfissionais('')
          } else {
            const profissional: ProfissionalModels.ProfissionalCombo = {
              especialidades: data.especialidades,
              especialidadesDescricao: data.especialidades.length
                ? data.especialidades
                    .map(especialidade => {
                      return especialidade.descricao
                    })
                    .join(', ')
                : '',
              locais: data.locais,
              locaisDescricao: data.locais.length
                ? data.locais
                    .map(local => {
                      return local.razao_social
                    })
                    .join(', ')
                : '',
              id: data.id,
              pessoa: data.pessoa,
              nome: data.pessoa && data.pessoa.nome_completo ? data.pessoa.nome_completo : ''
            }
            this.selectProfissional(profissional)
          }
          this.setFlagAgendador()
        },
        err => {
          this.store.dispatch(
            ErrorsActions.setAgendamento({
              payload: {
                code: 'agendamento_error',
                msg: 'Ocorreu um erro ao carregar os dados da agenda!'
              }
            })
          )
          console.error(err)
        }
      )
    )
    this.loadClassificacao()
    this.loadTipoAgendamento()
    this.loadStatusAgendamento()
    this.error$ = this.store.select(ErrorsSelect.agendamento)

    this.FilaAtendimentoService.populaHeader().subscribe(dados =>{

    this.FilaAtendimentoService.setToken(dados["access_token"]);

     this.FilaAtendimentoService.getAtendimento(dados["access_token"]).subscribe(paciente =>{
      this.pacientes = paciente['attendances']
      })
    })

    this.loadEspecialidade();
  }

  loadEspecialidade(){
    this.especialidadeService.getAllEspecialidades().subscribe(data =>{
      this.grupoEspecialidades = data['data']
    })
  }

  isBlockedType() {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === this.agendaEvent.agendamento_tipo_id
      })
      return tipo && tipo.bloqueio === 1
    }
    return false
  }

  limparFiltroAgendamento() {
    this.searchProfissional = null
    this.localFiltro = null
    this.tipo_servicoFiltro = null
    this.dataFiltro = null
  }

  loadProfissionais(search: string) {
    const agendadorId = this.profissionalLogado.id
    const local = this.localFiltro
    this.resetErrors()
    const roles = [UsuarioModels.Role.MEDICO]
    this.subs$.add(
      this.profissionalService
        .getProfissionalForAgendador(agendadorId, search, local, roles)
        .subscribe(
          data => {
            this.profissionalList = data.data.map(item => {
              const profissional: ProfissionalModels.ProfissionalCombo = {
                especialidades: item.especialidades,
                especialidadesDescricao: item.especialidades.length
                  ? item.especialidades
                      .map(especialidade => {
                        return especialidade.descricao
                      })
                      .join(', ')
                      .substring(0, 50)
                  : '',
                locais: item.locais,
                locaisDescricao: item.locais.length
                  ? item.locais
                      .map(local => {
                        return local.razao_social
                      })
                      .join(', ')
                  : '',
                id: item.id,
                pessoa: item.pessoa,
                nome: item.pessoa && item.pessoa.nome_completo ? item.pessoa.nome_completo : ''
              }
              return profissional
            })
            this.refresh.next()
            this.loadingAgendamentos = false
            this.resetErrors()
          },
          err => {
            this.refresh.next()
            this.loadingAgendamentos = false
            this.store.dispatch(
              ErrorsActions.setAgendamento({
                payload: {
                  code: 'agendamento_error',
                  msg: 'Ocorreu um erro ao carregar os profissionais!'
                }
              })
            )
          }
        )
    )
  }

  setViewWeek() {
    this.view = this.viewWeek
  }

  setViewMonth() {
    this.view = this.viewMonth
  }

  clearProfissional() {
    this.profissional = null
    this.clearLocal()
  }

  isBlockedTypeItem(item) {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === item.agendamento_tipo_id
      })
      return tipo && tipo.bloqueio === 1
    }
    return false
  }

  formatMotivo(motivo) {
    return motivo.substring(0, 25)
  }

  loadAgendamentos() {
    this.loadingAgendamentos = true
    const profissionalId = this.profissional.id
    const profissionalLogadoId = this.profissionalLogado.id
    this.events = []
    let dateStart = null
    let dateEnd = null

    if (this.view == this.viewMonth) {
      dateStart = this.utilsService.startMonth(this.currentDate)
      dateEnd = this.utilsService.endMonth(this.currentDate)
    } else {
      dateStart = this.utilsService.subtractDays(this.currentDate, 7)
      dateEnd = this.utilsService.addDays(this.currentDate, 7)
    }
    this.listarTodos = true
    let tipoServico = this.tipo_servicoFiltro
    this.subs$.add(
      this.agendamentoService
        .getAgendamentos(
          this.utilsService.getFormattedDate(dateStart, 'YYYY-MM-DD'),
          this.utilsService.getFormattedDate(dateEnd, 'YYYY-MM-DD'),
          profissionalId,
          profissionalLogadoId,
          this.localSelected.id,
          tipoServico,
          AgendamentoModels.STATUS.CANCELADO
        )
        .subscribe(
          (listAgendamento: any) => {
            if (listAgendamento && listAgendamento.data) {
              const list = listAgendamento.data.map(agendamento => {
                return this.convertToEventCalendar({ ...agendamento })
              })
              this.events = list
              this.refresh.next()
            }
            this.loadingAgendamentos = false
            this.resetErrors()
          },
          err => {
            this.events = []
            this.loadingAgendamentos = false
            this.refresh.next()
            this.store.dispatch(
              ErrorsActions.setAgendamento({
                payload: {
                  code: 'agendamento_error',
                  msg: 'Ocorreu um erro ao carregar os dados da agenda!'
                }
              })
            )
            console.error(err)
          }
        )
    )
  }

  nextMonth() {
    this.loadingAgendamentos = true
    if (this.view == this.viewMonth) {
      this.currentDate = this.utilsService.addMonths(this.currentDate, 1)
    } else {
      this.currentDate = this.utilsService.addDays(this.currentDate, 7)
    }
    this.loadAgendamentos()
  }

  prevMonth() {
    this.loadingAgendamentos = true
    if (this.view == this.viewMonth) {
      this.currentDate = this.utilsService.subtractMonths(this.currentDate, 1)
    } else {
      this.currentDate = this.utilsService.subtractDays(this.currentDate, 7)
    }
    this.loadAgendamentos()
  }

  selectDate(event) {
    if (event && event.day) {
      this.diaSelecionado = event.day.date
    }
  }

  isAvailable(event) {
    const duracaoConsulta = this.localSelected.duracao_consulta
    const today = this.utilsService.getToday()
    let date = event.date
    let diff = this.utilsService.diffDays(date, today)

    if (this.isRetroativo) {
      return diff < 0
    }
    if (diff < 0) {
      return false
    }
    let week = this.utilsService.getWeekDay(date)
    let filterList = this.cronograma
      .filter(item => {
        return item.local_id === this.localSelected.id && item.dia_da_semana === week + 1
      })
      .filter(item => {
        const [horaInicio, minutoInicio] = item.hora_inicio.split(':')
        const [horaFim, minutoFim] = item.hora_fim.split(':')
        let startDate = this.utilsService.getDate(date).set({
          hours: horaInicio,
          minutes: minutoInicio
        })
        let endDate = this.utilsService.getDate(date).set({
          hours: horaFim,
          minutes: minutoFim
        })
        const diffStartHour = this.utilsService.diffMinutes(startDate, date)
        let dateDuracaoMin = this.utilsService.addMinutes(date, duracaoConsulta)
        const diffEndHour = this.utilsService.diffMinutes(endDate, dateDuracaoMin)
        return diffStartHour <= 0 && diffEndHour >= 0
      })
      .filter(item => {
        let diffInicio = this.utilsService.diffDays(date, item.vigencia_inicio)
        let diffFim = this.utilsService.diffDays(date, item.vigencia_fim)

        return diffInicio >= 0 && diffFim <= 0
      })

    return filterList.length > 0
  }

  selectDateAndCadastro(event) {
    if (this.isAvailable(event)) {
      this.diaSelecionado = event.date
      this.openModalCadastro('', undefined)
    }
  }

  today() {
    this.loadingAgendamentos = true
    this.currentDate = this.utilsService.getToday()
    this.loadAgendamentos()
  }

  convertToEventCalendar(agendamento) {
    const start = new Date(
      agendamento.data_inicio
        .toString()
        .replace('T', ' ')
        .replace('Z', '')
    )
    const end = new Date(
      agendamento.data_fim
        .toString()
        .replace('T', ' ')
        .replace('Z', '')
    )
    const calendarEvent = {
      id: agendamento.id,
      paciente: agendamento.paciente,
      profissional: agendamento.profissional,
      idProfissional: agendamento.id_profissional,
      profissionalId: agendamento.profissional_id,
      localId: agendamento.local_id,
      localDescricao: agendamento.local_id ? agendamento.local_razao_social : 'Sem local definido',
      mpiPaciente: agendamento.mpi_paciente,
      mpiProfissional: agendamento.mpi_profissional,
      title: agendamento.paciente
        ? 'Paciente: ' +
          agendamento.paciente.nomeCompleto +
          '<br> Das: ' +
          this.datePipe.transform(start, 'HH:mm') +
          ' às: ' +
          this.datePipe.transform(end, 'HH:mm') +
          '<br> Local: ' +
          agendamento.local_razao_social +
          '<br> Agendamento: ' +
          this.getStatus(agendamento).descricao
        : 'Horário bloqueado',
      title2: agendamento.paciente ? agendamento.paciente.nomeCompleto : 'Horário bloqueado',
      dataInicio: this.datePipe.transform(start, 'yyyy-MM-dd HH:mm'),
      dataFim: this.datePipe.transform(end, 'yyyy-MM-dd HH:mm'),
      linkPaciente: agendamento.link_paciente,
      linkProfissional: agendamento.link_profissional,
      token: agendamento.token,
      sala: agendamento.sala,
      motivo: agendamento.motivo,
      agendamento_tipo_id: agendamento.agendamento_tipo_id,
      agendamento_status_id: agendamento.agendamento_status_id,
      agendamento_status: agendamento.agendamento_status,
      sequencial: agendamento.sequencial_atendimento,
      idTipoServivo: agendamento.tipo_servico ? agendamento.tipo_servico.id : 0,
      descricaoTipoServico: agendamento.tipo_servico ? agendamento.tipo_servico.descricao : '',
      idClassificacao: agendamento.classificacao ? agendamento.classificacao.id : 0,
      descricaoClassificacao: agendamento.classificacao ? agendamento.classificacao.descricao : '',
      telefone:
        agendamento.telefone_paciente.substring(0, 2) === '55'
          ? agendamento.telefone_paciente.substring(2)
          : agendamento.telefone_paciente,
      email: agendamento.email_paciente,
      start,
      end,
      color: {
        primary: this.getStatus(agendamento).apresentacao_cor,
        secondary: this.getStatus(agendamento).apresentacao_cor
      },
      backgroundColor: '#000',
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      },
      pago: agendamento.pago,
      reagendamento: agendamento.reagendamento,
      retroativo: agendamento.retroativo,
      cssStyle: { 'backgroud-color': this.getStatus(agendamento).apresentacao_cor }
    }
    return calendarEvent
  }

  getStatus(agendamento) {
    if (this.isBlockedTypeItem(agendamento)) {
      return {
        apresentacao_cor: '#808080',
        descricao: 'Bloqueio'
      }
    }
    const agendamentoStatusId = agendamento.agendamento_status_id
    const dataInicio = new Date(
      agendamento.data_inicio
        .toString()
        .replace('T', ' ')
        .replace('Z', '')
    )
    const status = this.listStatusAgendamento.find(item => {
      return item.id === agendamentoStatusId
    })
    const statusAtrasado = this.listStatusAgendamento.find(item => {
      return item.codigo === AgendamentoModels.STATUS.ATRASADO
    })
    if (status && status.codigo === AgendamentoModels.STATUS.AGENDADO) {
      if (new Date(dataInicio).getTime() < new Date().getTime()) {
        return statusAtrasado
      }
    }
    return status
  }

  dayClicked({ date, events }: { date: any; events: any[] }): void {
    this.diaSelecionado = date
    this.viewDate = date
    this.setListarTodos(false)
  }

  beforeViewRender({ header }: { header: WeekDay[] }): void {
    header.forEach(day => {
      day.cssClass = 'cal-day-selected'
    })
  }

  getListEvents() {
    const events = this.events
      .filter(item => {
        const date = item.dataInicio.split(' ')
        const diff = this.utilsService.diffDays(date[0], this.diaSelecionado)
        return this.listarTodos || diff === 0
      })
      .sort((item1, item2) => {
        const date1 = item1.dataInicio.split(' ')[0]
        const date2 = item2.dataInicio.split(' ')[0]
        if (this.utilsService.diffDays(date1, date2) < 0) {
          return -1
        } else if (this.utilsService.diffDays(date1, date2) > 0) {
          return 1
        }
        return 0
      })
    return events
  }

  setListarTodos(param) {
    this.listarTodos = param
  }

  showBtnAnterior(viewDate) {
    return (
      (viewDate.getMonth() > new Date().getMonth() &&
        viewDate.getFullYear() === new Date().getFullYear()) ||
      viewDate.getFullYear() > new Date().getFullYear()
    )
  }

  isPastDate(item) {
    const today = this.utilsService.getToday()
    const date = item.dataInicio.split(' ')[0]
    const diff = this.utilsService.diffDays(date, today)
    return diff < 0
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        }
      }
      return iEvent
    })
    this.handleEvent('Dropped or resized', event)
  }

  handleEvent(action: string, event: any): void {
    this.modalDetalhesAgenda = { event, action }
    this.modalService.open(this.modalContent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
  }

  deleteEvent(agendamento: AgendamentoModels.Agendamento) {
    this.loadingAgendamentos = true
    this.subs$.add(
      this.agendamentoService.deleteAgendamento(agendamento.id).subscribe(
        (res: any) => {
          this.loadAgendamentos()
          this.close()
        },
        err => {
          this.loadingAgendamentos = false
          this.store.dispatch(
            ErrorsActions.setAgendamento({
              payload: {
                code: 'agendamento_error',
                msg: 'Ocorreu um erro ao remover o agendamento'
              }
            })
          )
          console.error(err)
        }
      )
    )
  }

  setView(view: CalendarView) {
    this.view = view
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false
  }

  setFlagAgendador() {
    const roles = this.profissionalLogado.roles
    this.isAgendador =
      roles.includes(UsuarioModels.Role.AGENDADOR) || roles.includes(UsuarioModels.Role.ADMIN)
  }

  isMedico() {
    const roles = this.profissionalLogado.roles
    return roles.includes(UsuarioModels.Role.MEDICO)
  }

  disableBtnSaveAgendamento() {
    if (this.isBlockedType()) {
      return !this.agendaEvent.start || !this.agendaEvent.end
    }
    return (
      !this.agendaEvent.paciente ||
      !this.agendaEvent.start ||
      !this.agendaEvent.end ||
      !this.agendaEvent.agendamento_tipo_id ||
      !this.agendaEvent.tipo_servico ||
      !this.agendaEvent.classificacao
    )
  }

  openModalInfo(event) {
    const action = 'Dropped or resized'
    this.modalDetalhesAgenda = { event, action }
    this.modalService.open(this.modalContent, {
      centered: true,
      size: 'lg'
    })
  }

  openModalCronograma() {
    this.modalService.open(this.modalCronograma, { size: 'lg' })
  }

  openModalHistorico() {
    this.modalService.open(this.modalHistorico, { size: 'lg' })
  }

  async loadTipoAgendamento() {
    await this.agendamentoService.getTiposAgendamento().subscribe(
      (data: Array<AgendamentoModels.TipoAgendamento>) => {
        this.listTipoAgendamento = data.sort((item1, item2) => {
          if (item1.descricao > item2.descricao) {
            return 1
          }
          if (item1.descricao < item2.descricao) {
            return -1
          }
          return 0
        })
      },
      err => {
        this.store.dispatch(
          ErrorsActions.setAgendamento({
            payload: {
              code: 'agendamento_error',
              msg: 'Não foi possível carregar os tipos de agendamento'
            }
          })
        )
        console.error(err)
      }
    )
  }

  async loadStatusAgendamento() {
    await this.agendamentoService.getStatusAgendamento().subscribe(
      (data: Array<AgendamentoModels.StatusAgendamento>) => {
        this.listStatusAgendamento = data
      },
      err => {
        this.store.dispatch(
          ErrorsActions.setAgendamento({
            payload: {
              code: 'agendamento_error',
              msg: 'Não foi possível carregar os status de agendamento'
            }
          })
        )
        console.error(err)
      }
    )
  }

  async loadClassificacao() {
    await this.classificacaoService.getClassificacoes().subscribe(
      (data: Array<ClassificacaoModels.Classificacao>) => {
        this.listClassificacao = data.sort((item1, item2) => {
          if (item1.descricao > item2.descricao) {
            return 1
          }
          if (item1.descricao < item2.descricao) {
            return -1
          }
          return 0
        })
      },
      err => {
        this.store.dispatch(
          ErrorsActions.setAgendamento({
            payload: {
              code: 'agendamento_error',
              msg: 'Não foi possível carregar as classificações do agendamento'
            }
          })
        )
        console.error(err)
      }
    )
  }

  async loadTipoServico() {
    this.listTipoServico = []
    if (
      this.profissional &&
      this.profissional.especialidades &&
      this.profissional.especialidades.length
    ) {
      const locais = this.localSelected.id
      const especialidades = this.profissional.especialidades
        .map(item => {
          return item.id
        })
        .join(',')
      await this.tipoServicoService
        .getTiposServicosByLocalAndEspecialidade(locais, especialidades)
        .subscribe(
          (res: TipoServicoModels.TipoServicoPEPApi) => {
            this.listTipoServico = res.data.sort((item1, item2) => {
              if (item1.descricao > item2.descricao) {
                return 1
              }
              if (item1.descricao < item2.descricao) {
                return -1
              }
              return 0
            })
          },
          err => {
            this.toastService.error('Não foi possível carregar os tipos de serviço do agendamento')
            this.store.dispatch(
              ErrorsActions.setAgendamento({
                payload: {
                  code: 'agendamento_error',
                  msg: 'Não foi possível carregar os tipos de serviço do agendamento'
                }
              })
            )
            console.error(err)
          }
        )
    } else {
      this.toastService.error('Não há especialidades ativas vinculadas ao médico!')
    }
  }

  getStatusAtrasado(status, dataInicio) {
    if (status === AgendamentoModels.STATUS.AGENDADO) {
      if (new Date(dataInicio).getTime() < new Date().getTime()) {
        return AgendamentoModels.STATUS.ATRASADO
      }
    }
    return status
  }

  openModalCadastro(action: string, event: any): void {
    const start = this.diaSelecionado
    const end = this.utilsService.addMinutesDate(this.diaSelecionado, this.duracaoDaConsulta)
    this.agendaEvent = {
      paciente: undefined,
      profissional: '',
      idProfissional: undefined,
      dataInicio: start,
      dataFim: end,
      agendamento_tipo_id: undefined,
      agendamento_status_id: undefined,
      status: undefined,
      motivo: '',
      email: '',
      telefone: '',
      tipo_servico: undefined,
      classificacao: undefined,
      local_id: 0
    }
    this.modalDetalhesAgenda = { event, action }
    this.modalService.open(this.modalContentCadastro, {
      centered: true,
      size: 'xl',
      backdrop: 'static'
    })
  }

  openModalEditar(event) {
    this.agendaEvent = {
      id: event.id,
      paciente: event.paciente,
      nomePaciente: event.paciente.nomeCompleto,
      profissional: event.profissional,
      idProfissional: event.idProfissional,
      dataInicio: event.dataInicio,
      dataFim: event.dataFim,
      start: this.datePipe.transform(event.dataInicio, 'HH:mm'),
      end: this.datePipe.transform(event.dataFim, 'HH:mm'),
      motivo: event.motivo,
      agendamento_tipo_id: event.agendamento_tipo_id,
      agendamento_status_id: event.agendamento_status_id,
      email: event.email,
      telefone: event.telefone,
      tipo_servico: event.idTipoServivo,
      classificacao: event.idClassificacao,
      local_id: event.localId,
      localDescricao: event.localDescricao,
      pago: event.pago,
      reagendamento: event.reagendamento,
      retroativo: event.retroativo
    }
    const action = 'Dropped or resized'
    this.modalDetalhesAgenda = { event, action }
    this.modalService.open(this.modalContentCadastro, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
  }

  updateAgendamento() {
    this.loadingSave = true
    this.loadingAgendamentos = true
    const id = this.agendaEvent.id
    const agendamento: AgendamentoModels.AgendamentoUpdate = {
      data_inicio: this.datePipe.transform(
        this.setTime(this.agendaEvent.dataInicio, this.agendaEvent.start),
        'yyyy-MM-dd HH:mm:ss'
      ),
      data_fim: this.datePipe.transform(
        this.setTime(this.agendaEvent.dataInicio, this.agendaEvent.end),
        'yyyy-MM-dd HH:mm:ss'
      ),
      motivo: this.agendaEvent.motivo,
      agendamento_tipo_id: this.agendaEvent.agendamento_tipo_id,
      agendamento_status_id: this.agendaEvent.agendamento_status_id,
      email_paciente: this.agendaEvent.email,
      telefone_paciente: this.formatTelefone(this.agendaEvent.telefone),
      id_tipo_servico: this.agendaEvent.tipo_servico,
      id_classificacao: this.agendaEvent.classificacao,
      local_id: this.agendaEvent.local_id,
      pago: this.agendaEvent.pago,
      reagendamento: this.agendaEvent.reagendamento
    }
    this.subs$.add(
      this.agendamentoService.putAgendamento(id, agendamento).subscribe(
        res => {
          this.loadAgendamentos()
          this.loadingSave = false
          this.toastService.success('Agendamento atualizado com sucesso!')
          this.close()
        },
        err => {
          this.loadingSave = false
          this.loadingAgendamentos = false
          this.toastService.error(err.error.error)
          this.resetErrors()
          console.error(err)
        }
      )
    )
  }

  postAgendamento() {
    this.loadingSave = true
    this.loadingAgendamentos = true
    let agendamento: AgendamentoModels.AgendamentoPost
    if (this.isBlockedType()) {
      agendamento = {
        mpi_paciente: '',
        profissional_id: this.profissional.id,
        agendamento_tipo_id: this.agendaEvent.agendamento_tipo_id,
        motivo: this.agendaEvent.motivo,
        data_inicio: this.datePipe.transform(
          this.setTime(this.diaSelecionado, this.agendaEvent.start),
          'yyyy-MM-dd HH:mm:ss'
        ),
        data_fim: this.datePipe.transform(
          this.setTime(this.diaSelecionado, this.agendaEvent.end),
          'yyyy-MM-dd HH:mm:ss'
        ),
        email_paciente: '',
        telefone_paciente: '',
        id_tipo_servico: this.agendaEvent.tipo_servico,
        id_classificacao: this.agendaEvent.classificacao,
        local_id: this.localSelected.id,
        pago: this.agendaEvent.pago,
        reagendamento: this.agendaEvent.reagendamento,
        retroativo: this.isRetroativo ? true : false
      }
    } else {
      agendamento = {
        mpi_paciente: this.agendaEvent.paciente.mpi,
        profissional_id: this.profissional.id,
        agendamento_tipo_id: this.agendaEvent.agendamento_tipo_id,
        motivo: this.agendaEvent.motivo,
        data_inicio: this.datePipe.transform(
          this.setTime(this.diaSelecionado, this.agendaEvent.start),
          'yyyy-MM-dd HH:mm:ss'
        ),
        data_fim: this.datePipe.transform(
          this.setTime(this.diaSelecionado, this.agendaEvent.end),
          'yyyy-MM-dd HH:mm:ss'
        ),
        email_paciente: this.agendaEvent.email,
        telefone_paciente: this.formatTelefone(this.agendaEvent.telefone),
        id_tipo_servico: this.agendaEvent.tipo_servico,
        id_classificacao: this.agendaEvent.classificacao,
        local_id: this.localSelected.id,
        pago: this.agendaEvent.pago,
        reagendamento: this.agendaEvent.reagendamento,
        retroativo: this.isRetroativo ? true : false
      }
    }
    this.subs$.add(
      this.agendamentoService.postAgendamento(agendamento).subscribe(
        res => {
          this.loadAgendamentos()
          this.loadingSave = false
          this.toastService.success('Agendamento cadastrado com sucesso!')
          this.close()
        },
        err => {
          this.loadingAgendamentos = false
          this.toastService.error(err.error.error)
          this.resetErrors()
          this.loadingSave = false
        }
      )
    )
  }

  saveAgendamento(): void {
    if (this.agendaEvent.id) {
      this.updateAgendamento()
    } else {
      if (this.isBlockedType() || this.agendaEvent.paciente) {
        this.postAgendamento()
      } else {
        this.toastService.error('Não é possível cadastrar um agendamento sem paciente.')
        this.resetErrors()
      }
    }
  }

  formatText(text) {
    if (text) {
      return this.titleCase(text.split('_').join(' '))
    } else {
      return ''
    }
  }

  titleCase(str) {
    const splitStr = str.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
  }

  formatTelefone(telefoneParam) {
    let phone = ''
    if (telefoneParam) {
      phone = telefoneParam
        .replace(/\s/g, '')
        .replace('-', '')
        .replace('(', '')
        .replace(')', '')
        .trim()
      if (phone.substring(0, 2) === '55') {
        return phone
      } else {
        return (phone = `55${phone}`)
      }
    }
  }

  setTime(diaSelecionadoParam: Date, timeParam) {
    const diaSelecionadoTemp = new Date(diaSelecionadoParam)
    const time = timeParam.split(':')
    const hour = time[0].trim()
    const min = time[1].trim()
    diaSelecionadoTemp.setHours(hour)
    diaSelecionadoTemp.setMinutes(min)
    return diaSelecionadoTemp
  }

  async loadCronograma(profissionalId: number) {
    const today = this.utilsService.getToday()
    return this.cronogramaService.getByProfissionalId(profissionalId).subscribe(data => {
      this.cronograma = data.data
      let locaisTemp: Array<LocalAtendimentoModels.LocalAtendimentoCombo> = []
      this.cronograma.forEach(item => {
        let find = locaisTemp.find(local => {
          return local.id === item.local_id
        })
        if (!find) {
          locaisTemp.push({
            id: item.local_id,
            razao_social: item.local_razao_social,
            duracao_consulta: item.duracao_consulta
          })
        }
      })
      let locais = []
      this.profissionalLogado.locais.forEach(proLocal => {
        locaisTemp.forEach(localItemTemp => {
          if (localItemTemp.id == proLocal.id) {
            locais.push(proLocal)
          }
        })
      })
      this.localList = locais
      this.loadingAgendamentos = false
      this.resetToast()
    })
  }

  locaisFiltered() {
    return this.localList.filter(local => {
      if (this.searchLocal) {
        return local.razao_social.toLowerCase().includes(this.searchLocal.toLowerCase())
      } else {
        return local.razao_social
      }
    })
  }

  truncateNomeProfissional(sentence, amount, tail) {
    if (sentence) {
      const words = sentence.split(' ')

      if (amount >= words.length) {
        return sentence
      }

      let truncated = words.slice(0, amount)
      const maxCaracters = 12
      return truncated.join(' ').substr(0, maxCaracters) + tail
    } else {
      return ''
    }
  }

  selectProfissional(profissional: any) {
    this.profissional = profissional
    this.loadCronograma(profissional.id)
  }

  selectLocal(local) {
    if (!local.operadoras || !local.operadoras.length) {
      this.toastService.error('Não há operadoras vinculadas à este local!')
      return
    }
    this.localSelected = local
    if (this.localSelected.duracao_consulta) {
      this.duracaoDaConsulta = this.localSelected.duracao_consulta
      this.refresh.next()
    }
    this.loadAgendamentos()
    this.loadTipoServico()
  }

  clearLocal() {
    this.localSelected = null
  }

  setStatusCanceladoAgendamento(ev) {
    this.subs$.add(
      this.agendamentoService.cancelarAgendamento(ev.id).subscribe(
        res => {
          this.loadAgendamentos()
          this.close()
        },
        err => {
          this.toastService.error(err.error.error)
          this.resetErrors()
          console.error(err)
        }
      )
    )
  }

  iniciar(agendamento) {
    this.loadingAgendamentos = true
    this.loading = true
    this.agendamentoToStart = agendamento
    this.localService.getLocalById(agendamento.localId).subscribe(
      data => {
        this.store.dispatch(AgendamentoActions.setAgendamento({ payload: { ...agendamento } }))
        this.startAtendimento(agendamento, data.data)
      },
      err => {
        this.loadingAgendamentos = false
        this.refresh.next()
      }
    )
  }

  startAtendimento(agendamento, local) {
    const beneficiario = { ...agendamento.paciente }
    this.store.dispatch(AuthActions.reset({ payload: beneficiario.mpi }))
    this.store.dispatch(AgendamentoActions.setAgendamento({ payload: agendamento }))
    this.store.dispatch(LocalActions.setLocal({ payload: local }))
    this.subs$.add(
      this.aServ.start(beneficiario).subscribe(
        (res: any) => {
          let classificacao = {}
          let tipoServico = {}

          tipoServico = this.listTipoServico.find(
            tipoServicoElem => tipoServicoElem.id == agendamento.idTipoServivo
          )
          classificacao = this.listClassificacao.find(
            classificacaoElem => classificacaoElem.id == agendamento.idClassificacao
          )

          const atendimento = {
            id: res.count,
            beneficiario,
            tipo_servico: tipoServico,
            classificacao: classificacao
          }
          this.loadCodOperadora(beneficiario, atendimento, agendamento)
        },
        err => {
          this.loadingAgendamentos = false
          this.refresh.next()
          this.toastService.error('Não foi possível iniciar o atendimento!')
          this.resetErrors()
          console.error(err)
        }
      )
    )
  }

  loadCodOperadora(beneficiario, atendimento, agendamento) {
    this.subs$.add(
      this.aServ.getCodigoOperadora(beneficiario.mpi).subscribe(
        data => {
          if (data.length) {
            atendimento.codigoOperadora = data[0].codigoOperadora
            this.loadSequential(atendimento, agendamento)
          } else {
            this.loading = false
            this.toastService.error('Código da operadora não cadastrado.')
            console.error('Código da operadora não cadastrado.')
          }
        },
        err => {
          this.loading = false
          this.toastService.error('Código da operadora não cadastrado.')
          console.error('Código da operadora não cadastrado.', err)
        }
      )
    )
  }

  loadSequential(atendimento, agendamento) {
    this.subs$.add(
      this.aServ.getAtendimentoSequential().subscribe(
        sequencial => {
          atendimento.sequencial = sequencial
          this.agendamentoService.setSequencialToAgendamento(agendamento.id, sequencial).subscribe(
            data => {
              this.agendamentoService.setStatusIniciado(agendamento.id).subscribe(
                data => {
                  this.navigateToPainel(atendimento)
                },
                err => {
                  this.toastService.error(err.error.error)
                  this.toastService.error(
                    'Não foi possível atribuir o status iniciado ao agendamento!'
                  )
                  console.error('Não foi possível atribuir o status iniciado ao agendamento!')
                }
              )
            },
            err => {
              this.toastService.error('Não foi possível o agendamento ao atendimento!')
              console.error('Não foi possível o agendamento ao atendimento!')
            }
          )
        },
        err => {
          this.loading = false
          this.toastService.error('Não foi possível iniciar o atendimento!')
          console.error('Erro ao gerar o sequencial de atendimento.', err)
        }
      )
    )
  }

  navigateToPainel(atendimento) {
    this.store.dispatch(AtendimentoActions.start({ payload: atendimento }))
    this.toastService.success('Atendimento iniciado com sucesso!')
    this.router.navigateByUrl(`${this.url}/painel`)
  }

  disableBtnsModalInfo(ev) {
    if (ev.agendamento_status) {
      const codigo = ev.agendamento_status.codigo
      return (
        codigo === AgendamentoModels.STATUS.CANCELADO ||
        codigo === AgendamentoModels.STATUS.REALIZADO ||
        codigo === AgendamentoModels.STATUS.INICIADO ||
        (this.isPastDate(ev) && !ev.retroativo)
      )
    }
    return this.isAgendador
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  openModalConfirmDelete(event) {
    const action = 'Dropped or resized'
    this.modalDetalhesAgendaDelete = { event, action }
    this.modalService.open(this.modalContentConfirmDelete, {
      centered: true,
      size: 'lg'
    })
  }

  abrirModalConfirmCancelar(event) {
    this.close()
    const action = 'Dropped or resized'
    this.modalDetalhesAgendaCancelar = { event, action }
    this.modalService.open(this.modalContentConfirmCancelar, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
  }

  resetToast() {
    this.store.dispatch(
      ErrorsActions.setAgendamento({
        payload: {
          code: 'agendamento_error',
          msg: ''
        }
      })
    )
  }

  statusDiferenteCanceladoERealizado(ev) {
    return (
      ev.agendamento_status &&
      ev.agendamento_status.codigo !== AgendamentoModels.STATUS.CANCELADO &&
      ev.agendamento_status.codigo !== AgendamentoModels.STATUS.REALIZADO
    )
  }

  close() {
    this.modalService.dismissAll()
  }

  getColorByStatus(status) {
    return status.apresentacao_cor
  }

  getIconByStatus(status) {
    return status.apresentacao_icon
  }

  resetErrors() {
    this.store.dispatch(
      ErrorsActions.setAgendamento({
        payload: {
          code: '',
          msg: ''
        }
      })
    )
  }

  applyFilter() {
    if (this.dateFilter) {
      let date = this.utilsService.formatterDateToISOWithGMT(this.dateFilter)
      this.currentDate = date
      this.viewDate = new Date(date)
    }
    this.loadAgendamentos()
  }

  async reload() {
    await this.loadCronograma(this.profissional.id)
    this.loadAgendamentos()
  }

  openMoveAgendamentos() {
    this.modalService.open(this.modalTransferir, { size: 'lg' })
  }

  goAtendimentoPep() {
    this.router.navigate([`${this.url}/painel`])
  }

  playCamera(){
    window.open("_blank")
  }
}
