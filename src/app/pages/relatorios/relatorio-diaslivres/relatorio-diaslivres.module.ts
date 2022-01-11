import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RelatorioDiasLivresComponent } from './relatorio-diaslivres.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  declarations: [RelatorioDiasLivresComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: RelatorioDiasLivresComponent }])
  ]
})
export class RelatorioDiasLivresComponentModule {}
