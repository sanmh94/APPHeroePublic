import { TestBed } from '@angular/core/testing';

import { HeroesCacheService } from './heroes-cache.service';

describe('HeroesCacheService', () => {
  let service: HeroesCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
