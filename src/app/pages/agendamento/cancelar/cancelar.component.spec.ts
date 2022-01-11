import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CancelarComponent } from './cancelar.component'

describe.skip('CancelarComponent', () => {
  let component: CancelarComponent
  let fixture: ComponentFixture<CancelarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelarComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
