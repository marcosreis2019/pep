import { Action, createReducer, on } from '@ngrx/store'
import { ReferenciaState } from './referencia.state'

import { ReferenciasActions } from './referencias.actions'

// tslint:disable-next-line: no-namespace
export namespace ReferenciaReducer {
  const initialStateReferencia = new ReferenciaState()

  const _setError = (state, action) => ({ ...state, error: action.payload })

  const _setReferencia = (state, action) => ({
    ...state.referencia,
    referencia: action['payload']
  })

  const _referenciaReducer = createReducer(
    initialStateReferencia,
    on(ReferenciasActions.setError, _setError),
    on(ReferenciasActions.setReferencia, _setReferencia)
  )

  export function reducer(state, action: Action) {
    return _referenciaReducer(state, action)
  }
}
