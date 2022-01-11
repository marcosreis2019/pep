import { LocalAtendimentoModels } from '../local/local.model'
import { EspecialidadeModels } from '../especialidade/especialidade.model'
import { PessoaModels } from '../pessoa/pessoa.model'
import { EmpresaModels } from '../empresa/empresa.model'

export interface Profissional {
  _id: string
  id: number
  pessoa: PessoaModels.Pessoa
  ufConselho: string
  numeroConselho: string
  conselhoProfissional: string
  dataCriacao: string
  primeiroLogin: boolean
  role: string
  roles: Array<string>
  homePage: string
  especialidades: Array<EspecialidadeModels.Especialidade>
  locais: Array<LocalAtendimentoModels.LocalAtendimento>
  localPadraoId: number
  localPadrao: LocalAtendimentoModels.LocalAtendimento
  memedAtivo: boolean
  ativo: number
  email: string
  memedCidadeId: number
  memedEspecialidadeId: number
  onboarding: boolean
}

export namespace ProfissionalModels {
  export interface Usuario {
    id: number
    primeiro_login: boolean
    papeis: Array<string>
    onboarding: boolean
  }
  export interface ProfissionalPepApi {
    id: number
    usuario: Usuario
    empresa: EmpresaModels.Empresa
    role: string
    roles: Array<string>
    pessoa: PessoaModels.Pessoa
    id_pessoa: number
    uf_conselho: string
    conselho_profissional: string
    numero_conselho: number
    token_memed: string
    senha: string
    primeiro_login: boolean
    info_memed: Object
    especialidades: Array<EspecialidadeModels.Especialidade>
    locais: Array<LocalAtendimentoModels.LocalAtendimento>
    pepapi_token: string
    home_page: string
    local_padrao: LocalAtendimentoModels.LocalAtendimento
    local_padrao_id: number
    usuario_id: number
    ativo: number
    email: string
    memed_cidade_id: number
    memed_especialidade_id: number
  }

  export interface ProfissionalPutPepApi {
    id: number
    pessoa: PessoaModels.PessoaPut
    uf_conselho: string
    conselho_profissional: string
    numero_conselho: string
    especialidades: Array<number>
    locais: Array<number>
    home_page: string
    local_padrao_id: number
    ativo: boolean
    email: string
    memed_cidade_id: number
    memed_especialidade_id: number
  }

  export interface ProfissionalPostPepApi {
    pessoa: PessoaModels.PessoaPut
    uf_conselho: string
    conselho_profissional: string
    numero_conselho: string
    especialidades: Array<number>
    locais: Array<number>
    home_page: string
    local_padrao_id: number
    ativo: boolean
    email: string
    memed_cidade_id: number
    memed_especialidade_id: number
    usuario_id: number
  }
  export interface ProfissionalCombo {
    id: number
    nome: string
    pessoa: PessoaModels.Pessoa
    especialidades: Array<EspecialidadeModels.Especialidade>
    especialidadesDescricao: string
    locais: Array<LocalAtendimentoModels.LocalAtendimento>
    locaisDescricao: string
  }

  export interface BasicProfissionalCombo {
    id: number
    nome: string
  }

  export interface ProfissionalResponsePepApi {
    data: Array<ProfissionalPepApi>
  }

  export interface ProfissionalSingleResponsePepApi {
    data: ProfissionalPepApi
  }

  export interface ResponsePepApi {
    data: any //TODO - alterar tipo
  }

  export enum Conselho {
    CRM = 'CRM'
  }

  export enum HomePage {
    ATENDIMENTO = 'ATENDIMENTO',
    AGENDA = 'AGENDA',
    PEP_PAGE_ATENDIMENTO = 'home',
    PEP_PAGE_AGENDA = 'agendamento',
    PEP_PAGE_USUARIOS = 'usuarios'
  }
}
