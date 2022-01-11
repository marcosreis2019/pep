import { Action, createReducer, on } from '@ngrx/store'
import { CredenciaisActions as Actions } from './credenciais.action'
import { CredenciaisState, CredenciaisStateClass } from './credenciais.state'

export namespace CredenciaisReducer {
  const initialState: CredenciaisState = new CredenciaisStateClass()

  const _credenciaisReducer = createReducer(
    initialState,
    on(Actions.setResToken, (state, action) => ({ ...state, resToken: action['payload'] })),
    on(Actions.setPepApiToken, (state, action) => ({ ...state, pepApiToken: action['payload'] })),
    on(Actions.setQdsToken, (state, action) => ({ ...state, qdsToken: action['payload'] })),
    on(Actions.setCanalApi, (state, action) => ({ ...state, canalApi: action['payload'] })),
    on(Actions.setCanalToken, (state, action) => ({ ...state, canalToken: action['payload'] })),
    on(Actions.setClicApi, (state, action) => ({ ...state, clicApi: action['payload'] })),
    on(Actions.setClicToken, (state, action) => ({ ...state, clicToken: action['payload'] })),
    on(Actions.setMemedToken, (state, action) => ({ ...state, memedToken: action['payload'] })),
    on(Actions.setMemedApi, (state, action) => ({ ...state, memedApi: action['payload'] })),
    on(Actions.setMemedScript, (state, action) => ({ ...state, memedScript: action['payload'] })),
    on(Actions.setTelemedicina, (state, action) => ({ ...state, telemedicina: action['payload'] })),
    on(Actions.setClassificacaoPadrao, (state, action) => ({
      ...state,
      classificacaoPadrao: action['payload']
    })),
    on(Actions.setTipoServicoPadrao, (state, action) => ({
      ...state,
      tiposervicoPadrao: action['payload']
    }))
  )

  export function reducer(state, action: Action) {
    return _credenciaisReducer(state, action)
  }
}
