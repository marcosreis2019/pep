export namespace PeriodoModels {
  export interface PeriodoUnidade {
    id: number
    descricao: string
  }

  export interface PeriodoPEPApi {
    status: string
    data: Array<PeriodoUnidade>
  }
}
