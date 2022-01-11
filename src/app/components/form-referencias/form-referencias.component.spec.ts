import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormReferenciasComponent } from './form-referencias.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

describe.skip('FormReferenciasComponent', () => {
  let component: FormReferenciasComponent
  let fixture: ComponentFixture<FormReferenciasComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormReferenciasComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbTypeaheadModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReferenciasComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
