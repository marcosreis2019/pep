import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { GenericService } from '../../services/_utils.service'
import { environment } from 'src/environments/environment'
import { Profissional } from '../profissional/profissional.model'
import { ProfissionalActions } from '../profissional/profissional.actions'
import { CredenciaisActions } from '../credenciais/credenciais.action'
import { Observable } from 'rxjs'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

export interface Pessoa {
  _id: string
  _v: number
  mpi: string
  nomeCompleto: string
  nomeAbreviado: string
  nivelComplexidade: string
  sexo: string
  genero: string
  dataNascimento: string
  cpf: string
  fotoAvatar: string
  nomeMae: string
  estadoCivil: string
  grauInstrucao: string
}

interface ResponsePepApi {
  data
}
@Injectable({ providedIn: 'root' })
export class AuthService extends GenericService {
  private subs$ = new SubSink()
  private baseRes: string
  private mpi: string
  private token: string
  private usuarioAutenticado = false
  private basePepApi: string
  private restPepApi: string
  private optionsPepApi: HttpOptions
  private optionsRes: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    super()
    this.baseRes = environment.API_RES_V1
    this.basePepApi = environment.PEP_API
    this.restPepApi = environment.PEP_API.replace('pep/api', 'rest')
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
    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
        data => {
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

  login(usuario: string, senha: string): Observable<ResponsePepApi> {
    const url = `${this.restPepApi}/login`
    const payload = {
      usuario,
      senha,
      sistema_origem: 'PEP'
    }
    return this.http.post<ResponsePepApi>(url, payload, this.optionsPepApi)
  }

  logoff() {
    this.usuarioAutenticado = false
    this.store.dispatch(ProfissionalActions.setProfissional({ payload: undefined }))
    this.store.dispatch(CredenciaisActions.setMemedToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setMemedApi({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setMemedScript({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setPepApiToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setResToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setQdsToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setCanalToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setCanalApi({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setClicToken({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setClicApi({ payload: '' }))
    this.store.dispatch(CredenciaisActions.setTelemedicina({ payload: '' }))
  }

  changePassword(usuarioId: number, senha: string, novaSenha: string) {
    const url = `${this.basePepApi}/usuarios/${usuarioId}/alterarsenha`
    const payload = {
      senha,
      confirma_senha: novaSenha
    }
    return this.http.put<ResponsePepApi>(url, payload, this.optionsPepApi)
  }

  autenticado(valor: boolean) {
    this.usuarioAutenticado = valor
  }

  getUsuarioAutenticado() {
    return this.usuarioAutenticado
  }
}
