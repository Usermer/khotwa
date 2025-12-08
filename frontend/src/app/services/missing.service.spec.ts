import { TestBed } from '@angular/core/testing';

import { MissingService } from './missing.service';

describe('MissingService', () => {
  let service: MissingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
