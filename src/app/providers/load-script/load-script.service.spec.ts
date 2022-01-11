import { TestBed } from '@angular/core/testing'

import { LoadScriptService } from './load-script.service'

describe('LoadScriptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: LoadScriptService = TestBed.get(LoadScriptService)
    expect(service).toBeTruthy()
  })
})
