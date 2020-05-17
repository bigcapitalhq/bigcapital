import { create } from '~/testInit';
import Resource from '@/models/Resource';
import '@/models/Role';

describe('Model: Permission', () => {
  it('Permission model may has associated role.', async () => {
    const roleHasPermissions = await create('role_has_permission');
    const resourceModel = await Resource.where('id', roleHasPermissions.resource_id).fetch();
    const roleModel = await resourceModel.role().fetch();

    console.log(roleModel);
  });

  it('Permission model may has associated resource.', async () => {
    const roleHasPermissions = await create('role_has_permission');
    const resourceModel = await Resource.where('id', roleHasPermissions.resource_id).fetch();
    const permissionModel = await resourceModel.permission().fetch();

    console.log(permissionModel);
  });
});
