import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Route } from '@angular/router'

import {
  NgbPopoverModule,
  NgbTooltipModule,
  NgbAlertModule,
  NgbModalModule,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap'

import { ComponentsModule } from 'src/app/components/components.module'
import { DirectivesModule } from 'src/app/directives/directives.module'
import { PipesModule } from 'src/app/pipes/pipes.module'

import { PainelHistoricoComponent } from './painel-historico.component'
import { BlockListLateralComponent } from './block-list-lateral-historicos/block-list-lateral.component'
import { BlockConditionsHistoricoComponent } from './block-conditions-historico/block-conditions-historico.component'
import { BlockPersonalInfoHistoricoComponent } from './block-personal-info-historico/block-personal-info-historico.component'
import { BlockHistoricoCentralComponent } from './block-historico-central/block-historico-central.component'
import { BlockFilterComponent } from './block-filter/block-filter.component'

import { LoadScriptService } from 'src/app/providers/load-script/load-script.service'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'

// multi select com dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BlockTimerHistoricoComponent } from './block-timer-historico/block-timer-historico.component'
import { BlockTimerComponent } from './block-gerar-prontuarios/block-timer.component'

const ROUTES: Route[] = [{ path: '', component: PainelHistoricoComponent }]

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  useBothWheelAxes: true
}

@NgModule({
  declarations: [
    PainelHistoricoComponent,
    BlockListLateralComponent,
    BlockConditionsHistoricoComponent,
    BlockPersonalInfoHistoricoComponent,
    BlockHistoricoCentralComponent,
    BlockFilterComponent,
    BlockTimerHistoricoComponent,
    BlockTimerComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    NgbAlertModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbModule,
    NgbPopoverModule,
    PerfectScrollbarModule,
    NgMultiSelectDropDownModule,
    RouterModule.forChild(ROUTES)
  ],
  providers: [
    LoadScriptService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PainelHistoricoComponentModule {}
