import { TestBed } from '@angular/core/testing'
import { EspecialidadesService } from './especialidades.service'
import { HttpClientModule } from '@angular/common/http'
import { PepStoreModule } from '../../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'

describe('EspecialidadesService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, PepStoreModule]
    })
  )

  it('should be created', () => {
    const service: EspecialidadesService = TestBed.get(EspecialidadesService)
    expect(service).toBeTruthy()
  })
})
