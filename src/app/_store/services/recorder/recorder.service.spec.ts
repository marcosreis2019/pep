import { TestBed } from '@angular/core/testing'
import { RecorderService } from './recorder.service'
import { HttpClientModule } from '@angular/common/http'

describe('RecorderService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  )

  it('should be created', () => {
    const service: RecorderService = TestBed.get(RecorderService)
    expect(service).toBeTruthy()
  })
})
