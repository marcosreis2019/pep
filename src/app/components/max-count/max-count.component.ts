import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
@Component({
  selector: 'max-count',
  templateUrl: './max-count.component.html',
  styleUrls: ['./max-count.component.scss']
})
export class MaxCountComponent {
  constructor(private router: Router) {}
  @Input() value: any
  @Input() max: any
}
