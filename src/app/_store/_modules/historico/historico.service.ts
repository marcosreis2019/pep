import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import moment from 'moment-timezone'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private subs$ = new SubSink()
  private baseURLRES
  private optionsRES: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseURLRES = environment.API_RES
    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
        data => {
          this.optionsRES = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data
            })
          }
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  getLatests(mpi: string): Observable<any> {
    const end = moment().tz(TMZ)
    const endAt = end.format()
    const start = end.subtract(18, 'months')
    const startAt = start.format()

    return this.getWithFilter(mpi, startAt, endAt)
  }

  getWithFilter(
    mpi: string,
    startAt?: string, // YYYY-mm-DD
    endAt?: string, // YYYY-mm-DD
    type?: string
  ): Observable<any> {
    let url = `${this.baseURLRES}/events/${mpi}?`
    if (startAt) {
      url += `&dataInicio=${startAt}`
    }
    if (endAt) {
      url += `&dataFim=${endAt}`
    }
    if (type) {
      url += `&tipo=${type}`
    }

    return this.http.get<any>(url, this.optionsRES)
  }
}
