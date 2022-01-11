import { createAction, props } from '@ngrx/store'
import { HistoricoModels } from './historico.model'

export namespace HistoricoActions {
  enum Types {
    GET_EVENTOS       = '[HISTORICO] get eventos',
    SET_EVENTOS       = '[HISTORICO] set eventos',
    SET_EVENTOS_ERROR = '[HISTORICO] set eventos error',
  }

  export const get             = createAction(Types.GET_EVENTOS, props<{ payload: { filters?: HistoricoModels.Filters, mpi: string }}>()) // TODO adicionar model de filtros
  export const setEventos      = createAction(Types.SET_EVENTOS, props<{ payload  : HistoricoModels.TimeLineItem[] }>())
  export const setEventosError = createAction(Types.SET_EVENTOS_ERROR, props<{ payload: string}>())
}
