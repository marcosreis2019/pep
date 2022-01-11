export namespace ClassificacaoModels {
  export interface Classificacao {
    id: number
    descricao: string
    ativo: boolean
  }

  export interface ClassificacaoPEPApi {
    status: string
    data: Array<Classificacao>
  }
}
