import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BeneficiarioModels as Models } from './beneficiario.model'
import { environment } from 'src/environments/environment'
import { Responses } from '../../services/models.services'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({ providedIn: 'root' })
export class BeneficiarioService {
  private subs$ = new SubSink()
  private optionsRes: HttpOptions
  private baseRes: string
  private baseAIS: string
  private tokenRes: string

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseRes = environment.API_RES_V1
    this.baseAIS = environment.API_AIS

    this.subs$.add(
      this.store.select(CredenciaisSelect.resToken).subscribe(
        data => {
          this.tokenRes = data
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

  get(mpi: string): Observable<Models.DadosPessoais> {
    const url = `${this.baseAIS}/paciente?mpi=${mpi}`
    return this.http.get<any>(url)
  }

  getWithMPI(mpi: string): Promise<Responses> {
    let url = `${this.baseAIS}/paciente?mpi=${mpi}`
    return this.http
      .get(url)
      .toPromise()
      .then((p: any) => {
        return { status: 'OK', data: p }
      })
      .catch(() => {
        return {
          status: 'error',
          message: 'Serviço de integraçao indisponível no momento'
        }
      })
  }

  getByName(name: string, operadoras: string = '') {
    const paramOperadoras = operadoras ? `&operadoras=${operadoras}` : ''
    const url = `${this.baseAIS}/pacientes?nomeCompleto=${name}&limit=20${paramOperadoras}`
    return this.http.get<any>(url).pipe(map(beneficiario => beneficiario))
  }

  getBeneficiarioByNome(name: string) {
    const url = `${this.baseAIS}/beneficiarios?nomeBenef=${name}&limit=20`
    return this.http.get<any>(url).pipe(map(beneficiario => beneficiario))
  }

  getByMpiBeneficiarios(mpi: string) {
    const url = `${this.baseAIS}/beneficiarios?dsMpi=${mpi}`
    return this.http.get<any>(url).pipe(map(beneficiario => beneficiario))
  }

  // TODO add types
  getFamily(mpi?: string): Observable<any> {
    const url = `${this.baseRes}/dependentes/${mpi}`
    return this.http.get<any>(url, this.optionsRes)
  }

  // TODO add type
  getTags(mpi: string): Observable<any[]> {
    const url = `${this.baseRes.replace('/v1', '')}/pessoasTags/${mpi}`
    return this.http.get<any>(url, this.optionsRes)
  }

  //  Medicamentos
  getAllMedicamentos(mpi?: string): Observable<Models.Medicamento[]> {
    const url = `${this.baseRes.replace('/v1', '')}/medicamentos/${mpi}`
    return this.http.get<Models.Medicamento[]>(url, this.optionsRes).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro buscar os Medicamentos', err)
      })
    )
  }

  postMedicamento(medicamento: Models.Medicamento, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/medicamentos/${mpi}`
    return this.http.post<any>(url, medicamento, this.optionsRes)
  }

  putMedicamento(medication: Models.Medicamento, mpi: string): Observable<any> {
    if (medication) {
      const url = `${this.baseRes.replace('/v1', '')}/medicamentos/${medication._id}`

      const payload = { ...medication }

      delete payload._id
      delete payload._v
      delete payload.dataCriacao

      return this.http.put<any>(url, payload, this.optionsRes)
    } else {
      console.error(
        'Erro ao alterar medicamento. O medicamento recebido não é valido: ',
        medication
      )
    }
  }

  deleteMedicamento(medicamento: Models.Medicamento, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/medicamentos/${medicamento._id}`
    return this.http.delete<any>(url, this.optionsRes)
  }

  deleteAllMedicamentos(list: Models.Medicamento[], mpi: string) {
    list.forEach(med => {
      const url = `${this.baseRes}/medicamentos/${mpi}/${med._id}`
      const options = {
        headers: new HttpHeaders({
          Authorization: this.tokenRes,
          'Content-Type': 'application/json',
          'Base-ETag': med._v + ''
        })
      }
      // options.headers.append()
      return this.http.delete(url, options).subscribe()
    })
  }

  // Condiçoes
  getAllCondicao(mpi?: string): Observable<Models.Condicao[]> {
    const url = `${this.baseRes.replace('/v1', '')}/condicoes/${mpi}`
    return this.http.get<Models.Condicao[]>(url, this.optionsRes).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro buscar as Condições', err)
      })
    )
  }

  postCondicao(condicao: Models.CondicaoPost, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/condicoes/${mpi}`
    return this.http.post<any>(url, condicao, this.optionsRes)
  }

  putCondicao(condicao: Models.Condicao, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/condicoes/${condicao._id}`
    const payload = { ...condicao }

    delete payload.dataCriacao

    return this.http.put<any>(url, payload, this.optionsRes).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro ao alterar a condição: ', err)
      })
    )
  }

  deleteCondicao(condicao: Models.Condicao, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/condicoes/${condicao._id}`
    return this.http.delete<any>(url, this.optionsRes)
  }

  // Alergias
  getAllAlergia(mpi?: string, tipo?: string, agente?: string): Observable<Models.Alergia[]> {
    let url = `${this.baseRes.replace('/v1', '')}/alergias/${mpi}`

    url = tipo ? url + `tipo=${tipo}&` : url
    url = agente ? url + `agente=${agente}&` : url

    return this.http.get<Models.Alergia[]>(url, this.optionsRes).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro buscar as Alergias', err)
      })
    )
  }

  postAlergia(alergia: Models.AlergiaPost, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/alergias/${mpi}`
    return this.http.post<any>(url, alergia, this.optionsRes).pipe(
      catchError(err => {
        return throwError('Ocorreu um erro ao salvar a Alergia', err)
      })
    )
  }

  deleteAlergia(alergia: Models.Alergia, mpi: string): Observable<any> {
    const url = `${this.baseRes.replace('/v1', '')}/alergias/${alergia._id}`
    return this.http.delete<any>(url, this.optionsRes)
  }

  getPrescricoes(mpi: string): any {
    const url = `${this.baseRes}/prescricao/${mpi}`

    return this.http.get<any>(url, this.optionsRes).pipe(
      catchError(() => {
        return throwError('Serviço de prescricoes indisponível no momento!')
      })
    )
  }

  postPrescricao(mpi: string, data, atendimento) {
    const url = `${this.baseRes}/prescricao/${mpi}`
    data.data.atendimento = atendimento
    return this.http
      .post(url, data, this.optionsRes)
      .toPromise()
      .then(_ => {
        return {
          status: 'OK',
          message: 'Prescrição adicionada!'
        }
      })
      .catch(() => {
        return {
          status: 'error',
          message: 'Erro ao adicionar a prescrição.'
        }
      })
  }
}
