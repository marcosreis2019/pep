import { createFeatureSelector, createSelector } from '@ngrx/store'
import { ErrorsStateModel } from './errors.state'

const errorState = createFeatureSelector<ErrorsStateModel>('errors')

// tslint:disable-next-line: no-namespace
export namespace ErrorsSelect {
  export const authLogin = createSelector(errorState, state => state.auth.login)
  export const authCred = createSelector(errorState, state => state.auth.cred)

  export const credToken = createSelector(errorState, state => state.cred.token)
  export const credTokenMemed = createSelector(errorState, state => state.cred.tokenMemed)

  export const atenInit = createSelector(errorState, state => state.atendimento.inicializar)
  export const atenInitEstrat = createSelector(
    errorState,
    state => state.atendimento.iniciarEstratificacao
  )
  export const atenEnd = createSelector(errorState, state => state.atendimento.finalizar)

  export const agendamento = createSelector(errorState, state => state.agendamento)
  export const documento = createSelector(errorState, state => state.documento)

  export const benNotFound = createSelector(errorState, state => state.beneficiario)
  export const benNotFoundTags = createSelector(errorState, state => state.tags)
  export const benNotFoundFami = createSelector(errorState, state => state.familia)
  export const benAler = createSelector(errorState, state => state.alergias)
  export const benCond = createSelector(errorState, state => state.condicoes)
  export const benMedi = createSelector(errorState, state => state.medicamentos)

  export const examNotFound = createSelector(errorState, state => state.exames.get)
  export const examPost = createSelector(errorState, state => state.exames.post)
  export const examPut = createSelector(errorState, state => state.exames.put)

  export const histNoutFound = createSelector(errorState, state => state.historico)
  export const locNoutFound = createSelector(errorState, state => state.local)
  export const proNoutFound = createSelector(errorState, state => state.profissional)

  export const latests = createSelector(errorState, state => state.lastErros)
}
