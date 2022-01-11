import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { CronogramaModels } from './cronograma.model'
import { Observable } from 'rxjs'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class CronogramaService {
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

  getByMpi(profissionalMpi): Observable<CronogramaModels.CronogramaPEPApi> {
    const url = `${this.basePepApi}/cronogramas/${profissionalMpi}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getByProfissionalId(profissionalId): Observable<CronogramaModels.CronogramaPEPApi> {
    const url = `${this.basePepApi}/cronogramas/${profissionalId}/profissional`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getAllCronogramaByProfissional(profissionalId): Observable<CronogramaModels.Cronograma[]> {
    const url = `${this.basePepApi}/cronogramas/${profissionalId}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(cronograma: any): Observable<CronogramaModels.Cronograma> {
    const url = `${this.basePepApi}/cronogramas`
    return this.http.post<CronogramaModels.Cronograma>(url, cronograma, this.optionsPepApi)
  }

  put(cronograma: CronogramaModels.Cronograma): Observable<CronogramaModels.Cronograma> {
    const url = `${this.basePepApi}/cronogramas/${cronograma.id}`
    return this.http.put<any>(url, cronograma, this.optionsPepApi)
  }

  delete(cronogramas: any): Observable<any> {
    const options = {
      headers: this.optionsPepApi.headers,
      body: cronogramas,
    };
    const url = `${this.basePepApi}/cronogramas`
    return this.http.delete<any>(url, options)
  }
}
