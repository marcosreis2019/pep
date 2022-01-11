import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { ToggleComponent } from './toggle.component'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('ToggleComponent', () => {
  let component: ToggleComponent
  let fixture: ComponentFixture<ToggleComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
