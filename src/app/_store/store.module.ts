import { NgModule } from '@angular/core'
import { EffectsModule } from '@ngrx/effects'
import { Action, StoreModule } from '@ngrx/store'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { storageSyncMetaReducer } from 'ngrx-store-persist'
import { environment } from 'src/environments/environment'
import { reducers } from './'
import { PEPState } from './store.models'
import { AtendimentoEffects } from './_modules/atendimento/atendimento.effects'
import { AuthActions } from './_modules/auth/auth.actions'
import { AuthEffects } from './_modules/auth/auth.effects'
import { BeneficiarioEffects } from './_modules/beneficiario/beneficiario.effect'
import { ExamesEffects } from './_modules/exames/exames.effects'
import { HistoricoEffects } from './_modules/historico/historico.effect'
import { LocalEffects } from './_modules/local/local.effects'
import { ProfissionalEffects } from './_modules/profissional/profissional.effects'
import { ReferenciasEffects } from './_modules/referencias/referencias.effects'
import { BeneficiarioState } from './_modules/beneficiario/beneficiario.state'
import { AntendimentoStateClass } from './_modules/atendimento/atendimento.state'
import { CanalEffects } from './_modules/telemedicina/canal.effects'

export function clearState(reducer) {
  return function(state: PEPState, action: Action) {
    if (action.type === AuthActions.Types.RESET) {
      // if (action.type === AuthActions.Types.RESET && (state.beneficiario && state.beneficiario.dadosPessoais && action['payload'] !== state.beneficiario.dadosPessoais.mpi)) {
      state = {
        profissional: state.profissional,
        local: state.local,
        credenciais: state.credenciais,
        empresa: state.empresa,
        beneficiario: new BeneficiarioState(),
        atendimento: new AntendimentoStateClass(),
        historico: undefined,
        exames: undefined,
        referencias: undefined,
        referencia: state.referencia,
        auth: undefined,
        canal: undefined,
        errors: undefined
      }
    }
    return reducer(state, action)
  }
}

const CONFIG_STORE_MODULE = {
  metaReducers: [storageSyncMetaReducer, clearState],
  runtimeChecks: {
    strictStateImmutability: true,
    strictActionImmutability: true
  }
}

const CONFIG_STORE_DEV_MODULE = { maxAge: 100, logOnly: environment.production }

const CONFIG_EFFECTS_MODULE = [
  AuthEffects,
  AtendimentoEffects,
  BeneficiarioEffects,
  HistoricoEffects,
  ReferenciasEffects,
  ExamesEffects,
  LocalEffects,
  ProfissionalEffects,
  CanalEffects
]

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, CONFIG_STORE_MODULE),
    StoreDevtoolsModule.instrument(CONFIG_STORE_DEV_MODULE),
    EffectsModule.forRoot(CONFIG_EFFECTS_MODULE)
  ],
  exports: [StoreModule, StoreDevtoolsModule, EffectsModule]
})
export class PepStoreModule {}
