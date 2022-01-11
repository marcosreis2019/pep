import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({ providedIn: 'root' })
export class DocumentoDigitalAssinadoService {
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

  getDocumentosBySequencialAtendimento(seqAtendimento): Observable<any> {
    const url = `${this.basePepApi}/assinatura/documento/${seqAtendimento}`
    return this.http.get(url, this.optionsPepApi)
  }

  deleteDocument(docID): Observable<any> {
    const url = `${this.basePepApi}/assinatura/documento/${docID}`
    return this.http.delete(url, this.optionsPepApi)
  }
}
