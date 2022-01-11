import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { FormEditarComponent } from './form-editar.component'

describe.skip('FormEditarComponent', () => {
  let component: FormEditarComponent
  let fixture: ComponentFixture<FormEditarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormEditarComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEditarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
