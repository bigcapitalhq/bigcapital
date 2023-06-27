import {
  request,
  expect,
} from '~/testInit';
import View from 'models/View';
import ViewRole from 'models/ViewRole';
import 'models/ResourceField';
import ViewColumn from '../../src/models/ViewColumn';
import {
  tenantWebsite,
  tenantFactory,
  loginRes
} from '~/dbInit';


describe('routes: `/views`', () => {
  describe('GET: `/views`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request().get('/api/views');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should retrieve all views of the given resource name.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'resource_name' });
      const resourceFields = await tenantFactory.create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .query({ resource_name: 'resource_name' })
        .send();

      expect(res.status).equals(200);
      expect(res.body.views.length).equals(1);
    });
  });

  describe('GET `/views/:id`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'resource_name' });
      const resourceView = await tenantFactory.create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get(`/api/views/${resourceView.id}`)
        .query({ resource_name: 'resource_name' })
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should response not found in case the given view was not found.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'resource_name' });
      const resourceView = await tenantFactory.create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get('/api/views/123')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors[0]).deep.equals({
        type: 'VIEW_NOT_FOUND', code: 100,
      });
    });

    it('Should retrieve details of the given view with associated graphs.', async () => {
      const resource = await tenantFactory.create('resource', { name: 'resource_name' });
      const resourceView = await tenantFactory.create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '1 AND 2',
      });
      const resourceField = await tenantFactory.create('resource_field', {
        label_name: 'Expense Account',
        key: 'expense_account',
        data_type: 'integer',
        resource_id: resource.id,
        active: true,
        predefined: true,
        builtin: true,
      });
      const viewRole = await tenantFactory.create('view_role', {
        view_id: resourceView.id,
        index: 1,
        field_id: resourceField.id,
        value: '12',
        comparator: 'equals',
      });

      const res = await request()
        .get(`/api/views/${resourceView.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(200);
      expect(res.body.view.name).equals(resourceView.name);
      expect(res.body.view.resource_id).equals(resourceView.resourceId);
      expect(res.body.view.roles_logic_expression).equals(resourceView.rolesLogicExpression);

      expect(res.body.view.roles.length).equals(1);
      expect(res.body.view.roles[0].view_id).equals(viewRole.viewId);
    });
  });

  describe('POST: `/views`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request().post('/api/views');

      expect(res.status).equals(401);
      expect(res.body.message).equals('Unauthorized');
    });

    it('Should `name` be required.', async () => {
      await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should `resource_name` be required.', async () => {
      await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'resource_name', location: 'body',
      });
    });

    it('Should `columns` be minimum limited', async () => {
      await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views', {
          label: 'View Label',
          columns: [],
        })
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body',
      });
    });

    it('Should `columns` be array.', async () => {
      await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views', {
          label: 'View Label',
          columns: 'not_array',
        })
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body',
      });
    });

    it('Should `roles.*.field_key` be required.', async () => {
      const resource = await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          label: 'View Label',
          roles: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'roles[0].field_key', location: 'body',
      });
    });

    it('Should `roles.*.comparator` be valid.', async () => {
      const resource = await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          label: 'View Label',
          roles: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].comparator');
    });

    it('Should `roles.*.index` be number as integer.', async () => {
      const resource = await tenantFactory.create('resource');
      const res = await request()
        .post('/api/views')
        .send({
          resource_name: resource.name,
          label: 'View Label',
          roles: [
            { index: 'not_numeric' },
          ],
        })
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        value: 'not_numeric',
        msg: 'Invalid value',
        param: 'roles[0].index',
        location: 'body',
      });
    });

    it('Should response not found in case resource was not exist.', async () => {
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: 'not_found',
          name: 'View Label',
          columns: [
            { key: 'amount', index: 1 },
            { key: 'thumbnail', index: 1 },
            { key: 'status', index: 1 },
          ],
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
          logic_expression: '1',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_NOT_FOUND', code: 100,
      });
    });

    it('Should response invalid logic expression.', async () =>{
      const resource = await tenantFactory.create('resource');
      await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          logic_expression: '100 && 100',
          name: 'View Label',
          columns: [
            { key: 'amount', index: 1 },
          ],
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'VIEW.ROLES.LOGIC.EXPRESSION.INVALID', code: 400,
      });
    });

    it('Should response the roles fields not exist in case role field was not exist.', async () => {
      const resource = await tenantFactory.create('resource');
      await tenantFactory.create('resource_field', { resource_id: resource.id, label_name: 'Amount' });

      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          name: 'View Label',
          logic_expression: '1',
          columns: [
            { key: 'amount', index: 1 },
            { key: 'thumbnail', index: 1 },
            { key: 'status', index: 1 },
          ],
          roles: [{
            index: 1,
            field_key: 'price',
            comparator: 'equals',
            value: '100',
          }],
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: ['price'],
      });
    });

    it('Should response the columns that not exists in case column was not exist.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          name: 'View Label',
          logic_expression: '1',
          columns: [
            { key: 'amount', index: 1 },
            { key: 'thumbnail', index: 2 },
            { key: 'status', index: 3 },
          ],
          roles: [{
            index: 1,
            field_key: 'price',
            comparator: 'equals',
            value: '100',
          }],
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'COLUMNS_NOT_EXIST', code: 200, columns: ['thumbnail', 'status'],
      });
    });

    it('Should save the given details of the view.', async () => {
      const resource = await tenantFactory.create('resource');
      await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          name: 'View Label',
          logic_expression: '1',
          columns: [
            { key: 'amount', index: 1 },
          ],
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
        });

      const storedView = await View.tenant().query().where('name', 'View Label').first();

      expect(storedView.name).equals('View Label');
      expect(storedView.predefined).equals(0);
      expect(storedView.resourceId).equals(resource.id);
    });

    it('Should save the given details of view fields that associated to the given view id.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          name: 'View Label',
          columns: [{ key: 'amount', index: 1 }],
          logic_expression: '1',
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
        });

      const viewRoles = await ViewRole.tenant().query().where('view_id', res.body.id);

      expect(viewRoles.length).equals(1);
      expect(viewRoles[0].index).equals(1);
      expect(viewRoles[0].fieldId).equals(resourceField.id);
      expect(viewRoles[0].value).equals('100');
      expect(viewRoles[0].comparator).equals('equals');
    });

    it('Should save columns that associated to the given view.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          resource_name: resource.name,
          name: 'View Label',
          logic_expression: '1',
          columns: [
            { key: 'amount', index: 1 },
          ],
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
        });

      const viewColumns = await ViewColumn.tenant().query().where('view_id', res.body.id);
      expect(viewColumns.length).equals(1);
    });

   
  });

  describe('POST: `/views/:view_id`', () => {
    it('Should `name` be required.', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'name', location: 'body',
      });
    });

    it('Should columns be minimum limited', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`, {
          label: 'View Label',
          columns: [],
        })
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body',
      });
    });

    it('Should columns be array.', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`, {
          label: 'View Label',
          columns: 'not_array',
        })
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          columns: 'columns'
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body', value: 'columns',
      });
    });

    it('Should `roles.*.field_key` be required.', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          label: 'View Label',
          roles: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'roles[0].field_key', location: 'body',
      });
    });

    it('Should `roles.*.comparator` be required.', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          label: 'View Label',
          roles: [{}],
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'roles[0].comparator', location: 'body',
      });
    });

    it('Should `roles.*.index` be number as integer.', async () => {
      const view = await tenantFactory.create('view');
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          label: 'View Label',
          roles: [{ index: 'not_numeric' }],
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value',
        param: 'roles[0].index',
        location: 'body',
        value: 'not_numeric',
      });
    });

    it('Should response the roles fields not exist in case role field was not exist.', async () => {
      const view = await tenantFactory.create('view');
      await tenantFactory.create('resource_field', {
        resource_id: view.resource_id,
        label_name: 'Amount',
      });
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: 'amount',
            index: 1,
          }, {
            key: 'thumbnail',
            index: 2,
          }, {
            key: 'status',
            index: 3,
          }],
          roles: [{
            index: 1,
            field_key: 'price',
            comparator: 'equals',
            value: '100',
          }],
        });
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: ['price'],
      });
    });

    it('Should response the resource columns not exists in case the column keys was not exist.', async () => {
      const view = await tenantFactory.create('view');
      await tenantFactory.create('resource_field', {
        resource_id: view.resource_id,
        label_name: 'Amount',
      });
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: 'amount',
            index: 1,
          }, {
            key: 'thumbnail',
            index: 2,
          }, {
            key: 'status',
            index: 3,
          }],
          roles: [{
            index: 1,
            field_key: 'price',
            comparator: 'equals',
            value: '100',
          }],
        });
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_COLUMNS_NOT_EXIST',
        code: 200,
        columns: ['amount', 'thumbnail', 'status'],
      });
    });

    it('Should validate the logic expressions with the given conditions.', () => {

    });

    it('Should delete the view roles that not presented the post data.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const view = await tenantFactory.create('view', { resource_id: resource.id });
      const viewRole = await tenantFactory.create('view_role', {
        view_id: view.id,
        field_id: resourceField.id,
      });
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: resourceField.key,
            index: 1,
          }],
          roles: [{
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });

      const foundViewRole = await ViewRole.tenant().query().where('id', viewRole.id);
      expect(foundViewRole.length).equals(0);
    });

    it('Should update the view roles that presented in the given data.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const view = await tenantFactory.create('view', { resource_id: resource.id });
      const viewRole = await tenantFactory.create('view_role', {
        view_id: view.id,
        field_id: resourceField.id,
      });
      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: resourceField.key,
            index: 1,
          }],
          roles: [{
            id: viewRole.id,
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });

      const foundViewRole = await ViewRole.tenant().query().where('id', viewRole.id);

      expect(foundViewRole.length).equals(1);
      expect(foundViewRole[0].id).equals(viewRole.id);
      expect(foundViewRole[0].index).equals(1);
      expect(foundViewRole[0].value).equals('100');
      expect(foundViewRole[0].comparator).equals('equals');
    });

    it('Should response not found roles ids in case not exists in the storage.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const view = await tenantFactory.create('view', { resource_id: resource.id });

      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: resourceField.key,
            index: 1,
          }],
          roles: [{
            id: 1,
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'VIEW.ROLES.IDS.NOT.FOUND', code: 500, ids: [1],
      });
    });

    it('Should delete columns from storage in case view columns ids not presented.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const view = await tenantFactory.create('view', { resource_id: resource.id });
      const viewColumn = await tenantFactory.create('view_column', { view_id: view.id });

      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: resourceField.key,
            index: 1,
          }],
          roles: [{
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });
      const foundViewColumns = await ViewColumn.tenant().query().where('id', viewColumn.id);
      expect(foundViewColumns.length).equals(0);
    });

    it('Should insert columns to the storage if where new columns', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const view = await tenantFactory.create('view', { resource_id: resource.id });

      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{
            key: resourceField.key,
            index: 1,
          }],
          roles: [{
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });

      const foundViewColumns = await ViewColumn.tenant().query().where('view_id', view.id);

      expect(foundViewColumns.length).equals(1);
      expect(foundViewColumns[0].viewId).equals(view.id);
      expect(foundViewColumns[0].index).equals(1);
      expect(foundViewColumns[0].fieldId).equals(resourceField.id);
    });


    it('Should update columns on the storage.', async () => {
      const resource = await tenantFactory.create('resource');
      const resourceField = await tenantFactory.create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const view = await tenantFactory.create('view', { resource_id: resource.id });
      const viewColumn = await tenantFactory.create('view_column', { view_id: view.id });

      const res = await request()
        .post(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send({
          name: 'View Label',
          logic_expression: '1',
          columns: [{ 
            id: viewColumn.id,
            key: resourceField.key,
            index: 10,
          }],
          roles: [{
            index: 1,
            field_key: resourceField.key,
            comparator: 'equals',
            value: '100',
          }],
        });

      console.log(res.body)

      const foundViewColumns = await ViewColumn.tenant().query().where('id', viewColumn.id);

      expect(foundViewColumns.length).equals(1);
      expect(foundViewColumns[0].id).equals(viewColumn.id);
      expect(foundViewColumns[0].viewId).equals(view.id);
      expect(foundViewColumns[0].index).equals(10);
      // expect(foundViewColumns[0].fieldId).equals();
    })
  });

  describe('DELETE: `/views/:resource_id`', () => {
    it('Should not delete predefined view.', async () => {
      const view = await tenantFactory.create('view', { predefined: true });
      const res = await request()
        .delete(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PREDEFINED_VIEW', code: 200,
      });
    });

    it('Should response not found in case view was not exist.', async () => {
      const res = await request()
        .delete('/api/views/100')
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'VIEW_NOT_FOUND', code: 100,
      });
    });

    it('Should delete the given view and associated view columns and roles.', async () => {
      const view = await tenantFactory.create('view', { predefined: false });
      await tenantFactory.create('view_role', { view_id: view.id });
      await tenantFactory.create('view_column', { view_id: view.id });

      const res = await request()
        .delete(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .set('organization-id', tenantWebsite.organizationId)
        .send();

      expect(res.body.id).equals(view.id);

      const foundViews = await View.tenant().query().where('id', view.id);
      const foundViewRoles = await ViewRole.tenant().query().where('view_id', view.id);

      expect(foundViews).to.have.lengthOf(0);
      expect(foundViewRoles).to.have.lengthOf(0);
    });
  });
});
