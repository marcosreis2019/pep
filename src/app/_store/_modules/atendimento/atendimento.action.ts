import { createAction, props } from '@ngrx/store'
import { QuestionariosModels } from './atendimento.questionario.model'
import { AtendimentoModel } from './atendimento.model'
import { BeneficiarioModels } from '../beneficiario/beneficiario.model'
import { TipoServicoModels } from '../tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from '../classificacao/classificacao.model'

// tslint:disable-next-line: no-namespace
export namespace AtendimentoActions {
  export enum Types {
    // GERAL
    // INICIAR ATENDIMENTO
    START = '[ATENDIMENTO] iniciar',
    INIT_ESTRAT = '[ATENDIMENTO] iniciar estratificacao',
    SET_DATA_START = '[ATENDIMENTO] carrega dados inicias',
    SET_ERROR_START = '[ATENDIMENTO] set erro ao iniciar', // TODO remover
    GET_COD_OPERADORA = '[ATENDIMENTO] get codigo operadora',
    SET_COD_OPERADORA = '[ATENDIMENTO] set codigo operadora',
    

    // FINALIZAR ATENDIMENTO
    SET_DATE_FINISH = '[ATENDIMENTO] set data final do atendimento',
    FINISH = '[ATENDIMENTO] finalizar',
    ERROR_FINISH = '[ATENDIMENTO] finalizar com erro', // TODO remover
    SUCCESS_FINISH = '[ATENDIMENTO] finalizado com sucesso',
    GET_DETERMINANTES = '[ATENDIMENTO] get determinantes',
    DELETE_ATENDIMENTO     = '[ATENDIMENTO] delete atendimento',
    POST_ESTRATIFICAO_GERAL = '[ATENDIMENTO] post estratificacao',
    LOADING = '[ATENDIMENTO] loading',
    SET_FULL_SCREEN_LOADING = '[ATENDIMENTO] set full screen loading',

    // SUBJETIVO
    GET_QUESTIONARIO_SUBJETIVO = '[ATENDIMENTO] get questionário subjetivo',
    SET_QUESTIONARIO_SUBJETIVO = '[ATENDIMENTO] set questionário subjetivo',
    SET_ORIENTACOES_SUBJETIVO = '[ATENDIMENTO] set orientacoes subjetivo',
    POST_RESPOSTAS_SUBJETIVO = '[ATENDIMENTO] post respostas subjetivo',
    POST_RESPOSTAS_SUCCESS_SUBJETIVO = '[ATENDIMENTO] post respostas subjetivo success',
    POST_RESPOSTAS_ERROR_SUBJETIVO = '[ATENDIMENTO] post respostas subjetivo error',
    UPDATE_RESPOSTAS_SUBJETIVO = '[ATENDIMENTO] update respostas subjetivo',
    UPDATE_DESCRICAO_SUBJETIVO = '[ATENDIMENTO] update descricao subjetivo',
    ANSWERED_REQUIRED_QUESTIONS_SUBJETIVO = '[ATENDIMENTO] answered required questions subjetivo',
    POST_QUESTIONS_SUBJETIVO_IN_RES = '[ATENDIMENTO] post questions subjetivo in RES',

    // OBJETIVO
    GET_QUESTIONARIO_OBJETIVO = '[ATENDIMENTO] get questionário objetivo',
    SET_QUESTIONARIO_OBJETIVO = '[ATENDIMENTO] set questionário objetivo',
    SET_ORIENTACOES_OBJETIVO = '[ATENDIMENTO] set orientacoes objetivo',
    POST_RESPOSTAS_OBJETIVO = '[ATENDIMENTO] post respostas objetivo',
    POST_RESPOSTAS_SUCCESS_OBJETIVO = '[ATENDIMENTO] post respostas objetivo success',
    POST_RESPOSTAS_ERROR_OBJETIVO = '[ATENDIMENTO] post respostas objetivo error',
    UPDATE_RESPOSTAS_OBJETIVO = '[ATENDIMENTO] update respostas objetivo',
    UPDATE_DESCRICAO_OBJETIVO = '[ATENDIMENTO] update descricao objetivo',
    ANSWERED_REQUIRED_QUESTIONS_OBJETIVO = '[ATENDIMENTO] answered required questions objetivo',
    POST_QUESTIONS_OBJETIVO_IN_RES = '[ATENDIMENTO] post questions objetivo in RES',

    // AVALIACAO
    SET_ORIENTACOES_AVALIACAO = '[ATENDIMENTO] set orientacoes avaliacao',
    UPDATE_DESCRICAO_AVALIACAO = '[ATENDIMENTO] update descricao avaliacao',

