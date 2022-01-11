import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PrintReferenciaComponent } from './print-referencia.component'

describe.skip('ReferenciaComponent', () => {
  let component: PrintReferenciaComponent
  let fixture: ComponentFixture<PrintReferenciaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintReferenciaComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintReferenciaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
