import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ExameComponent } from './exame.component'

describe('ExameComponent', () => {
  let component: ExameComponent
  let fixture: ComponentFixture<ExameComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExameComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ExameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
