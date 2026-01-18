import * as request from 'supertest';
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
        name: faker.commerce.productName(),
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
      .expect(200);
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

  it('/warehouse-transfers/:id (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/warehouse-transfers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createWarehouseTransferRequest());
    const transferId = response.body.id;

    return request(app.getHttpServer())
      .post(`/warehouse-transfers/${transferId}`)
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
});
