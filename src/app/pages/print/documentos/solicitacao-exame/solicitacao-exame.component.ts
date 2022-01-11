import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'solicitacao-exame',
  templateUrl: './solicitacao-exame.component.html',
  styleUrls: ['./solicitacao-exame.component.scss']
})
export class SolicitacaoExameComponent implements OnInit {
  @Input() doc: any
  constructor() {}

  ngOnInit() {}
}
