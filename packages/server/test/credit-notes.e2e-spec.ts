import request = require('supertest');
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';
import { faker } from '@faker-js/faker';

let customerId;
let itemId;

const requestCreditNote = () => ({
  customerId: customerId,
  creditNoteDate: '2020-02-02',
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: itemId,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  discount: '100',
  discountType: 'amount',
});

describe('Credit Notes (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for e2e test' });

    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        displayName: 'Test Customer',
        customerType: 'business',
        currencyCode: 'USD',
      });

    customerId = customer.body.id;

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
  });

  it('/credit-notes (POST)', () => {
    return request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestCreditNote())
      .expect(201);
  });

  it('/credit-notes (POST) numbers a credit note sent without a number', async () => {
    // Auto-increment is on by default; set it explicitly so the test doesn't
    // depend on the organization's current setting.
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [{ group: 'credit_note', key: 'auto_increment', value: true }],
      })
      .expect(200);

    const settings = await request(app.getHttpServer())
      .get('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
    const creditNoteSetting = (key: string) =>
      settings.body.find(
        (setting) => setting.group === 'credit_note' && setting.key === key,
      )?.value ?? '';
    const expectedNumber = `${creditNoteSetting('number_prefix')}${creditNoteSetting('next_number')}`;

    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestCreditNote())
      .expect(201);

    const creditNote = await request(app.getHttpServer())
      .get(`/credit-notes/${response.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    expect(expectedNumber).not.toBe('');
    expect(creditNote.body.credit_note_number).toBe(expectedNumber);
  });

  it('/credit-notes/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestCreditNote());
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/credit-notes/${creditNoteId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/credit-notes/:id (PUT)', async () => {
    const creditNote = requestCreditNote();
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(creditNote);
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .put(`/credit-notes/${creditNoteId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(creditNote)
      .expect(200);
  });

  it('/credit-notes/:id/open (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(requestCreditNote());
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .put(`/credit-notes/${creditNoteId}/open`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });
});
