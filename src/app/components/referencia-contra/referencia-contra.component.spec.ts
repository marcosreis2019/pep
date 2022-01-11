import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ReferenciaContraComponent } from './referencia-contra.component'

describe('ReferenciaContraComponent', () => {
  let component: ReferenciaContraComponent
  let fixture: ComponentFixture<ReferenciaContraComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenciaContraComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenciaContraComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
