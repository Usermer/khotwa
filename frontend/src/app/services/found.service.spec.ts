import { TestBed } from '@angular/core/testing';

import { FoundService } from './found.service';

describe('FoundService', () => {
  let service: FoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
