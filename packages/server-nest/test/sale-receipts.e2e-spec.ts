import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app, orgainzationId } from './init-app-test';

let customerId;
let itemId;

const makeReceiptRequest = () => ({
  customerId: customerId,
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
      itemId: itemId,
      quantity: 1,
      rate: 2000,
      description: 'asdfsadf',
    },
  ],
});

describe('Sale Receipts (e2e)', () => {
  beforeAll(async () => {
    const customer = await request(app.getHttpServer())
      .post('/customers')
      .set('organization-id', orgainzationId)
      .send({ displayName: 'Test Customer' });

    customerId = customer.body.id;

    const item = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .send({
        name: faker.commerce.productName(),
        sellable: true,
        purchasable: true,
        sellAccountId: 1026,
        costAccountId: 1019,
        costPrice: 100,
        sellPrice: 100,
      });
    itemId = parseInt(item.text, 10);
  });

  it('/sale-reeipts (POST)', () => {
    return request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .send(makeReceiptRequest())
      .expect(201);
  });

  it('/sale-receipts/:id (DELETE)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .send();
  });

  it('/sale-receipts/:id (PUT)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .delete(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .send({
        ...makeReceiptRequest(),
        referenceNo: '321',
      })
      .expect(200);
  });

  it('/sale-receipts (GET)', async () => {
    return request(app.getHttpServer())
      .get('/sale-receipts')
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-receipts/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .send(makeReceiptRequest());

    const receiptId = response.body.id;

    return request(app.getHttpServer())
      .get(`/sale-receipts/${receiptId}`)
      .set('organization-id', orgainzationId)
      .expect(200);
  });

  it('/sale-receipts/:id/mail (GET)', async () => {
    const response = await request(app.getHttpServer())
      .post('/sale-receipts')
      .set('organization-id', orgainzationId)
      .send(makeReceiptRequest());

    return request(app.getHttpServer())
      .get(`/sale-receipts/${response.body.id}/mail`)
      .set('organization-id', orgainzationId)
      .expect(200);
  });
});
