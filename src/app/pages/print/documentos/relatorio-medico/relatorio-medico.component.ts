import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'relatorio-medico',
  templateUrl: './relatorio-medico.component.html',
  styleUrls: ['./relatorio-medico.component.scss']
})
export class RelatorioMedicoComponent implements OnInit {
  @Input() doc: any
  constructor() {}

  ngOnInit() {}
}
