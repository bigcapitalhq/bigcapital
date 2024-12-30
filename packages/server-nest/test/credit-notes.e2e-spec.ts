import * as request from 'supertest';
import { app } from './init-app-test';

const requestCreditNote = () => ({
  customerId: 2,
  creditNoteDate: '2020-02-02',
  branchId: 1,
  warehouseId: 1,
  entries: [
    {
      index: 1,
      itemId: 1000,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  discount: '100',
  discountType: 'amount',
});

describe('Credit Notes (e2e)', () => {
  it('/credit-notes (POST)', () => {
    return request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', '4064541lv40nhca')
      .send(requestCreditNote())
      .expect(201);
  });

  it('/credit-notes/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', '4064541lv40nhca')
      .send(requestCreditNote());
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/credit-notes/${creditNoteId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/credit-notes/:id (PUT)', async () => {
    const creditNote = requestCreditNote();
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', '4064541lv40nhca')
      .send(creditNote);
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .put(`/credit-notes/${creditNoteId}`)
      .set('organization-id', '4064541lv40nhca')
      .send(creditNote)
      .expect(200);
  });

  it('/credit-notes/:id/open (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/credit-notes')
      .set('organization-id', '4064541lv40nhca')
      .send(requestCreditNote());
    const creditNoteId = response.body.id;

    return request(app.getHttpServer())
      .put(`/credit-notes/${creditNoteId}/open`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
