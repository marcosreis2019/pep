import { createFeatureSelector, createSelector } from '@ngrx/store'
import { PEPState } from '../../store.models'
import { AtendimentoModel } from './atendimento.model'
import { AtendimentoState } from './atendimento.state'

export namespace AtendimentoSelect {
  enum SOAP {
    SUBJETIVO = 'subjetivo',
    OBJETIVO = 'objetivo',
    AVALIACAO = 'avaliacao',
    PLANO = 'plano'
  }
  const atendimentoState = createFeatureSelector<AtendimentoState>('atendimento')
  const pepState = (state: PEPState) => state
  const _getMPIandOPT = (state: PEPState) => {
    return {
      mpi: state.beneficiario.dadosPessoais ? state.beneficiario.dadosPessoais.mpi : '',
      codOperadora: state.atendimento.codigoOperadora,
      proMPI: state.profissional && state.profissional.pro ? state.profissional.pro.pessoa.mpi : ''
    }
  }

  const _getComplete = (state: AtendimentoState, target: string) => state[target].postSuccess
  const _getDesc = (state: AtendimentoState, target: string) => state[target].descricao
  const _getPerg = (state: AtendimentoState, target: string) => state[target].perguntas
  const _getResp = (state: AtendimentoState, target: string) => state[target].respostas
  const _getOrie = (state: AtendimentoState, target: string) => state[target].orientacoes
  const _getCidPrincipal = (state: AtendimentoState) => state[SOAP.AVALIACAO].cidPrincipal
  const _getFail = (state: AtendimentoState, target: string) => state[target].postFail
  const _getLoading = (state: AtendimentoState) => state.loading
  const _getFullScreenLoading = (state: AtendimentoState) => state.fullScreenLoading

  // Geral
  export const loading = createSelector(atendimentoState, _getLoading)
  export const fullScreenLoading = createSelector(atendimentoState, _getFullScreenLoading)
  export const codOperadora = createSelector(atendimentoState, state => state.codigoOperadora)
  export const mpiAndCodOpt = createSelector(pepState, _getMPIandOPT)
  // Subjetivo
  export const subjetivoPostFail = createSelector(atendimentoState, state =>
    _getFail(state, SOAP.SUBJETIVO)
  )
  export const subjetivoDesc = createSelector(atendimentoState, state =>
    _getDesc(state, SOAP.SUBJETIVO)
  )
  export const subjetivoPerguntas = createSelector(atendimentoState, state =>
    _getPerg(state, SOAP.SUBJETIVO)
  )
  export const subjetivoRespostas = createSelector(atendimentoState, state =>
    _getResp(state, SOAP.SUBJETIVO)
  )
  export const subjetivoComplete = createSelector(atendimentoState, state =>
    _getComplete(state, SOAP.SUBJETIVO)
  )
  export const answeredRequiredQuestionsSubjetivo = createSelector(
    atendimentoState,
    state => state.subjetivo.answeredRequiredQuestions
  )

  // Objetivo
  export const objetivoPostFail = createSelector(atendimentoState, state =>
    _getFail(state, SOAP.OBJETIVO)
  )
  export const objetivoDesc = createSelector(atendimentoState, state =>
    _getDesc(state, SOAP.OBJETIVO)
  )
  export const objetivoPerguntas = createSelector(atendimentoState, state =>
    _getPerg(state, SOAP.OBJETIVO)
  )
  export const objetivoRespostas = createSelector(atendimentoState, state =>
    _getResp(state, SOAP.OBJETIVO)
  )
  export const objetivoComplete = createSelector(atendimentoState, state =>
    _getComplete(state, SOAP.OBJETIVO)
  )
  export const answeredRequiredQuestionsObjetivo = createSelector(
    atendimentoState,
    state => state.objetivo.answeredRequiredQuestions
  )

  // Avaliacao
  export const avaliacaoCID = createSelector(atendimentoState, state => _getCidPrincipal(state))
  export const avaliacaoOrien = createSelector(atendimentoState, state =>
    _getOrie(state, SOAP.AVALIACAO)
  )
  export const avaliacaoDesc = createSelector(atendimentoState, state =>
    _getDesc(state, SOAP.AVALIACAO)
  )

  // Plano
  export const planoOrien = createSelector(atendimentoState, state => _getOrie(state, SOAP.PLANO))
  export const planoDesc = createSelector(atendimentoState, state => _getDesc(state, SOAP.PLANO))
  export const planoMetas = createSelector(atendimentoState, state => state.plano.metas)

