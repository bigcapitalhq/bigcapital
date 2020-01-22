import { expect, create } from '~/testInit';
import Role from '@/models/Role';
import '@/models/Permission';
import '@/models/Resource';

describe('Model: Role', () => {
  it('Role model may has many associated users', async () => {
    const userHasRole = await create('user_has_role');
    await create('user_has_role', { role_id: userHasRole.roleId });

    const roleModel = await Role.query().findById(userHasRole.roleId);
    const roleUsers = await roleModel.$relatedQuery('users');

    expect(roleUsers).to.have.lengthOf(2);
  });

  it('Role model may has many associated permissions.', async () => {
    const roleHasPermissions = await create('role_has_permission');

    const roleModel = await Role.query().findById(roleHasPermissions.roleId);
    const rolePermissions = await roleModel.$relatedQuery('permissions');

    expect(rolePermissions).to.have.lengthOf(1);
  });

  it('Role model may has many associated resources that has some or all permissions.', async () => {
    const roleHasPermissions = await create('role_has_permission');

    const roleModel = await Role.query().findById(roleHasPermissions.roleId);
    const roleResources = await roleModel.$relatedQuery('resources');

    expect(roleResources).to.have.lengthOf(1);
  });
});
