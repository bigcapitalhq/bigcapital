import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

const requestPaymentReceivedBody = (invoiceId: number) => ({
  customerId: 2,
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
  customerId: 2,
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
      itemId: 1001,
      quantity: 100,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

let invoice;

beforeEach(async () => {
  const response = await request(app.getHttpServer())
    .post('/sale-invoices')
    .set('organization-id', '4064541lv40nhca')
    .send(requestSaleInvoiceBody());

  invoice = response.body;
});

describe('Payment Received (e2e)', () => {
  it('/payments-received (POST)', () => {
    return request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', '4064541lv40nhca')
      .send(requestPaymentReceivedBody(invoice.id))
      .expect(201);
  });

  it('/payments-received/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', '4064541lv40nhca')
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/payments-received/${paymentReceivedId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/payments-received/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', '4064541lv40nhca')
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .get(`/payments-received/${paymentReceivedId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/payments-received/:id/invoices (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/payments-received')
      .set('organization-id', '4064541lv40nhca')
      .send(requestPaymentReceivedBody(invoice.id));

    const paymentReceivedId = response.body.id;

    return request(app.getHttpServer())
      .get(`/payments-received/${paymentReceivedId}/invoices`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/payments-received/state (GET)', () => {
    return request(app.getHttpServer())
      .get('/payments-received/state')
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
