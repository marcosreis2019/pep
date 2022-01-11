import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'
import { PacienteModels } from './paciente.model'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { FilaAtendimentoModels } from '../fila-atendimento/fila-atendimento.model'
const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private baseAIS: string
  private baseAIS_V2: string
  private options: HttpOptions

  constructor(private http: HttpClient) {
    this.baseAIS = environment.API_AIS
    this.baseAIS_V2 = environment.API_AIS_V2
  }

  getPacienteByCpf(cpf?: string): Observable<Array<PacienteModels.Paciente>> {
    const url = `${this.baseAIS}/beneficiarios?cpfBenef=${cpf}`
    return this.http.get<Array<PacienteModels.Paciente>>(url, this.options).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro buscar os Pacientes', err)
      })
    )
  }

  getCidades(uf: string): Observable<PacienteModels.AISCidade[]> {
    const url = `${this.baseAIS_V2}/cidades?uf=` + uf
    return this.http.get<PacienteModels.AISCidade[]>(url, this.options).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro buscar os Pacientes', err)
      })
    )
  }

  post(paciente: PacienteModels.Paciente): Observable<any> {
    const url = `${this.baseAIS}/beneficiarios/incluir`
    return this.http.post<any>(url, paciente, this.options)
  }

  put(paciente: PacienteModels.Paciente): Observable<any> {
    const url = `${this.baseAIS}/beneficiarios/alterar`
    return this.http.post<any>(url, paciente, this.options)
  }
}
