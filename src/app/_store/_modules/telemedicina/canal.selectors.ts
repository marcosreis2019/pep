import { createSelector, createFeatureSelector } from '@ngrx/store'
import { CanalState } from './canal.state'

export namespace CanalSelect {
  const canalState = createFeatureSelector<CanalState>('canal')

  export const canal = createSelector(canalState, (state) => state.canal)
  export const canalToken = createSelector(canalState, state => state.canal ? state.canal.token : "")
}