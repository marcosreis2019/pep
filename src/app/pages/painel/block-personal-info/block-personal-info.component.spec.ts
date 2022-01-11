import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockPersonalInfoComponent } from './block-personal-info.component'
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe.skip('BlockPersonalInfoComponent', () => {
  let component: BlockPersonalInfoComponent
  let fixture: ComponentFixture<BlockPersonalInfoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockPersonalInfoComponent],
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
    fixture = TestBed.createComponent(BlockPersonalInfoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
