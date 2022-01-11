import { DirectivesModule } from 'src/app/directives/directives.module'

import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { NgbTooltipModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { PrintComponent } from './print.component'
import { ComponentsModule } from 'src/app/components/components.module'
import { PipesModule } from 'src/app/pipes/pipes.module'
import { DocumentosComponent } from './documentos/documentos.component'
import { AtestadoComponent } from './documentos/atestado/atestado.component'
import { SolicitacaoExameComponent } from './documentos/solicitacao-exame/solicitacao-exame.component'
import { RelatorioMedicoComponent } from './documentos/relatorio-medico/relatorio-medico.component'

const printRoutes: Routes = [
  {
    path: 'documentos',
    component: DocumentosComponent
  }
]

@NgModule({
  declarations: [
    RelatorioMedicoComponent,
    SolicitacaoExameComponent,
    DocumentosComponent,
    AtestadoComponent,
    PrintComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    PipesModule,
    NgbTooltipModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(printRoutes),
    NgbAlertModule
  ]
})
export class PrintModule {}
