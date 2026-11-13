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
      sellable: true,
      purchasable: true,
      inventory_account_id: 1007,
      sellAccountId: 1026,
      costAccountId: 1019,
      costPrice: 100,
      sellPrice: 100,
    })
    .expect(201);

  return response.body.id;
};

const createCustomer = async () => {
  const response = await request(app.getHttpServer())
    .post('/customers')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      displayName: `Test Customer ${faker.string.uuid()}`,
      customerType: 'business',
      currencyCode: 'USD',
    })
    .expect(201);

  return response.body.id;
};

const createVendor = async () => {
  const response = await request(app.getHttpServer())
    .post('/vendors')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({ displayName: `Test Vendor ${faker.string.uuid()}` })
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

const createSaleInvoice = ({
  itemId,
  customerId,
  quantity,
}: {
  itemId: number;
  customerId: number;
  quantity: number;
}) => {
  return request(app.getHttpServer())
    .post('/sale-invoices')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      customerId,
      invoiceDate: '2020-01-01',
      dueDate: '2020-02-01',
      invoiceNo: faker.string.uuid(),
      delivered: true,
      branchId: 1,
      warehouseId: 1,
      entries: [
        {
          index: 1,
          itemId,
          quantity,
          rate: 100,
          description: 'Item description...',
        },
      ],
    });
};

const createSaleReceipt = ({
  itemId,
  customerId,
  quantity,
}: {
  itemId: number;
  customerId: number;
  quantity: number;
}) => {
  return request(app.getHttpServer())
    .post('/sale-receipts')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      customerId,
      depositAccountId: 1000,
      receiptDate: '2020-01-01',
      referenceNo: faker.string.alphanumeric(10),
      receiptNumber: faker.string.uuid(),
      branchId: 1,
      warehouseId: 1,
      closed: true,
      entries: [
        {
          index: 1,
          itemId,
          quantity,
          rate: 100,
          description: 'Item description...',
        },
      ],
    });
};

const createOpenBill = ({
  itemId,
  vendorId,
  quantity,
}: {
  itemId: number;
  vendorId: number;
  quantity: number;
}) => {
  return request(app.getHttpServer())
    .post('/bills')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      vendorId,
      billDate: '2020-01-01',
      dueDate: '2020-02-01',
      billNumber: faker.string.alphanumeric(10),
      referenceNo: faker.string.alphanumeric(10),
      branchId: 1,
      warehouseId: 1,
      open: true,
      entries: [
        {
          index: 1,
          itemId,
          quantity,
          rate: 100,
          description: 'Item description...',
        },
      ],
    });
};

const createOpenVendorCredit = ({
  itemId,
  vendorId,
  quantity,
}: {
  itemId: number;
  vendorId: number;
  quantity: number;
}) => {
  return request(app.getHttpServer())
    .post('/vendor-credits')
    .set('organization-id', orgainzationId)
    .set('Authorization', AuthorizationHeader)
    .send({
      vendorId,
      vendorCreditNumber: faker.string.uuid(),
      vendorCreditDate: '2020-01-01',
      branchId: 1,
      warehouseId: 1,
      open: true,
      entries: [
        {
          index: 1,
          itemId,
          quantity,
          rate: 100,
          description: 'Item description...',
        },
      ],
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

const expectInsufficientStockError = (response: request.Response) => {
  expect(response.body.errors?.[0]?.type).toBe(
    'INVENTORY_ITEM_INSUFFICIENT_STOCK',
  );
};

describe('Inventory negative stock (e2e)', () => {
  beforeAll(async () => {
    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .send({ reason: 'Cancel lock for e2e test' });

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

    expectInsufficientStockError(response);

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

  it('blocks a delivered sale invoice that would make stock negative', async () => {
    const itemId = await createInventoryItem();
    const customerId = await createCustomer();

    await createQuickAdjustment({
      itemId,
      type: 'increment',
      quantity: 5,
    }).expect(201);

    const response = await createSaleInvoice({
      itemId,
      customerId,
      quantity: 6,
    }).expect(400);

    expectInsufficientStockError(response);

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(5);
  });

  it('blocks a closed sale receipt that would make stock negative', async () => {
    const itemId = await createInventoryItem();
    const customerId = await createCustomer();

    await createQuickAdjustment({
      itemId,
      type: 'increment',
      quantity: 5,
    }).expect(201);

    const response = await createSaleReceipt({
      itemId,
      customerId,
      quantity: 6,
    }).expect(400);

    expectInsufficientStockError(response);

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(5);
  });

  it('blocks an open vendor credit that would make stock negative', async () => {
    const itemId = await createInventoryItem();
    const vendorId = await createVendor();

    await createQuickAdjustment({
      itemId,
      type: 'increment',
      quantity: 5,
    }).expect(201);

    const response = await createOpenVendorCredit({
      itemId,
      vendorId,
      quantity: 6,
    }).expect(400);

    expectInsufficientStockError(response);

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(5);
  });

  it('blocks deleting an open bill when its stock was consumed', async () => {
    const itemId = await createInventoryItem();
    const vendorId = await createVendor();
    const customerId = await createCustomer();

    const bill = await createOpenBill({
      itemId,
      vendorId,
      quantity: 5,
    }).expect(201);

    await createSaleInvoice({
      itemId,
      customerId,
      quantity: 5,
    }).expect(201);

    const response = await request(app.getHttpServer())
      .delete(`/bills/${bill.body.id}`)
      .set('organization-id', orgainzationId)
      .set('Authorization', AuthorizationHeader)
      .expect(400);

    expectInsufficientStockError(response);

    const item = await getItem(itemId);
    expect(Number(item.quantity_on_hand)).toBe(0);
  });
});
