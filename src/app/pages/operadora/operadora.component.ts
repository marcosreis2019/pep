import { Component, OnDestroy, OnInit } from '@angular/core'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { OperadoraService } from 'src/app/services/operadora/operadora.service'
import { OperadoraModels } from 'src/app/_store/_modules/operadora/operadora.model'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'

@Component({
  selector: 'app-operadora',
  templateUrl: './operadora.component.html',
  styleUrls: ['./operadora.component.scss']
})
export class OperadoraComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()
  search = ''

  objDefault: OperadoraModels.Operadora = {
    id: 0,
    codigo: 0,
    descricao: '',
    registro_ans: 0,
    tipo_servicos: []
  }
  list: OperadoraModels.Operadora[] = []

  operadora: OperadoraModels.Operadora

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingList = false

  title = 'Nova Operadora'
  tipoServicoList: Array<any>
  selectedTipoServico: Array<any>
  dropdownSettings = {
    singleSelection: false,
    idField: 'key',
    textField: 'value',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Desselecionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  constructor(
    private operadoraService: OperadoraService,
    private toastService: ToastService,
    private tipoServicoService: TipoServicoService
  ) {}

  ngOnInit() {
    this.operadora = { ...this.objDefault }
    this.loadingList = true
    this.loadList()
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(descricao => this.operadoraService.getAll(descricao))
        )
        .subscribe(
          data => {
            this.list = data
            this.loadingList = false
          },
          err => {
            console.error(err)
          }
        )
    )
    this.subs$.add(
      this.tipoServicoService.getTiposServicos().subscribe(data => {
        this.tipoServicoList = data.data
          .map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
          .sort((a, b) => {
            return a.value > b.value ? 1 : 0
          })
      })
    )
  }

  change(key: string) {
    this.key$.next(key)
  }

  loadList() {
    this.operadoraService.getAll('').subscribe(
      data => {
        this.loadingList = false
        this.list = data
      },
      err => {
        this.loadingList = false
        this.toastService.error('Não foi possível carregar lista de operadoras!')
        console.error(err)
      }
    )
  }

  selectOperadora(operadora) {
    this.selectedTipoServico = []
    this.subs$.add(
      this.operadoraService.get(operadora.id).subscribe(
        data => {
          this.loadingList = false
          this.operadora = { ...operadora }
          this.title = operadora.descricao
          this.selectedTipoServico = data.data.tipo_servicos.map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
        },
        err => {
          this.loadingList = false
          this.toastService.error('Não foi possível carregar lista de operadoras!')
          console.error(err)
        }
      )
    )
  }

  reset() {
    this.selectedTipoServico = []
    this.operadora = { ...this.objDefault }
    this.title = 'Nova Operadora'
  }

  save() {
    this.loading = true
    let payload = { ...this.operadora }
    payload.tipo_servicos =
      this.selectedTipoServico && this.selectedTipoServico.length
        ? this.selectedTipoServico.map(item => item.key)
        : []
    if (payload.id) {
      this.update(payload)
    } else {
      this.create(payload)
    }
  }

  create(operadora) {
    this.subs$.add(
      this.operadoraService.post(operadora).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Operadora cadastrada com sucesso!')
          this.loadList()
          this.operadora.id = data
          this.title = operadora.descricao
        },
        err => {
          this.toastService.error(err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(operadora) {
    this.subs$.add(
      this.operadoraService.put(operadora.id, operadora).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Alterado com sucesso!')
          this.loadList()
        },
        err => {
          this.toastService.error('Não foi possível atualizar! ' + err.error.error)
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  isDisabled() {
    return (
      this.operadora.descricao == '' ||
      this.operadora.codigo == 0 ||
      this.operadora.registro_ans == 0
    )
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }
}
