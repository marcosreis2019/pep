import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import moment from 'moment-timezone'
import { of, throwError } from 'rxjs'
import { ErrorsActions } from '../errors/errors.actions'
import { Errors } from 'src/app/_store/_modules/errors/errors.models'
import { catchError, concatMap, exhaustMap, map, switchMap, switchMapTo, tap } from 'rxjs/operators'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { PEPState } from '../../store.models'
import { BeneficiarioActions } from '../beneficiario/beneficiario.action'
import { BeneficiarioSelect } from '../beneficiario/beneficiario.selector'
import { ProfissionalSelect } from '../profissional/profissional.selectors'
import { AtendimentoActions } from './atendimento.action'
import { ParserService } from './atendimento.parser.service'
import { QuestionariosModels as Models } from './atendimento.questionario.model'
import { AtendimentoSelect } from './atendimento.selector'
import { AtendimentoService } from './atendimento.service'
import { AtendimentoModel } from './atendimento.model'
import { ToastService } from 'angular-toastify'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { EmpresaStateClass } from '../empresa/empresa.state'

const TMZ = 'America/Sao_Paulo'

@Injectable()
export class AtendimentoEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<PEPState>,
    private aServ: AtendimentoService,
    private pServ: ParserService,
    private uServ: UtilsService,
    private toastService: ToastService
  ) {}

  start = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.start),
      tap(() => this.store.dispatch(AtendimentoActions.setLoading({ payload: true }))),
      map(action => action.payload),
      switchMap(data => {
        return [
          AtendimentoActions.answeredRequiredQuestionsSubjetivo({
            payload: false
          }),
          AtendimentoActions.answeredRequiredQuestionsObjetivo({
            payload: false
          }),
          BeneficiarioActions.set({ payload: data.beneficiario }),
          AtendimentoActions.setDataStart({
            payload: {
              dataInicio: this.uServ.getDateTime(),
              tipo: 'CONSULTA',
              id: `${data.id}`,
              sequencial: data.sequencial,
              tipo_servico: data.tipo_servico,
              classificacao: data.classificacao
            }
          }),
          AtendimentoActions.setCodOperadora({ payload: data.codigoOperadora }),
          AtendimentoActions.getDeterminantes({
            payload: {
              mpi: data.beneficiario ? data.beneficiario.mpi : "",
              codigo: data.codigoOperadora
            }
          }),
          BeneficiarioActions.get({ payload: data.beneficiario ? data.beneficiario.mpi : "" }),
          AtendimentoActions.setLoading({ payload: false })
        ]
      })
    )
  )

  getCodOperadora$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.getCodOperadora),
      map(action => action.payload),
      switchMap(mpi =>
        this.aServ.getCodigoOperadora(mpi).pipe(
          map(r => r[0].codigoOperadora),
          switchMap(codigo => this.aServ.postEstratificacao(codigo, mpi).pipe(map(() => codigo)))
        )
      ),
      map(codigo => AtendimentoActions.setCodOperadora({ payload: codigo }))
    )
  )

  finish$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AtendimentoActions.finish),
        map(action => action['payload']),
        exhaustMap(atendimento => {
          let payload = Object.assign({}, { ...atendimento })
          payload.dataFim = this.uServ.getDateTime()
          payload.titulo = 'Atendimento PEP'
          payload.subjetivo = payload.subjetivo ? payload.subjetivo : ''
          payload.objetivo = payload.objetivo ? payload.objetivo : ''
          delete payload.id
          delete payload.mpi
          return this.aServ.finalizar(payload, atendimento.id, atendimento.mpi).pipe(
            tap(() => {
              this.store.select(EmpresaSelect.url).pipe(
                map(url => {
                  this.router.navigate([`${url}/finish`])
                })
              )
            }),
            catchError(e => {
              this.store.dispatch(
                ErrorsActions.setAtendFinalizar({ payload: Errors.Atendimento.FISISH })
              )
              return of(e)
            })
          )
        })
      ),
    { dispatch: false }
  )

  getDeterminantes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.getDeterminantes),
      map(action => action['payload']),
      tap(() => this.store.dispatch(AtendimentoActions.setLoading({ payload: true }))),
      switchMap(data => {
        return this.aServ.postEstratificacao(data.codigo, data.mpi).pipe(
          map(data => {
            return data
          })
        )
      }),
      switchMap(determinantes => {
        return this.store
          .select(ProfissionalSelect.profissional)
          .pipe(map(pro => ({ determinantes, id: pro.id })))
      }),
      concatMap(data => {
        const d = this.separaPorSOAP(data.determinantes)
        const metas = d.plano.orientacoes.map((o, i) => {
          const d = moment()
            .tz(TMZ)
            .add(i, 'seconds')
            .format()
          return new AtendimentoModel.Meta(
            o.dsOrientacao,
            data.id,
            o.idAtividadeIndividual,
            d,
            false
          )
        })
        d.plano.metas.forEach(m => {
          metas.push(new AtendimentoModel.Meta(m.dsMeta, data.id))
        })
        return [
          AtendimentoActions.getQuestSubjetivo({
            payload: d.subjetivo.questionariosIDs
          }),
          AtendimentoActions.getQuestObjetivo({
            payload: d.objetivo.questionariosIDs
          }),
          AtendimentoActions.setOrientacoesAvaliacao({
            payload: d.avaliacao.orientacoes
          }),
          AtendimentoActions.setOrientacoesPlano({
            payload: d.plano.orientacoes
          }),
          AtendimentoActions.setMetasPlano({ payload: metas })
        ]
      }),
      tap(() => this.store.dispatch(AtendimentoActions.setLoading({ payload: false })))
    )
  )
  /*
   * Não está sendo utilizado pois está no método getdeterminantes
   */
  postEstratificacao$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.postEstratificao),
      switchMapTo(this.store.select(BeneficiarioSelect.mpi)),
      switchMap(mpi => {
        return this.store
          .select(AtendimentoSelect.codOperadora)
          .pipe(map(cod => ({ codigo: cod, mpi })))
      }),
      switchMap(data => this.aServ.postEstratificacao(data.codigo, data.mpi)),
      concatMap(data => {
        const d = this.separaPorSOAP(data)
        return [
          AtendimentoActions.getQuestSubjetivo({
            payload: d.subjetivo.questionariosIDs
          }),
          AtendimentoActions.getQuestObjetivo({
            payload: d.objetivo.questionariosIDs
          }),
          AtendimentoActions.setOrientacoesAvaliacao({
            payload: d.avaliacao.orientacoes
          }),
          AtendimentoActions.setOrientacoesPlano({
            payload: d.plano.orientacoes
          })
        ]
      })
    )
  )

  getQuestSubjetivo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.getQuestSubjetivo),
      map(action => {
        return action.payload
      }),
      exhaustMap(ids => this.aServ.getQuestionarios(ids)),
      map(qs => this.filtrarPerguntasDoQuestionario(qs)),
      map(qs => this.uServ.removeDuplicates(qs, (i: Models.Pergunta) => i.id)),
      switchMap(qs =>
        this.store
          .select(AtendimentoSelect.subjetivoRespostas)
          .pipe(map(as => ({ origin: qs, answered: as })))
      ),
      map(data => this.removeAnswered(data.origin, data.answered)),
      concatMap(ps => {
        const payload = !ps.length ? 'Etapa concluída com sucesso' : undefined
        return [
          AtendimentoActions.postAnswerSuccessSubjetivo({ payload }),
          AtendimentoActions.setQuestSubjetivo({ payload: ps })
        ]
      })
    )
  )

  getQuestObjetivo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.getQuestObjetivo),
      map(action => action.payload),
      exhaustMap(ids => this.aServ.getQuestionarios(ids)),
      map(qs => this.filtrarPerguntasDoQuestionario(qs)),
      map(qs => this.uServ.removeDuplicates(qs, (i: Models.Pergunta) => i.id)),

      switchMap(qs =>
        this.store
          .select(AtendimentoSelect.objetivoRespostas)
          .pipe(map(as => ({ origin: qs, answered: as })))
      ),

      map(data => this.removeAnswered(data.origin, data.answered)),
      map(ps => AtendimentoActions.setQuestObjetivo({ payload: ps }))
    )
  )

  removeAnswered(origin: Models.Pergunta[], answered: Models.Answers[]): Models.Pergunta[] {
    if (!answered.length) {
      return origin
    }

    let filtered = [...origin]
    const ids = []
    answered.forEach(form => {
      form.answers.forEach(p3 => {
        ids.push(+p3.paraAPI.codigoPergunta)
      })
    })

    ids.forEach(id => {
      if (filtered.find(ques => +ques.id === id)) {
        filtered = filtered.filter(ques => +ques.id !== id)
      }
    })

    return filtered
  }

  postRespostasSubjetivo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.postAnswerSubjetivo),
      tap(() => {
        this.store.dispatch(AtendimentoActions.setLoading({ payload: true })),
          this.store.dispatch(AtendimentoActions.postAnswerErrorSubjetivo({ payload: undefined }))
        this.store.dispatch(AtendimentoActions.postAnswerSuccessSubjetivo({ payload: undefined }))
      }),
      map(action => {
        return action.payload
      }),
      map(payload => {
        return {
          answers: this.pServ.transformAnswerToRes(payload.answers, payload.inputs),
          mpi: payload.mpi,
          codigoOperadora: payload.codigoOperadora
        }
      }),
      exhaustMap(data =>
        this.aServ.postRespostas(data.codigoOperadora, data.mpi, data.answers).pipe(
          concatMap(() => {
            return [
              AtendimentoActions.postEstratificao(),
              AtendimentoActions.updateAnswerSubjetivo({
                payload: data.answers
              })
            ]
          }),
          catchError(err => {
            this.toastService.error(
              'Não foi possível enviar as respostas! Tente novamente mais tarde!'
            )
            this.store.dispatch(AtendimentoActions.setLoading({ payload: false }))
            return throwError('Ocorreu um erro ao tentar enviar as respostas', err)
          })
        )
      ),
      tap(() => this.store.dispatch(AtendimentoActions.setLoading({ payload: false })))
    )
  )

  postRespostasObjetivo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.postAnswerObjetivo),
      tap(() => {
        this.store.dispatch(AtendimentoActions.setLoading({ payload: true })),
          this.store.dispatch(AtendimentoActions.postAnswerErrorObjetivo({ payload: undefined }))
        this.store.dispatch(AtendimentoActions.postAnswerSuccessObjetivo({ payload: undefined }))
      }),
      map(action => action.payload),
      map(payload => {
        return {
          answers: this.pServ.transformAnswerToRes(payload.answers, payload.inputs),
          mpi: payload.mpi,
          codigoOperadora: payload.codigoOperadora
        }
      }),
      exhaustMap(data =>
        this.aServ.postRespostas(data.codigoOperadora, data.mpi, data.answers).pipe(
          concatMap(_ => [
            AtendimentoActions.postEstratificao(),
            AtendimentoActions.updateAnswerObjetivo({ payload: data.answers }),
            AtendimentoActions.postAnswerSuccessObjetivo({
              payload: 'Etapa concluída com sucesso'
            })
          ]),
          catchError(err => {
            this.toastService.error(
              'Não foi possível enviar as respostas! Tente novamente mais tarde!'
            )
            this.store.dispatch(AtendimentoActions.setLoading({ payload: false }))
            return throwError('Ocorreu um erro ao tentar enviar as respostas', err)
          })
        )
      ),
      tap(() => this.store.dispatch(AtendimentoActions.setLoading({ payload: false })))
    )
  )

  private filtrarPerguntasDoQuestionario(questionarios: Models.Questionario[]): Models.Pergunta[] {
    const perguntas: Models.Pergunta[] = []

    questionarios.forEach(quest => {
      const idQuestionario = quest.id
      quest.capitulos.forEach(cap => {
        cap.categorias.forEach(cat => {
          const ps = cat.perguntas.map(p => ({ ...p, idQuestionario }))
          perguntas.push(...ps)
        })
      })
    })
    return perguntas
  }

  private separaPorSOAP(
    list: Models.DeterminantesResponse[] | Models.Estratificacao[]
  ): Models.Esqueleto {
    let { atividades, metas } = this.filtrarPorAtividades(list)
    atividades = this.removeDuplicadasEmAtividades(atividades)

    const filtrados: Models.Esqueleto = {
      subjetivo: { questionariosIDs: [], orientacoes: [] },
      objetivo: { questionariosIDs: [], orientacoes: [] },
      avaliacao: { questionariosIDs: [], orientacoes: [] },
      plano: { questionariosIDs: [], orientacoes: [], metas: [] }
    }

    atividades.forEach(a => this.sortByType(a, filtrados)) // TODO para cada atividade haverá um incrimento em algum array interno em filtrados
    filtrados.plano.metas = metas
    return filtrados
  }

  private sortByType(a: Models.AtividadesIndividuais, obj: Models.Esqueleto): Models.Esqueleto {
    const ob = { ...obj }

    if (a.dsFerramenta === Models.Ferramentas.PEP_SUBJETIVO) {
      this.putOnSubjetivo(a, ob)
    }

    if (a.dsFerramenta === Models.Ferramentas.PEP_OBEJTIVO) {
      this.putOnObjetivo(a, ob)
    }

    if (a.dsFerramenta === Models.Ferramentas.PEP_AVALIACAO) {
      this.putOnAvaliacao(a, ob)
    }

    if (a.dsFerramenta === Models.Ferramentas.PEP_PLANO) {
      this.putOnPlano(a, ob)
    }

    return ob
  }

  private putOnSubjetivo(a: Models.AtividadesIndividuais, ob: Models.Esqueleto) {
    a.dsMetodologiaIndividual === Models.Metodologias.ORIENTACAO
      ? ob.subjetivo.orientacoes.push(a)
      : ob.subjetivo.questionariosIDs.push(a.idQuestionario)
  }

  private putOnObjetivo(a: Models.AtividadesIndividuais, ob: Models.Esqueleto) {
    a.dsMetodologiaIndividual === Models.Metodologias.ORIENTACAO
      ? ob.objetivo.orientacoes.push(a)
      : ob.objetivo.questionariosIDs.push(a.idQuestionario)
  }

  private putOnAvaliacao(a: Models.AtividadesIndividuais, ob: Models.Esqueleto) {
    a.dsMetodologiaIndividual === Models.Metodologias.ORIENTACAO
      ? ob.avaliacao.orientacoes.push(a)
      : ob.avaliacao.questionariosIDs.push(a.idQuestionario)
  }

  private putOnPlano(a: Models.AtividadesIndividuais, ob: Models.Esqueleto) {
    a.dsMetodologiaIndividual === Models.Metodologias.ORIENTACAO
      ? ob.plano.orientacoes.push(a)
      : ob.plano.questionariosIDs.push(a.idQuestionario)
  }

  private filtrarPorAtividades(
    est: Models.Estratificacao[]
  ): { atividades: Models.AtividadesIndividuais[]; metas: Models.Metas[] } {
    let atividades = []
    let metas = []
    est.forEach(state => {
      if (state.determinantes) {
        state.determinantes.forEach(det => {
          if (det.metas) {
            metas.push(...det.metas)
          }
          atividades = this.getAtividadesDeIntervencoes(atividades, det)
          atividades = this.getAtividadesDeFaixas(atividades, det)
        })
      }
    })
    return { atividades, metas }
  }

  private getAtividadesDeIntervencoes(
    atividades: Models.AtividadesIndividuais[],
    determinantes: any
  ): Models.AtividadesIndividuais[] {
    if (determinantes.intervencoes) {
      atividades.push(...determinantes.intervencoes.atividadesIndividuais)
    }
    return atividades
  }

  private getAtividadesDeFaixas(
    atividades: Models.AtividadesIndividuais[],
    determinantes: any
  ): Models.AtividadesIndividuais[] {
    if (determinantes.faixasClassificacao || determinantes.faixasClassificacao.length) {
      determinantes.faixasClassificacao.forEach((faixa: Models.FaixasClassificacao) => {
        if (faixa.intervencoes) {
          atividades.push(...faixa.intervencoes.atividadesIndividuais)
        }
      })
    }

    return atividades
  }

  private removeDuplicadasEmAtividades(
    est: Models.AtividadesIndividuais[]
  ): Models.AtividadesIndividuais[] {
    const map = {}
    return est.filter(item => {
      return map.hasOwnProperty(item.idAtividadeIndividual)
        ? false
        : (map[item.idAtividadeIndividual] = true)
    })
  }

  createMeta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AtendimentoActions.createMetaPlano),
      map(action => action['payload']),
      switchMap(label =>
        this.store.select(ProfissionalSelect.profissional).pipe(map(pro => ({ label, id: pro.id })))
      ),
      map(data =>
        AtendimentoActions.addMetaPlano({
          payload: new AtendimentoModel.Meta(data.label, data.id)
        })
      )
    )
  )
}
