import {
  InventoryFifoCostMethod,
  InventoryLifoCostMethod,
} from './InventoryLayerCostMethod';
import {
  compareInventoryTransactionsForCostReplay,
  sortInventoryTransactionsForCostReplay,
} from '../InventoryCostTransactionOrder';

const makeTx = (overrides: Partial<any>): any => ({
  id: overrides.id ?? 1,
  date: '2024-01-01',
  direction: 'IN',
  itemId: 1,
  quantity: 10,
  rate: 5,
  entryId: 1,
  transactionId: 1,
  transactionType: 'Bill',
  createdAt: '2024-01-01',
  costAccountId: 1,
  ...overrides,
});

describe('InventoryFifoCostMethod', () => {
  const fifo = new InventoryFifoCostMethod();

  it('costs OUT from oldest IN layer', () => {
    const lots = fifo.trackingCostTransactions([
      makeTx({ id: 1, direction: 'IN', quantity: 10, rate: 5 }),
      makeTx({
        id: 2,
        direction: 'IN',
        quantity: 10,
        rate: 8,
        date: '2024-01-02',
      }),
      makeTx({
        id: 3,
        direction: 'OUT',
        quantity: 12,
        rate: 20,
        date: '2024-01-03',
        transactionType: 'SaleInvoice',
      }),
    ]);

    const outs = lots.filter((l) => l.direction === 'OUT');
    expect(outs).toHaveLength(1);
    // 10@5 + 2@8 = 50 + 16 = 66
    expect(outs[0].cost).toBe(66);
    expect(outs[0].quantity).toBe(12);
  });

  it('oversell remainder has cost 0', () => {
    const lots = fifo.trackingCostTransactions([
      makeTx({ id: 1, direction: 'IN', quantity: 5, rate: 10 }),
      makeTx({
        id: 2,
        direction: 'OUT',
        quantity: 8,
        rate: 20,
        transactionType: 'SaleInvoice',
      }),
    ]);

    const outs = lots.filter((l) => l.direction === 'OUT');
    expect(outs).toHaveLength(2);
    expect(outs[0].cost).toBe(50);
    expect(outs[0].quantity).toBe(5);
    expect(outs[1].cost).toBe(0);
    expect(outs[1].quantity).toBe(3);
  });

  it('builds opening layers and continues', () => {
    const opening = fifo.buildOpeningLayers([
      makeTx({ id: 1, direction: 'IN', quantity: 10, rate: 4 }),
      makeTx({
        id: 2,
        direction: 'OUT',
        quantity: 3,
        transactionType: 'SaleInvoice',
      }),
    ]);
    expect(opening).toEqual([{ rate: 4, remaining: 7 }]);

    const lots = fifo.trackingCostTransactions(
      [
        makeTx({
          id: 3,
          direction: 'OUT',
          quantity: 7,
          date: '2024-02-01',
          transactionType: 'SaleInvoice',
        }),
      ],
      opening,
    );
    expect(lots[0].cost).toBe(28);
  });

  it('allocates landed cost onto open layers', () => {
    const lots = fifo.trackingCostTransactions([
      makeTx({ id: 1, direction: 'IN', quantity: 10, rate: 10 }),
      makeTx({
        id: 2,
        direction: 'IN',
        quantity: 0,
        rate: 20,
        transactionType: 'LandedCost',
      }),
      makeTx({
        id: 3,
        direction: 'OUT',
        quantity: 10,
        transactionType: 'SaleInvoice',
      }),
    ]);
    const outs = lots.filter((l) => l.direction === 'OUT');
    // Layer became 10 units with cost 100+20=120 → rate 12 → OUT cost 120
    expect(outs[0].cost).toBe(120);
  });

  it('costs same-day sales from opening adjustment before bill', () => {
    const sameDay = '2024-04-01';
    const billIn = makeTx({
      id: 1,
      transactionType: 'Bill',
      quantity: 200,
      rate: 60,
      date: sameDay,
      createdAt: '2024-04-01T09:00:00',
    });
    const openingAdj = makeTx({
      id: 2,
      transactionType: 'InventoryAdjustment',
      quantity: 100,
      rate: 50,
      date: sameDay,
      createdAt: '2024-04-01T10:00:00',
    });
    const saleOut = makeTx({
      id: 3,
      direction: 'OUT',
      quantity: 100,
      rate: 120,
      date: sameDay,
      createdAt: '2024-04-01T11:00:00',
      transactionType: 'SaleInvoice',
    });

    const storedOrder = [billIn, openingAdj, saleOut];
    const replayOrder = sortInventoryTransactionsForCostReplay(storedOrder);

    expect(replayOrder.map((tx) => tx.transactionType)).toEqual([
      'InventoryAdjustment',
      'Bill',
      'SaleInvoice',
    ]);

    const wrongOut = fifo
      .trackingCostTransactions(storedOrder)
      .find((lot) => lot.direction === 'OUT');
    const correctOut = fifo
      .trackingCostTransactions(replayOrder)
      .find((lot) => lot.direction === 'OUT');

    expect(wrongOut?.cost).toBe(6000);
    expect(correctOut?.cost).toBe(5000);
  });
});

describe('Inventory cost transaction ordering', () => {
  it('sorts adjustment before bill on the same day', () => {
    const bill = makeTx({
      id: 1,
      transactionType: 'Bill',
      createdAt: '2024-04-01T08:00:00',
    });
    const adjustment = makeTx({
      id: 2,
      transactionType: 'InventoryAdjustment',
      createdAt: '2024-04-01T09:00:00',
    });

    expect(
      compareInventoryTransactionsForCostReplay(adjustment, bill),
    ).toBeLessThan(0);
  });
});

describe('InventoryLifoCostMethod', () => {
  const lifo = new InventoryLifoCostMethod();
  const fifo = new InventoryFifoCostMethod();

  it('costs OUT from newest IN layer', () => {
    const txs = [
      makeTx({ id: 1, direction: 'IN', quantity: 10, rate: 5 }),
      makeTx({
        id: 2,
        direction: 'IN',
        quantity: 10,
        rate: 8,
        date: '2024-01-02',
      }),
      makeTx({
        id: 3,
        direction: 'OUT',
        quantity: 12,
        rate: 20,
        date: '2024-01-03',
        transactionType: 'SaleInvoice',
      }),
    ];

    const lifoOut = lifo
      .trackingCostTransactions(txs)
      .filter((l) => l.direction === 'OUT')[0];
    const fifoOut = fifo
      .trackingCostTransactions(txs)
      .filter((l) => l.direction === 'OUT')[0];

    // LIFO: 10@8 + 2@5 = 80 + 10 = 90
    expect(lifoOut.cost).toBe(90);
    expect(fifoOut.cost).toBe(66);
    expect(lifoOut.cost).not.toBe(fifoOut.cost);
  });
});
