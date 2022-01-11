export namespace PacienteModels {
  export interface Paciente {
    id: number
    codigoOperadora: number
    matricula: string
    codigoBeneficiario: number
    nome: string
    cpf: string
    numeroValidador: string
    sexo: string
    dataNascimento: string
    situacao: number
    estadoCivil: string
    dsMpi: string
    newRecord: boolean
    enderecos: Endereco[]
    telefones: Telefone[]
    emails: Email[]
  }

  export interface Endereco {
    codigoEndereco: number
    tipoEndereco: string
    cep: string
    uf: string
    localidade: any
    bairro: string
    logradouro: string
    numero: number
    codigoTipoEndereco: number
    codigoCidade: number
  }

  export interface Telefone {
    codigoTelefone: number
    tipoTelefone: string
    telefone: string
    codigoTipoTelefone: number
  }

  export interface Email {
    codigoEmail: number
    tipoEmail: string
    email: string
    codigoTipoEmail: string
  }
  export interface AISCidade {
    codigoCidade: number
    descricaoCidade: string
    uf: string
  }

  export enum Estado {
    AC = 'Acre',
    AL = 'Alagoas',
    AP = 'Amapá',
    AM = 'Amazonas',
    BA = 'Bahia',
    CE = 'Ceará',
    DF = 'Distrito Federal',
    ES = 'Espirito Santo',
    GO = 'Goiás',
    MA = 'Maranhão',
    MT = 'Mato Grosso',
    MS = 'Mato Grosso do Sul',
    MG = 'Minas Gerais',
    PA = 'Pará',
    PB = 'Paraiba',
    PR = 'Paraná',
    PE = 'Pernambuco',
    PI = 'Piauí',
    RJ = 'Rio de Janeiro',
    RN = 'Rio Grande do Norte',
    RS = 'Rio Grande do Sul',
    RO = 'Rondônia',
    RR = 'Roraima',
    SC = 'Santa Catarina',
    SP = 'São Paulo',
    SE = 'Sergipe',
    TO = 'Tocantis'
  }
}
