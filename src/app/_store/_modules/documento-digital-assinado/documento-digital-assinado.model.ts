import { ProfissionalState } from '../profissional/profissional.state'
import { BeneficiarioState } from '../beneficiario/beneficiario.state'

export namespace DocumentoDigitalAssinadoModels {
  export interface ItemDocumentoDigital {
    id: string
    file_id: string
    link_original: string
    link_assinado: string
    codigo_acesso: string
    mpi_paciente: string
    mpi_profissional: string
    profissional_nome: string
    beneficiario_nome: string
    id_atendimento: string
    data_geracao: string
    created_at: string
  }
}
