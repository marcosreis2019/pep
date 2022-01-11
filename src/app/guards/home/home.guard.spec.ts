import { TestBed, async, inject } from '@angular/core/testing'
import { HomeGuard } from './home.guard'
import { PepStoreModule } from '../../_store/store.module'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientModule } from '@angular/common/http'

describe('HomeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PepStoreModule, RouterTestingModule, HttpClientModule],
      providers: [HomeGuard]
    })
  })

  it('should ...', inject([HomeGuard], (guard: HomeGuard) => {
    expect(guard).toBeTruthy()
  }))
})
