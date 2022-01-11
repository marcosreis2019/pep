import { createAction, props } from '@ngrx/store'

import { ExamesModels as Models } from './exames.models'

// tslint:disable-next-line: no-namespace
export namespace ExamesActions {
  export enum Types {
    GET_BY_ID = '[EXAME] get by id',
    GET_ALL = '[EXAME] get all',
    ERROR = '[EXAME] error',
    SUCCESS = '[EXAME] success',
    ADD = '[EXAME] add',
    REMOVE = '[EXAME] remove',
    SET = '[EXAME] set',
    SET_LOADING = '[EXAME] set loading',
    POST = '[EXAME] post',
    POST_S = '[EXAME] post s',
    POST_F = '[EXAME] post f',
    PUT = '[EXAME] put',
    PUT_S = '[EXAME] put s',
    PUT_F = '[EXAME] put f',
    UPDATE = '[EXAME] update',
    TOGGLE_EDITING_RESULTS = '[EXAME] toggle editing results'
  }

  export const getById = createAction(Types.GET_BY_ID, props<{ payload: string }>())
  export const getAll = createAction(Types.GET_ALL, props<{ payload: string }>())

  export const add = createAction(Types.ADD, props<{ payload: Models.Exame }>())

  export const remove = createAction(Types.REMOVE, props<{ payload: Models.Exame }>())

  export const set = createAction(Types.SET, props<{ payload: Models.Exame[] }>())
  export const setLoading = createAction(Types.SET_LOADING, props<{ payload: boolean }>())
  export const setError = createAction(Types.ERROR, props<{ payload: string }>())
  export const setSuccess = createAction(Types.SUCCESS, props<{ payload: string }>())

  export const update = createAction(
    Types.UPDATE,
    props<{ payload: { exame: Models.Exame; index: number } }>()
  )

  export const post = createAction(Types.POST, props<{ payload: { exame: Models.Exame, mpi: string, ref: any } }>())
  export const postS = createAction(Types.POST_S, props<{ payload: string }>())
  export const postF = createAction(Types.POST_F, props<{ payload: string }>())

  export const put = createAction(
    Types.PUT,
    props<{ payload: { exame: Models.Exame; index: number, mpi: string } }>()
  )
  export const putS = createAction(Types.PUT_S, props<{ payload: string }>())
  export const putF = createAction(Types.PUT_F, props<{ payload: string }>())

  export const toggleEditingResults = createAction(
    Types.TOGGLE_EDITING_RESULTS,
    props<{ payload: boolean }>()
  )
}
