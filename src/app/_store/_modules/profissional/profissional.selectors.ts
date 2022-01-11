import { createSelector, createFeatureSelector } from '@ngrx/store'
import { ProfissionalState } from './profissional.state'

export namespace ProfissionalSelect {
  const proState = createFeatureSelector<ProfissionalState>('profissional')

  const _getProfissional = (state: ProfissionalState) => state.pro
  const _getProfissionalNome = (state: ProfissionalState) => state.pro.pessoa.nome_completo

  // Profissional
  export const profissional = createSelector(proState, _getProfissional)
  export const profissionalNome = createSelector(proState, _getProfissionalNome)
}
