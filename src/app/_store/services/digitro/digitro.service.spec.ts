import { TestBed } from '@angular/core/testing'
import { DigitroService } from './digitro.service'
import { HttpClientModule } from '@angular/common/http'

describe('DigitroService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  )

  it('should be created', () => {
    const service: DigitroService = TestBed.get(DigitroService)
    expect(service).toBeTruthy()
  })
})
