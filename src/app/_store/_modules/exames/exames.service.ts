import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ExamesModels as Models } from './exames.models'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({ providedIn: 'root' })
export class ExamesService {
  private subs$ = new SubSink()
  private localId: string
  private baseRes: string
  private tokenRes: string
  private optionsRes: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseRes = environment.API_RES_V1

    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
        data => {
          this.tokenRes = data
          this.optionsRes = {
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

  getAll(mpi: string): Observable<Models.Exame[]> {
    const url = `${this.baseRes}/exames/${mpi}`
    return this.http.get<Models.Exame[]>(url, this.optionsRes)
  }

  getById(mpi: string, id?: string): Observable<Models.Exame> {
    const url = `${this.baseRes}/exames/${mpi}/${id}`
    return this.http.get<Models.Exame>(url, this.optionsRes)
  }

  post(mpi: string, ref?: Models.Exame): Observable<Models.Exame> {
    const url = `${this.baseRes}/exames/${mpi}`
    return this.http.post<Models.Exame>(url, ref, this.optionsRes)
  }

  put(mpi: string, exam?: Models.Exame): Observable<Models.Exame> {
    const id = 0
    // const id = ref._id
    // const version = ref._v

    const url = `${this.baseRes}/exames/${mpi}/${id}`

    const head = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenRes,
      'Base-ETag': '0'
    })

    const payload = {
      localAtendimento: this.localId
    }

    // return this.http.put<Models.Exame>(url, payload, { headers: head })
    return of(exam)
  }

  delete(mpi: string, id?: string, version?: number) {
    // TODO remove
    const url = `${this.baseRes}/exames/${mpi}/${id}`
    const head = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.tokenRes,
      'Base-ETag': version.toString()
    })

    return this.http.delete(url, { headers: head })
  }
}
