import { Action, createReducer, on } from '@ngrx/store'
import { AtendimentoActions as Actions, AtendimentoActions } from './atendimento.action'
import { QuestionariosModels } from './atendimento.questionario.model'
import { AntendimentoStateClass, AtendimentoState } from './atendimento.state'
import { AtendimentoModel } from './atendimento.model'

export namespace AtendimentoReducer {
  enum SOAP {
    SUBJETIVO = 'subjetivo',
    OBJETIVO = 'objetivo',
    AVALIACAO = 'avaliacao',
    PLANO = 'plano'
  }

  interface setOrientacoes {
    orientacoes: QuestionariosModels.AtividadesIndividuais[]
    questionariosIDs: string[]
  }
  type Data =
    | QuestionariosModels.Questionario
    | QuestionariosModels.Resposta
    | QuestionariosModels.DynamicFormInput
    | setOrientacoes
    | QuestionariosModels.Answers
  const initialState: AtendimentoState = new AntendimentoStateClass()

  function _abstractUpdate(
    state: AtendimentoState,
    data: Data | Data[],
    target: string,
    type: string
  ): AtendimentoState {
    return {
      ...state,
      [target]: { ...state[target], [type]: state[target][type].concat(data) }
    }
  }

  function _abstractSetArray(
    state: AtendimentoState,
    data: Data | Data[],
    target: string,
    type: string
  ): AtendimentoState {
    return { ...state, [target]: { ...state[target], [type]: [].concat(data) } }
  }

  function _abstractUpdateAnswer(
    state: AtendimentoState,
    data: QuestionariosModels.Answers[],
    target: string
  ) {
    const newState = _abstractUpdate(state, data, target, 'respostas')
    return {
      ...newState,
      [target]: { ...newState[target], contador: state[target].contador + 1 }
    }
  }

  function _abstractSetQuest(
    state: AtendimentoState,
    data: QuestionariosModels.DynamicFormInput[],
    target: string
  ) {
    return _abstractSetArray(state, data, target, 'perguntas')
  }

  function _absctractSetDesc(
    state: AtendimentoState,
    data: string,
    target: string
  ): AtendimentoState {
    return { ...state, [target]: { ...state[target], descricao: data } }
  }

  function _abstractSetOrien(state: AtendimentoState, data: any, target: string): AtendimentoState {
    return {
      ...state,
      [target]: { ...state[target], orientacoes: [].concat(data) }
    }
  }

  function _abstractSetPost(state: AtendimentoState, msg: string, target: string, type: string) {
    return { ...state, [target]: { ...state[target], [type]: msg } }
  }

  function _setDataStart(state: AtendimentoState, action: Action): AtendimentoState {
    const payload = action['payload']
    const newState = { ...state }
    newState.dataInicio = payload.dataInicio
    newState.tipo = payload.tipo
    newState.id = payload.id
    newState.tipo_servico = payload.tipo_servico
    newState.classificacao = payload.classificacao
    newState.sequencial = payload.sequencial
    return newState
  }

  function _setDateFinish(state: AtendimentoState, action: Action): AtendimentoState {
    const payload = action['payload']
    return { ...state, dataFim: payload.dataFim }
  }

  function _setMetaPlano(state: AtendimentoState, action: Action): AtendimentoState {
    const metas = filterMetas(action['payload'], state.plano.metas)
    return { ...state, plano: { ...state.plano, metas: [].concat(metas) } }
  }

  // Geral
  const _deleteAtendimento = (state, action: Action) => ({
    ...state,
    id: { undefined }
  })

  const _setLoading = (state: AtendimentoState, action: Action) => ({
    ...state,
    loading: action['payload']
  })
  const _setFullScreenLoading = (state: AtendimentoState, action: Action) => ({
    ...state,
    fullScreenLoading: action['payload']
  })
  const _set_data_start = (state: AtendimentoState, action: Action) => _setDataStart(state, action)
  const _set_date_finish = (state: AtendimentoState, action: Action) =>
    _setDateFinish(state, action)
  const _set_error_start = (state: AtendimentoState, action: Action) => ({
    ...state,
    startError: action['payload']
  })
  const _setCodOperadora = (state: AtendimentoState, action: Action) => ({
    ...state,
    codigoOperadora: action['payload']
  })
  // Subjetivo
  const _setQuestSubjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetQuest(state, action['payload'], SOAP.SUBJETIVO)
  const _updateAnswerSubjetivo = (state: AtendimentoState, action: Action) =>
    _abstractUpdateAnswer(state, action['payload'], SOAP.SUBJETIVO)
  const _updateDescSubjetivo = (state: AtendimentoState, action: Action) =>
    _absctractSetDesc(state, action['payload'], SOAP.SUBJETIVO)
  const _setOrienSubjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetOrien(state, action['payload'], SOAP.SUBJETIVO)
  const _setPostSuccessSubjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetPost(state, action['payload'], SOAP.SUBJETIVO, 'postSuccess')
  const _setPostFailSubjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetPost(state, action['payload'], SOAP.SUBJETIVO, 'postFail')
  const _setAnsweredReqSubjetivo = (state: AtendimentoState, action: Action) => ({
    ...state,
    subjetivo: {
      ...state.subjetivo,
      answeredRequiredQuestions: action['payload']
    }
  })

