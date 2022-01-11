import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SolicitacaoExamesFormComponent } from './solicitacao-exames-form.component'

describe.skip('SolicitacaoExamesFormComponent', () => {
  let component: SolicitacaoExamesFormComponent
  let fixture: ComponentFixture<SolicitacaoExamesFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitacaoExamesFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacaoExamesFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
