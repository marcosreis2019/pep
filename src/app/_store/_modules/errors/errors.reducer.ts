import { Action, createReducer, on } from '@ngrx/store'
import { ErrorsActions } from './errors.actions'
import { PEPError } from './errors.models'
import { ErrorsState, ErrorsStateModel } from './errors.state'

export namespace ErrorsReducer {
  const initialState: ErrorsStateModel = new ErrorsState()

  function addLast(error: PEPError, lasts: PEPError[]): PEPError[] {
    const n = [].concat(lasts)
    n.push(error)
    return n
  }

  const setAuthLogin = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    auth: { ...state.auth, login: action['payload'] }
  })
  const setAuthCred = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    auth: { ...state.auth, cred: action['payload'] }
  })

  const setCredToken = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    cred: { ...state.cred, token: action['payload'] }
  })
  const setCredTokenMemed = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    cred: { ...state.cred, tokenMemed: action['payload'] }
  })

  const setBen = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    beneficiario: action['payload']
  })
  const setBenTags = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    tags: action['payload']
  })
  const setBenFami = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    familia: action['payload']
  })
  const setBenAler = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    alergias: action['payload']
  })
  const setBenCond = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    condicoes: action['payload']
  })
  const setBenMedi = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    medicamentos: action['payload']
  })

  const setExamesGet = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    exames: { ...state.exames, get: action['payload'] }
  })
  const setExamesPost = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    exames: { ...state.exames, post: action['payload'] }
  })
  const setExamesPut = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    exames: { ...state.exames, put: action['payload'] }
  })

  const setHist = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    historico: action['payload']
  })
  const setLocal = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    local: action['payload']
  })
  const setPro = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    profissional: action['payload']
  })

  const setAtendFinalizar = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    atendimento: action['payload']
  })

  const setAgendamento = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    agendamento: action['payload']
  })

  const setDocumento = (state: ErrorsStateModel, action) => ({
    ...state,
    lastErros: addLast(action['payload'], state.lastErros),
    documento: action['payload']
  })

  const _errorsReducer = createReducer(
    initialState,
    on(ErrorsActions.setAtendFinalizar, setAtendFinalizar),
    on(ErrorsActions.setAgendamento, setAgendamento),
    on(ErrorsActions.setDocumento, setDocumento),
    on(ErrorsActions.setAuthLogin, setAuthLogin),
    on(ErrorsActions.setAuthCred, setAuthCred),
    on(ErrorsActions.setCredToken, setCredToken),
    on(ErrorsActions.setCredTokenMemed, setCredTokenMemed),
    on(ErrorsActions.setBenGet, setBen),
    on(ErrorsActions.setBenGetTags, setBenTags),
    on(ErrorsActions.setBenGetFami, setBenFami),
    on(ErrorsActions.setBenAler, setBenAler),
    on(ErrorsActions.setBenCond, setBenCond),
    on(ErrorsActions.setBenMedi, setBenMedi),
    on(ErrorsActions.setExameGet, setExamesGet),
    on(ErrorsActions.setExamePost, setExamesPost),
    on(ErrorsActions.setExamePut, setExamesPut),
    on(ErrorsActions.setHistGet, setHist),
    on(ErrorsActions.setLocalGet, setLocal),
    on(ErrorsActions.setProfGet, setPro)
  )

  export function reducer(state, action: Action) {
    return _errorsReducer(state, action)
  }
}
