import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DetalhesComponent } from './detalhes.component'

describe.skip('DetalhesComponent', () => {
  let component: DetalhesComponent
  let fixture: ComponentFixture<DetalhesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetalhesComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
