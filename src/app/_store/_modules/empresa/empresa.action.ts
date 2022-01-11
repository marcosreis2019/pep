import { createAction, props } from '@ngrx/store'

// tslint:disable-next-line: no-namespace
export namespace EmpresaActions {
  export enum Types {
    SET_URL = '[EMPRESA] set URL',
    SET_NOME = '[EMPRESA] set Nome'
  }

  export const setUrl = createAction(Types.SET_URL, props<{ payload: string }>())
  export const setNome = createAction(Types.SET_NOME, props<{ payload: string }>())
}
