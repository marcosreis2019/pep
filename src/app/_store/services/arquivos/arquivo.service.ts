import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { ArquivoModels } from 'src/app/_store/_modules/arquivo/arquivo.model'

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  private subs$ = new SubSink()
  private baseDigitalSigner
  private optionsPepApi: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseDigitalSigner = environment.QDS_URL_API
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

  getSignedUrl() {
    const url = `${this.baseDigitalSigner}/s3/signed-url`
    return this.http.get<ArquivoModels.SignedUrl>(url, this.optionsPepApi)
  }

  putFile(file, signedUrl) {
    const config = {
      headers: {
        'Content-Type': 'application/pdf'
      }
    }
    return this.http.put(signedUrl, file, config)
  }
}
