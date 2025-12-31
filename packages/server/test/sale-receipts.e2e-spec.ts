import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;
let tpsRateId;
let tvqRateId;

const makeReceiptRequest = () => ({
  customerId: customerId,
  depositAccountId: 1000,
  receiptDate: '2022-02-02',
  referenceNo: '123',
  receiptNumber: faker.string.uuid(),
  branchId: 1,
  warehouseId: 1,
  discount: 100,
  discountType: 'amount',
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 1,
      rate: 2000,
      description: 'asdfsadf',
    },
  ],
});

const makeReceiptWithMultiTaxRequest = () => ({
  customerId: customerId,
  depositAccountId: 1000,
  receiptDate: '2022-02-02',
  referenceNo: '123',
  receiptNumber: faker.string.uuid(),
  branchId: 1,
  warehouseId: 1,
  isInclusiveTax: false,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 1,
      rate: 100,
      description: 'Item with multiple taxes',
      taxRateIds: [tpsRateId, tvqRateId],
    },
  ],
});

describe('Sale Receipts (e2e)', () => {
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

    // Create TPS tax rate (5%)
    const tpsResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TPS Test',
        rate: 5,
        code: 'TPS_TEST_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tpsRateId = tpsResponse.body.id;

    // Create TVQ tax rate (9.975%)
    const tvqResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TVQ Test',
        rate: 9.975,
        code: 'TVQ_TEST_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tvqRateId = tvqResponse.body.id;
  });

  it('/sale-reeipts (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeReceiptRequest())
      .expect(201);
  });

  it('/sale-receipts/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .send();
  });

  it('/sale-receipts/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...makeReceiptRequest(),
        referenceNo: '321',
      })
      .expect(200);
  });

  it('/sale-receipts (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-receipts/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .get(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-receipts/:id/mail (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeReceiptRequest());

    return request(app.getHttpServer())
      .get(`/sale-receipts/${response.body.id}/mail`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  describe('Multi-Tax Support', () => {
    it('/sale-receipts (POST) with multiple taxes', async () => {
      const response = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeReceiptWithMultiTaxRequest())
        .expect(201);

      expect(response.body.id).toBeDefined();
    });

    it('/sale-receipts/:id (GET) should return taxes on entries', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeReceiptWithMultiTaxRequest());

      const receiptId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${receiptId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      expect(getResponse.body.entries).toBeDefined();
      expect(getResponse.body.entries.length).toBeGreaterThan(0);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toBeDefined();
      expect(entry.taxes.length).toBe(2);

      // Verify TPS tax (5%)
      const tpsTax = entry.taxes.find((t) => t.tax_rate === 5);
      expect(tpsTax).toBeDefined();
      expect(tpsTax.tax_rate).toBe(5);
      expect(tpsTax.tax_amount).toBeCloseTo(5, 2); // 5% of 100

      // Verify TVQ tax (9.975%)
      const tvqTax = entry.taxes.find((t) => t.tax_rate === 9.975);
      expect(tvqTax).toBeDefined();
      expect(tvqTax.tax_rate).toBe(9.975);
      expect(tvqTax.tax_amount).toBeCloseTo(9.975, 2); // 9.975% of 100
    });

    it('/sale-receipts/:id (GET) should have correct taxable amounts', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeReceiptWithMultiTaxRequest());

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${createResponse.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];

      // Both taxes should have the same taxable amount (base amount)
      entry.taxes.forEach((tax: any) => {
        expect(tax.taxable_amount).toBe(100);
      });
    });

    it('/sale-receipts/:id (PUT) should update taxes correctly', async () => {
      // Create receipt with multi-tax
      const createResponse = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeReceiptWithMultiTaxRequest());

      const receiptId = createResponse.body.id;

      // Update with different amount
      const updateRequest = {
        ...makeReceiptWithMultiTaxRequest(),
        entries: [
          {
            index: 1,
            itemId: itemId,
            quantity: 2,
            rate: 50,
            description: 'Updated item',
            taxRateIds: [tpsRateId, tvqRateId],
          },
        ],
      };

      await request(app.getHttpServer())
        .put(`/sale-receipts/${receiptId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(updateRequest)
        .expect(200);

      // Verify updated taxes
      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${receiptId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes.length).toBe(2);

      // New amount is 2 * 50 = 100, so taxes should be same
      const tpsTax = entry.taxes.find((t: any) => t.tax_rate === 5);
      expect(tpsTax).toBeDefined();
      expect(tpsTax.tax_amount).toBeCloseTo(5, 2);
    });

    it('/sale-receipts (POST) with single tax should work', async () => {
      const singleTaxRequest = {
        customerId: customerId,
        depositAccountId: 1000,
        receiptDate: '2022-02-02',
        referenceNo: '123',
        receiptNumber: faker.string.uuid(),
        branchId: 1,
        warehouseId: 1,
        isInclusiveTax: false,
        entries: [
          {
            index: 1,
            itemId: itemId,
            quantity: 1,
            rate: 100,
            description: 'Item with single tax',
            taxRateIds: [tpsRateId],
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(singleTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes.length).toBe(1);
      expect(entry.taxes[0].tax_rate).toBe(5);
    });

    it('/sale-receipts (POST) with no tax should work', async () => {
      const noTaxRequest = {
        customerId: customerId,
        depositAccountId: 1000,
        receiptDate: '2022-02-02',
        referenceNo: '123',
        receiptNumber: faker.string.uuid(),
        branchId: 1,
        warehouseId: 1,
        entries: [
          {
            index: 1,
            itemId: itemId,
            quantity: 1,
            rate: 100,
            description: 'Item without tax',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(noTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toEqual([]);
    });
  });
});