  // Objetivo
  const _setQuestObjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetQuest(state, action['payload'], SOAP.OBJETIVO)
  const _updateAnswerObjetivo = (state: AtendimentoState, action: Action) =>
    _abstractUpdateAnswer(state, action['payload'], SOAP.OBJETIVO)
  const _updateDescObjetivo = (state: AtendimentoState, action: Action) =>
    _absctractSetDesc(state, action['payload'], SOAP.OBJETIVO)
  const _setOrienObjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetOrien(state, action['payload'], SOAP.OBJETIVO)
  const _setPostSuccessObjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetPost(state, action['payload'], SOAP.OBJETIVO, 'postSuccess')
  const _setPostFailObjetivo = (state: AtendimentoState, action: Action) =>
    _abstractSetPost(state, action['payload'], SOAP.OBJETIVO, 'postFail')
  // Avaliacao
  const _updateDescAvaliacao = (state: AtendimentoState, action: Action) =>
    _absctractSetDesc(state, action['payload'], SOAP.AVALIACAO)
  const _setOrienAvaliacao = (state: AtendimentoState, action: Action) => {
    const orie = removeDuplicates(
      action['payload'],
      (i: QuestionariosModels.AtividadesIndividuais) => i.dsAtividadeIndividual
    )
    return _abstractSetOrien(state, orie, SOAP.AVALIACAO)
  }
  const _setAnsweredReqObjetivo = (state: AtendimentoState, action: Action) => ({
    ...state,
    objetivo: {
      ...state.objetivo,
      answeredRequiredQuestions: action['payload']
    }
  })

  // Plano
  const _updateDescPlano = (state: AtendimentoState, action: Action) =>
    _absctractSetDesc(state, action['payload'], SOAP.PLANO)
  const _setOrienPlano = (state: AtendimentoState, action: Action) => {
    const orie = removeDuplicates(
      action['payload'],
      (i: QuestionariosModels.AtividadesIndividuais) => i.dsAtividadeIndividual
    )
    return _abstractSetOrien(state, orie, SOAP.PLANO)
  }
  const _setMetasPlano = (state: AtendimentoState, action: Action) => {
    const metas = state.plano.metas.concat(action['payload'])
    return {
      ...state,
      plano: {
        ...state.plano,
        metas: removeDuplicates<AtendimentoModel.Meta>(metas, meta => meta.descricao)
      }
    }
  }
  const _addMetaPlano = (state: AtendimentoState, action: Action) => ({
    ...state,
    plano: {
      ...state.plano,
      metas: state.plano.metas.concat(action['payload'])
    }
  })
  const _completeMeta = (state: AtendimentoState, action: Action) => ({
    ...state,
    plano: {
      ...state.plano,
      metas: completeMeta(action['payload'], state.plano.metas)
    }
  })
  const _changeMetaPlano = (state: AtendimentoState, action: Action) => _setMetaPlano(state, action)

  const _deleteMetaPlano = (state: AtendimentoState, action: Action) => {
    const metas = state.plano.metas.filter(i => i.dataCriacao !== action['payload'])
    return { ...state, plano: { ...state.plano, metas: [].concat(metas) } }
  }

  // CID ATENDIMENTO
  const _setCIDAtendimento = (state: AtendimentoState, action: Action) => ({
    ...state,
    avaliacao: { ...state.avaliacao, cidPrincipal: action['payload'], cid: action['payload'] }
  })

  const _setCIDsConfirmadosAtendimento = (state: AtendimentoState, action: Action) => ({
    ...state,
    avaliacao: { ...state.avaliacao, cidSecundariosConfirmados: action['payload'] }
  })

