import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId: number;
let itemId: number;
let tpsRateId: number;
let tvqRateId: number;

describe('Sales Tax Liability Summary Report (e2e)', () => {
  beforeAll(async () => {
    // Create a customer
    const customerResponse = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ displayName: 'Tax Report Customer ' + faker.string.uuid() });

    customerId = customerResponse.body.id;

    // Create an item with unique name
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'Tax Report Item ' + faker.string.uuid(),
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      });

    itemId = parseInt(itemResponse.text, 10);

    // Create TPS tax rate (5%)
    const tpsResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TPS Report Test',
        rate: 5,
        code: 'TPS_RPT_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });

    tpsRateId = tpsResponse.body.id;

    // Create TVQ tax rate (9.975%)
    const tvqResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TVQ Report Test',
        rate: 9.975,
        code: 'TVQ_RPT_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });

    tvqRateId = tvqResponse.body.id;
  });

  describe('/reports/sales-tax-liability-summary (GET)', () => {
    it('should return the sales tax liability summary report', async () => {
      const response = await request(app.getHttpServer())
        .get('/reports/sales-tax-liability-summary')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeDefined();
      expect(response.body.data.tax_rates).toBeDefined();
      expect(response.body.data.total).toBeDefined();
    });

    it('should return tax rates array in the report', async () => {
      const response = await request(app.getHttpServer())
        .get('/reports/sales-tax-liability-summary')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      expect(Array.isArray(response.body.data.tax_rates)).toBe(true);
    });

    it('should include tax percentage with proper precision', async () => {
      const response = await request(app.getHttpServer())
        .get('/reports/sales-tax-liability-summary')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      // Find the TVQ tax in the report (9.975%)
      const tvqRow = response.body.data.tax_rates.find(
        (row: any) => row.id === tvqRateId,
      );

      if (tvqRow) {
        // Verify that the tax percentage is not rounded
        expect(tvqRow.tax_percentage.amount).toBe(9.975);
        expect(tvqRow.tax_percentage.formatted_amount).toBe('%9.975');
      }
    });

    it('should include taxable amount in report', async () => {
      const response = await request(app.getHttpServer())
        .get('/reports/sales-tax-liability-summary')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      // Each tax row should have taxable_amount
      response.body.data.tax_rates.forEach((row: any) => {
        expect(row.taxable_amount).toBeDefined();
        expect(row.taxable_amount.amount).toBeDefined();
        expect(row.taxable_amount.formatted_amount).toBeDefined();
      });
    });

    it('should filter by date range', async () => {
      const fromDate = '2020-01-01';
      const toDate = '2030-12-31';

      const response = await request(app.getHttpServer())
        .get('/reports/sales-tax-liability-summary')
        .query({ fromDate, toDate })
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.tax_rates).toBeDefined();
    });
  });

  describe('Tax amounts accuracy', () => {
    it('should calculate correct tax amounts for multi-tax receipt', async () => {
      const baseAmount = 200;
      const receiptRequest = {
        customerId: customerId,
        depositAccountId: 1000,
        receiptDate: new Date().toISOString().split('T')[0],
        referenceNo: 'MULTI-TAX-ACCURACY',
        receiptNumber: faker.string.uuid(),
        branchId: 1,
        warehouseId: 1,
        closed: true,
        isInclusiveTax: false,
        entries: [
          {
            index: 1,
            itemId: itemId,
            quantity: 2,
            rate: 100, // Total: 200
            description: 'Multi-tax accuracy test',
            taxRateIds: [tpsRateId, tvqRateId],
          },
        ],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/sale-receipts')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(receiptRequest)
        .expect(201);

      // Get the receipt to verify taxes
      const getResponse = await request(app.getHttpServer())
        .get(`/sale-receipts/${createResponse.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];

      // Verify TPS: 5% of 200 = 10
      const tpsTax = entry.taxes.find((t: any) => t.tax_rate === 5);
      expect(tpsTax).toBeDefined();
      expect(tpsTax.tax_amount).toBeCloseTo(10, 2);
      expect(tpsTax.taxable_amount).toBe(baseAmount);

      // Verify TVQ: 9.975% of 200 = 19.95
      const tvqTax = entry.taxes.find((t: any) => t.tax_rate === 9.975);
      expect(tvqTax).toBeDefined();
      expect(tvqTax.tax_amount).toBeCloseTo(19.95, 2);
      expect(tvqTax.taxable_amount).toBe(baseAmount);
    });
  });
});
