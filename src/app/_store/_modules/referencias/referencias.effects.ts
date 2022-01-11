import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  tap
} from 'rxjs/operators'
import { PEPState } from '../../store.models'
import { ReferenciasActions } from './referencias.actions'
import { ReferenciasService } from './referencias.service'

@Injectable()
export class ReferenciasEffects {
  constructor(
    private actions$: Actions,
    private store: Store<PEPState>,
    private refService: ReferenciasService
  ) {}

  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReferenciasActions.post),
      tap(() => this.store.dispatch(ReferenciasActions.setLoading({ payload: true }))),
      map(action => {
        return action['payload']
      }),
      exhaustMap(data => {
         return this.refService.post(data.mpi, data.ref).pipe(
          concatMap(res => [
            ReferenciasActions.setReferencia({ payload: res }),
            ReferenciasActions.setSuccess({
              payload: 'Referência cadastrada com sucesso!'
            })
          ]),
          catchError(_ =>
            of(
              ReferenciasActions.setError({
                payload: 'Não foi possível registrar essa referência.'
              })
            )
          )
        )
      }
      ),
      delay(500),
      tap(() => this.store.dispatch(ReferenciasActions.setLoading({ payload: false })))
    )
  )
}
