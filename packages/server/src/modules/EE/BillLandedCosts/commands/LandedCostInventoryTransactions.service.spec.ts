import { LandedCostInventoryTransactions } from './LandedCostInventoryTransactions.service';

describe('LandedCostInventoryTransactions', () => {
  let inventoryTransactionsService: {
    recordInventoryTransactions: jest.Mock;
    deleteInventoryTransactions: jest.Mock;
  };
  let service: LandedCostInventoryTransactions;

  beforeEach(() => {
    inventoryTransactionsService = {
      recordInventoryTransactions: jest.fn().mockResolvedValue(undefined),
      deleteInventoryTransactions: jest.fn().mockResolvedValue(undefined),
    };
    service = new LandedCostInventoryTransactions(
      inventoryTransactionsService as any,
    );
  });

  describe('recordInventoryTransactions', () => {
    it('records the inventory transactions of the allocated entries', async () => {
      const bill = {
        billDate: '2023-01-01',
        entries: [
          { id: 1, itemId: 10 },
          { id: 2, itemId: 11 },
        ],
      };
      const billLandedCost = {
        id: 99,
        allocateEntries: [{ entryId: 2, cost: 25, billLocatedCostId: 99 }],
      };
      const trx = { id: 'trx' };

      await service.recordInventoryTransactions(
        billLandedCost as any,
        bill as any,
        trx as any,
      );

      expect(
        inventoryTransactionsService.recordInventoryTransactions,
      ).toHaveBeenCalledWith(
        [
          {
            date: '2023-01-01',
            itemId: 11,
            direction: 'IN',
            quantity: null,
            rate: 25,
            transactionType: 'LandedCost',
            transactionId: 99,
            entryId: 2,
          },
        ],
        false,
        trx,
      );
    });
  });

  describe('removeInventoryTransactions', () => {
    it('deletes the landed cost inventory transactions', async () => {
      const trx = { id: 'trx' };

      await service.removeInventoryTransactions(99, trx as any);

      expect(
        inventoryTransactionsService.deleteInventoryTransactions,
      ).toHaveBeenCalledWith(99, 'LandedCost', trx);
    });
  });
});
