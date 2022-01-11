import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RelatorioMedicoComponent } from './relatorio-medico.component'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('RelatorioMedicoComponent', () => {
  let component: RelatorioMedicoComponent
  let fixture: ComponentFixture<RelatorioMedicoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioMedicoComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbTooltipModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioMedicoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
