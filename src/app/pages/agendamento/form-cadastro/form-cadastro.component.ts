import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { AgendamentoModels } from 'src/app/_store/_modules/agendamento/agendamento.model'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { DatePipe } from '@angular/common'
import { Subject, Observable, merge, of } from 'rxjs'
import { debounceTime, filter, mergeMap, tap, delay, finalize } from 'rxjs/operators'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { OperadoraModels } from 'src/app/_store/_modules/operadora/operadora.model'

@Component({
  selector: 'app-agenda-form-cadastro',
  templateUrl: './form-cadastro.component.html',
  styleUrls: ['./form-cadastro.component.scss']
})
export class FormCadastroComponent implements OnInit {
  @Input() agendamento: any
  @Input() locaisComboList: Array<LocalAtendimentoModels.LocalAtendimentoCombo>
  @Input() listTipoServico: Array<TipoServicoModels.TipoServico>
  @Input() listClassificacao: Array<ClassificacaoModels.Classificacao>
  @Input() listTipoAgendamento: Array<AgendamentoModels.TipoAgendamento>
  @Input() localSelected
  listStatus = Object.values(AgendamentoModels.STATUS).sort()
  @ViewChild('instance', { static: true }) instance: NgbTypeahead

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  dataNasc = ''
  matricula = ''

  tipoServicoSelected: any

  loadingSearch = false

  operadoras: Array<OperadoraModels.Operadora> = []

  constructor(
    private datePipe: DatePipe,
    private beneficiarioServ: BeneficiarioService,
    private modalService: NgbModal
  ) {}

  @ViewChild('modalCadastroPacienteEvent', { static: true })
  modalContentCadastroPaciente: TemplateRef<any>

  ngOnInit() {
    const start =
      this.agendamento.dataInicio.getHours() +
      ':' +
      (this.agendamento.dataInicio.getMinutes() == 0
        ? '00'
        : this.agendamento.dataInicio.getMinutes())
    this.agendamento.start = start.length == 5 ? start : `0${start}`
    const end =
      this.agendamento.dataFim.getHours() +
      ':' +
      (this.agendamento.dataFim.getMinutes() == 0 ? '00' : this.agendamento.dataFim.getMinutes())
    this.agendamento.end = end.length === 5 ? end : `0${end}`

    this.operadoras = this.localSelected.operadoras
  }

  tConvert(time: any): string {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
    if (time.length > 1) {
      time = time.slice(1)
      time[5] = +time[0] < 12 ? 'AM' : 'PM'
      time[0] = +time[0] % 12 || 12
    }
    return time.join('')
  }

  isBlockedType() {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === this.agendamento.agendamento_tipo_id
      })
      return tipo && tipo.bloqueio === 1
    }
    return false
  }

  // Autocomplete Busca Paciente [Codigos - Abaixo]

  search = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$
    return merge(text, focus, click).pipe(
      mergeMap(term => this.autoComplete(term, this.operadoras))
    )
  }

  private autoComplete(name: string, operadoras: Array<OperadoraModels.Operadora>) {
    if (!name) {
      return of([])
    }
    let paramOperadoras = operadoras
      .map(item => {
        return item.codigo
      })
      .join(',')

    return this.beneficiarioServ.getByName(name, paramOperadoras).pipe(
      tap(() => (this.loadingSearch = true)),
      delay(500),
      finalize(() => (this.loadingSearch = false))
    )
  }

  setTipoServico = () => {
    this.agendamento.tipo_servico = this.tipoServicoSelected.id
    this.agendamento.end = this.addMin(
      this.agendamento.start,
      this.tipoServicoSelected.tempo_atendimento
    )
  }

  formatter = (paciente: any) => {
    return paciente ? paciente.nomeCompleto : ''
  }

  formatterToShow(paciente: any): string {
    return paciente
      ? `${paciente.nomeCompleto}
    ${paciente.matricula}`
      : ''
  }

  addMin(timeParam, minParam): string {
    const time = timeParam.split(':')
    const hour = Number(time[0].trim())
    const min = Number(time[1].trim())
    const totalMin = hour * 60 + min + Number(minParam)
    return this.formatTime(totalMin)
  }

  formatTime(timeParam: number): string {
    let hours = Math.floor((timeParam * 60) / 3600)
    let horusTemp = '' + hours
    const minutes: number = Math.floor(timeParam % 60)
    if (hours < 10) {
      horusTemp = '0' + hours
    }
    let result = horusTemp + ':' + minutes
    if (minutes < 10) {
      result += '0'
    }
    return result
  }

  selectPaciente(ev: any) {
    this.agendamento.paciente = ev.item
    this.agendamento.email = ev.item.email
    this.agendamento.telefone = ev.item.celular
    this.dataNasc = ev.item.dataNascimento
      ? this.datePipe.transform(ev.item.dataNascimento, 'dd/MM/yyyy')
      : ''
    this.matricula = ev.item.matricula
    return this.agendamento.paciente.nome
  }

  openModalCadastroPaciente() {
    this.modalService.open(this.modalContentCadastroPaciente, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    })
  }

  close() {
    this.modalService.dismissAll()
  }
}
