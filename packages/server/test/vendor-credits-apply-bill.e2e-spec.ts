import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;
let vendorCreditId;
let billId;

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

const createBillRequest = () => ({
  vendorId,
  billDate: '2025-01-01',
  dueDate: '2025-02-01',
  billNumber: faker.string.alphanumeric(10),
  referenceNo: 'REF-000201',
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
});

describe('Vendor Credits Apply Bills (e2e)', () => {
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

    const bill = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createBillRequest())
      .expect(201);
    billId = bill.body.id;

    await request(app.getHttpServer())
      .patch(`/bills/${billId}/open`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/vendor-credits/:vendorCreditId/bills-to-apply (GET)', () => {
    return request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}/bills-to-apply`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/vendor-credits/:vendorCreditId/applied-bills (GET)', () => {
    return request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}/applied-bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('increments the bill credited amount and vendor credit invoiced amount once applied', async () => {
    await request(app.getHttpServer())
      .post(`/vendor-credits/${vendorCreditId}/apply-to-bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ entries: [{ billId, amount: 400 }] })
      .expect(201);

    const vendorCredit = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(vendorCredit.body.invoiced_amount)).toBe(400);
    expect(Number(vendorCredit.body.credits_remaining)).toBe(600);

    const bill = await request(app.getHttpServer())
      .get(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(bill.body.credited_amount)).toBe(400);
    expect(Number(bill.body.due_amount)).toBe(600);
  });

  it('reverts the synced amounts once the applied bill is deleted', async () => {
    const appliedBills = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}/applied-bills`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const appliedBillId = appliedBills.body[0].id;

    await request(app.getHttpServer())
      .delete(`/vendor-credits/applied-bills/${appliedBillId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    const vendorCredit = await request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(vendorCredit.body.invoiced_amount)).toBe(0);
    expect(Number(vendorCredit.body.credits_remaining)).toBe(1000);

    const bill = await request(app.getHttpServer())
      .get(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Number(bill.body.credited_amount)).toBe(0);
    expect(Number(bill.body.due_amount)).toBe(1000);
  });
});
