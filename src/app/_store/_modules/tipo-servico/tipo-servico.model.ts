import { LocalAtendimentoModels } from "../local/local.model";

export namespace TipoServicoModels {
  export interface TipoServico {
    id: number
    descricao: string
    tempo_atendimento: number
    ativo: boolean
    chatbot: boolean
    app: boolean
    locais?:Array<LocalAtendimentoModels.LocalAtendimento>
  }

  export interface TipoServicoPEPApi {
    id: number
    status: string
    data: Array<TipoServico>
  }
}
