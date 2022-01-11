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
  selector: 'app-relatorio-agendamento-evento',
  templateUrl: './relatorio-agendamento-evento.component.html',
  styleUrls: ['./relatorio-agendamento-evento.component.scss']
})
export class RelatorioAgendamentoEventoComponent implements OnInit {
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
      update: [false]
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
    if (!this.form.value.dataInicio || !this.form.value.dataFim) {
      this.toastService.error('Preencha todos os campos')
      return
    }
    let split = this.form.value.dataInicio.split('/')
    const dataInicio = `${split[2]}-${split[1]}-${split[0]}`
    split = this.form.value.dataFim.split('/')
    const dataFim = `${split[2]}-${split[1]}-${split[0]}`

    const doUpdate = this.form.value.update
    this.agendamentoService.getRelatorioAgendamentoEvento(dataInicio, dataFim, doUpdate).subscribe(
      data => {
        if (data && data.data && data.data.length) {
          this.loadReport(data.data)
        } else {
          this.toastService.error('Não há dados no período')
        }
      },
      err => {
        console.error(err)
      }
    )
  }

  loadReport(arrayReportData: any[]) {
    this.buildReport(arrayReportData)
  }

  buildReport(arrayReportData) {
    let data = []

    let header = [
      'Agenda Id',
      'Agenda Mpi Paciente',
      'Agenda Mpi Profissional',
      'Agenda Id Profissional',
      'Agenda Data Inicio',
      'Agenda Data Fim',
      'Agenda Local Id',
      'Agenda Sequencial',
      'Evento Sequencial',
      'Evento ProfissionalId',
      'Evento Profissional Mpi',
      'Evento Paciente MPI',
      'Evento Data Inicio',
      'Evento Data Fim',
      'Evento Id'
    ]

    arrayReportData.forEach(reportData => {
      let row = []

      row.push(reportData.id)
      row.push(reportData.mpi_paciente)
      row.push(reportData.mpi_profissional)
      row.push(reportData.profissional_id)
      row.push(reportData.data_inicio)
      row.push(reportData.data_fim)
      row.push(reportData.local_id)
      row.push(reportData.sequencial_atendimento)
      row.push(reportData.res_sequencial)
      row.push(reportData.res_profissional_id)
      row.push(reportData.res_profissional_mpi)
      row.push(reportData.res_paciente_mpi)
      row.push(reportData.res_data_inicio)
      row.push(reportData.res_data_fim)
      row.push(reportData.res_id)

      data.push(row)
    })
    let widthColumn = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]

    this.loading = false
    const nomeRelatorio = `Relatório Agendamento X Evento`
    this.excelService.generateExcel(nomeRelatorio, header, data, widthColumn, nomeRelatorio)
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }
}
