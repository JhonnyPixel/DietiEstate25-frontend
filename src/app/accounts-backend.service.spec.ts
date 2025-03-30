import { TestBed } from '@angular/core/testing';

import { AccountsBackendService } from './accounts-backend.service';

describe('AccountsBackendService', () => {
  let service: AccountsBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
