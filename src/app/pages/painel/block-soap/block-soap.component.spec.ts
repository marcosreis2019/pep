import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockSoapComponent } from './block-soap.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe.skip('BlockSoapComponent', () => {
  let component: BlockSoapComponent
  let fixture: ComponentFixture<BlockSoapComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockSoapComponent],
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
    fixture = TestBed.createComponent(BlockSoapComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
