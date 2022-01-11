import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormExameComponent } from './form-exame.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('FormExameComponent', () => {
  let component: FormExameComponent
  let fixture: ComponentFixture<FormExameComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormExameComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormExameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
