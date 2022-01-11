import moment from 'moment-timezone'
const TMZ = 'America/Sao_Paulo'

export interface TimeLineCol {
  type: string
  date?: string
  month?: string
  day?: string
  event?: any
  icon?: string
}

export class BlockTimelineAux {
  startTransform(list: any[], firstTime: boolean = false) {
    if (!list.length) {
      return list
    }
    if (firstTime) {
      return this.getMinMaxStart().then(l => this.range(l.min, l.max, list))
    }

    return this.getMinMax(list).then(l => this.range(l.min, l.max, list))
  }

  getMinMaxStart(): Promise<{ min: number; max: number }> {
    return new Promise(resolve => {
      const end = moment().tz(TMZ)
      const max = end.year()
      const start = end.subtract(18, 'months')
      resolve({ min: start.year(), max })
    })
  }

  private getMinMax(list: any[]): Promise<{ min: number; max: number }> {
    return new Promise(resolve => {
      const s = this.sortByDateTime(list)
      let min = new Date(s[0]['dataInicio']).getFullYear()
      const max = new Date().getFullYear()
      if (min === max) {
        min = max - 1
      }
      resolve({ min, max })
    })
  }

  private sortByDateTime(list: any[]): any[] {
    return [...list].sort(
      (a, b) => new Date(a['dataInicio']).getTime() - new Date(b['dataInicio']).getTime()
    )
  }

  private range(start: number, end: number, list: any[]): Promise<any[]> {
    const size = end - start + 1
    const map: TimeLineCol[] = []

    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    const isNotFuture = (year: any, month: any): boolean => {
      return !(year === todayYear && month > todayMonth)
    }

    return new Promise(resolve => {
      ;[...Array(size)].map((_, i) => {
        const year = start + i
        map.push(this.getColYear(year))

        ;[...Array(12)].forEach((_, m) => {
          if (isNotFuture(year, m)) {
            map.push(this.getColMonth(year, m))
            const events = this.filterEvents(list, year, m) // NOTE filtra eventos que são apenas daquela mês e ani
            if (events.length) {
              events.forEach(e => map.push(this.getColEvent(e)))
            }
          }
        })
      })
      resolve(map)
    })
  }

  private getColYear(year: any): TimeLineCol {
    return {
      type: 'year',
      date: new Date(year, 0, 1).toISOString()
    }
  }

  private getColMonth(year: any, month: any) {
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

  private filterEvents(list: any[], year: any, month: any): any[] {
    return list.filter(e => {
      const d = new Date(e['dataInicio'])
      const y = d.getFullYear()
      const m = d.getMonth()

      if (year === y && month === m) {
        return true
      }
    })
  }

  private getIcon(type: string): string {
    const def = 'eventFake'
    const map = {
      VISITA: 'visita',
      CONSULTA: 'consulta',
      TELEMONITORAMENTO: 'tele'
    }

    const iconName = map[type] || def
    return `assets/icons/${iconName}.svg`
  }
}
