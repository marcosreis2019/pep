import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { EspecialidadeModels } from './especialidade.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {
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

  getEspecialidadeByDescricao(descricao): Observable<EspecialidadeModels.Especialidade> {
    const url = `${this.basePepApi}/especialidades?descricao=` + descricao
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getAllEspecialidades(): Observable<EspecialidadeModels.Especialidade[]> {
    const url = `${this.basePepApi}/especialidades?limit=1000`
    return this.http.get<EspecialidadeModels.Especialidade[]>(url, this.optionsPepApi)
  }

  getAll(descricao: string): Observable<EspecialidadeModels.Especialidade[]> {
    const url = `${this.basePepApi}/especialidades?limit=1000&descricao=` + descricao
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getTiposServicosByLocalAndEspecialidade(
    locais: string,
    especialidades: string
  ): Observable<EspecialidadeModels.Especialidade> {
    const url = `${this.basePepApi}/especialidades?locais=${locais}&especialidades=${especialidades}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(especialidade: any): Observable<{ data: number }> {
    const url = `${this.basePepApi}/especialidades`
    return this.http.post<{ data: number }>(url, especialidade, this.optionsPepApi)
  }

  put(especialidadeId: number, especialidade: EspecialidadeModels.Especialidade): Observable<any> {
    const url = `${this.basePepApi}/especialidades/${especialidadeId}`
    return this.http.put<any>(url, especialidade, this.optionsPepApi)
  }
}
