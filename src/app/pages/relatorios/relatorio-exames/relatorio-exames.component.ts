import { Component, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ExcelService } from 'src/app/_store/services/excel/excel.service'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { SubSink } from 'subsink'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ToastService } from 'angular-toastify'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { DocumentoService } from 'src/app/_store/_modules/documento/documento.service'

export interface Filters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-exames',
  templateUrl: './relatorio-exames.component.html',
  styleUrls: ['./relatorio-exames.component.scss']
})
export class RelatorioExamesComponent implements OnInit {
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  @Output() apply: EventEmitter<Filters>
  form: FormGroup

  private subs$ = new SubSink()

  loading = false
  error: string = ''
  localId: number = 0
  locaisList: any[] = []
  tiposId: number[] = []

  tiposList: any[] = []
  selectedTipos = []
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'descricao',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Desselecionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }

  constructor(
    private formB: FormBuilder,
    private documentoService: DocumentoService,
    private localService: LocalService,
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
      local: [undefined],
      tipos: [undefined]
    })

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(profissional => {
        this.locaisList = profissional.locais
      })
    )
    this.documentoService.getTipos().subscribe(
      data => {
        this.tiposList = data.data
          .filter(item => {
            return item.modelo_descricao === 'Exames'
          })
          .map(item => {
            return {
              id: item.id,
              descricao: item.descricao
            }
          })
      },
      err => {
        console.error(err)
      }
    )
  }

  toggleRelatorio() {
    this.modalService.open(this.relatorio, {
      centered: true,
      size: 'lg'
    })
  }

  async generateExcel() {
    if (
      this.form.value.dataInicio === '' ||
      this.form.value.dataFim === '' ||
      this.localId === 0 ||
      !this.selectedTipos.length
    ) {
      this.toastService.error('Preencha todos os campos')
      return
    }
    this.loading = true
    let split = this.form.value.dataInicio.split('/')
    const dataInicio = `${split[2]}-${split[1]}-${split[0]}`
    split = this.form.value.dataFim.split('/')
    const dataFim = `${split[2]}-${split[1]}-${split[0]}`
    const tiposId = this.selectedTipos.map(item => {
      return item.id
    })
    this.documentoService.getRelatorioByTipo(tiposId, dataInicio, dataFim, this.localId).subscribe(
      data => {
        if (!data.data.length) {
          this.toastService.error('Não há dados no período')
          this.loading = false
          return
        }
        this.loadReport(data.data)
      },
      err => {
        this.loading = false
        this.toastService.error(err.error.message)
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
      'Nº Atendimento',
      'Data',
      'Hora',
      'Local Atendimento',
      'Tipo Serviço',
      'Profissional de Saúde',
      'MPI Paciente',
      'Nome do Paciente',
      'Nome Convênio',
      'Tipo de Exame',
      'Quantidade de exames'
    ]

    arrayReportData.forEach(reportData => {
      let row = []
      const formattedDate = this.utilsService.getFormattedDate(reportData.data)
      row.push(reportData.atendimento_sequencial)
      row.push(formattedDate)
      row.push(reportData.hora)
      row.push(reportData.local_atendimento)
      row.push(reportData.tipo_servico)
      row.push(reportData.profissional_nome)
      row.push(reportData.beneficiario_mpi)
      row.push(reportData.beneficiario_nome)
      row.push(reportData.operadora)
      row.push(reportData.tipo_descricao)
      row.push(reportData.quantidade)

      data.push(row)
    })
    let widthColumn = [20, 20, 20, 20, 20, 20]

    const razaoSocial = this.locaisList.find(item => {
      return item.id === this.localId
    }).razao_social
    const nomeRelatorio = `Relatório dias livres para agendamento - ${razaoSocial}`
    this.excelService.generateExcel(nomeRelatorio, header, data, widthColumn, nomeRelatorio)
    this.loading = false
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }
}
