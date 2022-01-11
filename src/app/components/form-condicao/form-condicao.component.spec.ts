import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { FormCondicaoComponent } from './form-condicao.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  NgbAlertModule,
  NgbDatepickerModule,
  NgbPopoverModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
  NgbModule,
  NgbModalModule,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap'
import { HttpClientModule } from '@angular/common/http'
import { PepStoreModule } from '../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('FormCondicaoComponent', () => {
  let component: FormCondicaoComponent
  let fixture: ComponentFixture<FormCondicaoComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormCondicaoComponent],
      imports: [
        HttpClientModule,
        NgbTypeaheadModule,
        FormsModule,
        ReactiveFormsModule,
        PepStoreModule,
        RouterTestingModule
      ],
      providers: []
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCondicaoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
