import { InventoryTransaction } from '../models/InventoryTransaction';
import {
  InventoryFIFOCostMethod,
  InventoryLIFOCostMethod,
} from './InventoryLotCostMethod';

const makeTransaction = (
  overrides: Partial<InventoryTransaction> = {},
): InventoryTransaction =>
  ({
    id: 1,
    date: '2026-01-01',
    direction: 'IN',
    itemId: 1,
    quantity: 10,
    rate: 10,
    transactionType: 'SaleInvoice',
    transactionId: 1,
    entryId: 1,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    ...overrides,
  }) as InventoryTransaction;

describe('InventoryLotCostMethod', () => {
  const incomingTransactions = (): InventoryTransaction[] => [
    makeTransaction({
      id: 1,
      date: '2026-01-01',
      quantity: 10,
      rate: 10,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    }),
    makeTransaction({
      id: 2,
      date: '2026-01-02',
      quantity: 10,
      rate: 20,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
    }),
  ];

  it('should consume the oldest lots with FIFO', () => {
    const outTransaction = makeTransaction({
      id: 3,
      date: '2026-01-03',
      direction: 'OUT',
      quantity: 15,
      rate: 30,
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
    });
    const costMethod = new InventoryFIFOCostMethod();

    const costTransactions = costMethod.trackingCostTransactions([
      ...incomingTransactions(),
      outTransaction,
    ]);

    expect(costTransactions).toHaveLength(3);
    expect(costTransactions[2]).toMatchObject({
      quantity: 15,
      cost: 200,
      direction: 'OUT',
    });
  });

  it('should consume the newest lots with LIFO', () => {
    const outTransaction = makeTransaction({
      id: 3,
      date: '2026-01-03',
      direction: 'OUT',
      quantity: 15,
      rate: 30,
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
    });
    const costMethod = new InventoryLIFOCostMethod();

    const costTransactions = costMethod.trackingCostTransactions([
      ...incomingTransactions(),
      outTransaction,
    ]);

    expect(costTransactions).toHaveLength(3);
    expect(costTransactions[2]).toMatchObject({
      quantity: 15,
      cost: 250,
      direction: 'OUT',
    });
  });

  it('should split the out transaction into a costed and a zero-cost row when stock is insufficient', () => {
    const transactions = [
      makeTransaction({ id: 1, quantity: 5, rate: 10 }),
      makeTransaction({
        id: 2,
        date: '2026-01-02',
        direction: 'OUT',
        quantity: 8,
        rate: 30,
      }),
    ];
    const costMethod = new InventoryFIFOCostMethod();

    const costTransactions = costMethod.trackingCostTransactions(transactions);

    expect(costTransactions).toHaveLength(3);
    expect(costTransactions[1]).toMatchObject({
      quantity: 5,
      cost: 50,
      direction: 'OUT',
    });
    expect(costTransactions[2]).toMatchObject({
      quantity: 3,
      cost: 0,
      direction: 'OUT',
    });
  });

  it('should support decimal quantities', () => {
    const transactions = [
      makeTransaction({ id: 1, quantity: 1.5, rate: 10 }),
      makeTransaction({
        id: 2,
        date: '2026-01-02',
        quantity: 1.5,
        rate: 20,
      }),
      makeTransaction({
        id: 3,
        date: '2026-01-03',
        direction: 'OUT',
        quantity: 2,
        rate: 30,
      }),
    ];
    const fifoCostMethod = new InventoryFIFOCostMethod();
    const lifoCostMethod = new InventoryLIFOCostMethod();

    const fifoCostTransactions =
      fifoCostMethod.trackingCostTransactions(transactions);
    const lifoCostTransactions =
      lifoCostMethod.trackingCostTransactions(transactions);

    expect(fifoCostTransactions[2]).toMatchObject({ quantity: 2, cost: 25 });
    expect(lifoCostTransactions[2]).toMatchObject({ quantity: 2, cost: 35 });
  });

  it('should reconstruct the remaining FIFO lots before the starting date', () => {
    const costMethod = new InventoryFIFOCostMethod();

    const remainingLots = costMethod.getRemainingLots([
      ...incomingTransactions(),
      makeTransaction({
        id: 3,
        date: '2026-01-03',
        direction: 'OUT',
        quantity: 5,
        rate: 30,
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
    ]);

    expect(remainingLots).toEqual([
      expect.objectContaining({ quantity: 5, rate: 10 }),
      expect.objectContaining({ quantity: 10, rate: 20 }),
    ]);
  });

  it('should reconstruct the remaining LIFO lots before the starting date', () => {
    const costMethod = new InventoryLIFOCostMethod();

    const remainingLots = costMethod.getRemainingLots([
      ...incomingTransactions(),
      makeTransaction({
        id: 3,
        date: '2026-01-03',
        direction: 'OUT',
        quantity: 5,
        rate: 30,
        createdAt: new Date('2026-01-03T00:00:00.000Z'),
      }),
    ]);

    expect(remainingLots).toEqual([
      expect.objectContaining({ quantity: 10, rate: 10 }),
      expect.objectContaining({ quantity: 5, rate: 20 }),
    ]);
  });

  it('should continue consuming the reconstructed lots from the starting date', () => {
    const fifoCostMethod = new InventoryFIFOCostMethod();
    const openingLots = fifoCostMethod.getRemainingLots([
      ...incomingTransactions(),
      makeTransaction({
        id: 3,
        date: '2026-01-03',
        direction: 'OUT',
        quantity: 5,
        rate: 30,
      }),
    ]);
    const costTransactions = fifoCostMethod.trackingCostTransactions(
      [
        makeTransaction({
          id: 4,
          date: '2026-01-04',
          direction: 'OUT',
          quantity: 5,
          rate: 30,
        }),
      ],
      openingLots,
    );

    expect(costTransactions).toHaveLength(1);
    expect(costTransactions[0]).toMatchObject({ quantity: 5, cost: 50 });
  });
});
