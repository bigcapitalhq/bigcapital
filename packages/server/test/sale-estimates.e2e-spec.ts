import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;
let tpsRateId;
let tvqRateId;

const makeEstimateRequest = ({ ...props } = {}) => ({
  customerId: customerId,
  estimateDate: '2022-02-02',
  expirationDate: '2020-03-02',
  delivered: false,
  estimateNumber: faker.string.uuid(),
  discount: 100,
  discountType: 'amount',
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 3,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  ...props,
});

const makeEstimateWithMultiTaxRequest = () => ({
  customerId: customerId,
  estimateDate: '2022-02-02',
  expirationDate: '2020-03-02',
  delivered: false,
  estimateNumber: faker.string.uuid(),
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

describe('Sale Estimates (e2e)', () => {
  beforeAll(async () => {
    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ displayName: 'Test Customer' });

    customerId = customer.body.id;

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: faker.commerce.productName(),
        type: 'inventory',
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
        name: 'TPS Estimate Test',
        rate: 5,
        code: 'TPS_EST_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tpsRateId = tpsResponse.body.id;

    // Create TVQ tax rate (9.975%)
    const tvqResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TVQ Estimate Test',
        rate: 9.975,
        code: 'TVQ_EST_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tvqRateId = tvqResponse.body.id;
  });

  it('/sale-estimates (POST)', async () => {
    return request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(makeEstimateRequest())
      .expect(201);
  });

  it('/sale-estimates (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(makeEstimateRequest());

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-estimates/${estimateId}`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/state (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-estimates/state')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(makeEstimateRequest());

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .get(`/sale-estimates/${estimateId}`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/:id/approve (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ ...makeEstimateRequest(), delivered: true });

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .put(`/sale-estimates/${estimateId}/approve`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/:id/reject (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send({ ...makeEstimateRequest(), delivered: true });

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .put(`/sale-estimates/${estimateId}/reject`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/:id/mail (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(makeEstimateRequest());

    return request(app.getHttpServer())
      .get(`/sale-estimates/${response.body.id}/mail`)
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-estimates/:id/mail (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(makeEstimateRequest());

    return request(app.getHttpServer())
      .post(`/sale-estimates/${response.body.id}/mail`)
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

  describe('Multi-Tax Support', () => {
    it('/sale-estimates (POST) with multiple taxes', async () => {
      const response = await request(app.getHttpServer())
        .post('/sale-estimates')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeEstimateWithMultiTaxRequest())
        .expect(201);

      expect(response.body.id).toBeDefined();
    });

    it('/sale-estimates/:id (GET) should return taxes on entries', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-estimates')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeEstimateWithMultiTaxRequest());

      const estimateId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-estimates/${estimateId}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      expect(getResponse.body.entries).toBeDefined();
      expect(getResponse.body.entries.length).toBeGreaterThan(0);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toBeDefined();
      expect(entry.taxes.length).toBe(2);

      // Verify TPS tax (5%)
      const tpsTax = entry.taxes.find((t: any) => t.tax_rate === 5);
      expect(tpsTax).toBeDefined();
      expect(tpsTax.tax_rate).toBe(5);
      expect(tpsTax.tax_amount).toBeCloseTo(5, 2); // 5% of 100

      // Verify TVQ tax (9.975%)
      const tvqTax = entry.taxes.find((t: any) => t.tax_rate === 9.975);
      expect(tvqTax).toBeDefined();
      expect(tvqTax.tax_rate).toBe(9.975);
      expect(tvqTax.tax_amount).toBeCloseTo(9.975, 2); // 9.975% of 100
    });

    it('/sale-estimates/:id (GET) should have correct taxable amounts', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-estimates')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeEstimateWithMultiTaxRequest());

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-estimates/${createResponse.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];

      // Both taxes should have the same taxable amount (base amount)
      entry.taxes.forEach((tax: any) => {
        expect(tax.taxable_amount).toBe(100);
      });
    });

    it('/sale-estimates (POST) with single tax should work', async () => {
      const singleTaxRequest = {
        customerId: customerId,
        estimateDate: '2022-02-02',
        expirationDate: '2020-03-02',
        delivered: false,
        estimateNumber: faker.string.uuid(),
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
        .post('/sale-estimates')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(singleTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-estimates/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes.length).toBe(1);
      expect(entry.taxes[0].tax_rate).toBe(5);
    });

    it('/sale-estimates (POST) with no tax should work', async () => {
      const noTaxRequest = {
        customerId: customerId,
        estimateDate: '2022-02-02',
        expirationDate: '2020-03-02',
        delivered: false,
        estimateNumber: faker.string.uuid(),
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
        .post('/sale-estimates')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(noTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-estimates/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toEqual([]);
    });
  });
});
