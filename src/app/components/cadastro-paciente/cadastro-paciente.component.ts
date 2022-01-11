import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { EventosService } from 'src/app/_store/_modules/historico/eventos.service'
import { SubSink } from 'subsink'
import {catchError} from 'rxjs/operators'
import { PacienteService } from 'src/app/_store/_modules/paciente/paciente.service'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { PacienteModels } from 'src/app/_store/_modules/paciente/paciente.model'
import {merge, Observable, of, Subject, Subscription} from 'rxjs'
import {
  debounceTime,
  delay,
  filter,
  finalize, map,
  mergeMap, retry,
  tap
} from 'rxjs/operators'
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { ToastService } from 'angular-toastify'
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'cadastro-paciente',
  templateUrl: './cadastro-paciente.component.html',
  styleUrls: ['./cadastro-paciente.component.scss']
})
export class CadastroPacienteComponent implements OnInit, OnDestroy {
  @Input() modal = false
  @Input() enableSearch = true

  private subs$ = new SubSink()

  formInvalid = true
  sexo: string
  estadoCivil: string
  status = true

  listNivelComplexidade: any[]
  listOperadoras: any[]
  listClassificacao: any
  listCidades: PacienteModels.AISCidade[]
  listCidadesShow: any[]

  listEstadoCivil: any[] = []
  listSexo: any[] = []

  estadoSelected = null

  listEstado = Object.keys(PacienteModels.Estado)

  imgLoading = require('../../../assets/icons/spinner.svg')
  loading = false
  loadingAll = true

  listaEnderecos: PacienteModels.Endereco[] = []
  listaTelefones: PacienteModels.Telefone[] = []
  listaEmails: PacienteModels.Email[] = []

  paciente: PacienteModels.Paciente = {
    id: 0,
    codigoOperadora: 0,
    matricula: '',
    codigoBeneficiario: 0,
    nome: '',
    cpf: '',
    numeroValidador: '',
    sexo: '',
    dataNascimento: '',
    situacao: 0,
    estadoCivil: '',
    dsMpi: '',
    newRecord: false,
    enderecos: [],
    telefones: [],
    emails: []
  }

  debouncedInputValue = this.paciente.cpf
  searchDecouncer$: Subject<string> = new Subject()

  error = ''
  success = ''
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  loadingSearch = false

  seachCpf = ''
  searchNome = ''

  showInfo = false

  oldEndereco: PacienteModels.Endereco
  private handleError: any;

  constructor(
    private http: HttpClient,
    private eventServ: EventosService,
    private pacienteService: PacienteService,
    private beneficiarioServ: BeneficiarioService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    console.log('cep', this.consultaCep(null))
    this.showInfo = !this.enableSearch
    this.inicializaListas()
    this.listEstadoCivil = [
      { key: 'SOLTEIRO', value: 'Solteiro(a)' },
      { key: 'CASADO', value: 'Casado(a)' },
      { key: 'DIVORCIADO', value: 'Divorciado(a)' },
      { key: 'VIUVO', value: 'Viúvo(a)' },
      { key: 'SEPARADO', value: 'Separado(a)' },
      { key: 'COMPANHEIRO', value: 'Companheiro(a)' },
      { key: 'UNIAOESTAVEL', value: 'União Estável' }
    ]
    this.listSexo = [
      { key: 'MASCULINO', value: 'Masculino' },
      { key: 'FEMININO', value: 'Feminino' }
    ]

    this.eventServ.getOperadoras().then(
      (res: any) => {
        this.listOperadoras = res
        this.loadingAll = false
      },
      err => {
        this.loadingAll = false
        this.toastService.error('Não foi possível carregar lista de operadoras!')
        console.error(err)
      }
    )
  }
  focusCidade(index) {
    this.oldEndereco = Object.assign({}, this.listaEnderecos[index])
  }

