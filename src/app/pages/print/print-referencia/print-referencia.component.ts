import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { BeneficiarioModels as Beneficiario } from 'src/app/_store/_modules/beneficiario/beneficiario.model'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { PEPState } from 'src/app/_store/store.models'
import { Profissional } from 'src/app/_store/_modules/profissional/profissional.model'
import { ReferenciasModels as Models } from 'src/app/_store/_modules/referencias/referencias.models'
import { ReferenciasSelectors } from 'src/app/_store/_modules/referencias/referencias.selectors'
import { LocalAtendimentoModels } from 'src/app/_store/_modules/local/local.model'
import { ToastService } from 'angular-toastify'
import { SubSink } from 'subsink'

@Component({
  selector: 'print-referencia',
  templateUrl: './print-referencia.component.html',
  styleUrls: ['./print-referencia.component.scss']
})
export class PrintReferenciaComponent implements OnInit, OnDestroy {
  doc: any
  ref: any

  documento: any
  form: FormGroup

  private subs$ = new SubSink()

  beneficiario: Beneficiario.DadosPessoais
  profissional: Profissional
  local: LocalAtendimentoModels.LocalAtendimento
  refs: Models.Referencia[]

  constructor(
    private store: Store<PEPState>,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.documento = {
      profissionalReferenciado: '',
      especialidade: '',
      dataEncaminhamento: '',
      refTexto: '',
      xRefTexto: ''
    }
  }

  ngOnInit() {
    this.subs$.add(
      this.store.select(LocalSelect.local).subscribe(
        localParam => {
          this.local = localParam
        },
        err => {
          console.error(err)
          this.toastService.error('Não foi possivel carregar os locais!')
        }
      )
    )

    this.subs$.add(
      this.store.select(ProfissionalSelect.profissional).subscribe(
        prof => {
          this.profissional = prof
        },
        err => {
          console.error(err)
          this.toastService.error('Não foi possivel carregar o Profissional!')
        }
      )
    )

    this.subs$.add(
      this.store.select(BeneficiarioSelect.dadosPessoais).subscribe(
        benf => {
          this.beneficiario = benf
        },
        err => {
          console.error(err)
          this.toastService.error('Não foi possivel carregar as informaçoes do Beneficiario!')
        }
      )
    )
    this.loadReferencia()
  }

  loadReferencia() {
    this.subs$.add(
      this.store.select(ReferenciasSelectors.getReferencia).subscribe(
        ref => {
          this.ref = { ...ref }
          this.setDocumentDate()
        },
        err => {
          console.error(err)
          this.toastService.error('Não foi possivel carregar as referencias!')
        }
      )
    )
  }

  setDocumentDate() {
    const date = new Date()
    const dia = parseInt((date.getDate() < 10 ? '0' : '') + date.getDate())
    const mes = parseInt((date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1))
    const ano = date.getFullYear()
    this.documento.data = `${dia}/${mes}/${ano}`
  }

  onChange(event: any) {
    this.documento[`${event.target.name}`] = event.target.value
  }

  get nome() {
    return this.form.get('nome')
  }
  get matricula() {
    return this.form.get('matricula')
  }
  get dataEncaminhamento() {
    return this.form.get('dataEncaminhamento')
  }
  get data() {
    return this.form.get('data')
  }
  get profissionalReferenciado() {
    return this.form.get('profissionalReferenciado')
  }
  get especialidade() {
    return this.form.get('medico')
  }

  print() {
    window.print()
  }

  ngOnDestroy() {
    this.subs$.unsubscribe()
  }
}
