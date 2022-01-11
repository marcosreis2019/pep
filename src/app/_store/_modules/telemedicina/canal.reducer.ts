import { createReducer, on, Action } from '@ngrx/store'
import { CanalActions } from './canal.actions'
import { CanalState } from './canal.state'
import * as fromCanalActions from './canal.actions'
import { state } from '@angular/animations'
import { Canal } from './canal.model'

export namespace CanalReducer {
  const initialState = { canal: undefined, error: undefined }

  const _setCanal  = (state: CanalState, action: Action): CanalState => ({ ...state, canal: action['payload'] })
  const _setCanalError = (state: CanalState, action: Action): CanalState => ({ ...state, error: action['payload'] })

  const _canalReduces = createReducer(initialState,
    on(CanalActions.setCanal, _setCanal),
    on(CanalActions.setErrorCanal, _setCanalError),
  )
  export function reducer(state: CanalState, action: Action) {
    return _canalReduces(state, action)
  }
}