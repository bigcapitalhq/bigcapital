import request = require('supertest');
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
    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for e2e test' });

    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: 'Test Customer',
        customerType: 'business',
        currencyCode: 'USD',
      });

    customerId = customer.body.id;

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: `${faker.commerce.productName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
        type: 'service',
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      });
    itemId = item.body.id;
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

  it('/sale-invoices/state (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-invoices/state')
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

  it('/sale-invoices/:id/duplicate (POST)', async () => {
    const original = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...requestSaleInvoiceBody(),
        invoiceMessage: 'Thanks for your business.',
        termsConditions: 'Due on receipt.',
        adjustment: 5,
      })
      .expect(201);

    const duplicateResponse = await request(app.getHttpServer())
      .post(`/sale-invoices/${original.body.id}/duplicate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(201);

    const { body: duplicate } = await request(app.getHttpServer())
      .get(`/sale-invoices/${duplicateResponse.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const { body: source } = await request(app.getHttpServer())
      .get(`/sale-invoices/${original.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    // A new draft invoice with its own number, dated today and due 7 days later.
    expect(duplicate.id).not.toEqual(source.id);
    expect(duplicate.invoice_no).toBeTruthy();
    expect(duplicate.invoice_no).not.toEqual(source.invoice_no);
    expect(duplicate.is_delivered).toBe(false);
    expect(duplicate.payment_amount).toEqual(0);

    const invoiceDate = new Date(duplicate.invoice_date);
    const dueDate = new Date(duplicate.due_date);
    expect(invoiceDate.toDateString()).toEqual(new Date().toDateString());
    expect((dueDate.getTime() - invoiceDate.getTime()) / 86_400_000).toEqual(7);

    // Same customer, message, terms, reference, discount and adjustment.
    expect(duplicate.customer_id).toEqual(source.customer_id);
    expect(duplicate.invoice_message).toEqual('Thanks for your business.');
    expect(duplicate.terms_conditions).toEqual('Due on receipt.');
    expect(duplicate.reference_no).toEqual(source.reference_no);
    expect(duplicate.discount).toEqual(source.discount);
    expect(duplicate.discount_type).toEqual(source.discount_type);
    expect(duplicate.adjustment).toEqual(source.adjustment);
    expect(duplicate.total).toEqual(source.total);

    // Same line items, as new entries.
    expect(duplicate.entries).toHaveLength(source.entries.length);
    duplicate.entries.forEach((entry, index) => {
      const sourceEntry = source.entries[index];
      expect(entry.id).not.toEqual(sourceEntry.id);
      expect(entry.item_id).toEqual(sourceEntry.item_id);
      expect(entry.quantity).toEqual(sourceEntry.quantity);
      expect(entry.rate).toEqual(sourceEntry.rate);
      expect(entry.description).toEqual(sourceEntry.description);
    });
  });

  it('/sale-invoices/:id/duplicate (POST) responds 404 for an unknown invoice', () => {
    return request(app.getHttpServer())
      .post('/sale-invoices/999999999/duplicate')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(404);
  });

  it('/sale-invoices/:id/mail (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/mail`)
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
