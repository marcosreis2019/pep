import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'
import { Observable } from 'rxjs'
import { Canal } from 'src/app/_store/_modules/telemedicina/canal.model'
import { SubSink } from 'subsink'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { ExamesSelectors } from 'src/app/_store/_modules/exames/exames.selectors'
import { ExamesModels } from 'src/app/_store/_modules/exames/exames.models'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import * as jsPDF from 'jspdf'
@Component({
  selector: 'block-timer-historico',
  templateUrl: './block-timer-historico.component.html',
  styleUrls: ['./block-timer-historico.component.scss']
})
export class BlockTimerHistoricoComponent implements OnInit, OnDestroy {
  @Input() listProntuariosSelecionados: any[]
  answeredRequiredQuestionsSubjetivo = false
  answeredRequiredQuestionsObjetivo = false
  exames: Array<ExamesModels.Exame> = []
  retorno: AtendimentoModel.Retorno

  atendimento: AtendimentoModel.ParaAPI
  error = ''
  loading = false

  canal: Observable<Canal>
  canalA: Canal
  telemedicina: string
  mpi: string
  showPlacehold = true

  message = ''

  listTipo = Object.values(AtendimentoModel.TIPO)
  private subs$ = new SubSink()

  constructor(
    private router: Router,
    private store: Store<PEPState>,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.loading = false
  }

  print() {
    const doc = new jsPDF()
    this.listProntuariosSelecionados.forEach((item, index) => {
      let count = 26
      doc.setFont('Courier')
      doc.setFontStyle('bold')
      doc.setFontSize(20)
      doc.text(`Atendimento: ${item.sequencial}`, 65, 15)
      doc.setFontSize(12)
      doc.setFontStyle('normal')
      doc.text(
        `Data: ${this.utilsService.getFormattedDate(item.dataInicio, 'DD/MM/YYYY hh:mm')}`,
        10,
        count
      )
      count = count + 8
      doc.text(`Tipo de serviço: ${item.tipo_servico.descricao}`, 10, count)
      count = count + 8
      doc.text(`Classificação: ${item.classificacao.descricao}`, 10, count)
      count = count + 8
      doc.text(`Profissional: ${item.profissional.pessoa.nome_completo}`, 10, count)
      count = count + 8
      doc.text('Especialidades:', 10, count)
      count = count + 8
      doc.text(
        item.profissional.especialidades
          .map(especialidade => {
            return especialidade.descricao
          })
          .join(', '),
        20,
        count
      )
      count = count + 16
      doc.text(`Subjetivo:`, 10, count)
      count = count + 8
      if (item.subjetivo) {
        doc.text(item.subjetivo, 20, count)
      } else {
        doc.text('Não informado', 20, count)
      }
      count = count + 8
      doc.text(`Objetivo:`, 10, count)
      count = count + 8
      if (item.objetivo) {
        doc.text(item.objetivo, 20, count)
      } else {
        doc.text('Não informado', 20, count)
      }
      count = count + 16
      doc.text(`Análise:`, 10, count)
      count = count + 8
      doc.text(`CID Principal:`, 10, count)
      if (item.avaliacao.cidPrincipal) {
        count = count + 8
        doc.text(
          `${item.avaliacao.cidPrincipal.codigo}: ${item.avaliacao.cidPrincipal.descricao}`,
          20,
          count
        )
      } else {
        count = count + 8
        doc.text('Não informado', 20, count)
      }
      count = count + 8
      doc.text(`CIDs Confirmados:`, 10, count)
      if (
        item.avaliacao.cidSecundariosConfirmados &&
        item.avaliacao.cidSecundariosConfirmados.length
      ) {
        item.avaliacao.cidSecundariosConfirmados.forEach(cidSecundarioConfirmado => {
          count = count + 8
          doc.text(
            `${cidSecundarioConfirmado.codigo}: ${cidSecundarioConfirmado.descricao}`,
            20,
            count
          )
        })
      } else {
        count = count + 8
        doc.text('Não informado', 20, count)
      }
      count = count + 8
      doc.text(`CIDs Suspeitos:`, 10, count)
      if (item.avaliacao.cidSecundariosSuspeitos && item.avaliacao.cidSecundariosSuspeitos.length) {
        item.avaliacao.cidSecundariosSuspeitos.forEach(cidSecundarioSuspeito => {
          count = count + 8
          doc.text(`${cidSecundarioSuspeito.codigo}: ${cidSecundarioSuspeito.descricao}`, 20, count)
        })
      } else {
        count = count + 8
        doc.text('Não informado', 20, count)
      }
      count = count + 8
      doc.text(`Plano:`, 10, count)
      if (item.plano && item.plano.descricao) {
        count = count + 8
        doc.text(item.plano.descricao, 20, count)
      } else {
        count = count + 8
        doc.text('Não informado', 20, count)
      }
      count = count + 8
      doc.text(`Metas:`, 10, count)
      if (item.plano && item.plano.metas && item.plano.metas.length) {
        let realizadas = item.plano.metas.filter(meta => {
          return meta.foiRealizada
        })
        if (realizadas.length) {
          count = count + 8
          doc.text(`Realizadas:`, 10, count)
          realizadas.forEach(meta => {
            count = count + 8
            doc.text(meta.descricao, 20, count)
          })
        }
        let naoRealizadas = item.plano.metas.filter(meta => {
          return !meta.foiRealizada
        })
        if (naoRealizadas.length) {
          count = count + 8
          doc.text(`Não Realizadas:`, 10, count)
          naoRealizadas.forEach(meta => {
            count = count + 8
            doc.text(meta.descricao, 20, count)
          })
        }
      } else {
        count = count + 8
        doc.text('Não informado', 20, count)
      }
      if (index < this.listProntuariosSelecionados.length - 1) {
        doc.addPage()
      }
    })
    doc.save('atendimentos.pdf')
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }
}
