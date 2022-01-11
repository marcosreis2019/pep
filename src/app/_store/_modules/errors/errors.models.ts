export interface PEPError {
  code     : string
  msg      : string, 
  action  ?: string,
  path    ?: string,
  params  ?: any,
  duration?: number
}

export namespace Errors {
  export const Auth = {
    USER_NOT_FOUND: { code: 'auth-user-not-found', msg: 'Usuário ou senha não confere, por favor tente novamente mais tarde'},
  }

  export const Credenciais = {
    TOKEN_NOT_FOUND      : { code: 'cred-token-not-found',       msg: 'Dados de acesso ao RES não foram encontrados', path: 'login', action: 'redirect'},
    TOKEN_MEMED_NOT_FOUND: { code: 'cred-token-memed-not-found', msg: 'Dados de acesso ao MEMED não foram encontrados'}, 
    TOKEN_MEMED_EXPIRED  : { code: 'cred-token-memed-expired',   msg: 'Dados de acesso ao MEMED expirados, por favor tente login novamente ou entre em contato com o suporte'}, 
  }

  export const Atendimento = {
    START      : { code: 'aten-start',       msg: 'Não foi possível iniciar o atendimento para este paciente, por favor tente novamente!', path: 'home', action: 'redirect'},
    INIT_ESTRAT: { code: 'aten-init-estrat', msg: 'Não foi possível iniciar a estrateficação deste paciente em suas linhas de cuidado!'},
    FISISH     : { code: 'aten-finish',      msg: 'Não foi possível finalizar este atendimento neste momento, por favor tente novamente!'}, 
  }

  export const Beneficiario = {
    NOT_FOUND       : { code: 'ben-not-found',  msg: 'Paciente não encontrado, verifique os dados do paciente e tente novamente!', path    : 'home', action: 'redirect'},
    TAGS_NOT_FOUND  : { code: 'ben-not-found-tags',   msg: 'Não foi possível obter as tags para este paciente!'},
    FAMILY_NOT_FOUND: { code: 'ben-not-found-family', msg: 'Não foi possível obter os dados familíares deste paciente!'},
    
    ALER_NOT_FOUND: { code: 'ben-not-found-alergias', msg    : 'Não foi possível obter os dados alergias deste paciente!'},
    COND_NOT_FOUND: { code: 'ben-not-found-condicoes', msg   : 'Não foi possível obter os dados de condições de saúde deste paciente!'},
    MEDI_NOT_FOUND: { code: 'ben-not-found-medicamentos', msg: 'Não foi possível obter os dados médicamentos deste paciente!'},
    
    ALER_POST: { code: 'ben-post-alergias', msg: 'Não foi possível adicionar esta alergia, tente novamente!', duration: 4000 },
    COND_POST: { code: 'ben-post-condicoes', msg: 'Não foi possível adicionar esta condição, tente novamente!', duration: 4000 },
    MEDI_POST: { code: 'ben-post-medicamentos', msg: 'Não foi possível adicionar este medicamento, tente novamente!', duration: 4000 },
    
    ALER_PUT: { code: 'ben-put-alergias', msg: 'Não foi possível atualizar esta alergia, tente novamente!', duration: 4000 },
    COND_PUT: { code: 'ben-put-condicoes', msg: 'Não foi possível atualizar esta condição, tente novamente!', duration: 4000 },
    MEDI_PUT: { code: 'ben-put-medicamentos', msg: 'Não foi possível atualizar este medicamento, tente novamente!', duration: 4000 },

    ALER_DEL: { code: 'ben-del-alergias', msg: 'Não foi possível deletar esta alergia, tente novamente!', duration: 4000},
    COND_DEL: { code: 'ben-del-condicoes', msg: 'Não foi possível deletar esta condição, tente novamente!', duration: 4000},
    MEDI_DEL: { code: 'ben-del-medicamentos', msg: 'Não foi possível deletar este medicamento, tente novamente!', duration: 4000},
  }

  export const Exames = {
    NOT_FOUND : { code: 'exam-not-fount',  msg: 'Não foi possível obter os dados de exame deste paciente!' },
    POST      : { code: 'exam-post',       msg: 'Não foi possível obter os dados de exame deste paciente!' }, // TODO criar mensagem de erro de post
    PUT       : { code: 'exam-put',        msg: 'Não foi possível obter os dados de exame deste paciente!' }, // TODO criar mensagem de erro de put se necessário
  }

  export const Historico = {
    NOT_FOUND: { code: 'history-not-found', msg: 'Não foi possível obter o histório deste paciente'}
  }

  export const Local = {
    NOT_FOUND: { code: 'local-not-found', msg: 'Local não encontrado. Você precisa selecionar um local válido para iniciar atendimentos', path: 'login', action: 'redirect'}
  }

  export const Profissional = {
    NOT_FOUND: { code: 'profissiona-not-found', msg: 'Profissional não encontrado, por favor tente login!'}
  }

  export const Referencias = {
    NOT_FOUND: { code: 'refer-not-found', msg: 'Não foi possível obter os dados de referências deste paciente'},
    POST     : { code: 'refer-post', msg     : 'Não foi possível adicionar esta referência neste momento, por favor tente novamente!'},
    PUT      : { code: 'refer-put', msg      : 'Não foi possível adicionar esta contrarreferência neste'}
  }

  export const General = {
    SERVER_NOT_AVAIBLE: { code: 'server-down', msg: 'Nossos serviços encontram-se temporaramente indisponíveis, por favor tente novamente em alguns instantes'}
  }
}
