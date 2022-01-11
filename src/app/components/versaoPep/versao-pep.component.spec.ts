import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { VersaoPepComponent } from './versao-pep.component'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('VersaoPepComponent', () => {
  let component: VersaoPepComponent
  let fixture: ComponentFixture<VersaoPepComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VersaoPepComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(VersaoPepComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
