import { TestBed } from '@angular/core/testing'
import { HttpClientModule } from '@angular/common/http'
import { CoreService } from './core.service'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('CoreService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PepStoreModule, HttpClientModule]
    })
  )

  it('should be created', () => {
    const service: CoreService = TestBed.get(CoreService)
    expect(service).toBeTruthy()
  })

  it('should have enviaEmail method', () => {
    const service: CoreService = TestBed.get(CoreService)
    expect(service.enviaEmail).toBeTruthy()
  })

  it('should have enviaSms method', () => {
    const service: CoreService = TestBed.get(CoreService)
    expect(service.enviaSms).toBeTruthy()
  })
})
