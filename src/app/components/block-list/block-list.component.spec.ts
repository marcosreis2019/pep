import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockListComponent } from './block-list.component'
import { NgbTooltipModule, NgbAlertModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('BlockListComponent', () => {
  let component: BlockListComponent
  let fixture: ComponentFixture<BlockListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockListComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: BlockListComponent }]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
