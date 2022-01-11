import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormRetornoComponent } from './form-retorno.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('FormRetornoComponent', () => {
  let component: FormRetornoComponent
  let fixture: ComponentFixture<FormRetornoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormRetornoComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRetornoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
