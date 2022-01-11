import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ReferenciasState } from './referencias.state'
import { PEPState } from '../../store.models'
import { ReferenciaState } from './referencia.state'

const referenciasState = createFeatureSelector<ReferenciasState>('referencias')
const referenciaState = createFeatureSelector<ReferenciaState>('referencia')
const pepState = (state: PEPState) => state

export namespace ReferenciasSelectors {
  const _getOffset = (state: ReferenciasState): number => (state.offset ? state.offset : 0)
  const _getFromInit = (state: ReferenciasState): boolean => state.fromInit

  export const referencias = createSelector(referenciasState, state => state.list)

  export const referencia = createSelector(referenciaState, state => state.referencia)

  export const getOffsetAndFromInitWithMPI = createSelector(pepState, state => ({
    mpi: state.beneficiario.dadosPessoais.mpi,
    offset: state.referencias.offset,
    fromInit: state.referencias.fromInit
  }))

  export const getOffset = createSelector(referenciasState, _getOffset)

  export const getFromInit = createSelector(referenciasState, _getFromInit)

  export const getReferencia = createSelector(referenciaState, state => state.referencia)

  export const loading = createSelector(referenciasState, state => state.loading)

  export const error = createSelector(referenciasState, state => state.error)

  export const success = createSelector(referenciasState, state => state.success)
}
