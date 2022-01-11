import { Component, OnInit, Input } from '@angular/core'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { AgendamentoModels } from 'src/app/_store/_modules/agendamento/agendamento.model'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'

@Component({
  selector: 'app-agenda-form-editar',
  templateUrl: './form-editar.component.html',
  styleUrls: ['./form-editar.component.scss']
})
export class FormEditarComponent implements OnInit {
  @Input() agendamento: any
  @Input() listTipoServico: Array<TipoServicoModels.TipoServico>
  @Input() listClassificacao: Array<ClassificacaoModels.Classificacao>
  @Input() listTipoAgendamento: Array<AgendamentoModels.TipoAgendamento>
  @Input() listStatusAgendamento: Array<AgendamentoModels.StatusAgendamento>
  listStatus = Object.values(AgendamentoModels.STATUS).sort()

  constructor() {}

  ngOnInit() {}

  getTipo() {
    if (this.listTipoAgendamento.length) {
      const tipo = this.listTipoAgendamento.find(tipo => {
        return tipo.id === this.agendamento.agendamento_tipo_id
      })
      return tipo ? tipo.descricao : ''
    }
    return ''
  }

  getSelectStatus() {
    return this.listStatusAgendamento.filter(item => {
      return item.codigo !== AgendamentoModels.STATUS.ATRASADO
    })
  }

  setDataEdit(ev) {
    this.agendamento.dataInicio = new Date('' + ev)
  }
}
