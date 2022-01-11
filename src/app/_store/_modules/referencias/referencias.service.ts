import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable, of } from 'rxjs'
import { Responses } from '../../services/models.services'
import { ReferenciasModels as Models } from './referencias.models'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({ providedIn: 'root' })
export class ReferenciasService {
  private subs$ = new SubSink()
  private localId: string
  private base: string
  private token: string
  private options: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.base = environment.API_RES
    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
        data => {
          this.token = 'Bearer ' + data
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

  getAll(mpi: string, offset: number, limit: number): Observable<Models.Referencia[]> {
    const url = `${this.base}/referencias/${mpi}?_offset=${offset}&_limit=${limit}`
    return this.http.get<Models.Referencia[]>(url, this.options)
  }

  getById(mpi: string, id: string): Observable<any> {
    const url = `${this.base}/referencias/${mpi}/${id}`
    return this.http.get<any>(url, this.options)
  }

  getAllByFiltro(
    mpi: string,
    offset: number,
    limit: number,
    filtro: Models.ReferenciaHistoricoFiltro
  ): Observable<Models.Referencia[]> {
    let url = `${this.base}/referencias/${mpi}?_offset=${offset}&_limit=${limit}`
    if (filtro) {
      if (filtro.dataRealizacao) {
        url += '&dataRealizacao=' + filtro.dataRealizacao
      }
      if (filtro.dataRealizacaoFim) {
        url += '&dataRealizacaoFim=' + filtro.dataRealizacaoFim
      }
      if (filtro.dataRealizacaoInicio) {
        url += '&dataRealizacaoInicio=' + filtro.dataRealizacaoInicio
      }
      if (filtro.especialidade && filtro.especialidade.length >= 3) {
        url += '&especialidade=' + filtro.especialidade
      }
    }
    return this.http.get<Models.Referencia[]>(url, this.options)
  }

  post(mpi: string, ref?: Models.ReferenciaPost): Observable<Models.Referencia> {
    const url = `${this.base}/referencias/${mpi}`
    return this.http.post<Models.Referencia>(url, ref, this.options)
  }

  put(mpi: string, ref?: Models.Referencia, xref?: Models.ReferenciaPut): Promise<Responses> {
    const id = ref._id
    const version = ref._v

    const url = `${this.base}/referencias/${id}`

    const body = {
      dataRealizacaoContraReferencia: xref.dataRealizacaoContraReferencia,
      textoContraReferencia: xref.textoContraReferencia,
      localAtendimento: this.localId
    }

    const head = new HttpHeaders({
      Authorization: this.token,
      'Content-Type': 'application/json',
      'Base-ETag': version.toString()
    })

    return this.http
      .put(url, body, { headers: head })
      .toPromise()
      .then((r: any) => {
        return { status: 'OK', data: r }
      })
      .catch((r: any) => {
        return {
          status: 'error',
          message: 'Serviço de eventos indisponível no momento',
          data: r.error
        }
      })
  }
}
