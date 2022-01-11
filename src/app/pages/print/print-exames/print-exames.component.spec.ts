import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PrintExamesComponent } from './print-exames.component'

describe.skip('ExamesComponent', () => {
  let component: PrintExamesComponent
  let fixture: ComponentFixture<PrintExamesComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintExamesComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintExamesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
