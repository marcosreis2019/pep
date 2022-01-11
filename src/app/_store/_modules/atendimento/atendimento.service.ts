import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { environment } from 'src/environments/environment'

import { EMPTY, merge, Observable, of } from 'rxjs'
import { catchError, combineAll, map, switchMap, switchMapTo, tap } from 'rxjs/operators'

import { LocalAtendimentoModels } from '../local/local.model'
import { Profissional } from '../profissional/profissional.model'
import { AtendimentoModel } from './atendimento.model'
import { QuestionariosModels as Models } from 'src/app/_store/_modules/atendimento/atendimento.questionario.model'
import { BeneficiarioModels } from '../beneficiario/beneficiario.model'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { HttpOptions } from 'src/app/_store/_modules/http/http.model'

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private subs$ = new SubSink()
  static postAssDocBase64: any
  private baseURLAIS
  private baseURLRES
  private baseURLRESV1
  private baseURLPEPAPI
  private baseQdsApi
  private restPepApi
  private optionsRes: HttpOptions
  private optionsPepApi: HttpOptions
  private optionsQds: HttpOptions

  // private codOperadoraSIM = '1055'

  constructor(private http: HttpClient, private store: Store<PEPState>) {
    this.baseURLAIS = environment.API_AIS
    this.baseURLRES = environment.API_RES
    this.baseURLRESV1 = environment.API_RES_V1
    this.baseURLPEPAPI = environment.PEP_API
    this.baseQdsApi = environment.QDS_URL_API
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

    this.subs$.add(
      this.store.select(CredenciaisSelect.qdsToken).subscribe(
        data => {
          this.optionsQds = {
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

  start(beneficiario: BeneficiarioModels.DadosPessoais): Observable<any> {
    const url = `${this.baseURLRES}/atendimentos`
    return this.http.post<any>(url, beneficiario, this.optionsRes).pipe(
      switchMap(r => {
        return of(r)
      })
    )
  }

  getAtendimentoSequential(): Observable<any> {
    const url = `${this.baseURLRES}/events/sequence`
    return this.http.get(url, this.optionsRes).pipe(
      map(data => {
        return data
      })
    )
  }

  finalizar(atendimento: AtendimentoModel.ParaAPI, id: string, mpi: string): Observable<any> {
    let url = `${this.baseURLRES}/events/${mpi}/${id}`
    return this.http.post(url, atendimento, this.optionsRes)
  }

  getDeterminantes(mpi: string): Observable<Models.DeterminantesResponse[]> {
    const url = `${this.baseURLAIS}/determinantes/beneficiarios?dsMpi=${mpi}`
    return this.http.get<any>(url)
  }

  getQuestionarios(ids: string[]): Observable<Models.Questionario[]> {
    const obsArr = ids.map(i => this.getQuestionario(i))
    return merge(obsArr).pipe(combineAll())
  }

  // TODO add if to return empty
  private getQuestionario(id: string | number): Observable<any> {
    const url = `${this.baseURLAIS}/questionarios/${id}`
    return this.http.get<any>(url).pipe(
      catchError(err => {
        console.error(`Erro ao buscar id do atendimento: ${err}`)
        return of(err)
      })
    )
  }

  postRespostas(codigo: number, mpi: string, quest: Models.Answers[]) {
    const obsArr = quest.map(q => {
      const res = q.answers.map(a => a.paraAPI).reverse()
      return this.postQuestionarioResposta(codigo, mpi, q.form_id, res)
    })

    return merge(obsArr).pipe(combineAll())
  }

  pdfUpload(pdfBlob) {
    const url = `${this.baseQdsApi}/upload`
    let formData: FormData = new FormData()
    formData.append('userfile', pdfBlob, 'filename.pdf')
    return this.http.post(url, formData, {}).pipe(map(data => data))
  }

  getDocumentList(fileId) {
    const url = `${this.baseQdsApi}/s3/${fileId}`
    return this.http.get(url, this.optionsQds)
  }

  getSigners(fileId): Observable<any> {
    const url = `${this.baseQdsApi}/signers?fileId=${fileId}`
    return this.http.get(url, this.optionsQds)
  }

  private postQuestionarioResposta(
    codOperadora: number,
    mpi: string,
    form_id: number,
    answers: Models.Resposta[]
  ) {
    const url = `${this.baseURLAIS}/operadoras/${codOperadora}/questionarios/${form_id}/respostas?dsMpi=${mpi}`
    return this.http.post(url, answers)
  }

  postEstratificacao(codOperadora: number, mpi: string): Observable<Models.Estratificacao[]> {
    const url = `${this.baseURLAIS}/estratificacao/inicializacao`
    const payload = { cdOperadora: '' + codOperadora, mpi }
    return this.http.post<any>(url, payload)
  }

  // Profissional
  getProfissionalByName(name: string): Observable<Profissional> {
    const url = `${this.baseURLRES}/profissionais?nome=${name}`
    return this.http.get<any>(url, this.optionsRes)
  }

  getProfissionalById(id: string): Observable<Profissional> {
    const url = `${this.baseURLRES}/profissionais/${id}`
    return this.http
      .get<any>(url, this.optionsRes)
      .pipe(map(r => (r ? { ...r, _id: id } : undefined)))
  }

  getProfissionalByMpi(mpi: string): Observable<Profissional> {
    const url = `${this.baseURLRES}/profissionais/mpi=${mpi}`
    return this.http.get<any>(url, this.optionsRes).pipe(map(r => (r ? r[0] : undefined)))
  }

  // Local
  getLocalById(id: string): Observable<LocalAtendimentoModels.LocalAtendimento> {
    const url = `${this.baseURLRESV1}/locaisAtendimento/${id}`
    return this.http.get<LocalAtendimentoModels.LocalAtendimento>(url, this.optionsRes)
  }

  getLocalByCNES(cnes: string): Observable<LocalAtendimentoModels.LocalAtendimento> {
    const url = `${this.baseURLRESV1}/locaisAtendimento/cnes?=${cnes}`
    return this.http.get<LocalAtendimentoModels.LocalAtendimento>(url, this.optionsRes)
  }

  getLocalByName(name: string) {
    const url = `${this.baseURLRESV1}/locaisAtendimento?nome=${name}`
    return this.http.get<LocalAtendimentoModels.LocalAtendimento[]>(url, this.optionsRes)
  }

  getCodigoOperadora(mpi: string): Observable<AtendimentoModel.ResponseOperadora[]> {
    const url = `${this.baseURLAIS}/beneficiarios?dsMpi=${mpi}`
    return this.http.get<AtendimentoModel.ResponseOperadora[]>(url)
  }

  postSignedDocument(
    documentos_id,
    atendimentoSequential,
    patientMpi,
    professionalMpi,
    originalFileId,
    signedFileId,
    fileId
  ): Observable<any> {
    const url = this.baseURLPEPAPI + '/assinatura/documento'
    let document: AtendimentoModel.PostSignedDocument = {
      documentos_id: documentos_id,
      link_original: originalFileId,
      link_assinado: signedFileId,
      mpi_paciente: patientMpi,
      mpi_profissional: professionalMpi,
      id_atendimento: atendimentoSequential,
      envio_email: false,
      envio_sms: false,
      destinatario_email: '',
      assunto: '',
      destinatario_sms: '',
      file_id: fileId
    }
    return this.http.post<AtendimentoModel.PEPApiResponse>(url, document, this.optionsPepApi)
  }

  getMessages(assinaturas_id: Array<number>, type: string, atendimento: number): Observable<any> {
    const assinaturas = assinaturas_id.join(',')
    const url = `${this.baseURLPEPAPI}/assinatura/mensagens/${type}/${atendimento}?assinaturas_id=${assinaturas}`
    return this.http.get<AtendimentoModel.PEPApiResponse>(url, this.optionsPepApi)
  }

  sendEmail(documentId, email, subject): Observable<any> {
    const url = this.baseURLPEPAPI + '/assinatura/envio'
    const data = {
      id: documentId,
      envio_email: true,
      destinatario_email: email,
      assunto: subject,
      envio_sms: false,
      destinatario_sms: ''
    }
    return this.http.post<AtendimentoModel.PEPApiResponse>(url, data, this.optionsPepApi)
  }

  sendEmailSms(
    atendimento_id: number,
    assinaturas_id: number[],
    destinatario: string,
    tipo: string
  ): Observable<any> {
    const payload = {
      atendimento_id,
      assinaturas_id,
      tipo,
      destinatario
    }
    const url = `${this.baseURLPEPAPI}/assinatura/envio`
    return this.http.post<AtendimentoModel.PEPApiResponse>(url, payload, this.optionsPepApi)
  }

  getDocumentByCode(codigoDocumento: string): Observable<any> {
    const url = `${this.restPepApi}/assinatura/documento?codigoAcesso=${codigoDocumento}`
    return this.http.get<AtendimentoModel.PEPApiDocument>(url, this.optionsPepApi)
  }
}
