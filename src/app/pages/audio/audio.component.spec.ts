import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { AudioComponent } from './audio.component'
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

describe('AudioComponent', () => {
  let component: AudioComponent
  let fixture: ComponentFixture<AudioComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioComponent],
      imports: [HttpClientModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
