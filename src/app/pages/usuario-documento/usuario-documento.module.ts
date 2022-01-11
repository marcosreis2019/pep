import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UsuarioDocumentoComponent } from './usuario-documento.component'
import { RouterModule } from '@angular/router'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { ComponentsModule } from 'src/app/components/components.module'

@NgModule({
  declarations: [UsuarioDocumentoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    NgbTypeaheadModule,
    ComponentsModule,
    RouterModule.forChild([{ path: '', component: UsuarioDocumentoComponent}])
  ]
})
export class UsuarioDocumentoComponentModule { }
