import { TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { CronogramaService } from './cronograma.service'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('CronogramaService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, PepStoreModule]
    })
  )

  it('should be created', () => {
    const service: CronogramaService = TestBed.get(CronogramaService)
    expect(service).toBeTruthy()
  })
})
