import { OperadoraModels } from '../operadora/operadora.model'

export namespace LocalAtendimentoModels {
  export interface Municipio {
    codigo_ibge: string
    nome: string
    uf: string
  }

  interface Fone {
    numero: string
  }
  export interface LocalAtendimento {
    id: number
    razao_social: string
    cnes: string
    cnpj: string
    municipio: Municipio
    fones_list: Array<Fone>
    logradouro: string
    bairro: string
    tipoServico: any
    tipo_servico_id: number
    tipo_id: number
    classificacao_padrao_id: number
    tipo_servico_padrao_id: number
    operadoras: Array<OperadoraModels.Operadora>
  }
  export interface Local {
    id: number
    razao_social: string
    cnes: string
    cnpj: string
    cep: string
    logradouro: string
    numero: number
    bairro: string
    municipio_id: number
    municipio: Municipio
    fones: string
    fones_list: Array<Fone>
    ativo: boolean
    duracao_consulta: number
    tipo_id: number
    tipo_servicos: any
    operadoras: any
    tipo_servico_padrao_id: number
    classificacao_padrao_id: number
    tipo_servico_id: number
    tipo_atendimento: string
  }

  export interface LocalAtendimentoCombo {
    id: number
    razao_social: string
    duracao_consulta: number
  }

  export interface LocalAtendimentoComboPepApi {
    data: Array<LocalAtendimentoCombo>
  }

  export interface LocaisAtendimentoPepApi {
    data: Array<LocalAtendimento>
  }
  export interface LocalAtendimentoPepApi {
    data: LocalAtendimento
  }
}
