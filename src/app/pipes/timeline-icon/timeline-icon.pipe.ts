import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'timelineIcon'
})
export class TimelineIconPipe implements PipeTransform {

  transform(value: any): string {
    switch (value) {
      case 'VISITA':
        return 'assets/icons/visita.svg'
      case 'CONSULTA':
        return 'assets/icons/consulta2.svg'
      case 'TELEMONITORAMENTO':
        return 'assets/icons/tele.svg'
      default:
        return 'assets/icons/eventFake.svg'
    }
  }

}
