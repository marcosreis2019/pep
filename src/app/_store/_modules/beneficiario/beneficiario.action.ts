import { createAction, props } from '@ngrx/store'

import { BeneficiarioModels as Models } from './beneficiario.model'
import { TagList } from './beneficiario.state'

export namespace BeneficiarioActions {
  export enum Types {
    // RESET GERAL
    CLEAR_STATE = '[BENEFICIARIO] clear state',

    // Dados pessoais
    CHECK = '[BENEFICIARIO] check',
    GET = '[BENEFICIARIO] get',
    SET = '[BENEFICIARIO] set',
    SET_NOME = '[BENEFICIARIO] set nome',
    SET_LOADING = '[BENEFICIARIO] set loading',
    GET_MPI = '[BENEFICIARIO] get mpi',

    // Familia
    GET_FAMILIA = '[BENEFICIARIO] get familia',
    SET_FAMILIA = '[BENEFICIARIO] set familia',
    ERROR_FAMILIA = '[BENEFICIARIO] error familia',

    // Tags
    GET_TAGS = '[BENEFICIARIO] get tags',
    SET_TAGS = '[BENEFICIARIO] set tags',
    ERROR_TAGS = '[BENEFICIARIO] error tags',

    // CLEARS
    CLEAR_ALL = '[BENEFICIARIO] clear all',
    CLEAR_ALL_MESSAGES = '[BENEFICIARIO] clear all messages',

    // Alergias
    GET_ALL_ALERGIA = '[ALERGIA] get all',
    SET_ALERGIA = '[ALERGIA] set',
    POST_ALERGIA = '[ALERGIA] post',
    POST_S_ALERGIA = '[ALERGIA] post success',
    POST_F_ALERGIA = '[ALERGIA] post fail',
    DELETE_ALERGIA = '[ALERGIA] delete',
    DELETE_S_ALERGIA = '[ALERGIA] delete success',
    DELETE_F_ALERGIA = '[ALERGIA] delete fail',

    // Medicamentos
    GET_ALL_MEDICAMENTO = '[MEDICAMENTO] get all',
    SET_MEDICAMENTO = '[MEDICAMENTO] set',
    POST_MEDICAMENTO = '[MEDICAMENTO] post',
    POST_S_MEDICAMENTO = '[MEDICAMENTO] post success',
    POST_F_MEDICAMENTO = '[MEDICAMENTO] post fail',
    PUT_MEDICAMENTO = '[MEDICAMENTO] put medicamento',
    PUT_S_MEDICAMENTO = '[MEDICAMENTO] put success',
    PUT_F_MEDICAMENTO = '[MEDICAMENTO] put fail',
    DELETE_MEDICAMENTO = '[MEDICAMENTO] delete',
    DELETE_S_MEDICAMENTO = '[MEDICAMENTO] delete success',
    DELETE_F_MEDICAMENTO = '[MEDICAMENTO] delete fail',

    // Condições
    GET_ALL_CONDICAO = '[CONDICAO] get all',
    SET_CONDICAO = '[CONDICAO] set',
    POST_CONDICAO = '[CONDICAO] post',
    POST_S_CONDICAO = '[CONDICAO] post success', // TODO criar um modulo de mensagens para estas situações
    POST_F_CONDICAO = '[CONDICAO] post fail',
    PUT_CONDICAO = '[CONDICAO] put condicoes',
    PUT_S_CONDICAO = '[CONDICAO] put success',
    PUT_F_CONDICAO = '[CONDICAO] put fail',
    DELETE_CONDICAO = '[CONDICAO] delete',
    DELETE_S_CONDICAO = '[CONDICAO] delete success',
    DELETE_F_CONDICAO = '[CONDICAO] delete fail'
  }

  // RESET GERAL
  export const clearState = createAction(Types.CLEAR_STATE)

  // LOADING
  export const setLoading = createAction(
    Types.SET_LOADING,
    props<{ payload: boolean }>()
  )

  // Dados Pessoais
  export const set = createAction(
    Types.SET,
    props<{ payload: Models.DadosPessoais }>()
  )
  export const setNome = createAction(
    Types.SET_NOME,
    props<{ payload: string }>()
  )
  export const get = createAction(Types.GET, props<{ payload: string }>())

  // Familia
  export const getFamilia = createAction(
    Types.GET_FAMILIA,
    props<{ payload?: string }>()
  )
  export const setFamilia = createAction(
    Types.SET_FAMILIA,
    props<{ payload }>()
  )
  export const setErrorFamilia = createAction(
    Types.ERROR_FAMILIA,
    props<{ payload: string }>()
  )

