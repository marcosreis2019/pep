import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Canal } from './canal.model'
import { map, switchMap } from 'rxjs/operators'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
@Injectable({
  providedIn: 'root'
})
export class CanalService {
  private base: string
  private options: HttpOptions
  private subs$ = new SubSink()
  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.subs$.add(
      this.store.select(CredenciaisSelect.canalApi).subscribe(
        data => {
          this.base = data
        },
        err => {
          console.error(err)
        }
      )
    )

    this.subs$.add(
      this.store.select(CredenciaisSelect.canalToken).subscribe(
        data => {
          this.options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + data
            })
          }
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  getCanais(): Observable<Canal[]> {
    return this.http.get<Canal[]>(`${this.base}/videoconferencialistartokens`, this.options)
  }

  getLink(dataIni: string, dataFim: string): Observable<Canal> {
    const url = `${this.base}/videoconferenciacriartoken?data_ini=${dataIni}&data_fim=${dataFim}`
    return this.http.post<Canal>(url, null, this.options)
  }

  getLinkByToken(token: string): Observable<Canal> {
    const url = `${this.base}/videoconferenciacriartoken?data_ini=${token}`
    return this.http
      .post<Canal>(url, null, this.options)
      .pipe(map(r => (r ? { ...r, token } : undefined)))
  }

  excluirToken(token: string): Observable<Canal> {
    const url = `${this.base}/videoconferenciaapagartoken?token=${token}`
    return this.http.delete<Canal>(url, this.options)
  }
}
