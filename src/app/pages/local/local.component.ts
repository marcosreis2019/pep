import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { merge, Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, filter, mergeMap, switchMap } from 'rxjs/operators'
import { TipoServicoModule } from '../tipo-servico/tipo-servico.module'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { PacienteModels } from 'src/app/_store/_modules/paciente/paciente.model'
import { PacienteService } from 'src/app/_store/_modules/paciente/paciente.service'
import { AgendamentoService } from 'src/app/_store/_modules/agendamento/agendamento.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { OperadoraService } from 'src/app/services/operadora/operadora.service'
import { OperadoraModels } from 'src/app/_store/_modules/operadora/operadora.model'

@Component({
  selector: 'local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.scss']
})
export class LocalComponent implements OnInit, OnDestroy {
  private subs$ = new SubSink()

  key$ = new Subject<string>()

  search = ''
  nomeMunicipio = ''

  municipio: any = {}
  listEstado = Object.keys(PacienteModels.Estado)
  listCidades: any[]

  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  estadoSelected = ''
  loadingAll = false

  formInvalid = false

  loadingListTipoServico: boolean
  loadingListOperadoras: boolean
  listLocal: any
  listTiposServico: Array<any> = []
  listOperadoras: Array<any> = []
  listTipoAtendimentos: Array<any> = []
  listClassificacao: Array<any> = []
  selectedTiposServico: Array<{
    value
  }>
  selectedOperadoras: Array<{
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
  local: LocalAtendimentoModels.Local = {
    id: null,
    razao_social: '',
    cnes: '',
    cnpj: '',
    cep: '',
    logradouro: '',
    numero: null,
    bairro: '',
    municipio_id: null,
    municipio: null,
    fones: '',
    fones_list: [{ numero: '' }],
    ativo: false,
    duracao_consulta: null,
    tipo_id: null,
    tipo_servicos: null,
    operadoras: null,
    tipo_servico_padrao_id: null,
    classificacao_padrao_id: null,
    tipo_servico_id: null,
    tipo_atendimento: ''
  }
  localOperadora: OperadoraModels.OperadoraLocal = {
    operadora_id: null,
    local_id: null,
    descricao: ''
  }

  imgLoading = require('../../../assets/icons/spinner.svg')

  loading = false
  loadingListLocal = false
  title = 'Novo Local de Atendimento'
  constructor(
    private localService: LocalService,
    private toastService: ToastService,
    private tipoServicoService: TipoServicoService,
    private operadoraService: OperadoraService,
    private pacienteService: PacienteService,
    private agendamentoService: AgendamentoService,
    private classificacaoService: ClassificacaoService
  ) {}

  ngOnInit() {
    this.search = ''
    this.loadingListLocal = true
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(descricao => this.localService.getAllByDescricao(descricao))
        )
        .subscribe((res: any) => {
          if (res && res.data) {
            this.listLocal = res.data
            this.listLocal.forEach(local => {
              if (!local.fones_list) {
                local.fones_list = [{ numero: '' }]
              }
              if (local.fones_list.length <= 0) {
                local.fones_list = [{ numero: '' }]
              }
            })
          }
          this.loadingListLocal = false
        })
    )
    this.formInvalid = false
    this.loadListLocal()
    this.loadListTipoServico()
    this.loadListTipoAtendimento()
    this.loadListClassificacao()
    this.loadListOperadoras()
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

  loadListOperadoras() {
    this.loadingListOperadoras = true
    this.operadoraService.getAll('').subscribe(
      data => {
        this.loadingListOperadoras = false
        this.listOperadoras = data.map(item => {
          return {
            key: item.id,
            value: item.descricao
          }
        })
      },
      err => {
        this.loadingListOperadoras = false
        this.toastService.error('Não foi possível carregar lista de Operadora!')
        console.error(err)
      }
    )
  }

  loadListTipoAtendimento() {
    this.agendamentoService.getTiposAgendamento().subscribe(
      res => {
        if (res && res.length > 0) {
          this.listTipoAtendimentos = res.map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
        }
      },
      err => {
        this.toastService.error('Não foi possível carregar os tipos de agendamento')
        console.error(err)
      }
    )
  }

  loadListClassificacao() {
    this.classificacaoService.getAll().subscribe(
      res => {
        if (res && res.length > 0) {
          this.listClassificacao = res.map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
        }
      },
      err => {
        this.toastService.error('Não foi possível carregar classificação')
        console.error(err)
      }
    )
  }

