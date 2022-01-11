import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef
} from '@angular/core'
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import {
  Profissional,
  ProfissionalModels
} from 'src/app/_store/_modules/profissional/profissional.model'
import { SubSink } from 'subsink'
import { MemedService } from 'src/app/_store/services/memed/memed.service'
import { EspecialidadesService } from 'src/app/_store/services/especialidades/especialidades.service'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { ToastService } from 'angular-toastify'
import { OperadoraService } from 'src/app/services/operadora/operadora.service'
import { OperadoraModels } from 'src/app/_store/_modules/operadora/operadora.model'
@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.scss']
})
export class ProfissionalComponent implements OnInit {
  @Input() profissional: Profissional
  @Input() usuarioId: number
  @Output() newProfissional: EventEmitter<any>
  subs$ = new SubSink()
  listGrauInstrucao: Array<any> = [
    { key: 'ANALFABETO', value: 'Analfabeto' },
    { key: 'PRIMARIO_INCOMPLETO', value: 'Primário incompleto' },
    { key: 'PRIMARIO_COMPLETO', value: 'Primário completo' },
    { key: 'PRIMEIRO_GRAU_INCOMPLETO', value: 'Primeiro grau imcompleto' },
    { key: 'PRIMEIRO_GRAU_COMPLETO', value: 'Primeiro grau completo' },
    { key: 'SEGUNDO_GRAU_INCOMPLETO', value: 'Segundo grau incompleto' },
    { key: 'SEGUNDO_GRAU_COMPLETO', value: 'Segundo grau completo' },
    { key: 'SUPERIOR_INCOMPLETO', value: 'Superior incompleto' },
    { key: 'SUPERIOR_COMPLETO', value: 'Superior completo' },
    { key: 'MESTRADO_COMPLETO', value: 'Mestrado completo' },
    { key: 'DOUTORADO_COMPLETO', value: 'Doutorado completo' }
  ]
  listEstadoCivil: Array<any> = [
    { key: 'SOLTEIRO', value: 'Solteiro' },
    { key: 'CASADO', value: 'Casado' },
    { key: 'DIVORCIADO', value: 'Divorciado' },
    { key: 'VIÚVO', value: 'Viúvo' },
    { key: 'SEPARADO_JUDICIALMENTE', value: 'Separado judicialmente' }
  ]
  listConselho: Array<any> = [
    { key: 'CRAS', value: 'CRAS' },
    { key: 'COREN', value: 'COREN' },
    { key: 'CRF', value: 'CRF' },
    { key: 'CRFA', value: 'CRFA' },
    { key: 'CREFITO', value: 'CREFITO' },
    { key: 'CRM', value: 'CRM' },
    { key: 'CRN', value: 'CRN' },
    { key: 'CRO', value: 'CRO' },
    { key: 'CRP', value: 'CRP' }
  ]
  listSexo: Array<any> = [
    { key: 'MASCULINO', value: 'Masculino' },
    { key: 'FEMININO', value: 'Feminino' }
  ]
  listAtivo: Array<any> = [
    { key: 1, value: 'Ativo' },
    { key: 0, value: 'Inativo' }
  ]
  listSimNao: Array<any> = [
    { key: 1, value: 'Sim' },
    { key: 0, value: 'Não' }
  ]
  listHomePage: Array<any> = [
    { key: 'ATENDIMENTO', value: 'Atendimento' },
    { key: 'AGENDA', value: 'Agenda' },
    { key: 'CADASTROS', value: 'Cadastros' }
  ]
  listUf: Array<string> = [
    'AC',
    'AL',
    'AM',
    'AP',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MG',
    'MS',
    'MT',
    'PA',
    'PB',
    'PE',
    'PI',
    'PR',
    'RJ',
    'RN',
    'RO',
    'RR',
    'RS',
    'SC',
    'SE',
    'SP',
    'TO'
  ].sort()
  especialidadesMemedList: Array<any>
  especialidadesList: Array<any>
  selectedEspecialidades: Array<any>
  locaisList: Array<any>
  selectedLocais: Array<any>
  dropdownSettings = {
    singleSelection: false,
    idField: 'key',
    textField: 'value',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Desselecionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }

  operadoraList: Array<any>
  selectedOperadoras: Array<any>

  loading = false
  dataNascimento: string
  listCidadesCombo: Array<{ key: number; value: string }> = []

  // modalMemedInfo: {
  //   action: string
  //   event: any
  // }
  @ViewChild('modalMemedInfo', { static: true }) modalMemedInfo: TemplateRef<any>
  @ViewChild('instance', { static: true }) instance: NgbTypeahead

  infoMemed: any = {
    nome_completo: '',
    sexo: '',
    data_nascimento: '',
    cpf: '',
    crm: '',
    cidade: '',
    uf: '',
    endereco: '',
    especialidade: '',
    email: '',
    telefone: '',
    ambiente: '',
    status: ''
  }

  constructor(
    private modalService: NgbModal,
    private memedService: MemedService,
    private especialidadesService: EspecialidadesService,
    private localService: LocalService,
    private profissionalService: ProfissionalService,
    private utilsService: UtilsService,
    private toastService: ToastService,
    private operadoraService: OperadoraService
  ) {
    this.newProfissional = new EventEmitter()
  }

