import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

describe('Sale Estimates (e2e)', () => {
  it('/sales/estimates (POST)', async () => {
    return request(app.getHttpServer())
      .post('/sales/estimates')
      .set('organization-id', '4064541lv40nhca')
      .send({
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
      })
      .expect(201);
  });

  it('/sales/estimates (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sales/estimates')
      .set('organization-id', '4064541lv40nhca')
      .send({
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

    const estimateId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sales/estimates/${estimateId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
