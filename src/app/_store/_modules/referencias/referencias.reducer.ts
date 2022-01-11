import { Action, createReducer, on } from '@ngrx/store'

import { ReferenciasActions } from './referencias.actions'

import { ReferenciasState } from './referencias.state'

// tslint:disable-next-line: no-namespace
export namespace ReferenciasReducer {
  const initialStateReferencias = new ReferenciasState()

  // tslint:disable: variable-name
  const _setList = (state, action) => ({
    ...state,
    list: state.list.concat(action.payload)
  })
  const _setListInitialize = (state, action) => ({
    ...state,
    list: [].concat(action.payload)
  })
  const _setOffset = (state, action) => ({
    ...state,
    offset: action.payload
  })
  const _setFromInit = (state, action) => ({
    ...state,
    fromInit: action.payload
  })
  const _setLoading = (state, action) => ({ ...state, loading: action.payload })
  const _setError = (state, action) => ({ ...state, error: action.payload })
  const _setSuccess = (state, action) => ({ ...state, success: action.payload })

  const _referenciasReducer = createReducer(
    initialStateReferencias,
    on(ReferenciasActions.setList, _setList),
    on(ReferenciasActions.setListInitialize, _setListInitialize),
    on(ReferenciasActions.setLoading, _setLoading),
    on(ReferenciasActions.setError, _setError),
    on(ReferenciasActions.setSuccess, _setSuccess),
    on(ReferenciasActions.setOffset, _setOffset),
    on(ReferenciasActions.setFromInit, _setFromInit)
  )

  export function reducer(state, action: Action) {
    return _referenciasReducer(state, action)
  }
}
