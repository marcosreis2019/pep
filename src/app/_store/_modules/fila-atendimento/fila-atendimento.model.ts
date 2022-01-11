import { string } from 'yargs';
export namespace FilaAtendimentoModels{
  export interface FilaAtendimento{
    id?: number,
    seq?: string,
    nomAt?: string,
    nome?: string,
    codBen?: string,
    origem?: string,
    nomOrigem?: string,
    datIni?: string,
    fila?: number,
    nomFila?: string,
    inform?: string,
    status?: string,
    nomStatus?: string
  }

  export interface Paciente {
    id?: number
    codigoOperadora?: number
    matricula?: string
    codigoBeneficiario?: number
    nome?: string
    cpf?: string
    numeroValidador?: string
    sexo?: string
    dataNascimento?: string
    situacao?: number
    estadoCivil?: string
    dsMpi?: string
    newRecord?: boolean
    enderecos?: string
    telefones?: string
    emails?: string
  }

  // get atendimento
  export interface ResponseIniciarAtendimento {
    id: string
  }

  export interface RequestAtendimento{
    seq: string
  }

  export interface ResponseAtendimento{
    text: string
  }
}
