import { QuestionariosModels } from './atendimento.questionario.model'
import { AtendimentoModel } from './atendimento.model'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { TipoServicoModels } from '../tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from '../classificacao/classificacao.model'

// SOAPItem - um item SOAP pode conter uma descrição que será o input de texto livre e dados estruturados vindo dos questionários
interface SOAPItemState {
  descricao?: string // input de texto no campo SOAP
  orientacoes: QuestionariosModels.AtividadesIndividuais[]
  respostas: QuestionariosModels.Answers[] // conjunto de respostas já enviadas para api
  perguntas: []
  inputsDinamicos?: QuestionariosModels.DynamicFormInput[] // inputs dinâmico para o questionário atual
  contador: number // não pode ultrapassar 3x
  postSuccess: string
  postFail: string
  cidPrincipal?: string
  cidSecundariosConfirmados?: Array<any>
  cidSecundariosSuspeitos?: Array<any>
  cid?: any
  metas?: AtendimentoModel.Meta[]
  retorno?: AtendimentoModel.Retorno
  answeredRequiredQuestions?: boolean
}

// Atendimento - registro do que entradas durante o uso do sistema representando atendimento real
export interface AtendimentoState {
  id: string
  cid: string
  subjetivo: SOAPItemState
  objetivo: SOAPItemState
  avaliacao: SOAPItemState
  plano: SOAPItemState
  loading: boolean
  fullScreenLoading: boolean
  dataInicio: string
  dataFim: string
  tipo: string
  startError: string
  codigoOperadora: number
  sequencial: number
  tipo_servico: TipoServicoModels.TipoServico
  classificacao: ClassificacaoModels.Classificacao
  status: string
  local: LocalAtendimentoModels.LocalAtendimento
}

// classes para initial States
const ATENDIMENTO_INICIAL_ITEM: SOAPItemState = {
  descricao: undefined,
  orientacoes: [],
  respostas: [],
  perguntas: [],
  contador: 0,
  postFail: undefined,
  postSuccess: undefined
}

export class AntendimentoStateClass implements AtendimentoState {
  id: string = undefined
  cid: string = undefined
  subjetivo: SOAPItemState = ATENDIMENTO_INICIAL_ITEM
  objetivo: SOAPItemState = ATENDIMENTO_INICIAL_ITEM
  avaliacao: SOAPItemState = {
    ...ATENDIMENTO_INICIAL_ITEM,
    cidPrincipal: '',
    cidSecundariosConfirmados: [],
    cidSecundariosSuspeitos: [],
    cid: undefined,
    descricao: ''
  }
  plano: SOAPItemState = {
    ...ATENDIMENTO_INICIAL_ITEM,
    metas: [],
    retorno: undefined
  }
  duracao: 0
  loading: boolean = true
  fullScreenLoading: boolean = undefined
  dataInicio: string = undefined
  dataFim: string = undefined
  tipo: string = undefined
  startError: string = undefined
  codigoOperadora: number = undefined
  sequencial: number = 0
  tipo_servico: TipoServicoModels.TipoServico = undefined
  classificacao: ClassificacaoModels.Classificacao = undefined
  idClassificacao: number = 0
  idTipoServico: number = 0
  status: string = ''
  local: LocalAtendimentoModels.LocalAtendimento = undefined
}
