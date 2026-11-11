import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';

const ITEM_INVENTORY_ACCOUNT_ID = 1007;
const ADJUSTMENT_ACCOUNT_ID = 1001;

const uniqueItemName = () =>
  `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`;

const uniqueCategoryName = () =>
  `${faker.person.fullName()} ${faker.string.alphanumeric(8)}`;

const createInventoryItem = (payload: Record<string, unknown> = {}) =>
  request(app.getHttpServer())
    .post('/items')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      name: uniqueItemName(),
      type: 'inventory',
      unit: 'piece',
      inventory_account_id: ITEM_INVENTORY_ACCOUNT_ID,
      ...payload,
    });

const getItem = (itemId: number) =>
  request(app.getHttpServer())
    .get(`/items/${itemId}`)
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader);

const editItem = (itemId: number, payload: Record<string, unknown>) =>
  request(app.getHttpServer())
    .put(`/items/${itemId}`)
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send(payload);

const createInventoryAdjustment = (itemId: number) =>
  request(app.getHttpServer())
    .post('/inventory-adjustments/quick')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      date: '2020-01-01',
      type: 'increment',
      adjustmentAccountId: ADJUSTMENT_ACCOUNT_ID,
      reason: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      referenceNo: faker.string.alphanumeric(10),
      itemId,
      quantity: 10,
      cost: 100,
      publish: true,
      warehouseId: 1,
      branchId: 1,
    });

const editItemCostMethod = (itemId: number, costMethod: string | null) =>
  editItem(itemId, {
    name: uniqueItemName(),
    type: 'inventory',
    unit: 'piece',
    inventory_account_id: ITEM_INVENTORY_ACCOUNT_ID,
    cost_method: costMethod,
  });

describe('Item cost method (e2e)', () => {
  it('creates an inventory item with an explicit cost method', async () => {
    const response = await createInventoryItem({ cost_method: 'FIFO' }).expect(
      201,
    );

    const itemResponse = await getItem(response.body.id).expect(200);

    expect(itemResponse.body.cost_method).toBe('FIFO');
    expect(itemResponse.body.cost_method_locked_at).toBeNull();
  });

  it('allows changing the cost method before the first inventory transaction', async () => {
    const response = await createInventoryItem({ cost_method: 'FIFO' }).expect(
      201,
    );

    await editItemCostMethod(response.body.id, 'LIFO').expect(200);

    const itemResponse = await getItem(response.body.id).expect(200);
    expect(itemResponse.body.cost_method).toBe('LIFO');
    expect(itemResponse.body.cost_method_locked_at).toBeNull();

    // Clearing the override falls back to the category/global method.
    await editItemCostMethod(response.body.id, null).expect(200);

    const clearedItemResponse = await getItem(response.body.id).expect(200);
    expect(clearedItemResponse.body.cost_method).toBeNull();
  });

  it('locks the cost method on the first inventory transaction', async () => {
    const response = await createInventoryItem({ cost_method: 'FIFO' }).expect(
      201,
    );
    const itemId = response.body.id;

    await createInventoryAdjustment(itemId).expect(201);

    const itemResponse = await getItem(itemId).expect(200);
    expect(itemResponse.body.cost_method).toBe('FIFO');
    expect(itemResponse.body.cost_method_locked_at).toBeTruthy();

    // Changing the cost method is rejected after the item is locked.
    const editResponse = await editItemCostMethod(itemId, 'LIFO').expect(400);
    expect(editResponse.body.errors?.[0]?.type).toBe(
      'ITEM_COST_METHOD_CANNOT_MODIFIED',
    );

    // Sending the same cost method is still allowed.
    await editItemCostMethod(itemId, 'FIFO').expect(200);

    // A second inventory transaction must not overwrite the frozen method.
    await createInventoryAdjustment(itemId).expect(201);
    const afterSecondTransaction = await getItem(itemId).expect(200);
    expect(afterSecondTransaction.body.cost_method).toBe('FIFO');
  });

  it('inherits and freezes the category cost method', async () => {
    const categoryResponse = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: uniqueCategoryName(),
        description: faker.lorem.sentence(),
        costMethod: 'FIFO',
      })
      .expect(201);

    const itemResponse = await createInventoryItem({
      category_id: categoryResponse.body.id,
    }).expect(201);
    const itemId = itemResponse.body.id;

    const beforeTransaction = await getItem(itemId).expect(200);
    expect(beforeTransaction.body.cost_method).toBeNull();

    await createInventoryAdjustment(itemId).expect(201);

    const afterTransaction = await getItem(itemId).expect(200);
    expect(afterTransaction.body.cost_method).toBe('FIFO');
    expect(afterTransaction.body.cost_method_locked_at).toBeTruthy();

    // Changing the category cost method afterwards must not affect the
    // already-frozen item.
    await request(app.getHttpServer())
      .put(`/item-categories/${categoryResponse.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: categoryResponse.body.name,
        description: categoryResponse.body.description,
        costMethod: 'LIFO',
      })
      .expect(200);

    const afterCategoryChange = await getItem(itemId).expect(200);
    expect(afterCategoryChange.body.cost_method).toBe('FIFO');
  });

  it('uses the default cost method preference for inherited items', async () => {
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [
          {
            group: 'items',
            key: 'default_cost_method',
            value: 'LIFO',
          },
        ],
      })
      .expect(200);

    const categoryResponse = await request(app.getHttpServer())
      .post('/item-categories')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        name: uniqueCategoryName(),
        description: faker.lorem.sentence(),
      })
      .expect(201);

    const itemResponse = await createInventoryItem({
      category_id: categoryResponse.body.id,
    }).expect(201);
    const itemId = itemResponse.body.id;

    await createInventoryAdjustment(itemId).expect(201);

    const item = await getItem(itemId).expect(200);
    expect(item.body.cost_method).toBe('LIFO');

    // Reset the preference so other tests are not affected.
    await request(app.getHttpServer())
      .put('/settings')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({
        options: [
          {
            group: 'items',
            key: 'default_cost_method',
            value: 'AVG',
          },
        ],
      })
      .expect(200);
  });
});
