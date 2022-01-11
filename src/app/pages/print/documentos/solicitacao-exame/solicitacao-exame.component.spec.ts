import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { SolicitacaoExameComponent } from './solicitacao-exame.component'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe.skip('SolicitacaoExameComponent', () => {
  let component: SolicitacaoExameComponent
  let fixture: ComponentFixture<SolicitacaoExameComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitacaoExameComponent],
      imports: [FormsModule, ReactiveFormsModule, NgbTooltipModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitacaoExameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
