import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'
import { merge, concat, combineLatest } from 'rxjs'
import { combineAll, map } from 'rxjs/operators'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

export interface CidModel {
  _id: string
  codigo: string
  descricao: string
  referencias: string
  ativo: boolean
  dataCriacao?: string
  _v?: number
}

@Injectable({
  providedIn: 'root'
})
export class CidService {
  private subs$ = new SubSink()
  private base: string
  private options: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.base = environment.API_RES_V1

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
  }

  async get(key: string) {
    return merge([this.getByDecription(key), this.getByCode(key)])
      .pipe(
        combineAll(),
        map((r: [][]) => r[0].concat(r[1]))
      )
      .toPromise()
      .catch(err => {
        console.error('Erro ao pegar CIDs: ', err)
        return err
      })
  }

  private getByDecription(desc: string) {
    const url = `${this.base}/cid?descricao=${desc}`
    return this.http.get<CidModel[]>(url, this.options)
  }

  private getByCode(code: string) {
    const url = `${this.base}/cid?codigo=${code}`
    return this.http.get<CidModel[]>(url, this.options)
  }
}
