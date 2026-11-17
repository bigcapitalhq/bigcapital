import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId: number;
let itemId: number;

const today = () => new Date().toISOString().slice(0, 10);

const futureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const pastDate = (days: number) => futureDate(-days);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestRecurringInvoiceBody = (
  overrides: Record<string, unknown> = {},
) => ({
  customerId,
  profileName: `Recurring ${faker.string.alphanumeric({ length: 8 })}`,
  startDate: today(),
  frequency: 'month',
  repeatInterval: 1,
  dueDays: 15,
  deliveryMode: 'draft',
  entries: [
    {
      index: 1,
      itemId,
      quantity: 2,
      rate: 1000,
      description: 'Recurring item',
    },
  ],
  ...overrides,
});

describe('Recurring Invoices (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for recurring invoice e2e test' });

    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: 'Recurring Test Customer',
        customerType: 'business',
        currencyCode: 'USD',
      });
    customerId = customer.body.id;

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: `${faker.commerce.productName()} ${Date.now()}`,
        type: 'service',
        unit: 'piece',
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      });
    itemId = item.body.id;
  });

  it('/recurring-invoices (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody());

    expect(response.status).toBe(201);

    expect(response.body.profile_name).toBeDefined();
    expect(response.body.status).toBe('active');
    expect(response.body.entries).toHaveLength(1);
  });

  it('exposes recurring invoice resource meta and default views', async () => {
    const meta = await request(app.getHttpServer())
      .get('/resources/recurring_invoices/meta')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(meta.body.fields.profile_name).toBeDefined();

    const views = await request(app.getHttpServer())
      .get('/views/resource/recurring_invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(views.body).toHaveLength(3);
    expect(views.body.map((view: any) => view.slug)).toEqual(
      expect.arrayContaining(['active', 'paused', 'completed']),
    );
  });

  it('/recurring-invoices (GET)', async () => {
    await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody())
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/recurring-invoices/:id (PUT)', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody({ startDate: futureDate(30) }))
      .expect(201);

    const response = await request(app.getHttpServer())
      .put(`/recurring-invoices/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(
        requestRecurringInvoiceBody({
          startDate: futureDate(30),
          profileName: 'Updated recurring profile',
          frequency: 'week',
        }),
      )
      .expect(200);

    expect(response.body.profile_name).toBe('Updated recurring profile');
    expect(response.body.frequency).toBe('week');
  });

  it('generates an invoice immediately', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody({ startDate: futureDate(30) }))
      .expect(201);

    const generated = await request(app.getHttpServer())
      .post(`/recurring-invoices/${recurring.body.id}/generate`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(generated.body.id).toBeDefined();

    const invoices = await request(app.getHttpServer())
      .get(`/recurring-invoices/${recurring.body.id}/invoices`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(invoices.body.data).toHaveLength(1);
    expect(invoices.body.data[0].id).toBe(generated.body.id);
  });

  it('generates a due invoice in the background', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(
        requestRecurringInvoiceBody({
          startDate: pastDate(1),
          frequency: 'day',
          maxOccurrences: 1,
        }),
      )
      .expect(201);

    let invoices: any = { body: { data: [] } };
    for (let attempt = 0; attempt < 20; attempt++) {
      invoices = await request(app.getHttpServer())
        .get(`/recurring-invoices/${recurring.body.id}/invoices`)
        .set('organization-id', orgainzationId)
        .set('Authorization', AuthorizationHeader)
        .expect(200);

      if (invoices.body.data?.length > 0) {
        break;
      }
      await sleep(250);
    }

    expect(invoices.body.data).toHaveLength(1);

    const profile = await request(app.getHttpServer())
      .get(`/recurring-invoices/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(profile.body.status).toBe('completed');
    expect(profile.body.next_invoice_date).toBeNull();
  });

  it('pauses and resumes a recurring invoice', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody())
      .expect(201);

    const paused = await request(app.getHttpServer())
      .post(`/recurring-invoices/${recurring.body.id}/pause`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(paused.body.status).toBe('paused');

    const resumed = await request(app.getHttpServer())
      .post(`/recurring-invoices/${recurring.body.id}/resume`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(resumed.body.status).toBe('active');
  });

  it('/recurring-invoices/:id (DELETE)', async () => {
    const recurring = await request(app.getHttpServer())
      .post('/recurring-invoices')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestRecurringInvoiceBody())
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/recurring-invoices/${recurring.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
