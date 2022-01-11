export namespace AgendamentoModels {
  export interface Agendamento {
    id: number
    profissional_id: number
    mpi_paciente: string
    data_inicio: string
    data_fim: string
    email_paciente: string
    telefone_paciente: string
    id_tipo_servico: number
    id_classificacao: number
    motivo: string
    agendamento_tipo_id: number
    agendamento_status_id: number
    local_id: number
    pago: boolean
    reagendamento: boolean
  }

  export interface AgendamentoPost {
    profissional_id: number
    mpi_paciente: string
    data_inicio: string
    data_fim: string
    agendamento_tipo_id: number
    motivo: string
    email_paciente: string
    telefone_paciente: string
    id_tipo_servico: number
    id_classificacao: number
    local_id: number
    pago: boolean
    reagendamento: boolean
    retroativo: boolean
  }

  export interface AgendamentoUpdate {
    data_inicio: string
    data_fim: string
    motivo: string
    agendamento_tipo_id: number
    agendamento_status_id: number
    email_paciente: string
    telefone_paciente: string
    id_tipo_servico: number
    id_classificacao: number
    local_id: number
    pago: boolean
    reagendamento: boolean

  }

  export interface TipoAgendamento {
    id: number
    descricao: string
    tempo_atendimento: number
    envia_email_sms: number
    bloqueio: number
  }

  export interface StatusAgendamento {
    id: number
    descricao: string
    codigo: string
    apresentacao_cor: string
    apresentacao_icon: string
  }

  export enum STATUS {
    AGENDADO = 'AGENDADO',
    ATRASADO = 'ATRASADO',
    CANCELADO = 'CANCELADO',
    REALIZADO = 'REALIZADO',
    INICIADO = 'INICIADO'
  }

}
