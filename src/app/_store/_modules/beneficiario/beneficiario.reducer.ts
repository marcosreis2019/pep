import { Action, createReducer, on } from '@ngrx/store'
import { BeneficiarioActions } from './beneficiario.action'
import { AlergiaState, BeneficiarioState, CondicaoState, MedicamentoState, TagList } from './beneficiario.state'

// tslint:disable-next-line: no-namespace
export namespace BeneficiarioReducer {
  const initialState = new BeneficiarioState()

  const _abstractSetItemList = (state, target, list) => ({
    ...state,
    [target]: { ...state[target], list: [].concat(list) }
  })
  const _abstractUpdateItemListMsg = (state, target, msgType, msgValue) => ({
    ...state,
    [target]: { ...state[target], [msgType]: msgValue }
  })

  const _setTags = (
    state: BeneficiarioState,
    lists: TagList
  ): BeneficiarioState => {
    return {
      ...state,
      tags: {
        auth: [].concat(lists.auth),
        admin: [].concat(lists.admin),
        health: [].concat(lists.health)
      }
    }
  }

  const _clearMessages = (state: BeneficiarioState) => {
    return {
      ...state,
      alergias: { ...new AlergiaState(), list: state.alergias.list },
      condicoes: { ...new CondicaoState(), list: state.condicoes.list },
      medicamentos: { ...new MedicamentoState(), list: state.medicamentos.list }
    }
  }

  const _alergiasReducer = createReducer(
    initialState,
    // Dados pessoais
    on(BeneficiarioActions.set, (state, action) => ({ ...state, dadosPessoais: action['payload'] })),
    on(BeneficiarioActions.setLoading, (state, action) => ({ ...state, loading: action['payload'] })),
    // Familia
    on(BeneficiarioActions.setFamilia, (state, action) => ({ ...state, familia: action['payload'] })),
    on(BeneficiarioActions.setErrorFamilia, (state, action) => ({ ...state, familiaError: action['payload'] })),

    // Tags
    on(BeneficiarioActions.setTags, (state, action) =>
      _setTags(state, action['payload'])
    ),
    on(BeneficiarioActions.setErrorTags, (state, action) => ({
      ...state,
      tagsError: action['payload']
    })),

    // Clear
    on(BeneficiarioActions.clearAllMsg, (state, action) =>
      _clearMessages(state)
    ),

    // Alergias
    on(BeneficiarioActions.setAlergia, (state, action) =>
      _abstractSetItemList(state, 'alergias', action['payload'])
    ),
    on(BeneficiarioActions.postSAlergia, (state, action) =>
      _abstractUpdateItemListMsg(state, 'alergias', 'postS', action['payload'])
    ),
    on(BeneficiarioActions.postFAlergia, (state, action) =>
      _abstractUpdateItemListMsg(state, 'alergias', 'postF', action['payload'])
    ),
    on(BeneficiarioActions.deleteSAlergia, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'alergias',
        'deleteS',
        action['payload']
      )
    ),
    on(BeneficiarioActions.deleteFAlergia, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'alergias',
        'deleteF',
        action['payload']
      )
    ),

    // Condições
    on(BeneficiarioActions.setCondicao, (state, action) =>
      _abstractSetItemList(state, 'condicoes', action['payload'])
    ),
    on(BeneficiarioActions.postSCondicao, (state, action) =>
      _abstractUpdateItemListMsg(state, 'condicoes', 'postS', action['payload'])
    ),
    on(BeneficiarioActions.postFCondicao, (state, action) =>
      _abstractUpdateItemListMsg(state, 'condicoes', 'postF', action['payload'])
    ),
    on(BeneficiarioActions.putSCondicao, (state, action) =>
      _abstractUpdateItemListMsg(state, 'condicoes', 'postS', action['payload'])
    ),
    on(BeneficiarioActions.putFCondicao, (state, action) =>
      _abstractUpdateItemListMsg(state, 'condicoes', 'postF', action['payload'])
    ),
    on(BeneficiarioActions.deleteSCondicao, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'condicoes',
        'deleteS',
        action['payload']
      )
    ),
    on(BeneficiarioActions.deleteFCondicao, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'condicoes',
        'deleteF',
        action['payload']
      )
    ),

    // Medicamentos
    on(BeneficiarioActions.setMedicamento, (state, action) =>
      _abstractSetItemList(state, 'medicamentos', action['payload'])
    ),
    on(BeneficiarioActions.postSMedicamento, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'medicamentos',
        'postS',
        action['payload']
      )
    ),
    on(BeneficiarioActions.postFMedicamento, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'medicamentos',
        'postF',
        action['payload']
      )
    ),
    on(BeneficiarioActions.deleteSMedicamento, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'medicamentos',
        'deleteS',
        action['payload']
      )
    ),
    on(BeneficiarioActions.deleteFMedicamento, (state, action) =>
      _abstractUpdateItemListMsg(
        state,
        'medicamentos',
        'deleteF',
        action['payload']
      )
    )
  )

  export function reducer(state, action: Action) {
    return _alergiasReducer(state, action)
  }
}
