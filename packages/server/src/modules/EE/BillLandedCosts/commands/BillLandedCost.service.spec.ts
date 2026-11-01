import { BillLandedCost } from './BillLandedCost.service';

describe('BillLandedCost transformer', () => {
  let service: BillLandedCost;

  beforeEach(() => {
    service = new BillLandedCost();
  });

  describe('transformToLandedCost', () => {
    it('transforms the bill to a landed cost transaction', () => {
      const bill = {
        id: 1,
        billNumber: 'B-100',
        referenceNo: 'REF-1',
        currencyCode: 'USD',
        exchangeRate: 2,
        landedCostAmount: 200,
        allocatedCostAmount: 50,
        unallocatedCostAmount: 150,
        entries: [
          {
            id: 5,
            amount: 1000,
            allocatedCostAmount: 50,
            unallocatedCostAmount: 950,
            description: 'Item',
            item: { name: 'Item A', code: 'IT-1', costAccountId: 1019 },
          },
        ],
      };

      const transaction = service.transformToLandedCost(bill as any);

      expect(transaction).toMatchObject({
        id: 1,
        name: 'B-100',
        amount: 200,
        allocatedCostAmount: 50,
        unallocatedCostAmount: 150,
        transactionType: 'Bill',
        currencyCode: 'USD',
        exchangeRate: 2,
      });
      expect(transaction.entries).toEqual([
        {
          id: 5,
          name: 'Item A',
          code: 'IT-1',
          amount: 1000,
          allocatedCostAmount: 50,
          unallocatedCostAmount: 950,
          description: 'Item',
          costAccountId: 1019,
        },
      ]);
    });

    it('falls back to the reference number when the bill number is missing', () => {
      const bill = {
        id: 2,
        billNumber: null,
        referenceNo: 'REF-2',
        entries: [],
      };

      expect(service.transformToLandedCost(bill as any).name).toBe('REF-2');
    });

    it('omits the entries when the bill has no entries', () => {
      const bill = {
        id: 3,
        billNumber: 'B-101',
        entries: [],
      };

      expect(
        service.transformToLandedCost(bill as any).entries,
      ).toBeUndefined();
    });
  });

  describe('transformToLandedCostEntry', () => {
    it('transforms the bill entry with the item cost account fallback', () => {
      const entry = {
        id: 5,
        amount: 1000,
        allocatedCostAmount: 50,
        unallocatedCostAmount: 950,
        description: 'Item',
        item: { name: 'Item A', code: 'IT-1', costAccountId: 1019 },
      };

      expect(service.transformToLandedCostEntry(entry as any)).toEqual({
        id: 5,
        name: 'Item A',
        code: 'IT-1',
        amount: 1000,
        allocatedCostAmount: 50,
        unallocatedCostAmount: 950,
        description: 'Item',
        costAccountId: 1019,
      });
    });

    it('prefers the entry cost account over the item cost account', () => {
      const entry = {
        id: 6,
        amount: 500,
        costAccountId: 200,
        item: { name: 'Item B', code: 'IT-2', costAccountId: 1019 },
      };

      expect(
        service.transformToLandedCostEntry(entry as any).costAccountId,
      ).toBe(200);
    });
  });
});
