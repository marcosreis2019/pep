import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DocumentosComponent } from './documentos.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbTooltipModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe.skip('DocumentosComponent', () => {
  let component: DocumentosComponent
  let fixture: ComponentFixture<DocumentosComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentosComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbTooltipModule, NgbAlertModule, AngularToastifyModule],
      providers: [ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
