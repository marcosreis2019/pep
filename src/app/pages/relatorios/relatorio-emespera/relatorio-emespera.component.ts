import { Component, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ExcelService } from 'src/app/_store/services/excel/excel.service'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'
import { SubSink } from 'subsink'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ToastService } from 'angular-toastify'
import { UtilsService } from 'src/app/providers/utils/utils.service'

export interface Filters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-emespera',
  templateUrl: './relatorio-emespera.component.html',
  styleUrls: ['./relatorio-emespera.component.scss']
})
export class RelatorioEmEsperaComponent implements OnInit {
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  @Output() apply: EventEmitter<Filters>
  form: FormGroup

  private subs$ = new SubSink()

  loading = false
  error: string = ''
  localId: number = 0
  locaisList: any[] = []

  constructor(
    private formB: FormBuilder,
    private agendamentoService: AgendamentoService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private store: Store<PEPState>,
    private toastService: ToastService,
    private utilsService: UtilsService
  ) {
    this.apply = new EventEmitter<Filters>(undefined)
  }

  ngOnInit() {
    this.form = this.formB.group({
      dataInicio: [undefined],
      dataFim: [undefined],
      local: [undefined]
    })

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(profissional => {
        this.locaisList = profissional.locais
      })
    )
  }

  toggleRelatorio() {
    this.modalService.open(this.relatorio, {
      centered: true,
      size: 'lg'
    })
  }

  async generateExcel() {
    if (this.form.value.dataInicio === '' || this.form.value.dataFim === '' || this.localId === 0) {
      this.toastService.error('Preencha todos os campos')
      return
    }
    let split = this.form.value.dataInicio.split('/')
    const dataInicio = `${split[2]}-${split[1]}-${split[0]}`
    split = this.form.value.dataFim.split('/')
    const dataFim = `${split[2]}-${split[1]}-${split[0]}`

    this.agendamentoService.getRelatorioEmEspera(dataInicio, dataFim, this.localId).subscribe(
      data => {
        if (!data.length) {
          this.toastService.error('Não há dados no período')
          return
        }
        this.loadReport(data)
      },
      err => {
        console.error(err)
      }
    )
  }

  loadReport(arrayReportData: any[]) {
    let reportData: any[] = []
    let agendamento = {
      id: 0,
      data: '',
      hora: '',
      paciente: '',
      operadora: '',
      profissional: '',
      tipoServico: '',
      emEspera: '',
      emAtendimento: '',
      atendido: '',
      tempoEmEspera: 0,
      tempoTotal: 0
    }
    let data = Object.assign({}, agendamento)
    arrayReportData.forEach((item, index) => {
      if (item.status_codigo == 'EMESPERA') {
        data = Object.assign({}, agendamento)
        const date = `${item.data}-03:00`
        data.id = item.agendamento_id
        data.data = this.utilsService.getFormattedDate(date)
        data.hora = this.utilsService.getFormattedHour(date)
        data.paciente = item.paciente_nome
        data.operadora = item.operadora
        data.profissional = item.profissional_nome
        data.tipoServico = item.tipo_servico_descricao
        data.emEspera = item.created_at
      }
      if (item.status_codigo == 'INICIADO') {
        data.emAtendimento = item.created_at
        data.tempoEmEspera = this.utilsService.diffMinutes(data.emAtendimento, data.emEspera)
      }
      if (item.status_codigo == 'REALIZADO') {
        data.atendido = item.created_at
        data.tempoTotal = this.utilsService.diffMinutes(data.atendido, data.emEspera)
        reportData.push(data)
      }
    })
    this.buildReport(reportData)
  }

  buildReport(arrayReportData) {
    let data = []

    let header = [
      'Agendamento',
      'Data',
      'Hora',
      'Paciente',
      'Operadora',
      'Médico',
      'Serviço',
      'Em espera',
      'Em atendimento',
      'Atendido',
      'Tempo em espera (minutos)',
      'Tempo total (minutos)'
    ]

    arrayReportData.forEach(reportData => {
      let row = []

      row.push(reportData.id)
      row.push(reportData.data)
      row.push(reportData.hora)
      row.push(reportData.paciente)
      row.push(reportData.operadora)
      row.push(reportData.profissional)
      row.push(reportData.tipoServico)
      row.push(reportData.emEspera)
      row.push(reportData.emAtendimento)
      row.push(reportData.atendido)
      row.push(reportData.tempoEmEspera)
      row.push(reportData.tempoTotal)

      data.push(row)
    })
    let widthColumn = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]

    this.loading = false
    const razaoSocial = this.locaisList.find(item => {
      return item.id === this.localId
    }).razao_social
    const nomeRelatorio = `Relatório em espera - ${razaoSocial}`
    this.excelService.generateExcel(nomeRelatorio, header, data, widthColumn, nomeRelatorio)
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }
}
