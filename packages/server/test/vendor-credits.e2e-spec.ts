import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;

const requestVendorCredit = () => ({
  vendorId: vendorId,
  exchangeRate: 1,
  vendorCreditNumber: faker.string.uuid(),
  vendorCreditDate: '2025-01-01',
  entries: [
    {
      index: 1,
      item_id: itemId,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  branchId: 1,
  warehouseId: 1,
});

describe('Vendor Credits (e2e)', () => {
  beforeAll(async () => {
    const vendor = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Customer' });

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
  });

  it('/vendor-credits (POST)', () => {
    return request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestVendorCredit())
      .expect(201);
  });

  it('/vendor-credits/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/vendor-credits/:id/open (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .put(`/vendor-credits/${vendorCreditId}/open`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/vendor-credits/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
