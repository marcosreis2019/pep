import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ElaboracaoComponent } from './elaboracao.component'

describe.skip('ElaboracaoComponent', () => {
  let component: ElaboracaoComponent
  let fixture: ComponentFixture<ElaboracaoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ElaboracaoComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ElaboracaoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
