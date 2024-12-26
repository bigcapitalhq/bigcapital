import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

const receiptRequest = {
  customerId: 2,
  depositAccountId: 1000,
  receiptDate: '2022-02-02',
  referenceNo: '123',
  receiptNumber: faker.string.uuid(),
  branchId: 1,
  warehouseId: 1,
  discount: 100,
  discountType: 'amount',
  entries: [
    {
      index: 1,
      itemId: 1001,
      quantity: 1,
      rate: 2000,
      description: 'asdfsadf',
    },
  ],
};

describe('Sale Receipts (e2e)', () => {
  it('/sale-reeipts (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', '4064541lv40nhca')
      .send(receiptRequest)
      .expect(201);
  });

  it('/sale-receipts/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', '4064541lv40nhca')
      .send(receiptRequest);

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', '4064541lv40nhca')
      .send();
  });

  it('/sale-receipts/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', '4064541lv40nhca')
      .send(receiptRequest);

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', '4064541lv40nhca')
      .send({
        ...receiptRequest,
        referenceNo: '321',
      })
      .expect(200);
  });

  it('/sale-receipts/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', '4064541lv40nhca')
      .send(receiptRequest);

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .get(`/sale-receipts/${receiptId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
