import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { LabelFloatComponent } from './label-float.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe.skip('LabelFloatComponent', () => {
  let component: LabelFloatComponent
  let fixture: ComponentFixture<LabelFloatComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LabelFloatComponent],
      imports: [FormsModule, ReactiveFormsModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelFloatComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
