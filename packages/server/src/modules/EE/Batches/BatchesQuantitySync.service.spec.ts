import { BatchesQuantitySyncService } from './BatchesQuantitySync.service';

describe('BatchesQuantitySyncService', () => {
  let batchModel: any;
  let queries: any[];
  let service: BatchesQuantitySyncService;

  beforeEach(() => {
    queries = [];
    batchModel = jest.fn(() => ({
      query: jest.fn(() => {
        const query = {
          where: jest.fn().mockReturnThis(),
          increment: jest.fn().mockResolvedValue(1),
          decrement: jest.fn().mockResolvedValue(1),
        };
        queries.push(query);
        return query;
      }),
    }));
    service = new BatchesQuantitySyncService(batchModel);
  });

  describe('getBatchesQuantityChanges', () => {
    it('aggregates the signed quantities by batch and skips missing batches', () => {
      const changes = service.getBatchesQuantityChanges([
        { batchId: 1, direction: 'IN', quantity: 5 },
        { batchId: 1, direction: 'OUT', quantity: 2 },
        { batchId: 2, direction: 'OUT', quantity: 3 },
        { batchId: null, direction: 'IN', quantity: 10 },
        { direction: 'IN', quantity: 4 },
        { batchId: 3, direction: 'IN', quantity: null },
      ] as any);

      expect(changes).toEqual([
        { batchId: 1, balanceChange: 3 },
        { batchId: 2, balanceChange: -3 },
      ]);
    });

    it('rounds the quantities to three decimals', () => {
      const changes = service.getBatchesQuantityChanges([
        { batchId: 1, direction: 'IN', quantity: 0.1 },
        { batchId: 1, direction: 'IN', quantity: 0.2 },
      ] as any);

      expect(changes).toEqual([{ batchId: 1, balanceChange: 0.3 }]);
    });
  });

  describe('getReverseBatchesQuantityChanges', () => {
    it('reverses the direction of each change', () => {
      const changes = service.getReverseBatchesQuantityChanges([
        { batchId: 1, direction: 'IN', quantity: 5 },
        { batchId: 2, direction: 'OUT', quantity: 3 },
      ] as any);

      expect(changes).toEqual([
        { batchId: 1, balanceChange: -5 },
        { batchId: 2, balanceChange: 3 },
      ]);
    });
  });

  describe('changeBatchesQuantity', () => {
    it('applies the changes in batch id order', async () => {
      await service.changeBatchesQuantity([
        { batchId: 2, balanceChange: -3 },
        { batchId: 1, balanceChange: 3 },
      ]);

      expect(queries).toHaveLength(2);
      expect(queries[0].where).toHaveBeenCalledWith('id', 1);
      expect(queries[0].increment).toHaveBeenCalledWith('quantityOnHand', 3);
      expect(queries[1].where).toHaveBeenCalledWith('id', 2);
      expect(queries[1].decrement).toHaveBeenCalledWith('quantityOnHand', 3);
    });

    it('skips zero changes', async () => {
      await service.changeBatchesQuantity([{ batchId: 1, balanceChange: 0 }]);

      expect(queries).toHaveLength(0);
    });
  });
});
