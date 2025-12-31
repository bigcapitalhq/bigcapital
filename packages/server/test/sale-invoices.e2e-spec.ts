import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;
let tpsRateId;
let tvqRateId;

const requestSaleInvoiceBody = () => ({
  customerId: customerId,
  invoiceDate: '2023-01-01',
  dueDate: '2023-02-01',
  invoiceNo: faker.string.uuid(),
  referenceNo: 'REF-000201',
  delivered: true,
  discountType: 'percentage',
  discount: 10,
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 2,
      rate: 1000,
      description: 'Item description...',
    },
  ],
});

const requestInvoiceWithMultiTaxBody = () => ({
  customerId: customerId,
  invoiceDate: '2023-01-01',
  dueDate: '2023-02-01',
  invoiceNo: faker.string.uuid(),
  referenceNo: 'MULTI-TAX-INV',
  delivered: true,
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

describe('Sale Invoices (e2e)', () => {
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
        name: 'TPS Invoice Test',
        rate: 5,
        code: 'TPS_INV_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tpsRateId = tpsResponse.body.id;

    // Create TVQ tax rate (9.975%)
    const tvqResponse = await request(app.getHttpServer())
      .post('/tax-rates')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: 'TVQ Invoice Test',
        rate: 9.975,
        code: 'TVQ_INV_' + faker.string.uuid().slice(0, 8),
        active: 1,
      });
    tvqRateId = tvqResponse.body.id;
  });

  it('/sale-invoices (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody())
      .expect(201);
  });

  it('/sale-invoices/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .delete(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .put(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody())
      .expect(200);
  });

  // it('/sale-invoices (GET)', async () => {
  //   await request(app.getHttpServer())
  //     .post('/sale-invoices')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .send(requestSaleInvoiceBody());

  //   return request(app.getHttpServer())
  //     .get('/sale-invoices')
  //     .set('organization-id', orgainzationId)
  //     .set('Authorization', AuthorizationHeader)
  //     .expect(200);
  // });

  it('/sale-invoices/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/state (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/state`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/payments (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/payments`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/writeoff (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        expenseAccountId: 1024,
        date: '2023-01-01',
        reason: 'Write off reason',
      })
      .expect(200);
  });

  it('/sale-invoices/:id/cancel-writeoff (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    await request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        expenseAccountId: 1024,
        date: '2023-01-01',
        reason: 'Write off reason',
      });

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/cancel-writeoff`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/deliver (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...requestSaleInvoiceBody(),
        delivered: false,
      });

    return request(app.getHttpServer())
      .put(`/sale-invoices/${response.body.id}/deliver`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/mail-state (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .get(`/sale-invoices/${response.body.id}/mail-state`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/sale-invoices/:id/mail (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestSaleInvoiceBody());

    return request(app.getHttpServer())
      .post(`/sale-invoices/${response.body.id}/mail`)
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
    it('/sale-invoices (POST) with multiple taxes', async () => {
      const response = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(requestInvoiceWithMultiTaxBody())
        .expect(201);

      expect(response.body.id).toBeDefined();
    });

    it('/sale-invoices/:id (GET) should return taxes on entries', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(requestInvoiceWithMultiTaxBody());

      const invoiceId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-invoices/${invoiceId}`)
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

    it('/sale-invoices/:id (GET) should have correct taxable amounts', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/sale-invoices')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(requestInvoiceWithMultiTaxBody());

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-invoices/${createResponse.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];

      // Both taxes should have the same taxable amount (base amount)
      entry.taxes.forEach((tax: any) => {
        expect(tax.taxable_amount).toBe(100);
      });
    });

    it('/sale-invoices (POST) with single tax should work', async () => {
      const singleTaxRequest = {
        customerId: customerId,
        invoiceDate: '2023-01-01',
        dueDate: '2023-02-01',
        invoiceNo: faker.string.uuid(),
        referenceNo: 'SINGLE-TAX-INV',
        delivered: true,
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
        .post('/sale-invoices')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(singleTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-invoices/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes.length).toBe(1);
      expect(entry.taxes[0].tax_rate).toBe(5);
    });

    it('/sale-invoices (POST) with no tax should work', async () => {
      const noTaxRequest = {
        customerId: customerId,
        invoiceDate: '2023-01-01',
        dueDate: '2023-02-01',
        invoiceNo: faker.string.uuid(),
        referenceNo: 'NO-TAX-INV',
        delivered: true,
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
        .post('/sale-invoices')
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .send(noTaxRequest)
        .expect(201);

      const getResponse = await request(app.getHttpServer())
        .get(`/sale-invoices/${response.body.id}`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      const entry = getResponse.body.entries[0];
      expect(entry.taxes).toEqual([]);
    });
  });
});
