import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockConditionsComponent } from './block-conditions.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockConditionsComponent', () => {
  let component: BlockConditionsComponent
  let fixture: ComponentFixture<BlockConditionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockConditionsComponent],
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
    fixture = TestBed.createComponent(BlockConditionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
