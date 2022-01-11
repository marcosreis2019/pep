import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { DynamicFormGenaratorComponent } from './dynamic-form-genarator.component'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { PepStoreModule } from '../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

describe('DynamicFormGenaratorComponent', () => {
  let component: DynamicFormGenaratorComponent
  let fixture: ComponentFixture<DynamicFormGenaratorComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormGenaratorComponent],
      imports: [
        RouterTestingModule,
        PepStoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormGenaratorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
