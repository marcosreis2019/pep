import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
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

  getByLogin(login: string, roles: Array<string> = []): Observable<UsuarioModels.Usuario[]> {
    let paramRoles = ''
    if (roles && roles.length) {
      paramRoles = `&papeis=${roles.join(',')}`
    }
    const url = `${this.base}/usuarios?login=${login}${paramRoles}`
    return this.http.get<UsuarioModels.Usuario[]>(url, this.options)
  }

  get(id: number): Observable<UsuarioModels.Usuario> {
    const url = `${this.base}/usuarios/${id}`
    return this.http.get<UsuarioModels.Usuario>(url, this.options)
  }

  put(id: number, payload: UsuarioModels.UsuarioPut): Observable<any> {
    const url = `${this.base}/usuarios/${id}`
    return this.http.put(url, payload, this.options)
  }

  post(payload: UsuarioModels.UsuarioPost): Observable<any> {
    const url = `${this.base}/usuarios`
    return this.http.post(url, payload, this.options)
  }

  putBrowser(payload: UsuarioModels.UsuarioBrowser): Observable<any> {
    const url = `${this.base}/browser/usuarios`
    return this.http.put(url, payload, this.options)
  }

  putOnboarding(active: boolean): Observable<any> {
    const payload: UsuarioModels.PutOnboarding = {
      ativo: active
    }
    const url = `${this.base}/onboarding/usuarios`
    return this.http.put(url, payload, this.options)
  }
}
