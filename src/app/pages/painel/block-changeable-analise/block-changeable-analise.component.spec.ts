import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockChangeableAnaliseComponent } from './block-changeable-analise.component'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockChangeableAnaliseComponent', () => {
  let component: BlockChangeableAnaliseComponent
  let fixture: ComponentFixture<BlockChangeableAnaliseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockChangeableAnaliseComponent],
      imports: [RouterTestingModule, PepStoreModule, HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: []
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockChangeableAnaliseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
