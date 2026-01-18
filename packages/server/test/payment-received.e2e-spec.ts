import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let invoice;
let customerId;
let itemId;

const requestPaymentReceivedBody = (invoiceId: number) => ({
  customerId: customerId,
  paymentDate: '2023-01-01',
  exchangeRate: 1,
  referenceNo: faker.string.uuid(),
  depositAccountId: 1000,
  paymentReceiveNo: faker.string.uuid(),
  statement: 'Payment received for invoice',
  entries: [{ index: 1, invoiceId, paymentAmount: 1 }],
  branchId: 1,
});

const requestSaleInvoiceBody = () => ({
  customerId: customerId,
  invoiceDate: '2023-01-01',
  dueDate: '2023-02-01',
  invoiceNo: faker.string.uuid(),
  referenceNo: 'REF-000201',
  delivered: true,
  discountType: 'percentage',
  discount: 10,
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 100,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

describe('Payment Received (e2e)', () => {
  beforeAll(async () => {
    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Customer' });

    customerId = customer.body.id;

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
  });

  beforeEach(async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    invoice = response.body;
  });

  it('/payments-received (POST)', () => {
    return request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id))
      .expect(201);
  });

  it('/payments-received/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/payments-received/${paymentReceivedId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payments-received/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .get(`/payments-received/${paymentReceivedId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payments-received/:id/invoices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .get(`/payments-received/${paymentReceivedId}/invoices`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payments-received/state (GET)', () => {
    return request(app.getHttpServer())
      .get('/payments-received/state')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/payments-received/:id/mail (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .post(`/payments-received/${paymentReceivedId}/mail`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        subject: 'Email subject from here',
        to: 'a.bouhuolia@gmail.com',
        body: 'asfdasdf',
      })
      .expect(200);
  });

  it('/payments-received/:id/mail (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .get(`/payments-received/${paymentReceivedId}/mail`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
