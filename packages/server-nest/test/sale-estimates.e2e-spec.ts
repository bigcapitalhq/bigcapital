import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

const makeEstimateRequest = () => ({
  customerId: 2,
  estimateDate: '2022-02-02',
  expirationDate: '2020-03-02',
  delivered: false,
  estimateNumber: faker.string.uuid(),
  discount: 100,
  discountType: 'amount',
  entries: [
    {
      index: 1,
      itemId: 1001,
      quantity: 3,
      rate: 1000,
      description: "It's description here.",
    },
  ],
});

describe('Sale Estimates (e2e)', () => {
  it('/sale-estimates (POST)', async () => {
    return request(app.getHttpServer())
      .post('/sale-estimates')
      .set('organization-id', '4064541lv40nhca')
      .send(makeEstimateRequest())
      .expect(201);
  });

  it('/sale-estimates (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('organization-id', '4064541lv40nhca')
      .send(makeEstimateRequest());

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-estimates/${estimateId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-estimates/state (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-estimates/state')
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-estimates/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('organization-id', '4064541lv40nhca')
      .send(makeEstimateRequest());

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .get(`/sale-estimates/${estimateId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-estimates/:id/approve (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('organization-id', '4064541lv40nhca')
      .send({ ...makeEstimateRequest(), delivered: true });

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .put(`/sale-estimates/${estimateId}/approve`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/sale-estimates/:id/reject (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-estimates')
      .set('organization-id', '4064541lv40nhca')
      .send({ ...makeEstimateRequest(), delivered: true });

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .put(`/sale-estimates/${estimateId}/reject`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
