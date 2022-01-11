import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormAlergiaComponent } from './form-alergia.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('FormAlergiaComponent', () => {
  let component: FormAlergiaComponent
  let fixture: ComponentFixture<FormAlergiaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormAlergiaComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAlergiaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
