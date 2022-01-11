import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions as Actions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { AtendimentoSelect as Select } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { ParserService } from 'src/app/_store/_modules/atendimento/atendimento.parser.service'
import { map } from 'rxjs/operators'

@Component({
  selector: 'block-changeable-objetivo',
  templateUrl: './block-changeable-objetivo.component.html',
  styleUrls: ['./block-changeable-objetivo.component.scss']
})
export class BlockChangeableObjetivoComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>()
  $inputs: Observable<QuestionariosModels.DynamicFormInput[]>
  $loading: Observable<boolean>
  $error: Observable<string>
  $completed: Observable<boolean>

  mpi: string
  codigoOperadora: number
  
  soapItem: string
  constructor(private store: Store<PEPState>, private pServ: ParserService) {
    this.soapItem = 'objetivo'
  }

  ngOnInit() {
    this.$inputs = this.store
      .select(Select.objetivoPerguntas)
      .pipe(map(l => this.pServ.parseToDynamicForm(l)))
    this.$loading = this.store.select(Select.loading)
    this.$error = this.store.select(Select.objetivoPostFail)
    this.$completed = this.store.select(Select.objetivoComplete)
    this.store.select(Select.codOperadora).subscribe(data => {
      this.codigoOperadora = data
    })
    this.store.select(Select.mpiAndCodOpt).subscribe(data => {
      if (data.mpi) {
        this.mpi = data.mpi
      }
    })
  }

  toExport(data: any) {
    data.payload.codigoOperadora = this.codigoOperadora
    data.payload.mpi = this.mpi
    this.store.dispatch(Actions.postAnswerObjetivo(data))
  }

  close() {
    this.closeEvent.emit()
  }
}
