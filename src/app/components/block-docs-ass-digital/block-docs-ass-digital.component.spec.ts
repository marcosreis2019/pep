import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockDocsAssDigitalComponent } from './block-docs-ass-digital.component'
import { RouterTestingModule } from '@angular/router/testing'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe('BlockDocsAssDigitalComponent', () => {
  let component: BlockDocsAssDigitalComponent
  let fixture: ComponentFixture<BlockDocsAssDigitalComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockDocsAssDigitalComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        PepStoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularToastifyModule,
        RouterModule.forRoot([{ path: '', component: BlockDocsAssDigitalComponent }])
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }, ToastService]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockDocsAssDigitalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
