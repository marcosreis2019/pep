import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { ExamesModels as Models } from 'src/app/_store/_modules/exames/exames.models'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { ExamesSelectors } from 'src/app/_store/_modules/exames/exames.selectors'

@Component({
  selector: 'print-exames',
  templateUrl: './print-exames.component.html',
  styleUrls: ['./print-exames.component.scss']
})
export class PrintExamesComponent implements OnInit {
  documento: any
  form: FormGroup
  exames: Models.Exame[]
  examesImagem: Models.Exame[]
  examesLaboratorio: Models.Exame[]

  beneficiario$: any
  profissional$: any
  local$: any
  exames$: any

  constructor(private route: ActivatedRoute, private store: Store<PEPState>) {
    this.exames = []
    this.documento = {
      especialidade: '',
      dataEncaminhamento: ''
    }
  }

  ngOnInit() {
    this.local$ = this.store.select(LocalSelect.local)
    this.beneficiario$ = this.store.select(BeneficiarioSelect.dadosPessoais)
    this.profissional$ = this.store.select(ProfissionalSelect.profissional)
    this.exames$ = this.store.select(ExamesSelectors.exames)

    this.getParamsData()
  }

  getParamsData() {
    this.route.queryParams.subscribe(data => {
      const tipo = "exame"
      this.documento.tipo = tipo != undefined && tipo != null ? tipo : ''
    })

    this.exames$.subscribe(res => {
      this.exames = res
    })

    this.setDocumentDate()
    this.separarExamesPorTipo()
  }

  separarExamesPorTipo() {
    this.examesImagem = this.exames.filter(exame => exame.tipo === 'imagem')
    this.examesLaboratorio = this.exames.filter(
      exame => exame.tipo === 'laboratorial'
    )
  }

  setDocumentDate() {
    const date = new Date()
    const dia = parseInt((date.getDate() < 10 ? '0' : '') + date.getDate())
    const mes = parseInt(
      (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1)
    )
    const ano = date.getFullYear()
    this.documento.data = `${dia}/${mes}/${ano}`
  }

  print() {
    window.print()
  }
}
