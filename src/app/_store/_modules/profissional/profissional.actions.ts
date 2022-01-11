import { createAction, props } from '@ngrx/store'
import { Profissional } from '../profissional/profissional.model'

export namespace ProfissionalActions {
  enum Types {
    GET_PROFISSIONAL_BY_ID = '[ATENDIMENTO] get profissional by id',
    GET_PROFISSIONAL_BY_MPI = '[ATENDIMENTO] get profissional by mpi',
    SET_PROFISSIONAL = '[ATENDIMENTO] set profissional',
    DELETE_PROFISSIONAL = '[ATENDIMENTO] delete profissional',
    ERROR_PROFISSIONAL = '[ATENDIMENTO] error profissional'
  }

  export const getProfissionalById = createAction(
    Types.GET_PROFISSIONAL_BY_ID,
    props<{ payload: string }>()
  )
  export const getProfissionalByMpi = createAction(
    Types.GET_PROFISSIONAL_BY_MPI,
    props<{ payload: string }>()
  )
  export const setProfissional = createAction(
    Types.SET_PROFISSIONAL,
    props<{ payload: Profissional }>()
  )
  export const setErrorProfissional = createAction(
    Types.ERROR_PROFISSIONAL,
    props<{ payload: string }>()
  )
  export const deleteProfissional = createAction(
    Types.DELETE_PROFISSIONAL,
    props<{ payload: Profissional }>()
  )
}
