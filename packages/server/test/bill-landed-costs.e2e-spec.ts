import request = require('supertest');
import { faker } from '@faker-js/faker';
import { app, AuthorizationHeader, orgainzationId } from './init-app-test';
import { expectLegs, fetchLegs } from './_utils/gl';

const authHeaders = () => ({
  'organization-id': orgainzationId,
  Authorization: AuthorizationHeader,
});

const enableFeature = (value: number) =>
  request(app.getHttpServer())
    .put('/settings')
    .set(authHeaders())
    .send({ options: [{ group: 'features', key: 'landed_cost', value }] });

const createItem = async (type: 'inventory' | 'service') => {
  const response = await request(app.getHttpServer())
    .post('/items')
    .set(authHeaders())
    .send({
      name: `${faker.commerce.productName()} ${Date.now()}-${faker.string.alphanumeric({ length: 4 })}`,
      type,
      sellable: true,
      purchasable: true,
      sellAccountId: 1026,
      costAccountId: 1019,
      ...(type === 'inventory' && { inventoryAccountId: 1007 }),
      costPrice: 100,
      sellPrice: 100,
    })
    .expect(201);

  return parseInt(response.body.id, 10);
};

const postBill = (itemId: number, entryOverrides: Record<string, any> = {}) =>
  request(app.getHttpServer())
    .post('/bills')
    .set(authHeaders())
    .send({
      vendorId,
      billDate: '2023-01-01',
      dueDate: '2023-02-01',
      billNumber: faker.string.alphanumeric(10),
      branchId: 1,
      warehouseId: 1,
      open: true,
      entries: [
        {
          index: 1,
          itemId,
          quantity: 2,
          rate: 1000,
          description: 'Item description...',
          ...entryOverrides,
        },
      ],
    });

const postExpense = (amount = 100) =>
  request(app.getHttpServer())
    .post('/expenses')
    .set(authHeaders())
    .send({
      exchangeRate: 1,
      description: 'Freight',
      paymentAccountId: 1000,
      referenceNo: faker.string.alphanumeric(10),
      publish: true,
      paymentDate: '2023-01-01',
      categories: [
        {
          index: 1,
          expenseAccountId: 1021,
          amount,
          description: 'Freight category',
          landedCost: true,
        },
      ],
      branchId: 1,
    });

const getBillEntryId = async (billId: number) => {
  const response = await request(app.getHttpServer())
    .get(`/bills/${billId}`)
    .set(authHeaders())
    .expect(200);

  return response.body.entries[0].id;
};

const getExpenseDetails = async (expenseId: number) => {
  const response = await request(app.getHttpServer())
    .get(`/expenses/${expenseId}`)
    .set(authHeaders())
    .expect(200);

  return response.body;
};

const allocateLandedCost = (
  targetBillId: number,
  transactionId: number,
  transactionType: 'Bill' | 'Expense',
  transactionEntryId: number,
  targetEntryId: number,
  cost: number,
) =>
  request(app.getHttpServer())
    .post(`/landed-cost/bills/${targetBillId}/allocate`)
    .set(authHeaders())
    .send({
      transactionId,
      transactionType,
      transactionEntryId,
      allocationMethod: 'value',
      description: 'Ocean freight',
      items: [{ entryId: targetEntryId, cost }],
    });

const deleteAllocatedLandedCost = (allocatedLandedCostId: number) =>
  request(app.getHttpServer())
    .delete(`/landed-cost/${allocatedLandedCostId}`)
    .set(authHeaders());

const createBillAllocatedFixture = async (cost = 100) => {
  const costBill = await postBill(inventoryItemId, { landedCost: true }).expect(
    201,
  );
  const targetBill = await postBill(inventoryItemId).expect(201);

  const allocated = await allocateLandedCost(
    targetBill.body.id,
    costBill.body.id,
    'Bill',
    await getBillEntryId(costBill.body.id),
    await getBillEntryId(targetBill.body.id),
    cost,
  ).expect(201);

  return {
    costBillId: costBill.body.id,
    targetBillId: targetBill.body.id,
    allocatedLandedCostId: allocated.body.id,
  };
};

let vendorId: number;
let inventoryItemId: number;
let serviceItemId: number;

