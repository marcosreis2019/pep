import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-agenda-cancelar',
  templateUrl: './cancelar.component.html',
  styleUrls: ['./cancelar.component.scss']
})
export class CancelarComponent implements OnInit {
  @Input() detalhesAgenda: any

  constructor() {}

  ngOnInit() {}

  formatText(text) {
    if (text) {
      return this.titleCase(text.split('_').join(' '))
    } else {
      return ''
    }
  }
  titleCase(str) {
    const splitStr = str.toLowerCase().split(' ')
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
  }
}
