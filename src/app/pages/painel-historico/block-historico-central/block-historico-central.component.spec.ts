import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockHistoricoCentralComponent } from './block-historico-central.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe.skip('BlockHistoricoCentralComponent', () => {
  let component: BlockHistoricoCentralComponent
  let fixture: ComponentFixture<BlockHistoricoCentralComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockHistoricoCentralComponent],
      imports: [
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
    fixture = TestBed.createComponent(BlockHistoricoCentralComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
