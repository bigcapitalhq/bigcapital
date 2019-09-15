import { create, expect } from '~/testInit';
import User from '@/models/User';
import '@/models/Role';

describe('Model: User', () => {
  describe('relations', () => {
    it('User model may has many associated roles.', async () => {
      const userHasRole = await create('user_has_role');
      await create('user_has_role', { user_id: userHasRole.user_id });

      const userModel = await User.where('id', userHasRole.user_id).fetch();
      const userRoles = await userModel.roles().fetch();

      expect(userRoles).to.have.lengthOf(2);
    });
  });

  describe('hasPermissions', () => {
    it('Should return true in case user has the given permissions.', async () => {
      const resource = await create('resource');
      const permission = await create('permission');
      const roleHasPerms = await create('role_has_permission', {
        resource_id: resource.id,
        permission_id: permission.id,
      });
      const userHasRole = await create('user_has_role', { role_id: roleHasPerms.role_id });
      await create('user_has_role', { user_id: userHasRole.user_id });

      const userModel = await User.where('id', userHasRole.user_id).fetch();
      const hasPermission = await userModel.hasPermissions(resource.name, [permission.name]);

      expect(hasPermission).to.equals(true);
    });

    it('Should return false in case user has no the given permissions.', async () => {
      const roleHasPerms = await create('role_has_permission');
      const userHasRole = await create('user_has_role', { role_id: roleHasPerms.role_id });
      await create('user_has_role', { user_id: userHasRole.user_id });

      const userModel = await User.where('id', userHasRole.user_id).fetch();
      const hasPermission = await userModel.hasPermissions('resource', ['permission']);

      expect(hasPermission).to.equals(false);
    });
  });
});
