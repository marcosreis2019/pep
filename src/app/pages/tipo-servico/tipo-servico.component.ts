import { Component, OnDestroy, OnInit } from '@angular/core'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

@Component({
  selector: 'tipo-servico',
  templateUrl: './tipo-servico.component.html',
  styleUrls: ['./tipo-servico.component.scss']
})
export class TipoServicoComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()
  search = ''

  listTipoServico: TipoServicoModels.TipoServico[]
  tipoServico: TipoServicoModels.TipoServico = {
    id: null,
    descricao: '',
    tempo_atendimento: 0,
    locais: null,
    ativo: false,
    app: false,
    chatbot: false
  }

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingListTipoServico = false
  title = 'Novo Tipo de Serviço'
  constructor(private tipoServicoService: TipoServicoService, private toastService: ToastService) {}

  ngOnInit() {
    this.search = ''
    this.loadingListTipoServico = true
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(descricao => this.tipoServicoService.getTiposServicosbyDescricao(descricao))
        )
        .subscribe(data => {
          this.listTipoServico = data.data ? data.data : []
          this.loadingListTipoServico = false
        })
    )
    this.loadListTipoServico()
  }

  loadListTipoServico() {
    this.loadingListTipoServico = true
    this.tipoServicoService.getTiposServicos().subscribe(
      res => {
        this.loadingListTipoServico = false
        if (res && res.data && res.data.length > 0) {
          this.listTipoServico = res.data
        }
      },
      err => {
        this.loadingListTipoServico = false
        this.toastService.error('Não foi possível carregar lista de Tipo Serviço!')
        console.error(err)
      }
    )
  }

  setTipoServico(obj) {
    this.tipoServico = { ...obj }
    this.title = obj.descricao
  }

  setAtivo(param) {
    this.tipoServico.ativo = param
  }

  change(key: string) {
    this.key$.next(key)
  }

  reset() {
    this.tipoServico = {
      id: null,
      descricao: '',
      tempo_atendimento: 0,
      locais: null,
      ativo: false,
      app: false,
      chatbot: false
    }
    this.title = 'Novo Tipo de Serviço'
  }

  limpar() {
    this.tipoServico = {
      id: this.tipoServico.id,
      descricao: '',
      tempo_atendimento: 0,
      locais: null,
      ativo: false,
      app: false,
      chatbot: false
    }
  }

  salvar() {
    this.loading = true
    if (this.tipoServico.id) {
      this.update(this.tipoServico)
    } else {
      this.create(this.tipoServico)
    }
  }

  create(tipoServico) {
    this.subs$.add(
      this.tipoServicoService.post(tipoServico).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Tipo Serviço cadastrado com sucesso!')
          this.loadListTipoServico()
          this.tipoServico.id = data
          this.title = tipoServico.descricao
        },
        err => {
          this.toastService.error('Não foi possível criar Tipo Serviço! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(tipoServico) {
    this.subs$.add(
      this.tipoServicoService.put(tipoServico).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Tipo Serviço alterado com sucesso!')
          this.loadListTipoServico()
        },
        err => {
          this.toastService.error('Não foi possível atualizar Tipo Serviço! ' + err.error.error)
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
