import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ClassificacaoModels } from './classificacao.model'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class ClassificacaoService {
  private basePepApi: string
  private subs$ = new SubSink()
  private urlPepApi: string
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

  getClassificacoesAtivas(): Observable<ClassificacaoModels.Classificacao[]> {
    const url = `${this.basePepApi}/classificacoes?ativo=1`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getClassificacoes(): Observable<ClassificacaoModels.Classificacao[]> {
    const url = `${this.basePepApi}/classificacoes`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  get(id: number): Observable<any> {
    const url = `${this.basePepApi}/classificacoes/${id}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getAll(): Observable<any[]> {
    const url = `${this.basePepApi}/classificacoes`
    return this.http.get<any[]>(url, this.optionsPepApi)
  }

  getAllbyDescricao(descricao): Observable<any[]> {
    const url = `${this.basePepApi}/classificacoes?descricao=` + descricao
    return this.http.get<any[]>(url, this.optionsPepApi)
  }

  post(classificacao: any): Observable<number> {
    const url = `${this.basePepApi}/classificacoes`
    return this.http.post<number>(url, classificacao, this.optionsPepApi)
  }

  put(
    id: number,
    classificacao: ClassificacaoModels.Classificacao
  ): Observable<ClassificacaoModels.Classificacao> {
    const url = `${this.basePepApi}/classificacoes/${id}`
    return this.http.put<any>(url, classificacao, this.optionsPepApi)
  }
}
