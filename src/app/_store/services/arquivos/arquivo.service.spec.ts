import { TestBed } from '@angular/core/testing'
import { ArquivoService } from './arquivo.service'
import { HttpClientModule } from '@angular/common/http'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('ArquivosService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, PepStoreModule]
    })
  )

  it('should be created', () => {
    const service: ArquivoService = TestBed.get(ArquivoService)
    expect(service).toBeTruthy()
  })
})
