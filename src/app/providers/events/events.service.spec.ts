import { TestBed } from '@angular/core/testing'

import { Events } from './events.service'

describe('Events', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: Events = TestBed.get(Events)
    expect(service).toBeTruthy()
  })
})
