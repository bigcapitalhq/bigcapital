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

describe('Payment Links (e2e)', () => {
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

  it('/payment-links/:paymentLinkId/invoice (GET)', async () => {
    // Create a sale invoice
    const invoiceResponse = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody())
      .expect(201);

    const invoiceId = invoiceResponse.body.id;

    // Generate a payment link for the invoice
    const paymentLinkResponse = await request(app.getHttpServer())
      .post(`/sale-invoices/${invoiceId}/generate-link`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(201);

    // Extract payment link ID from the URL
    // Format: {BASE_URL}/payment/{PAYMENT_LINK_ID}
    const paymentLinkUrl = paymentLinkResponse.body.link;
    const paymentLinkId = paymentLinkUrl.split('/payment/')[1];

    // Test the payment link endpoint
    return request(app.getHttpServer())
      .get(`/payment-links/${paymentLinkId}/invoice`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
