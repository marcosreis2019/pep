import { createAction, props } from '@ngrx/store'

import { ReferenciasModels as Models } from './referencias.models'

export namespace ReferenciasActions {
  export enum Types {
    GET_BY_ID = '[REFERENCIA] get by id',
    GET_ALL_REFERENCIA = '[REFERENCIA] get all',
    GET_LIST_INITIALIZE = '[REFERENCIA] get list initialize',
    ERROR = '[REFERENCIA] error',
    SUCCESS = '[REFERENCIA] success',
    SET_LIST = '[REFERENCIA] set list',
    SET_LIST_INITIALIZE = '[REFERENCIA] set',
    SET_OFFSET = '[REFERENCIA] set offset',
    SET_FROM_INIT = '[REFERENCIA] set fromInit',
    SET_LOADING = '[REFERENCIA] set loading',
    GET_REFERENCIA = '[REFERENCIA] get referencia',
    POST = '[REFERENCIA] post',
    POST_S = '[REFERENCIA] post s',
    POST_F = '[REFERENCIA] post f',
    PUT = '[REFERENCIA] put',
    PUT_S = '[REFERENCIA] put s',
    PUT_F = '[REFERENCIA] put f',
    SET_REFERENCIA = '[REFERENCIA] set last posted'
  }

  export const setReferencia = createAction(Types.SET_REFERENCIA, props<{ payload: Models.Referencia }>())

  export const getReferencia = createAction(Types.GET_REFERENCIA)

  export const getById = createAction(Types.GET_BY_ID, props<{ payload: string }>())

  export const getAll = createAction(
    Types.GET_ALL_REFERENCIA,
    props<{ payload: Models.ReferenciaHistoricoFiltro }>()
  )
  export const getListInitialize = createAction(Types.GET_LIST_INITIALIZE)

  export const setList = createAction(Types.SET_LIST, props<{ payload: Models.Referencia[] }>())
  export const setListInitialize = createAction(
    Types.SET_LIST_INITIALIZE,
    props<{ payload: Models.Referencia[] }>()
  )

  export const setOffset = createAction(Types.SET_OFFSET, props<{ payload: number }>())
  export const setFromInit = createAction(Types.SET_FROM_INIT, props<{ payload: boolean }>())

  export const setLoading = createAction(Types.SET_LOADING, props<{ payload: boolean }>())
  export const setError = createAction(Types.ERROR, props<{ payload: string }>())
  export const setSuccess = createAction(Types.SUCCESS, props<{ payload: string }>())

  export const post = createAction(Types.POST, props<{ payload: {ref: Models.ReferenciaPost, mpi: string} }>())
  export const postS = createAction(Types.POST_S, props<{ payload: string }>())
  export const postF = createAction(Types.POST_F, props<{ payload: string }>())

  export const put = createAction(
    Types.PUT,
    props<{ payload: { ref: Models.Referencia; xref: Models.ReferenciaPut } }>()
  )
  export const putS = createAction(Types.PUT_S, props<{ payload: string }>())
  export const putF = createAction(Types.PUT_F, props<{ payload: string }>())
}
