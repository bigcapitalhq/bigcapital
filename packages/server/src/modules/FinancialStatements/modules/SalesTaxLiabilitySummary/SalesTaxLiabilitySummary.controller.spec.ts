import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { SalesTaxLiabilitySummaryController } from './SalesTaxLiabilitySummary.controller';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

describe('SalesTaxLiabilitySummaryController authorization', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => SalesTaxLiabilitySummaryController,
    }) as any;

  const cases: Array<[string, string]> = [
    [
      'getSalesTaxLiabilitySummary',
      ReportsAction.READ_SALES_TAX_LIABILITY_SUMMARY,
    ],
  ];

  it.each(cases)(
    '%s is denied (403) for a role without the Report permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(
          ctx(SalesTaxLiabilitySummaryController.prototype[method], deny),
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
          ctx(SalesTaxLiabilitySummaryController.prototype[method], allow),
        ),
      ).toBe(true);
    },
  );

  it('grants all report operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);
    for (const [method] of cases) {
      expect(
        guard.canActivate(
          ctx(SalesTaxLiabilitySummaryController.prototype[method], admin),
        ),
      ).toBe(true);
    }
  });
});
