import { createFeatureSelector, createSelector } from '@ngrx/store'
import { PEPState } from '../../store.models'
import { AgendamentoState } from './agendamento.state'

export namespace AgendamentoSelect {
 
  const agendamentoState = createFeatureSelector<AgendamentoState>('agendamento')
  
  // Plano
  export const agendamento = createSelector(agendamentoState, state => state)

}
