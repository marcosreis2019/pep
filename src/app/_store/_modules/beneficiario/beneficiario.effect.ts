import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { Observable, of } from 'rxjs'
import {
  catchError,
  concatMap,
  delay,
  exhaustMap,
  map,
  switchMap,
  tap,
  mergeMapTo
} from 'rxjs/operators'
import { PEPState } from '../../store.models'
import { BeneficiarioActions } from './beneficiario.action'
import { BeneficiarioModels } from './beneficiario.model'
import { BeneficiarioService } from './beneficiario.service'
import { TagList } from './beneficiario.state'
import { HistoricoActions } from '../historico/historico.action'

@Injectable()
export class BeneficiarioEffects {
  constructor(
    private actions$: Actions,
    private store: Store<PEPState>,
    private bServ: BeneficiarioService
  ) {}

  get$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.get),
      map(action => action.payload),
      exhaustMap(mpi => this.bServ.get(mpi)),
      concatMap(benef => {
        return [
          BeneficiarioActions.getFamilia({ payload: benef.mpi }),
          BeneficiarioActions.getTags({ payload: benef.mpi }),
          BeneficiarioActions.getAllAlergia({ payload: benef.mpi }),
          BeneficiarioActions.getAllCondicao({ payload: benef.mpi }),
          BeneficiarioActions.getAllMedicamento({ payload: benef.mpi }),
          HistoricoActions.get({ payload: { filters: undefined, mpi: benef.mpi } })
        ]
      }) // TODO add catchError
    )
  )

  getFamilia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.getFamilia),
      map(action => action.payload),
      exhaustMap(mpi =>
        this.bServ.getFamily(mpi).pipe(
          map(r => BeneficiarioActions.setFamilia({ payload: r })),
          catchError(() =>
            of(
              BeneficiarioActions.setErrorFamilia({
                payload: 'Não possível ler informações de familiares'
              })
            )
          )
        )
      )
    )
  )

  getTags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.getTags),
      map(action => action.payload),
      exhaustMap(mpi =>
        this.bServ.getTags(mpi).pipe(
          map(r => BeneficiarioActions.setTags({ payload: this.getTagsByCategories(r) })),
          catchError(() =>
            of(
              BeneficiarioActions.setErrorTags({
                payload: 'Não possível ler informações de familiares'
              })
            )
          )
        )
      )
    )
  )

  getAllAlergia$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.getAllAlergia),
      map(action => action.payload),
      exhaustMap(mpi => this.bServ.getAllAlergia(mpi)),
      map(r => r.filter(l => l.ativo)),
      map(l => BeneficiarioActions.setAlergia({ payload: l }))
    )
  )

  getAllCondicao$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.getAllCondicao),
      map(action => action.payload),
      exhaustMap(mpi => this.bServ.getAllCondicao(mpi)),
      map(r => r.filter(l => l.ativo)),
      map(l => BeneficiarioActions.setCondicao({ payload: l }))
    )
  )

  getAllMedicamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.getAllMedicamento),
      map(action => action['payload']),
      exhaustMap(mpi => {
        return this.bServ.getAllMedicamentos(mpi)
      }),
      map(r => r.filter(l => l.ativo)), // TODO Filtra listas de medicamentos ativos
      map(l => BeneficiarioActions.setMedicamento({ payload: l }))
    )
  )

  clearAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeneficiarioActions.clearAll),
      delay(4000),
      map(() => BeneficiarioActions.clearAllMsg())
    )
  )

  postAlergia$ = this.create(
    BeneficiarioActions.postAlergia,
    'postAlergia',
    BeneficiarioActions.postSAlergia,
    BeneficiarioActions.postFAlergia,
    BeneficiarioActions.getAllAlergia,
    'Alergia adicionada!',
    'Ops! Poderia tentar adicionar esta Alergia novamente?'
  )

  deleteAlergia$ = this.create(
    BeneficiarioActions.deleteAlergia,
    'deleteAlergia',
    BeneficiarioActions.deleteSAlergia,
    BeneficiarioActions.deleteFAlergia,
    BeneficiarioActions.getAllAlergia,
    'Alergia removida!',
    'Ops! Poderia tentar remover esta Alergia novamente?'
  )

  postCondicao$ = this.create(
    BeneficiarioActions.postCondicao,
    'postCondicao',
    BeneficiarioActions.postSCondicao,
    BeneficiarioActions.postFCondicao,
    BeneficiarioActions.getAllCondicao,
    'Condição adicionada!',
    'Ops! Poderia tentar adicionar esta condição novamente?'
  )

  putCondicao$ = this.create(
    BeneficiarioActions.putCondicao,
    'putCondicao',
    BeneficiarioActions.putSCondicao,
    BeneficiarioActions.putFCondicao,
    BeneficiarioActions.getAllCondicao,
    'Condição atualizada!',
    'Ops! Poderia tentar atualizar esta condição novamente?'
  )

  deleteCondicao$ = this.create(
    BeneficiarioActions.deleteCondicao,
    'deleteCondicao',
    BeneficiarioActions.deleteSCondicao,
    BeneficiarioActions.deleteFCondicao,
    BeneficiarioActions.getAllCondicao,
    'Condição removida!',
    'Ops! Poderia tentar remover esta condição novamente?'
  )

  postMedicamento$ = this.create(
    BeneficiarioActions.postMedicamento,
    'postMedicamento',
    BeneficiarioActions.postSMedicamento,
    BeneficiarioActions.postFMedicamento,
    BeneficiarioActions.getAllMedicamento,
    'Medicação adicionada!',
    'Ops! Poderia tentar adicionar esta medicação novamente?'
  )

  putMedicamento$ = this.create(
    BeneficiarioActions.putMedicamento,
    'putMedicamento',
    BeneficiarioActions.putSMedicamento,
    BeneficiarioActions.putFMedicamento,
    BeneficiarioActions.getAllMedicamento,
    'Medicação alterada!',
    'Ops! Poderia tentar alterar esta medicação novamente?'
  )

  deleteMedicamento$ = this.create(
    BeneficiarioActions.deleteMedicamento,
    'deleteMedicamento',
    BeneficiarioActions.deleteSMedicamento,
    BeneficiarioActions.deleteFMedicamento,
    BeneficiarioActions.getAllMedicamento,
    'Medicação removida!',
    'Ops! Poderia tentar remover esta medicação novamente?'
  )

  private create<T>(action0, func, action1, action2, action3, msg1, msg2) {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(action0),
        map(a => a.payload),
        switchMap(body => this.bServ[func](body.data, body.mpi).pipe(map(_ => body.mpi))),
        concatMap((mpi: any) => [action1({ payload: msg1 }), action3({ payload: mpi })]),
        catchError(() => of(action2({ payload: msg2 }))),
        tap(() => {
          this.store.dispatch(BeneficiarioActions.clearAll())
        })
      )
    )
  }
  private getTagsByCategories(list: any[]): TagList | any {
    const uniqueTags = [...new Set(list.map(item => item.tag))]
    let filterIndex = {
      admin: this.filterTags(list, 1, uniqueTags),
      auth: this.filterTags(list, 2, uniqueTags),
      health: this.filterTags(list, 3, uniqueTags)
    }
    return filterIndex
  }

  private filterTags(tags: BeneficiarioModels.Tag[], index: number, uniqueTags: any[]) {
    if (!tags.length) {
      return []
    }
    const filterByIndex = tags.filter((elem: BeneficiarioModels.Tag) => {
      if (elem.grau === index) {
        return elem
      }
    })

    if (filterByIndex.length > 0) {
      return uniqueTags.map(nomeTag => {
        const filteredNameTags = this.filterNameTag(filterByIndex, nomeTag)

        let cor
        if (filteredNameTags.length > 0) {
          cor = filteredNameTags[0].cor
          return { tag: nomeTag, cor: cor, data: filteredNameTags }
        }
        return []
      })
    } else {
      return []
    }
  }

  private filterNameTag(tags: BeneficiarioModels.Tag[], nameTag: string) {
    if (!tags.length) {
      return []
    }
    return tags.filter((elem: BeneficiarioModels.Tag) => {
      if (elem.tag === nameTag) {
        return elem
      }
    })
  }
}
