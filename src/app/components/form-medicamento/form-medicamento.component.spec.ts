import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormMedicamentoComponent } from './form-medicamento.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('FormMedicamentoComponent', () => {
  let component: FormMedicamentoComponent
  let fixture: ComponentFixture<FormMedicamentoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormMedicamentoComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMedicamentoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
