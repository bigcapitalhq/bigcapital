import { LandedCostTranasctions } from './LandedCostTransactions.service';

describe('LandedCostTranasctions', () => {
  let transactionLandedCost: {
    getModel: jest.Mock;
    transformToLandedCost: jest.Mock;
  };
  let service: LandedCostTranasctions;

  const buildTransaction = (overrides: Record<string, any> = {}) =>
    ({
      id: 1,
      name: 'B-100',
      amount: 100,
      allocatedCostAmount: 40,
      unallocatedCostAmount: 60,
      currencyCode: 'USD',
      exchangeRate: 1,
      transactionType: 'Bill',
      entries: [
        {
          id: 1,
          name: 'Item A',
          code: 'IT-1',
          amount: 100,
          allocatedCostAmount: 40,
          unallocatedCostAmount: 60,
          description: 'Item description',
          costAccountId: 1019,
        },
      ],
      ...overrides,
    }) as any;

  beforeEach(() => {
    transactionLandedCost = {
      getModel: jest.fn(),
      transformToLandedCost: jest.fn((_type, transaction) => transaction),
    };
    service = new LandedCostTranasctions(transactionLandedCost as any);
  });

  describe('transformLandedCostTransaction', () => {
    it('formats the transaction and entry amounts', () => {
      const transaction =
        service.transformLandedCostTransaction(buildTransaction());

      expect(transaction.formattedAmount).toBe('$100.00');
      expect(transaction.formattedUnallocatedCostAmount).toBe('$60.00');
      expect(transaction.formattedAllocatedCostAmount).toBe('$40.00');

      const entry = transaction.entries[0] as any;
      expect(entry.formattedAmount).toBe('$100.00');
      expect(entry.formattedUnallocatedCostAmount).toBe('$60.00');
      expect(entry.formattedAllocatedCostAmount).toBe('$40.00');
    });

    it('keeps the entries empty when the transaction has no entries', () => {
      const transaction = service.transformLandedCostTransaction(
        buildTransaction({ entries: undefined }),
      );

      expect(transaction.entries).toEqual([]);
    });
  });

  describe('transformLandedCostTransactions', () => {
    it('maps each transaction to the formatted shape', () => {
      const transactions = service.transformLandedCostTransactions([
        buildTransaction(),
      ]);

      expect(transactions).toHaveLength(1);
      expect((transactions[0] as any).formattedAmount).toBe('$100.00');
    });
  });

  describe('getLandedCostTransactions', () => {
    it('queries the model by the allocated and landed cost amounts', async () => {
      const builder = { where: jest.fn(), withGraphFetched: jest.fn() };
      const transactions = [buildTransaction()];
      const onBuild = jest.fn((callback) => {
        callback(builder);
        return Promise.resolve(transactions);
      });
      const query = jest.fn(() => ({ onBuild }));
      const Model = jest.fn(() => ({ query }));
      transactionLandedCost.getModel.mockResolvedValue(Model);

      const result = await service.getLandedCostTransactions({
        transactionType: 'Bill',
      } as any);

      expect(transactionLandedCost.getModel).toHaveBeenCalledWith('Bill');
      expect(builder.where).toHaveBeenCalledWith(
        'allocated_cost_amount',
        '<',
        expect.anything(),
      );
      expect(builder.withGraphFetched).toHaveBeenCalledWith('entries.item');
      expect((result[0] as any).formattedAmount).toBe('$100.00');
    });

    it('fetches the expense categories for expense transactions', async () => {
      const builder = { where: jest.fn(), withGraphFetched: jest.fn() };
      const onBuild = jest.fn((callback) => {
        callback(builder);
        return Promise.resolve([]);
      });
      const query = jest.fn(() => ({ onBuild }));
      const Model = jest.fn(() => ({ query }));
      transactionLandedCost.getModel.mockResolvedValue(Model);

      await service.getLandedCostTransactions({
        transactionType: 'Expense',
      } as any);

      expect(builder.withGraphFetched).toHaveBeenCalledWith(
        'categories.expenseAccount',
      );
    });
  });
});
