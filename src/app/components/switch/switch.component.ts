import { Component, Input } from '@angular/core'

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input() on: boolean
  @Input() className: string
}
