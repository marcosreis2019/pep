import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { map } from 'rxjs/operators'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'
import { ErrorsSelect } from 'src/app/_store/_modules/errors/errors.selectors'
import { Errors } from 'src/app/_store/_modules/errors/errors.models'
import { Observable, of } from 'rxjs'
import { CanalSelect } from 'src/app/_store/_modules/telemedicina/canal.selectors'
import { CanalService } from 'src/app/_store/_modules/telemedicina/canal.service'
import { ClicService } from 'src/app/_store/_modules/telemedicina/clic.service'
import { Canal } from 'src/app/_store/_modules/telemedicina/canal.model'
import { AgendamentoModels } from 'src/app/_store/_modules/agendamento/agendamento.model'
import { AgendamentoSelect } from 'src/app/_store/_modules/agendamento/agendamento.selector'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SubSink } from 'subsink'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { ErrorsActions } from 'src/app/_store/_modules/errors/errors.actions'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { AtendimentoService } from 'src/app/_store/_modules/atendimento/atendimento.service'
import { ToastService } from 'angular-toastify'
import { ExamesSelectors } from 'src/app/_store/_modules/exames/exames.selectors'
import { ExamesModels } from 'src/app/_store/_modules/exames/exames.models'

@Component({
  selector: 'block-timer',
  templateUrl: './block-timer.component.html',
  styleUrls: ['./block-timer.component.scss']
})
export class BlockTimerComponent implements OnInit, OnDestroy {
  @ViewChild('modalContentConfirmFinish', { static: true }) modalContentConfirmFinish: TemplateRef<
    any
  >

  answeredRequiredQuestionsSubjetivo = false
  answeredRequiredQuestionsObjetivo = false
  exames: Array<ExamesModels.Exame> = []
  retorno: AtendimentoModel.Retorno

  private token: string
  atendimento: AtendimentoModel.ParaAPI
  private agendamento: AgendamentoModels.Agendamento
  error = ''
  loading = false

  canal: Observable<Canal>
  canalA: Canal
  telemedicina: string
  mpi: string
  showPlacehold = true

  message = ''

  listTipo = Object.values(AtendimentoModel.TIPO)
  private subs$ = new SubSink()

  constructor(
    private router: Router,
    private store: Store<PEPState>,
    private canalService: CanalService,
    private agServ: AgendamentoService,
    private modal: NgbModal,
    private clicService: ClicService,
    private uServ: UtilsService,
    private aServ: AtendimentoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loading = false
    this.subs$.add(
      this.store.select(CredenciaisSelect.telemedicina).subscribe(
        data => {
          this.telemedicina = data
        },
        err => {
          console.error(err)
        }
      )
    )

    this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(data => {
      this.atendimento = data
    })
    this.store.select(AgendamentoSelect.agendamento).subscribe(data => {
      this.agendamento = { ...data }
    })
    this.store.select(AtendimentoSelect.answeredRequiredQuestionsSubjetivo).subscribe(data => {
      this.answeredRequiredQuestionsSubjetivo = data
    })
    this.store.select(AtendimentoSelect.answeredRequiredQuestionsObjetivo).subscribe(data => {
      this.answeredRequiredQuestionsObjetivo = data
    })
    this.store.select(ExamesSelectors.exames).subscribe(data => {
      this.exames = data
    })
    this.store.select(AtendimentoSelect.retorno).subscribe(data => {
      this.retorno = data
    })
    this.store
      .select(CanalSelect.canal)
      .pipe(
        map(data => {
          if (data) {
            this.token = data.token
          }
        })
      )
      .subscribe()
  }

  finish() {
    this.loading = true
    // se o medico iniciar o atendimento direto pelo agendamento
    if (this.agendamento && this.agendamento.id) {
      this.setStatusAgendamentoRealizado()
    } else {
      this.removeToken()
      this.postFinish()
    }
  }

  postFinish() {
    let payload = Object.assign({}, { ...this.atendimento })
    payload.dataFim = this.uServ.getDateTime()
    payload.titulo = 'Atendimento PEP'
    payload.subjetivo = payload.subjetivo ? payload.subjetivo : ''
    payload.objetivo = payload.objetivo ? payload.objetivo : ''
    payload.respondeuQuestionarioSubjetivo = this.answeredRequiredQuestionsSubjetivo
    payload.respondeuQuestionarioObjetivo = this.answeredRequiredQuestionsObjetivo
    payload.exames = this.exames

    this.aServ.finalizar(payload, this.atendimento.id, this.atendimento.mpi).subscribe(
      _ => {
        this.router.navigate(['finish'])
        this.toastService.success('Atendimento Finalizado com sucesso!')
        this.close()
      },
      error => {
        console.error(error)
        this.message = 'Ocorreu um erro ao finalizar o atendimento.'
        this.toastService.success('Falha ao tentar finalizar o atendimento!')
        this.loading = false
        this.store.dispatch(ErrorsActions.setAtendFinalizar({ payload: Errors.Atendimento.FISISH }))
      }
    )
  }

  removeToken() {
    if (this.token) {
      this.canalService.excluirToken(this.token).subscribe(
        (canal: Canal) => {
          if (canal.status_code === 1000) {
            console.info('Token Excluido')
          }
        },
        err => {
          console.error(`Erro ao finalizar atendimento: ${err}`)
        }
      )
    }
  }

  openModalConfirmFinish() {
    const action = 'Dropped or resized'
    this.atendimento.status = ' '
    this.modal.open(this.modalContentConfirmFinish, { size: 'lg' })
  }

  setStatusAgendamentoRealizado() {
    this.subs$.add(
      this.agServ.setStatusRealizado(this.agendamento.id).subscribe(
        res => {
          this.removeToken()
          this.postFinish()
        },
        err => {
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  print() {
    this.router.navigate([]).then(result => window.open('relatorio-geral', '_blank'))
  }

  resetToast() {
    this.error = ''
  }

  close() {
    this.modal.dismissAll()
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
}
