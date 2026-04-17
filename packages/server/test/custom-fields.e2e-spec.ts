import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import {
  app,
  AuthorizationHeader,
  orgainzationId,
} from './init-app-test';

const makeCustomFieldRequest = (overrides = {}) => ({
  resourceName: 'Item',
  fieldName: `cf_${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`,
  label: faker.commerce.productAdjective(),
  fieldType: 'text',
  required: false,
  order: 1,
  active: true,
  ...overrides,
});

const makeItemRequest = () => ({
  name: faker.commerce.productName(),
  type: 'service',
});

describe('Custom Fields (e2e)', () => {
  it('/custom-fields (POST) - should create a custom field', () => {
    return request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest())
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.fieldName).toBeDefined();
        expect(res.body.label).toBeDefined();
      });
  });

  it('/custom-fields (GET) - should retrieve custom fields', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest());

    return request(app.getHttpServer())
      .get('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('/custom-fields?resource=Item (GET) - should retrieve custom fields by resource', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({ resourceName: 'Item' }));

    return request(app.getHttpServer())
      .get('/custom-fields')
      .query({ resource: 'Item' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.some((f: any) => f.id === field.body.id)).toBe(true);
      });
  });

  it('/custom-fields/:id (GET) - should retrieve a single custom field', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest());

    return request(app.getHttpServer())
      .get(`/custom-fields/${field.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(field.body.id);
        expect(res.body.fieldName).toBe(field.body.fieldName);
      });
  });

  it('/custom-fields/:id (PUT) - should edit a custom field', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest());

    const newLabel = faker.commerce.productAdjective();

    return request(app.getHttpServer())
      .put(`/custom-fields/${field.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        resourceName: field.body.resourceName,
        fieldName: field.body.fieldName,
        label: newLabel,
        fieldType: field.body.fieldType,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(field.body.id);
        expect(res.body.label).toBe(newLabel);
      });
  });

  it('/custom-fields/:id/status (PUT) - should update field status', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({ active: true }));

    await request(app.getHttpServer())
      .put(`/custom-fields/${field.body.id}/status`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ active: false })
      .expect(200);

    const updated = await request(app.getHttpServer())
      .get(`/custom-fields/${field.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(updated.body.active).toBe(false);
  });

  it('/custom-fields/reorder (POST) - should reorder custom fields', async () => {
    const field1 = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({ order: 1 }));

    const field2 = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({ order: 2 }));

    return request(app.getHttpServer())
      .post('/custom-fields/reorder')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        orders: [
          { id: field1.body.id, order: 2 },
          { id: field2.body.id, order: 1 },
        ],
      })
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/custom-fields/:id (DELETE) - should delete a custom field', async () => {
    const field = await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest());

    await request(app.getHttpServer())
      .delete(`/custom-fields/${field.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    return request(app.getHttpServer())
      .get(`/custom-fields/${field.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(404);
  });

  it('should save custom field values when creating an item', async () => {
    const fieldName = `cf_${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`;
    
    await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({
        resourceName: 'Item',
        fieldName,
        label: 'Test Field',
        fieldType: 'text',
      }));

    const customFieldValue = faker.commerce.productMaterial();

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeItemRequest(),
        customFields: {
          [fieldName]: customFieldValue,
        },
      })
      .expect(201);

    const fetchedItem = await request(app.getHttpServer())
      .get(`/items/${item.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(fetchedItem.body.customFields).toBeDefined();
    expect(fetchedItem.body.customFields[fieldName]).toBe(customFieldValue);
  });

  it('should update custom field values when editing an item', async () => {
    const fieldName = `cf_${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`;
    
    await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({
        resourceName: 'Item',
        fieldName,
        label: 'Test Field',
        fieldType: 'text',
      }));

    const initialValue = faker.commerce.productMaterial();
    const updatedValue = faker.commerce.productMaterial();

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeItemRequest(),
        customFields: {
          [fieldName]: initialValue,
        },
      })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/items/${item.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeItemRequest(),
        customFields: {
          [fieldName]: updatedValue,
        },
      })
      .expect(200);

    const fetchedItem = await request(app.getHttpServer())
      .get(`/items/${item.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(fetchedItem.body.customFields).toBeDefined();
    expect(fetchedItem.body.customFields[fieldName]).toBe(updatedValue);
  });

  it('should inject custom fields into resource metadata', async () => {
    const fieldName = `cf_${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`;
    const label = faker.commerce.productAdjective();
    
    await request(app.getHttpServer())
      .post('/custom-fields')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeCustomFieldRequest({
        resourceName: 'Item',
        fieldName,
        label,
        fieldType: 'text',
      }));

    const meta = await request(app.getHttpServer())
      .get('/resources/Item/meta')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(meta.body.fields2).toBeDefined();
    expect(meta.body.fields2[fieldName]).toBeDefined();
    expect(meta.body.fields2[fieldName].name).toBe(label);
    expect(meta.body.fields2[fieldName].fieldType).toBe('text');
  });
});
