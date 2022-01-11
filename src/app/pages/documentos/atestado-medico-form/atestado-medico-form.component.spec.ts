import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AtestadoMedicoFormComponent } from './atestado-medico-form.component'

describe.skip('AtestadoMedicoFormComponent', () => {
  let component: AtestadoMedicoFormComponent
  let fixture: ComponentFixture<AtestadoMedicoFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtestadoMedicoFormComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AtestadoMedicoFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
