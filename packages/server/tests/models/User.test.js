import 'models/Role';
import User from 'models/TenantUser';
import { tenantFactory } from '~/dbInit';
import { expect } from '~/testInit';

describe('Model: User', () => {
  describe('relations', () => {
    it('User model may has many associated roles.', async () => {
      const userHasRole = await tenantFactory.create('user_has_role');
      await tenantFactory.create('user_has_role', { user_id: userHasRole.user_id });

      const userModel = await User.tenant().query().where('id', userHasRole.userId).first();
      const userRoles = await userModel.$relatedQuery('roles');

      expect(userRoles).to.have.lengthOf(1);
    });
  });
});
