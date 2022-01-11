import { LocalAtendimentoModels } from '../local/local.model'

export namespace TermosModels {
  export interface Termo {
    id: number
    texto: string
    ativo: boolean
    processo: string
  }

  export interface TermosPEPApi {
    data: Array<Termo>
  }
}
