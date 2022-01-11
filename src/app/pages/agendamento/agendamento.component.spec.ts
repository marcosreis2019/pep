import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AgendamentoComponent } from './agendamento.component'
import { NgbTooltipModule, NgbAlertModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe.skip('AgendamentoComponent', () => {
  let component: AgendamentoComponent
  let fixture: ComponentFixture<AgendamentoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AgendamentoComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: AgendamentoComponent }]),
        FormsModule,
        ReactiveFormsModule,
        AngularToastifyModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamentoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
