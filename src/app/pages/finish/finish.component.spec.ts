import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FinishComponent } from './finish.component'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { HttpClientModule } from '@angular/common/http'

describe('FinishComponent', () => {
  let component: FinishComponent
  let fixture: ComponentFixture<FinishComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinishComponent],
      imports: [RouterTestingModule, PepStoreModule, HttpClientModule]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
