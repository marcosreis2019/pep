import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RelatorioAgendamentoEventoComponent } from './relatorio-agendamento-evento.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  declarations: [RelatorioAgendamentoEventoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: RelatorioAgendamentoEventoComponent }])
  ]
})
export class RelatorioAgendamentoEventoComponentModule {}
