import { TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { ParametrosService } from './parametros.service'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('ParametrosService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, PepStoreModule]
    })
  )

  it('should be created', () => {
    const service: ParametrosService = TestBed.get(ParametrosService)
    expect(service).toBeTruthy()
  })

  it('should have getKey method', () => {
    const service: ParametrosService = TestBed.get(ParametrosService)
    expect(service.getKey).toBeTruthy()
  })
})
