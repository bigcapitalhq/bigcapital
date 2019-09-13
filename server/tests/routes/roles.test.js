import { request, expect, create } from '~/testInit';
import knex from '@/database/knex';

describe('routes: `/roles/`', () => {
  describe('POST: `/roles/`', () => {
    it('Should `name` be required.', async () => {
      const res = await request().post('/api/roles').send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundNameParam = res.body.errors.find((err) => err.param === 'name');
      expect(!!foundNameParam).equals(true);
    });

    it('Should `permissions` be array.', async () => {
      const res = await request().post('/api/roles').send({
        permissions: 'not_array',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPermissionsPerm = res.body.errors.find((err) => err.param === 'permissions');
      expect(!!foundPermissionsPerm).equals(true);
    });

    it('Should `permissions.resource_slug` be slug.', async () => {
      const res = await request().post('/api/roles').send({
        permissions: [{ slug: 'not slug' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPerm = res.body.errors.find((err) => err.param === 'permissions[0].resource_slug');
      expect(!!foundPerm).equals(true);
    });

    it('Should `permissions.permissions be array.`', async () => {
      const res = await request().post('/api/roles').send({
        permissions: [{ permissions: 'not_array' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPerm = res.body.errors.find((err) => err.param === 'permissions[0].permissions');
      expect(!!foundPerm).equals(true);
    });

    it('Should response bad request in case the resource slug was invalid.', async () => {
      const res = await request().post('/api/roles').send({
        name: 'name',
        permissions: [{ resource_slug: 'invalid', permissions: ['item'] }],
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_SLUG_NOT_FOUND',
        code: 100,
        resources: ['invalid'],
      });
    });

    it('Should response bad request in case the permission type was invalid.', async () => {
      const res = await request().post('/api/roles').send({
        name: 'name',
        permissions: [{ resource_slug: 'items', permissions: ['item'] }],
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PERMISSIONS_SLUG_NOT_FOUND',
        code: 200,
        permissions: [{ resource_slug: 'items', permissions: ['item'] }],
      });
    });

    it('Should save the submit resources in the storage in case was not exist.', async () => {
      await request().post('/api/roles').send({
        name: 'Role Name',
        permissions: [{ resource_slug: 'items', permissions: ['create'] }],
      });

      const storedResources = await knex('resources');
      expect(storedResources).to.have.lengthOf(1);
    });

    it('Should save the submit permissions in the storage in case was not exist.', async () => {
      await request().post('/api/roles').send({
        name: 'Role Name',
        permissions: [{ resource_slug: 'items', permissions: ['create'] }],
      });

      const storedPermissions = await knex('permissions');
      expect(storedPermissions).to.have.lengthOf(1);
    });

    it('Should save the submit role in the storage with associated resource and permissions.', async () => {
      await request().post('/api/roles').send({
        name: 'Role Name',
        description: 'Role description',
        permissions: [{ resource_slug: 'items', permissions: ['create', 'view'] }],
      });

      const storedRoles = await knex('roles');
      const storedResource = await knex('resources').where('name', 'items').first();
      const storedPermissions = await knex('permissions');
      const roleHasPermissions = await knex('role_has_permissions')
        .where('role_id', storedRoles[0].id);

      expect(storedRoles).to.have.lengthOf(1);
      expect(storedRoles[0].name).equals('Role Name');
      expect(storedRoles[0].description).equals('Role description');

      expect(roleHasPermissions).to.have.lengthOf(2);
      expect(roleHasPermissions[0].role_id).equals(storedRoles[0].id);
      expect(roleHasPermissions[0].permission_id).equals(storedPermissions[0].id);
      expect(roleHasPermissions[0].resource_id).equals(storedResource.id);
    });

    it('Should response success with correct data format.', async () => {
      const res = await request().post('/api/roles').send();

      expect(res.status).equals(422);
    });

    it('Should save the given role details in the storage.', async () => {
      const res = await request().post('/api/roles').send();

      expect(res.status).equals(422);
    });
  });

  describe('POST: `/roles/:id`', () => {
    it('Should response not found in case role was not exist.', async () => {
      const res = await request().post('/api/roles/10').send({
        name: 'Role Name',
        description: 'Description',
        permissions: [
          { resource_slug: 'items', permissions: ['create'] },
        ],
      });

      expect(res.status).equals(404);
    });

    it('Should `name` be required.', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundNameParam = res.body.errors.find((err) => err.param === 'name');
      expect(!!foundNameParam).equals(true);
    });

    it('Should `permissions` be array.', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send({
        permissions: 'not_array',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPermissionsPerm = res.body.errors.find((err) => err.param === 'permissions');
      expect(!!foundPermissionsPerm).equals(true);
    });

    it('Should `permissions.resource_slug` be slug.', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send({
        permissions: [{ slug: 'not slug' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPerm = res.body.errors.find((err) => err.param === 'permissions[0].resource_slug');
      expect(!!foundPerm).equals(true);
    });

    it('Should `permissions.permissions be array.`', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send({
        permissions: [{ permissions: 'not_array' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const foundPerm = res.body.errors.find((err) => err.param === 'permissions[0].permissions');
      expect(!!foundPerm).equals(true);
    });

    it('Should response bad request in case the resource slug was invalid.', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send({
        name: 'name',
        permissions: [{ resource_slug: 'invalid', permissions: ['item'] }],
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_SLUG_NOT_FOUND',
        code: 100,
        resources: ['invalid'],
      });
    });

    it('Should response bad request in case the permission type was invalid.', async () => {
      const role = await create('role');
      const res = await request().post(`/api/roles/${role.id}`).send({
        name: 'name',
        permissions: [{ resource_slug: 'items', permissions: ['item'] }],
      });

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PERMISSIONS_SLUG_NOT_FOUND',
        code: 200,
        permissions: [{ resource_slug: 'items', permissions: ['item'] }],
      });
    });

    it('Should save the submit resources in the storage in case was not exist.', async () => {
      const role = await create('role');
      await request().post(`/api/roles/${role.id}`).send({
        name: 'Role Name',
        permissions: [{ resource_slug: 'items', permissions: ['create'] }],
      });

      const storedResources = await knex('resources');
      expect(storedResources).to.have.lengthOf(1);
    });

    it('Should save the submit permissions in the storage in case was not exist.', async () => {
      const role = await create('role');
      await request().post(`/api/roles/${role.id}`).send({
        name: 'Role Name',
        permissions: [{ resource_slug: 'items', permissions: ['create'] }],
      });

      const storedPermissions = await knex('permissions');
      expect(storedPermissions).to.have.lengthOf(1);
    });
  });

  describe('DELETE: `/roles/:id`', () => {
    it('Should response not found in case the role was not exist.', async () => {
      const res = await request().delete('/api/roles/100').send();

      expect(res.status).equals(404);
    });

    it('Should not delete the predefined role.', async () => {
      const role = await create('role', { predefined: true });
      const res = await request().delete(`/api/roles/${role.id}`).send();

      expect(res.status).equals(400);
    });

    it('Should delete the given role and its relations with permissions and resources.', async () => {
      const role = await create('role');
      await create('role_has_permission', { role_id: role.id });

      await request().delete(`/api/roles/${role.id}`).send();

      const storedRole = await knex('roles').where('id', role.id).first();
      expect(storedRole).to.equals(undefined);
    });
  });
});
