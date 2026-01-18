import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

let customerId;
let itemId;

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
    itemId = item.body.id;
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
});
