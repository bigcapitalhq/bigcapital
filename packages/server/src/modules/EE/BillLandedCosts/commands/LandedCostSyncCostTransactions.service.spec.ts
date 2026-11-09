import { LandedCostSyncCostTransactions } from './LandedCostSyncCostTransactions.service';

describe('LandedCostSyncCostTransactions', () => {
  let transactionLandedCost: { getModel: jest.Mock };
  let service: LandedCostSyncCostTransactions;
  let query: jest.Mock;
  let increment: jest.Mock;
  let decrement: jest.Mock;
  let transactionWhere: jest.Mock;
  let relatedQuery: jest.Mock;
  let relatedFor: jest.Mock;
  let entryWhere: jest.Mock;

  beforeEach(() => {
    increment = jest.fn().mockResolvedValue(1);
    decrement = jest.fn().mockResolvedValue(1);
    transactionWhere = jest.fn(() => ({ increment, decrement }));
    query = jest.fn(() => ({ where: transactionWhere }));

    entryWhere = jest.fn(() => ({ increment, decrement }));
    relatedFor = jest.fn(() => ({ where: entryWhere }));
    relatedQuery = jest.fn(() => ({ for: relatedFor }));

    const Model = jest.fn(() => ({ query, relatedQuery }));
    transactionLandedCost = {
      getModel: jest.fn().mockResolvedValue(Model),
    };
    service = new LandedCostSyncCostTransactions(transactionLandedCost as any);
  });

  describe('incrementLandedCostAmount', () => {
    it('increments the allocated cost amount of the transaction and the entry', async () => {
      const trx = { id: 'trx' };

      await service.incrementLandedCostAmount('Bill', 5, 9, 25, trx as any);

      expect(transactionLandedCost.getModel).toHaveBeenCalledWith('Bill');
      expect(query).toHaveBeenCalledWith(trx);
      expect(transactionWhere).toHaveBeenCalledWith('id', 5);
      expect(increment).toHaveBeenCalledWith('allocatedCostAmount', 25);

      expect(relatedQuery).toHaveBeenCalledWith('entries', trx);
      expect(relatedFor).toHaveBeenCalledWith(5);
      expect(entryWhere).toHaveBeenCalledWith('id', 9);
    });

    it('uses the categories relation for expenses', async () => {
      await service.incrementLandedCostAmount('Expense', 5, 9, 25);

      expect(relatedQuery).toHaveBeenCalledWith('categories', undefined);
    });
  });

  describe('revertLandedCostAmount', () => {
    it('decrements the allocated cost amount of the transaction and the entry', async () => {
      const trx = { id: 'trx' };

      await service.revertLandedCostAmount('Bill', 5, 9, 25, trx as any);

      expect(transactionLandedCost.getModel).toHaveBeenCalledWith('Bill');
      expect(transactionWhere).toHaveBeenCalledWith('id', 5);
      expect(decrement).toHaveBeenCalledWith('allocatedCostAmount', 25);
      expect(relatedQuery).toHaveBeenCalledWith('entries', trx);
      expect(entryWhere).toHaveBeenCalledWith('id', 9);
    });
  });
});
