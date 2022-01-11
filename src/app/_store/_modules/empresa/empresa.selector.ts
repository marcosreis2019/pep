import { createFeatureSelector, createSelector } from '@ngrx/store'
import { EmpresaState } from './empresa.state'

export namespace EmpresaSelect {
  const EmpresaState = createFeatureSelector<EmpresaState>('empresa')
  export const nome = createSelector(EmpresaState, state => state.nome)
  export const url = createSelector(EmpresaState, state => state.url)
}
