import { Injectable } from '@angular/core'
import { createEffect, ofType, Actions } from '@ngrx/effects'
import { ProfissionalActions } from './profissional.actions'
import { of } from 'rxjs'
import { catchError, map, exhaustMap, concatMap } from 'rxjs/operators'
import { ProfissionalService } from './profissional.service'
import { CredenciaisActions } from '../credenciais/credenciais.action'

@Injectable()
export class ProfissionalEffects {
  constructor(private actions$: Actions, private pServ: ProfissionalService) {}

  getProfissional$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfissionalActions.getProfissionalById),
      map(action => action['payload']),
      exhaustMap(id =>
        this.pServ.getProfissionalById(id).pipe(
          concatMap(r => [ProfissionalActions.setProfissional({ payload: r })]),
          catchError(() =>
            of(ProfissionalActions.setErrorProfissional({ payload: 'Profissional não encontrado' }))
          )
        )
      )
    )
  )

  getProfissionalByMPI$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfissionalActions.getProfissionalByMpi),
      map(action => action['payload']),
      exhaustMap(id =>
        this.pServ.getProfissionalByMpi(id).pipe(
          map(r => {
            return r
              ? ProfissionalActions.setProfissional({ payload: r })
              : ProfissionalActions.setErrorProfissional({ payload: 'Profissional não encontrado' })
          }),
          catchError(() =>
            of(ProfissionalActions.setErrorProfissional({ payload: 'Profissional não encontrado' }))
          )
        )
      )
    )
  )
}
