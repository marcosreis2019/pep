import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { VersaoComponent } from './versao.component'
import { RouterTestingModule } from '@angular/router/testing'

describe('VersaoComponent', () => {
  let component: VersaoComponent
  let fixture: ComponentFixture<VersaoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VersaoComponent],
      imports: [RouterTestingModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(VersaoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
