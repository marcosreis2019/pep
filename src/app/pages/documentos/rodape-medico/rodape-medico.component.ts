import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { LocalSelect } from 'src/app/_store/_modules/local/local.selectors'
import { UtilsService } from 'src/app/providers/utils/utils.service'

@Component({
  selector: 'app-rodape-medico',
  templateUrl: './rodape-medico.component.html',
  styleUrls: ['./rodape-medico.component.scss']
})
export class RodapeMedicoComponent implements OnInit {
  nomeMedico = ''
  conselhoProfissional = ''
  numeroConselho = ''
  ufConselho = ''
  localAtendimento = ''
  localCnes = ''
  endereco = ''
  bairro = ''
  cidade = ''
  uf = ''
  fone = ''
  dataEmissao = ''

  constructor(private store: Store<PEPState>, private utilsService: UtilsService) {}

  ngOnInit() {
    const today = this.utilsService.getFormattedDateHour(this.utilsService.getToday())
    this.store.select(ProfissionalSelect.profissional).subscribe(
      (data: any) => {
        this.nomeMedico = data.pessoa.nome_completo
        this.conselhoProfissional = data.conselhoProfissional
        this.numeroConselho = data.numeroConselho
        this.ufConselho = data.ufConselho
        this.dataEmissao = today
      },
      err => {
        console.error(err)
      }
    )
    this.store.select(LocalSelect.local).subscribe(
      data => {
        this.localAtendimento = data.razao_social
        this.localCnes = data.cnes
        this.cidade = data.municipio.nome
        this.uf = data.municipio.uf
        this.endereco = data.logradouro
        this.bairro = data.bairro
        this.fone =
          data.fones_list && data.fones_list.length
            ? this.formatPhone(data.fones_list[0].numero)
            : ''
      },
      err => {}
    )
  }

  formatPhone(value) {
    if (!value) {
      return ''
    }
    return value.substring(0, 10) + '-' + value.substring(10)
  }
}
