import { Action, createReducer, on } from '@ngrx/store'
import { EmpresaActions as Actions } from './empresa.action'
import { EmpresaState, EmpresaStateClass } from './empresa.state'

export namespace EmpresaReducer {
  const initialState: EmpresaState = new EmpresaStateClass()

  const _empresaReducer = createReducer(
    initialState,
    on(Actions.setNome, (state, action) => ({ ...state, nome: action['payload'] })),
    on(Actions.setUrl, (state, action) => ({ ...state, url: action['payload'] }))
  )

  export function reducer(state, action: Action) {
    return _empresaReducer(state, action)
  }
}