  selectCidade(ev: any, index: number) {
    if (ev.item) {
      const cidade = ev.item
      this.listaEnderecos[index].localidade = cidade.descricaoCidade
      this.listaEnderecos[index].codigoCidade = cidade.codigoCidade
      this.listaEnderecos[index].uf = cidade.uf
      this.oldEndereco = Object.assign({}, this.listaEnderecos[index])
    } else {
      this.listaEnderecos[index].localidade = this.oldEndereco.localidade
      this.listaEnderecos[index].codigoCidade = this.oldEndereco.codigoCidade
      this.listaEnderecos[index].uf = this.oldEndereco.uf
    }
    this.onChangeVerificaBtnSalvar()
  }

  searchCidade = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$

    return merge(text, focus, click).pipe(
      mergeMap(term => {
        return this.autoCompleteCidade(term)
      })
    )
  }

  changeEstado() {
    this.listaEnderecos[0].localidade = ''
    this.listaEnderecos[0].codigoCidade = 0
    this.listaEnderecos[0].uf = ''
    this.listCidades = []
    this.onChangeVerificaBtnSalvar()
    if (this.estadoSelected) {
      this.pacienteService.getCidades(this.estadoSelected).subscribe(
        data => {
          this.listCidades = data
          this.loadingAll = false
        },
        err => {
          this.loadingAll = false
          this.toastService.error('Não foi possível carregar lista de cidades!')
          console.error(err)
        }
      )
    }
  }

  private autoCompleteCidade(name: string): any {
    if (this.listCidades && this.listCidades.length > 0) {
      return new Promise((resolve, reject) => {
        const listToShow = this.listCidades
          .filter(item => {
            return item.descricaoCidade.toLowerCase().includes(name.toLowerCase())
          })
          .slice(0, 5)
        resolve(listToShow)
      })
    } else {
      return null
    }
  }

  formatterCidade = (cidade: any) => {
    if (typeof cidade === 'object') {
      return cidade.descricaoCidade ? cidade.descricaoCidade : ''
    } else {
      return cidade
    }
  }

  showError(msg: string = '') {
    this.error = msg
  }

  showSuccess(msg: string = '') {
    this.success = msg
  }

  limpar() {
    this.load()
  }

  load(cpf = '') {
    this.seachCpf = ''
    this.searchNome = ''
    this.inicializaListas()
    this.status = true
    this.showInfo = true

    this.paciente = {
      id: 0,
      codigoOperadora: 0,
      matricula: '',
      codigoBeneficiario: 0,
      nome: '',
      cpf,
      numeroValidador: '',
      sexo: '',
      dataNascimento: '',
      situacao: 1,
      estadoCivil: '',
      dsMpi: '',
      newRecord: false,
      enderecos: [],
      telefones: [],
      emails: []
    }
  }

  salvar() {
    this.loading = true
    const paciente: any = Object.assign({}, this.paciente)
    paciente.enderecos = this.listaEnderecos.map(item => {
      if (item.localidade.descricaoCidade) {
        item.localidade = item.localidade.descricaoCidade
      }
      item.codigoTipoEndereco = 2
      return item
    })
    paciente.telefones = this.listaTelefones.map(item => {
      item.codigoTipoTelefone = 3
      return item
    })
    paciente.emails = this.listaEmails
    paciente.situacao = 1

    if (paciente.codigoBeneficiario) {
      this.update(paciente)
    } else {
      const cpf = this.paciente.cpf
      if (cpf.length === 14) {
        this.pacienteService.getPacienteByCpf(cpf).subscribe(
          data => {
            if (data && data[0]) {
              this.toastService.error('O CPF informado já existe.')
              this.loading = false
            } else {
              this.post(paciente)
            }
          },
          err => {
            this.post(paciente)
          }
        )
      } else {
        this.toastService.error('CPF inválido.')
        this.loading = false
      }
    }
  }

  post(paciente) {
    delete paciente.id
    delete paciente.dsMpi
    paciente.newRecord = true
    this.subs$.add(
      this.pacienteService.post(paciente).subscribe(
        data => {
          this.toastService.success('Paciente cadastrado com sucesso')
          const cpf = this.paciente.cpf
          this.pacienteService.getPacienteByCpf(cpf).subscribe(
            data => {
              if (data && data[0]) {
                this.paciente.codigoBeneficiario = data[0].codigoBeneficiario
              } else {
                this.limpar()
              }
            },
            err => {
              this.limpar()
            }
          )
          this.loading = false
        },
        err => {
          this.toastService.error('Ocorreu um erro ao cadastrar o paciente!')
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  update(paciente) {
    this.paciente.newRecord = false
    this.subs$.add(
      this.pacienteService.put(paciente).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Paciente alterado com sucesso!')
        },
        err => {
          this.toastService.error('Não foi possível atualizar os dados do paciente!')
          console.error(err)
          this.loading = false
        }
      )
    )
  }

  searchBeneficiario() {
    this.estadoSelected = null
    const cpf = this.seachCpf.trim()
    if (cpf.length === 14) {
      this.loading = true
      this.loadPacienteByCpf(cpf)
    } else {
      this.toastService.error('CPF inválido.')
    }
  }

  close() {
    this.load()
    this.showInfo = false
  }

  addBeneficiario() {
    this.load()
  }

  loadPacienteByCpf(cpf) {
    this.loading = true
    this.subs$.add(
      this.pacienteService.getPacienteByCpf(cpf).subscribe(
        data => {
          if (data && data.length) {
            this.limpar()
            this.toastService.success('CPF encontrado!')
            this.loading = false
            this.paciente = data[0]
            this.paciente.estadoCivil = data[0].estadoCivil
            this.paciente.sexo = data[0].sexo
            if (data[0].enderecos.length > 0) {
              this.listaEnderecos = data[0].enderecos
              this.estadoSelected = this.listaEnderecos[0].uf
            }
            if (data[0].telefones.length > 0) {
              this.listaTelefones = data[0].telefones
            }
            if (data[0].emails.length > 0) {
              this.listaEmails = data[0].emails
            }
          } else {
            this.load(cpf)
            this.toastService.warn('CPF não encontrado crie um novo Paciente!')
          }
          this.onChangeVerificaBtnSalvar()
          this.loading = false
        },
        err => {
          console.error(err)
          this.loading = false
          this.toastService.error('Ocorreu um erro ao buscar o Paciente.')
        }
      )
    )
  }


  /**
   * @param cep
   */
  consultaCep(cep: any): Subscription {
    if (cep) {
      cep = cep.replace('-', '')
      cep = cep.replace('.', '')
      const url = 'https://viacep.com.br/ws/'
      const urlWithParameter =   url.concat( cep + '/json' )
      return this.http.get<any>(urlWithParameter).subscribe(
        result => this.listaEnderecos = [result]
      )
    }
  }

  onChangeVerificaBtnSalvar() {
    const sobrenome = this.paciente.nome.split(' ')
    const enderecoEmpty =
      this.listaEnderecos.findIndex(item => {
        return this.isEmpty(item.cep) || this.isEmpty(item.logradouro) || this.isEmpty(item.localidade)
      }) != -1
    const telefoneEmpty =
      this.listaTelefones.findIndex(telefone => {
        return this.isEmpty(telefone.telefone)
      }) != -1
    const emailEmpty =
      this.listaEmails.findIndex(email => {
        return this.isEmpty(email.email)
      }) != -1
    this.formInvalid =
      this.isEmpty(this.paciente.nome) ||
      this.isEmpty(this.paciente.cpf) ||
      this.isEmpty(this.paciente.codigoOperadora) ||
      this.isEmpty(this.paciente.sexo) ||
      this.isEmpty(this.paciente.dataNascimento) ||
      this.isEmpty(this.paciente.estadoCivil) ||
      (this.paciente.nome && !sobrenome[1]) ||
      (new Date(this.paciente.dataNascimento) > new Date()) ||
      enderecoEmpty ||
      telefoneEmpty ||
      emailEmpty

    if(new Date(this.paciente.dataNascimento) > new Date()) {
        this.toastService.error('Data de nascimento não pode ser maior que o dia atual!')
      }
  }

  checkSobrenome() {
    const sobrenome = this.paciente.nome.split(' ')
    if(this.paciente.nome && !sobrenome[1]) {
      this.toastService.error('Sobrenome é obrigatório!')
    }
  }

  isEmpty(obj) {
    if (!obj || obj.length <= 0) {
      return true
    }
    return false
  }

  addEndereco() {
    this.listaEnderecos.push({
      codigoEndereco: 0,
      tipoEndereco: '',
      cep: '',
      uf: '',
      localidade: '',
      bairro: '',
      logradouro: '',
      numero: 0,
      codigoTipoEndereco: 2,
      codigoCidade: 0
    })
    this.onChangeVerificaBtnSalvar()
  }

  addTelefone() {
    this.listaTelefones.push({
      codigoTelefone: 0,
      tipoTelefone: '',
      telefone: '',
      codigoTipoTelefone: 0
    })
    this.onChangeVerificaBtnSalvar()
  }

  addEmail() {
    this.listaEmails.push({
      codigoEmail: 0,
      tipoEmail: '',
      email: '',
      codigoTipoEmail: ''
    })
    this.onChangeVerificaBtnSalvar()
  }

  removeEndereco(endereco) {
    this.listaEnderecos = this.listaEnderecos.filter(enderecoItem => enderecoItem != endereco)
    this.onChangeVerificaBtnSalvar()
  }

  removeTelefone(telefone) {
    this.listaTelefones = this.listaTelefones.filter(telefoneItem => telefoneItem != telefone)
    this.onChangeVerificaBtnSalvar()
  }

  removeEmail(email) {
    this.listaEmails = this.listaEmails.filter(emailItem => emailItem != email)
    this.onChangeVerificaBtnSalvar()
  }

  inicializaListas() {
    this.listaEnderecos = [
      {
        codigoEndereco: 0,
        tipoEndereco: '',
        cep: '',
        uf: '',
        localidade: '',
        bairro: '',
        logradouro: '',
        numero: 0,
        codigoTipoEndereco: 2,
        codigoCidade: 0
      }
    ]

    this.listaTelefones = [
      {
        codigoTelefone: 0,
        tipoTelefone: '',
        telefone: '',
        codigoTipoTelefone: 0
      }
    ]

    this.listaEmails = [
      {
        codigoEmail: 0,
        tipoEmail: '',
        email: '',
        codigoTipoEmail: ''
      }
    ]
  }

  setPacienteEListas(pacienteParam) {
    this.paciente.estadoCivil = pacienteParam.estadoCivil
    this.paciente.sexo = pacienteParam.sexo

    if (pacienteParam.enderecos && pacienteParam.enderecos.length > 0) {
      this.listaEnderecos = pacienteParam.enderecos
      this.estadoSelected = this.listaEnderecos[0].uf
    }

    if (pacienteParam.telefones && pacienteParam.telefones.length > 0) {
      this.listaTelefones = pacienteParam.telefones
    }

    if (pacienteParam.emails && pacienteParam.emails.length > 0) {
      this.listaEmails = pacienteParam.emails
    }
  }

  // Autocomplete Busca Paciente [Codigos - Abaixo]

  search = (text$: Observable<string>) => {
    const text = text$.pipe(debounceTime(200))
    const click = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const focus = this.focus$
    return merge(text, focus, click).pipe(mergeMap(term => this.autoComplete(term)))
  }

  private autoComplete(name: string) {
    if (!name) {
      return of([])
    }

    return this.beneficiarioServ.getBeneficiarioByNome(name).pipe(
      tap(() => {
        this.loadingSearch = true
      }),
      delay(500),
      finalize(() => {
        this.loadingSearch = false
      })
    )
  }

  formatter = (paciente: any) => {
    return paciente ? paciente.nomeCompleto : ''
  }

  formatterToShow(paciente: any): string {
    return paciente
      ? `${paciente.nome}
      ${paciente.matricula}`
      : ''
  }

  selectPaciente(ev: any) {
    this.limpar()
    this.loading = false
    this.paciente = ev.item
    this.setPacienteEListas(this.paciente)
    return this.paciente.nome
  }

  resetToast() {
    this.error = ''
    this.success = ''
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }
}
