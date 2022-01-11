import { ReferenciasModels as Models } from './referencias.models'

export interface ReferenciaState {
  referencia: Models.Referencia
  error: string
}

export class ReferenciaState implements ReferenciaState {
  referencia: Models.Referencia
  error: string

  constructor() {}
}