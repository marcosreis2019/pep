import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { SubSink } from 'subsink'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'

@Component({
  selector: 'historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss']
})
export class HistoricoComponent implements OnInit, OnDestroy {
  constructor(public utilsService: UtilsService, private agendamentoService: AgendamentoService) {}
  @Input() pacienteSelecionadoMpi: string

  loading = false

  listAgendamentos = []
  dateStart: any = this.subs1Ano(new Date())
  dateEnd: any = this.utilsService.getToday()

  private subs$ = new SubSink()

  ngOnInit() {
    this.dateStart = this.subs1Ano(new Date())
    this.dateEnd = this.utilsService.getToday()
    this.loadAgendamentos()
  }

  loadAgendamentos() {
    this.loading = true
    this.listAgendamentos = []
    this.subs$.add(
      this.agendamentoService
        .getRelatorioAgendamentosPaciente(
          this.utilsService.getFormattedDate(this.dateStart, 'YYYY-MM-DD'),
          this.utilsService.getFormattedDate(this.dateEnd, 'YYYY-MM-DD'),
          this.pacienteSelecionadoMpi
        )
        .subscribe(
          (res: any) => {
            this.listAgendamentos = res.data
              .map(item => {
                item.data_inicio = item.data_inicio
                  .toString()
                  .replace('T', ' ')
                  .replace('Z', '')
                item.data_fim = item.data_fim
                  .toString()
                  .replace('T', ' ')
                  .replace('Z', '')
                return item
              })
              .sort((a, b) => {
                return this.utilsService.diffDays(a.data_inicio, b.data_inicio) > 0 ? -1 : 1
              })
            this.loading = false
          },
          err => {
            console.error('err =', err)
            this.loading = false
            this.listAgendamentos = []
          }
        )
    )
  }

  subs1Ano(date) {
    return this.utilsService.subtractMonths(date, 3)
  }

  formatDate(date) {
    return this.utilsService.getFormattedDate(date, 'DD-MM-YYYY')
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
}