  // RETORNO
  export const retorno = createSelector(atendimentoState, state => state.plano.retorno)
  export const antedimentoParaAPI = createSelector(
    (state: PEPState) => state,
    (state): AtendimentoModel.ParaAPI => {
      return {
        mpi: state.beneficiario.dadosPessoais ? state.beneficiario.dadosPessoais.mpi : '',
        id: state.atendimento ? state.atendimento.id : '',
        tipo: state.atendimento ? state.atendimento.tipo : '', // TODO deve ser passado como parametro, tbm!
        dataInicio: state.atendimento ? state.atendimento.dataInicio : '',
        dataFim: state.atendimento ? state.atendimento.dataFim : '',
        titulo: 'Atendimento PEP',
        profissional: state.profissional && state.profissional.pro ? state.profissional.pro : '',
        localAtendimento: state.local.local,
        subjetivo: state.atendimento ? state.atendimento.subjetivo.descricao : '',
        questionarioSubjetivo: state.atendimento ? mountSubjetivoQuest(state) : [],
        questionarioObjetivo: state.atendimento ? mountObjetivoQuest(state) : [],
        objetivo: state.atendimento ? state.atendimento.objetivo.descricao : '',
        avaliacao: {
          descricao: state.atendimento.avaliacao.descricao
            ? state.atendimento.avaliacao.descricao
            : '',
          cidPrincipal: state.atendimento ? state.atendimento.avaliacao.cidPrincipal : '',
          cidSecundariosConfirmados: state.atendimento
            ? state.atendimento.avaliacao.cidSecundariosConfirmados
            : [],
          cidSecundariosSuspeitos: state.atendimento
            ? state.atendimento.avaliacao.cidSecundariosSuspeitos
            : [],
          cid: state.atendimento ? state.atendimento.avaliacao.cid : ''
        },
        plano: {
          descricao: state.atendimento ? state.atendimento.plano.descricao : '',
          metas: state.atendimento ? state.atendimento.plano.metas : [],
          retorno: state.atendimento ? state.atendimento.plano.retorno : undefined
        },
        sequencial: state.atendimento ? state.atendimento.sequencial : 0,
        tipo_servico: state.atendimento ? state.atendimento.tipo_servico : undefined,
        classificacao: state.atendimento ? state.atendimento.classificacao : undefined,
        status: state.atendimento.status ? state.atendimento.status : '',
        respondeuQuestionarioSubjetivo: false,
        respondeuQuestionarioObjetivo: false,
        exames: []
      }
    }
  )

  export const mountSubjetivoQuest = (state: any): any[] => {
    let perguntasComRespostas: any[] = []
    if (state.atendimento.subjetivo && state.atendimento.subjetivo.respostas) {
      state.atendimento.subjetivo.respostas.forEach(resp => {
        resp.answers.forEach(answer => {
          perguntasComRespostas.push({
            questionId: answer.paraAPI.codigoPergunta,
            answerIds: answer.paraAPI.codigosRespostas
              ? answer.paraAPI.codigosRespostas
              : answer.paraAPI.codigoResposta,
            questionDescription: answer.paraRelatorio.labelPergunta,
            answerDescription: answer.paraRelatorio.labelsRespostas
              ? answer.paraRelatorio.labelsRespostas
              : answer.paraRelatorio.labelResposta
          })
        })
      })
      return perguntasComRespostas
    }
  }

  export const mountObjetivoQuest = (state: any): any[] => {
    let perguntasComRespostas: any[] = []
    if (state.atendimento.objetivo && state.atendimento.objetivo.respostas) {
      state.atendimento.objetivo.respostas.forEach(resp => {
        resp.answers.forEach(answer => {
          perguntasComRespostas.push({
            questionId: answer.paraAPI.codigoPergunta,
            answerIds: answer.paraAPI.codigosRespostas
              ? answer.paraAPI.codigosRespostas
              : answer.paraAPI.codigoResposta,
            questionDescription: answer.paraRelatorio.labelPergunta,
            answerDescription: answer.paraRelatorio.labelsRespostas
              ? answer.paraRelatorio.labelsRespostas
              : answer.paraRelatorio.labelResposta
          })
        })
      })
      return perguntasComRespostas
    }
  }
}
