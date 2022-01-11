import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { SubSink } from 'subsink'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service'
import { ToastService } from 'angular-toastify'

@Component({
  selector: 'app-usuario-info',
  templateUrl: './usuario-info.component.html',
  styleUrls: ['./usuario-info.component.scss']
})
export class UsuarioInfoComponent implements OnInit {
  @Input() usuario: UsuarioModels.Usuario
  @Output() saveUsuario: EventEmitter<any>
  subs$ = new SubSink()
  listAtivo: Array<any> = [
    { key: 1, value: 'Ativo' },
    { key: 0, value: 'Inativo' }
  ]
  listSimNao: Array<any> = [
    { key: 1, value: 'Sim' },
    { key: 0, value: 'Não' }
  ]
  papeisList: Array<any> = [
    {
      value: UsuarioModels.Role.AGENDADOR
    },
    {
      value: UsuarioModels.Role.MEDICO
    },
    {
      value: UsuarioModels.Role.ADMIN
    }
  ]
  profissional: Profissional
  beneficiario: any
  selectedPapeis: Array<{
    value
  }>

  dropdownSettings = {
    singleSelection: false,
    idField: 'value',
    textField: 'value',
    selectAllText: 'Selecionar todos',
    unSelectAllText: 'Desselecionar todos',
    itemsShowLimit: 3,
    allowSearchFilter: true
  }
  loading = false
  title = 'Novo Usuário'

  constructor(
    private profissionalService: ProfissionalService,
    private usuariosService: UsuariosService,
    private toastService: ToastService
  ) {
    this.saveUsuario = new EventEmitter()
  }

  ngOnInit() {
    if (this.usuario.id) {
      this.title = this.usuario.login
    }
    this.selectedPapeis =
      this.usuario.papeis && this.usuario.papeis.length
        ? this.usuario.papeis.map(item => {
            return {
              value: item
            }
          })
        : []
    if (this.usuario.profissional_id) {
      this.profissionalService.get(this.usuario.profissional_id + '').subscribe(data => {
        const profissionalPepApi = data.data
        this.profissional = {
          role: profissionalPepApi.role,
          roles: profissionalPepApi.roles,
          _id: profissionalPepApi.id.toString(),
          id: profissionalPepApi.id,
          pessoa: profissionalPepApi.pessoa,
          ufConselho: profissionalPepApi.uf_conselho,
          numeroConselho: profissionalPepApi.numero_conselho.toString(),
          conselhoProfissional: profissionalPepApi.conselho_profissional,
          primeiroLogin: profissionalPepApi.usuario.primeiro_login,
          especialidades: profissionalPepApi.especialidades,
          locais: profissionalPepApi.locais,
          localPadrao: profissionalPepApi.local_padrao,
          localPadraoId: profissionalPepApi.local_padrao_id,
          dataCriacao: '',
          homePage: profissionalPepApi.home_page,
          memedAtivo: false,
          ativo: profissionalPepApi.ativo ? 1 : 0,
          email: profissionalPepApi.email,
          memedCidadeId: profissionalPepApi.memed_cidade_id,
          memedEspecialidadeId: profissionalPepApi.memed_especialidade_id,
          onboarding: false
        }
      })
    }
    if (this.usuario.mpi) {
      //buscar beneficiario no ais
    }
  }

  save() {
    this.loading = true
    if (this.usuario.id) {
      const payload = {
        papeis: this.selectedPapeis.map(item => item.value),
        ativo: this.usuario.ativo == 1,
        primeiro_login: this.usuario.primeiro_login == 1,
        onboarding: this.usuario.onboarding == 1,
        nome: this.usuario.nome
      }
      this.usuariosService.put(this.usuario.id, payload).subscribe(
        data => {
          this.toastService.success('Usuário atualizado com sucesso!')
          this.loading = false
          this.saveUsuario.emit(this.usuario)
        },
        err => {
          this.toastService.error(err.error.error)
          this.loading = false
        }
      )
    } else {
      const payload = {
        papeis: this.selectedPapeis.map(item => item.value),
        ativo: this.usuario.ativo == 1,
        primeiro_login: this.usuario.primeiro_login == 1,
        login: this.usuario.login,
        senha: this.usuario.senha,
        nome: this.usuario.nome
      }
      this.usuariosService.post(payload).subscribe(
        data => {
          this.toastService.success('Usuário cadastrado com sucesso!')
          this.loading = false
          this.usuario.id = data
          this.title = this.usuario.login
          this.saveUsuario.emit(this.usuario)
        },
        err => {
          this.toastService.error(err.error.error)
          this.loading = false
        }
      )
    }
  }

  addProfissional() {
    this.profissional = {
      role: '',
      roles: [],
      _id: '',
      id: 0,
      pessoa: {
        id: 0,
        mpi: '',
        nome_completo: '',
        nome_abreviado: '',
        sexo: '',
        cpf: '',
        genero: '',
        data_nascimento: '',
        estado_civil: '',
        grau_instrucao: '',
        nivel_complexidade: '',
        nome: '',
        sobrenome: ''
      },
      ufConselho: '',
      numeroConselho: '',
      conselhoProfissional: '',
      primeiroLogin: false,
      especialidades: [],
      locais: [],
      localPadrao: {
        id: 0,
        razao_social: '',
        cnes: '',
        cnpj: '',
        fones_list: [],
        logradouro: '',
        bairro: '',
        tipo_servico_id: 0,
        tipo_id: 0,
        classificacao_padrao_id: 0,
        tipo_servico_padrao_id: 0,
        municipio: {
          codigo_ibge: '',
          nome: '',
          uf: ''
        },
        tipoServico: {},
        operadoras: [],
      },
      localPadraoId: 0,
      dataCriacao: '',
      homePage: '',
      memedAtivo: false,
      ativo: 1,
      email: '',
      memedCidadeId: 0,
      memedEspecialidadeId: 0,
      onboarding: false,
      
    }
  }

  newProfissional(data) {
    this.usuario.profissional_id = data
  }
}
