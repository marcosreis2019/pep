import { createAction } from '@ngrx/store';

export namespace ResetsActions {
  enum Types {
    ALL = '[RESET] all data on app'
  }

  export const all = createAction(Types.ALL)
}