import { PEPState } from '../../store.models'
import { Action, on, createReducer } from '@ngrx/store'
import { ResetsActions } from './resets.actions'

export namespace ResetsReducer {
  const initialState: PEPState = {
    beneficiario: {
      dadosPessoais: undefined,
      familia: undefined,
      familiaError: undefined, // TODO remove
      condicoes: undefined, // TODO refactor
      alergias: undefined, // TODO refactor
      medicamentos: undefined, // TODO refactor
      tags: undefined,
      tagsError: undefined,
      loading: false
    },
    credenciais: {
      resToken: '',
      pepApiToken: '',
      qdsToken: '',
      canalApi: '',
      canalToken: '',
      clicApi: '',
      clicToken: '',
      memedToken: '',
      memedApi: '',
      memedScript: '',
      telemedicina: '',
      classificacaoPadrao: {
        descricao: '',
        id: 0
      },
      tiposervicoPadrao: {
        descricao: '',
        id: 0
      }
    },
    empresa: {
      nome: '',
      url: ''
    },
    referencia: undefined,
    atendimento: undefined,
    exames: undefined,
    profissional: undefined,
    local: undefined,
    canal: undefined,
    auth: undefined,
    errors: undefined
  }

  const resetAll = (state, action) => {
    state = undefined
    return {} as PEPState
  }
  const resetReducer = createReducer(initialState, on(ResetsActions.all, resetAll))

  export function reducer(state: PEPState, action: Action) {
    return resetReducer
  }
}
