import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ModalHistoricoComponent } from './modal-historico.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { NgbTooltipModule, NgbAlertModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { PepStoreModule } from '../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
import { APP_BASE_HREF } from '@angular/common'

describe('ModalHistoricoComponent', () => {
  let component: ModalHistoricoComponent
  let fixture: ComponentFixture<ModalHistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalHistoricoComponent],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        PepStoreModule,
        HttpClientModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalHistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
