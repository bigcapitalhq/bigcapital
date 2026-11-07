import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const uniqueLabel = (prefix: string) =>
  `${prefix} ${Date.now()}-${faker.string.alphanumeric({ length: 5 })}`;

const createCustomField = async (payload: Record<string, any>) => {
  const response = await request(app.getHttpServer())
    .post('/custom-fields')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      resourceName: 'Customer',
      label: uniqueLabel('Field'),
      dataType: 'text',
      ...payload,
    })
    .expect(201);

  return response.body;
};

const cleanupCustomField = async (id: number) => {
  await request(app.getHttpServer())
    .put(`/custom-fields/${id}/status`)
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({ active: false });

  await request(app.getHttpServer())
    .delete(`/custom-fields/${id}`)
    .query({ force: 'true' })
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader);
};

const createCustomer = async (
  displayName: string,
  customFields?: Record<string, unknown>,
) => {
  const response = await request(app.getHttpServer())
    .post('/customers')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      displayName,
      customerType: 'business',
      currencyCode: 'USD',
      customFields,
    });

  return response;
};

describe('Custom Fields (e2e)', () => {
  const createdFieldIds: number[] = [];

  afterEach(async () => {
    for (const fieldId of createdFieldIds.splice(0)) {
      await cleanupCustomField(fieldId);
    }
  });

  it('/custom-fields (POST) creates a field and generates the API name', async () => {
    const field = await createCustomField({
      resourceName: 'Customer',
      label: uniqueLabel('Priority'),
      dataType: 'text',
    });
    createdFieldIds.push(field.id);

    expect(field.id).toBeDefined();
    expect(field.field_name).toMatch(/^cf_/);
    expect(field.resource_name).toBe('Customer');
    expect(field.data_type).toBe('text');
  });

  it('/custom-fields (GET) lists fields with values count', async () => {
    const field = await createCustomField({ resourceName: 'Customer' });
    createdFieldIds.push(field.id);

    const response = await request(app.getHttpServer())
      .get('/custom-fields')
      .query({ resourceName: 'Customer', includeInactive: 'true' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const found = response.body.data.find(
      (item: { id: number }) => item.id === field.id,
    );
    expect(found).toBeDefined();
    expect(found.values_count).toBeDefined();
  });

  it('/custom-fields/:id (GET/PUT) retrieves and edits the field', async () => {
    const field = await createCustomField({ resourceName: 'Customer' });
    createdFieldIds.push(field.id);
    const newLabel = uniqueLabel('Edited');

    const response = await request(app.getHttpServer())
      .put(`/custom-fields/${field.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ label: newLabel, helpText: 'Helpful text' })
      .expect(200);

    expect(response.body.label).toBe(newLabel);
    expect(response.body.help_text).toBe('Helpful text');
    expect(response.body.field_name).toBe(field.field_name);
  });

  it('/custom-fields/:id/status activates and deactivates a field', async () => {
    const field = await createCustomField({ resourceName: 'Customer' });
    createdFieldIds.push(field.id);

    const deactivated = await request(app.getHttpServer())
      .put(`/custom-fields/${field.id}/status`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: false })
      .expect(200);

    expect(Boolean(deactivated.body.active)).toBe(false);

    const activated = await request(app.getHttpServer())
      .put(`/custom-fields/${field.id}/status`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: true })
      .expect(200);

    expect(Boolean(activated.body.active)).toBe(true);
  });

  it('/custom-fields/:id (DELETE) requires deactivation and force for values', async () => {
    const field = await createCustomField({ resourceName: 'Customer' });
    const customer = await createCustomer(uniqueLabel('Delete Guard'), {
      [field.field_name]: 'Stored',
    });
    expect(customer.status).toBe(201);

    const activeDelete = await request(app.getHttpServer())
      .delete(`/custom-fields/${field.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect(activeDelete.status).toBe(400);
    expect(activeDelete.body.errors[0].type).toBe('CUSTOM_FIELD_ACTIVE');

    await request(app.getHttpServer())
      .put(`/custom-fields/${field.id}/status`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: false })
      .expect(200);

    const noForceDelete = await request(app.getHttpServer())
      .delete(`/custom-fields/${field.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader);

    expect(noForceDelete.status).toBe(400);
    expect(noForceDelete.body.errors[0].type).toBe('CUSTOM_FIELD_HAS_VALUES');

    await request(app.getHttpServer())
      .delete(`/custom-fields/${field.id}`)
      .query({ force: 'true' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('stores customer custom field values and returns them in detail/list', async () => {
    const field = await createCustomField({
      resourceName: 'Customer',
      label: uniqueLabel('Industry'),
      dataType: 'text',
    });
    createdFieldIds.push(field.id);
    const value = faker.commerce.department();

    const customer = await createCustomer(uniqueLabel('Custom Customer'), {
      [field.field_name]: value,
    });
    expect(customer.status).toBe(201);
    const customerId = customer.body.id;

    const detail = await request(app.getHttpServer())
      .get(`/customers/${customerId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(detail.body.custom_fields[field.field_name]).toBe(value);

    const list = await request(app.getHttpServer())
      .get('/customers')
      .query({ page: 1, page_size: 50 })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const row = list.body.data.find(
      (item: { id: number }) => item.id === customerId,
    );
    expect(row.custom_fields[field.field_name]).toBe(value);
  });

  it('validates required and unique custom field values', async () => {
    const requiredField = await createCustomField({
      resourceName: 'Vendor',
      label: uniqueLabel('Required'),
      required: true,
    });
    createdFieldIds.push(requiredField.id);

    const missing = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: uniqueLabel('Vendor Missing') });

    expect(missing.status).toBe(400);
    expect(missing.body.errors[0].type).toBe('CUSTOM_FIELD_REQUIRED');

    const validVendor = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: uniqueLabel('Vendor Valid'),
        customFields: { [requiredField.field_name]: 'TAX-1' },
      });
    expect(validVendor.status).toBe(201);

    const uniqueField = await createCustomField({
      resourceName: 'Vendor',
      label: uniqueLabel('Unique'),
      unique: true,
    });
    createdFieldIds.push(uniqueField.id);
    const uniqueValue = uniqueLabel('UNIQ');

    await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: uniqueLabel('Vendor Unique 1'),
        customFields: {
          [requiredField.field_name]: 'TAX-2',
          [uniqueField.field_name]: uniqueValue,
        },
      })
      .expect(201);

    const duplicate = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: uniqueLabel('Vendor Unique 2'),
        customFields: {
          [requiredField.field_name]: 'TAX-3',
          [uniqueField.field_name]: uniqueValue,
        },
      });

    expect(duplicate.status).toBe(400);
    expect(duplicate.body.errors[0].type).toBe('CUSTOM_FIELD_UNIQUE_VALUE');
  });

  it('injects active custom fields into the resource meta', async () => {
    const field = await createCustomField({
      resourceName: 'Customer',
      label: uniqueLabel('Meta Field'),
      dataType: 'text',
    });
    createdFieldIds.push(field.id);

    const response = await request(app.getHttpServer())
      .get('/resources/customers/meta')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(response.body.fields[field.field_name]).toBeDefined();
    expect(response.body.fields[field.field_name].name).toBe(field.label);
    expect(response.body.fields[field.field_name].field_type).toBe('text');
  });

  it('filters customer lists by custom field values', async () => {
    const field = await createCustomField({
      resourceName: 'Customer',
      label: uniqueLabel('Filterable'),
      dataType: 'text',
    });
    createdFieldIds.push(field.id);
    const value = uniqueLabel('FilterValue');

    const customer = await createCustomer(uniqueLabel('Filter Customer'), {
      [field.field_name]: value,
    });
    expect(customer.status).toBe(201);

    const response = await request(app.getHttpServer())
      .get('/customers')
      .query({
        page: 1,
        page_size: 50,
        stringified_filter_roles: JSON.stringify([
          {
            fieldKey: field.field_name,
            comparator: 'equals',
            value,
            index: 0,
            condition: 'and',
          },
        ]),
      })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(
      response.body.data.some(
        (item: { id: number }) => item.id === customer.body.id,
      ),
    ).toBe(true);
  });

  it('searches customer lists by custom field values', async () => {
    const field = await createCustomField({
      resourceName: 'Customer',
      label: uniqueLabel('Searchable'),
      dataType: 'text',
    });
    createdFieldIds.push(field.id);
    const value = uniqueLabel('SearchValue');

    const customer = await createCustomer(uniqueLabel('Search Customer'), {
      [field.field_name]: value,
    });
    expect(customer.status).toBe(201);

    const response = await request(app.getHttpServer())
      .get('/customers')
      .query({ page: 1, page_size: 50, search_keyword: value })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(
      response.body.data.some(
        (item: { id: number }) => item.id === customer.body.id,
      ),
    ).toBe(true);
  });
});