    // PLANO
    SET_ORIENTACOES_PLANO = '[ATENDIMENTO] set orientacoes plano',
    UPDATE_DESCRICAO_PLANO = '[ATENDIMENTO] update descricao plano',
    SET_METAS_PLANO = '[ATENDIMENTO] set metas plano',
    CREATE_META_PLANO = '[ATENDIMENTO] create meta plano',
    ADD_META_PLANO = '[ATENDIMENTO] add meta plano',
    SET_OLD_METAS = '[ATENDIMENTO] set old metas',
    COMPLETE_META_PLANO = '[ATENDIMENTO] complete meta plano',
    CHANGE_STATUS_META_PLANO = '[ATENDIMENTO] change status meta plano',
    DELETE_META_PLANO = '[ATENDIMENTO] delete meta plano',
    // CID ATENDIMENTO
    SET_CID_ATENDIMENTO = '[ATENDIMENTO] set cid atendimento',
    SET_CID_CONFIRMADOS_ATENDIMENTO = '[ATENDIMENTO] set cid confirmados atendimento',
    SET_CID_SUSPEITOS_ATENDIMENTO = '[ATENDIMENTO] set cid suspeitos atendimento',
    // RETORNO
    SET_RETORNO = '[ATENDIMENTO] set retorno',
  }

  // GERAL
  // atendimento start
  export const start = createAction(
    Types.START,
    props<{ payload: AtendimentoModel.AtendimentoStart }>()
  )
  export const setDataStart = createAction(
    Types.SET_DATA_START,
    props<{ payload: { dataInicio: string; tipo: string; id: string, sequencial: number, tipo_servico: TipoServicoModels.TipoServico, classificacao: ClassificacaoModels.Classificacao } }>()
  )
  export const setErrorStart = createAction(
    Types.SET_ERROR_START,
    props<{ payload: string }>()
  )
  export const getCodOperadora = createAction(
    Types.GET_COD_OPERADORA,
    props<{ payload: string }>()
  )
  export const setCodOperadora = createAction(
    Types.SET_COD_OPERADORA,
    props<{ payload: number }>()
  )
  // atendimento finish
  export const setDateFinish = createAction(
    Types.SET_DATE_FINISH,
    props<{ payload: { dataFim: string } }>()
  )
  export const finish = createAction(Types.FINISH,
    props<{ payload: AtendimentoModel.ParaAPI }>())
  export const finishSuccess = createAction(
    Types.SUCCESS_FINISH,
    props<{ payload: string }>()
  )
  export const finishError = createAction(
    Types.ERROR_FINISH,
    props<{ payload: string }>()
  )
  // LOADINGS
  export const setLoading = createAction(
    Types.LOADING,
    props<{ payload: boolean }>()
  )
  export const setFullScreenLoading = createAction(
    Types.SET_FULL_SCREEN_LOADING,
    props<{ payload: boolean }>()
  )

  // QUESTIONARIO
  export const getDeterminantes = createAction(
    Types.GET_DETERMINANTES,
    props<{ payload?: { mpi: string; codigo: number } }>()
  )
  export const postEstratificao = createAction(Types.POST_ESTRATIFICAO_GERAL)


  export const initEstratificacao = createAction(Types.INIT_ESTRAT)

  // CONDUTA SUBJETIVO
  export const getQuestSubjetivo = createAction(
    Types.GET_QUESTIONARIO_SUBJETIVO,
    props<{ payload: string[] }>()
  )
  export const setQuestSubjetivo = createAction(
    Types.SET_QUESTIONARIO_SUBJETIVO,
    props<{ payload: QuestionariosModels.Pergunta[] }>()
  )
  export const setOrientacoesSubjetivo = createAction(
    Types.SET_ORIENTACOES_SUBJETIVO,
    props<{ payload: QuestionariosModels.AtividadesIndividuais[] }>()
  )
  export const postAnswerSubjetivo = createAction(
    Types.POST_RESPOSTAS_SUBJETIVO,
    props<{
      payload: { answers: any; inputs: QuestionariosModels.DynamicFormInput[], mpi: string, codigoOperadora: number }
    }>()
  )
  export const postAnswerErrorSubjetivo = createAction(
    Types.POST_RESPOSTAS_ERROR_SUBJETIVO,
    props<{ payload: string }>()
  )
  export const postAnswerSuccessSubjetivo = createAction(
    Types.POST_RESPOSTAS_SUCCESS_SUBJETIVO,
    props<{ payload: string }>()
  )
  export const updateAnswerSubjetivo = createAction(
    Types.UPDATE_RESPOSTAS_SUBJETIVO,
    props<{ payload: QuestionariosModels.Answers[] }>()
  )
  export const updateDescSubjetivo = createAction(
    Types.UPDATE_DESCRICAO_SUBJETIVO,
    props<{ payload: string }>()
  )
  export const answeredRequiredQuestionsSubjetivo = createAction(
    Types.ANSWERED_REQUIRED_QUESTIONS_SUBJETIVO,
    props<{ payload: boolean }>()
  )

