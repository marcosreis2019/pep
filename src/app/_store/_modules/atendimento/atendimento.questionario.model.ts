// tslint:disable-next-line: no-namespace
export namespace QuestionariosModels {
  export interface SelectCheckOption {
    label: string
    value: any
    original?: any
    selected?: boolean
  }

  export interface DynamicFormInput {
    typeInput: InputType
    typeData?: string
    plcholder?: string
    addClass?: string
    id?: string
    mask?: string
    label?: string
    options?: SelectCheckOption[] // a ideia do origin é persistir a informação primária geradora dos options
    origin?: any
    required?: boolean
  }

  export enum InputType {
    INPUT = 'input',
    SELECT = 'select',
    SELECT_CHECK = 'select-check',
    RADIO = 'radio',
    CHECK = 'check',
    TEXTAREA = 'textarea'
  }
  export interface RespostaRelatorio {
    labelPergunta: string
    labelResposta?: string | number
    labelsRespostas?: string[] | number
  }

  export interface RespostaConteudo {
    paraAPI: Resposta
    paraRelatorio: RespostaRelatorio
  }

  export interface Answers {
    form_id?: number
    answers?: RespostaConteudo[]
  }

  export interface AtividadesIndividuais {
    idAtividadeIndividual: number
    dsAtividadeIndividual: string
    dsExecutorIndividual: string
    dsMetodologiaIndividual: string
    dsFerramenta: string
    idQuestionario: string
    dsQuestionario: string
    fgSituacaoIndividual: boolean
    idIntervencao: number
    dsFrequencia: string
    dsOrientacao?: string
  }

  export interface Intervencoes {
    atividadesIndividuais: AtividadesIndividuais[]
  }

  export interface FaixasClassificacao {
    idFaixa: number
    nmFaixa: string
    intervencoes?: Intervencoes
  }

  export interface Metas {
    idMeta: number
    dsMeta: string
    dsUndMedida: string
    periodoVerificacao: string
    fgIntervaloLimites: boolean
    limiteInferiorInicio: number
    limiteSuperiorFim: number
    fgSituacao: boolean
  }

  export interface Determinante {
    idDeterminante: number
    nmDeterminante: string
    faixasClassificacao: FaixasClassificacao[]
    intervencoes?: Intervencoes
    metas?: Metas[]
  }

  export interface DeterminantesResponse {
    codigoBeneficiario: number
    dsMpi: string
    nrMatricula: string
    cpf: string
    nmBeneficiario: string
    codOperadora: number
    determinantes: Determinante[]
  }

  export interface Estratificacao {
    codigoBeneficiario: number
    dsMpi: string
    nrMatricula: string
    cpf: string
    nmBeneficiario: string
    codOperadora: number
    determinantes: Determinante[]
  }

  export interface Pergunta {
    id: number
    idQuestionario?: number
    tipo: string
    requerida: boolean
    questao: string
    opcoes_pergunta?: OpcoesPergunta[]
    tipo_input?: string
    valor_min?: number
    valor_max?: number
    tamanho_max?: string
    campo?: string // algumas perguntas tem essa opcao
  }

  export interface OpcoesPergunta {
    id: number
    opcao: string
    campo?: string // adicionado
    valor?: string // adicionado
  }

  export interface Esqueleto {
    subjetivo: Item
    objetivo: Item
    avaliacao: Item
    plano: Item
  }

  export interface Item {
    orientacoes?: AtividadesIndividuais[]
    questionariosIDs?: string[]
    metas?: Metas[]
  }

  export const QUEST_SECTION_INITIAL_STATE: Item = {
    orientacoes: [],
    questionariosIDs: []
  }

  // Retorno da API
  export interface Questionario {
    id: number
    nome: string
    capitulos: Capitulo[]
  }

  export interface Capitulo {
    id: number
    nome: string
    categorias: Categoria[]
  }

  export interface Categoria {
    id: number
    nome: string
    perguntas: Pergunta[]
  }

  export interface Pergunta {
    id: number
    idQuestionario?: number
    tipo: string
    requerida: boolean
    questao: string
    opcoes_pergunta?: OpcoesPergunta[]
    tipo_input?: string
    valor_min?: number
    valor_max?: number
    tamanho_max?: string
    campo?: string // algumas perguntas tem essa opcao
  }

  export interface OpcoesPergunta {
    id: number
    opcao: string
    campo?: string // adicionado
    valor?: string // adicionado
  }

  export enum TipoPergunta {
    MULTIPLA_ESCOLHA = 'MULTIPLA_ESCOLHA',
    ABERTA = 'ABERTA',
    UNICA_ESCOLHA = 'UNICA_ESCOLHA'
  }

  export enum TipoInputPergunta {
    REAL = 'REAL',
    STRING = 'STRING'
  }

  export interface  Resposta {
    codigoPergunta: number
    tipo: TipoPergunta // TEXT ou SINGLE_CHOICE ou MULTIPLE_CHOICE
    resposta?: string // para TEXT
    codigoResposta?: number // para SINGLE_CHOICE
    codigosRespostas?: number[]
  }

  export function TEXT_RESPOSTA(cod: number, answer: string): Resposta {
    return {
      codigoPergunta: +cod,
      tipo: TipoPergunta.ABERTA,
      resposta: answer
    }
  }

  export function UNICA_RESPOSTA(cod: number, answer: number): Resposta {
    return {
      codigoPergunta: +cod,
      tipo: TipoPergunta.UNICA_ESCOLHA,
      codigoResposta: +answer
    }
  }

  export function MULTIPLA_RESPOSTA(cod: number, answer: number[]): Resposta {
    return {
      codigoPergunta: cod,
      tipo: TipoPergunta.MULTIPLA_ESCOLHA,
      codigosRespostas: answer
    }
  }

  export enum Metodologias {
    ORIENTACAO = 'ORIENTACAO',
    QUESTIONARIO = 'QUESTIONARIO'
  }

  export enum Ferramentas {
    PEP_AVALIACAO = 'PEP_ANALISE',
    PEP_SUBJETIVO = 'PEP_SUBJETIVO',
    PEP_OBEJTIVO = 'PEP_OBEJTIVO',
    PEP_PLANO = 'PEP_PLANO'
  }
}
