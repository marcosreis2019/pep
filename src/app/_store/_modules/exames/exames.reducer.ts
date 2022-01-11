import { Action, createReducer, on } from '@ngrx/store'

import { ExamesActions } from './exames.actions'

import { ExamesState } from './exames.state'

export namespace ExamesReducer {
  const initialState = new ExamesState()

  const _add = (state, action: Action) => ({
    ...state,
    list: state.list ? state.list.concat(action['payload']) : [].concat(action['payload'])
  })

  const _remove = (state, action: Action) => ({
    ...state,
    list: state.list.filter(item => {
      if (item !== action['payload']) {
        return item
      }
    })
  })

  const _set = (state, action: Action) => ({
    ...state,
    list: [].concat(action['payload'])
  })

  const _setLoading = (state, action) => ({ ...state, loading: action.payload })
  const _setError = (state, action) => ({ ...state, error: action.payload })
  const _setSuccess = (state, action) => ({ ...state, success: action.payload })

  const _setIsEditingResults = (state, action) => ({ ...state, isEditingResults: action.payload })

  const _update = (state, action: Action) => {
    // captura a lista atual de exames do state
    const lista = [].concat(...state.list)

    // Como a lista é um objeto de objetos, ao copiar com Spread Operator, o pai se torna mutável, mas as propriedades que tambem sao objetos ainda são referencias a objetos imutáveis.
    // Por isso o motivo de copiar o item específico mais abaixo para poder modificá-lo.

    const index = action['payload']['index']

    // cria uma copia do exame atual do state
    let exame = { ...lista[index] }

    exame = { ...action['payload']['exame'] }
    // exame['observacoes'] = action['payload']['exame']['observacoes']
    exame['resultados'] = { ...action['payload']['exame']['resultados'] }

    // atualiza o exame ja existente na lista pelo objeto atualizado
    lista[index] = exame

    return { ...state, list: [].concat(lista) }
  }

  const _examesReducer = createReducer(
    initialState,
    on(ExamesActions.add, _add),
    on(ExamesActions.remove, _remove),
    on(ExamesActions.set, _set),
    on(ExamesActions.setLoading, _setLoading),
    on(ExamesActions.setError, _setError),
    on(ExamesActions.setSuccess, _setSuccess),
    on(ExamesActions.update, _update),
    on(ExamesActions.toggleEditingResults, _setIsEditingResults)
  )

  export function reducer(state, action: Action) {
    return _examesReducer(state, action)
  }
}
