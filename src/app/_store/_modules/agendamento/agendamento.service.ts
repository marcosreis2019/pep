import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { AgendamentoModels as Models, AgendamentoModels } from './agendamento.model'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions, HttpOptionsZip } from 'src/app/_store/_modules/http/http.model'

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private subs$ = new SubSink()
  private urlPepApi: string
  private optionsPepApi: HttpOptions
  private optionsPepApiZip: HttpOptionsZip

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.urlPepApi = environment.PEP_API
    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
        data => {
          this.optionsPepApiZip = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data
            }),
            responseType: 'blob'
          }
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

  getAgendamentos(
    dataInicio: string,
    dataFim: string,
    profissionalId: number,
    agendadorId: number,
    localId: number,
    tipo_servico_id: number,
    not_status: string
  ): Observable<Models.Agendamento> {
    let url = `${this.urlPepApi}/agendamentos?data_inicio=${dataInicio}&data_fim=${dataFim}&profissional_id=${profissionalId}&agendador_id=${agendadorId}&not_status=${not_status}`
    if (localId) {
      url += `&local_id=${localId}`
    }

    if (tipo_servico_id) {
      url += `&tipo_servico_id=${tipo_servico_id}`
    }
    return this.http.get<any>(url, this.optionsPepApi)
  }

  postAgendamento(agendamento: AgendamentoModels.AgendamentoPost): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos`
    return this.http.post(url, agendamento, this.optionsPepApi)
  }

  putAgendamento(id: number, agendamento: AgendamentoModels.AgendamentoUpdate): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}`
    return this.http.put(url, agendamento, this.optionsPepApi)
  }

  setSequencialToAgendamento(id: number, sequencial: number): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}/vincular-atendimento`
    const sequencialTemp = {
      sequencial_atendimento: sequencial
    }
    return this.http.put(url, sequencialTemp, this.optionsPepApi)
  }

  cancelarAgendamento(id: number): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}/cancelar`
    return this.http.put(url, {}, this.optionsPepApi)
  }

  deleteAgendamento(id: number): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}`
    return this.http.delete(url, this.optionsPepApi)
  }

  getTiposAgendamento(): Observable<Array<AgendamentoModels.TipoAgendamento>> {
    let url = `${this.urlPepApi}/tipos/agendamentos`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  getStatusAgendamento(): Observable<Array<AgendamentoModels.StatusAgendamento>> {
    let url = `${this.urlPepApi}/status/agendamentos`
    return this.http.get<any>(url, this.optionsPepApi)
  }

  setStatusRealizado(id): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}/realizado`
    return this.http.put(url, {}, this.optionsPepApi)
  }

  setStatusIniciado(id): Observable<any> {
    const url = `${this.urlPepApi}/agendamentos/${id}/iniciado`
    return this.http.put(url, {}, this.optionsPepApi)
  }

  getRelatorioEmEspera(dataInicio, dataFim, localId): Observable<any> {
    const url = `${this.urlPepApi}/relatorios/agendamentos/emespera?data_inicio=${dataInicio}&data_fim=${dataFim}&local_id=${localId}`
    return this.http.get(url, this.optionsPepApi)
  }

  getRelatorioAgendamentosLocais(
    startDate: string,
    endDate: string,
    locais: Array<number>
  ): Observable<any> {
    let payload = {
      data_inicio: startDate,
      data_fim: endDate,
      locais
    }
    const url = `${this.urlPepApi}/relatorios/agendamentos/locais`
    return this.http.post(url, payload, this.optionsPepApi)
  }

  getRelatorioAgendamentosPaciente(
    startDate: string,
    endDate: string,
    mpiPaciente: string
  ): Observable<any> {
    let url = `${this.urlPepApi}/relatorios/agendamentos/paciente?data_inicio=${startDate}&data_fim=${endDate}&mpi_paciente=${mpiPaciente}`

    return this.http.get<any>(url, this.optionsPepApi)
  }

  getRelatorioAgendamentoEvento(
    startDate: string,
    endDate: string,
    update: boolean
  ): Observable<any> {
    const doUpdate = update ? `&update=1` : ''
    let url = `${this.urlPepApi}/auditoria/agendamentos/eventos?data_inicio=${startDate}&data_fim=${endDate}${doUpdate}`

    return this.http.get<any>(url, this.optionsPepApi)
  }

  transferir(
    profissionalOrigemId: number,
    profissionalDestinoId: number,
    localId: number,
    dataInicio: string,
    dataFim: string
  ) {
    let payload = {
      profissional_origem_id: profissionalOrigemId,
      profissional_destino_id: profissionalDestinoId,
      data_inicio: dataInicio,
      data_fim: dataFim,
      local_id: localId
    }
    const url = `${this.urlPepApi}/transferir/agendamentos`
    return this.http.post(url, payload, this.optionsPepApi)
  }
}
