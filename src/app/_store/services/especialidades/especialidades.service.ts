import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { Observable } from 'rxjs'

export interface EspecialidadeModel {
  id: string
  descricao: string
  tipo: string
  ativo: boolean
  tipo_servicos: any[]
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  private base: string
  private options: HttpOptions
  private subs$ = new SubSink()
  private basePepApi: string
  private optionsPepApi: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.base = environment.API_RES
    this.basePepApi = environment.PEP_API

    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
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

  getAll(): Observable<any> {
    const url = `${this.basePepApi}/especialidades`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  async getWithFilter(key: string) {
    const url = `${this.base}/especialidades?descricao=${key}`
    return this.http
      .get<EspecialidadeModel[]>(url, this.options)
      .toPromise()
      .then(res => res)
      .catch(err => {
        console.error('Erro ao buscar as ESPECIALIDADES: ', err)
        return err
      })
  }
}
