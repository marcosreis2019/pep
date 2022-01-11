import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockPersonalInfoHistoricoComponent } from './block-personal-info-historico.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe.skip('BlockPersonalInfoHistoricoComponent', () => {
  let component: BlockPersonalInfoHistoricoComponent
  let fixture: ComponentFixture<BlockPersonalInfoHistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockPersonalInfoHistoricoComponent],
      imports: [
        NgbPopoverModule,
        HttpClientModule,
        RouterTestingModule,
        PepStoreModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockPersonalInfoHistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
