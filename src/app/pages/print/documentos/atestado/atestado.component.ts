import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'atestado',
  templateUrl: './atestado.component.html',
  styleUrls: ['./atestado.component.scss']
})
export class AtestadoComponent implements OnInit {
  @Input() doc: any
  constructor() {}

  ngOnInit() {}
}
