import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;
let billId;

describe('Bill Landed Costs (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ group: 'features', key: 'landed_cost', value: 1 }],
      })
      .expect(200);

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

    const bill = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        vendorId,
        billDate: '2023-01-01',
        dueDate: '2023-02-01',
        billNumber: faker.string.alphanumeric(10),
        branchId: 1,
        warehouseId: 1,
        open: true,
        entries: [
          {
            index: 1,
            itemId,
            quantity: 2,
            rate: 1000,
            description: 'Item description...',
          },
        ],
      })
      .expect(201);
    billId = bill.body.id;
  });

  it('/landed-cost/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .query({ transactionType: 'Bill' })
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/landed-cost/bills/:billId/transactions (GET)', () => {
    return request(app.getHttpServer())
      .get(`/landed-cost/bills/${billId}/transactions`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('should reject the landed cost endpoints when the feature is disabled', async () => {
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ group: 'features', key: 'landed_cost', value: 0 }],
      })
      .expect(200);

    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400);
  });
});
