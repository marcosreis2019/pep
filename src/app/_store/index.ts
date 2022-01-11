import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store'
import { localStorageSync } from 'ngrx-store-localstorage'
import { environment } from '../../environments/environment'
import { AtendimentoReducer } from './_modules/atendimento/atendimento.reducer'
import { AgendamentoReducer } from './_modules/agendamento/agendamento.reducer'
import { AuthReducer } from './_modules/auth/auth.reducer'
import { BeneficiarioReducer } from './_modules/beneficiario/beneficiario.reducer'
import { CredenciaisReducer } from './_modules/credenciais/credenciais.reducer'
import { EmpresaReducer } from './_modules/empresa/empresa.reducer'
import { ErrorsReducer } from './_modules/errors/errors.reducer'
import { ExamesReducer } from './_modules/exames/exames.reducer'
import { HistoricoReducer } from './_modules/historico/historico.reducer'
import { LocalReducer } from './_modules/local/local.reducer'
import { ProfissionalReducer } from './_modules/profissional/profissional.reducer'
import { ReferenciasReducer } from './_modules/referencias/referencias.reducer'
import { PEPState } from './store.models'
import { CanalReducer } from './_modules/telemedicina/canal.reducer'
import { ReferenciaReducer } from './_modules/referencias/referencia.reducer'

export const reducers: ActionReducerMap<PEPState> = {
  beneficiario: BeneficiarioReducer.reducer,
  credenciais: CredenciaisReducer.reducer,
  empresa: EmpresaReducer.reducer,
  atendimento: AtendimentoReducer.reducer,
  agendamento: AgendamentoReducer.reducer,
  historico: HistoricoReducer.reducer,
  referencias: ReferenciasReducer.reducer,
  referencia: ReferenciaReducer.reducer,
  exames: ExamesReducer.reducer,
  errors: ErrorsReducer.reducer,
  auth: AuthReducer.reducer,
  profissional: ProfissionalReducer.reducer,
  local: LocalReducer.reducer,
  canal: CanalReducer.reducer
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['atendimento'] })(reducer)
}

export const metaReducers: MetaReducer<PEPState>[] = !environment.production ? [] : []