  // CONDUTA OBJETIVO
  export const getQuestObjetivo = createAction(
    Types.GET_QUESTIONARIO_OBJETIVO,
    props<{ payload: string[] }>()
  )
  export const setQuestObjetivo = createAction(
    Types.SET_QUESTIONARIO_OBJETIVO,
    props<{ payload: QuestionariosModels.Pergunta[] }>()
  )
  export const setOrientacoesObjetivo = createAction(
    Types.SET_ORIENTACOES_OBJETIVO,
    props<{ payload: QuestionariosModels.AtividadesIndividuais[] }>()
  )
  export const postAnswerObjetivo = createAction(
    Types.POST_RESPOSTAS_OBJETIVO,
    props<{
      payload: { answers: any; inputs: QuestionariosModels.DynamicFormInput[], mpi: string, codigoOperadora: number }
    }>()
  )
  export const postAnswerErrorObjetivo = createAction(
    Types.POST_RESPOSTAS_ERROR_OBJETIVO,
    props<{ payload: string }>()
  )
  export const postAnswerSuccessObjetivo = createAction(
    Types.POST_RESPOSTAS_SUCCESS_OBJETIVO,
    props<{ payload: string }>()
  )
  export const updateAnswerObjetivo = createAction(
    Types.UPDATE_RESPOSTAS_OBJETIVO,
    props<{ payload: QuestionariosModels.Answers[] }>()
  )
  export const updateDescObjetivo = createAction(
    Types.UPDATE_DESCRICAO_OBJETIVO,
    props<{ payload: string }>()
  )
  export const answeredRequiredQuestionsObjetivo = createAction(
    Types.ANSWERED_REQUIRED_QUESTIONS_OBJETIVO,
    props<{ payload: boolean }>()
  )

  // CONDUTA AVALIACAO
  export const setOrientacoesAvaliacao = createAction(
    Types.SET_ORIENTACOES_AVALIACAO,
    props<{ payload: QuestionariosModels.AtividadesIndividuais[] }>()
  )
  export const updateDescAvaliacao = createAction(
    Types.UPDATE_DESCRICAO_AVALIACAO,
    props<{ payload: string }>()
  )

  // CONDUTA PLANO
  export const setOrientacoesPlano = createAction(
    Types.SET_ORIENTACOES_PLANO,
    props<{ payload: QuestionariosModels.AtividadesIndividuais[] }>()
  )
  export const updateDescPlano = createAction(
    Types.UPDATE_DESCRICAO_PLANO,
    props<{ payload: string }>()
  )
  export const setMetasPlano = createAction(
    Types.SET_METAS_PLANO,
    props<{ payload: AtendimentoModel.Meta[] }>()
  )
  export const createMetaPlano = createAction(
    Types.CREATE_META_PLANO,
    props<{ payload: string }>()
  )
  export const addMetaPlano = createAction(
    Types.ADD_META_PLANO,
    props<{ payload: AtendimentoModel.Meta }>()
  )
  export const setOldMetas = createAction(
    Types.SET_OLD_METAS,
    props<{ payload: AtendimentoModel.Meta[] }>()
  )
  export const completeMetaPlano = createAction(
    Types.COMPLETE_META_PLANO,
    props<{ payload: AtendimentoModel.Meta }>()
  )
  export const changeMetaPlano = createAction(
    Types.CHANGE_STATUS_META_PLANO,
    props<{ payload: AtendimentoModel.Meta }>()
  )
  export const deleteMetaPlano = createAction(
    Types.DELETE_META_PLANO,
    props<{ payload: string }>()
  )

  // cid atendimento na análise
  export const setCIDAtendimento = createAction(
    Types.SET_CID_ATENDIMENTO,
    props<{ payload: any }>()
  )

  export const setCIDsConfirmadosAtendimento = createAction(
    Types.SET_CID_CONFIRMADOS_ATENDIMENTO,
    props<{ payload: Array<any> }>()
  )


  export const setCIDsSuspeitosAtendimento = createAction(
    Types.SET_CID_SUSPEITOS_ATENDIMENTO,
    props<{ payload: Array<any> }>()
  )

  // RETORNO
  export const setRetorno = createAction(
    Types.SET_RETORNO,
    props<{ payload: AtendimentoModel.Retorno }>()
  )

  export const deleteAtendimento   = createAction(
    Types.DELETE_ATENDIMENTO, 
    props<{ payload: AtendimentoModel.Inicial }>()
  )
}
