import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DynamicFormInputComponent } from './dynamic-form-input.component'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('DynamicFormInputComponent', () => {
  let component: DynamicFormInputComponent
  let fixture: ComponentFixture<DynamicFormInputComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormInputComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
