import { BatchesBalanceService } from './BatchesBalance.service';
import { BatchStatus } from './types/Batches.types';

describe('BatchesBalanceService', () => {
  const inventoryTransactionModel = jest.fn();
  let service: BatchesBalanceService;

  beforeEach(() => {
    service = new BatchesBalanceService(inventoryTransactionModel as any);
  });

  describe('attachBalance', () => {
    it('uses the stored quantity on hand and computes the status', async () => {
      const [batch] = await service.attachBalance([
        {
          id: 1,
          quantityOnHand: '7.500',
          expiryDate: null,
        },
      ] as any);

      expect(batch.quantityOnHand).toBe(7.5);
      expect(batch.status).toBe(BatchStatus.Active);
    });

    it('marks batches without stock as depleted', async () => {
      const [batch] = await service.attachBalance([
        {
          id: 1,
          quantityOnHand: '0.000',
          expiryDate: null,
        },
      ] as any);

      expect(batch.status).toBe(BatchStatus.Depleted);
    });
  });

  describe('attachTransactionTotals', () => {
    it('includes the opening quantity and keeps the stored on hand', async () => {
      jest.spyOn(service, 'getTransactionsTotals').mockResolvedValue(
        new Map([
          [
            1,
            {
              quantityIn: 5,
              quantityOut: 2,
            },
          ],
        ]),
      );

      const [batch] = await service.attachTransactionTotals([
        {
          id: 1,
          itemId: 1,
          batchNumber: 'B-001',
          quantity: 10,
          quantityOnHand: 13,
          sourceTransactionType: null,
          status: BatchStatus.Active,
        },
      ]);

      expect(batch.quantityIn).toBe(15);
      expect(batch.quantityOut).toBe(2);
      expect(batch.quantityOnHand).toBe(13);
    });
  });

  describe('getAvailableQuantities', () => {
    it('returns the stored quantities when no transaction is excluded', async () => {
      const quantities = await service.getAvailableQuantities([
        { id: 1, quantityOnHand: '4.250' },
        { id: 2, quantityOnHand: 10 },
      ] as any);

      expect(quantities.get(1)).toBe(4.25);
      expect(quantities.get(2)).toBe(10);
      expect(inventoryTransactionModel).not.toHaveBeenCalled();
    });
  });
});
