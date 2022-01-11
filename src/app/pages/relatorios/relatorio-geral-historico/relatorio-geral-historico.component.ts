import { Component, OnDestroy, OnInit } from '@angular/core'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { AtendimentoState } from 'src/app/_store/_modules/atendimento/atendimento.state'
import { ActivatedRoute } from '@angular/router'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import { QuestionariosModels } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'

@Component({
  selector: 'app-relatorio-geral-historico',
  templateUrl: './relatorio-geral-historico.component.html',
  styleUrls: ['./relatorio-geral-historico.component.scss']
})
export class RelatorioGeralHistoricoComponent implements OnInit, OnDestroy {
  relatorio: AtendimentoModel.RelatorioGeral
  today = new Date()

  evento: any
  beneficiarioAis: any

  constructor(
    private uServ: UtilsService,
    private eventoServ: EventosService,
    private route: ActivatedRoute,
    private beneficiarioService: BeneficiarioService
  ) {}

  ngOnInit() {
    const d = this.uServ.getDateTime()
    this.loadEvento()
  }

  loadEvento() {
    this.route.queryParams.subscribe(params => {
      const eventoSequencial = Number(params['eventoSequencial'])
      this.eventoServ.getBySequence(eventoSequencial).then(res => {
        if (res && res.data && res.data[0]) {
          this.evento = res.data[0]
          this.getBeneficiarioByMpi(this.evento.pessoa)
        }
      })
    })
  }

  getBeneficiarioByMpi(mpiBeneficiario) {
    this.beneficiarioService
      .getByMpiBeneficiarios(mpiBeneficiario)
      .subscribe(beneficiariosAisParam => {
        if (beneficiariosAisParam && beneficiariosAisParam[0]) {
          this.beneficiarioAis = beneficiariosAisParam[0]
          beneficiariosAisParam && beneficiariosAisParam.length ? beneficiariosAisParam[0] : null
          if (this.beneficiarioAis != null) {
            this.montaRelatorioHistorico()
          }
        }
      })
  }

  montaRelatorioHistorico() {
    const questSub = this.getRespostasParaRelatorio(this.evento.subjetivo.respostas)
    const questObj = this.getRespostasParaRelatorio(this.evento.objetivo.respostas)
    const questPla = this.filterByActiveMetas(this.evento.plano.metas)
    var conselhoProfissional = this.evento.profissional.conselhoProfissional + ': '
    const objRelatorio: any = {
      paciente: { label: 'Paciente: ', value: this.beneficiarioAis.nome },
      cpf: { label: 'CPF: ', value: '' },
      sexo: { label: 'Sexo: ', value: '' },
      idade: { label: 'Idade: ', value: this.beneficiarioAis.dataNascimento },
      endereco: {
        label: 'Endereço: ',
        value: ''
      },
      bairro: {
        label: 'Bairro: ',
        value: ''
      },
      numero: { label: 'Número: ', value: undefined },
      email: {
        label: 'Email:',
        value: ''
      },
      cep: {
        label: 'CEP: ',
        value: ''
      },
      subjetivo: {
        label: 'Subjetivo ',
        value: this.evento.subjetivo,
        estruturados: questSub || []
      },
      objetivo: {
        label: 'Objetivo ',
        value: this.evento.objetivo,
        estruturados: questObj || []
      },
      plano: {
        label: 'Plano ',
        value: this.evento.plano.descricao,
        estruturados: questPla || []
      },
      tipoServico: { label: 'Tipo Serviço: ', value: this.evento.tipo_servico.descricao },
      conselho: { label: conselhoProfissional, value: this.evento.profissional.numeroConselho },
      cidade: { label: 'Cidade: ', value: '' },
      local: { label: 'Local de Atendimento: ', value: '' },
      profissional: {
        label: 'Profissional de Saúde: ',
        value: this.evento.profissional.pessoa.nome_completo
      }
    }

    if (this.evento.localAtendimento) {
      objRelatorio.cidade = {
        label: 'Cidade: ',
        value: this.evento.localAtendimento.municipio.nome
      }
      objRelatorio.local = {
        label: 'Local de Atendimento: ',
        value: this.evento.localAtendimento.razao_social
      }
    }
    if (this.beneficiarioAis) {
      objRelatorio.cpf.value = this.beneficiarioAis.cpf
      objRelatorio.sexo.value = this.beneficiarioAis.sexo
      objRelatorio.email.value =
        this.beneficiarioAis.emails && this.beneficiarioAis.emails.length
          ? this.beneficiarioAis.emails[0].email
          : ''
      if (this.beneficiarioAis.enderecos && this.beneficiarioAis.enderecos.length) {
        let endereco = this.beneficiarioAis.enderecos[0]
        objRelatorio.cep.value = endereco.cep
        objRelatorio.bairro.value = endereco.bairro
        objRelatorio.endereco.value = `${endereco.logradouro} - ${endereco.cidade}/${endereco.uf}`
      }
    }
    objRelatorio.avaliacao = this.evento.avaliacao
    this.relatorio = objRelatorio
  }

  filterByActiveMetas(arr: AtendimentoModel.Meta[]) {
    return arr
      .filter(meta => meta.estadoAtual === AtendimentoModel.METAS_ESTADO.ATIVA)
      .map(meta => ({ label: meta.descricao }))
  }

  getRespostasParaRelatorio(arr: QuestionariosModels.Answers[]): AtendimentoModel.Item[] {
    const map: AtendimentoModel.Item[] = []
    if (arr && arr.length > 0) {
      arr.forEach(i => {
        i.answers.forEach(r =>
          map.push({
            label: r.paraRelatorio.labelPergunta,
            value: r.paraRelatorio.labelResposta
          })
        )
      })
    }
    return map
  }

  print() {
    window.print()
  }

  ngOnDestroy() {}
}
