import { Component, OnInit, Input } from '@angular/core'
import { DocumentoService } from 'src/app/_store/_modules/documento/documento.service'
import { DocumentoModels } from 'src/app/_store/_modules/documento/documento.model'
import { PeriodoService } from 'src/app/_store/_modules/periodo/periodo.service'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoSelect } from 'src/app/_store/_modules/atendimento/atendimento.selector'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { PEPError } from 'src/app/_store/_modules/errors/errors.models'
import { Observable } from 'rxjs'
import { ErrorsActions } from 'src/app/_store/_modules/errors/errors.actions'
import { ErrorsSelect } from 'src/app/_store/_modules/errors/errors.selectors'
import { Router } from '@angular/router'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
import { SubSink } from 'subsink'

@Component({
  selector: 'app-relatorio-medico-form',
  templateUrl: './relatorio-medico-form.component.html',
  styleUrls: ['./relatorio-medico-form.component.scss']
})
export class RelatorioMedicoFormComponent implements OnInit {
  private subs$ = new SubSink()
  @Input() documentType: DocumentoModels.DocumentoTipo
  loading = false
  error$: Observable<PEPError>
  url = ''
  constructor(
    private periodoService: PeriodoService,
    private store: Store<PEPState>,
    private utilsService: UtilsService,
    private documentoService: DocumentoService,
    private router: Router
  ) {}
  periodoUnidades
  documento: DocumentoModels.Documento
  nameChanged = false
  beneficiarioNomeAux = ''

  inicializaDocumento() {
    this.documento = DocumentoModels.getDefault()
  }

  ngOnInit() {
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
    this.inicializaDocumento()
    this.documento.documentos_tipos_id = this.documentType.id
    const today = this.utilsService.getFormattedDateHour(this.utilsService.getToday())
    this.documento.data_emissao = today
    this.store.select(BeneficiarioSelect.dadosPessoais).subscribe(
      data => {
        this.documento.beneficiario_mpi = data.mpi
        this.documento.beneficiario_nome = data.nomeCompleto
        this.beneficiarioNomeAux = data.nomeCompleto
      },
      err => {
        console.error(err)
      }
    )

    this.store.select(AtendimentoSelect.antedimentoParaAPI).subscribe(
      data => {
        this.documento.atendimento_sequencial = data.sequencial
        this.documento.beneficiario_mpi = data.mpi
      },
      err => {
        console.error(err)
      }
    )

    this.store.select(ProfissionalSelect.profissional).subscribe(
      data => {
        this.documento.profissional_conselho_sigla = data.conselhoProfissional
        this.documento.profissional_conselho_numero = data.numeroConselho
        this.documento.profissional_conselho_uf = data.ufConselho
        this.documento.profissional_id = data.id
        this.documento.profissional_mpi = data.pessoa.mpi ? data.pessoa.mpi : ''
        this.documento.profissional_nome = data.pessoa.nome_completo
          ? data.pessoa.nome_completo
          : ''
      },
      err => {
        console.error(err)
      }
    )

    this.store.select(LocalSelect.local).subscribe(
      data => {
        this.documento.local_atendimento = data.razao_social
        this.documento.cidade = data.municipio.nome
        this.documento.uf = data.municipio.uf
        this.documento.local_id = data.id
        this.documento.local_cnes = data.cnes
        this.documento.endereco = data.logradouro
        this.documento.bairro = data.bairro
        this.documento.telefone =
          data.fones_list && data.fones_list.length ? data.fones_list[0].numero : ''
      },
      err => {
        console.error(err)
      }
    )

    this.periodoService.getUnidades().subscribe(
      data => {
        this.periodoUnidades = data.data.map(item => {
          return {
            id: item.id,
            value: item.descricao
          }
        })
      },
      err => {
        console.error(err)
      }
    )

    this.periodoService.getUnidades().subscribe(
      data => {
        this.periodoUnidades = data.data.map(item => {
          return {
            id: item.id,
            value: item.descricao
          }
        })
      },
      err => {
        console.error(err)
        this.store.dispatch(
          ErrorsActions.setDocumento({
            payload: {
              code: 'documento_error',
              msg: 'Ocorreu um erro ao buscar as infomações de período do documento!'
            }
          })
        )
      }
    )

    this.error$ = this.store.select(ErrorsSelect.documento)
  }

  changeName() {
    if (!this.nameChanged) {
      this.documento.beneficiario_nome = this.beneficiarioNomeAux
    }
    this.documento.nome_alterado = this.nameChanged
  }

  save() {
    this.loading = true
    this.documento.documentos_tipos_id = this.documentType.id
    const payload = { ...this.documento }
    payload.observacao = payload.observacao.replace(/\n/g, '<br/>')
    delete payload.data_emissao
    payload.nome_alterado =
      this.documento.nome_alterado && this.documento.beneficiario_nome !== this.beneficiarioNomeAux

    this.documentoService.post(payload).subscribe(
      res => {
        const idDoc = res.data
        this.loading = false
        this.inicializaDocumento()
        this.router.navigate([`${this.url}/print/documentos`], {
          queryParams: { idDocumento: idDoc }
        })
      },
      err => {
        console.error(err.error)
        this.loading = false
        const error = err.error.message
        this.store.dispatch(
          ErrorsActions.setDocumento({
            payload: {
              code: 'documento_error',
              msg: 'Ocorreu um erro ao salvar os dados do documento!'
            }
          })
        )
      }
    )
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
