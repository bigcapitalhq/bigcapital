import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const TAX = 'TPS/GST 123456789 RT0001\nTVQ/QST 1234567890 TQ0001';
const HTML_ACCEPT = 'application/json+html';

let customerId: number;
let itemId: number;
let originalTaxNumber: string | null;

const api = () => request(app.getHttpServer());
const withAuth = (req: request.Test) =>
  req
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader);

const setTaxNumber = (taxNumber: string) =>
  withAuth(api().put('/organization')).send({ taxNumber });

describe('Company tax number on PDFs (e2e)', () => {
  beforeAll(async () => {
    await withAuth(api().put('/transactions-locking/cancel-lock')).send({
      reason: 'Cancel lock for e2e test',
    });

    const organization = await withAuth(api().get('/organization/current'));
    originalTaxNumber = organization.body.metadata?.tax_number ?? null;

    const customer = await withAuth(api().post('/customers')).send({
      displayName: 'Tax Number Customer',
      customerType: 'business',
      currencyCode: 'USD',
    });
    customerId = customer.body.id;

    const item = await withAuth(api().post('/items')).send({
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

    await setTaxNumber(TAX).expect(200);
  });

  afterAll(async () => {
    await setTaxNumber(originalTaxNumber ?? '');
  });

  it('GET /pdf-templates/state returns the organization tax number', async () => {
    const response = await withAuth(api().get('/pdf-templates/state')).expect(
      200,
    );

    expect(response.body.company_tax_number).toBe(TAX);
  });

  it('prints the tax number in the invoice HTML', async () => {
    const invoice = await withAuth(api().post('/sale-invoices'))
      .send({
        customerId,
        invoiceDate: '2023-01-01',
        dueDate: '2023-02-01',
        invoiceNo: faker.string.uuid(),
        delivered: true,
        branchId: 1,
        warehouseId: 1,
        entries: [{ index: 1, itemId, quantity: 1, rate: 1000 }],
      })
      .expect(201);

    const response = await withAuth(
      api().get(`/sale-invoices/${invoice.body.id}`),
    )
      .set('Accept', HTML_ACCEPT)
      .expect(200);

    expect(response.body.html_content).toContain('TPS/GST 123456789 RT0001');
    expect(response.body.html_content).toContain('TVQ/QST 1234567890 TQ0001');
  });

  it('prints the tax number in the credit note HTML', async () => {
    const creditNote = await withAuth(api().post('/credit-notes'))
      .send({
        customerId,
        creditNoteDate: '2023-01-01',
        creditNoteNumber: faker.string.uuid(),
        branchId: 1,
        warehouseId: 1,
        entries: [{ index: 1, itemId, quantity: 1, rate: 1000 }],
      })
      .expect(201);

    const response = await withAuth(
      api().get(`/credit-notes/${creditNote.body.id}`),
    )
      .set('Accept', HTML_ACCEPT)
      .expect(200);

    expect(response.body.html_content).toContain('TPS/GST 123456789 RT0001');
    expect(response.body.html_content).toContain('TVQ/QST 1234567890 TQ0001');
  });

  it('rejects a tax number longer than 255 characters', async () => {
    await setTaxNumber('x'.repeat(256)).expect(400);
  });
});
