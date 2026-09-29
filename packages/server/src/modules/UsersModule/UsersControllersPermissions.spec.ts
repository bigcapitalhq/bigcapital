import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { REQUIRED_PERMISSION_KEY } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { PreferencesAction } from '@/modules/Settings/Settings.types';
import { IS_PUBLIC_ROUTE } from '@/modules/Auth/Auth.constants';
import { UsersController } from './Users.controller';
import { UsersInviteController } from './UsersInvite.controller';
import { UsersInvitePublicController } from './UsersInvitePublic.controller';

const guardsOf = (target: any) =>
  (Reflect.getMetadata('__guards__', target) ?? []).map((g: any) => g.name);

const permissionOf = (target: any, method: string) =>
  Reflect.getMetadata(REQUIRED_PERMISSION_KEY, target.prototype[method]);

describe('Users controllers permissions', () => {
  describe.each([
    ['UsersController', UsersController],
    ['UsersInviteController', UsersInviteController],
  ])('%s', (_name, controller) => {
    it('applies the authorization and permission guards', () => {
      expect(guardsOf(controller)).toEqual(
        expect.arrayContaining([AuthorizationGuard.name, PermissionGuard.name]),
      );
    });
  });

  it.each([['editUser'], ['deleteUser'], ['activateUser'], ['inactivateUser']])(
    'requires the preferences permission to %s',
    (method) => {
      expect(permissionOf(UsersController, method)).toEqual({
        ability: PreferencesAction.Mutate,
        subject: AbilitySubject.Preferences,
      });
    },
  );

  it.each([['sendInvite'], ['resendInvite'], ['sendBulkInvites']])(
    'requires the preferences permission to %s',
    (method) => {
      expect(permissionOf(UsersInviteController, method)).toEqual({
        ability: PreferencesAction.Mutate,
        subject: AbilitySubject.Preferences,
      });
    },
  );

  it('leaves accepting an invitation public', () => {
    // The invited user has no session and no membership yet, so guarding this
    // controller would make every invitation impossible to accept.
    expect(
      Reflect.getMetadata(IS_PUBLIC_ROUTE, UsersInvitePublicController),
    ).toBe(true);
    expect(guardsOf(UsersInvitePublicController)).not.toContain(
      PermissionGuard.name,
    );
  });
});
