import { AtendimentoModel } from '../atendimento/atendimento.model';

export namespace HistoricoModels {
  export interface Evento {
    mpi            ?: string // REVIEW este dado ainda n existe na model, mas foi informado pelo Eduardo da Dynamix
    atendimento    ?: number // REVIEW este dado ainda n existe na model, mas foi informado pelo Eduardo da Dynamix
    tipo            : string // "CONSULTA",
    dataInicio      : string // "2007-01-02T00: 46: 15.736Z",
    dataFim         : string // "2000-04-30T03: 00: 04.435Z",
    titulo         ?: string // "Teste consulta com atendimento",
    profissional    : string // "5c8038cfc9098008806d42fd",
    localAtendimento: string // "5c802a6a40e5d935640ea095",
    subjetivo       : string // "Teste descrição subjetivo",
    objetivo        : string // "Teste descrição objetivo",
    avaliacao       : string // "Teste descrição avaliação",
    plano           : Plano
  }

  export interface Plano {
    descricao: string
    retorno? : Retorno,
    metas    : AtendimentoModel.Meta[]
  }

  export interface Retorno {
    digito  : number,
    unidade : string,
    comExame: boolean
  }

  export interface TimeLineItem {
    type  : string
    date? : string
    month?: string
    day?  : string
    event?: any
    icon? : string
  }

  export interface Filters {
    startAt: string,
    endAt  : string,
    type   : string
  }
}
