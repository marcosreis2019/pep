import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockTimerComponent } from './block-timer.component'
import {
  NgbPopoverModule,
  NgbTooltipModule,
  NgbAlertModule,
  NgbModalModule,
  NgbModule
} from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe('BlockTimerComponent', () => {
  let component: BlockTimerComponent
  let fixture: ComponentFixture<BlockTimerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockTimerComponent],
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
    fixture = TestBed.createComponent(BlockTimerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
