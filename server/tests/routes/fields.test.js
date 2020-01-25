import {
  create,
  expect,
  request,
  login,
} from '~/testInit';
import knex from '@/database/knex';
import ResourceField from '@/models/ResourceField';
import e from 'express';
import Fields from '../../src/http/controllers/Fields';

let loginRes;

describe('route: `/fields`', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });
  describe('POST: `/fields/:resource_id`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const res = await request()
        .post('/api/fields/resource/items')
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should response bad request in case resource name was not exist.', async () => {
      const res = await request()
        .post('/api/fields/resource/not_found_resource')
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Extra Field',
          data_type: 'text',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.deep.equals({
        type: 'RESOURCE_NOT_FOUND', code: 100,
      });
    });

    it('Should `label` be required.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post(`/api/fields/resource/${resource.resource_name}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'label', location: 'body',
      });
    });

    it('Should `data_type` be required.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post(`/api/fields/resource/${resource.resource_id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'data_type', location: 'body',
      });
    });

    it('Should `data_type` be one in the list.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post(`/api/fields/resource/${resource.resource_id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'invalid_type',
        });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'data_type', location: 'body', value: 'invalid_type',
      });
    });

    it('Should `value` be boolean valid value in case `data_type` was `boolean`.', () => {

    });

    it('Should `value` be URL valid value in case `data_type` was `url`.', () => {

    });

    it('Should `value` be integer valid value in case `data_type` was `number`.', () => {

    });

    it('Should `value` be decimal valid value in case `data_type` was `decimal`.', () => {

    });

    it('Should `value` be email valid value in case `data_type` was `email`.', () => {

    });

    it('Should `value` be boolean valid value in case `data_type` was `checkbox`.', () => {

    });

    it('Should response not found in case resource name was not exist.', async () => {
      const res = await request()
        .post('/api/fields/resource/resource_not_found')
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'RESOURCE_NOT_FOUND', code: 100,
      });
    });

    it('Should response success with valid data.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post(`/api/fields/resource/${resource.name}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
        });

      expect(res.status).equals(200);
    });

    it('Should store the given field details to the storage.', async () => {
      const resource = await create('resource');
      const res = await request()
        .post(`/api/fields/resource/${resource.name}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
          options: ['option 1', 'option 2'],
        });

      const foundField = await ResourceField.query().findById(res.body.id);

      expect(foundField.labelName).equals('Field label');
      expect(foundField.dataType).equals('text');
      expect(foundField.default).equals('default value');
      expect(foundField.helpText).equals('help text');
      expect(foundField.options.length).equals(2);
    });
  });

  describe('POST: `/fields/:field_id`', () => {
    it('Should response unauthorized in case the user was not authorized.', async () => {
      const field = await create('resource_field');
      const res = await request()
        .post(`/api/fields/${field.id}`)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
    });

    it('Should `label` be required.', async () => {
      const field = await create('resource_field');
      const res = await request()
        .post(`/api/fields/${field.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'label', location: 'body',
      })
    });

    it('Should `data_type` be required.', async () => {
      const field = await create('resource_field');
      const res = await request()
        .post(`/api/fields/${field.id}`)
        .set('x-access-token', loginRes.body.token)
        .send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({
        msg: 'Invalid value', param: 'data_type', location: 'body',
      });
    });

    it('Should `data_type` be one in the list.', async () => {
      const field = await create('resource_field');
      const res = await request().post(`/api/fields/${field.id}`).send({
        label: 'Field label',
        data_type: 'invalid_type',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('validation_error');
      expect(res.body.errors).include.something.deep.equals({  
        value: 'invalid_type',
        msg: 'Invalid value',
        param: 'data_type',
        location: 'body',
      });
    });

    it('Should response not found in case resource field id was not exist.', async () => {
      const res = await request()
        .post('/api/fields/100')
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
        });

      expect(res.status).equals(404);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'FIELD_NOT_FOUND', code: 100,
      });
    });
    
    it('Should update details of the given resource field.', async () => {
      const field = await create('resource_field');
      const res = await request()
        .post(`/api/fields/${field.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
        });

      const updateField = await ResourceField.query().findById(res.body.id);

      expect(updateField.labelName).equals('Field label');
      expect(updateField.dataType).equals('text');
      expect(updateField.default).equals('default value');
      expect(updateField.helpText).equals('help text');
    });

    it('Should save the new options of the field with exist ones in the storage.', async () => {
      const field = await create('resource_field', {
        options: JSON.stringify([{ key: 1, value: 'Option 1' }]),
      });
      const res = await request()
        .post(`/api/fields/${field.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          label: 'Field label',
          data_type: 'text',
          default: 'default value',
          help_text: 'help text',
          options: [
            { key: 1, value: 'Value Key 1' },
            { key: 2, value: 'Value Key 2' },
          ],
        });

      const updateField = await ResourceField.query().findById(res.body.id);

      expect(updateField.options.length).equals(2);
      expect(updateField.options[0].key).equals(1);
      expect(updateField.options[1].key).equals(2);

      expect(updateField.options[0].value).equals('Value Key 1');
      expect(updateField.options[1].value).equals('Value Key 2');
    });
  });

  describe('POST: `/fields/status/:field_id`', () => {
    it('Should response not found in case field id was not exist.', async () => {
      const res = await request().post('/api/fields/status/100').send();

      expect(res.status).equals(404);
    });

    it('Should change status activation of the given field.', async () => {
      const field = await create('resource_field');
      const res = await request()
        .post(`/api/fields/status/${field.id}`)
        .set('x-access-token', loginRes.body.token)
        .send({
          active: false,
        });
      const storedField = await knex('resource_fields').where('id', field.id).first();
      expect(storedField.active).equals(0);
    });
  });

  describe('DELETE: `/fields/:field_id`', () => {
    it('Should response not found in case field id was not exist.', async () => {
      const res = await request().delete('/api/fields/100').send();

      expect(res.status).equals(404);
    });

    it('Should not delete predefined field.', async () => {
      const field = await create('resource_field', { predefined: true });
      const res = await request().delete(`/api/fields/${field.id}`).send();

      expect(res.status).equals(400);
      expect(res.body.errors).include.something.that.deep.equals({
        type: 'PREDEFINED_FIELD', code: 100,
      });
    });

    it('Should delete the given field from the storage.', async () => {
      const field = await create('resource_field');
      const res = await request().delete(`/api/fields/${field.id}`).send();

      expect(res.status).equals(200);
    });
  });
});
