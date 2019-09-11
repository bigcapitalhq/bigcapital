import { expect, create } from '~/testInit';
import Role from '@/models/Role';
import '@/models/Permission';
import '@/models/Resource';

describe('Model: Role', () => {
  it('Role model may has many associated users', async () => {
    const userHasRole = await create('user_has_role');
    await create('user_has_role', { role_id: userHasRole.role_id });

    const roleModel = await Role.where('id', userHasRole.role_id).fetch();
    const roleUsers = await roleModel.users().fetch();

    expect(roleUsers).to.have.lengthOf(2);
  });

  it('Role model may has many associated permissions.', async () => {
    const roleHasPermissions = await create('role_has_permission');

    const roleModel = await Role.where('id', roleHasPermissions.role_id).fetch();
    const rolePermissions = await roleModel.permissions().fetch();

    expect(rolePermissions).to.have.lengthOf(1);
  });

  it('Role model may has many associated resources that has some or all permissions.', async () => {
    const roleHasPermissions = await create('role_has_permission');

    const roleModel = await Role.where('id', roleHasPermissions.role_id).fetch();
    const roleResources = await roleModel.resources().fetch();

    expect(roleResources).to.have.lengthOf(1);
  });
});
