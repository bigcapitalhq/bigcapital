import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;
let vendorCreditId;
let depositAccountId;

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

const findDepositAccount = (accounts) => {
  for (const account of accounts) {
    if (account.account_type === 'bank' || account.account_type === 'cash') {
      return account;
    }
    if (account.children) {
      const foundAccount = findDepositAccount(account.children);
      if (foundAccount) return foundAccount;
    }
  }
  return null;
};

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

    const accounts = await request(app.getHttpServer())
      .get('/accounts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const depositAccount = findDepositAccount(accounts.body.accounts);
    depositAccountId = depositAccount.id;

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

  it('increments the vendor credit refunded amount once the refund is created', async () => {
    await request(app.getHttpServer())
      .post(`/vendor-credits/${vendorCreditId}/refund`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        amount: 400,
        depositAccountId,
        description: 'Refund partial amount',
        date: '2025-01-01',
      })
      .expect(201);

    const vendorCredit = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(vendorCredit.body.refunded_amount)).toBe(400);
    expect(Number(vendorCredit.body.credits_remaining)).toBe(600);
  });

  it('decrements the vendor credit refunded amount once the refund is deleted', async () => {
    const refunds = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}/refund`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const refundCreditId = refunds.body[0].id;

    await request(app.getHttpServer())
      .delete(`/vendor-credits/refunds/${refundCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const vendorCredit = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(vendorCredit.body.refunded_amount)).toBe(0);
    expect(Number(vendorCredit.body.credits_remaining)).toBe(1000);
  });
});
