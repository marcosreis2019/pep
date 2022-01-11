import { Component, OnInit, Input } from '@angular/core'
import { AgendamentoModels } from 'src/app/_store/_modules/agendamento/agendamento.model'
import { UtilsService } from 'src/app/providers/utils/utils.service'

@Component({
  selector: 'app-agenda-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss']
})
export class DetalhesComponent implements OnInit {
  @Input() agendamento: any
  @Input() isAgendador: boolean
  @Input() listTipoAgendamento: Array<AgendamentoModels.TipoAgendamento>
  @Input() listStatusAgendamento: Array<AgendamentoModels.StatusAgendamento>
  status: AgendamentoModels.StatusAgendamento

  constructor(private uServ: UtilsService) {}

  ngOnInit() {
    let statusAtrasado = this.listStatusAgendamento.find(item => {
      return item.codigo === AgendamentoModels.STATUS.ATRASADO
    })
    this.status = this.agendamento.agendamento_status
    if (
      this.agendamento.agendamento_status.codigo === AgendamentoModels.STATUS.AGENDADO &&
      new Date(this.agendamento.dataInicio).getTime() < new Date().getTime()
    ) {
      this.status = statusAtrasado
    }
  }

  isBlockedTypeItem(item) {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === item.agendamento_tipo_id
      })
      return tipo && tipo.bloqueio === 1
    }
    return false
  }

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

  getStatusStyle() {
    return { 'background-color': this.status.apresentacao_cor }
  }

  getStatusIcon() {
    return this.status.apresentacao_icon
  }

  getStatusDescricao() {
    return this.status.descricao
  }

  disableBtnLinkPaciente() {
      return (
        this.status.codigo === AgendamentoModels.STATUS.CANCELADO ||
        this.status.codigo === AgendamentoModels.STATUS.REALIZADO ||
        this.status.codigo === AgendamentoModels.STATUS.ATRASADO ||
        this.isPastDate()
      )
  }

  disableBtnsModalInfo() {
    if (!this.isAgendador) {
      return (
        this.status.codigo === AgendamentoModels.STATUS.CANCELADO ||
        this.status.codigo === AgendamentoModels.STATUS.REALIZADO ||
        this.isPastDate()
      )
    }
    return this.isAgendador
  }

  isPastDate() {
    const today = this.uServ.getToday()
    const date = this.agendamento.dataInicio.split(' ')[0]
    const diff = this.uServ.diffDays(date, today)
    return diff < 0
  }

  copyLink(link) {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = link
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  labelPago(statusPago) {
    return statusPago ? 'Pago' : 'Não pago'
  }

  labelReagendamento(statusReagendamento) {
    return statusReagendamento ? 'Sim' : 'Não'
  }

  getTipo() {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === this.agendamento.agendamento_tipo_id
      })
      return tipo ? tipo.descricao : ''
    }
    return ''
  }
}
