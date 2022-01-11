import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockChangeableSubjetivoComponent } from './block-changeable-subjetivo.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockChangeableSubjetivoComponent', () => {
  let component: BlockChangeableSubjetivoComponent
  let fixture: ComponentFixture<BlockChangeableSubjetivoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockChangeableSubjetivoComponent],
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
    fixture = TestBed.createComponent(BlockChangeableSubjetivoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
