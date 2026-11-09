import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const PREVENT_STOCK_BELOW_ZERO_SETTING = {
  group: 'items',
  key: 'prevent_stock_from_going_below_zero',
};

const savePreventStockSetting = (value: boolean) => {
  return request(app.getHttpServer())
    .put('/settings')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      options: [{ ...PREVENT_STOCK_BELOW_ZERO_SETTING, value }],
    })
    .expect(200);
};

const createInventoryItem = async () => {
  const response = await request(app.getHttpServer())
    .post('/items')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      name: `${faker.commerce.productName()} ${faker.string.uuid()}`,
      type: 'inventory',
      inventory_account_id: 1007,
    })
    .expect(201);

  return response.body.id;
};

const createQuickAdjustment = ({
  itemId,
  type,
  quantity,
}: {
  itemId: number;
  type: 'increment' | 'decrement';
  quantity: number;
}) => {
  return request(app.getHttpServer())
    .post('/inventory-adjustments/quick')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      date: '2020-01-01',
      type,
      adjustmentAccountId: 1001,
      reason: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      referenceNo: faker.string.alphanumeric(10),
      itemId,
      quantity,
      cost: 100,
      publish: true,
      warehouseId: 1,
      branchId: 1,
    });
};

const getItem = async (itemId: number) => {
  const response = await request(app.getHttpServer())
    .get(`/items/${itemId}`)
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .expect(200);

  return response.body;
};

describe('Inventory negative stock (e2e)', () => {
  beforeAll(async () => {
    await savePreventStockSetting(true);
  });

  afterAll(async () => {
    await savePreventStockSetting(false);
  });

  it('blocks a transaction that would make stock negative', async () => {
    const itemId = await createInventoryItem();

    await createQuickAdjustment({
      itemId,
      type: 'increment',
      quantity: 5,
    }).expect(201);

    const response = await createQuickAdjustment({
      itemId,
      type: 'decrement',
      quantity: 6,
    }).expect(400);

    expect(response.body.errors?.[0]?.type).toBe(
      'INVENTORY_ITEM_INSUFFICIENT_STOCK',
    );

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(5);
  });

  it('allows a transaction within the available stock', async () => {
    const itemId = await createInventoryItem();

    await createQuickAdjustment({
      itemId,
      type: 'increment',
      quantity: 5,
    }).expect(201);

    await createQuickAdjustment({
      itemId,
      type: 'decrement',
      quantity: 5,
    }).expect(201);

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(0);
  });
});
