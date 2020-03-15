import {
  request,
  expect,
  login,
  create,
} from '~/testInit';
import View from '@/models/View';
import ViewRole from '@/models/ViewRole';
import '@/models/ResourceField';
import ViewColumn from '../../src/models/ViewColumn';

let loginRes;

describe.only('routes: `/views`', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });

  describe('GET: `/views`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request().get('/api/views');

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should retrieve all views of the given resource name.', async () => {
      const resource = await create('resource', { name: 'resource_name' });
      const resourceFields = await create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get('/api/views')
        .set('x-access-token', loginRes.body.token)
        .query({ resource_name: 'resource_name' })
        .send();

      // console.log(res.body);

      expect(res.status).equals(200);
      expect(res.body.views.length).equals(1);
    });
  });

  describe('GET `/views/:id`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const resource = await create('resource', { name: 'resource_name' });
      const resourceView = await create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get(`/api/views/${resourceView.id}`)
        .query({ resource_name: 'resource_name' })
        .send();

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should response not found in case the given view was not found.', async () => {
      const resource = await create('resource', { name: 'resource_name' });
      const resourceView = await create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '',
      });

      const res = await request()
        .get('/api/views/123')
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors[0]).deep.equals({
        type: 'VIEW_NOT_FOUND', code: 100,
      });
    });

    it('Should retrieve details of the given view with associated graphs.', async () => {
      const resource = await create('resource', { name: 'resource_name' });
      const resourceView = await create('view', {
        name: 'Resource View',
        resource_id: resource.id,
        roles_logic_expression: '1 AND 2',
      });
      const resourceField = await create('resource_field', {
        label_name: 'Expense Account',
        key: 'expense_account',
        data_type: 'integer',
        resource_id: resource.id,
        active: true,
        predefined: true,
        builtin: true,
      });
      const viewRole = await create('view_role', {
        view_id: resourceView.id,
        index: 1,
        field_id: resourceField.id,
        value: '12',
        comparator: 'equals',
      });

      const res = await request()
        .get(`/api/views/${resourceView.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(200);
      expect(res.body.view.name).equals(resourceView.name);
      expect(res.body.view.resourceId).equals(resourceView.resourceId);
      expect(res.body.view.rolesLogicExpression).equals(resourceView.rolesLogicExpression);

      expect(res.body.view.viewRoles.length).equals(1);
      expect(res.body.view.viewRoles[0].viewId).equals(viewRole.viewId);
    });
  });

  describe('POST: `/views`', () => {
    it('Should response unauthorzied in case the user was not authorized.', async () => {
      const res = await request().post('/api/views');

      expect(res.status).equals(401);
      expect(res.body.message).equals('unauthorized');
    });

    it('Should `label` be required.', async () => {
      await create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'label', location: 'body',
      });
    });

    it('Should `resource_name` be required.', async () => {
      await create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'resource_name', location: 'body',
      });
    });

    it('Should `columns` be minimum limited', async () => {
      await create('resource');
      const res = await request()
        .post('/api/views', {
          label: 'View Label',
          columns: [],
        })
        .set('x-access-token', loginRes.body.token);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body',
      });
    });

    it('Should `columns` be array.', async () => {
      await create('resource');
      const res = await request()
        .post('/api/views', {
          label: 'View Label',
          columns: 'not_array',
        })
        .set('x-access-token', loginRes.body.token);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'columns', location: 'body',
      });
    });

    it('Should `roles.*.field_key` be required.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
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
      const resource = await create('resource');
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
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
      const resource = await create('resource');
      const res = await request()
        .post('/api/views')
        .send({
          resource_name: resource.name,
          label: 'View Label',
          roles: [
            { index: 'not_numeric' },
          ],
        })
        .set('x-access-token', loginRes.body.token);

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
        .send({
          resource_name: 'not_found',
          label: 'View Label',
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
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_NOT_FOUND', code: 100,
      });
    });

    it('Should response invalid logic expression.', async () =>{
      const resource = await create('resource');
      await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .send({
          resource_name: resource.name,
          logic_expression: '100 && 100',
          label: 'View Label',
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
    })

    it('Should response the roles fields not exist in case role field was not exist.', async () => {
      const resource = await create('resource');
      await create('resource_field', { resource_id: resource.id, label_name: 'Amount' });

      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .send({
          resource_name: resource.name,
          label: 'View Label',
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
      const resource = await create('resource');
      const resourceField = await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .send({
          resource_name: resource.name,
          label: 'View Label',
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
      const resource = await create('resource');
      await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });
      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .send({
          resource_name: resource.name,
          label: 'View Label',
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

      const storedView = await View.query().where('name', 'View Label').first();

      expect(storedView.name).equals('View Label');
      expect(storedView.predefined).equals(0);
      expect(storedView.resourceId).equals(resource.id);
    });

    it('Should save the given details of view fields that associated to the given view id.', async () => {
      const resource = await create('resource');
      const resourceField = await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const res = await request()
        .post('/api/views')
        .send({
          resource_name: resource.name,
          label: 'View Label',
          columns: [{ key: 'amount', index: 1 }],
          roles: [{
            index: 1,
            field_key: 'amount',
            comparator: 'equals',
            value: '100',
          }],
        })
        .set('x-access-token', loginRes.body.token);
        
      const viewRoles = await ViewRole.query().where('view_id', res.body.id);

      expect(viewRoles.length).equals(1);
      expect(viewRoles[0].index).equals(1);
      expect(viewRoles[0].fieldId).equals(resourceField.id);
      expect(viewRoles[0].value).equals('100');
      expect(viewRoles[0].comparator).equals('equals');
    });

    it('Should save columns that associated to the given view.', async () => {
      const resource = await create('resource');
      const resourceField = await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
        key: 'amount',
      });

      const res = await request()
        .post('/api/views')
        .set('x-access-token', loginRes.body.token)
        .send({
          resource_name: resource.name,
          label: 'View Label',
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

      const viewColumns = await ViewColumn.query().where('view_id', res.body.id);
      expect(viewColumns.length).equals(1);
    });
  });

  describe('POST: `/views/:view_id`', () => {
    it('Should `label` be required.', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('label');
    });

    it('Should columns be minimum limited', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`, {
        label: 'View Label',
        columns: [],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('columns');
    });

    it('Should columns be array.', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`, {
        label: 'View Label',
        columns: 'not_array',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('columns');
    });

    it('Should `roles.*.field` be required.', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`).send({
        label: 'View Label',
        roles: [{}],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].field');
    });

    it('Should `roles.*.comparator` be valid.', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`).send({
        label: 'View Label',
        roles: [{}],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].comparator');
    });

    it('Should `roles.*.index` be number as integer.', async () => {
      const view = await create('view');
      const res = await request().post(`/api/views/${view.id}`).send({
        label: 'View Label',
        roles: [{ index: 'not_numeric' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].index');
    });

    it('Should response not found in case resource was not exist.', async () => {
      const res = await request().post('/api/views/100').send({
        label: 'View Label',
        columns: ['amount', 'thumbnail', 'status'],
        roles: [{
          index: 1,
          field: 'amount',
          comparator: 'equals',
          value: '100',
        }],
      });

      expect(res.status).equals(404);
    });

    it('Should response the roles fields not exist in case role field was not exist.', async () => {
      const view = await create('view');
      await create('resource_field', {
        resource_id: view.resource_id,
        label_name: 'Amount',
      });
      const res = await request().post(`/api/views/${view.id}`).send({
        label: 'View Label',
        columns: ['amount', 'thumbnail', 'status'],
        roles: [{
          index: 1,
          field: 'price',
          comparator: 'equals',
          value: '100',
        }],
      });

      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_FIELDS_NOT_EXIST', code: 100, fields: ['price'],
      });
    });
  });

  describe('DELETE: `/views/:resource_id`', () => {
    it('Should not delete predefined view.', async () => {
      const view = await create('view', { predefined: true });
      const res = await request()
        .delete(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
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
        .send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'VIEW_NOT_FOUND', code: 100,
      });
    });

    it('Should delete the given view and associated view columns and roles.', async () => {
      const view = await create('view', { predefined: false });
      await create('view_role', { view_id: view.id });
      await create('view_column', { view_id: view.id });

      const res = await request()
        .delete(`/api/views/${view.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.body.id).equals(view.id);

      const foundViews = await View.query().where('id', view.id);
      const foundViewRoles = await ViewRole.query().where('view_id', view.id);

      expect(foundViews).to.have.lengthOf(0);
      expect(foundViewRoles).to.have.lengthOf(0);
    });
  });
});
