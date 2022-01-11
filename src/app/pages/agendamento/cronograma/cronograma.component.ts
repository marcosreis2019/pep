import { Component, OnInit, Input } from '@angular/core'
import { CronogramaService } from 'src/app/_store/_modules/cronograma/cronograma.service'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { CronogramaModels } from 'src/app/_store/_modules/cronograma/cronograma.model'

@Component({
  selector: 'cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.scss']
})
export class CronogramaComponent implements OnInit {
  constructor(private cronogramaService: CronogramaService, private utils: UtilsService) {}
  @Input() profissionalId: number
  cronograma = []
  vigencia = []
  today = this.utils.getToday()
  selectedVigencia = null

  ngOnInit() {
    this.cronogramaService.getByProfissionalId(this.profissionalId).subscribe(
      data => {
        let currentVigencia = data.data.filter(item => {
          const diffStart = this.utils.diffDays(item.vigencia_inicio, this.today)
          const diffEnd = this.utils.diffDays(item.vigencia_fim, this.today)
          return diffStart <= 0 && diffEnd >= 0
        })
        let vigenciaList: Array<CronogramaModels.Vigencia> = []
        let cont = 0
        currentVigencia.forEach(item => {
          let vigencia: CronogramaModels.Vigencia = {
            id: ++cont,
            dataInicio: item.vigencia_inicio,
            dataFim: item.vigencia_fim,
            items: [],
            cronograma_id: item.id,
            profissional: item.profissional_id,
            local_id: item.local_id,
            local_razao_social: item.local_razao_social || `Id do local: ${item.local_id}`
          }
          let cronograma: CronogramaModels.Cronograma = {
            id: item.id,
            profissional_id: item.profissional_id,
            dia_da_semana: item.dia_da_semana,
            hora_inicio: item.hora_inicio,
            hora_fim: item.hora_fim,
            local_id: item.local_id,
            local_razao_social: item.local_razao_social,
            vigencia_inicio: item.vigencia_inicio,
            vigencia_fim: item.vigencia_fim
          }
          let index = vigenciaList.findIndex(listItem => {
            return (
              listItem.dataInicio === vigencia.dataInicio &&
              listItem.dataFim === vigencia.dataFim &&
              listItem.local_id === vigencia.local_id
            )
          })
          if (index === -1) {
            vigencia.items.push(cronograma)
            vigenciaList.push(vigencia)
          } else {
            vigenciaList[index].items.push(cronograma)
          }
          this.vigencia = vigenciaList
        })
      },
      err => {
        console.error(err)
      }
    )
  }

  selectVigencia(vigencia) {
    this.selectedVigencia = vigencia
  }

  clear() {
    this.selectedVigencia = null
  }

  sortByDiaDaSemana(items) {
    return items.sort((a, b) => {
      return a.dia_da_semana < b.dia_da_semana ? -1 : 1
    })
  }
  formatWeekDay(day) {
    return this.utils.formatWeekDay(day)
  }
  formatDate(date) {
    return this.utils.getFormattedDate(date)
  }
}
