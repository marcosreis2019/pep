import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { Responses } from '../../services/models.services'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class ClicService {
  private base: string
  private options: HttpOptions
  private subs$ = new SubSink()
  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.subs$.add(
      this.store.select(CredenciaisSelect.clicApi).subscribe(
        data => {
          this.base = data
        },
        err => {
          console.error(err)
        }
      )
    )

    this.subs$.add(
      this.store.select(CredenciaisSelect.clicToken).subscribe(
        data => {
          this.options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'x-api-key': data
            })
          }
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  postAtendimentoClic(mpi: string): Observable<any> {
    const url = `${this.base}/registration`
    const body = `{"mpi": "${mpi}"}`
    return this.http.post(url, body, this.options)
  }

  postFinishAtendimento(mpi: string): Promise<Responses> {
    const url = `${this.base}/doctor/end`

    const body = `{"mpi": "${mpi}"}`
    return this.http
      .post(url, body, this.options)
      .toPromise()
      .then((r: any) => {
        return { status: 'OK', data: r }
      })
      .catch(() => {
        return {
          status: 'error',
          message: 'Serviço de eventos indisponível no momento'
        }
      })
  }
}
