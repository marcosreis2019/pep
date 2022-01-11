import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PacienteComponent } from './paciente.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  declarations: [PacienteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    ComponentsModule,
    NgbAlertModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: PacienteComponent }])
  ]
})
export class PacienteComponentModule {}