  const _setCIDsSuspeitosAtendimento = (state: AtendimentoState, action: Action) => ({
    ...state,
    avaliacao: { ...state.avaliacao, cidSecundariosSuspeitos: action['payload'] }
  })

  // RETORNO
  const _setRetorno = (state: AtendimentoState, action: Action) => ({
    ...state,
    plano: { ...state.plano, retorno: action['payload'] }
  })

  function filterMetas(
    meta: AtendimentoModel.Meta,
    metas: AtendimentoModel.Meta[]
  ): AtendimentoModel.Meta[] {
    return metas.map(i => {
      return i.idAtividadeIndividual && i.idAtividadeIndividual === meta.idAtividadeIndividual
        ? changeMetaStatus(meta)
        : i
    })
  }

  function changeMetaStatus(meta: AtendimentoModel.Meta): AtendimentoModel.Meta {
    return { ...meta, estadoAtual: AtendimentoModel.METAS_ESTADO.ATIVA }
  }

  function completeMeta(
    meta: AtendimentoModel.Meta,
    metas: AtendimentoModel.Meta[]
  ): AtendimentoModel.Meta[] {
    return metas.map(m => {
      return m.dataCriacao === meta.dataCriacao ? { ...meta, foiRealizada: true } : m
    })
  }

  function removeDuplicates<T>(
    a: T[],
    callback: any // function like i => i.id
  ): T[] {
    const seen = {}
    return a.filter(function(item) {
      const k = callback(item)
      return seen.hasOwnProperty(k) ? false : (seen[k] = true)
    })
  }

  const _atendimentoReduces = createReducer(
    initialState,
    // Geral
    on(Actions.setDataStart, _set_data_start),
    on(Actions.setDateFinish, _set_date_finish),
    on(Actions.setErrorStart, _set_error_start),
    on(Actions.setLoading, _setLoading),
    on(Actions.deleteAtendimento, _deleteAtendimento),
    on(Actions.setFullScreenLoading, _setFullScreenLoading),
    on(Actions.setCodOperadora, _setCodOperadora),
    // Subjetivo
    on(Actions.setOrientacoesSubjetivo, _setOrienSubjetivo),
    on(Actions.setQuestSubjetivo, _setQuestSubjetivo),
    on(Actions.updateAnswerSubjetivo, _updateAnswerSubjetivo),
    on(Actions.updateDescSubjetivo, _updateDescSubjetivo),
    on(Actions.postAnswerSuccessSubjetivo, _setPostSuccessSubjetivo),
    on(Actions.postAnswerErrorSubjetivo, _setPostFailSubjetivo),
    on(Actions.answeredRequiredQuestionsSubjetivo, _setAnsweredReqSubjetivo),
    // Objetivo
    on(Actions.setOrientacoesObjetivo, _setOrienObjetivo),
    on(Actions.setQuestObjetivo, _setQuestObjetivo),
    on(Actions.updateAnswerObjetivo, _updateAnswerObjetivo),
    on(Actions.updateDescObjetivo, _updateDescObjetivo),
    on(Actions.postAnswerSuccessObjetivo, _setPostSuccessObjetivo),
    on(Actions.postAnswerErrorObjetivo, _setPostFailObjetivo),
    on(Actions.answeredRequiredQuestionsObjetivo, _setAnsweredReqObjetivo),
    // Avaliacao
    on(Actions.updateDescAvaliacao, _updateDescAvaliacao),
    on(Actions.setOrientacoesAvaliacao, _setOrienAvaliacao),
    // Plano
    on(Actions.updateDescPlano, _updateDescPlano),
    on(Actions.setOrientacoesPlano, _setOrienPlano),
    on(Actions.setMetasPlano, _setMetasPlano),
    on(Actions.addMetaPlano, _addMetaPlano),
    on(Actions.setOldMetas, _setMetasPlano),
    on(Actions.changeMetaPlano, _changeMetaPlano),
    on(Actions.deleteMetaPlano, _deleteMetaPlano),
    on(Actions.completeMetaPlano, _completeMeta),
    // CID Atendimento
    on(Actions.setCIDAtendimento, _setCIDAtendimento),
    on(Actions.setCIDsConfirmadosAtendimento, _setCIDsConfirmadosAtendimento),
    on(Actions.setCIDsSuspeitosAtendimento, _setCIDsSuspeitosAtendimento),
    // RETORNO
    on(Actions.setRetorno, _setRetorno)
  )

  export function reducer(state: AtendimentoState, action: Action) {
    return _atendimentoReduces(state, action)
  }
}
