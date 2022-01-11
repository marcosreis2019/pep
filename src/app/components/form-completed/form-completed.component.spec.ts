import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormCompletedComponent } from './form-completed.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('FormCompletedComponent', () => {
  let component: FormCompletedComponent
  let fixture: ComponentFixture<FormCompletedComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormCompletedComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCompletedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
