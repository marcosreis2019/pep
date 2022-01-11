import { Component, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ExcelService } from 'src/app/_store/services/excel/excel.service'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import moment from 'moment-timezone'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/_store/_modules/auth/auth.service'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { SubSink } from 'subsink'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ToastService } from 'angular-toastify'

export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-atendimento',
  templateUrl: './relatorio-atendimento.component.html',
  styleUrls: ['./relatorio-atendimento.component.scss']
})
export class RelatorioAtendimentoComponent implements OnInit {
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  @Output() apply: EventEmitter<TimelineFilters>
  form: FormGroup

  private subs$ = new SubSink()

  loading = false
  error: string = ''
  selectedItems = []
  dropdownSettings = {}

  msgDataInvalida = ''

  locaisList: any[] = []
  locaisListUserLogado: any[] = []

  constructor(
    private route: Router,
    private aServ: AuthService,
    private bServ: BeneficiarioService,
    private formB: FormBuilder,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private eventServ: EventosService,
    private store: Store<PEPState>,
    private toastService: ToastService
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
        this.locaisListUserLogado = profissional.locais
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
    let dataInicio = moment(
      value.dataInicio.substring(6, 10) +
        '-' +
        value.dataInicio.substring(3, 5) +
        '-' +
        value.dataInicio.substring(0, 2)
    )
    let dataFim = moment(
      value.dataFim.substring(6, 10) +
        '-' +
        value.dataFim.substring(3, 5) +
        '-' +
        value.dataFim.substring(0, 2)
    )
    const startAt =
      value.dataInicio.substring(6, 10) +
      '-' +
      value.dataInicio.substring(3, 5) +
      '-' +
      value.dataInicio.substring(0, 2)
    const end =
      value.dataFim.substring(6, 10) +
      '-' +
      value.dataFim.substring(3, 5) +
      '-' +
      value.dataFim.substring(0, 2)

    let dataValida = true
    let dias = moment.duration(dataFim.diff(dataInicio)).asDays()
    if (dias > 30) {
      dataValida = false
      this.msgDataInvalida = 'O intervalo de data não pode ser maior que 30 dias!'
    } else if (dias < 0) {
      dataValida = false
      this.msgDataInvalida = 'Data final não pode ser menor que a data inicial!'
    }

    if (dataValida) {
      this.msgDataInvalida = ''
      this.loading = true

      let locais = []

      if (this.selectedItems.length > 0) {
        for (let i = 0; i < this.selectedItems.length; i++) {
          locais.push(this.selectedItems[i].id)
        }
      } else {
        for (let i = 0; i < this.locaisList.length; i++) {
          locais.push(this.locaisList[i].id)
        }
      }

      const resVentosObj = await this.eventServ.getRelatorioAtendimento(startAt, end, locais)
      if (resVentosObj && resVentosObj.message) {
        this.toastService.error(resVentosObj.message)
      } else {
        let mpis = []
        for (let i = 0; i < resVentosObj.data.length; i++) {
          mpis.push(resVentosObj.data[i].pessoa)
        }
        const paciente = await this.eventServ.getPacientesPorMPI(mpis)
        let data = []

        for (let i = 0; i < resVentosObj.data.length; i++) {
          let evento = resVentosObj.data[i]
          let ev = []
          ev.push(evento.sequencial)

          let setVazioPac = true

          paciente.data.forEach(pacienteElem => {
            if (pacienteElem.mpi == evento.pessoa && setVazioPac) {
              this.setPacienteEv(pacienteElem, ev, evento)
              setVazioPac = false
            }
          })

          if (setVazioPac) {
            this.setVazioPaciente(ev)
          }

          ev.push(evento.profissional.ufConselho)
          ev.push(evento.profissional.numeroConselho)
          ev.push(evento.profissional.conselhoProfissional)
          ev.push(evento.profissional.pessoa.nome_completo)
          let dataInicio = new Date(evento.dataInicio)
          let dataFim = new Date(evento.dataFim)
          ev.push(
            dataInicio.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          )
          ev.push(
            dataFim.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          )
          ev.push(evento.status)
          data.push(ev)
        }
        let title = ''
        let widthColumn = [
          12,
          20,
          20,
          20,
          40,
          20,
          40,
          15,
          10,
          15,
          15,
          15,
          15,
          30,
          30,
          40,
          20,
          20,
          35
        ]
        let header = [
          'Sequencial',
          'Operadora',
          'Tipo Serviço',
          'Classificação',
          'Paciente',
          'Matrícula',
          'MPI',
          'Sexo',
          'UF',
          'Data Nasc.',
          'Telefone',
          'Celular',
          'UF Conselho Profissional de Saúde',
          'Número Conselho Profissional de Saúde',
          'Conselho Profissional de Saúde',
          'Profissional',
          'Início Atendimento',
          'Fim Atendimento',
          'Status Atendimento'
        ]
        this.excelService.generateExcel(title, header, data, widthColumn)
      }
      this.loading = false
      this.modalService.dismissAll()
    }
  }

  setPacienteEv(paciente, ev, evento) {
    ev.push(paciente.descricaoOperadora)
    if (evento.tipo_servico && evento.tipo_servico.descricao) {
      ev.push(evento.tipo_servico.descricao)
    } else {
      ev.push('Tele Especialista')
    }

    if (evento.classificacao && evento.classificacao.descricao) {
      ev.push(evento.classificacao.descricao)
    } else {
      ev.push('Acesso Avançado')
    }
    ev.push(paciente.nomeCompleto)
    ev.push(paciente.matricula)
    ev.push(paciente.mpi)
    ev.push(paciente.genero)
    ev.push(paciente.uf)
    let datanasc = new Date(paciente.dataNascimento)
    ev.push(
      datanasc.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    )
    ev.push(paciente.telefone)
    ev.push(paciente.celular)
  }

  setVazioPaciente(ev) {
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
    ev.push('')
  }

  resetToast() {
    this.error = ''
  }

  showError(msg: string = '') {
    this.error = msg
  }
}
