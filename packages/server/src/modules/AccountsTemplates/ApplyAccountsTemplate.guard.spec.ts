import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { AccountAction } from '../Accounts/Accounts.types';
import { ApplyAccountsTemplateGuard } from './ApplyAccountsTemplate.guard';

const contextWith = (allowed: string[] | null) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        ability: allowed && {
          can: (action: string, subject: string) =>
            subject === AbilitySubject.Account && allowed.includes(action),
        },
      }),
    }),
  }) as unknown as ExecutionContext;

describe('ApplyAccountsTemplateGuard', () => {
  const guard = new ApplyAccountsTemplateGuard();
  const all = [AccountAction.CREATE, AccountAction.EDIT, AccountAction.DELETE];

  it('lets through a user who may create, edit and delete accounts', () => {
    expect(guard.canActivate(contextWith(all))).toBe(true);
  });

  it.each(all)('refuses a user who may not %s accounts', (action) => {
    const allowed = all.filter((candidate) => candidate !== action);

    expect(() => guard.canActivate(contextWith(allowed))).toThrow(
      ForbiddenException,
    );
  });

  it('refuses when the abilities were not resolved', () => {
    expect(() => guard.canActivate(contextWith(null))).toThrow(
      ForbiddenException,
    );
  });
});
