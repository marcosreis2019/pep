import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { DatePipe } from '@angular/common'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { Router } from '@angular/router'
import { SubSink } from 'subsink'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { ProfissionalModels } from 'src/app/_store/_modules/profissional/profissional.model'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { CronogramaService } from 'src/app/_store/_modules/cronograma/cronograma.service'
import { ToastService } from 'angular-toastify'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'

@Component({
  selector: 'agendamento-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrls: ['./transferencia.component.scss']
})
export class TransferenciaComponent implements OnInit {
  @Input() profissionalDestino: ProfissionalModels.ProfissionalCombo
  @Input() local: LocalAtendimentoModels.LocalAtendimentoCombo
  @Output() reload: EventEmitter<boolean>
  private subs$ = new SubSink()
  profissionalList: Array<ProfissionalModels.BasicProfissionalCombo> = []
  profissionalOrigem: number
  dataInicio
  dataFim
  horaInicio
  horaFim

  constructor(
    private agendamentoService: AgendamentoService,
    private profissionalService: ProfissionalService,
    public utilsService: UtilsService,
    private toastService: ToastService
  ) {
    this.reload = new EventEmitter()
  }

  ngOnInit() {
    this.loadProfissionais()
  }

  loadProfissionais() {
    const agendadorProfissionalId = this.profissionalDestino.id
    const roles = [UsuarioModels.Role.MEDICO]
    this.subs$.add(
      this.profissionalService
        .getProfissionalForAgendador(agendadorProfissionalId, '', this.local.id, roles, 200)
        .subscribe(
          data => {
            this.profissionalList = data.data.map(item => {
              const profissional: ProfissionalModels.BasicProfissionalCombo = {
                id: item.id,
                nome: item.pessoa && item.pessoa.nome_completo ? item.pessoa.nome_completo : ''
              }
              return profissional
            })
          },
          err => {
            console.error(err)
          }
        )
    )
  }

  transferir() {
    if (
      !this.dataInicio ||
      !this.dataFim ||
      !this.horaInicio ||
      !this.horaFim ||
      !this.profissionalDestino
    ) {
      this.toastService.error('Preencha todos os campos')
      return
    }
    const startDate = `${this.utilsService.dateBrToDb(this.dataInicio)} ${this.horaInicio}`
    const endDate = `${this.utilsService.dateBrToDb(this.dataFim)} ${this.horaFim}`
    this.agendamentoService
      .transferir(
        this.profissionalOrigem,
        this.profissionalDestino.id,
        this.local.id,
        startDate,
        endDate
      )
      .subscribe(
        data => {
          this.toastService.success(`Foram transferidos ${data} agendamentos`)
          this.reload.emit(true)
        },
        err => {
          this.toastService.error(err.error.error)
        }
      )
  }
}
