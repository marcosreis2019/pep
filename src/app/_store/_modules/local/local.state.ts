import { LocalAtendimentoModels } from './local.model'

export interface LocalState {
  local: LocalAtendimentoModels.LocalAtendimento
  error: string
}
