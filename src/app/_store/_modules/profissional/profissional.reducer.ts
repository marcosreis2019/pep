import { createReducer, on, Action } from '@ngrx/store'
import { ProfissionalActions } from './profissional.actions'
import { ProfissionalState } from './profissional.state'

export namespace ProfissionalReducer {
  const initialState = {pro: undefined, error: undefined}
  
  const _setPro = (state: ProfissionalState, action: Action): ProfissionalState => ({ ...state, pro: action['payload'] })
  const _setProError = (state: ProfissionalState, action: Action): ProfissionalState => 
  ({ ...state, error: action['payload'] })



  const _deleteProfissional = (state, action: Action) => ({
     ...state, pro: { undefined} 
     
  })

  const _profissionalReduces = createReducer(initialState,
    on(ProfissionalActions.setProfissional, _setPro),
    on(ProfissionalActions.setErrorProfissional, _setProError),
    on(ProfissionalActions.deleteProfissional, _deleteProfissional),
  )
  export function reducer(state: ProfissionalState, action: Action) {
    return _profissionalReduces(state, action)
  } 
}
