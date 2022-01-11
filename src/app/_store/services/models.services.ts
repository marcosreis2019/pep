export interface GenericItem {
  _id  : string
  v    : number
  ativo: boolean
  dataCriacao: string
}

export interface Responses {
  status  : string // OK or error
  message?: string
  data   ?: any
}

export enum ResponseStatus {
  OK    = 'OK', 
  ERROR = 'error', 
  WARN  = 'warning'
}

export interface Referencia {
  ref_texto         : string 
  ref_data_validade : string 
  ref_especialidade : string 
  ref_data_expedicao: string 
  ref_profissional  : string
  ref_local        ?: string 
  con_data_execucao?: string
  con_texto        ?: string
}
