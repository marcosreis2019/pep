export namespace PessoaModels {
  export interface Pessoa {
    id
    mpi
    nome_completo
    nome_abreviado
    sexo
    cpf
    genero
    data_nascimento
    estado_civil
    grau_instrucao
    nivel_complexidade
    nome
    sobrenome
  }

  export interface PessoaPut {
    sexo: string
    cpf: string
    genero: string
    data_nascimento: string
    estado_civil: string
    grau_instrucao: string
    nome: string
    sobrenome: string
  }
}