  ngOnInit() {
    if (this.profissional.pessoa.data_nascimento) {
      let splitDate = this.profissional.pessoa.data_nascimento.split('T')[0].split('-')
      this.dataNascimento = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    }
    this.subs$.add(
      this.memedService.getEspecialidades().subscribe(value => {
        this.especialidadesMemedList = value.data
          .map(item => {
            return {
              key: item.id,
              value: item.attributes.nome
            }
          })
          .sort((a, b) => {
            return a.value > b.value
          })
      })
    )
    this.subs$.add(
      this.especialidadesService.getAll().subscribe(value => {
        this.especialidadesList = value.data
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
    this.subs$.add(
      this.localService.getAll().subscribe(value => {
        this.locaisList = value.data
          .map(item => {
            return {
              key: item.id,
              value: item.razao_social
            }
          })
          .sort((a, b) => {
            return a.value > b.value ? 1 : 0
          })
      })
    )
    this.selectedEspecialidades =
      this.profissional.especialidades && this.profissional.especialidades.length
        ? this.profissional.especialidades.map(item => {
            return {
              key: item.id,
              value: item.descricao
            }
          })
        : []
    this.selectedLocais =
      this.profissional.locais && this.profissional.locais.length
        ? this.profissional.locais.map(item => {
            return {
              key: item.id,
              value: item.razao_social
            }
          })
        : []

    this.subs$.add(
      this.operadoraService.getAll('').subscribe(data => {
        this.operadoraList = data
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
    this.loadCidades()
  }

  loadCidades() {
    if (this.profissional.ufConselho) {
      this.listCidadesCombo = []
      this.memedService.getCidades(this.profissional.ufConselho).subscribe(data => {
        this.listCidadesCombo = data.data.map(item => {
          return {
            key: item.id,
            value: item.attributes.nome
          }
        })
      })
    }
  }

  isCRM() {
    return this.profissional.conselhoProfissional == ProfissionalModels.Conselho.CRM
  }

  showMemedInfo() {
    this.profissionalService.getInfoMemed(this.profissional.id).subscribe(data => {
      this.modalService.open(this.modalMemedInfo, { size: 'lg' })
      this.infoMemed = data.data
    })
  }

  async save() {
    this.loading = true
    if (this.profissional.id) {
      const dataNascimento = this.utilsService.dateBrToDb(this.dataNascimento)
      const cpf = this.profissional.pessoa.cpf
        .replace('-', '')
        .split('.')
        .join('')
      const payload: ProfissionalModels.ProfissionalPutPepApi = {
        id: this.profissional.id,
        pessoa: {
          sexo: this.profissional.pessoa.sexo,
          cpf: cpf,
          genero: this.profissional.pessoa.genero,
          data_nascimento: dataNascimento,
          estado_civil: this.profissional.pessoa.estado_civil,
          grau_instrucao: this.profissional.pessoa.grau_instrucao,
          nome: this.profissional.pessoa.nome,
          sobrenome: this.profissional.pessoa.sobrenome
        },
        uf_conselho: this.profissional.ufConselho,
        conselho_profissional: this.profissional.conselhoProfissional,
        numero_conselho: this.profissional.numeroConselho,
        especialidades: this.selectedEspecialidades.map(item => item.key),
        locais: this.selectedLocais.map(item => item.key),
        home_page: this.profissional.homePage,
        local_padrao_id: this.profissional.localPadraoId,
        ativo: this.profissional.ativo == 1,
        email: this.profissional.email,
        memed_cidade_id: this.profissional.memedCidadeId,
        memed_especialidade_id: this.profissional.memedEspecialidadeId
      }
      this.profissionalService.put(this.profissional.id, payload).subscribe(
        data => {
          this.loading = false
          this.toastService.success('Profissional atualizado com sucesso!')
        },
        err => {
          this.loading = false
          const message =
            err && err.error && err.error.error
              ? err.error.error
              : 'Ocorreu um erro ao atualizar o profissional'
          this.toastService.error(message)
          console.error(err)
        }
      )
    } else {
      const dataNascimento = this.utilsService.dateBrToDb(this.dataNascimento)
      const cpf = this.profissional.pessoa.cpf
        .replace('-', '')
        .split('.')
        .join('')
      const payload: ProfissionalModels.ProfissionalPostPepApi = {
        pessoa: {
          sexo: this.profissional.pessoa.sexo,
          cpf: cpf,
          genero: this.profissional.pessoa.genero,
          data_nascimento: dataNascimento,
          estado_civil: this.profissional.pessoa.estado_civil,
          grau_instrucao: this.profissional.pessoa.grau_instrucao,
          nome: this.profissional.pessoa.nome,
          sobrenome: this.profissional.pessoa.sobrenome
        },
        uf_conselho: this.profissional.ufConselho,
        conselho_profissional: this.profissional.conselhoProfissional,
        numero_conselho: this.profissional.numeroConselho,
        especialidades: this.selectedEspecialidades.map(item => item.key),
        locais: this.selectedLocais.map(item => item.key),
        home_page: this.profissional.homePage,
        local_padrao_id: this.profissional.localPadraoId,
        ativo: this.profissional.ativo == 1,
        email: this.profissional.email,
        memed_cidade_id: this.profissional.memedCidadeId,
        memed_especialidade_id: this.profissional.memedEspecialidadeId,
        usuario_id: this.usuarioId
      }
      this.profissionalService.post(payload).subscribe(
        data => {
          this.loading = false
          this.profissional.pessoa.mpi = data.data.mpi
          this.newProfissional.emit(data.data.id)
          this.toastService.success('Profissional cadastrado com sucesso!')
        },
        err => {
          this.loading = false
          const message =
            err && err.error && err.error.error
              ? err.error.error
              : 'Ocorreu um erro ao cadastrar o profissional'
          this.toastService.error(message)

          console.error(err)
        }
      )
    }
  }
}
