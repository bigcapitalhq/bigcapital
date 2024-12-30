import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

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
      quantity: 2,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

describe('Sale Invoices (e2e)', () => {
  it('/sale-invoices (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody())
      .expect(201);
  });

  it('/sale-invoices/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .delete(`/sale-invoices/${response.body.id}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-invoices/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .put(`/sale-invoices/${response.body.id}`)
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody())
      .expect(200);
  });

  it('/sale-invoices/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-invoices/:id/state (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/state`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-invoices/:id/payments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/payments`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-invoices/:id/writeoff (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', '4064541lv40nhca')
      .send({
        expenseAccountId: 1024,
        date: '2023-01-01',
        reason: 'Write off reason',
      })
      .expect(200);
  });

  it('/sale-invoices/:id/cancel-writeoff (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send(requestSaleInvoiceBody());

    await request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', '4064541lv40nhca')
      .send({
        expenseAccountId: 1024,
        date: '2023-01-01',
        reason: 'Write off reason',
      });

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/cancel-writeoff`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-invoices/:id/deliver (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', '4064541lv40nhca')
      .send({
        ...requestSaleInvoiceBody(),
        delivered: false,
      });

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/deliver`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
