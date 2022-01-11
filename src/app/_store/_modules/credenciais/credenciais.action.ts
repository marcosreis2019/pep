import { createAction, props } from '@ngrx/store'

// tslint:disable-next-line: no-namespace
export namespace CredenciaisActions {
  export enum Types {
    SET_RES_TOKEN = '[CREDENCIAIS] res token',
    SET_PEPAPI_TOKEN = '[CREDENCIAIS] pepapi token',
    SET_QDS_TOKEN = '[CREDENCIAIS] qds token',
    SET_CANAL_API = '[CREDENCIAIS] canal api',
    SET_CANAL_TOKEN = '[CREDENCIAIS] canal token',
    SET_CLIC_API = '[CREDENCIAIS] clic api',
    SET_CLIC_TOKEN = '[CREDENCIAIS] clic token',
    SET_MEMED_TOKEN = '[CREDENCIAIS] memed token',
    SET_MEMED_API = '[CREDENCIAIS] memed api',
    SET_MEMED_SCRIPT = '[CREDENCIAIS] memed script',
    SET_TELEMEDICINA = '[CREDENCIAIS] telemedicina',
    SET_TIPO_SERVICO_PADRAO = '[CREDENCIAIS] tipo servico',
    SET_CLASSIFICACAO_PADRAO = '[CREDENCIAIS] classificacao padrao'
  }

  export const setResToken = createAction(Types.SET_RES_TOKEN, props<{ payload: string }>())
  export const setPepApiToken = createAction(Types.SET_PEPAPI_TOKEN, props<{ payload: string }>())
  export const setQdsToken = createAction(Types.SET_QDS_TOKEN, props<{ payload: string }>())
  export const setCanalApi = createAction(Types.SET_CANAL_API, props<{ payload: string }>())
  export const setCanalToken = createAction(Types.SET_CANAL_TOKEN, props<{ payload: string }>())
  export const setClicApi = createAction(Types.SET_CLIC_API, props<{ payload: string }>())
  export const setClicToken = createAction(Types.SET_CLIC_TOKEN, props<{ payload: string }>())
  export const setMemedToken = createAction(Types.SET_MEMED_TOKEN, props<{ payload: string }>())
  export const setMemedApi = createAction(Types.SET_MEMED_API, props<{ payload: string }>())
  export const setMemedScript = createAction(Types.SET_MEMED_SCRIPT, props<{ payload: string }>())
  export const setTelemedicina = createAction(Types.SET_TELEMEDICINA, props<{ payload: string }>())
  export const setTipoServicoPadrao = createAction(
    Types.SET_TIPO_SERVICO_PADRAO,
    props<{ payload: Object }>()
  )
  export const setClassificacaoPadrao = createAction(
    Types.SET_CLASSIFICACAO_PADRAO,
    props<{ payload: Object }>()
  )
}
