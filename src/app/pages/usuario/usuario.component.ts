import { Component, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators'
import { SubSink } from 'subsink'
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  search: string = ''
  selectedIndex: number
  usuarioSelecionado: UsuarioModels.Usuario
  usuarioList = []
  loadingList = false
  loading = false
  key$ = new Subject<string>()
  selected$ = new Subject<any>()
  loading$ = new Subject<boolean>()
  subs$ = new SubSink()
  profissional: Profissional
  selectedUsuario: UsuarioModels.Usuario = null
  paramRoles = [UsuarioModels.Role.ADMIN, UsuarioModels.Role.AGENDADOR, UsuarioModels.Role.MEDICO]

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.subs$.add(
      this.key$
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          switchMap(login => this.usuariosService.getByLogin(login, this.paramRoles))
        )
        .subscribe(value => {
          this.usuarioList = value
          this.loadingList = false
        })
    )
    this.subs$.add(
      this.usuariosService.getByLogin('', this.paramRoles).subscribe(value => {
        this.usuarioList = value.map(item => {
          return item
        })
        this.loadingList = false
      })
    )
    this.addUsuario()
  }

  change(key: string) {
    this.key$.next(key)
  }

  labelAtivo(ativo) {
    return ativo ? 'Ativo' : 'Inativo'
  }

  selectUsuario(usuario, index) {
    this.loading = true
    this.usuariosService.get(usuario.id).subscribe(data => {
      data.primeiro_login = data.primeiro_login ? 1 : 0
      data.ativo = data.ativo ? 1 : 0
      data.onboarding = data.onboarding ? 1 : 0
      this.selectedUsuario = data
    })
    this.selectedIndex = index
    setTimeout(() => {
      this.loading = false
    }, 200)
  }

  saveUsuario(usuario) {
    if (this.selectedIndex != -1) {
      this.usuarioList[this.selectedIndex].ativo = usuario.ativo == 1
    } else {
      let newUsuario = Object.assign(usuario)
      newUsuario.primeiro_login = usuario.primeiro_login == 1
      newUsuario.ativo = usuario.ativo == 1
      newUsuario.onborading = usuario.onborading == 1
      this.usuarioList.push(newUsuario)
      this.selectedIndex = this.usuarioList.length - 1
      this.selectUsuario(this.usuarioList[this.usuarioList.length - 1], this.usuarioList.length - 1)
    }
  }

  addUsuario() {
    this.loading = true
    this.selectedIndex = -1
    this.selectedUsuario = {
      id: 0,
      login: '',
      senha: '',
      papeis: [],
      email: '',
      pessoa_id: 0,
      ativo: 1,
      primeiro_login: 1,
      profissional_id: 0,
      mpi: '',
      nome: '',
      onboarding: 1
    }
    setTimeout(() => {
      this.loading = false
    }, 200)
  }
}
