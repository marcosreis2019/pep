import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TermosModels } from './termos.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class TermosService {
  private subs$ = new SubSink()
  private basePepApi: string
  private optionsPepApi: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.basePepApi = environment.PEP_API
    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
        data => {
          this.optionsPepApi = {
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

  getAll(): Observable<TermosModels.TermosPEPApi> {
    const url = `${this.basePepApi}/termos`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  get(id: Number): Observable<TermosModels.TermosPEPApi> {
    const url = `${this.basePepApi}/termos/${id}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(termo: TermosModels.Termo): Observable<number> {
    const url = `${this.basePepApi}/termos`
    return this.http.post<number>(url, termo, this.optionsPepApi)
  }

  put(id: Number, termo: TermosModels.Termo): Observable<any> {
    const url = `${this.basePepApi}/termos/${id}`
    return this.http.put<any>(url, termo, this.optionsPepApi)
  }

  getAllProcessos(): Observable<any> {
    const url = `${this.basePepApi}/processo/termos`
    return this.http.get<any>(url, this.optionsPepApi)
  }
}
