import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RelatorioMedicoFormComponent } from './relatorio-medico-form.component'

describe.skip('RelatorioMedicoFormComponent', () => {
  let component: RelatorioMedicoFormComponent
  let fixture: ComponentFixture<RelatorioMedicoFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioMedicoFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioMedicoFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
