import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ElaboracaoComponent } from './elaboracao/elaboracao.component'
import { AtestadoMedicoFormComponent } from './atestado-medico-form/atestado-medico-form.component'
import { RelatorioMedicoFormComponent } from './relatorio-medico-form/relatorio-medico-form.component'
import { SolicitacaoExamesFormComponent } from './solicitacao-exames-form/solicitacao-exames-form.component'
import { RouterModule, Routes } from '@angular/router'

import { ComponentsModule } from 'src/app/components/components.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { FormsModule } from '@angular/forms'
import { RodapeMedicoComponent } from './rodape-medico/rodape-medico.component'
const routes: Routes = [
  {
    path: '',
    component: ElaboracaoComponent
  }
]

@NgModule({
  declarations: [
    ElaboracaoComponent,
    AtestadoMedicoFormComponent,
    RelatorioMedicoFormComponent,
    SolicitacaoExamesFormComponent,
    RodapeMedicoComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgbAlertModule,
    NgbModule,
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    RouterModule.forChild(routes)
  ]
})
export class DocumentosModule {}
