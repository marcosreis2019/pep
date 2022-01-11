import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { FlatpickrModule } from 'angularx-flatpickr'
import { NgbModalModule, NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router'
import { ComponentsModule } from 'src/app/components/components.module'
import { PipesModule } from 'src/app/pipes/pipes.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { TermosComponent } from './termos.component'

@NgModule({
  imports: [
    DirectivesModule,
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTypeaheadModule,
    NgbModule,
    NgbModalModule,
    PipesModule,
    FlatpickrModule.forRoot(),
    RouterModule.forChild([{ path: '', component: TermosComponent }])
  ],
  declarations: []
})
export class TermoModule {}
