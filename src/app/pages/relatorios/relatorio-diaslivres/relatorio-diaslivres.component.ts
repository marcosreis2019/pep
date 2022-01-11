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

export interface Filters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-diaslivres',
  templateUrl: './relatorio-diaslivres.component.html',
  styleUrls: ['./relatorio-diaslivres.component.scss']
})
export class RelatorioDiasLivresComponent implements OnInit {
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
    this.loading = true
    let split = this.form.value.dataInicio.split('/')
    const dataInicio = `${split[2]}${split[1]}${split[0]}`
    split = this.form.value.dataFim.split('/')
    const dataFim = `${split[2]}${split[1]}${split[0]}`
    this.localService.getRelatorioDiasLivres(this.localId, dataInicio, dataFim).subscribe(
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
    let reportData: any[] = []

    arrayReportData.forEach(item => {
      let keys = Object.keys(item)
      let obj = {
        data: '',
        dia0: 0,
        dia1: 0,
        dia2: 0,
        dia3: 0,
        dia4: 0
      }
      obj['data'] = this.utilsService.getFormattedDate(keys[0])
      for (let i = 0; i < keys.length; i++) {
        obj[`dia${i}`] = item[keys[i]]
      }
      reportData.push(obj)
    })
    this.buildReport(reportData)
  }

  buildReport(arrayReportData) {
    let data = []

    let header = ['Data agenda', 'Dia 0', 'Dia 1', 'Dia 2', 'Dia 3', 'Dia 4']

    arrayReportData.forEach(reportData => {
      let row = []

      row.push(reportData.data)
      row.push(reportData.dia0)
      row.push(reportData.dia1)
      row.push(reportData.dia2)
      row.push(reportData.dia3)
      row.push(reportData.dia4)

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
