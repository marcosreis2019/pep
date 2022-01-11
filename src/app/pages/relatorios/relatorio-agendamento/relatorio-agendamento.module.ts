import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RelatorioAgendamentoComponent } from './relatorio-agendamento.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { AgePipe } from 'src/app/pipes/age/age.pipe'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  declarations: [RelatorioAgendamentoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: RelatorioAgendamentoComponent }])
  ],
  providers: [AgePipe]
})
export class RelatorioAgendamentoComponentModule {}
