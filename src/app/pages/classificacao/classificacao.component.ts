import { Component, OnDestroy, OnInit } from '@angular/core'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

@Component({
  selector: 'classificacao',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.scss']
})
export class ClassificacaoComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()
  search = ''

  listClassificacao: ClassificacaoModels.Classificacao[] = []
  classificacao: ClassificacaoModels.Classificacao = {
    id: null,
    descricao: '',
    ativo: null
  }

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadListClassificacao = false

  title = 'Nova Classificação'

  constructor(
    private classificacaoService: ClassificacaoService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadListClassificacao = true
    this.loadListClassificacoes()
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(descricao => this.classificacaoService.getAllbyDescricao(descricao))
        )
        .subscribe(res => {
          if (res) {
            this.listClassificacao = res
          }
          this.loadListClassificacao = false
        })
    )
  }

  change(key: string) {
    this.key$.next(key)
  }

  loadListClassificacoes() {
    this.classificacaoService.getClassificacoes().subscribe(
      data => {
        this.loadListClassificacao = false
        this.listClassificacao = data
      },
      err => {
        this.loadListClassificacao = false
        this.toastService.error('Não foi possível carregar lista de classificações!')
        console.error(err)
      }
    )
  }

  setClassificacao(classificacao) {
    this.classificacao = { ...classificacao }
    this.title = classificacao.descricao
  }

  setAtivo(param) {
    this.classificacao.ativo = param
  }

  reset() {
    this.classificacao = {
      id: null,
      descricao: '',
      ativo: null
    }
    this.title = 'Nova Classificação'
  }

  limpar() {
    this.classificacao = {
      id: this.classificacao.id,
      descricao: '',
      ativo: null
    }
  }

  salvar() {
    this.loading = true
    let payload = { ...this.classificacao }
    if (payload.id) {
      this.update(payload.id, payload)
    } else {
      this.create(payload)
    }
  }

  create(classificacao) {
    this.subs$.add(
      this.classificacaoService.post(classificacao).subscribe(
        data => {
          this.classificacao.id = data
          this.loading = false
          this.toastService.success('Classificação cadastrado com sucesso!')
          this.loadListClassificacoes()
          this.title = classificacao.descricao
        },
        err => {
          this.toastService.error('Não foi possível criar classificação! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(id, classificacao) {
    this.subs$.add(
      this.classificacaoService.put(id, classificacao).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Classificação alterada com sucesso!')
          this.loadListClassificacoes()
        },
        err => {
          this.toastService.error('Não foi possível atualizar classificação! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  isEmpty(obj) {
    if (!obj || obj.length <= 0) {
      return true
    }
    return false
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }
}
