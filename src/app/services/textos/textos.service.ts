import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { TextoModels } from 'src/app/_store/_modules/texto/texto.model'

@Injectable({
  providedIn: 'root'
})
export class TextosService {
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

  get(codigo: string): Observable<TextoModels.Texto> {
    const url = `${this.base}/textos/${codigo}`
    return this.http.get<TextoModels.Texto>(url, this.options)
  }
}
