import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Ability } from '@casl/ability';
import { PermissionGuard } from '../Roles/Permission.guard';
import { AbilitySubject, UserAction } from '../Roles/Roles.types';
import { UsersController } from './Users.controller';
import { UsersInviteController } from './UsersInvite.controller';

describe('Users authorization guards', () => {
  const reflector = new Reflector();
  const guard = new PermissionGuard(reflector);

  const ctx = (controller: any, handler: any, ability: Ability) =>
    ({
      switchToHttp: () => ({ getRequest: () => ({ ability }) }),
      getHandler: () => handler,
      getClass: () => controller,
    }) as any;

  const usersCases: Array<[string, string]> = [
    ['editUser', UserAction.Edit],
    ['deleteUser', UserAction.Delete],
    ['getUser', UserAction.View],
    ['listUsers', UserAction.View],
    ['activateUser', UserAction.Activate],
    ['inactivateUser', UserAction.Activate],
  ];

  const invitesCases: Array<[string, string]> = [
    ['sendInvite', UserAction.Invite],
    ['resendInvite', UserAction.Invite],
    ['sendBulkInvites', UserAction.Invite],
  ];

  it.each(usersCases)(
    'UsersController.%s is denied (403) for a role without the User permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(
          ctx(UsersController, UsersController.prototype[method], deny),
        ),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(usersCases)(
    'UsersController.%s is allowed for a role that grants the matching User permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.User },
      ] as any);
      expect(
        guard.canActivate(
          ctx(UsersController, UsersController.prototype[method], allow),
        ),
      ).toBe(true);
    },
  );

  it.each(invitesCases)(
    'UsersInviteController.%s is denied (403) for a role without the User permission',
    (method) => {
      const deny = new Ability([]);
      expect(() =>
        guard.canActivate(
          ctx(
            UsersInviteController,
            UsersInviteController.prototype[method],
            deny,
          ),
        ),
      ).toThrow(ForbiddenException);
    },
  );

  it.each(invitesCases)(
    'UsersInviteController.%s is allowed for a role that grants the Invite permission',
    (method, action) => {
      const allow = new Ability([
        { action, subject: AbilitySubject.User },
      ] as any);
      expect(
        guard.canActivate(
          ctx(
            UsersInviteController,
            UsersInviteController.prototype[method],
            allow,
          ),
        ),
      ).toBe(true);
    },
  );

  it('denies the Edit permission holder from listing or deleting users', () => {
    const editOnly = new Ability([
      { action: UserAction.Edit, subject: AbilitySubject.User },
    ] as any);

    expect(() =>
      guard.canActivate(
        ctx(UsersController, UsersController.prototype.listUsers, editOnly),
      ),
    ).toThrow(ForbiddenException);

    expect(() =>
      guard.canActivate(
        ctx(UsersController, UsersController.prototype.deleteUser, editOnly),
      ),
    ).toThrow(ForbiddenException);
  });

  it('grants all Users operations to a manage-all (admin) ability', () => {
    const admin = new Ability([{ action: 'manage', subject: 'all' }] as any);

    for (const [method] of usersCases) {
      expect(
        guard.canActivate(
          ctx(UsersController, UsersController.prototype[method], admin),
        ),
      ).toBe(true);
    }
    for (const [method] of invitesCases) {
      expect(
        guard.canActivate(
          ctx(
            UsersInviteController,
            UsersInviteController.prototype[method],
            admin,
          ),
        ),
      ).toBe(true);
    }
  });
});