describe('Bill Landed Costs (e2e)', () => {
  beforeAll(async () => {
    await enableFeature(1).expect(200);

    await request(app.getHttpServer())
      .put('/transactions-locking/cancel-lock')
      .set(authHeaders())
      .send({ reason: 'Cancel lock for e2e test' })
      .expect(200);

    const vendor = await request(app.getHttpServer())
      .post('/vendors')
      .set(authHeaders())
      .send({ displayName: 'Test Vendor' })
      .expect(201);
    vendorId = vendor.body.id;

    inventoryItemId = await createItem('inventory');
    serviceItemId = await createItem('service');
  });

  it('/landed-cost/transactions (GET) lists the unallocated expense landed costs', async () => {
    const expense = await postExpense(100).expect(201);

    const response = await request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .query({ transactionType: 'Expense' })
      .set(authHeaders())
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some((t) => t.id === expense.body.id)).toBe(true);
  });

  it('/landed-cost/bills/:billId/transactions (GET) returns an empty list without allocations', async () => {
    const bill = await postBill(inventoryItemId).expect(201);

    const response = await request(app.getHttpServer())
      .get(`/landed-cost/bills/${bill.body.id}/transactions`)
      .set(authHeaders())
      .expect(200);

    expect(response.body.data).toEqual([]);
  });

  it('/landed-cost/bills/:billId/allocate (POST) allocates a bill landed cost and posts the GL entries', async () => {
    const costBill = await postBill(inventoryItemId, {
      landedCost: true,
    }).expect(201);
    const targetBill = await postBill(inventoryItemId).expect(201);

    const allocated = await allocateLandedCost(
      targetBill.body.id,
      costBill.body.id,
      'Bill',
      await getBillEntryId(costBill.body.id),
      await getBillEntryId(targetBill.body.id),
      100,
    ).expect(201);
    expect(allocated.body.message).toBeDefined();

    const targetTransactions = await request(app.getHttpServer())
      .get(`/landed-cost/bills/${targetBill.body.id}/transactions`)
      .set(authHeaders())
      .expect(200);

    expect(targetTransactions.body.data).toHaveLength(1);
    expect(targetTransactions.body.data[0].amount).toBe(100);
    expect(targetTransactions.body.data[0].allocate_entries[0].cost).toBe(100);

    const legs = await fetchLegs('LandedCost', allocated.body.id);
    expectLegs(
      legs,
      [
        { accountCode: '10008', debit: 100 },
        { accountCode: '40002', credit: 100 },
      ],
      'LandedCost',
    );
  });

  it('/landed-cost/:allocatedLandedCostId (DELETE) reverts the bill allocation', async () => {
    const { targetBillId, allocatedLandedCostId } =
      await createBillAllocatedFixture();

    await deleteAllocatedLandedCost(allocatedLandedCostId).expect(200);

    const targetTransactions = await request(app.getHttpServer())
      .get(`/landed-cost/bills/${targetBillId}/transactions`)
      .set(authHeaders())
      .expect(200);
    expect(targetTransactions.body.data).toEqual([]);

    await request(app.getHttpServer())
      .delete(`/bills/${targetBillId}`)
      .set(authHeaders())
      .expect(200);
  });

  it('rejects deleting a bill that has allocated landed costs', async () => {
    const { targetBillId } = await createBillAllocatedFixture();

    await request(app.getHttpServer())
      .delete(`/bills/${targetBillId}`)
      .set(authHeaders())
      .expect(400);
  });

  it('allocates an expense landed cost and reverts the expense allocated amount', async () => {
    const expense = await postExpense(100).expect(201);
    const expenseDetails = await getExpenseDetails(expense.body.id);
    const targetBill = await postBill(inventoryItemId).expect(201);

    const allocated = await allocateLandedCost(
      targetBill.body.id,
      expense.body.id,
      'Expense',
      expenseDetails.categories[0].id,
      await getBillEntryId(targetBill.body.id),
      100,
    ).expect(201);

    const expenseAfterAllocation = await getExpenseDetails(expense.body.id);
    expect(Number(expenseAfterAllocation.allocated_cost_amount)).toBe(100);

    await deleteAllocatedLandedCost(allocated.body.id).expect(200);

    const expenseAfterRevert = await getExpenseDetails(expense.body.id);
    expect(Number(expenseAfterRevert.allocated_cost_amount)).toBe(0);
  });

  it('rejects allocating more than the unallocated cost amount', async () => {
    const costBill = await postBill(inventoryItemId, {
      landedCost: true,
    }).expect(201);
    const targetBill = await postBill(inventoryItemId).expect(201);

    await allocateLandedCost(
      targetBill.body.id,
      costBill.body.id,
      'Bill',
      await getBillEntryId(costBill.body.id),
      await getBillEntryId(targetBill.body.id),
      5000,
    ).expect(400);
  });

  it('rejects creating a bill with a landed cost entry on a non-inventory item', async () => {
    await postBill(serviceItemId, { landedCost: true }).expect(400);
  });

  it('should reject the landed cost endpoints when the feature is disabled', async () => {
    await enableFeature(0).expect(200);

    return request(app.getHttpServer())
      .get('/landed-cost/transactions')
      .query({ transactionType: 'Expense' })
      .set(authHeaders())
      .expect(400);
  });
});
