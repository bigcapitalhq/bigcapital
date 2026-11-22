import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AbilitySubject, UserAction } from '@/modules/Roles/Roles.types';
import { UsersController } from './Users.controller';

describe('UsersController authorization', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => UsersController,
    }) as any;

  const cases: Array<[string, string]> = [
    ['editUser', UserAction.Edit],
    ['deleteUser', UserAction.Delete],
    ['activateUser', UserAction.Edit],
    ['inactivateUser', UserAction.Edit],
    ['getUser', UserAction.View],
    ['listUsers', UserAction.View],
  ];

  it.each(cases)(
    '%s is denied (403) for a role without the User permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(ctx(UsersController.prototype[method], deny)),
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
        guard.canActivate(ctx(UsersController.prototype[method], allow)),
      ).toBe(true);
    },
  );

  it('grants all User operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);
    for (const [method] of cases) {
      expect(
        guard.canActivate(ctx(UsersController.prototype[method], admin)),
      ).toBe(true);
    }
  });
});
