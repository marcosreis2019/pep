import { LOCALE_ID, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { FlatpickrModule } from 'angularx-flatpickr'
import { CalendarModule, DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { NgbModalModule, NgbTypeaheadModule, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router'
import { ComponentsModule } from 'src/app/components/components.module'
import { PipesModule } from 'src/app/pipes/pipes.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { CadastroCronogramaComponent } from './cronograma.component'

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
    CalendarModule.forRoot({
      provide: DateAdapter, 
      useFactory: adapterFactory
    }),
    RouterModule.forChild([{ path: '', component: CadastroCronogramaComponent }])
  ],
  declarations: []
})
export class CronogramaModule {}
