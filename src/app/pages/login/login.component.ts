import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap'
import { SubSink } from 'subsink'

import { Observable, Subject } from 'rxjs'
import { catchError, delay, map, tap } from 'rxjs/operators'

import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AuthService } from 'src/app/_store/_modules/auth/auth.service'
import { Errors, PEPError } from 'src/app/_store/_modules/errors/errors.models'
import { ErrorsSelect } from 'src/app/_store/_modules/errors/errors.selectors'
import { LocalService } from 'src/app/_store/_modules/local/local.service'
import { ProfissionalActions } from 'src/app/_store/_modules/profissional/profissional.actions'
import {
  ProfissionalModels,
  Profissional
} from 'src/app/_store/_modules/profissional/profissional.model'
import { CredenciaisActions } from 'src/app/_store/_modules/credenciais/credenciais.action'
import { ParametrosService } from 'src/app/_store/services/parametros/parametros.service'
import { ProfissionalService } from 'src/app/_store/_modules/profissional/profissional.service'
import { ToastService } from 'angular-toastify'
import { TipoServicoService } from 'src/app/_store/_modules/tipo-servico/tiposervico.service'
import { ClassificacaoService } from 'src/app/_store/_modules/classificacao/classificacao.service'
import { TipoServicoModels } from 'src/app/_store/_modules/tipo-servico/tipo-servico.model'
import { ClassificacaoModels } from 'src/app/_store/_modules/classificacao/classificacao.model'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service'
import { EmpresaActions } from 'src/app/_store/_modules/empresa/empresa.action'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('instance', { static: true }) instance: NgbTypeahead
  formLogin: FormGroup
  formFirst: FormGroup
  state: string
  loadingSearch: boolean

  subs$ = new SubSink()
  error = ''
  focus$ = new Subject<string>()
  click$ = new Subject<string>()
  msg$ = new Subject<{ text: string; type: string }>()

  private pro: Profissional

  error$: Observable<PEPError>

  classificacaoPadrao: string
  tipoServicoPadrao: string

  home = ''
  usuarioId = 0

  notifierServerKey = ''
  onboarding = false
  url = 'asq'

  constructor(
    private formB: FormBuilder,
    private route: Router,
    private aServ: AuthService,
    private lServ: LocalService,
    private store: Store<PEPState>,
    private parametrosService: ParametrosService,
    private profissinalService: ProfissionalService,
    private toastService: ToastService,
    private tipoServicoServ: TipoServicoService,
    private classificacaoServ: ClassificacaoService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.aServ.logoff()
    this.state = 'login'

    this.formLogin = this.formB.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    })

    this.formFirst = this.formB.group({
      pass: ['', Validators.required],
      confirm: ['', Validators.required]
    })

    this.store.select(ErrorsSelect.authLogin).subscribe(data => {
      if (data) {
        this.error = data.msg
        this.toastService.error(this.error)
      }
    })
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }

  login() {
    if (this.formLogin.invalid) {
      this.error = 'Informe o usuário e senha'
      this.toastService.warn(this.error)
      return
    }
    const user = this.formLogin.value

    this.state = 'loading'
    this.subs$.add(
      this.aServ.login(user.usuario, user.senha).subscribe(
        async (data: any) => {
          const profissionalPepApi: ProfissionalModels.ProfissionalPepApi = data.data
          let home = ProfissionalModels.HomePage.PEP_PAGE_AGENDA
          const papeis = profissionalPepApi.usuario.papeis
          if (papeis !== undefined && papeis.includes(UsuarioModels.Role.ADMIN)) {
            home = ProfissionalModels.HomePage.PEP_PAGE_USUARIOS
          } else if (
            profissionalPepApi.home_page === ProfissionalModels.HomePage.ATENDIMENTO &&
            papeis.includes(UsuarioModels.Role.MEDICO)
          ) {
            home = ProfissionalModels.HomePage.PEP_PAGE_ATENDIMENTO
          }
          let url = ''
          if (profissionalPepApi.empresa !== undefined) {
           url  = profissionalPepApi.empresa.url.split(' ').join('')
          }

          this.url = url ? url : 'asq'
          this.store.dispatch(EmpresaActions.setUrl({ payload: this.url }))
          this.home = home

          this.usuarioId = profissionalPepApi.usuario.id
          this.onboarding = profissionalPepApi.usuario.onboarding

          let profissional: Profissional = {
            role: '', //deprecated
            roles: papeis,
            _id: profissionalPepApi.id.toString(),
            id: profissionalPepApi.id,
            pessoa: profissionalPepApi.pessoa,
            ufConselho: profissionalPepApi.uf_conselho,
            numeroConselho: profissionalPepApi.numero_conselho
              ? profissionalPepApi.numero_conselho.toString()
              : '',
            conselhoProfissional: profissionalPepApi.conselho_profissional,
            primeiroLogin: profissionalPepApi.usuario.primeiro_login,
            especialidades: profissionalPepApi.especialidades,
            locais: profissionalPepApi.locais,
            localPadrao: profissionalPepApi.local_padrao,
            localPadraoId: profissionalPepApi.local_padrao_id,
            dataCriacao: '',
            homePage: home,
            memedAtivo: false,
            ativo: profissionalPepApi.ativo ? 1 : 0,
            email: profissionalPepApi.email,
            memedCidadeId: profissionalPepApi.memed_cidade_id,
            memedEspecialidadeId: profissionalPepApi.memed_especialidade_id,
            onboarding: profissionalPepApi.usuario.onboarding
          }
          this.setTokens(profissionalPepApi)
          if (papeis !== undefined && papeis.includes(UsuarioModels.Role.MEDICO)) {
            await this.getNotifierKey()
          }
          this.pro = profissional
          let tokenMemed = ''
          if (profissional.conselhoProfissional === ProfissionalModels.Conselho.CRM) {
            this.profissinalService.getInfoMemed(profissional.id).subscribe(
              data => {
                profissional.memedAtivo = data.data.status && data.data.status !== 'Inativo'
                this.store.dispatch(CredenciaisActions.setMemedToken({ payload: data.data.token }))
                this.store.dispatch(ProfissionalActions.setProfissional({ payload: profissional }))
                this.aServ.autenticado(true)
                this.navigate(profissional.primeiroLogin)
              },
              err => {
                console.error('Erro ao iniciar o memed', err)
                this.toastService.error('O módulo Memed não foi iniciado.')
                profissional.memedAtivo = false
                this.store.dispatch(ProfissionalActions.setProfissional({ payload: profissional }))
                this.aServ.autenticado(true)
                this.navigate(profissional.primeiroLogin)
              }
            )
          } else {
            this.store.dispatch(ProfissionalActions.setProfissional({ payload: profissional }))
            this.store.dispatch(CredenciaisActions.setMemedToken({ payload: tokenMemed }))
            this.aServ.autenticado(true)
            this.navigate(profissional.primeiroLogin)
          }
        },
        err => {
          this.error =
            err && err.error && err.error.error
              ? err.error.error
              : 'Ocorreu um erro ao efetuar o login'
          this.toastService.error(this.error)
          console.error(err)
          this.aServ.autenticado(false)
          this.state = 'login'
        }
      )
    )
  }

  getNotifierKey() {
    return new Promise((resolve, reject) => {
      this.parametrosService.getKey('NOTIFIER_SERVER_KEY').subscribe(
        data => {
          this.notifierServerKey = data
          resolve(data)
        },
        err => {
          console.error('Não foi possível selecionar a chave do Notifier', err)
          reject(err)
        }
      )
    })
  }

  askPermission() {
    return new Promise(resolve => {
      Notification.requestPermission().then(data => {
        resolve(data)
      })
    })
  }

  urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    var rawData = window.atob(base64)
    var outputArray = new Uint8Array(rawData.length)

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  registerServiceWorker() {
    return navigator.serviceWorker
      .register('/assets/sw.js')
      .then(registration => {
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.notifierServerKey)
        }
        return registration.pushManager.subscribe(subscribeOptions).then(pushSubscription => {
          let aux = JSON.parse(JSON.stringify(pushSubscription))
          let payload: UsuarioModels.UsuarioBrowser = {
            endpoint: aux.endpoint,
            p256dh: aux.keys.p256dh,
            auth: aux.keys.auth
          }
          return this.usuariosService.putBrowser(payload).subscribe(data => {
            return data
          })
        })
      })
      .catch(err => {
        console.error('Não foi possível registrar o sw.', err)
      })
  }

  async navigate(primeiroLogin: boolean) {
    if (primeiroLogin) {
      this.state = 'first'
    } else {
      try {
        if (this.notifierServerKey) {
          await this.registerServiceWorker()
          let granted = await this.askPermission()
        }
      } catch (e) {
        console.error(e)
      } finally {
        if (this.onboarding) {
          this.route.navigate([`${this.url}/onboarding`])
        } else {
          this.route.navigate([`${this.url}/${this.home}`])
        }
      }
    }
  }

  setTokens(profissional: ProfissionalModels.ProfissionalPepApi) {
    this.store.dispatch(CredenciaisActions.setPepApiToken({ payload: profissional.pepapi_token }))
    this.store.dispatch(CredenciaisActions.setResToken({ payload: profissional.pepapi_token }))
    this.store.dispatch(CredenciaisActions.setQdsToken({ payload: profissional.pepapi_token }))
    this.parametrosService.getKey('TOKEN_CANAL').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setCanalToken({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api canal', err)
      }
    )
    this.parametrosService.getKey('CANAL_API').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setCanalApi({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api canal', err)
      }
    )
    this.parametrosService.getKey('TOKEN_CLIC').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setClicToken({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api canal', err)
      }
    )
    this.parametrosService.getKey('CLIC_API').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setClicApi({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api canal', err)
      }
    )
    this.parametrosService.getKey('MEMED_API').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setMemedApi({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api do MEMED', err)
      }
    )
    this.parametrosService.getKey('MEMED_SCRIPT').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setMemedScript({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar a api do MEMED', err)
      }
    )
    this.parametrosService.getKey('TELEMEDICINA').subscribe(
      data => {
        this.store.dispatch(CredenciaisActions.setTelemedicina({ payload: data }))
      },
      err => {
        console.error('Não foi possível carregar o tipo de telemedicina', err)
      }
    )

    this.parametrosService.getKey('TIPO_SERVICO_PADRAO').subscribe(
      (tipoServicoPadrao: string) => {
        this.tipoServicoPadrao = tipoServicoPadrao
        this.tipoServicoServ.getTiposServicos().subscribe(
          (data: TipoServicoModels.TipoServicoPEPApi) => {
            const tipoServicoPadrao = data.data.find(
              tipoServico =>
                tipoServico.descricao.toLowerCase() == this.tipoServicoPadrao.toLowerCase()
            )
            this.store.dispatch(
              CredenciaisActions.setTipoServicoPadrao({ payload: tipoServicoPadrao })
            )
          },
          err => {
            console.error(err)
          }
        )
      },
      err => {
        console.error(err)
      }
    )

    this.parametrosService.getKey('CLASSIFICACAO_PADRAO').subscribe(
      (classificacaoPadrao: string) => {
        this.classificacaoPadrao = classificacaoPadrao
        this.classificacaoServ.getClassificacoes().subscribe(
          (data: Array<ClassificacaoModels.Classificacao>) => {
            const classificacaoPadrao = data.find(
              classificacao =>
                classificacao.descricao.toString().toLowerCase() ==
                this.classificacaoPadrao.toString().toLowerCase()
            )
            this.store.dispatch(
              CredenciaisActions.setClassificacaoPadrao({ payload: classificacaoPadrao })
            )
          },
          err => {
            console.error(err)
          }
        )
      },
      err => {
        console.error(err)
      }
    )
  }

  changePassword() {
    if (this.formFirst.invalid) {
      this.error = 'Preencha todos os campos'
      this.toastService.error(this.error)
      return this.error
    }

    const form = this.formFirst.value

    if (form.pass !== form.confirm) {
      this.error = 'Senha e confirmar senha estão diferentes!'
      this.toastService.error(this.error)
      return
    }

    this.subs$.add(
      this.aServ.changePassword(this.usuarioId, form.pass, form.confirm).subscribe(
        _ => {
          this.route.navigate([`${this.url}/${this.home}`])
        },
        err => {
          this.error =
            err && err.error && err.error.error
              ? err.error.error
              : 'Ocorreu um erro ao trocar a senha'
          this.toastService.error(this.error)
        }
      )
    )
  }
}
