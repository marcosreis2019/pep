import { TestBed, async, inject } from '@angular/core/testing'

import { PainelGuard } from './painel.guard'

describe('PainelGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PainelGuard]
    })
  })

  it('should ...', inject([PainelGuard], (guard: PainelGuard) => {
    expect(guard).toBeTruthy()
  }))
})
