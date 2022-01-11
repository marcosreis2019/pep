import { TestBed } from '@angular/core/testing'
import { MemedService } from './memed.service'
import { HttpClientModule } from '@angular/common/http'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('MemedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, PepStoreModule]
    })
  })

  it('should be created', () => {
    const service: MemedService = TestBed.get(MemedService)
    expect(service).toBeTruthy()
  })

  it('should have init method', () => {
    const service: MemedService = TestBed.get(MemedService)
    expect(service.init).toBeTruthy()
  })

  it('should have addPaciente method', () => {
    const service: MemedService = TestBed.get(MemedService)
    expect(service.addPaciente).toBeTruthy()
  })

  it('should have getPrescricao method', () => {
    const service: MemedService = TestBed.get(MemedService)
    expect(service.getPrescricao).toBeTruthy()
  })

  it('should have remove method', () => {
    const service: MemedService = TestBed.get(MemedService)
    expect(service.remove).toBeTruthy()
  })
})
