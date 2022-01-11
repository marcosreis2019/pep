import { CommonModule } from '@angular/common'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Router } from '@angular/router'
import { NgbPopoverModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { PipesModule } from 'src/app/pipes/pipes.module'
import { HomeComponent } from './home.component'
import { ComponentsModule } from 'src/app/components/components.module'

@NgModule({
  declarations: [HomeComponent],
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    PipesModule,
    DirectivesModule,
    NgbPopoverModule,
    NgbModule,
    NgbModalModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }])
  ]
})
export class HomeComponentModule {}
