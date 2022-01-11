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
import { ExamesActions } from './exames.actions'
import { ExamesService } from './exames.service'

@Injectable()
export class ExamesEffects {
  constructor(
    private actions$: Actions,
    private store: Store<PEPState>,
    private exameService: ExamesService
  ) {}

  getAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExamesActions.getAll),
      tap(() => ExamesActions.setLoading({ payload: true })),
      map(action => action['payload']),
      exhaustMap(mpi => { 
        return this.exameService.getAll(mpi)
      }),
      map(payload => ExamesActions.set({ payload })),
      catchError(() => of(ExamesActions.setError({ payload: 'Não foi possível pegar os exames' }))),
      tap(_ => ExamesActions.setLoading({ payload: false }))
    )
  )

  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExamesActions.post),
      tap(() => this.store.dispatch(ExamesActions.setLoading({ payload: true }))),
      map(action => action.payload),
      exhaustMap(data =>
        this.exameService.post(data.mpi, data.ref).pipe(
          concatMap(res => [
            ExamesActions.setSuccess({ payload: 'Exame salvo com sucesso!' }),
            ExamesActions.getAll({payload: data.mpi})
          ]),
          catchError(_ =>
            of(ExamesActions.setError({ payload: 'Nao foi possível salvar o exame.' }))
          )
        )
      ),
      delay(500),
      tap(() => this.store.dispatch(ExamesActions.setLoading({ payload: false })))
    )
  )

  put$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ExamesActions.put),
      tap(() => this.store.dispatch(ExamesActions.setLoading({ payload: true }))),
      map(action => action.payload),
      exhaustMap(data => {
        return this.exameService.put(data.mpi, data.exame).pipe(
          concatMap(_ => [
            ExamesActions.update({ payload: { exame: data.exame, index: data.index } }),
            ExamesActions.setSuccess({ payload: 'Resultados salvos com sucesso!' })
            // ExamesActions.getAll()
          ]),
          catchError(_ =>
            of(
              ExamesActions.setError({
                payload: 'Não foi possível salvar os resultados.'
              })
            )
          )
        )
      }),
      delay(500),
      tap(() => this.store.dispatch(ExamesActions.setLoading({ payload: false })))
    )
  )
}
