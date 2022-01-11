import { PEPError } from './errors.models'

export interface ErrorsStateModel {
  auth: {
    login: PEPError
    cred: PEPError
  }

  cred: {
    token: PEPError
    tokenMemed: PEPError
  }

  atendimento: {
    inicializar: PEPError
    finalizar: PEPError
    iniciarEstratificacao: PEPError
  }

  agendamento: PEPError
  documento: PEPError

  beneficiario: PEPError
  tags: PEPError
  alergias: PEPError
  condicoes: PEPError
  medicamentos: PEPError
  familia: PEPError

  exames: {
    post: PEPError
    get: PEPError
    put: PEPError
  }

  historico: PEPError
  local: PEPError
  profissional: PEPError

  lastErros: PEPError[]
}

export class ErrorsState implements ErrorsStateModel {
  auth = {
    login: undefined,
    cred: undefined
  }

  cred = {
    token: undefined,
    tokenMemed: undefined
  }

  atendimento = {
    inicializar: undefined,
    finalizar: undefined,
    iniciarEstratificacao: undefined
  }

  agendamento = undefined
  documento = undefined

  beneficiario = undefined
  tags = undefined
  familia = undefined
  alergias = undefined
  condicoes = undefined
  medicamentos = undefined

  exames = {
    post: undefined,
    get: undefined,
    put: undefined
  }

  historico = undefined
  local = undefined
  profissional = undefined

  lastErros = []

  constructor() {}
}
