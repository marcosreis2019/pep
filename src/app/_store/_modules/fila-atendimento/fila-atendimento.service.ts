import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubSink } from 'subsink';
import { PEPState } from '../../store.models';
import { CredenciaisSelect } from '../credenciais/credenciais.selector';
import { HttpOptions } from '../http/http.model';
import {FilaAtendimentoModels} from './fila-atendimento.model'
const TMZ = 'America/Sao_Paulo'

@Injectable({
  providedIn: 'root'
})
export class FilaAtendimentoService {
  private baseAIS: string
  private basePepApiFila: string
  private subs$ = new SubSink()
  private optionsPepApi: HttpOptions
  private headerGetToken: HttpOptions

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseAIS = environment.API_AIS
    this.basePepApiFila = environment.PEP_API_FILA
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json' ,
        'Authorization': 'Bearer 893355ff-7548-4a14-ae78-d8940ced2aea' ,
        'Accept' : 'application/json'
      })
    };

    this.subs$.add(
      this.store.select(CredenciaisSelect.pepApiToken).subscribe(
        data => {
          this.optionsPepApi = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer d7bbed8f-3d22-4348-bf9a-3f671e6bc042' ,
            })
          }
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  populaHeader () {
    this.headerGetToken = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic Y2xpZW50LWlkOmE2Zjg2NDdmODJkN2JjNDBlMjBjNmZkMjQyN2U3MjZi'
      })
    }

    const url = `https://gfatest.asq.com.br/gfa/oauth/token?grant_type=password&username=admin&password=admin`;
    return this.http.get(url,this.headerGetToken);
  }

  setToken(token) {
    this.optionsPepApi = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}` ,
      })
    }
  }

  getAtendimento(token): Observable<Array<FilaAtendimentoModels.FilaAtendimento>>{
    this.optionsPepApi = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` ,
      })
    }

    const url =  `${this.basePepApiFila}/list`;
    return this.http.get<Array<FilaAtendimentoModels.FilaAtendimento>>(url, this.optionsPepApi)
  }

  getAtendimentoId(idAtendimento: number): Observable<FilaAtendimentoModels.ResponseAtendimento>{
    const url = `${this.basePepApiFila}/start/${idAtendimento}`;
    return this.http.get<FilaAtendimentoModels.ResponseAtendimento>(url);
  }

  updateAtendimento(idAtendimento): Observable<any>{
    const url = `${this.basePepApiFila}/start`;
    const body = {id: idAtendimento }
    return this.http.post<any>(url, body, this.optionsPepApi)
  }

  getCodigoOperadora(mpi: string): Observable<FilaAtendimentoModels.Paciente[]> {
    const url = `${this.baseAIS}/beneficiarios?dsMpi=${mpi}`
    return this.http.get<FilaAtendimentoModels.Paciente[]>(url)
  }

  atualizar(idPaciente: number, paciente: FilaAtendimentoModels.FilaAtendimento): Observable<FilaAtendimentoModels.FilaAtendimento>{
    const url = `${this.basePepApiFila}/attendances/${idPaciente}`;
    return this.http.put<FilaAtendimentoModels.FilaAtendimento>(url, paciente)
  }
}
