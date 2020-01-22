import { create, expect, request } from '~/testInit';
import knex from '@/database/knex';

describe('route: `/fields`', () => {
  describe('POST: `/fields/:resource_id`', () => {
    it('Should `label` be required.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/fields/resource/${resource.resource_id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('label');
    });

    it('Should `data_type` be required.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/fields/resource/${resource.resource_id}`);

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('data_type');
    });

    it('Should `data_type` be one in the list.', async () => {
      const resource = await create('resource');
      const res = await request().post(`/api/fields/resource/${resource.resource_id}`).send({
        label: 'Field label',
        data_type: 'invalid_type',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('data_type');
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

    it('Should response not found in case resource id was not exist.', async () => {
      const res = await request().post('/api/fields/resource/100').send({
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
      const res = await request().post(`/api/fields/resource/${resource.id}`).send({
        label: 'Field label',
        data_type: 'text',
        default: 'default value',
        help_text: 'help text',
      });

      expect(res.status).equals(200);
    });

    it('Should store the given field details to the storage.', async () => {
      const resource = await create('resource');
      await request().post(`/api/fields/resource/${resource.id}`).send({
        label: 'Field label',
        data_type: 'text',
        default: 'default value',
        help_text: 'help text',
        options: ['option 1', 'option 2'],
      });

      const foundField = await knex('resource_fields').first();

      expect(foundField.label_name).equals('Field label');
      expect(foundField.data_type).equals('text');
      expect(foundField.default).equals('default value');
      expect(foundField.help_text).equals('help text');
      expect(foundField.options).equals.deep([
        { key: 1, value: 'option 1' },
        { key: 2, value: 'option 2' },
      ]);
    });
  });

  describe('POST: `/fields/:field_id`', () => {
    it('Should `label` be required.', async () => {
      const field = await create('resource_field');
      const res = await request().post(`/api/fields/${field.id}`).send();

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('label');
    });

    it('Should `data_type` be required.', async () => {
      const field = await create('resource_field');
      const res = await request().post(`/api/fields/${field.id}`);

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('data_type');
    });

    it('Should `data_type` be one in the list.', async () => {
      const field = await create('resource_field');
      const res = await request().post(`/api/fields/${field.id}`).send({
        label: 'Field label',
        data_type: 'invalid_type',
      });

      expect(res.status).equals(422);
      expect(res.body.code).equals('VALIDATION_ERROR');

      const paramsErrors = res.body.errors.map((er) => er.param);
      expect(paramsErrors).to.include('data_type');
    });

    it('Should response not found in case resource id was not exist.', async () => {
      const res = await request().post('/api/fields/100').send({
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

    it('Should save the new options of the field in the storage.', async () => {

    });
  });

  describe('POST: `/fields/status/:field_id`', () => {
    it('Should response not found in case field id was not exist.', async () => {
      const res = await request().post('/api/fields/status/100').send();

      expect(res.status).equals(404);
    });

    it('Should change status activation of the given field.', async () => {
      const field = await create('resource_field');
      await request().post(`/api/fields/status/${field.id}`).send({
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
