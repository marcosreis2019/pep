import { Component, OnInit, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, Subject, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { Canal } from 'src/app/_store/_modules/telemedicina/canal.model'
import { Email } from 'src/app/_store/services/core/email.model'
import { Sms } from 'src/app/_store/services/core/sms.model'
import { BeneficiarioModels as Models } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { DatePipe } from '@angular/common'
import { CanalActions } from 'src/app/_store/_modules/telemedicina/canal.actions'
import { CanalService } from 'src/app/_store/_modules/telemedicina/canal.service'
import { Router } from '@angular/router'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'
import { ClicService } from 'src/app/_store/_modules/telemedicina/clic.service'
import { CoreService } from 'src/app/_store/services/core/core.service'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'
import { SubSink } from 'subsink'
import { ToastService } from 'angular-toastify'

interface BeneficiarioFormatado extends Models.DadosPessoais {
  name: string
  born: string

  css: {
    border
    background
    level
  }

  gender: {
    type?: string
    picture?: string
  }
}

interface Parent {
  name: string
  ref?: string
}
@Component({
  selector: 'block-personal-info-historico',
  templateUrl: './block-personal-info-historico.component.html',
  styleUrls: ['./block-personal-info-historico.component.scss']
})
export class BlockPersonalInfoHistoricoComponent implements OnInit {
  @Input() sequential: Number
  familyEnabled: boolean
  videoEnabled: boolean
  linkCreated: boolean
  motherName: string
  fonePaciente: string
  emailPaciente: string
  data: Date
  mpi: string

  linkMedico: string
  linkPaciente: string

  simpleReqCanalObs$: Observable<Canal[]>
  canalPaciente: Canal = {
    status_code: 0,
    status_description: '',
    status_message: '',
    sala: '',
    data_ini: '',
    data_fim: '',
    token: '',
    url: '',
    url_administrador: ''
  }
  email: Email = {
    id: 0,
    from: '',
    subject: '',
    to: '',
    hookOnReply: '',
    body: '',
    dataAtualizacao: '',
    dataEnvio: '',
    dataRegistro: '',
    modulo: '',
    status: ''
  }
  sms: Sms = { para: '', texto: '' }

  beneficiario$: Observable<BeneficiarioFormatado>
  familia$: Observable<Parent[]>

  errorBenef$ = new Subject<string>()
  errorFam$ = new Subject<string>()

  canal: Observable<Canal>
  prof: Observable<Profissional>
  canalA: Canal
  telemedicina: string
  private subs$ = new SubSink()

  constructor(
    private store: Store<PEPState>,
    private canalService: CanalService,
    private clicService: ClicService,
    private datePipe: DatePipe,
    private router: Router,
    private coreService: CoreService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.subs$.add(
      this.store.select(CredenciaisSelect.telemedicina).subscribe(
        data => {
          this.telemedicina = data
        },
        err => {
          console.error(err)
        }
      )
    )
    this.beneficiario$ = this.store.select(BeneficiarioSelect.dadosPessoais).pipe(
      map(beneficiario => {
        return this.prepareBenef(beneficiario)
      }),
      catchError(e => {
        this.errorBenef$.next(e)
        return of(undefined)
      })
    )

    this.familia$ = this.store.select('beneficiario').pipe(map(f => this.prepareFam(f)))
  }

  private prepareBenef(beneficiario: Models.DadosPessoais): BeneficiarioFormatado {
    if (beneficiario) {
      return this.generateData(beneficiario)
    }
    this.errorBenef$.next('Nenhuma usuário encontrado')
    return null
  }

  private prepareFam(f): Parent[] {
    if (f && f.length) {
      return this.transformFamilyName(f)
    }

    this.errorFam$.next('Nenhum familiar registrado')
  }

  private generateData(ben: Models.DadosPessoais): BeneficiarioFormatado {
    const benF: BeneficiarioFormatado = {
      ...ben,
      mpi: ben.mpi,
      name: this.toCamelCase(ben.nomeCompleto),
      css: this.generateCss(ben.nivelComplexidade),
      born: ben.dataNascimento,
      gender: this.generateGender(ben.sexo, ben['gender'], ben['fotoAvatar'])
    }
    this.mpi = benF.mpi
    return benF
  }

  private transformFamilyName(family): Parent[] {
    return family.map(elem => {
      return {
        name: this.toCamelCase(elem.dependente.nomeCompleto),
        ref: this.toCamelCase(elem.grau)
      }
    })
  }

  private toCamelCase(str: string): string {
    if (!str) {
      return ''
    }
    const split = str.trim().split(' ')
    return split
      .map(word => {
        return word ? word[0].toUpperCase() + word.substr(1, word.length - 1).toLowerCase() : ''
      })
      .join(' ')
  }

  private generateCss(nivel?: Models.NivelComplexidadeModel) {
    let level: number = nivel && typeof nivel !== 'string' ? nivel.codigoNivel : 0
    level -= 1
    const mapCss = ['one', 'two', 'three', 'four', 'five']
    const base = mapCss[level] ? mapCss[level] : 'default'

    return {
      border: `bo-${base}`,
      background: `bg-${base}`,
      level: level ? level + 1 : 0
    }
  }

  private generateGender(sex: string, gender: string, pic?: string) {
    let g = sex ? sex.toLowerCase() : ''
    g = !sex && gender ? gender : g

    if (gender === 'feminino') {
      return {
        type: 'Mulher',
        picture: pic ? pic : 'assets/imgs/female.svg'
      }
    }

    if (gender === 'masculino') {
      return {
        type: 'Homem',
        picture: pic ? pic : 'assets/imgs/male.svg'
      }
    }

    return {
      picture: pic ? pic : 'assets/imgs/avatar.svg'
    }
  }

  enableFamily() {
    this.familyEnabled = true
    this.videoEnabled = false
  }

  disableFamily() {
    this.familyEnabled = false
    this.videoEnabled = false
  }

  getConsultorio() {
    if (this.telemedicina === 'CLIC') {
      this.getClic()
    } else if (this.telemedicina === 'CANAL') {
      this.getCanal()
    } else {
      this.toastService.info('Serviço de telemedicina não configurado!')
    }
  }

  getCanal() {
    this.data = new Date()
    this.data.setMinutes(this.data.getMinutes() + 30)
    this.canalService
      .getLink(
        this.datePipe.transform(new Date(), 'yyyyMMddHHmmss'),
        this.datePipe.transform(this.data, 'yyyyMMddHHmmss')
      )
      .subscribe(
        (canal: Canal) => {
          this.canalPaciente = canal
          if (canal.status_code == 1000) {
            this.store.dispatch(CanalActions.setCanal({ payload: this.canalPaciente }))
            this.linkCreated = true
            this.linkPaciente = canal.url
            this.linkMedico = canal.url_administrador
            this.sms.para = '55' + this.fonePaciente
            this.sms.texto = 'Acesso à consulta: ' + canal.url
            if (this.fonePaciente) {
              this.coreService.enviaSms(this.sms).subscribe(
                data => {},
                err => {
                  this.toastService.error('Erro ao enviar o link da telemedicina!')
                  console.error(err)
                }
              )
            }

            if (this.emailPaciente) {
              this.enviaEmail(this.sms.texto).subscribe(
                data => {
                  this.toastService.success('Link da telemedicina enviado!')
                },
                err => {
                  this.toastService.error('Erro ao enviar o link da telemedicina!')
                  console.error(err)
                }
              )
            }
          }
        },
        err => {
          this.toastService.error('Erro ao enviar o link da telemedicina!')
          console.error(err)
        }
      )
  }

  enviaEmail(body: string) {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.email.body = body
    this.email.dataAtualizacao = date
    this.email.dataEnvio = date
    this.email.dataRegistro = date
    this.email.hookOnReply = ''
    this.email.id = 0
    this.email.modulo = 'ATENDIMENTO'
    this.email.status = 'AGUARDANDO_ENVIO'
    this.email.subject = 'Agendamento de consulta'
    this.email.to = this.emailPaciente
    return this.coreService.enviaEmail(this.email)
  }

  getClic() {
    this.clicService.postAtendimentoClic(this.mpi).subscribe(
      data => {
        this.enviar(data)
      },
      err => {
        this.toastService.error(err.error.msg)
        console.error(err)
        if (err.error.data) {
          this.enviar(err.error.data)
        }
      }
    )
  }

  enviar(data: any) {
    this.linkMedico = data.endpoint.doctor
    this.linkPaciente = data.endpoint.patient
    this.linkCreated = true
    this.sms.para = '55' + this.fonePaciente
    this.sms.texto = 'Acesso à consulta: ' + this.linkPaciente
    if (this.fonePaciente) {
      this.coreService.enviaSms(this.sms).subscribe(
        data => {
          this.toastService.success('Link da telemedicina enviado!')
        },
        err => {
          this.toastService.error('Erro ao enviar o link da telemedicina!')
        }
      )
    }

    if (this.emailPaciente) {
      this.enviaEmail(this.sms.texto).subscribe(
        data => {
          this.toastService.success('Link da telemedicina enviado!')
        },
        err => {
          this.toastService.error('Erro ao enviar o link da telemedicina!')
        }
      )
    }
  }

  videoChamada() {
    this.videoEnabled = !this.videoEnabled
    this.familyEnabled = false
  }

  copyLink() {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = this.linkPaciente
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }
}
