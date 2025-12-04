import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;

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
      quantity: 2,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

describe('Sale Invoices (e2e)', () => {
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
    itemId = parseInt(item.text, 10);
  });

  it('/sale-invoices (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody())
      .expect(201);
  });

  it('/sale-invoices/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .delete(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .put(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody())
      .expect(200);
  });

  // it('/sale-invoices (GET)', async () => {
  //   await request(app.getHttpServer())
  //     .post('/sale-invoices')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .send(requestSaleInvoiceBody());

  //   return request(app.getHttpServer())
  //     .get('/sale-invoices')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .expect(200);
  // });

  it('/sale-invoices/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/state (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/state`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/payments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/payments`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/writeoff (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
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
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    await request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        expenseAccountId: 1024,
        date: '2023-01-01',
        reason: 'Write off reason',
      });

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/cancel-writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/deliver (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...requestSaleInvoiceBody(),
        delivered: false,
      });

    return request(app.getHttpServer())
      .put(`/sale-invoices/${response.body.id}/deliver`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/mail-state (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/mail-state`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/mail (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/mail`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        subject: 'Email subject from here',
        to: 'a.bouhuolia@gmail.com',
        body: 'asfdasdf',
        attachInvoice: false,
      })
      .expect(200);
  });
});
