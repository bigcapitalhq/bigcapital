import {
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

  describe('loadResource()', () => {
    it('Should fetches the resource name.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.loadResource();

      expect(customFieldsRepo.resource.name).equals('Expense');
    });
  });

  describe('loadResourceCustomFields()', () => {
    it('Should fetches all custom fields that associated with the resource.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });
      const resourceField2 = await create('resource_field', { resource_id: resource.id });

      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.loadResource();
      await customFieldsRepo.loadResourceCustomFields();

      expect(customFieldsRepo.customFields.length).equals(2);
    });
  });

  describe('fetchCustomFieldsMetadata', () => {
    it('Should fetches all custom fields metadata that associated to the resource and resource item.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });
      const resourceField2 = await create('resource_field', { resource_id: resource.id });

      const expense = await create('expense');

      const fieldMetadata = await create('resource_custom_field_metadata', {
        resource_id: resource.id, resource_item_id: expense.id,
      });
      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);

      await customFieldsRepo.load();
      await customFieldsRepo.fetchCustomFieldsMetadata(expense.id);

      expect(customFieldsRepo.metadata[expense.id].metadata.length).equals(1);
      expect(customFieldsRepo.metadata[expense.id].metadata[0].key).equals(fieldMetadata.key);
      expect(customFieldsRepo.metadata[expense.id].metadata[0].value).equals(fieldMetadata.value);
    });
  });

  describe('fillCustomFields', () => {
    it('Should fill custom fields metadata attributes to metadata object.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });

      const expense = await create('expense');

      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.load();
      await customFieldsRepo.fetchCustomFieldsMetadata(expense.id);

      customFieldsRepo.fillCustomFields(expense.id, [
        {
          key: resourceField.key,
          value: 'Hello World',
        },
      ]);
      expect(customFieldsRepo.fieldsMetadata[expense.id].metadata.length).equals(1);
      expect(customFieldsRepo.filledCustomFields[expense.id].length).equals(1);
    });
  });

  describe('saveCustomFields', () => {
    it('Should save the given custom fields metadata to the resource item.', async () => {
      const resource = await create('resource', { name: 'Expense' });
      const resourceField = await create('resource_field', { resource_id: resource.id });

      const expense = await create('expense');
      const fieldMetadata = await create('resource_custom_field_metadata', {
        key: resourceField.slug,
        resource_id: resource.id,
        resource_item_id: expense.id,
      });
      const customFieldsRepo = new ResourceCustomFieldRepository(Expense);
      await customFieldsRepo.load();
      await customFieldsRepo.fetchCustomFieldsMetadata(expense.id);

      customFieldsRepo.fillCustomFields(expense.id, [
        { key: resourceField.slug, value: 'Hello World' },
      ]);

      await customFieldsRepo.saveCustomFields(expense.id);

      const updateResourceFieldData = await ResourceFieldMetadata.query();
      expect(updateResourceFieldData.metadata[0].value).equals('Hello World');
    });
  });

  describe('validateExistCustomFields', () => {

  });
});