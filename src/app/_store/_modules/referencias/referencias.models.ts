import { Profissional } from '../profissional/profissional.model'
import { LocalAtendimentoModels } from '../local/local.model'
import { EspecialidadeModels } from '../especialidade/especialidade.model'

export namespace ReferenciasModels {
  export interface Referencia {
    _id?: string
    dataValidade?: string
    descricao: string
    especialidade?: EspecialidadeModels.Especialidade
    localAtendimento?: LocalAtendimentoModels.LocalAtendimento
    profissionalReferenciado?: string
    dataRealizacaoContraReferencia?: Date
    textoContraReferencia?: string
    criador?: string
    dataCriacao?: string
    _v?: number
  }

  export interface ReferenciaPut {
    localAtendimento: string
    dataRealizacaoContraReferencia: string
    textoContraReferencia: string
  }

  export interface ReferenciaPost {
    dataValidade: string
    descricao: string
    especialidade: EspecialidadeModels.Especialidade
    profissionalReferenciado: string
    localAtendimento: string
    dataRealizacaoContraReferencia: Date
    textoContraReferencia: string
    modified_by: string
  }

  export interface ReferenciaHistoricoFiltro {
    dataRealizacao: string
    dataRealizacaoInicio: string
    dataRealizacaoFim: string
    especialidade: string
  }
}
