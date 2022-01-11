import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'

import { merge, Observable } from 'rxjs'
import { combineAll, map, switchMap } from 'rxjs/operators'

import { LocalAtendimentoModels } from './local.model'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private subs$ = new SubSink()
  private basePepApi: string
  private optionsPepApi: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.basePepApi = environment.PEP_API
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

  getAll(): Observable<LocalAtendimentoModels.LocaisAtendimentoPepApi> {
    const url = `${this.basePepApi}/locais?limit=200`
    return this.http.get<LocalAtendimentoModels.LocaisAtendimentoPepApi>(url, this.optionsPepApi)
  }

  getAllByDescricao(nome: string): Observable<LocalAtendimentoModels.LocaisAtendimentoPepApi> {
    const url = `${this.basePepApi}/locais?limit=200&nome=${nome}`
    return this.http.get<LocalAtendimentoModels.LocaisAtendimentoPepApi>(url, this.optionsPepApi)
  }

  getLocalById(id: number): Observable<LocalAtendimentoModels.LocalAtendimentoPepApi> {
    const url = `${this.basePepApi}/locais/${id}`
    return this.http.get<LocalAtendimentoModels.LocalAtendimentoPepApi>(url, this.optionsPepApi)
  }

  getLocaisProfissionalAgendador(
    profissionalId: number,
    agendadorId: number
  ): Observable<LocalAtendimentoModels.LocalAtendimentoComboPepApi> {
    const url = `${this.basePepApi}/locais/${profissionalId}/agendador/${agendadorId}`
    return this.http.get<LocalAtendimentoModels.LocalAtendimentoComboPepApi>(
      url,
      this.optionsPepApi
    )
  }

  getRelatorioDiasLivres(localId: number, dataInicio: string, dataFim: string): Observable<any> {
    const url = `${this.basePepApi}/locais/${localId}/diaslivres/${dataInicio}/${dataFim}`
    return this.http.get(url, this.optionsPepApi)
  }

  getCidadeByUf(uf: string): Observable<any> {
    const url = `${this.basePepApi}/uf/municipios/${uf}`
    return this.http.get(url, this.optionsPepApi)
  }

  post(local: any): Observable<LocalAtendimentoModels.Local> {
    const url = `${this.basePepApi}/locais`
    return this.http.post<LocalAtendimentoModels.Local>(url, local, this.optionsPepApi)
  }

  put(local: LocalAtendimentoModels.Local): Observable<LocalAtendimentoModels.Local> {
    const url = `${this.basePepApi}/locais/${local.id}`
    return this.http.put<any>(url, local, this.optionsPepApi)
  }
}
