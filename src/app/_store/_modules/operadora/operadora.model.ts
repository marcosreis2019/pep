import { TipoServicoModels } from '../tipo-servico/tipo-servico.model'

export namespace OperadoraModels {
  export interface Operadora {
    id: number
    codigo: number
    descricao: string
    registro_ans: number
    tipo_servicos: Array<TipoServicoModels.TipoServico>
  }

  export interface OperadoraPut {
    codigo: number
    descricao: string
    registro_ans: number
    tipo_servicos: Array<number>
  }

  export interface OperadoraPost {
    codigo: number
    descricao: string
    registro_ans: number
    tipo_servicos: Array<number>
  }

  export interface OperadoraPepApi {
    data: Operadora
  }

  export interface OperadoraLocal {
    local_id: number
    operadora_id: number
    descricao: string
  }
}
