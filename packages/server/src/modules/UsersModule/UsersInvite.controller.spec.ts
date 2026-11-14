import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AbilitySubject, UserAction } from '@/modules/Roles/Roles.types';
import { UsersInviteController } from './UsersInvite.controller';

describe('UsersInviteController authorization', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => UsersInviteController,
    }) as any;

  const cases: Array<[string, string]> = [
    ['sendInvite', UserAction.Create],
    ['resendInvite', UserAction.Create],
    ['sendBulkInvites', UserAction.Create],
  ];

  it.each(cases)(
    '%s is denied (403) for a role without the User permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(ctx(UsersInviteController.prototype[method], deny)),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(cases)(
    '%s is allowed for a role that grants the matching User permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.User },
      ] as any);
      expect(
        guard.canActivate(ctx(UsersInviteController.prototype[method], allow)),
      ).toBe(true);
    },
  );

  it('grants all invite operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);
    for (const [method] of cases) {
      expect(
        guard.canActivate(ctx(UsersInviteController.prototype[method], admin)),
      ).toBe(true);
    }
  });
});
