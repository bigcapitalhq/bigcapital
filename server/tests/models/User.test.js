import { create, expect } from '~/testInit';
import User from '@/models/User';
import '@/models/Role';

describe('Model: User', () => {
  it('User model may has many associated roles.', async () => {
    const userHasRole = await create('user_has_role');
    await create('user_has_role', { user_id: userHasRole.user_id });

    const userModel = await User.where('id', userHasRole.user_id).fetch();
    const userRoles = await userModel.roles().fetch();

    expect(userRoles).to.have.lengthOf(2);
  });
});
