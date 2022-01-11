import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockFilterComponent } from './block-filter.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('BlockFilterComponent', () => {
  let component: BlockFilterComponent
  let fixture: ComponentFixture<BlockFilterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockFilterComponent],
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
    fixture = TestBed.createComponent(BlockFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
