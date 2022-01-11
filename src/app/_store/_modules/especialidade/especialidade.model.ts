export namespace EspecialidadeModels {
  export interface Especialidade {
    id: number
    descricao: string
    tipo: string
    tipo_servicos: any[]
    ativo: boolean
  }
  export interface PEPApiResponse {
    data: Object
  }
}
