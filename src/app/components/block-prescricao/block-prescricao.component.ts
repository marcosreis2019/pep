import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Store } from '@ngrx/store'
import { Events } from 'src/app/providers/events/events.service'
import { MemedService } from 'src/app/_store/services/memed/memed.service'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { SubSink } from 'subsink'
import { CredenciaisSelect } from 'src/app/_store/_modules/credenciais/credenciais.selector'

@Component({
  selector: 'block-prescricao',
  templateUrl: './block-prescricao.component.html',
  styleUrls: ['./block-prescricao.component.scss']
})
export class BlockPrescricaoComponent implements OnInit, OnDestroy {
  @ViewChild('prescHistory', { static: false }) prescHistory: ElementRef
  prescricoes: any
  prescSelected: any

  isLoaded: boolean
  msgAlert: string
  sendingRef: boolean
  sendingXRef: boolean
  collapsed: boolean
  msgPOSTError: string
  msgPOSTSuccess: string
  msgPUTError: string
  msgPUTSuccess: string
  toggleItem: number

  showError = false
  hasMemedToken = true

  private subs$ = new SubSink()
  mpi: string
  nome: string

  constructor(
    private bServ: BeneficiarioService,
    private modalService: NgbModal,
    private events: Events,
    private memedService: MemedService,
    private store: Store<PEPState>
  ) {}

  ngOnInit() {
    this.events.subscribe('reload-prescricoes', toReload => {
      if (toReload) {
        this.load()
      }
    })
    this.subs$.add(
      this.store.select(BeneficiarioSelect.dadosPessoais).subscribe(dados => {
        if (dados && dados.mpi) {
          this.mpi = dados.mpi
          this.nome = dados.nomeCompleto
          this.load()
        }
      })
    )
    this.subs$.add(
      this.store.select(CredenciaisSelect.memedToken).subscribe(
        data => {
          this.hasMemedToken = data !== ''
        },
        err => {
          console.error(err)
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subs$.unsubscribe()
  }

  load() {
    if (!this.mpi) {
      return
    }
    return this.bServ
      .getPrescricoes(this.mpi)
      .toPromise()
      .then((res: any) => {
        setTimeout(() => (this.isLoaded = true), 1000)
        this.prescricoes = res
        this.isLoaded = true
      })
      .catch((e: any) => {
        this.isLoaded = true
        this.msgAlert = e
      })
  }

  toggleItemVisibility(index: number, prescricao: any) {
    this.reset()
    this.toggleItem = this.toggleItem === index ? undefined : index
    this.prescSelected = !this.prescSelected ? prescricao : undefined
  }

  private reset() {
    this.msgPOSTError = undefined
    this.msgPOSTSuccess = undefined
    this.msgPUTError = undefined
    this.msgPUTSuccess = undefined
  }

  showPrescHistory() {
    this.modalService.open(this.prescHistory, {
      size: 'lg',
      centered: true
    })
    return
  }

  addPaciente() {
    let loaded = this.memedService.addPaciente(this.nome, this.mpi)
    this.showError = !loaded
    setTimeout(() => (this.showError = false), 5000)
  }
}
