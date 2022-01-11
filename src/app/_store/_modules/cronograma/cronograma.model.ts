export namespace CronogramaModels {
  export interface Cronograma {
    id: number
    profissional_id: number
    dia_da_semana: number
    hora_inicio: string
    hora_fim: string
    vigencia_inicio: string
    vigencia_fim: string
    local_id: number
    local_razao_social: string
  }

  export interface CronogramaPEPApi {
    status: string
    data: Array<Cronograma>
  }
  export interface Vigencia {
    id: number
    cronograma_id: number
    dataInicio: string
    dataFim: string
    local_id: number
    local_razao_social: string
    items: Array<Cronograma>
    profissional: number
  }
  export interface CronogramaItem {
    dia_da_semana: number
    hora_inicio: string
    hora_fim: string
  }
}
