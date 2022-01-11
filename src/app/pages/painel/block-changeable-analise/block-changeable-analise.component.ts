import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { AtendimentoSelect as Select } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'

@Component({
  selector: 'block-changeable-analise',
  templateUrl: './block-changeable-analise.component.html',
  styleUrls: ['./block-changeable-analise.component.scss']
})
export class BlockChangeableAnaliseComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>()
  $orientacoes: Observable<QuestionariosModels.AtividadesIndividuais>
  $loading: Observable<boolean>

  public config: PerfectScrollbarConfigInterface = {}

  constructor(private store: Store<PEPState>) {}

  ngOnInit() {
    this.$orientacoes = this.store
      .select(Select.avaliacaoOrien)
      .pipe(map(list => list.map(i => i.dsAtividadeIndividual)))
    this.$loading = this.store.select(Select.loading)
  }

  close() {
    this.closeEvent.emit()
  }
}
