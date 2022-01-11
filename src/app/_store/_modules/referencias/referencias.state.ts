import { ReferenciasModels as Models } from './referencias.models'

export interface ReferenciasState {
  list: []
  loading: boolean
  savingRef: boolean
  error: string
  success: string
  limit: number
  offset: number
  fromInit: boolean
  last: Models.Referencia
}

export class ReferenciasState implements ReferenciasState {
  list: []
  loading = false
  savingRef: boolean
  error: string = undefined
  success: string = undefined
  offset = 0
  fromInit = true
  limit = 5
  last: Models.Referencia

  constructor() {}
}
