import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { of } from 'rxjs'
import { catchError, exhaustMap, map, switchMap, concatMap } from 'rxjs/operators'
import { PEPState } from '../../store.models'
import { BeneficiarioSelect } from '../beneficiario/beneficiario.selector'
import { HistoricoActions } from './historico.action'
import { HistoricoModels as Models, HistoricoModels } from './historico.model'
import { HistoricoService } from './historico.service'
import { AtendimentoActions } from '../atendimento/atendimento.action'

@Injectable()
export class HistoricoEffects {
  constructor(
    private actions$: Actions,
    private hServ: HistoricoService,
    private store: Store<PEPState>
  ) {}

  get$ = createEffect(() => this.actions$.pipe(
    ofType(HistoricoActions.get),
    map( action => action.payload),
    exhaustMap( data => {
      const req = data.filters
        ? this.hServ.getWithFilter(data.mpi, data.filters.startAt, data.filters.endAt, data.filters.type)
        : this.hServ.getLatests(data.mpi)
      return req.pipe(
        concatMap((a: HistoricoModels.Evento[]) => {
          const last = a[a.length -1] 
          const metas = last.plano && last.plano.metas ? last.plano.metas : []
          return [
            HistoricoActions.setEventos({ payload: this.trasformToTimelineItems(a)}),
            AtendimentoActions.setOldMetas({ payload: metas})
          ]
        }), // TODO add transform
        catchError( _ => of(HistoricoActions.setEventosError({ payload: 'Não foi possível resgatar os dados '})))
      )
    })
  ))

  private trasformToTimelineItems(list: any[]): Models.TimeLineItem[] {
    if (!list.length) { return list }

    const limits = this.getStartEnd(list)
    return this.range(limits.start, limits.end, list)
  }

  private getStartEnd(list: any[]): { start: number, end: number } {
    const s     = this.sortByDateTime(list)
    const start = new Date(s[0]['dataInicio']).getFullYear()
    const end   = new Date().getFullYear()
    return { start, end }
  }

  private range(start, end, list) {
    const size = end - start + 1
    const map: Models.TimeLineItem[] = []

    const today      = new Date()
    const todayYear  = today.getFullYear()
    const todayMonth = today.getMonth()

    const isNotFuture = (year, month): boolean => {
      return !((year === todayYear) && (month > todayMonth))
    }

    // gera um array com a quantidade de anos entre a data inicio e a data fim seleciona
    // ex: 2009, 2019 irá gerar = [2009, 2010... 2018, 2019]
    // utiliza o map para tranformar cada ano em uma columa da timeline
    [...Array(size)].map((_, i) => {
      const year = start + i // a cada interação gera um incrementa o ano à partir da data inicial
      map.push(this.getColYear(year)); // adiciona o ano à timeline

      // gera um array de meses para cada ano
      [...Array(12)].forEach((_, m) => {
        // se o mês e o ano não estiverem no futuro ...
        if (isNotFuture(year, m)) {
          // adiciona um novo mês à timeline
          map.push(this.getColMonth(year, m))
          // recuperar os eventos acontecidos naquele mês especifício
          const events = this.filterEvents(list, year, m) // NOTE filtra eventos que são apenas daquela mês e ani
          if (events.length) {
            // e caso existam eventos para aquele mês, serão adicionados em sequência linear à timeline
            events.forEach(e => map.push(this.getColEvent(e)))
          }
        }
      })
    })

    return map
  }


  private sortByDateTime(list: any[]): any[] {
    return [...list].sort((a, b) => (new Date(a['dataInicio']).getTime() - new Date(b['dataInicio']).getTime()))
  }

  private getColYear(year: number): Models.TimeLineItem {
    return {
      type: 'year',
      date: new Date(year, 0, 1).toISOString()
    }
  }

  private getColMonth(year: number, month: number) {
    return {
      type: 'month',
      date: new Date(year, month, 1).toISOString()
    }
  }

  private getColEvent(event: any) {
    return {
      type: 'event',
      date: event['dataInicio'],
      event,
      icon: this.getIcon(event['tipo'])
    }
  }

  private filterEvents(list: any[], year: number, month: number): any[] {
    return list.filter(e => {
      const d = new Date(e['dataInicio'])
      const y = d.getFullYear()
      const m = d.getMonth()

      if ((year === y) && (month === m)) {
        return true
      }
    })
  }

  private getIcon(type: string): string {
    const def = 'eventFake'
    const map = {
      VISITA: 'visita',
      CONSULTA: 'consulta',
      TELEMONITORAMENTO: 'tele',
    }

    const iconName = map[type] || def
    return `assets/icons/${iconName}.svg`
  }
}
