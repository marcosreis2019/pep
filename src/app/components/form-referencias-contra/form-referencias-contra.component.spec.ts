import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormReferenciasContraComponent } from './form-referencias-contra.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('FormReferenciasContraComponent', () => {
  let component: FormReferenciasContraComponent
  let fixture: ComponentFixture<FormReferenciasContraComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormReferenciasContraComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormReferenciasContraComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
