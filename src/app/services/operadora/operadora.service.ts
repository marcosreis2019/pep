import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { OperadoraModels } from 'src/app/_store/_modules/operadora/operadora.model'

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {
  private base: string
  private options: HttpOptions
  private subs$ = new SubSink()

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.base = environment.PEP_API

    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
        data => {
          this.options = {
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

  getAll(descricao: string): Observable<OperadoraModels.Operadora[]> {
    const url = `${this.base}/operadoras?descricao=${descricao}`
    return this.http.get<OperadoraModels.Operadora[]>(url, this.options)
  }

  getAllByLocal(local_id: number): Observable<OperadoraModels.OperadoraLocal[]> {
    const url = `${this.base}/operadoras-local/${local_id}`
    return this.http.get<OperadoraModels.OperadoraLocal[]>(url, this.options)
  }

  get(id: number): Observable<OperadoraModels.OperadoraPepApi> {
    const url = `${this.base}/operadoras/${id}`
    return this.http.get<OperadoraModels.OperadoraPepApi>(url, this.options)
  }

  put(id: number, payload: OperadoraModels.Operadora): Observable<any> {
    const url = `${this.base}/operadoras/${id}`
    return this.http.put(url, payload, this.options)
  }

  post(payload: OperadoraModels.Operadora): Observable<any> {
    const url = `${this.base}/operadoras`
    return this.http.post(url, payload, this.options)
  }
}
