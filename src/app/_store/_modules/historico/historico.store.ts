import { HistoricoModels } from './historico.model'

interface EventoState {
  list: HistoricoModels.TimeLineItem[]
  error: string
}

export interface HistoricoState {
  prescricoes : any[]
  referencias : any[]
  eventos     : EventoState
}

export class HistoricoState {
  prescricoes : any[] = []
  referencias : any[] = []
  
  eventos: EventoState = {
    list:  [],
    error: undefined
  } 
  constructor() {}
}
