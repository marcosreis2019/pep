import { Component, Input, OnInit, SkipSelf } from '@angular/core'
import { ControlContainer } from '@angular/forms'
@Component({
  selector: 'label-float',
  templateUrl: './label-float.component.html',
  styleUrls: ['./label-float.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (container: ControlContainer) => container,
      deps: [[new SkipSelf(), ControlContainer]]
    }
  ]
})
export class LabelFloatComponent implements OnInit {
  @Input() formControlName: string
  @Input() label: any
  @Input() type: any = 'text'
  @Input() required: any = false
  @Input() max: any

  constructor() {}

  ngOnInit() {}
}
