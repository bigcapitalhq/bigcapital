import * as request from 'supertest';
import { app } from './init-app-test';
import { faker } from '@faker-js/faker';

const requestVendorCredit = () => ({
  vendorId: 3,
  exchangeRate: 1,
  vendorCreditNumber: faker.string.uuid(),
  vendorCreditDate: '2025-01-01',
  entries: [
    {
      index: 1,
      item_id: 1000,
      quantity: 1,
      rate: 1000,
      description: "It's description here.",
    },
  ],
  branchId: 1,
  warehouseId: 1,
});

describe('Vendor Credits (e2e)', () => {
  it('/vendor-credits (POST)', () => {
    return request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', '4064541lv40nhca')
      .send(requestVendorCredit())
      .expect(201);
  });

  it('/vendor-credits/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', '4064541lv40nhca')
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/vendor-credits/:id/open (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', '4064541lv40nhca')
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .put(`/vendor-credits/${vendorCreditId}/open`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/vendor-credits/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/vendor-credits')
      .set('organization-id', '4064541lv40nhca')
      .send(requestVendorCredit());

    const vendorCreditId = response.body.id;

    return request(app.getHttpServer())
      .get(`/vendor-credits/${vendorCreditId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
