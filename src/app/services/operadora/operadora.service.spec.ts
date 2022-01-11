import { TestBed } from '@angular/core/testing';

import { OperadoraService } from './operadora.service';

describe('OperadoraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OperadoraService = TestBed.get(OperadoraService);
    expect(service).toBeTruthy();
  });
});
