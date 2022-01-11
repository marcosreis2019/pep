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

import { PainelComponent } from './painel.component'
import { BlockChangeableDefaultComponent } from './block-changeable-default/block-changeable-default.component'
import { BlockChangeablePlanoComponent } from './block-changeable-plano/block-changeable-plano.component'
import { BlockChangeableAnaliseComponent } from './block-changeable-analise/block-changeable-analise.component'
import { BlockChangeableObjetivoComponent } from './block-changeable-objetivo/block-changeable-objetivo.component'
import { BlockChangeableSubjetivoComponent } from './block-changeable-subjetivo/block-changeable-subjetivo.component'
import { BlockChangeableResultadosExamesComponent } from './block-changeable-resultados-exames/block-changeable-resultados-exames.component'
import { BlockConditionsComponent } from './block-conditions/block-conditions.component'
import { BlockPersonalInfoComponent } from './block-personal-info/block-personal-info.component'
import { BlockSoapComponent } from './block-soap/block-soap.component'
import { BlockSoapPlanoComponent } from './block-soap-plano/block-soap-plano.component'
import { BlockTimelineComponent } from './block-timeline/block-timeline.component'
import { BlockTimerComponent } from './block-timer/block-timer.component'

import { LoadScriptService } from 'src/app/providers/load-script/load-script.service'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'

// multi select com dropdown
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const ROUTES: Route[] = [{ path: '', component: PainelComponent }]

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  useBothWheelAxes: true
}

@NgModule({
  declarations: [
    PainelComponent,
    BlockChangeableDefaultComponent,
    BlockChangeablePlanoComponent,
    BlockChangeableAnaliseComponent,
    BlockChangeableObjetivoComponent,
    BlockChangeableSubjetivoComponent,
    BlockChangeableResultadosExamesComponent,
    BlockConditionsComponent,
    BlockPersonalInfoComponent,
    BlockSoapComponent,
    BlockSoapPlanoComponent,
    BlockTimelineComponent,
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
export class PainelComponentModule {}
