import { TestBed, async } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { PepStoreModule } from './_store/store.module'
import { HttpClientModule } from '@angular/common/http'
import { AngularToastifyModule, ToastService } from 'angular-toastify'

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, PepStoreModule, HttpClientModule, AngularToastifyModule],
      providers: [ToastService]
    }).compileComponents()
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })
})
