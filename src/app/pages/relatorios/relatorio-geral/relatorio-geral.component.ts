import { Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { UtilsService } from 'src/app/providers/utils/utils.service'
import { PEPState } from 'src/app/_store/store.models'
import { AtendimentoModel } from 'src/app/_store/_modules/atendimento/atendimento.model'
import { RelatoriosSelect } from 'src/app/_store/_modules/relatorios/relatorios.selectors'
import { BeneficiarioService } from 'src/app/_store/_modules/beneficiario/beneficiario.service'
import { BeneficiarioSelect } from 'src/app/_store/_modules/beneficiario/beneficiario.selector'

@Component({
  selector: 'app-relatorio-geral',
  templateUrl: './relatorio-geral.component.html',
  styleUrls: ['./relatorio-geral.component.scss']
})
export class RelatorioGeralComponent implements OnInit, OnDestroy {
  relatorio: AtendimentoModel.RelatorioGeral
  today = new Date()
  constructor(
    private store: Store<PEPState>,
    private uServ: UtilsService,
    private beneficiarioService: BeneficiarioService
  ) {}

  ngOnInit() {
    const d = this.uServ.getDateTime()
    this.store.select(RelatoriosSelect.relatorioGeral, { date: d }).subscribe((data: any) => {
      this.store.select(BeneficiarioSelect.dadosPessoais).subscribe(beneficiario => {
        this.beneficiarioService
          .getByMpiBeneficiarios(beneficiario.mpi)
          .subscribe(beneficiariosAis => {
            let beneficiarioAis =
              beneficiariosAis && beneficiariosAis.length ? beneficiariosAis[0] : null
            if (beneficiarioAis) {
              data.cpf.value = beneficiarioAis.cpf
              data.sexo.value = beneficiarioAis.sexo
              data.email.value =
                beneficiarioAis.emails && beneficiarioAis.emails.length
                  ? beneficiarioAis.emails[0].email
                  : ''
              if (beneficiarioAis.enderecos && beneficiarioAis.enderecos.length) {
                let endereco = beneficiarioAis.enderecos[0]
                data.cep.value = endereco.cep
                data.bairro.value = endereco.bairro
                data.endereco.value = `${endereco.logradouro} - ${endereco.cidade}/${endereco.uf}`
              }
            }
            this.relatorio = data
            console.log('teste retorno de massas do cid confirmado:', this.relatorio.avaliacao.cidSecundariosConfirmados)
            console.log('teste retorno de massas do cid suspeito:', this.relatorio.avaliacao.cidSecundariosSuspeitos)
          })
      })
    })
  }

  print() {
    window.print()
  }

  ngOnDestroy() {}
}
