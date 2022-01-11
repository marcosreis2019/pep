import { Injectable } from '@angular/core'
import { Email } from './email.model'
import { Sms } from './sms.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class CoreService {
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

  enviaEmail(email: Email): Observable<any> {
    const url = `${this.basePepApi}/email`
    return this.http.post<any>(url, email, this.optionsPepApi)
  }

  enviaSms(sms: Sms): Observable<any> {
    const url = `${this.basePepApi}/sms`
    return this.http.post<any>(url, sms, this.optionsPepApi)
  }
}
