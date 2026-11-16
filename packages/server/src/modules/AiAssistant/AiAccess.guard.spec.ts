import { Ability } from '@casl/ability';
import { ForbiddenException } from '@nestjs/common';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';
import { AiAccessGuard } from './AiAccess.guard';

const contextFor = (ability?: Ability) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ ability }),
    }),
  }) as any;

describe('AiAccessGuard', () => {
  it('allows a user with a report read ability', () => {
    const ability = new Ability([
      {
        action: ReportsAction.READ_PROFIT_LOSS,
        subject: AbilitySubject.Report,
      },
    ]);
    const guard = new AiAccessGuard();

    expect(guard.canActivate(contextFor(ability))).toBe(true);
  });

  it('allows an admin with manage all', () => {
    const ability = new Ability([{ action: 'manage', subject: 'all' }]);
    const guard = new AiAccessGuard();

    expect(guard.canActivate(contextFor(ability))).toBe(true);
  });

  it('rejects a user without report access', () => {
    const ability = new Ability([
      { action: 'View', subject: AbilitySubject.Customer },
    ]);
    const guard = new AiAccessGuard();

    expect(() => guard.canActivate(contextFor(ability))).toThrow(
      ForbiddenException,
    );
  });

  it('rejects when no ability was attached', () => {
    const guard = new AiAccessGuard();

    expect(() => guard.canActivate(contextFor(undefined))).toThrow(
      ForbiddenException,
    );
  });
});
