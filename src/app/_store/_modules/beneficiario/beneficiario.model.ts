export namespace BeneficiarioModels {
  export interface Alergia {
    _id: string
    _v: number
    tipo: string
    agente: string
    notas: string
    ativo: boolean
    dataCriacao: string
  }

  export interface AlergiaPost {
    tipo: string
    agente: string
    notas: string
    ativo: boolean
  }

  export interface AlergiaPut extends AlergiaPost {}

  enum TiposAlergia {
    ALIMENTAR = 'ALIMENTAR',
    MEDICAMENTOSA = 'MEDICAMENTOSA',
    RESPIRATÓRIA = 'RESPIRATÓRIA',
    DERMATOLÓGICA = 'DERMATOLÓGICA',
    OCULAR = 'OCULAR'
  }

  interface TipoAlergia {
    label: string
    value: string
  }

  export const ALERGIA_TIPOS: TipoAlergia[] = [
    { label: 'Alimentar', value: TiposAlergia.ALIMENTAR },
    { label: 'Medicamentosa', value: TiposAlergia.MEDICAMENTOSA },
    { label: 'Respiratória', value: TiposAlergia.RESPIRATÓRIA },
    { label: 'Dermatológica', value: TiposAlergia.DERMATOLÓGICA },
    { label: 'Ocular', value: TiposAlergia.OCULAR }
  ]

  export interface Condicao {
    _id: string
    condicao: string
    CID: any
    confirmado: boolean
    data_diagnostico: string
    ativo: boolean
    dataCriacao: boolean
    _v: number
  }

  export interface CondicaoPost {
    _id: string
    condicao: string
    CID: any
    confirmado: boolean
    data_diagnostico: string
    ativo: boolean
  }

  export interface CondicaoPut {
    _id: string
    condicao: string
    CID: any
    confirmado: boolean
    data_diagnostico: string
    ativo: boolean
  }

  export interface Medicamento {
    _id: string
    _v: number
    medicamento: string
    principio_ativo: string
    dosagem: string
    uso_continuo: boolean
    obs: string
    ativo: boolean
    dataCriacao: string
  }

  export interface MedicamentoPost {
    medicamento: string
    principio_ativo: string
    dosagem: string
    obs: string
    uso_continuo: boolean
    ativo: boolean
  }

  export interface MedicamentoPut extends MedicamentoPost {}

  export interface DadosPessoais {
    _id?: string // Id o objeto.
    mpi?: string
    cpf?: string
    matricula?: string
    nomeCompleto?: string
    nomeAbreviado?: string // Nome abreviado, com até 40 caracteres.
    sexo?: string
    genero?: Genero
    dataNascimento?: string
    dataObito?: string // Data do óbito, se aplicável.
    fotoAvatar?: string
    nomeMae?: string
    estadoCivil?: EstadoCivil // Estado civil.
    grauInstrucao?: GrauInstrucao // Grau de Instrução/ Nível de escolaridade
    nivelComplexidade?: NivelComplexidadeModel // Dados informativos sobre situação de saúde atual
    enderecos?: Endereco[]
    telefones?: Telefone[]
    emails?: Email[]
  }

  interface Endereco {
    bairro: string
    cep: string
    cidade: string
    codigoCidade: number
    codigoEndereco: number
    codigoTipoEndereco: number
    logradouro: string
    tipoEndereco: string
    uf: string
  }

  interface Telefone {
    codigoTelefone: number
    codigoTipoTelefone: number
    telefone: string
    tipoTelefone: string
  }

  interface Email {
    codigoEmail: number
    codigoTipoEmail: string
    email: string
  }

  export enum Sexo {
    MASCULINO = 'Masculino',
    FEMININO = 'Feminino,',
    NAO_INFORMADO = 'Não Informado'
  }

  export enum Genero {
    MASCULINO = 'Masculino',
    FEMININO = 'Feminino,',
    NAO_INFORMADO = 'Não Informado'
  }

  export enum EstadoCivil {
    SOLTEIRO = 'Solteiro',
    CASADO = 'Casado',
    VIUVO = 'Viuvo',
    SEPARADO = 'Separado judicialmente',
    DIVORCIADO = 'Divorciado'
  }

  export enum GrauInstrucao {
    ANALFABETO = 'Analfabeto',
    PRIMARIO_INCOMPLETO = 'Primario incompleto',
    PRIMARIO_COMPLETO = 'Primario completo',
    PRIMEIRO_GRAU_INCOMPLETO = 'Primeiro grau imcompleto',
    PRIMEIRO_GRAU_COMPLETO = 'Primeiro grau completo',
    SEGUNDO_GRAU_INCOMPLETO = 'Segundo grau incompleto',
    SEGUNDO_GRAU_COMPLETO = 'Segundo grau completo',
    SUPERIOR_INCOMPLETO = 'Superior incompleto',
    SUPERIOR_COMPLETO = 'Superior completo',
    DOUTORADO_COMPLETO = 'Doutorado completo'
  }

  export interface NivelComplexidadeModel {
    codigoNivel: number // Identificador do nível
    descricao: string // Descrição do nível.
    nome: string // Nome do nível.
    indice: number // Indice.
  }

  export interface Tag {
    _id?: string // Identificador da tag.
    tag: string // Texto / nome da tag.
    descricao?: string // Descrição ou texto complementar da tag.
    cor: string // Cor, hexadecimal para uso em HTML, com que será exibida nos sistemas.
    dataCriacao: string // Data e hora de criação da tag.
    criador: string // Nome do usuário ou pessoal que criou a tag
    icone?: string
    grau: number // Nível de complexidade
    url?: string // url para mais informações ou ação necessária para tag
  }

  export interface FilterTag {
    tag: string
    cor: string
    data: Tag[]
  }
}
