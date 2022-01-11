import {createAction, props} from '@ngrx/store'

export interface AuthWithPass {
  user: string
  pass: string
}

export interface AuthWithCred {
  proMPI: string
  localCNES: string
}

export namespace AuthActions {
  export enum Types {
    GET_AUTH_FROM_PASS = '[AUTH] get auth from pass',
    GET_AUTH_FROM_CRED = '[AUTH] get auth from credentials',
    SET_ERROR          = '[AUTH] set error',
    RESET              = '[RESET]'
  }

  export const getAuthFromPass = createAction( Types.GET_AUTH_FROM_PASS, props<{payload: AuthWithPass}>() )
  export const getAuthFromCred = createAction( Types.GET_AUTH_FROM_CRED, props<{payload: AuthWithCred}>() )
  export const setError = createAction( Types.SET_ERROR, props<{payload: string}>() )
  export const reset = createAction( Types.RESET, props<{payload: string}>())
}
