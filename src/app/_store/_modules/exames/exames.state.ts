import { ExamesModels as Models } from './exames.models'

export interface ExamesState {
  list: Models.Exame[]
  loading: boolean
  savingRef: boolean
  success: string
  error: string
  isEditingResults: boolean
}

export class ExamesState implements ExamesState {
  list: Models.Exame[]
  loading = false
  savingRef: boolean
  error: string = undefined
  success: string = undefined
  isEditingResults: boolean

  constructor() {}
}
