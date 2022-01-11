import { createSelector } from '@ngrx/store'
import { QuestionariosModels } from '../atendimento/atendimento.questionario.model'
import { AtendimentoModel } from '../atendimento/atendimento.model'
import { PEPState } from '../../store.models'

export namespace RelatoriosSelect {
  const pepState = (state): PEPState => state

  export const relatorioGeral = createSelector(pepState, (state: PEPState, props) => {
    const questSub = getRespostasParaRelatorio(state.atendimento.subjetivo.respostas)
    const questObj = getRespostasParaRelatorio(state.atendimento.objetivo.respostas)
    const questPla = filterByActiveMetas(state.atendimento.plano.metas)
    var conselhoProfissional = state.profissional.pro.conselhoProfissional + ': '
    const objRelatorio = {
      paciente: { label: 'Paciente: ', value: state.beneficiario.dadosPessoais.nomeCompleto },
      cpf: { label: 'CPF: ', value: '' },
      sexo: { label: 'Sexo: ', value: '' },
      idade: { label: 'Idade: ', value: state.beneficiario.dadosPessoais.dataNascimento },
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
        value: state.atendimento.subjetivo.descricao,
        estruturados: questSub || []
      },
      objetivo: {
        label: 'Objetivo ',
        value: state.atendimento.objetivo.descricao,
        estruturados: questObj || []
      },
      avaliacao: {
        label: 'Avaliação ',
        valueCid:
          'CID: ' +
          (state.atendimento.avaliacao.cid ? state.atendimento.avaliacao.cid.descricao : ''),
        value: 'Descrição: ' + state.atendimento.avaliacao.descricao,
        estruturados: [],
        cidPrincipal: state.atendimento.avaliacao.cidPrincipal,
        cidSecundariosConfirmados: state.atendimento.avaliacao.cidSecundariosConfirmados,
        cidSecundariosSuspeitos: state.atendimento.avaliacao.cidSecundariosSuspeitos
      },
      plano: {
        label: 'Plano ',
        value: state.atendimento.plano.descricao,
        estruturados: questPla || []
      },
      tipoServico: { label: 'Tipo Serviço: ', value: state.atendimento.tipo_servico.descricao },
      conselho: { label: conselhoProfissional, value: state.profissional.pro.numeroConselho },
      cidade: { label: 'Cidade: ', value: '' },
      local: { label: 'Local de Atendimento: ', value: '' },
      profissional: {
        label: 'Profissional de Saúde: ',
        value: state.profissional.pro.pessoa.nome_completo
      }
    }

    if (state.local && state.local.local) {
      objRelatorio.cidade = { label: 'Cidade: ', value: state.local.local.municipio.nome }
      objRelatorio.local = {
        label: 'Local de Atendimento: ',
        value: state.local.local.razao_social
      }
    }

    return objRelatorio
  })

  function filterByActiveMetas(arr: AtendimentoModel.Meta[]) {
    return arr
      .filter(meta => meta.estadoAtual === AtendimentoModel.METAS_ESTADO.ATIVA)
      .map(meta => ({ label: meta.descricao }))
  }
  function getRespostasParaRelatorio(arr: QuestionariosModels.Answers[]): AtendimentoModel.Item[] {
    const map: AtendimentoModel.Item[] = []
    arr.forEach(i => {
      i.answers.forEach(r =>
        map.push({
          label: r.paraRelatorio.labelPergunta,
          value: r.paraRelatorio.labelResposta
            ? r.paraRelatorio.labelResposta
            : r.paraRelatorio.labelsRespostas
        })
      )
    })
    return map
  }
}
