import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CalendarComponent } from './calendar.component'
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterTestingModule } from '@angular/router/testing'
import { APP_BASE_HREF } from '@angular/common'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'

describe('CalendarComponent', () => {
  let component: CalendarComponent
  let fixture: ComponentFixture<CalendarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      imports: [RouterTestingModule, NgbDatepickerModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
