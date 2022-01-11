import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BlockExameComponent } from './block-exame.component'
import { RouterTestingModule } from '@angular/router/testing'
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
import { PepStoreModule } from '../../_store/store.module'
import { RouterModule } from '@angular/router'
import { APP_BASE_HREF } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('BlockExameComponent', () => {
  let component: BlockExameComponent
  let fixture: ComponentFixture<BlockExameComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockExameComponent],
      imports: [
        RouterTestingModule,
        NgbAlertModule,
        PepStoreModule,
        HttpClientModule,
        RouterModule.forRoot([{ path: '', component: BlockExameComponent }]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockExameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
