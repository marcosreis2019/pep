export namespace UsuarioModels {
  export interface Usuario {
    id: number
    login: string
    senha: string
    papeis: Array<string>
    email: string
    pessoa_id: number
    ativo: number
    primeiro_login: number
    profissional_id: number
    mpi: string
    nome: string
    onboarding: number
  }

  export interface UsuarioPut {
    papeis: Array<string>
    ativo: boolean
    primeiro_login: boolean
  }

  export interface UsuarioPost {
    papeis: Array<string>
    login: string
    senha: string
    ativo: boolean
    primeiro_login: boolean
  }

  export interface UsuarioBrowser {
    endpoint: string
    p256dh: string
    auth: string
  }

  export enum Role {
    AGENDADOR = 'agendador',
    MEDICO = 'medico',
    ADMIN = 'admin'
  }

  export interface PutOnboarding {
    ativo: boolean
  }
}
