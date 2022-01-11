import { createFeatureSelector, createSelector } from '@ngrx/store'
import { BeneficiarioState } from './beneficiario.state'

export namespace BeneficiarioSelect {
  const beneficiarioState = createFeatureSelector<BeneficiarioState>(
    'beneficiario'
  )

  const _getMPI = (state: BeneficiarioState): string =>
    state.dadosPessoais ? state.dadosPessoais.mpi : undefined
  const _getNome = (state: BeneficiarioState): string =>
    state.dadosPessoais ? state.dadosPessoais.nomeCompleto : undefined
  const _getAlergias = (state: BeneficiarioState) => state.alergias.list // TODO modificar modesl para modulo do beneficiariow
  const _getCondicoes = (state: BeneficiarioState) => state.condicoes.list
  const _getMedicamentos = (state: BeneficiarioState) => state.medicamentos.list
  const _getFamilia = (state: BeneficiarioState) => state.familia
  const _getFamiliaError = (state: BeneficiarioState) => state.familiaError
  const _getTags = (state: BeneficiarioState) => state.tags
  const _getTagsError = (state: BeneficiarioState) => state.tagsError
  const _getBeneficiario = (state: BeneficiarioState) => state.dadosPessoais

  const _abstractGetMsg = (
    state: BeneficiarioState,
    target: string,
    msgType: string
  ) => state[target][msgType]
  // geral
  export const mpi = createSelector(beneficiarioState, _getMPI)
  export const nome = createSelector(beneficiarioState, _getNome)
  export const familia = createSelector(beneficiarioState, _getFamilia)
  export const familiaError = createSelector(
    beneficiarioState,
    _getFamiliaError
  )
  export const tags = createSelector(beneficiarioState, _getTags)
  export const tagsError = createSelector(beneficiarioState, _getTagsError)
  export const dadosPessoais = createSelector(
    beneficiarioState,
    _getBeneficiario
  )
  export const loading = createSelector(
    beneficiarioState,
    state => state.loading
  )
  // alergias
  export const alergias = createSelector(beneficiarioState, _getAlergias)
  export const alergiasPostS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'alergias', 'postS')
  )
  export const alergiasPostF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'alergias', 'postF')
  )
  export const alergiasDeleteS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'alergias', 'deleteS')
  )
  export const alergiasDeleteF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'alergias', 'deleteF')
  )
  // condicoes
  export const condicoes = createSelector(beneficiarioState, _getCondicoes)
  export const condicoesPostS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'postS')
  )
  export const condicoesPostF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'postF')
  )
  export const condicoesPutS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'putS')
  )
  export const condicoesPutF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'putF')
  )
  export const condicoesDeleteS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'deleteS')
  )
  export const condicoesDeleteF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'condicoes', 'deleteF')
  )
  // medicamentos
  export const medicamentos = createSelector(
    beneficiarioState,
    _getMedicamentos
  )
  export const medicamentosPostS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'medicamentos', 'postS')
  )
  export const medicamentosPostF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'medicamentos', 'postF')
  )
  export const medicamentosDeleteS = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'medicamentos', 'deleteS')
  )
  export const medicamentosDeleteF = createSelector(beneficiarioState, state =>
    _abstractGetMsg(state, 'medicamentos', 'deleteF')
  )
}
