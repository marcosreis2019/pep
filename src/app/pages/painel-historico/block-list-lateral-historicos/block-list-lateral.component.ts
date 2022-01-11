import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core'
import { SubSink } from 'subsink'

@Component({
  selector: 'block-list-lateral',
  templateUrl: './block-list-lateral.component.html',
  styleUrls: ['./block-list-lateral.component.scss']
})
export class BlockListLateralComponent implements OnInit {
  @Output() eventListProntuario = new EventEmitter<any[]>()
  @Input() list: any[]

  value: string

  listErrorMsg: string
  filterActived: string

  private mpi: string

  subs$ = new SubSink()

  constructor() {
    this.value = ''
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  selectHistorico(historico) {
    //historico.selected = !historico.selected
    this.eventListProntuario.emit(this.prontuariosSelecionados())
  }

  limpar() {
    this.list.forEach(historico => {
      historico.selected = false
    })
    this.eventListProntuario.emit(this.prontuariosSelecionados())
  }

  selecionarTodos() {
    this.list.forEach(historico => {
      historico.selected = true
    })
    this.eventListProntuario.emit(this.prontuariosSelecionados())
  }

  prontuariosSelecionados() {
    return this.list.filter(historico => historico.selected == true)
  }
}
