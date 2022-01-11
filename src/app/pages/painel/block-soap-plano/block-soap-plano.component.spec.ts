import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockSoapPlanoComponent } from './block-soap-plano.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe.skip('BlockSoapPlanoComponent', () => {
  let component: BlockSoapPlanoComponent
  let fixture: ComponentFixture<BlockSoapPlanoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockSoapPlanoComponent],
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
    fixture = TestBed.createComponent(BlockSoapPlanoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
