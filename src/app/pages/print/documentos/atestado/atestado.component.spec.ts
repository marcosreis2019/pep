import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AtestadoComponent } from './atestado.component'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('AtestadoComponent', () => {
  let component: AtestadoComponent
  let fixture: ComponentFixture<AtestadoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AtestadoComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbTooltipModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AtestadoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
