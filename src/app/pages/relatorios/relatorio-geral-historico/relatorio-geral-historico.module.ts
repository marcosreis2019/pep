import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { AgePipe } from 'src/app/pipes/age/age.pipe'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { RelatorioGeralHistoricoComponent } from './relatorio-geral-historico.component'

@NgModule({
  declarations: [RelatorioGeralHistoricoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: RelatorioGeralHistoricoComponent }])
  ],
  providers: [AgePipe]
})
export class RelatorioGeralHistoricoComponentModule {}