  loadListLocal() {
    this.loadingListLocal = true
    this.localService.getAllByDescricao('').subscribe(
      (res: any) => {
        this.loadingListLocal = false
        if (res && res.data && res.data.length > 0) {
          this.listLocal = res.data
          this.listLocal.forEach(local => {
            if (!local.fones_list) {
              local.fones_list = [{ numero: '' }]
            }
            if (local.fones_list.length <= 0) {
              local.fones_list = [{ numero: '' }]
            }
          })
        }
      },
      err => {
        this.loadingListLocal = false
        this.toastService.error('Não foi possível carregar lista de Local!')
        console.error(err)
      }
    )
  }

  async selectLocal(local) {
    try {
      this.estadoSelected = local.municipio.uf
      await this.loadCidades()
    } catch (e) {
      this.toastService.error('Não foi possível carregar lista de cidades!')
    }
    this.local = { ...local }
    this.local.cnpj = local.cnpj
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, '$1.$2.$3/$4-$5')
    this.local.cep = local.cep.replace(/\D/g, '').replace(/^(\d{2})?(\d{3})?(\d{3})?/, '$1.$2-$3')
    this.title = this.local.razao_social
    this.selectedTiposServico = local.tipo_servicos.length
      ? local.tipo_servicos.map(itemTipoServico => {
          return {
            key: itemTipoServico.id,
            value: itemTipoServico.descricao
          }
        })
      : []

    this.selectedOperadoras = local.operadoras.length
      ? local.operadoras.map(operadora => {
          return {
            key: operadora.id,
            value: operadora.descricao
          }
        })
      : []
  }

  change(key: string) {
    this.key$.next(key)
  }

  reset() {
    this.local = {
      id: null,
      razao_social: '',
      cnes: '',
      cnpj: '',
      cep: '',
      logradouro: '',
      numero: null,
      bairro: '',
      municipio_id: null,
      municipio: null,
      fones: '',
      fones_list: [{ numero: '' }],
      ativo: false,
      duracao_consulta: null,
      tipo_id: null,
      tipo_servicos: null,
      operadoras: null,
      tipo_servico_padrao_id: null,
      classificacao_padrao_id: null,
      tipo_servico_id: null,
      tipo_atendimento: ''
    }
    this.selectedTiposServico = []
    this.selectedOperadoras = []
    this.title = 'Novo Local de Atendimento'
  }

  salvar() {
    this.loading = true
    this.local.tipo_servicos =
      this.selectedTiposServico && this.selectedTiposServico.length
        ? this.selectedTiposServico.map((item: any) => item.key)
        : []
    this.local.operadoras =
      this.selectedOperadoras && this.selectedOperadoras.length
        ? this.selectedOperadoras.map((item: any) => item.key)
        : []

    let payload = { ...this.local }
    payload.cnpj = payload.cnpj.replace(/[^\d]+/g, '')
    payload.cep = payload.cep.replace(/[^\d]+/g, '')
    payload.cnes = '' + payload.cnes
    if (payload.id) {
      this.update(payload)
    } else {
      this.create(payload)
    }
  }

  create(Local) {
    this.subs$.add(
      this.localService.post(Local).subscribe(
        data => {
          this.local = data
          this.loading = false
          this.toastService.success('Local cadastrado com sucesso!')
          this.loadListLocal()
        },
        err => {
          this.loading = false
          this.toastService.error(err.error.error)
          console.error(err)
        }
      )
    )
  }

  update(Local) {
    this.subs$.add(
      this.localService.put(Local).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Local alterado com sucesso!')
          this.loadListLocal()
        },
        err => {
          this.loading = false
          this.toastService.error('Não foi possível atualizar Local!')
          console.error(err)
        }
      )
    )
  }

  addFone() {
    this.local.fones_list.push({ numero: '' })
  }

  removeFone(itemFone: any) {
    if (this.local.fones_list && this.local.fones_list.length > 1) {
      this.local.fones_list = this.local.fones_list.filter(fone => fone != itemFone)
    }
  }

  loadCidades() {
    return new Promise((resolve, reject) => {
      this.listCidades = []
      if (this.estadoSelected) {
        this.localService.getCidadeByUf(this.estadoSelected).subscribe(
          data => {
            this.listCidades = data
            resolve(data)
          },
          err => {
            this.toastService.error('Não foi possível carregar lista de cidades!')
            console.error(err)
            reject(err)
          }
        )
      } else {
        resolve([])
      }
    })
  }

  disabledBtnSalvar() {
    return (
      !this.local.razao_social ||
      !this.local.cnpj ||
      (this.local.cnpj && this.local.cnpj.length !== 18)
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
