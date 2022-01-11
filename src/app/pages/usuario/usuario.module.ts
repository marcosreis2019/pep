import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UsuarioComponent } from './usuario.component'
import { UsuarioInfoComponent } from './usuario-info/usuario-info.component'
import { ProfissionalComponent } from './profissional/profissional.component'
import { RouterModule, Routes } from '@angular/router'

import { ComponentsModule } from 'src/app/components/components.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown'
import { FormsModule } from '@angular/forms'
const routes: Routes = [
  {
    path: '',
    component: UsuarioComponent
  }
]

@NgModule({
  declarations: [UsuarioComponent, ProfissionalComponent, UsuarioInfoComponent],
  imports: [
    FormsModule,
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
export class UsuarioModule {}
