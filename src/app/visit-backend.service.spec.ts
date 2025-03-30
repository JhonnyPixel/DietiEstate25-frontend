import { TestBed } from '@angular/core/testing';

import { VisitBackendService } from './visit-backend.service';

describe('VisitBackendService', () => {
  let service: VisitBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
