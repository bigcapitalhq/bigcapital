import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const makeItemRequest = () => ({
  name: faker.commerce.productName(),
  type: 'service',
  unit: 'kg',
});

const authHeaders = () => ({
  'organization-id': orgainzationId,
  Authorization: AuthorizationHeader,
});

const setItemSkuSettings = (enabled: boolean, required = false) =>
  request(app.getHttpServer())
    .put('/settings')
    .set(authHeaders())
    .send({
      options: [
        { group: 'items', key: 'sku_enabled', value: enabled },
        { group: 'items', key: 'sku_required', value: required },
      ],
    });

describe.only('Items (e2e)', () => {
  it('/items (POST)', () => {
    return request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);
  });

  it('/items (POST) with reorder point', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        type: 'inventory',
        inventory_account_id: 1007,
        reorder_point: 12.5,
      })
      .expect(201);

    const itemResponse = await request(app.getHttpServer())
      .get(`/items/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(itemResponse.body.reorder_point)).toEqual(12.5);
  });

  it('/items/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());

    const itemId = response.body.id;

    return request(app.getHttpServer())
      .put(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(200);
  });

  it('/items (GET)', () => {
    return request(app.getHttpServer())
      .get('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    const itemResponse = await request(app.getHttpServer())
      .get(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(itemResponse.body.unit).toEqual('kg');
  });

  it('/items/:id/inactivate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/inactivate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/activate (PATCH)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeItemRequest(),
        active: false,
      });
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .patch(`/items/${itemId}/activate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/items/${itemId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/invoices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/invoices`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/bills (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/estimates (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/estimates`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/:id/receipts (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId = response.body.id;

    return request(app.getHttpServer())
      .get(`/items/${itemId}/receipts`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/items/validate-bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/items/validate-bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [itemId1, itemId2],
      })
      .expect(200);
  });

  it('/items (POST) rejects SKU when the feature is disabled', async () => {
    await setItemSkuSettings(false);

    const response = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        ...makeItemRequest(),
        sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
      })
      .expect(400);

    expect(
      response.body.errors.some(
        (error: { type: string }) =>
          error.type === 'ITEM_SKU_FEATURE_NOT_ENABLED',
      ),
    ).toBeTruthy();
  });

  it('/items (POST) with SKU', async () => {
    await setItemSkuSettings(true);
    const sku = `SKU-${faker.string.alphanumeric(10).toUpperCase()}`;
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku })
      .expect(201);

    const itemResponse = await request(app.getHttpServer())
      .get(`/items/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(itemResponse.body.sku).toEqual(sku);
  });

  it('/items (POST) rejects duplicate SKUs case-insensitively', async () => {
    const sku = `SKU-${faker.string.alphanumeric(10).toUpperCase()}`;

    await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku: sku.toLowerCase() })
      .expect(400);

    expect(
      response.body.errors.some(
        (error: { type: string }) => error.type === 'ITEM_SKU_EXISTS',
      ),
    ).toBeTruthy();
  });

  it('/items (POST) allows multiple items without a SKU', async () => {
    await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku: '' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku: '  ' })
      .expect(201);
  });

  it('/items/:id (PUT) keeps the item own SKU', async () => {
    const sku = `SKU-${faker.string.alphanumeric(10).toUpperCase()}`;
    const response = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku })
      .expect(201);

    await request(app.getHttpServer())
      .put(`/items/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ ...makeItemRequest(), sku })
      .expect(200);
  });

  it('/items (POST) requires SKU when the requirement is enabled', async () => {
    await setItemSkuSettings(true, true);

    const response = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({ ...makeItemRequest(), sku: '' })
      .expect(400);

    expect(
      response.body.errors.some(
        (error: { type: string }) => error.type === 'ITEM_SKU_REQUIRED',
      ),
    ).toBeTruthy();

    await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        ...makeItemRequest(),
        sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
      })
      .expect(201);
  });

  it('/items/:id (PUT) requires SKU when the requirement is enabled', async () => {
    await setItemSkuSettings(true, true);

    const response = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({
        ...makeItemRequest(),
        sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
      })
      .expect(201);

    const editResponse = await request(app.getHttpServer())
      .put(`/items/${response.body.id}`)
      .set(authHeaders())
      .send({ ...makeItemRequest(), sku: '' })
      .expect(400);

    expect(
      editResponse.body.errors.some(
        (error: { type: string }) => error.type === 'ITEM_SKU_REQUIRED',
      ),
    ).toBeTruthy();
  });

  it('/items/:id (PUT) allows an unchanged SKU when the feature is disabled', async () => {
    await setItemSkuSettings(true, false);

    const sku = `SKU-${faker.string.alphanumeric(10).toUpperCase()}`;
    const response = await request(app.getHttpServer())
      .post('/items')
      .set(authHeaders())
      .send({ ...makeItemRequest(), sku })
      .expect(201);

    await setItemSkuSettings(false, false);

    await request(app.getHttpServer())
      .put(`/items/${response.body.id}`)
      .set(authHeaders())
      .send({ ...makeItemRequest(), sku })
      .expect(200);

    const editResponse = await request(app.getHttpServer())
      .put(`/items/${response.body.id}`)
      .set(authHeaders())
      .send({
        ...makeItemRequest(),
        sku: `SKU-${faker.string.alphanumeric(10).toUpperCase()}`,
      })
      .expect(400);

    expect(
      editResponse.body.errors.some(
        (error: { type: string }) =>
          error.type === 'ITEM_SKU_FEATURE_NOT_ENABLED',
      ),
    ).toBeTruthy();
  });

  it('/items/bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest());
    const itemId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/items/bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [itemId1, itemId2],
      })
      .expect(200);
  });
});
