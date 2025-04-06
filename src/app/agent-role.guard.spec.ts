import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { agentRoleGuard } from './agent-role.guard';

describe('agentRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => agentRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
