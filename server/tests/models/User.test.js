import { create, expect } from '~/testInit';
import User from 'models/TenantUser';
import 'models/Role';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


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
