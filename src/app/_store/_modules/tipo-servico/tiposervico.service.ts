import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TipoServicoModels } from './tipo-servico.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class TipoServicoService {
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

  getTiposServicosbyDescricao(descricao): Observable<TipoServicoModels.TipoServicoPEPApi> {
    const url = `${this.basePepApi}/tipos-servicos?descricao=` + descricao
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getTiposServicos(): Observable<TipoServicoModels.TipoServicoPEPApi> {
    const url = `${this.basePepApi}/tipos-servicos?limit=1000`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getAll(): Observable<TipoServicoModels.TipoServicoPEPApi[]> {
    const url = `${this.basePepApi}/tipos-servicos?limit=1000`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getTiposServicosByLocalAndEspecialidade(
    locais: string,
    especialidades: string
  ): Observable<TipoServicoModels.TipoServicoPEPApi> {
    const url = `${this.basePepApi}/tipos-servicos?locais=${locais}&especialidades=${especialidades}&ativo=1`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(tipoServico: TipoServicoModels.TipoServicoPEPApi): Observable<number> {
    const url = `${this.basePepApi}/tipos-servicos`
    return this.http.post<number>(url, tipoServico, this.optionsPepApi)
  }

  put(tipoServico: TipoServicoModels.TipoServicoPEPApi): Observable<any> {
    const url = `${this.basePepApi}/tipos-servicos/${tipoServico.id}`
    return this.http.put<any>(url, tipoServico, this.optionsPepApi)
  }
}
