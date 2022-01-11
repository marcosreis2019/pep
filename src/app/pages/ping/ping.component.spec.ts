import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { PingComponent } from './ping.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('FinishComponent', () => {
  let component: PingComponent
  let fixture: ComponentFixture<PingComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PingComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: []
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
