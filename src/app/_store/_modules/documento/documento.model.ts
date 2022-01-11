export namespace DocumentoModels {
  export interface DocumentoTipo {
    id: number
    descricao: string
    modelo_id: number
    modelo_descricao: string
  }

  export interface DocumentoTipoPEPApi {
    status: string
    data: Array<DocumentoTipo>
  }

  export const DOCUMENTO_MODELOS = {
    ATESTAD0: 1,
    RELATORIO_MEDICO: 2,
    SOLICITACAO_EXAMES: 3
  }

  export interface Documento {
    atendimento_sequencial: number
    bairro: string
    beneficiario?: any
    beneficiario_mpi: string
    beneficiario_nome: string
    cid: string
    cidade: string
    data_emissao: string
    documento_modelo?: any
    documento_tipo?: any
    documentos_tipos_id: number
    endereco: string
    id?: number
    indicacao_clinica: string
    local_atendimento: string
    local_id: number // objectid do local
    local_cnes: string
    modelo_descricao?: string
    modelo_id?: string
    nome_alterado: boolean
    observacao: string
    periodo_descricao?: string
    periodo_quantidade: number
    periodo_unidade?: any
    periodo_unidades_id: number
    profissional?: any
    profissional_id: number
    profissional_conselho_numero: string
    profissional_conselho_sigla: string
    profissional_conselho_uf: string
    profissional_mpi: string
    profissional_nome: string
    telefone: string
    tipo_descricao?: string
    uf: string
  }

  export function getDefault() {
    return {
      atendimento_sequencial: 0,
      documentos_tipos_id: 0,
      profissional_id: 0,
      profissional_mpi: '',
      profissional_nome: '',
      profissional_conselho_sigla: '',
      profissional_conselho_uf: '',
      profissional_conselho_numero: '',
      local_atendimento: '',
      local_id: 0,
      local_cnes: '',
      endereco: '',
      bairro: '',
      cidade: '',
      uf: '',
      telefone: '',
      data_emissao: '',
      beneficiario_mpi: '',
      beneficiario_nome: '',
      nome_alterado: false,
      periodo_quantidade: 0,
      periodo_unidades_id: 1,
      cid: '',
      observacao: '',
      indicacao_clinica: ''
    }
  }
}
