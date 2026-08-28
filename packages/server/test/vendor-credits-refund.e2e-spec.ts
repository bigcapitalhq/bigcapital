import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;
let vendorCreditId;

const createVendorCreditRequest = () => ({
  vendorId,
  exchangeRate: 1,
  vendorCreditNumber: faker.string.uuid(),
  vendorCreditDate: '2025-01-01',
  entries: [
    {
      index: 1,
      itemId,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  branchId: 1,
  warehouseId: 1,
});

describe('Vendor Credits Refund (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for e2e test' });

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

    const vendorCredit = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createVendorCreditRequest())
      .expect(201);
    vendorCreditId = vendorCredit.body.id;
  });

  it('/vendor-credits/:vendorCreditId/refund (GET)', () => {
    return request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}/refund`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
