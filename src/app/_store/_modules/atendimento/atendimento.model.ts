import moment from 'moment-timezone'
import { BeneficiarioModels } from '../beneficiario/beneficiario.model'
import { ClassificacaoModels } from '../classificacao/classificacao.model'
import { ExamesModels } from '../exames/exames.models'
import { LocalAtendimentoModels } from '../local/local.model'
import { TipoServicoModels } from '../tipo-servico/tipo-servico.model'
const TMZ = 'America/Sao_Paulo'

export namespace AtendimentoModel {
  export interface Item {
    label: string
    value?: string[] | string | number
    valueCid?: string | number
    estruturados?: any[]
  }

  export interface ItemAvaliacao {
    label: string
    value?: string | number
    valueCid?: string | number
    descricao: string
    estruturados?: any[]
    cidSecundariosConfirmados?: any[]
    cidSecundariosSuspeitos?: any[]
    cidPrincipal: {
      codigo: string,
      descricao: string,
      confirmado: boolean
    }
  }

  export interface RelatorioGeral {
    paciente: Item
    cpf: Item
    sexo: Item
    idade: Item
    endereco: Item
    bairro: Item
    numero: Item
    cep: Item
    subjetivo: Item
    objetivo: Item
    avaliacao: ItemAvaliacao
    plano: Item
    consulta: Item
    profissional: Item
    conselho: Item
    local: Item
    cidade: Item
    tipoServico: Item
    email: Item
  }

  export interface AtendimentoStart {
    id: number
    beneficiario: BeneficiarioModels.DadosPessoais
    sequencial: number
    codigoOperadora: number
    tipo_servico: TipoServicoModels.TipoServico
    classificacao: ClassificacaoModels.Classificacao
  }

  export interface Inicial {
    pessoa: string // "e5267e8b-3038-449d-b0b8-87ef328b2bbe",
    dataCriacao: string // "2019-12-03T12: 54: 07.944Z",
    _v: number // 0,
    _id: string // "5de65aef16e8e4001586ad48"
  }

  export interface ParaAPI {
    mpi: string
    id: string
    tipo: string
    dataInicio: string
    dataFim: string
    titulo: string
    profissional: {}
    localAtendimento: LocalAtendimentoModels.LocalAtendimento
    avaliacao: {
      descricao: string
      cid: any
      cidPrincipal: string
      cidSecundariosConfirmados: any[]
      cidSecundariosSuspeitos: any[]
    }
    objetivo: string
    subjetivo: string
    questionarioSubjetivo: any[]
    questionarioObjetivo: any[]
    plano: {
      descricao: string
      metas: Meta[]
      retorno: Retorno
    }
    sequencial: number
    tipo_servico: TipoServicoModels.TipoServico
    classificacao: ClassificacaoModels.Classificacao
    status: string
    respondeuQuestionarioSubjetivo: boolean
    respondeuQuestionarioObjetivo: boolean
    exames: Array<ExamesModels.Exame>
  }

  export enum TIPO {
    ATENDIMENTO = 'Atendido',
    FALTOU = 'Faltou',
    ATRASO_DO_PACIENTE = 'Atraso do paciente',
    PACIENTE_PROBLEMA = 'Paciente - Problemas de Conexão',
    PROFISSIONAL_PROBLEMA = 'Profissional - Problemas de Conexão'
  }

  export interface Retorno {
    digito: number
    tempo: string
    com_exames: boolean
  }

  export interface ResponseOperadora {
    codigoOperadora: number
    matricula: string
    codigoBeneficiario: number
    nome: string
    cpf: string
    numeroValidador: string
    sexo: string
    dataNascimento: string
    situacao: number
    dsMpi: string
    enderecos: any[]
    telefones: Telefone[]
    emails: any[]
  }

  export interface Telefone {
    codigoTelefone: number
    tipoTelefone: string
    telefone: string
  }

  export interface Meta {
    value?: string // caso precise ser associada a algum valor
    idAtividadeIndividual?: number
    idProfissional: string // caso precise ser relacionada com profissional solicitante
    descricao: string // caso venha de uma orientação será equivalente ao dsAtividadeIndividual
    dataCriacao: string // data que a orientação / inserção foi criada
    dataConfirmada?: string // data que a meta foi confirmada com realizada
    foiRealizada: boolean // default = false
    estadoAtual: METAS_ESTADO
  }

  export enum METAS_ESTADO {
    SUGESTAO = 'SUGESTAO', // é uma sugestão de meta, ou seja, uma orientação fornecida pela linha de cuidado
    ATIVA = 'ATIVA' // uma meta se torna ativa quando uma sugestão é aceita
  }

  export class Meta implements Meta {
    descricao: string
    dataCriacao: string
    foiRealizada: boolean
    estadoAtual: METAS_ESTADO
    idProfissional: string
    idAtividadeIndividual?: number

    constructor(description, idPro, idAtividade?, data?, isActive: boolean = true) {
      this.descricao = description
      this.estadoAtual = isActive ? METAS_ESTADO.ATIVA : METAS_ESTADO.SUGESTAO
      this.dataCriacao =
        data ||
        moment()
          .tz(TMZ)
          .format()
      this.foiRealizada = false
      this.idProfissional = idPro
      this.idAtividadeIndividual = idAtividade || undefined
    }
  }

  export interface PostSignedDocument {
    documentos_id: string
    link_assinado: string
    link_original: string
    mpi_paciente: string
    mpi_profissional: string
    id_atendimento: string
    envio_email: boolean
    envio_sms: boolean
    destinatario_email: string
    assunto: string
    destinatario_sms: string
    file_id: string
  }

  export interface SignedDocument {
    id: number
    link_assinado: string
    link_original: string
    codigo_acesso: string
    mpi_paciente: string
    mpi_profissional: string
    id_atendimento: number
    data_geracao: Date
    created_at: Date
    updated_at: Date
    created_by: number
    updated_by: number
    deleted: boolean
  }

  export interface PEPApiResponse {
    data: Object
    status: string
  }

  export interface PEPApiDocument {
    url: string
  }
}
