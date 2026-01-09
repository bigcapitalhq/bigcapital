import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;

const createBillRequest = () => ({
  vendorId: vendorId,
  billDate: '2023-01-01',
  dueDate: '2023-02-01',
  billNumber: faker.string.alphanumeric(10),
  referenceNo: 'REF-000201',
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 2,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

describe('Bills (e2e)', () => {
  beforeAll(async () => {
    const vendor = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Vendor' });

    vendorId = vendor.body.id;

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
    itemId = parseInt(item.text, 10);
  });

  it('/bills (POST)', () => {
    return request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest())
      .expect(201);
  });

  it('/bills (GET)', () => {
    return request(app.getHttpServer())
      .get('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId = response.body.id;

    return request(app.getHttpServer())
      .put(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest())
      .expect(200);
  });

  it('/bills/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/:id/open (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId = response.body.id;

    return request(app.getHttpServer())
      .post(`/bills/${billId}/open`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/:id/payment-transactions (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bills/${billId}/payment-transactions`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/validate-bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/bills/validate-bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [billId1, billId2],
      })
      .expect(200);
  });

  it('/bills/bulk-delete (POST)', async () => {
    const response1 = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId1 = response1.body.id;

    const response2 = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest());
    const billId2 = response2.body.id;

    return request(app.getHttpServer())
      .post('/bills/bulk-delete')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ids: [billId1, billId2],
      })
      .expect(200);
  });
});
