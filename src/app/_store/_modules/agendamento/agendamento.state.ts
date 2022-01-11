export interface IAgendamentoState {
  id: number
  data_inicio: string
  data_fim: string
  motivo: string
  agendamento_tipo_id: number
  especialidade: string
  agendamento_status_id: number
  email_paciente: string
  telefone_paciente: string
  id_tipo_servico: number
  id_classificacao: number
  local_id: number
  pago: boolean
  reagendamento: boolean
}

export class AgendamentoState implements IAgendamentoState {
  id: number
  profissional_id: number
  mpi_paciente: string
  data_inicio: string
  data_fim: string
  motivo: string
  agendamento_tipo_id: number
  especialidade: string
  agendamento_status_id: number
  email_paciente: string
  telefone_paciente: string
  id_tipo_servico: number
  id_classificacao: number
  local_id: number
  pago: boolean
  reagendamento: boolean

  constructor() {}
}
