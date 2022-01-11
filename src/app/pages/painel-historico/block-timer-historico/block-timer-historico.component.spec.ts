import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockTimerHistoricoComponent } from './block-timer-historico.component'
import {
  NgbTooltipModule,
  NgbAlertModule,
  NgbModalModule,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe('BlockTimerHistoricoComponent', () => {
  let component: BlockTimerHistoricoComponent
  let fixture: ComponentFixture<BlockTimerHistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockTimerHistoricoComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        PepStoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbModalModule,
        NgbModule,
        AngularToastifyModule
      ],

      providers: [ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockTimerHistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
