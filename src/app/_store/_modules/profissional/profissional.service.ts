import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Profissional, ProfissionalModels } from './profissional.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class ProfissionalService {
  private subs$ = new SubSink()
  private basePepApi
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

  getProfissionalByName(name: string): Observable<Profissional> {
    const url = `${this.basePepApi}/profissional?nome=${name}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getProfissionalById(id: string): Observable<Profissional> {
    const url = `${this.basePepApi}/profissional/${id}`
    return this.http
      .get<any>(url, this.optionsPepApi)
      .pipe(map(r => (r ? { ...r, _id: id } : undefined)))
  }

  get(id: string): Observable<ProfissionalModels.ProfissionalSingleResponsePepApi> {
    const url = `${this.basePepApi}/profissional/${id}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getProfissionalByNameOrSpecialization(
    name: string
  ): Observable<ProfissionalModels.ProfissionalResponsePepApi> {
    const url = `${this.basePepApi}/profissional?nome_especialidade=${name}`
    return this.http.get<ProfissionalModels.ProfissionalResponsePepApi>(url, this.optionsPepApi)
  }

  getProfissionalByMpi(mpi: string): Observable<Profissional> {
    const url = `${this.basePepApi}/profissional/mpi=${mpi}`
    return this.http.get<any>(url, this.optionsPepApi).pipe(map(r => (r ? r[0] : undefined)))
  }

  getProfissionalForAgendador(
    agendadorId: number,
    search: string,
    local: number,
    roles: Array<string>,
    limit: number = 20
  ): Observable<ProfissionalModels.ProfissionalResponsePepApi> {
    const filterLocal = local ? `&local=${local}` : ''
    const filterRoles = roles && roles.length ? `&roles=${roles.join(',')}` : ''
    const url =
      `${this.basePepApi}/profissional` +
      `?nome_especialidade=${search}` +
      `&agendador=${agendadorId}&ativo=1&limit=${limit}` +
      filterLocal +
      filterRoles

    return this.http.get<ProfissionalModels.ProfissionalResponsePepApi>(url, this.optionsPepApi)
  }

  getAll(roles: Array<string>, nome: string): Observable<Profissional[]> {
    const filterNome = nome ? `&nome_completo=${nome}` : ''
    const filterRoles = roles && roles.length ? `&roles=${roles.join(',')}` : ''
    const url = `${this.basePepApi}/profissional?limit=15000${filterRoles}${filterNome}`
    return this.http.get<any[]>(url, this.optionsPepApi)
  }

  getInfoMemed(profissionalId: number): Observable<ProfissionalModels.ResponsePepApi> {
    const url = `${this.basePepApi}/profissional/${profissionalId}/infomemed`
    return this.http.get<ProfissionalModels.ResponsePepApi>(url, this.optionsPepApi)
  }

  put(id: number, payload: ProfissionalModels.ProfissionalPutPepApi): Observable<any> {
    const url = `${this.basePepApi}/profissional/${id}`
    return this.http.put<ProfissionalModels.ResponsePepApi>(url, payload, this.optionsPepApi)
  }

  post(payload: ProfissionalModels.ProfissionalPostPepApi): Observable<any> {
    const url = `${this.basePepApi}/profissional`
    return this.http.post<ProfissionalModels.ResponsePepApi>(url, payload, this.optionsPepApi)
  }
}
