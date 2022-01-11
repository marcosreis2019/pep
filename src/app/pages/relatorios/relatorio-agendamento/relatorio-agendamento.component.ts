import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ExcelService } from 'src/app/_store/services/excel/excel.service'
import moment from 'moment-timezone'
import { AgePipe } from 'src/app/pipes/age/age.pipe'
import { DatePipe } from '@angular/common'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { ToastService } from 'angular-toastify'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'

export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-agendamento',
  templateUrl: './relatorio-agendamento.component.html',
  styleUrls: ['./relatorio-agendamento.component.scss']
})
export class RelatorioAgendamentoComponent implements OnInit, OnDestroy {
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  @Output() apply: EventEmitter<TimelineFilters>
  form: FormGroup

  msgDataInvalida = ''
  loading = false
  error: string = ''
  private subs$ = new SubSink()

  locaisList: any[] = []
  selectedItems = []
  dropdownSettings = {}

  constructor(
    private formB: FormBuilder,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    private agePipe: AgePipe,
    private store: Store<PEPState>,
    private toastService: ToastService,
    private agendamentoService: AgendamentoService
  ) {
    this.apply = new EventEmitter<TimelineFilters>(undefined)
  }

  ngOnInit() {
    this.form = this.formB.group({
      dataInicio: [undefined],
      dataFim: [undefined],
      locais: [undefined]
    })

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(profissional => {
        this.locaisList = profissional.locais
      })
    )

    this.selectedItems = []
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'razao_social',
      selectAllText: 'Selecionar todos',
      unSelectAllText: 'Desselecionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }
  }

  toggleRelatorio() {
    this.modalService.open(this.relatorio, {
      centered: true,
      size: 'lg'
    })
  }

  async generateExcel() {
    const value = this.form.value as TimelineFilters
    const dataInicio = this.formatDateMoment(value.dataInicio)
    const dataFim = this.formatDateMoment(value.dataFim)
    const startAt = this.formatDate(value.dataInicio)
    const end = this.formatDate(value.dataFim)

    let dataValida = true
    const dias = moment.duration(dataFim.diff(dataInicio)).asDays()
    if (dias > 30) {
      dataValida = false
      this.toastService.info('O intervalo de data não pode ser maior que 30 dias!')
    } else if (dias < 0) {
      dataValida = false
      this.toastService.info('Data final não pode ser menor que a data inicial!')
    }

    if (dataValida) {
      this.msgDataInvalida = ''
      this.loading = true

      let locais = this.selectedItems.map(item => {
        return item.id
      })

      this.subs$.add(
        this.agendamentoService.getRelatorioAgendamentosLocais(startAt, end, locais).subscribe(
          res => {
            if (res && res.data && res.data.length > 0) {
              this.loading = false
              this.montaRelatorio(res.data)
            } else {
              this.loading = false
              this.toastService.warn('Dados insuficientes para gerar o relatário de agendamentos!')
            }
          },
          err => {
            this.toastService.error('Não foi possível gerar relatório de agendamentos!')
            console.error(err)
            this.loading = false
          }
        )
      )
      this.modalService.dismissAll()
    }
  }

  montaRelatorio(agendamentos) {
    let data = []

    let header = [
      'Status',
      'Paciente',
      'Data de nascimento',
      'Idade',
      'Carteirinha',
      'CPF',
      'Data',
      'Hora',
      'Tipo do agendamento',
      'Médico',
      'Nome do Serviço Utilizado',
      'Convenio Paciente',
      'Sexo Paciente',
      'Estado',
      'Cidade',
      'Bairro',
      'Endereço',
      'Número Atendimento',
      'Local Atendimento'
    ]

    for (let i = 0; i < agendamentos.length; i++) {
      const agendamento = agendamentos[i]
      const paciente: any = agendamento.paciente

      let ev = []
      ev.push(agendamento.status_descricao)
      ev.push(paciente.nomeCompleto)
      const datanasc = new Date(paciente.dataNascimento)
      ev.push(
        datanasc.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      )
      ev.push(this.agePipe.transform(paciente.dataNascimento))
      ev.push(paciente.matricula)
      ev.push(paciente.cpf) // #CPF
      ev.push(this.datePipe.transform(agendamento.data_inicio, 'dd/MM/yyyy'))
      agendamento.data_inicio = agendamento.data_inicio.replace('T', ' ').replace('Z', '')
      ev.push(this.datePipe.transform(agendamento.data_inicio, 'HH:mm'))
      ev.push(agendamento.agendamento_tipo_descricao)
      ev.push(agendamento.profissional_nome)

      ev.push(agendamento.tipo_servico_descricao)

      ev.push(paciente.descricaoOperadora)
      const dataInicioItem = new Date(agendamento.data_inicio)
      const dataFimItem = new Date(agendamento.data_fim)
      ev.push(paciente.genero)

      if (paciente.enderecos && paciente.enderecos.length > 0) {
        ev.push(paciente.enderecos[0].uf)
        ev.push(paciente.enderecos[0].cidade)
        ev.push(paciente.enderecos[0].bairro)
        ev.push(paciente.enderecos[0].logradouro)
      } else {
        ev.push('')
        ev.push('')
        ev.push('')
        ev.push('')
      }

      ev.push(agendamento.sequencial_atendimento)
      ev.push(agendamento.local_nome)
      data.push(ev)
    }

    let title = ''
    let widthColumn = [
      12,
      40,
      15,
      15,
      20,
      15,
      15,
      20,
      20,
      40,
      45,
      20,
      20,
      20,
      20,
      15,
      35,
      45,
      25,
      25,
      40
    ]
    this.loading = false
    this.excelService.generateExcel(title, header, data, widthColumn, 'RelatorioAgendamentos')
  }

  formatDateMoment(dataParam: string) {
    const dataTemp = moment(
      dataParam.substring(6, 10) + '-' + dataParam.substring(3, 5) + '-' + dataParam.substring(0, 2)
    )
    return dataTemp
  }

  formatDate(dataParam: string) {
    const dataTemp =
      dataParam.substring(6, 10) + '-' + dataParam.substring(3, 5) + '-' + dataParam.substring(0, 2)
    return dataTemp
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
}
