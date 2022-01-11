import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CredenciaisState } from './credenciais.state'

export namespace CredenciaisSelect {
  const credenciaisState = createFeatureSelector<CredenciaisState>('credenciais')
  export const resToken = createSelector(credenciaisState, state => state.resToken)
  export const pepApiToken = createSelector(credenciaisState, state => state.pepApiToken)
  export const qdsToken = createSelector(credenciaisState, state => state.qdsToken)
  export const canalApi = createSelector(credenciaisState, state => state.canalApi)
  export const canalToken = createSelector(credenciaisState, state => state.canalToken)
  export const clicToken = createSelector(credenciaisState, state => state.clicToken)
  export const clicApi = createSelector(credenciaisState, state => state.clicApi)
  export const memedToken = createSelector(credenciaisState, state => state.memedToken)
  export const memedApi = createSelector(credenciaisState, state => state.memedApi)
  export const memedScript = createSelector(credenciaisState, state => state.memedScript)
  export const telemedicina = createSelector(credenciaisState, state => state.telemedicina)
  export const classificacaoPadrao = createSelector(
    credenciaisState,
    state => state.classificacaoPadrao
  )
  export const tiposervicoPadrao = createSelector(
    credenciaisState,
    state => state.tiposervicoPadrao
  )
}
