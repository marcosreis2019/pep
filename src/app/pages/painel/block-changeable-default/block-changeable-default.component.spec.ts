import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BlockChangeableDefaultComponent } from './block-changeable-default.component'

describe('BlockChangeableDefaultComponent', () => {
  let component: BlockChangeableDefaultComponent
  let fixture: ComponentFixture<BlockChangeableDefaultComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockChangeableDefaultComponent ]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockChangeableDefaultComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
