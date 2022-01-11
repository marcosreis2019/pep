import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatMap, map } from 'rxjs/operators'
import { LocalActions } from '../local/local.actions'
import { ProfissionalActions } from '../profissional/profissional.actions'
import { AuthActions, AuthWithCred } from './auth.actions'

const LOCAL_NOT_FOUND = {
  ok: false,
  param: 'local',
  msg: 'ID do local de atendimento não foi informado ou não foi encotrado.'
}

const PRO_NOT_FOUND = {
  ok: false,
  param: 'profissional',
  msg: 'ID do profissional não foi informado ou não foi encontrado.'
}

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private router: Router
  ) { }
  getAuthWithCred$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getAuthFromCred),
      map(action => action['payload']),
      concatMap(auth => {
        const check = this.checkCredenciais(auth)
        if (!check.ok) {
          this.router.navigate(['not-found', { type: check.param }])
          return [AuthActions.setError({ payload: check.msg })]
        }

        return [
          ProfissionalActions.getProfissionalByMpi({ payload: auth.proMPI }),
          LocalActions.getLocalByCNES({ payload: auth.localCNES }),
        ]
      })
    )
  )

  private checkCredenciais(auth: AuthWithCred): { ok: boolean; param?: string; msg?: string } {
    if (this.invalidIDLocal(auth.localCNES)) {
      return LOCAL_NOT_FOUND
    }
    if (this.invalidIDPro(auth.proMPI)) {
      return PRO_NOT_FOUND
    }
    return { ok: true }
  }

  private invalidIDLocal(id: string): boolean {
    return !id || id === ''
  }

  private invalidIDPro(id: string): boolean {
    return !id || id === ''
  }
}
