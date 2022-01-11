import { Component, OnInit } from '@angular/core'
import { Observable, of } from 'rxjs'
import { DocumentoService } from 'src/app/_store/_modules/documento/documento.service'
import { DocumentoModels } from 'src/app/_store/_modules/documento/documento.model'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { Router } from '@angular/router'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { PEPError } from 'src/app/_store/_modules/errors/errors.models'
import { ErrorsActions } from 'src/app/_store/_modules/errors/errors.actions'
import { ErrorsSelect } from 'src/app/_store/_modules/errors/errors.selectors'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { SubSink } from 'subsink'

const ATESTADO = DocumentoModels.DOCUMENTO_MODELOS.ATESTAD0
const RELATORIO_MEDICO = DocumentoModels.DOCUMENTO_MODELOS.RELATORIO_MEDICO
const SOLICITACAO_EXAMES = DocumentoModels.DOCUMENTO_MODELOS.SOLICITACAO_EXAMES
@Component({
  selector: 'app-elaboracao',
  templateUrl: './elaboracao.component.html',
  styleUrls: ['./elaboracao.component.scss']
})
export class ElaboracaoComponent implements OnInit {
  private subs$ = new SubSink()
  $loading: Observable<boolean>
  modelos: Array<any> = []
  selectedType = {
    modelo_id: 0
  }
  sequencial = 0
  beneficiarioNome = ''
  error$: Observable<PEPError>
  url = ''

  constructor(
    private documentoService: DocumentoService,
    private store: Store<PEPState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )

    this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(
      data => {
        if (!data.sequencial) {
          this.router.navigate([`${this.url}/home`])
        }
        this.sequencial = data.sequencial
        this.beneficiarioNome = ''
      },
      err => {
        this.router.navigate([`${this.url}/home`])
        console.error(err)
      }
    )

    this.store.select(BeneficiarioSelect.nome).subscribe(
      data => {
        this.beneficiarioNome = data
      },
      err => {
        console.error(err)
      }
    )

    this.documentoService.getTipos().subscribe(
      data => {
        data.data.forEach(item => {
          const modelo = this.modelos.find(item2 => {
            return item2.modelo_id === item.modelo_id
          })
          if (!modelo) {
            this.modelos.push(item)
          }
        })
        this.modelos.forEach(item => {
          item.tipos = data.data.filter(tipo => {
            return item.modelo_id === tipo.modelo_id
          })
        })
      },
      err => {
        console.error(err)
        this.store.dispatch(
          ErrorsActions.setDocumento({
            payload: {
              code: 'documento_error',
              msg: 'Ocorreu um erro ao buscar os modelos de documentos!'
            }
          })
        )
      }
    )

    this.error$ = this.store.select(ErrorsSelect.documento)
  }

  isAtestado() {
    return this.selectedType.modelo_id === ATESTADO
  }

  isRelatorioMedico() {
    return this.selectedType.modelo_id === RELATORIO_MEDICO
  }

  isSolicitacaoExames() {
    return this.selectedType.modelo_id === SOLICITACAO_EXAMES
  }

  resetToast() {
    this.store.dispatch(
      ErrorsActions.setDocumento({
        payload: {
          code: 'documento_error',
          msg: ''
        }
      })
    )
  }
}
