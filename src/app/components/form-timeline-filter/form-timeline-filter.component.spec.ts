import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormTimelineFilterComponent } from './form-timeline-filter.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('FormTimelineFilterComponent', () => {
  let component: FormTimelineFilterComponent
  let fixture: ComponentFixture<FormTimelineFilterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormTimelineFilterComponent],
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTimelineFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
