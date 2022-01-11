import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'referencia-contra',
  templateUrl: './referencia-contra.component.html',
  styleUrls: ['./referencia-contra.component.scss']
})
export class ReferenciaContraComponent implements OnInit {

  @Input() data: any
  constructor() { }

  ngOnInit() {
  }

}
