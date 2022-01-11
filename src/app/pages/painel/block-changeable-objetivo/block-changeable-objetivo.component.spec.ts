import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockChangeableObjetivoComponent } from './block-changeable-objetivo.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockChangeableObjetivoComponent', () => {
  let component: BlockChangeableObjetivoComponent
  let fixture: ComponentFixture<BlockChangeableObjetivoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockChangeableObjetivoComponent],
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
    fixture = TestBed.createComponent(BlockChangeableObjetivoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
