import { ExpenseLandedCost } from './ExpenseLandedCost.service';

describe('ExpenseLandedCost transformer', () => {
  let service: ExpenseLandedCost;

  beforeEach(() => {
    service = new ExpenseLandedCost();
  });

  describe('transformToLandedCost', () => {
    it('transforms the expense to a landed cost transaction', () => {
      const expense = {
        id: 1,
        landedCostAmount: 300,
        allocatedCostAmount: 100,
        unallocatedCostAmount: 200,
        currencyCode: 'USD',
        exchangeRate: 0,
        categories: [
          {
            id: 4,
            amount: 300,
            allocatedCostAmount: 100,
            unallocatedCostAmount: 200,
            description: 'Freight',
            expenseAccount: { id: 1020, name: 'Freight', code: '40003' },
          },
        ],
      };

      const transaction = service.transformToLandedCost(expense as any);

      expect(transaction).toMatchObject({
        id: 1,
        name: 'EXP-100',
        amount: 300,
        allocatedCostAmount: 100,
        unallocatedCostAmount: 200,
        transactionType: 'Expense',
        currencyCode: 'USD',
        exchangeRate: 1,
      });
      expect(transaction.entries).toEqual([
        {
          id: 4,
          name: 'Freight',
          code: '40003',
          amount: 300,
          allocatedCostAmount: 100,
          unallocatedCostAmount: 200,
          description: 'Freight',
          costAccountId: 1020,
        },
      ]);
    });

    it('omits the entries when the expense has no categories', () => {
      const expense = {
        id: 2,
        landedCostAmount: 0,
        allocatedCostAmount: 0,
        unallocatedCostAmount: 0,
        currencyCode: 'USD',
        categories: [],
      };

      expect(
        service.transformToLandedCost(expense as any).entries,
      ).toBeUndefined();
    });
  });

  describe('transformToLandedCostEntry', () => {
    it('transforms the expense category to a landed cost transaction entry', () => {
      const entry = {
        id: 4,
        amount: 300,
        allocatedCostAmount: 100,
        unallocatedCostAmount: 200,
        description: 'Freight',
        expenseAccount: { id: 1020, name: 'Freight', code: '40003' },
      };

      expect(service.transformToLandedCostEntry(entry as any)).toEqual({
        id: 4,
        name: 'Freight',
        code: '40003',
        amount: 300,
        allocatedCostAmount: 100,
        unallocatedCostAmount: 200,
        description: 'Freight',
        costAccountId: 1020,
      });
    });
  });
});
