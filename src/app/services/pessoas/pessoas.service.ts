import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { PessoaModels } from 'src/app/_store/_modules/pessoa/pessoa.model'

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
  private base: string
  private options: HttpOptions
  private subs$ = new SubSink()

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.base = environment.PEP_API

    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
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

  getAll() {
    const url = `${this.base}/pessoas`
    return this.http.get<PessoaModels.Pessoa[]>(url, this.options)
  }

  getByName(name: string): Observable<PessoaModels.Pessoa[]> {
    const url = `${this.base}/pessoas?nome=${name}`
    return this.http.get<PessoaModels.Pessoa[]>(url, this.options)
  }
}
