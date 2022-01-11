import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockMotivoAtendimentoComponent } from './block-motivo-atendimento.component'
import {
  NgbTooltipModule,
  NgbAlertModule,
  NgbPopoverModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('BlockMotivoAtendimentoComponent', () => {
  let component: BlockMotivoAtendimentoComponent
  let fixture: ComponentFixture<BlockMotivoAtendimentoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockMotivoAtendimentoComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        NgbTypeaheadModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: BlockMotivoAtendimentoComponent }]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockMotivoAtendimentoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
