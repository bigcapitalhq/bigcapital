import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { BalanceSheetStatementController } from './BalanceSheet.controller';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

describe('BalanceSheetStatementController authorization', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => BalanceSheetStatementController,
    }) as any;

  const cases: Array<[string, string]> = [
    ['balanceSheet', ReportsAction.READ_BALANCE_SHEET],
  ];

  it.each(cases)(
    '%s is denied (403) for a role without the Report permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(
          ctx(BalanceSheetStatementController.prototype[method], deny),
        ),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(cases)(
    '%s is allowed for a role that grants the matching Report permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.Report },
      ] as any);
      expect(
        guard.canActivate(
          ctx(BalanceSheetStatementController.prototype[method], allow),
        ),
      ).toBe(true);
    },
  );

  it('grants all report operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);
    for (const [method] of cases) {
      expect(
        guard.canActivate(
          ctx(BalanceSheetStatementController.prototype[method], admin),
        ),
      ).toBe(true);
    }
  });
});
