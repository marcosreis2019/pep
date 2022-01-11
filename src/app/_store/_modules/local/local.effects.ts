import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { LocalActions } from './local.actions'
import { LocalService } from './local.service'

@Injectable()
export class LocalEffects {
  constructor(private actions$: Actions, private aServ: LocalService) {}

  getLocal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocalActions.getLocal),
      map(action => action['payload']),
      exhaustMap(id =>
        this.aServ.getLocalById(id).pipe(
          map(data => {
            return data.data
              ? LocalActions.setLocal({ payload: data.data })
              : LocalActions.setErrorLocal({ payload: 'Profissional não encontrado' })
            // TODO substituir: Credenciais.error({ payload: CREDENCIAIS_ERROR.local })
          }),
          catchError(() =>
            of(LocalActions.setErrorLocal({ payload: 'Profissional não encontrado' }))
          )
        )
      )
    )
  )
}
