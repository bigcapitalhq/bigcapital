import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;
let creditNoteId;

const requestCreditNote = () => ({
  customerId,
  creditNoteDate: '2022-01-01',
  creditNoteNumber: faker.string.uuid(),
  entries: [
    {
      index: 1,
      itemId,
      quantity: 1,
      rate: 1000,
      description: 'Item description...',
    },
  ],
  branchId: 1,
  warehouseId: 1,
});

describe('Credit Notes Apply Invoice (e2e)', () => {
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
    itemId = parseInt(item.body.id, 10);

    const creditNote = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestCreditNote())
      .expect(201);
    creditNoteId = creditNote.body.id;
  });

  it('/credit-notes/:creditNoteId/applied-invoices (GET)', () => {
    return request(app.getHttpServer())
      .get(`/credit-notes/${creditNoteId}/applied-invoices`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
