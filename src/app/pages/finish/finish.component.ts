import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ProfissionalSelect } from 'src/app/_store/_modules/profissional/profissional.selectors'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { ProfissionalModels } from 'src/app/_store/_modules/profissional/profissional.model'
import { SubSink } from 'subsink'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit {
  constructor(private router: Router, private store: Store<PEPState>) {}
  pagAgenda: string = ProfissionalModels.HomePage.PEP_PAGE_AGENDA
  pagAtendimento: string = ProfissionalModels.HomePage.PEP_PAGE_ATENDIMENTO
  url = ''
  private subs$ = new SubSink()

  ngOnInit() {
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
  }

  redirectAgenda() {
    this.router.navigate([`${this.url}/${this.pagAgenda}`])
  }

  redirectAtendimento() {
    this.router.navigate([`${this.url}/${this.pagAtendimento}`])
  }

  finish() {}
}
