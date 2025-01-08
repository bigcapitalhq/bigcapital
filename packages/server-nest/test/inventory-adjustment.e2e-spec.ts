import * as request from 'supertest';
import { faker } from '@faker-js/faker';
import { app } from './init-app-test';

export const createInventoryAdjustment = ({ itemId }) => ({
  date: '2020-01-01',
  type: 'increment',
  adjustmentAccountId: 1001,
  reason: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  referenceNo: faker.string.alphanumeric(10),
  itemId,
  quantity: faker.number.int({ min: 1, max: 100 }),
  cost: faker.number.float({ min: 1, max: 1000 }),
  publish: true,

  warehouseId: 1,
  branchId: 1,
});

const makeItemRequest = () => ({
  name: faker.commerce.productName(),
  type: 'inventory',
  inventory_account_id: 1007,
});

describe('Inventory Adjustments (e2e)', () => {
  it('/inventory-adjustments/quick (POST)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.text;

    return request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', '4064541lv40nhca')
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);
  });

  it('/inventory-adjustments/:id (DELETE)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.text;

    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', '4064541lv40nhca')
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/inventory-adjustments/${inventoryAdjustmentId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/inventory-adjustments/:id (GET)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.text;
    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', '4064541lv40nhca')
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    return request(app.getHttpServer())
      .get(`/inventory-adjustments/${inventoryAdjustmentId}`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });

  it('/inventory-adjustments/:id/publish (POST)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', '4064541lv40nhca')
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.text;
    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', '4064541lv40nhca')
      .send({
        ...createInventoryAdjustment({ itemId }),
        publish: false,
      })
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    return request(app.getHttpServer())
      .put(`/inventory-adjustments/${inventoryAdjustmentId}/publish`)
      .set('organization-id', '4064541lv40nhca')
      .expect(200);
  });
});
