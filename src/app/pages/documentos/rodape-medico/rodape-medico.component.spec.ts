import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RodapeMedicoComponent } from './rodape-medico.component'

describe.skip('RodapeMedicoComponent', () => {
  let component: RodapeMedicoComponent
  let fixture: ComponentFixture<RodapeMedicoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RodapeMedicoComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RodapeMedicoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
