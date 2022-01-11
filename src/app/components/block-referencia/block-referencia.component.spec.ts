import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockReferenciaComponent } from './block-referencia.component'
import {
  NgbTooltipModule,
  NgbAlertModule,
  NgbPopoverModule,
  NgbTypeaheadModule
} from '@ng-bootstrap/ng-bootstrap'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF, DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('BlockReferenciaComponent', () => {
  let component: BlockReferenciaComponent
  let fixture: ComponentFixture<BlockReferenciaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockReferenciaComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        NgbTooltipModule,
        NgbPopoverModule,
        NgbTypeaheadModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: BlockReferenciaComponent }]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, DatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockReferenciaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
