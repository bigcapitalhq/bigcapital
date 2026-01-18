import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let billId;
let itemId;

const createBillPaymentRequest = () => ({
  vendorId: vendorId,
  paymentAccountId: 1000,
  paymentDate: '2023-01-01',
  paymentNumber: faker.string.alphanumeric(10),
  entries: [
    {
      billId: billId,
      paymentAmount: 1000,
    },
  ],
});

describe('Bill Payments (e2e)', () => {
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
    itemId = parseInt(item.body.id, 10);

    const bill = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        vendorId: vendorId,
        billDate: '2023-01-01',
        dueDate: '2023-02-01',
        billNumber: faker.string.alphanumeric(10),
        // branchId: 1,
        // warehouseId: 1,
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
    billId = bill.body.id;
  });

  it('/bill-payments (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest())
      .expect(201);

    console.log(response.body);
  });

  it('/bill-payments (GET)', () => {
    return request(app.getHttpServer())
      .get('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bill-payments/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest());
    const billPaymentId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bill-payments/${billPaymentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bill-payments/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest());
    const billPaymentId = response.body.id;

    return request(app.getHttpServer())
      .put(`/bill-payments/${billPaymentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest())
      .expect(200);
  });

  it('/bill-payments/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest());
    const billPaymentId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/bill-payments/${billPaymentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bill-payments/:id/bills (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest());
    const billPaymentId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bill-payments/${billPaymentId}/bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bill-payments/new-page/entries (GET)', () => {
    return request(app.getHttpServer())
      .get('/bill-payments/new-page/entries')
      .query({ vendorId: vendorId })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bill-payments/:id/edit-page (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bill-payments')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillPaymentRequest());
    const billPaymentId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bill-payments/${billPaymentId}/edit-page`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
