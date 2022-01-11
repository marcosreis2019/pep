import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TextosService } from 'src/app/services/textos/textos.service'
import { SubSink } from 'subsink'
import { Store } from '@ngrx/store'
import { PEPState } from 'src/app/_store/store.models'
import { EmpresaSelect } from 'src/app/_store/_modules/empresa/empresa.selector'
@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  constructor(
    private route: Router,
    private textosService: TextosService,
    private store: Store<PEPState>
  ) {}
  title = ''
  content = ''
  subs$ = new SubSink()
  url = 'asq'
  ngOnInit() {
    this.subs$.add(
      this.textosService.get('PEP_ONBOARDING_BEMVINDO').subscribe(
        (data: any) => {
          this.title = data.titulo
          this.content = data.conteudo
        },
        err => {
          console.error(err)
        }
      )
    )
    this.subs$.add(
      this.store.select(EmpresaSelect.url).subscribe((data: string) => {
        this.url = data ? data : this.url
      })
    )
  }

  start() {
    this.route.navigate([`${this.url}/tipo_servico`])
  }
}
