import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';
import { expectBalanced, fetchLegs, sumCredits, sumDebits } from './_utils/gl';

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
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.body.id;

    return request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);
  });

  it('/inventory-adjustments/:id (DELETE)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.body.id;

    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('Authorization', AuthorizationHeader)
      .set('organization-id', orgainzationId)
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    return request(app.getHttpServer())
      .delete(`/inventory-adjustments/${inventoryAdjustmentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/inventory-adjustments/:id (GET)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.body.id;
    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(createInventoryAdjustment({ itemId }))
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    return request(app.getHttpServer())
      .get(`/inventory-adjustments/${inventoryAdjustmentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);
  });

  it('/inventory-adjustments/:id (PUT)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.body.id;
    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...createInventoryAdjustment({ itemId }),
        publish: false,
      })
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    const editResponse = await request(app.getHttpServer())
      .put(`/inventory-adjustments/${inventoryAdjustmentId}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...createInventoryAdjustment({ itemId }),
        quantity: 5,
        cost: 100,
        publish: true,
      })
      .expect(200);

    expect(editResponse.body.quantity).toBeUndefined();
    expect(editResponse.body.entries[0].quantity).toBe(5);
    expect(editResponse.body.entries[0].cost).toBe(100);
  });

  it('/inventory-adjustments/:id/publish (PUT)', async () => {
    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send(makeItemRequest())
      .expect(201);

    const itemId = itemResponse.body.id;
    const inventoryAdjustmentResponse = await request(app.getHttpServer())
      .post('/inventory-adjustments/quick')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        ...createInventoryAdjustment({ itemId }),
        quantity: 10,
        cost: 50,
        publish: false,
      })
      .expect(201);

    const inventoryAdjustmentId = inventoryAdjustmentResponse.body.id;

    await request(app.getHttpServer())
      .put(`/inventory-adjustments/${inventoryAdjustmentId}/publish`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(200);

    // Publishing a draft increment adjustment should write the GL entries
    // once: debit inventory (1007) and credit adjustment (1001) by 500.
    const legs = await fetchLegs('InventoryAdjustment', inventoryAdjustmentId);
    const nonZeroLegs = legs.filter(
      (leg) => leg.debit.amount !== 0 || leg.credit.amount !== 0,
    );

    expect(nonZeroLegs).toHaveLength(2);
    expectBalanced(legs);
    expect(sumDebits(legs)).toBeCloseTo(500, 2);
    expect(sumCredits(legs)).toBeCloseTo(500, 2);
  });
});
