import { createAction, props } from '@ngrx/store'
import { AgendamentoModels } from './agendamento.model'

export namespace AgendamentoActions {

  export enum Types {
    SET_AGENDAMENTO = '[AGENDAMENTO] set agendamento',
  }

  export const setAgendamento = createAction(
    Types.SET_AGENDAMENTO,
    props<{ payload: AgendamentoModels.AgendamentoUpdate }>()
  )
}
