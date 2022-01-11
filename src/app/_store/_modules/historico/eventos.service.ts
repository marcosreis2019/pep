import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import moment from 'moment-timezone'
import { Observable } from 'rxjs'
import { Responses } from '../../services/models.services'
import { HistoricoModels } from './historico.model'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions, HttpOptionsZip } from 'src/app/_store/_modules/http/http.model'

import { DomSanitizer } from '@angular/platform-browser'
const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private subs$ = new SubSink()
  private baseAIS: string
  private basePepApi: string
  private baseURLRES: string
  private optionsPepApi: HttpOptions
  private optionsPepApiZip: HttpOptionsZip
  private optionsRes: HttpOptions

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private store: Store<PEPState>
  ) {
    this.basePepApi = environment.PEP_API
    this.baseURLRES = environment.API_RES
    this.baseAIS = environment.API_AIS

    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
        data => {
          this.optionsPepApi = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${data}`
            })
          }
          this.optionsPepApiZip = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data
            }),
            responseType: 'blob'
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
              Authorization: `Bearer ${data}`
            })
          }
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  async post(
    mpi: string,
    atendimentoID?: number,
    evento?: HistoricoModels.Evento
  ): Promise<Responses> {
    const url = `${this.baseURLRES}/events/${mpi}/${atendimentoID}`
    return this.http
      .post(url, evento, this.optionsRes)
      .toPromise()
      .then(res => {
        return {
          status: 'OK',
          message: 'Atendimento registrado com sucesso!'
        }
      })
      .catch(this.errorHandlerPost)
  }

  getLatests(mpi: string): Promise<Responses> {
    const end = moment().tz(TMZ)
    const endAt = end.format()
    const start = end.subtract(18, 'months')
    const startAt = start.format()

    return this.getWithFilter(mpi, startAt, endAt)
  }

  getOperadoras(): any {
    const url = `${this.baseAIS}/operadoras`
    return this.http
      .get(url)
      .toPromise()
      .then(res => {
        return res
      })
      .catch(err => {
        console.error('erro = ', err)
        return {
          status: 'error',
          message: 'Ops! Poderia reenviar o pedido de buscar as operadoras!'
        }
      })
  }

  postRelatorioFiltroFaturamento(data: any): Observable<any> {
    const url = `${this.basePepApi}/xml/tiss`
    return this.http.post(url, data, {
      ...this.optionsPepApiZip,
      responseType: 'blob'
    })
  }

  getPacientesPorMPI(mpis: Array<string>): Promise<Responses> {
    const url = `${this.baseAIS}/pacientes`
    return this.http
      .post(url, mpis, this.optionsRes)
      .toPromise()
      .then((res: any) => {
        if (res.length) {
          return { status: 'OK', data: res }
        }
        return {
          status: 'OK',
          message: 'Nenhum paciente encontrado',
          data: []
        }
      })
      .catch(err => {
        return {
          status: 'error',
          message: 'Serviço de eventos indisponível no momento ' + err
        }
      })
  }

  async getRelatorioAtendimento(
    startAt: string, // YYYY-mm-DD
    endAt: string, // YYYY-mm-DD
    locais: any[]
  ): Promise<Responses> {
    if (!locais || !locais.length) {
      return {
        status: 'error',
        message: 'É necessário informar um ou mais locais de atendimento!'
      }
    }
    if (!startAt || !endAt) {
      return {
        status: 'error',
        message: 'É necessário informar a data de início e fim!'
      }
    }
    const url = `${this.baseURLRES}/events/relatorioAtendimento?locais=${locais.join(
      ','
    )}&dataInicio=${startAt}&dataFim=${endAt}`

    return this.http
      .get(url, this.optionsRes)
      .toPromise()
      .then((res: any) => {
        if (res.length) {
          return { status: 'OK', data: res }
        }
        return {
          status: 'OK',
          message: 'Nenhum evento registrado até o momento',
          data: []
        }
      })
      .catch(err => {
        console.error(err)
        return {
          status: 'error',
          message: 'Não foi possível gerar relatório de atendimento, tente novamente mais tarde!'
        }
      })
  }

  async getBySequence(sequence?: number): Promise<Responses> {
    let url = `${this.baseURLRES.replace('/v1', '')}/events/sequence/${sequence}`

    return this.http
      .get(url, this.optionsRes)
      .toPromise()
      .then((res: any) => {
        if (res.length) {
          return { status: 'OK', data: res }
        }
        return {
          status: 'OK',
          message: 'Nenhum evento registrado até o momento',
          data: []
        }
      })
      .catch(() => {
        return {
          status: 'error',
          message: 'Serviço de eventos indisponível no momento'
        }
      })
  }

  getLocaisByIdProfissional(idProfissional): Observable<any> {
    let url = `${this.basePepApi}/locais/${idProfissional}/profissional`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  async getWithFilter(
    mpi: string,
    startAt?: string, // YYYY-mm-DD
    endAt?: string, // YYYY-mm-DD
    type?: string,
    nameProfissional?: string,
    nameSpecialt?: string
  ): Promise<Responses> {
    let url = `${this.baseURLRES}/events/${mpi}?1=1&`

    const end = moment().tz(TMZ)
    const endAtAux = end.format()
    const start = end.subtract(18, 'months')
    const startAtAux = start.format()

    if (startAt) {
      url += `&dataInicio=${startAt}`
    } else {
      url += `&dataInicio=${startAtAux}`
    }
    if (endAt) {
      url += `&dataFim=${endAt}`
    } else {
      url += `&dataFim=${endAtAux}`
    }
    if (type) {
      url += `&tipo=${type}`
    }
    if (nameProfissional) {
      url += `&nomeProfissional=${nameProfissional}`
    }
    if (nameSpecialt) {
      url += `&nomeEspecialidade=${nameSpecialt}`
    }

    return this.http
      .get(url, this.optionsRes)
      .toPromise()
      .then((res: any) => {
        if (res.length) {
          return { status: 'OK', data: res }
        }
        return {
          status: 'OK',
          message: 'Nenhum evento registrado até o momento',
          data: []
        }
      })
      .catch(() => {
        return {
          status: 'error',
          message: 'Serviço de eventos indisponível no momento'
        }
      })
  }

  private errorHandlerPost(e: any) {
    let msg = `Não conseguimos finalizar este atendimento.`

    if (!e || !e.error) {
      msg = `Não conseguimos finalizar este atendimento devido à algum erro inesperado. \n\n
      Por favor, tente realizar finalizar novamente e caso o erro persista entre em contato com nosso suporte`
      return {
        status: 'error',
        message: msg
      }
    }

    if (e.error.includes('.localAtendimento')) {
      msg += `\n\nPor favor, verifique se dado referente ao local de atendimento informado pela url é um campo válido`
    }

    if (e.error.includes('.profissional')) {
      msg += `\n\nPor favor, verifique se dado referente ao profissional informado pela url é um campo válido`
    }

    return {
      status: 'error',
      message: msg
    }
  }
}
