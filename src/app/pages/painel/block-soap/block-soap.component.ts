import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy
} from '@angular/core'

import { Observable } from 'rxjs'

import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'

import { SubSink } from 'subsink'

export interface SoapItem {
  letter: string
  color: string
  type: string
  limit: number
  action?: any
}

@Component({
  selector: 'block-soap',
  templateUrl: './block-soap.component.html',
  styleUrls: ['./block-soap.component.scss']
})
export class BlockSoapComponent implements OnInit, OnDestroy {
  @Output() event = new EventEmitter<any>()
  @Input() item: SoapItem
  @Input() collapse: boolean

  value: string
  hasFocus: boolean

  subs$ = new SubSink()

  constructor(private store: Store<PEPState>) {
    this.value = ''
  }

  ngOnInit() {
    this.subs$.add(
      this.loadDescription(this.item.type).subscribe(
        v => (this.value = v || '')
      )
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  loadDescription(type: string): Observable<string> {
    const map = {
      subjetivo: this.store.select(AtendimentoSelect.subjetivoDesc),
      objetivo: this.store.select(AtendimentoSelect.objetivoDesc),
      avaliacao: this.store.select(AtendimentoSelect.avaliacaoDesc)
    }

    return map[type]
  }

  showCounter(state: boolean) {
    this.hasFocus = state
    if (state) {
      this.emitFocus()
    }
  }

  toggleFocus() {
    this.hasFocus = !this.hasFocus
    this.emitFocus()
  }

  emitFocus() {
    this.event.emit({ action: 'focus', type: this.item.type })
  }

  send(v: string) {
    if (this.item.action) {
      this.store.dispatch(this.item.action({ payload: v }))
    }
  }
}
