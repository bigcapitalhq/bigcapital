import { request, expect, create } from '~/testInit';
import View from '@/models/View';
import ViewRole from '@/models/ViewRole';
import '@/models/ResourceField';

describe('routes: `/views`', () => {
  describe('POST: `/views/:resource_id`', () => {
    it('Should `label` be required.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/views/resource/${resource.id}`);

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('label');
    });

    it('Should columns be minimum limited', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/views/resource/${resource.id}`, {
        label: 'View Label',
        columns: [],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('columns');
    });

    it('Should columns be array.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/views/resource/${resource.id}`, {
        label: 'View Label',
        columns: 'not_array',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('columns');
    });

    it('Should `roles.*.field` be required.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/views/resource/${resource.id}`).send({
        label: 'View Label',
        roles: [{}],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].field');
    });

    it('Should `roles.*.comparator` be valid.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/views/resource/${resource.id}`).send({
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
      const res = await request().post(`/api/views/resource/${resource.id}`).send({
        label: 'View Label',
        roles: [{ index: 'not_numeric' }],
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');

      const paramsErrors = res.body.errors.map((error) => error.param);
      expect(paramsErrors).to.include('roles[0].index');
    });

    it('Should response not found in case resource was not exist.', async () => {
      const res = await request().post('/api/views/resource/100').send({
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
      const resource = await create('resource');
      await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
      });
      const res = await request().post(`/api/views/resource/${resource.id}`).send({
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
        type: 'RESOURCE_FIELDS_NOT_EXIST',
        code: 100,
        fields: ['price'],
      });
    });

    it('Should response the columns not exists in case column was not exist.', async () => {
      const resource = await create('resource');
      await create('resource_field', {
        resource_id: resource.id,
        label_name: 'Amount',
      });
      const res = await request().post(`/api/views/resource/${resource.id}`).send({
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
        type: 'COLUMNS_NOT_EXIST',
        code: 200,
        fields: ['thumbnail', 'status'],
      });
    });

    it('Should save the given details with associated roles and columns.', async () => {

    });
  });

  describe.only('POST: `/views/:view_id`', () => {
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

    it.only('Should response the roles fields not exist in case role field was not exist.', async () => {
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
        type: 'RESOURCE_FIELDS_NOT_EXIST',
        code: 100,
        fields: ['price'],
      });
    });
  });

  describe('DELETE: `/views/:resource_id`', () => {
    it('Should not delete predefined view.', async () => {
      const view = await create('view', { predefined: true });
      const res = await request().delete(`/api/views/${view.id}`).send();

      expect(res.status).equals(400);
    });

    it('Should response not found in case view was not exist.', async () => {
      const res = await request().delete('/api/views/100').send();

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'VIEW_NOT_FOUND', code: 100,
      });
    });

    it('Should delete the given view and associated view columns and roles.', async () => {
      const view = await create('view', { predefined: false });
      await create('view_role', { view_id: view.id });
      await create('view_has_columns', { view_id: view.id });

      await request().delete(`/api/views/${view.id}`).send();

      const foundViews = await View.where('id', view.id).fetchAll();
      const foundViewRoles = await ViewRole.where('view_id', view.id).fetchAll();

      expect(foundViews).to.have.lengthOf(0);
      expect(foundViewRoles).to.have.lengthOf(0);
    });
  });
});
