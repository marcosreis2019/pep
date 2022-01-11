import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { Store } from '@ngrx/store'
import { BehaviorSubject, Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoActions } from 'src/app/_store/_modules/atendimento/atendimento.action'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'

interface Goals {
  enableToShow: boolean
  suggests: AtendimentoModel.Meta[]
  actives: AtendimentoModel.Meta[]
}

@Component({
  selector: 'block-changeable-plano',
  templateUrl: './block-changeable-plano.component.html',
  styleUrls: ['./block-changeable-plano.component.scss']
})
export class BlockChangeablePlanoComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>()
  public config: PerfectScrollbarConfigInterface = {}

  metas$ = new BehaviorSubject<AtendimentoModel.Meta[]>([])
  loading$: Observable<boolean>
  meta: string
  goals$: Observable<Goals>

  constructor(private store: Store<PEPState>) {}

  ngOnInit() {
    this.goals$ = this.store.select(AtendimentoSelect.planoMetas).pipe(
      map(r => {
        return {
          enableToShow: !!r.length,
          actives: r.filter(
            i => i.estadoAtual === AtendimentoModel.METAS_ESTADO.ATIVA && !i.foiRealizada
          ),
          suggests: r.filter(
            i => i.estadoAtual === AtendimentoModel.METAS_ESTADO.SUGESTAO && !i.foiRealizada
          )
        }
      })
    )

    this.loading$ = this.store.select(AtendimentoSelect.loading)
  }

  close() {
    this.closeEvent.emit()
  }

  add(label: string) {
    if (!label) {
      return
    }
    this.store.dispatch(AtendimentoActions.createMetaPlano({ payload: label }))
    this.meta = undefined
    return
  }

  active(meta: AtendimentoModel.Meta) {
    this.store.dispatch(AtendimentoActions.changeMetaPlano({ payload: meta }))
  }

  complete(meta: AtendimentoModel.Meta) {
    this.store.dispatch(AtendimentoActions.completeMetaPlano({ payload: meta }))
  }

  delete(meta: AtendimentoModel.Meta) {
    this.store.dispatch(AtendimentoActions.deleteMetaPlano({ payload: meta.dataCriacao }))
  }
}
