import { LocalState } from './local.state'
import { createSelector, createFeatureSelector } from '@ngrx/store'

export namespace LocalSelect {
  const localState = createFeatureSelector<LocalState>('local')

  const _getLocal = (state: LocalState) => state.local
  const _getLocalId = (state: LocalState) => (state.local ? state.local.id : undefined)

  export const local = createSelector(localState, _getLocal)
  export const localId = createSelector(localState, _getLocalId)
}
