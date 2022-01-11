import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RelatorioEmEsperaComponent } from './relatorio-emespera.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'

@NgModule({
  declarations: [RelatorioEmEsperaComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    NgbModule,
    ComponentsModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild([{ path: '', component: RelatorioEmEsperaComponent }])
  ]
})
export class RelatorioEmEsperaComponentModule {}
