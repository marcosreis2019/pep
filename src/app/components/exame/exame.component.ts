import {Component, OnInit, Input} from '@angular/core'

@Component({
  selector: 'exame',
  templateUrl: './exame.component.html',
  styleUrls: ['./exame.component.scss']
})
export class ExameComponent implements OnInit {
  @Input() data
  constructor() {}

  ngOnInit() {}
}
