import { AfterContentInit, Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions as Actions, AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { ParserService } from 'src/app/_store/_modules/atendimento/atendimento.parser.service'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { AtendimentoSelect as Select } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { BeneficiarioActions } from 'src/app/_store/_modules/beneficiario/beneficiario.action'

@Component({
  selector: 'block-changeable-subjetivo',
  templateUrl: './block-changeable-subjetivo.component.html',
  styleUrls: ['./block-changeable-subjetivo.component.scss']
})
export class BlockChangeableSubjetivoComponent implements OnInit, AfterContentInit {
  @Output() closeEvent: EventEmitter<any>
  $inputs   : Observable<QuestionariosModels.DynamicFormInput[]> = undefined
  $loading  : Observable<boolean>
  $error    : Observable<string>
  completed: boolean
  soapItem  : string
  
  mpi: string
  codigoOperadora: number

  constructor(private store: Store<PEPState>, private pServ: ParserService) {
    this.closeEvent = new EventEmitter()
    this.soapItem = 'subjetivo'
  }

  ngOnInit() {
    this.$loading   = this.store.select(Select.loading)
    this.store.select(Select.subjetivoComplete).subscribe(data => {
      this.completed = data
    })
    this.$error     = this.store.select(Select.subjetivoPostFail)
    this.$inputs    = this.store
      .select(Select.subjetivoPerguntas)
      .pipe(map(l => this.pServ.parseToDynamicForm(l)))
    
      this.store.select(Select.codOperadora).subscribe(data => {
        this.codigoOperadora = data
      })
      this.store.select(Select.mpiAndCodOpt).subscribe(data => {
        if (data.mpi) {
          this.mpi = data.mpi
        }
      })
  }

  ngAfterContentInit() {}

  saveAnswers(data: any) {
    data.payload.codigoOperadora = this.codigoOperadora
    data.payload.mpi = this.mpi
    this.store.dispatch(Actions.postAnswerSubjetivo(data))
  }

  close() {
    this.closeEvent.emit()
  }
}
