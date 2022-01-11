import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

import { ComponentsModule } from 'src/app/components/components.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { LocalComponent } from './local.component'
const routes: Routes = [
  {
    path: '',
    component: LocalComponent
  }
]

@NgModule({
  declarations: [LocalComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbAlertModule,
    NgbModule,
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(routes)
  ]
})
export class LocalModule {}
