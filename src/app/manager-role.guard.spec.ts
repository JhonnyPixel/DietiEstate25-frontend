import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { managerRoleGuard } from './manager-role.guard';

describe('managerRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => managerRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
