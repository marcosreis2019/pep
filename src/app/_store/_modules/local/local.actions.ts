import { createAction, props } from '@ngrx/store'
import { LocalAtendimentoModels } from './local.model'

export namespace LocalActions {
  enum Types {
    GET_LOCAL = '[ATENDIMENTO] get local',
    GET_LOCAL_BY_CNES = '[ATENDIMENTO] get local by cnes',
    SET_LOCAL = '[ATENDIMENTO] set local',
    ERROR_LOCAL = '[ATENDIMENTO] error local'
  }

  export const getLocal = createAction(Types.GET_LOCAL, props<{ payload: number }>())
  export const getLocalByCNES = createAction(Types.GET_LOCAL_BY_CNES, props<{ payload: string }>())
  export const setLocal = createAction(
    Types.SET_LOCAL,
    props<{ payload: LocalAtendimentoModels.LocalAtendimento }>()
  )
  export const setErrorLocal = createAction(Types.ERROR_LOCAL, props<{ payload: string }>())
}
