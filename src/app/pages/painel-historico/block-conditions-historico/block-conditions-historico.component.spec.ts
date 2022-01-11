import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockConditionsHistoricoComponent } from './block-conditions-historico.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockConditionsHistoricoComponent', () => {
  let component: BlockConditionsHistoricoComponent
  let fixture: ComponentFixture<BlockConditionsHistoricoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockConditionsHistoricoComponent],
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
    fixture = TestBed.createComponent(BlockConditionsHistoricoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
