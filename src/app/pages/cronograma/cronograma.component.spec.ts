import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { PepStoreModule } from '../../_store/store.module'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { AngularToastifyModule, ToastService } from 'angular-toastify'
import { CadastroCronogramaComponent } from './cronograma.component'

describe.skip('CadastroCronogramaComponent', () => {
  let component: CadastroCronogramaComponent
  let fixture: ComponentFixture<CadastroCronogramaComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroCronogramaComponent],
      imports: [
        RouterTestingModule,
        PepStoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AngularToastifyModule
      ],
      providers: [ToastService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroCronogramaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
