import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let vendorId;
let itemId;
let tpsRateId;
let tvqRateId;

const makeBillRequest = () => ({
  vendorId: vendorId,
  billDate: '2023-01-01',
  dueDate: '2023-02-01',
  billNumber: faker.string.uuid(),
  referenceNo: 'REF-BILL-001',
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 2,
      rate: 100,
      description: 'Bill item description',
    },
  ],
});

const makeBillWithMultiTaxRequest = () => ({
  vendorId: vendorId,
  billDate: '2023-01-01',
  dueDate: '2023-02-01',
  billNumber: faker.string.uuid(),
  referenceNo: 'MULTI-TAX-BILL',
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

describe('Bills (e2e)', () => {
  beforeAll(async () => {
    // Create a vendor
    const vendor = await request(app.getHttpServer())
      .post('/vendors')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Test Vendor ' + faker.string.uuid() });

    vendorId = vendor.body.id;

    // Create an item
    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'Bill Item ' + faker.string.uuid(),
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
        name: 'TPS Bill Test',
        rate: 5,
        code: 'TPS_BILL_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tpsRateId = tpsResponse.body.id;

    // Create TVQ tax rate (9.975%)
    const tvqResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TVQ Bill Test',
        rate: 9.975,
        code: 'TVQ_BILL_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tvqRateId = tvqResponse.body.id;
  });

  it('/bills (POST)', async () => {
    return request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeBillRequest())
      .expect(201);
  });

  it('/bills/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeBillRequest());

    const billId = response.body.id;

    return request(app.getHttpServer())
      .get(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/bills/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/bills')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeBillRequest());

    const billId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/bills/${billId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  describe('Multi-Tax Support', () => {
    it('/bills (POST) with multiple taxes', async () => {
      const response = await request(app.getHttpServer())
        .post('/bills')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeBillWithMultiTaxRequest())
        .expect(201);

      expect(response.body.id).toBeDefined();
    });

    it('/bills/:id (GET) should return taxes on entries', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/bills')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeBillWithMultiTaxRequest());

      const billId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/bills/${billId}`)
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

    it('/bills/:id (GET) should have correct taxable amounts', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/bills')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(makeBillWithMultiTaxRequest());

      const getResponse = await request(app.getHttpServer())
        .get(`/bills/${createResponse.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];

      // Both taxes should have the same taxable amount (base amount)
      entry.taxes.forEach((tax: any) => {
        expect(tax.taxable_amount).toBe(100);
      });
    });

    it('/bills (POST) with single tax should work', async () => {
      const singleTaxRequest = {
        vendorId: vendorId,
        billDate: '2023-01-01',
        dueDate: '2023-02-01',
        billNumber: faker.string.uuid(),
        referenceNo: 'SINGLE-TAX-BILL',
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
        .post('/bills')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(singleTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/bills/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes.length).toBe(1);
      expect(entry.taxes[0].tax_rate).toBe(5);
    });

    it('/bills (POST) with no tax should work', async () => {
      const noTaxRequest = {
        vendorId: vendorId,
        billDate: '2023-01-01',
        dueDate: '2023-02-01',
        billNumber: faker.string.uuid(),
        referenceNo: 'NO-TAX-BILL',
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
        .post('/bills')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(noTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/bills/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toEqual([]);
    });
  });
});
