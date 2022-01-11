import { createReducer, on, Action } from '@ngrx/store'
import { LocalState } from './local.state'
import { LocalActions } from './local.actions'

export namespace LocalReducer {
  const initialState = { local: undefined, error: undefined }

  const _setLocal = (state: LocalState, action: Action): LocalState => ({ ...state, local: action['payload'] })
  const _setLocalError = (state: LocalState, action: Action): LocalState => ({ ...state, error: action['payload'] })

  const _profissionalReduces = createReducer(initialState,
    on(LocalActions.setLocal, _setLocal),
    on(LocalActions.setErrorLocal, _setLocalError),
  )
  export function reducer(state: LocalState, action: Action) {
    return _profissionalReduces(state, action)
  }
}
