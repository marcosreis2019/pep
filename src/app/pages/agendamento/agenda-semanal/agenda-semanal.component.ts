import { Component, OnInit, Input } from '@angular/core'
import { CalendarWeekViewComponent } from 'angular-calendar'
import { UtilsService } from 'src/app/providers/utils/utils.service'
@Component({
  selector: 'agenda-semanal',
  templateUrl: 'agenda-semanal.component.html',
  styleUrls: ['agenda-semanal.component.scss']
})
export class CustomWeekView extends CalendarWeekViewComponent {
  @Input() cronograma: Array<any>
  @Input() public isAvailable: Function
  @Input() isRetroativo: boolean = false
  @Input() utilsService
  @Input() localSelected
  dayStartHour: number = 6 // dia começa as 6 da manha
  dayEndHour: number = 23 // dia termina as 11 da noite
  hourSegmentHeight: number = 50 // tamanho em px dos segmentos
  turno = 'dia'
  cont = 0
  hourDuration: number = 30
  segmentDuration: number = 30 // duracao do segmento
  hourSegments: number = 2 // Qtd de segmentos por

  ngOnInit() {
    if (this.localSelected.duracao_consulta) {
      this.hourDuration = this.localSelected.duracao_consulta;
      this.segmentDuration = this.localSelected.duracao_consulta;
      this.hourSegments = 60/this.localSelected.duracao_consulta
      this.refreshAll()
    }
  }

  showHour(segment) {
    return (
      segment.date.getHours() +
      ':' +
      (segment.date.getMinutes() == 0 ? '00' : segment.date.getMinutes())
    )
  }

  getClass(segment) {
    return this.isAvailable(segment) ? '' : 'disabled'
  }

  setTurnoDia() {
    this.dayStartHour = 6 // dia começa as 6 da manha
    this.dayEndHour = 23
    this.turno = 'dia'
    this.refreshAll()
  }

  setTurnoNoite() {
    this.dayStartHour = 0 // dia começa as 6 da manha
    this.dayEndHour = 6
    this.turno = 'noite'
    this.refreshAll()
  }

  isEnabled() {
    this.cont++
    return this.cont % 2 === 0
  }
}
