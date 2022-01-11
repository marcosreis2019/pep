import { Component, OnInit, Input } from '@angular/core'


@Component({
  selector: 'block-changeable-default',
  templateUrl: './block-changeable-default.component.html',
  styleUrls: ['./block-changeable-default.component.scss']
})
export class BlockChangeableDefaultComponent implements OnInit {
  @Input() mpi: string
  current: string
  box    : any

  constructor() {
    this.current = 'conduta'
  }

  ngOnInit() {
  }

  changeSwitch(value: string) {
    this.current = value
  }
}
