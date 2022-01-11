// Credenciais - dados necessários para integração com RES e AIS
export interface CredenciaisState {
  resToken: string
  pepApiToken: string
  qdsToken: string
  canalApi: string
  canalToken: string
  clicToken: string
  clicApi: string
  memedToken: string
  memedApi: string
  memedScript: string
  telemedicina: string
  //pepFilaToken: string
  classificacaoPadrao: Object
  tiposervicoPadrao: Object
}

export class CredenciaisStateClass implements CredenciaisState {
  resToken = ''
  pepApiToken = ''
  qdsToken = ''
  canalApi = ''
  canalToken = ''
  clicApi = ''
  clicToken = ''
  memedToken = ''
  memedApi = ''
  memedScript = ''
  telemedicina = ''
  //pepFilaToken = ''
  classificacaoPadrao = {
    descricao: '',
    id: 0
  }
  tiposervicoPadrao = {
    descricao: '',
    id: 0
  }
}
