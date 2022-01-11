import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
  NgbModule,
  NgbModalModule,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { BlockExameComponent } from './block-exame/block-exame.component'
import { BlockListComponent } from './block-list/block-list.component'
import { BlockMotivoAtendimentoComponent } from './block-motivo-atendimento/block-motivo-atendimento.component'
import { BlockPrescricaoComponent } from './block-prescricao/block-prescricao.component'
import { BlockReferenciaComponent } from './block-referencia/block-referencia.component'
import { CalendarComponent } from './calendar/calendar.component'
import { CheckboxComponent } from './checkbox/checkbox.component'
import { DirectivesModule } from '../directives/directives.module'
import { DynamicFormGenaratorComponent } from './dynamic-form-genarator/dynamic-form-genarator.component'
import { DynamicFormInputComponent } from './dynamic-form-input/dynamic-form-input.component'
import { ExameComponent } from './exame/exame.component'
import { FormAlergiaComponent } from './form-alergia/form-alergia.component'
import { FormCondicaoComponent } from './form-condicao/form-condicao.component'
import { FormExameComponent } from './form-exame/form-exame.component'
import { FormMedicamentoComponent } from './form-medicamento/form-medicamento.component'
import { FormDataComponent } from './form-data/form-data.component'
import { FormReferenciasComponent } from './form-referencias/form-referencias.component'
import { FormReferenciasContraComponent } from './form-referencias-contra/form-referencias-contra.component'
import { FormRetornoComponent } from './form-retorno/form-retorno.component'
import { FormTimelineFilterComponent } from './form-timeline-filter/form-timeline-filter.component'
import { LoadingComponent } from './loading/loading.component'
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar'
import { PrescricaoComponent } from './prescricao/prescricao.component'
import { ReferenciaComponent } from './referencia/referencia.component'
import { ReferenciaContraComponent } from './referencia-contra/referencia-contra.component'
import { SelectCheckComponent } from './select-check/select-check.component'
import { SwitchComponent } from './switch/switch.component'
import { ToggleComponent } from './toggle/toggle.component'
import { FormCompletedComponent } from './form-completed/form-completed.component'
import { ModalHistoricoComponent } from './modal-historico-referencia/modal-historico.component'
import { MenuComponent } from './menu/menu.component'
import { VersaoPepComponent } from './versaoPep/versao-pep.component'
import { MaxCountComponent } from './max-count/max-count.component'
import { LabelFloatComponent } from './label-float/label-float.component'
import { BlockDocsAssDigitalComponent } from './block-docs-ass-digital/block-docs-ass-digital.component'
import { CadastroPacienteComponent } from './cadastro-paciente/cadastro-paciente.component'
import { HistoricoComponent } from '../pages/agendamento/historico/historico.component'
import { ClassificacaoComponent } from '../pages/classificacao/classificacao.component'
import { TipoServicoComponent } from '../pages/tipo-servico/tipo-servico.component'
import { CadastroCronogramaComponent } from '../pages/cronograma/cronograma.component'
import { ModalCIDsComponent } from './modal-cids/modal-cids.component'
import { TermosComponent } from '../pages/termos/termos.component'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  useBothWheelAxes: true
}

const declarations = [
  BlockExameComponent,
  BlockDocsAssDigitalComponent,
  BlockListComponent,
  BlockMotivoAtendimentoComponent,
  BlockPrescricaoComponent,
  BlockReferenciaComponent,
  CalendarComponent,
  CheckboxComponent,
  DynamicFormGenaratorComponent,
  DynamicFormInputComponent,
  ExameComponent,
  MenuComponent,
  VersaoPepComponent,
  MaxCountComponent,
  LabelFloatComponent,
  LoadingComponent,
  FormAlergiaComponent,
  FormCompletedComponent,
  FormCondicaoComponent,
  FormExameComponent,
  FormMedicamentoComponent,
  FormDataComponent,
  FormReferenciasComponent,
  FormReferenciasContraComponent,
  FormRetornoComponent,
  FormTimelineFilterComponent,
  ModalHistoricoComponent,
  ModalCIDsComponent,
  PrescricaoComponent,
  ReferenciaComponent,
  ReferenciaContraComponent,
  SelectCheckComponent,
  SwitchComponent,
  ToggleComponent,
  CadastroPacienteComponent,
  ClassificacaoComponent,
  CadastroCronogramaComponent,
  TipoServicoComponent,
  HistoricoComponent,
  TermosComponent
]
@NgModule({
  declarations: [...declarations],
  imports: [
    CommonModule,
    DirectivesModule,
    FormsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbPopoverModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    PerfectScrollbarModule
  ],
  exports: [...declarations],
  providers: [
    DatePipe,
    NgbActiveModal,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ComponentsModule {}
