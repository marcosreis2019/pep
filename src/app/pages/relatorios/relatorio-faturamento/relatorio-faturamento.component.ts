import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import { SubSink } from 'subsink'
import { PEPState } from 'src/app/_store/store.models'
import { Store } from '@ngrx/store'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { merge, Observable, of, Subject } from 'rxjs'
import { debounceTime, delay, filter, finalize, map, mergeMap, tap } from 'rxjs/operators'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { ToastService } from 'angular-toastify'

export interface TimelineFilters {
  dataInicio?: string
  dataFim?: string
}

@Component({
  selector: 'app-relatorio-faturamento',
  templateUrl: './relatorio-faturamento.component.html',
  styleUrls: ['./relatorio-faturamento.component.scss']
})
export class RelatorioFaturamentoComponent implements OnInit {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead

  form: FormGroup
  private subs$ = new SubSink()
  mpi = ''
  listOperadoras: any[]
  exibiPlaceholdComboOperadora = true
  imgLoading = require('../../../../assets/icons/spinner.svg')
  loading = false
  loadingSearch = false
  listClassificacao: any
  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  locaisList: any[] = []
  locaisListUserLogado: any[] = []
  selectedItems = []
  dropdownSettings = {}

  objRelatorioFaturamento = {
    mpi: '',
    ans_operadora: '',
    operadora: '',
    versao: '',
    data_inicio: '',
    data_fim: '',
    codigo_procedimento: '',
    valor_procedimento: ''
  }
  error = ''

  constructor(
    private formB: FormBuilder,
    private cServ: ClassificacaoService,
    private pServ: ProfissionalService,
    private eventServ: EventosService,
    private store: Store<PEPState>,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.form = this.formB.group({
      ans_operadora: [undefined],
      operadora: [undefined],
      op: [undefined],
      codigoOperadora: [undefined],
      profissional: [undefined],
      classificacao: [undefined],
      versao: ['3.05.00'],
      data_inicio: [undefined],
      data_fim: [undefined],
      codigo_procedimento_enfermeiro: ['50000705'],
      valor_procedimento_enfermeiro: [undefined],
      codigo_procedimento_medico: ['10101012'],
      valor_procedimento_medico: [undefined],
      locais: [undefined]
    })

    this.eventServ.getOperadoras().then((res: any) => {
      this.listOperadoras = res
    })

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(profissional => {
        this.locaisList = profissional.locais
        this.locaisListUserLogado = profissional.locais
      })
    )

    this.selectedItems = []
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'razao_social',
      selectAllText: 'Selecionar todos',
      unSelectAllText: 'Desselecionar todos',
      itemsShowLimit: 3,
      allowSearchFilter: true
    }

    this.subs$.add(
      this.store.select(BeneficiarioSelect.dadosPessoais).subscribe(dados => {
        if (dados && dados.mpi) {
          this.mpi = dados.mpi
        }
      })
    )

    this.loadClassificacao()
  }

  selectProfissional(ev: any) {
    if (ev && ev.item) {
      this.locaisList = ev.item.locais
    } else {
      this.locaisList = this.locaisListUserLogado
    }
    this.form.controls['profissional'].setValue(ev.item.pessoa.mpi)
  }

  searchProfissional = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$

    return merge(text, focus, click).pipe(
      mergeMap(term => {
        this.locaisList = undefined
        return this.autoCompleteProfissional(term)
      })
    )
  }

  private autoCompleteProfissional(name: string): any {
    if (!name) {
      this.locaisList = this.locaisListUserLogado
      return of([])
    }
    // pegando lista do obj data
    return this.pServ.getProfissionalByNameOrSpecialization(name).pipe(
      tap(() => (this.loadingSearch = true)),
      delay(500),
      map(obj => {
        if (obj) return obj.data
      }),
      finalize(() => (this.loadingSearch = false))
    )
  }

  gerarXmlFaturamento() {
    this.loading = true
    let payload = { ...this.form.value }
    delete payload.op
    payload.classificacao = parseInt(payload.classificacao)
    payload.mpi = this.mpi
    payload.locais = []

    for (var i = 0; i < this.locaisList.length; i++) {
      payload.locais.push(this.locaisList[i].id)
    }

    if (this.selectedItems && this.selectedItems.length > 0) {
      if (this.selectedItems.filter(e => e.id != undefined).length > 0) {
        payload.locais = []
      }
      for (var i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].id) {
          payload.locais.push(this.selectedItems[i].id)
        }
      }
    }

    this.eventServ.postRelatorioFiltroFaturamento(payload).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = 'pep-relatorio-faturamento.xml'

        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        this.loading = false
      },
      err => {
        this.toastService.error('Não há dados nesse período!')
        console.error(err)
        this.loading = false
      }
    )
  }

  async loadClassificacao() {
    await this.cServ.getClassificacoes().subscribe(
      (data: Array<ClassificacaoModels.Classificacao>) => {
        this.listClassificacao = data.sort((item1, item2) => {
          if (item1.descricao > item2.descricao) {
            return 1
          }
          if (item1.descricao < item2.descricao) {
            return -1
          }
          return 0
        })
      },
      err => {
        this.toastService.error('Não foi possível carregar as classificações do agendamento!')
        console.error(err)
      }
    )
  }

  showError(msg: string = '') {
    this.error = msg
  }

  onChange() {
    this.form.controls['ans_operadora'].setValue(this.form.get('op').value.registroANS)
    this.form.controls['codigoOperadora'].setValue(this.form.get('op').value.codigoOperadora)
    this.form.controls['operadora'].setValue(this.form.get('op').value.descricao)
  }

  formatterProfissional = (profissional: any) => {
    return profissional ? profissional.pessoa.nome_completo : ''
  }

  resetToast() {
    this.error = ''
  }
}
