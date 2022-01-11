import { createAction, props } from '@ngrx/store'
import { PEPError } from './errors.models'

export namespace ErrorsActions {
  enum Types {
    // Auth
    SET_AUTH_LOGIN = '[ERROR] AUTH set error de login com usuário e senha',
    SET_AUTH_CRED = '[ERROR] AUTH set error de login com credenciais por url',
    // Credenciais
    SET_CRED_TOKEN = '[ERROR] CRED set error token api', // TODO revisar modulo de credenciais
    SET_CRED_TOKEN_MEMED = '[ERROR] CRED set error token memed',
    // Atendimento
    SET_ATEN_INICIALIZAR = '[ERROR] ATENDIMENTO set erro ao inicializar',
    SET_ATEN_INICIALIZAR_ESTRAT = '[ERROR] ATENDIMENTO set erro ao iniciarlizar estratificacao',
    SET_ATEN_FINALIZAR = '[ERROR] ATENDIMENTO set erro ao finalizar',

    SET_AGENDAMENTO = '[ERROR] AGENDAMENTO',
    SET_DOCUMENTO = '[ERROR] DOCUMENTO',
    // Beneficiario
    SET_BEN_GET = '[ERROR] BENEFICIARIO set get error',
    SET_BEN_GET_TAGS = '[ERROR] BENEFICIARIO set get tags error',
    SET_BEN_GET_FAMI = '[ERROR] BENEFICIARIO set get familia error',
    SET_BEN_ALER = '[ERROR] BENEFICIARIO set alergias error',
    SET_BEN_COND = '[ERROR] BENEFICIARIO set condicoes error',
    SET_BEN_MEDI = '[ERROR] BENEFICIARIO set medicamentos error',
    // Exames
    SET_EXAME_GET = '[ERROR] EXAME set get error', // TODO rever necessidade de três erros para isso
    SET_EXAME_POST = '[ERROR] EXAME set post error',
    SET_EXAME_PUT = '[ERROR] EXAME set put error',
    // Histórico
    SET_HIST_GET = '[ERROR] HISTORICO set get error',
    // Local
    SET_LOCAL_GET = '[ERROR] LOCAL set get error',
    SET_LOCAL_NOT_FOUND = '[ERROR] LOCAL set local not found',
    // Profissional
    SET_PROF_GET = '[ERROR] PROFISSIONAL set get error',
    // Referências
    SET_REFER_GET = '[ERROR] REFERENCIA set get error',
    SET_REFER_POST = '[ERROR] REFERENCIA set post error',
    SET_REFER_PUT = '[ERROR] REFERENCIA set put error'
  }
  // Auth
  export const setAuthLogin = createAction(Types.SET_AUTH_LOGIN, props<{ payload: PEPError }>())
  export const setAuthCred = createAction(Types.SET_AUTH_CRED, props<{ payload: PEPError }>())
  // Credenciais
  export const setCredToken = createAction(Types.SET_CRED_TOKEN, props<{ payload: PEPError }>())
  export const setCredTokenMemed = createAction(
    Types.SET_CRED_TOKEN_MEMED,
    props<{ payload: PEPError }>()
  )
  // Atendimento
  export const setAtenInializar = createAction(
    Types.SET_ATEN_INICIALIZAR,
    props<{ payload: PEPError }>()
  )
  export const setAtenInializarEstrat = createAction(
    Types.SET_ATEN_INICIALIZAR_ESTRAT,
    props<{ payload: PEPError }>()
  )
  export const setAtendFinalizar = createAction(
    Types.SET_ATEN_FINALIZAR,
    props<{ payload: PEPError }>()
  )

  export const setAgendamento = createAction(Types.SET_AGENDAMENTO, props<{ payload: PEPError }>())
  export const setDocumento = createAction(Types.SET_DOCUMENTO, props<{ payload: PEPError }>())
  // Beneficiario
  export const setBenGet = createAction(Types.SET_BEN_GET, props<{ payload: PEPError }>())
  export const setBenGetTags = createAction(Types.SET_BEN_GET_TAGS, props<{ payload: PEPError }>())
  export const setBenGetFami = createAction(Types.SET_BEN_GET_FAMI, props<{ payload: PEPError }>())
  export const setBenAler = createAction(Types.SET_BEN_ALER, props<{ payload: PEPError }>())
  export const setBenCond = createAction(Types.SET_BEN_COND, props<{ payload: PEPError }>())
  export const setBenMedi = createAction(Types.SET_BEN_MEDI, props<{ payload: PEPError }>())
  // Exames
  export const setExameGet = createAction(Types.SET_EXAME_GET, props<{ payload: PEPError }>())
  export const setExamePost = createAction(Types.SET_EXAME_POST, props<{ payload: PEPError }>())
  export const setExamePut = createAction(Types.SET_EXAME_PUT, props<{ payload: PEPError }>())
  // Histórico
  export const setHistGet = createAction(Types.SET_HIST_GET, props<{ payload: PEPError }>())
  // Local
  export const setLocalGet = createAction(Types.SET_LOCAL_GET, props<{ payload: PEPError }>())
  // Profissional
  export const setProfGet = createAction(Types.SET_PROF_GET, props<{ payload: PEPError }>())
  // Referencias
  export const SET_REFER_GET = createAction(Types.SET_REFER_GET, props<{ payload: PEPError }>())
  export const SET_REFER_POST = createAction(Types.SET_REFER_POST, props<{ payload: PEPError }>())
  export const SET_REFER_PUT = createAction(Types.SET_REFER_PUT, props<{ payload: PEPError }>())
}