  // Tags
  export const getTags = createAction(
    Types.GET_TAGS,
    props<{ payload?: string }>()
  )
  export const setTags = createAction(
    Types.SET_TAGS,
    props<{ payload: TagList }>()
  )
  export const setErrorTags = createAction(
    Types.ERROR_TAGS,
    props<{ payload: string }>()
  )

  // Clear
  export const clearAll = createAction(Types.CLEAR_ALL)
  export const clearAllMsg = createAction(Types.CLEAR_ALL_MESSAGES)

  // Alergias
  export const getAllAlergia = createAction(Types.GET_ALL_ALERGIA,
    props<{ payload: string }>())
  export const setAlergia = createAction(
    Types.SET_ALERGIA,
    props<{ payload: Models.Alergia[] }>()
  )
  export const postAlergia = createAction(
    Types.POST_ALERGIA,
    props<{ payload: { mpi: String, data: Models.AlergiaPost }}>()
  )
  export const postSAlergia = createAction(
    Types.POST_S_ALERGIA,
    props<{ payload: string }>()
  )
  export const postFAlergia = createAction(
    Types.POST_F_ALERGIA,
    props<{ payload: string }>()
  )
  export const deleteAlergia = createAction(
    Types.DELETE_ALERGIA,
    props<{ payload: {data: Models.Alergia, mpi: string} }>()
  )
  export const deleteSAlergia = createAction(
    Types.DELETE_S_ALERGIA,
    props<{ payload: string }>()
  )
  export const deleteFAlergia = createAction(
    Types.DELETE_F_ALERGIA,
    props<{ payload: string }>()
  )

  // Medicamentos
  export const getAllMedicamento = createAction(Types.GET_ALL_MEDICAMENTO,
    props<{ payload: string }>())
  export const setMedicamento = createAction(
    Types.SET_MEDICAMENTO,
    props<{ payload: Models.Medicamento[] }>()
  )
  // POST Medicamento
  export const postMedicamento = createAction(
    Types.POST_MEDICAMENTO,
    props<{ payload: { mpi: String, data: Models.MedicamentoPost }}>()
  )
  export const postSMedicamento = createAction(
    Types.POST_S_MEDICAMENTO,
    props<{ payload: string }>()
  )
  export const postFMedicamento = createAction(
    Types.POST_F_MEDICAMENTO,
    props<{ payload: string }>()
  )
  // PUT Medicamento
  export const putMedicamento = createAction(
    Types.PUT_MEDICAMENTO,
    props<{ payload: { mpi: String, data: Models.Medicamento }}>()
  )
  export const putSMedicamento = createAction(
    Types.PUT_S_MEDICAMENTO,
    props<{ payload: string }>()
  )
  export const putFMedicamento = createAction(
    Types.PUT_F_MEDICAMENTO,
    props<{ payload: string }>()
  )

  // DELETE Medicamento
  export const deleteMedicamento = createAction(
    Types.DELETE_MEDICAMENTO,
    props<{ payload: {data: Models.Medicamento, mpi: string} }>()
  )
  export const deleteSMedicamento = createAction(
    Types.DELETE_S_MEDICAMENTO,
    props<{ payload: string }>()
  )
  export const deleteFMedicamento = createAction(
    Types.DELETE_F_MEDICAMENTO,
    props<{ payload: string }>()
  )

  // Condições
  export const getAllCondicao = createAction(
    Types.GET_ALL_CONDICAO,
    props<{ payload: string }>()
  )
  export const setCondicao = createAction(
    Types.SET_CONDICAO,
    props<{ payload: Models.Condicao[] }>()
  )
  export const postCondicao = createAction(
    Types.POST_CONDICAO,
    props<{ payload: { mpi: String, data: Models.CondicaoPost }}>()
  )
  export const postSCondicao = createAction(
    Types.POST_S_CONDICAO,
    props<{ payload: string }>()
  )
  export const postFCondicao = createAction(
    Types.POST_F_CONDICAO,
    props<{ payload: string }>()
  )
  export const putCondicao = createAction(
    Types.PUT_CONDICAO,
    props<{ payload: { data: Models.Condicao, mpi: String  }}>()
  )
  export const putSCondicao = createAction(
    Types.PUT_S_CONDICAO,
    props<{ payload: string }>()
  )
  export const putFCondicao = createAction(
    Types.PUT_F_CONDICAO,
    props<{ payload: string }>()
  )
  export const deleteCondicao = createAction(
    Types.DELETE_CONDICAO,
    props<{ payload: {data: Models.Condicao, mpi: string} }>()
  )
  export const deleteSCondicao = createAction(
    Types.DELETE_S_CONDICAO,
    props<{ payload: string }>()
  )
  export const deleteFCondicao = createAction(
    Types.DELETE_F_CONDICAO,
    props<{ payload: string }>()
  )
}
