import { TestBed } from '@angular/core/testing';

import { TextosService } from './textos.service';

describe('TextosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextosService = TestBed.get(TextosService);
    expect(service).toBeTruthy();
  });
});
