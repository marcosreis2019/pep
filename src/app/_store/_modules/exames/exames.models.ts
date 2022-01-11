export namespace ExamesModels {
  export interface Exame {
    // id: string
    descricao: string
    tipo: string
    observacoes: string
    dataSolicitacao: string
    dataExecucao?: string
    resultados?: {
      data?: string
      clinica?: string
      unidade?: string
      valorReferenciaMinimo?: number
      valorReferenciaMaximo?: number
      valor: number
      interpretacao?: string
      arquivos?: string[]
    }
  }
}
