import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let itemId;
let warehouseId1;
let warehouseId2;

const createWarehouseTransferRequest = () => ({
  fromWarehouseId: warehouseId1,
  toWarehouseId: warehouseId2,
  date: '2023-01-01',
  transactionNumber: faker.string.alphanumeric(10),
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 10,
      description: 'Transfer description',
    },
  ],
});

describe('Warehouse Transfers (e2e)', () => {
  beforeAll(async () => {
    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: `${faker.commerce.productName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
        type: 'inventory',
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      });
    itemId = parseInt(item.body.id, 10);

    const warehouse1 = await request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.company.name(),
        code: faker.string.alphanumeric(5).toUpperCase(),
        address: faker.location.streetAddress(),
      });
    warehouseId1 = warehouse1.body.id;

    const warehouse2 = await request(app.getHttpServer())
      .post('/warehouses')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.company.name(),
        code: faker.string.alphanumeric(5).toUpperCase(),
        address: faker.location.streetAddress(),
      });
    warehouseId2 = warehouse2.body.id;
  });

  it('/warehouse-transfers (POST)', () => {
    return request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest())
      .expect(201);
  });

  it('/warehouse-transfers (GET)', () => {
    return request(app.getHttpServer())
      .get('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouse-transfers/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId = response.body.id;

    return request(app.getHttpServer())
      .get(`/warehouse-transfers/${transferId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouse-transfers/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId = response.body.id;

    return request(app.getHttpServer())
      .put(`/warehouse-transfers/${transferId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest())
      .expect(200);
  });

  it('/warehouse-transfers/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/warehouse-transfers/${transferId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouse-transfers/validate-bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId2 = response2.body.id;

    const response = await request(app.getHttpServer())
      .post('/warehouse-transfers/validate-bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [transferId1, transferId2],
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        deletable_count: 2,
        non_deletable_count: 0,
      }),
    );
    expect(response.body.deletable_ids).toHaveLength(2);

    // Ensure the validation did not actually delete the transfers.
    await request(app.getHttpServer())
      .get(`/warehouse-transfers/${transferId1}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/warehouse-transfers/${transferId2}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/warehouse-transfers/bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId2 = response2.body.id;

    await request(app.getHttpServer())
      .post('/warehouse-transfers/bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [transferId1, transferId2],
      })
      .expect(200);

    // Ensure the transfers have been deleted.
    await request(app.getHttpServer())
      .get(`/warehouse-transfers/${transferId1}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(404);

    await request(app.getHttpServer())
      .get(`/warehouse-transfers/${transferId2}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(404);
  });
});
