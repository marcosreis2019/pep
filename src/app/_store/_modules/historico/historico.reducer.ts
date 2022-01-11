import { Action, createReducer, on } from '@ngrx/store'

import { HistoricoActions } from './historico.action'
import { HistoricoState } from './historico.store'

export namespace HistoricoReducer {
  const iniciatState = new HistoricoState()

  const _set      = (state, action: Action): HistoricoState => ({...state, eventos: { ...state.eventos, list: [].concat(action['payload']) }})
  const _setError = (state, action: Action): HistoricoState => ({...state, eventos: { ...state.eventos, error: action['payload']}})

  export const reducer = createReducer(iniciatState, 
    on(HistoricoActions.setEventosError, _setError),
    on(HistoricoActions.setEventos, _set)
  )
}
