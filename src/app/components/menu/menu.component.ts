import { Component, OnInit, forwardRef, ViewChild, ElementRef, Input } from '@angular/core'
import { NG_VALUE_ACCESSOR, FormGroup, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import * as config from 'src/../package.json'
import { environment } from 'src/environments/environment'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import {
  Profissional,
  ProfissionalModels
} from 'src/app/_store/_modules/profissional/profissional.model'
import { UsuarioModels } from 'src/app/_store/_modules/usuario/usuario.model'
import { ProfissionalActions } from 'src/app/_store/_modules/profissional/profissional.actions'
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'

@Component({
  selector: 'menu-sidebar',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MenuComponent)
    }
  ]
})
export class MenuComponent implements OnInit {
  @Input() showLocal = false
  @Input() showPacientes = false
  @Input() showAgendamentos = false
  @Input() showRelatorios = false
  @Input() showOpcoes = false
  @Input() showAdm = false
  @ViewChild('relatorio', { static: false }) relatorio: ElementRef
  form: FormGroup
  msgDataInvalida = ''
  version = ''
  linkPepAdmin = ''
  private subs$ = new SubSink()
  profissionalLogado: Profissional

  roles: Array<string>
  onboarding = false

  nome = ''
  conselhoProfissional = ''
  numeroConselho = ''
  ufConselho = ''
  memedAtivo = false

  currentOnboarding = 0
  onboardingList = [
    'onboarding',
    'tipo_servico',
    'classificacao',
    'operadoras',
    'usuarios',
    'cronograma',
    'paciente',
    'termos'
  ]
  url: string = 'asq'

  constructor(
    private route: Router,
    private store: Store<PEPState>,
    private usuariosService: UsuariosService
  ) {
    this.linkPepAdmin = environment.LINK_PEP_ADMIN
    const path = window.location.pathname
    const split = path.split('/')
    const pathName = split[split.length - 1]
    const index = this.onboardingList.findIndex(item => item === pathName)
    this.currentOnboarding = index
  }

  ngOnInit() {
    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe((data: any) => {
        if (data) {
          this.profissionalLogado = { ...data }
          this.nome = this.profissionalLogado.pessoa.nome
          this.conselhoProfissional = this.profissionalLogado.conselhoProfissional
          this.numeroConselho = this.profissionalLogado.numeroConselho
          this.ufConselho = this.profissionalLogado.ufConselho
          this.memedAtivo = this.profissionalLogado.memedAtivo
          this.onboarding = this.profissionalLogado.onboarding
          if (data && data.roles) {
            this.roles = data.roles
            this.showPacientes = this.isMedico()
            this.showAgendamentos = this.isMedico() || this.isAgendador()
            this.showRelatorios = this.isAdmin() || this.isAgendador()
            this.showAdm = this.isAdmin()
          }
        }
      })
    )

    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )

    this.version = config.version
  }

  onboardingBack() {
    if (this.currentOnboarding > 0) {
      this.currentOnboarding = this.currentOnboarding - 1
      this.route.navigate([`${this.url}/${this.onboardingList[this.currentOnboarding]}`])
    }
  }

  onboardingNext() {
    if (this.currentOnboarding < 6) {
      this.currentOnboarding = this.currentOnboarding + 1
      this.route.navigate([`${this.url}/${this.onboardingList[this.currentOnboarding]}`])
    } else {
      this.profissionalLogado.onboarding = false
      this.store.dispatch(ProfissionalActions.setProfissional({ payload: this.profissionalLogado }))
      this.currentOnboarding = 0
      this.usuariosService.putOnboarding(false).subscribe(
        _ => {
          this.route.navigate([`${this.url}/usuarios`])
        },
        err => {
          console.error(err)
          this.route.navigate([`${this.url}/usuarios`])
        }
      )
    }
  }

  isAdmin() {
    return this.roles && this.roles.includes(UsuarioModels.Role.ADMIN)
  }
  isMedico() {
    return this.roles && this.roles.includes(UsuarioModels.Role.MEDICO)
  }
  isAgendador() {
    return this.roles && this.roles.includes(UsuarioModels.Role.AGENDADOR)
  }
  isCRM() {
    return (
      this.roles && this.profissionalLogado.conselhoProfissional == ProfissionalModels.Conselho.CRM
    )
  }

  logoff() {
    this.route.navigate(['login'])
  }

  goTo(nomeRota: string) {
    if (nomeRota !== '') {
      this.route.navigate([`${this.url}/${nomeRota}`])
    }
  }

  truncateNomeProfissional(sentence, amount, tail) {
    if (sentence) {
      const words = sentence.split(' ')

      if (amount >= words.length) {
        return sentence
      }

      const truncated = words.slice(0, amount)
      return truncated.join(' ') + tail
    } else {
      return ''
    }
  }

  toggleRelatorio() {
    this.route.navigate([`${this.url}/relatorio-atendimento`])
  }

  toggleRelatorioFaturamento() {
    this.route.navigate([`${this.url}/relatorio-faturamento`])
  }

  toggleRelatorioTempoEmEspera() {
    this.route.navigate([`${this.url}/relatorio-emespera`])
  }

  toggleRelatorioAgendamento() {
    this.route.navigate([`${this.url}/relatorio-agendamento`])
  }

  toggleRelatorioAgendamentoEvento() {
    this.route.navigate([`${this.url}/relatorio-agendamento-evento`])
  }

  toggleRelatorioDiasLivres() {
    this.route.navigate([`${this.url}/relatorio-diaslivres`])
  }

  toggleRelatorioExames() {
    this.route.navigate([`${this.url}/relatorio-exames`])
  }
}
