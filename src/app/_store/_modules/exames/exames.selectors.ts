import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ExamesState } from './exames.state'

const exameState = createFeatureSelector<ExamesState>('exames')

export namespace ExamesSelectors {
  export const exames = createSelector(exameState, state => state.list)

  export const loading = createSelector(exameState, state => state.loading)

  export const error = createSelector(exameState, state => state.error)

  export const success = createSelector(exameState, state => state.success)

  export const isEditingResults = createSelector(exameState, state => state.isEditingResults)
}
