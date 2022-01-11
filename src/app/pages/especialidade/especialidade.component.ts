import { Component, OnDestroy, OnInit } from '@angular/core'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { EspecialidadeModels } from 'src/app/_store/_modules/especialidade/especialidade.model'
import { EspecialidadeService } from 'src/app/_store/_modules/especialidade/especialidade.service'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'

@Component({
  selector: 'especialidade',
  templateUrl: './especialidade.component.html',
  styleUrls: ['./especialidade.component.scss']
})
export class EspecialidadeComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()

  search = ''

  loadingListTipoServico: boolean
  listEspecialidade: any
  listTiposServico: Array<any> = []
  selectedTiposServico: Array<{
    value
  }>
  dropdownSettings = {
    singleSelection: false,
    idField: 'key',
    textField: 'value',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Desselecionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  especialidade: EspecialidadeModels.Especialidade = {
    id: null,
    descricao: '',
    ativo: false,
    tipo: '',
    tipo_servicos: []
  }

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingListEspecialidade = false
  title = 'Nova Especialidade'

  constructor(
    private especialidadeService: EspecialidadeService,
    private toastService: ToastService,
    private tipoServicoService: TipoServicoService
  ) {}

  ngOnInit() {
    this.search = ''
    this.loadingListEspecialidade = true
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(descricao => this.especialidadeService.getAll(descricao))
        )
        .subscribe((data: any) => {
          this.listEspecialidade = data.data ? data.data : []
          this.loadingListEspecialidade = false
        })
    )
    this.loadListEspecialidade()
    this.loadListTipoServico()
  }

  loadListTipoServico() {
    this.loadingListTipoServico = true
    this.tipoServicoService.getTiposServicos().subscribe(
      res => {
        this.loadingListTipoServico = false
        if (res && res.data && res.data.length > 0) {
          this.listTiposServico = res.data.map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
        }
      },
      err => {
        this.loadingListTipoServico = false
        this.toastService.error('Não foi possível carregar lista de Tipo Serviço!')
        console.error(err)
      }
    )
  }

  loadListEspecialidade() {
    this.loadingListEspecialidade = true
    this.especialidadeService.getAll('').subscribe(
      (res: any) => {
        this.loadingListEspecialidade = false
        if (res && res.data && res.data.length > 0) {
          this.listEspecialidade = res.data
        }
      },
      err => {
        this.loadingListEspecialidade = false
        this.toastService.error('Não foi possível carregar lista de Especialidade!')
        console.error(err)
      }
    )
  }

  setEspecialidade(especialidade) {
    this.especialidade = { ...especialidade }
    this.title = this.especialidade.descricao
    this.selectedTiposServico = especialidade.tipo_servicos
      ? especialidade.tipo_servicos.map(itemTipoServico => {
          return {
            key: itemTipoServico.id,
            value: itemTipoServico.descricao
          }
        })
      : []
  }

  change(key: string) {
    this.key$.next(key)
  }

  reset() {
    this.especialidade = {
      id: null,
      descricao: '',
      ativo: false,
      tipo: '',
      tipo_servicos: []
    }
    this.title = 'Nova Especialidade'
    this.selectedTiposServico = []
  }

  salvar() {
    this.loading = true
    this.especialidade.tipo_servicos =
      this.selectedTiposServico && this.selectedTiposServico.length
        ? this.selectedTiposServico.map((item: any) => item.key)
        : []
    let payload = { ...this.especialidade }
    if (payload.id) {
      this.update(payload.id, payload)
    } else {
      this.create(payload)
    }
  }

  create(especialidade) {
    this.subs$.add(
      this.especialidadeService.post(especialidade).subscribe(
        data => {
          this.especialidade.id = data.data
          this.title = this.especialidade.descricao
          this.loading = false
          this.toastService.success('Especialidade cadastrada com sucesso!')
          this.loadListEspecialidade()
        },
        err => {
          this.toastService.error('Não foi possível cadastrar! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(id, especialidade) {
    this.subs$.add(
      this.especialidadeService.put(id, especialidade).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Especialidade alterada com sucesso!')
          this.loadListEspecialidade()
        },
        err => {
          this.toastService.error('Não foi possível atualizar! ' + err.error.error)
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
