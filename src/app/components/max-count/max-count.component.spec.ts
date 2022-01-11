import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MaxCountComponent } from './max-count.component'
import { RouterTestingModule } from '@angular/router/testing'

describe('LoadingComponent', () => {
  let component: MaxCountComponent
  let fixture: ComponentFixture<MaxCountComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaxCountComponent],
      imports: [RouterTestingModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxCountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
