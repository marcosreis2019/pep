import { createFeatureSelector, createSelector } from '@ngrx/store'
import { HistoricoState } from './historico.store'

export namespace HistoricoSelect {
  const historicoState = createFeatureSelector<HistoricoState>('historico')

  export const eventos = createSelector(historicoState, state => state.eventos.list)
  export const eventosError = createSelector(historicoState, state => state.eventos.error)
}
