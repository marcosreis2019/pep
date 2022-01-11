export namespace ExamesMocks {
  export interface Exame {
    id: string
    descricao: string
    dataSolicitacao: string
    dataRealizacao: string
    tipo: string
    observacoes: string
    dataResultado: Date
    resultados: {
      data: string
      idTag: string
      descricaoTag: string
      clinica: string
      resultadoIndividual: number
      unidade: string
      valorReferenciaMaximo: number
      valorReferenciaMinimo: number
      interpretacao: string
    }
  }
}
