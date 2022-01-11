import { TestBed } from '@angular/core/testing'
import { CidService } from './cid.service'
import { HttpClientModule } from '@angular/common/http'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('CidService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, PepStoreModule, RouterTestingModule]
    })
  )

  it('should be created', () => {
    const service: CidService = TestBed.get(CidService)
    expect(service).toBeTruthy()
  })
})
