import {
  request,
  expect,
  create,
  login,
} from '~/testInit';
import Expense from '@/models/Expense';
import ResourceCustomFieldRepository from '@/services/CustomFields/ResourceCustomFieldRepository';
import ResourceFieldMetadata from '@/models/ResourceFieldMetadata';

let loginRes;

describe('ResourceCustomFieldRepository', () => {
  beforeEach(async () => {
    loginRes = await login();
  });
  afterEach(() => {
    loginRes = null;
  });

  describe('constructor()', () => {
    it('Should take the resource name from model class name', () => {
      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);

      expect(customFieldsRepo.resourceName).equals('Expense');
    });
  });

  describe('fetchCustomFields', () => {
    it('Should fetches all custom fields that associated with the resource.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });
      const resourceField2 = await create('resource_field', { resource_id: resource.id });

      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.fetchCustomFields();

      expect(customFieldsRepo.customFields.length).equals(2);
    });
  });

  describe.only('fetchCustomFieldsMetadata', () => {
    it('Should fetches all custom fields metadata that associated to the resource and resource item.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });
      const resourceField2 = await create('resource_field', { resource_id: resource.id });

      const expense = await create('expense');

      const fieldMetadata = await create('resource_custom_field_metadata', {
        resource_id: resource.id, resource_item_id: expense.id,
      });
      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);

      await customFieldsRepo.fetchCustomFields();
      await customFieldsRepo.fetchCustomFieldsMetadata(expense.id);

      expect(customFieldsRepo.metadata[expense.id].metadata.length).equals(1);
    });
  });

  describe('fillCustomFields', () => {

  });

  describe('saveCustomFields', () => {
    it('Should save the given custom fields metadata to the resource item.', () => {
      const resource = await create('resource');
      const resourceField = await create('resource_field', { resource_field: resource.id });

      const expense = await create('expense');
      const fieldMetadata = await create('resource_custom_field_metadata', {
        resource_id: resource.id, resource_item_id: expense.id,
      });

      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.load();

      customFieldsRepo.fillCustomFields(expense.id, [
        { key: resourceField.slug, value: 'Hello World' },
      ]);

      await customFieldsRepo.saveCustomFields();

      const updateResourceFieldData = await ResourceFieldMetadata.query()
        .where('resource_id', resource.id)
        .where('resource_item_id', expense.id)
        .first();

      expect(updateResourceFieldData.value).equals('Hello World');
    });
  });

  // describe('validateExistCustomFields', () => {

  // });
});