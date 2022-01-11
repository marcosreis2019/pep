import { createReducer, on, Action } from '@ngrx/store'
import { AuthActions as Actions } from './auth.actions'

export namespace AuthReducer {
  export const initialState = { error: undefined }
  const _setError = (state, action) => ({...state, error: action['payload']})
  const _authReducer = createReducer( initialState, 
    on(Actions.setError, _setError)
  )

  export function reducer(state, action: Action) {
    return _authReducer(state, action)
  }

}