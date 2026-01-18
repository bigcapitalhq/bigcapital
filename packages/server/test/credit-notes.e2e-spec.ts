import * as request from 'supertest';
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
