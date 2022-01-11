import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockPrescricaoComponent } from './block-prescricao.component'
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

describe('BlockPrescricaoComponent', () => {
  let component: BlockPrescricaoComponent
  let fixture: ComponentFixture<BlockPrescricaoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockPrescricaoComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        NgbTypeaheadModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: BlockPrescricaoComponent }]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockPrescricaoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
