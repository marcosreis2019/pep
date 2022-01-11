import { createAction, props, Action } from '@ngrx/store'
import { Canal } from './canal.model'

export namespace CanalActions {
  enum Types {
    GET_CANAL         = '[CANAL] get local',
    SET_CANAL         = '[CANAL] set local',
    FINISH         = '[CANAL] finish',
    ERROR_CANAL       = '[CANAL] error local',
  }
  
  export const getCanal       = createAction(Types.GET_CANAL, props<{ payload  : Canal }>())
  export const setCanal       = createAction(Types.SET_CANAL, props<{ payload  : Canal }>())
  export const setErrorCanal  = createAction(Types.ERROR_CANAL, props<{ payload: string }>())
  export const finishCanal = createAction(Types.FINISH)
}