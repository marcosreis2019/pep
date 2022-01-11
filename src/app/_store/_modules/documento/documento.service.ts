import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../../../../environments/environment'
import { DocumentoModels } from './documento.model'
import { Observable } from 'rxjs'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
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

  getDocById(id): Observable<DocumentoModels.Documento> {
    const url = `${this.basePepApi}/documentos/${id}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getTipos(): Observable<DocumentoModels.DocumentoTipoPEPApi> {
    const url = `${this.basePepApi}/tipos/documentos`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getRelatorioByTipo(
    tiposId: number[],
    dataInicio: string,
    dataFim: string,
    localId: number
  ): Observable<DocumentoModels.DocumentoTipoPEPApi> {
    const url =
      `${this.basePepApi}/relatorio/documentos/tipos?tipos_id=${tiposId.join(',')}` +
      `&data_inicio=${dataInicio}&data_fim=${dataFim}&local_id=${localId}`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  post(documento: DocumentoModels.Documento): Observable<any> {
    const url = `${this.basePepApi}/documentos`
    return this.http.post<any>(url, documento, this.optionsPepApi)
  }
}
