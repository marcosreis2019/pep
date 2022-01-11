import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { HistoricoComponent } from './historico.component'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('HistoricoComponent', () => {
  let component: HistoricoComponent
  let fixture: ComponentFixture<HistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, PepStoreModule, RouterTestingModule],
      declarations: [HistoricoComponent],
      providers: []
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
