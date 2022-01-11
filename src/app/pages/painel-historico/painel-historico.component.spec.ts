import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { PainelHistoricoComponent } from './painel-historico.component'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('PainelComponent', () => {
  let component: PainelHistoricoComponent
  let fixture: ComponentFixture<PainelHistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PainelHistoricoComponent],
      imports: [
        RouterTestingModule,
        PepStoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PainelHistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have expandirPepRight method', () => {
    expect(component.expandirPepRight).toBeTruthy()
  })

  it('should have setLoading method', () => {
    expect(component.setLoading).toBeTruthy()
  })

  it('should have foundData method', () => {
    expect(component.foundData).toBeTruthy()
  })

  it('should have getPlano method', () => {
    expect(component.getPlano).toBeTruthy()
  })

  it('should have handlerToggleInSoap method', () => {
    expect(component.handlerToggleInSoap).toBeTruthy()
  })

  it('should have handlerDataInPlano method', () => {
    expect(component.handlerDataInPlano).toBeTruthy()
  })

  it('should have open method', () => {
    expect(component.open).toBeTruthy()
  })

  it('should have scrollPlan method', () => {
    expect(component.scrollPlan).toBeTruthy()
  })
})
