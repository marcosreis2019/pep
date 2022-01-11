import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { OperadoraModels } from './operadora.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class OperadoraService {
  private subs$ = new SubSink()
  private basePepApi: string
  private baseAis: string
  private optionsPepApi: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.basePepApi = environment.PEP_API
    this.baseAis = environment.API_AIS
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

  getTiposServicosbyDescricao(descricao): Observable<OperadoraModels.Operadora> {
    const url = `${this.basePepApi}/operadoras`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getTiposServicos(): Observable<OperadoraModels.Operadora> {
    const url = `${this.basePepApi}/operadoras`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getAll(descricao: string): Observable<OperadoraModels.Operadora[]> {
    const url = `${this.baseAis}/operadoras`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  get(codigo_operadora: number): Observable<OperadoraModels.Operadora[]> {
    const url = `${this.basePepApi}/operadoras/` + codigo_operadora
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(Operadora: any): Observable<number> {
    const url = `${this.basePepApi}/operadoras`
    return this.http.post<number>(url, Operadora, this.optionsPepApi)
  }

  put(operadora: any): Observable<OperadoraModels.Operadora> {
    const url = `${this.basePepApi}/operadoras/${operadora.codigo_operadora}`
    return this.http.put<any>(url, operadora, this.optionsPepApi)
  }
}
