import { Action, createReducer, on } from '@ngrx/store'
import { AgendamentoActions as Actions } from './agendamento.action'
import { AgendamentoState } from './agendamento.state'

export namespace AgendamentoReducer {

  const _setAgendamento = (state: AgendamentoState, action: Action) => ({
    ...state,
    ...action['payload']
  })

  const initialState = new AgendamentoState()
  
  const _agendamentoReduces = createReducer(
    initialState,
    on(Actions.setAgendamento, _setAgendamento)
  )

  export function reducer(state, action: Action) {
    return _agendamentoReduces(state, action)
  }
}
