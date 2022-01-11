import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormDataComponent } from './form-data.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('FormDataComponent', () => {
  let component: FormDataComponent
  let fixture: ComponentFixture<FormDataComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormDataComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
