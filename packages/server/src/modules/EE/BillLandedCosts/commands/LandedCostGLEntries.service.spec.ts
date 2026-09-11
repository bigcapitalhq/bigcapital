import { AccountNormal } from '@/modules/Accounts/Accounts.types';
import { LandedCostGLEntriesService } from './LandedCostGLEntries.service';

describe('LandedCostGLEntriesService', () => {
  let ledgerStorage: { commit: jest.Mock; deleteByReference: jest.Mock };
  let billLandedCostModel: jest.Mock;
  let service: LandedCostGLEntriesService;

  const buildAllocatedLandedCost = (overrides: Record<string, any> = {}) =>
    ({
      id: 10,
      currencyCode: 'USD',
      exchangeRate: 2,
      costAccountId: 400,
      localAmount: 200,
      allocateEntries: [
        {
          entryId: 1,
          cost: 50,
          itemEntry: {
            itemId: 11,
            costAccountId: 500,
            item: { type: 'inventory', inventoryAccountId: 600 },
          },
        },
      ],
      ...overrides,
    }) as any;

  const bill = {
    billDate: '2023-01-01',
    billNumber: 'B-100',
    referenceNo: 'REF-1',
    branchId: 1,
    projectId: null,
  } as any;

  beforeEach(() => {
    ledgerStorage = { commit: jest.fn(), deleteByReference: jest.fn() };
    billLandedCostModel = jest.fn();
    service = new LandedCostGLEntriesService(
      ledgerStorage as any,
      billLandedCostModel as any,
    );
  });

  describe('getLandedCostGLEntries', () => {
    it('builds a debit entry per allocate entry and a credit entry to the cost account', () => {
      const allocatedLandedCost = buildAllocatedLandedCost();

      const entries = service.getLandedCostGLEntries(allocatedLandedCost, bill);

      expect(entries).toHaveLength(2);

      expect(entries[0]).toMatchObject({
        debit: 100,
        accountId: 600,
        accountNormal: AccountNormal.DEBIT,
        indexGroup: 10,
        itemId: 11,
        transactionType: 'LandedCost',
        transactionId: 10,
      });
      expect(entries[1]).toMatchObject({
        credit: 200,
        accountId: 400,
        accountNormal: AccountNormal.CREDIT,
        indexGroup: 20,
        transactionType: 'LandedCost',
        transactionId: 10,
      });
    });

    it('uses the entry cost account for non-inventory items', () => {
      const allocatedLandedCost = buildAllocatedLandedCost({
        allocateEntries: [
          {
            entryId: 1,
            cost: 50,
            itemEntry: {
              itemId: 12,
              costAccountId: 700,
              item: { type: 'service' },
            },
          },
        ],
      });

      const entries = service.getLandedCostGLEntries(allocatedLandedCost, bill);

      expect(entries[0]).toMatchObject({ debit: 100, accountId: 700 });
    });

    it('throws an error when the account of an allocate entry cannot be determined', () => {
      const allocatedLandedCost = buildAllocatedLandedCost({
        allocateEntries: [{ entryId: 1, cost: 50, itemEntry: {} }],
      });

      expect(() =>
        service.getLandedCostGLEntries(allocatedLandedCost, bill),
      ).toThrow(/Cannot determine GL account/);
    });
  });

  describe('createLandedCostGLEntries', () => {
    it('commits the landed cost ledger of the given allocated landed cost', async () => {
      const allocatedLandedCost = buildAllocatedLandedCost({ bill });
      const lastWithGraphFetched = jest
        .fn()
        .mockResolvedValue(allocatedLandedCost);
      const firstWithGraphFetched = jest.fn(() => ({
        withGraphFetched: lastWithGraphFetched,
      }));
      const findById = jest.fn(() => ({
        withGraphFetched: firstWithGraphFetched,
      }));
      billLandedCostModel.mockReturnValue({
        query: jest.fn(() => ({ findById })),
      });
      const trx = { id: 'trx' };

      await service.createLandedCostGLEntries(10, trx as any);

      expect(ledgerStorage.commit).toHaveBeenCalledTimes(1);
      expect(ledgerStorage.commit.mock.calls[0][1]).toBe(trx);
    });

    it('throws an error when the landed cost bill is not found', async () => {
      const lastWithGraphFetched = jest.fn().mockResolvedValue(null);
      const firstWithGraphFetched = jest.fn(() => ({
        withGraphFetched: lastWithGraphFetched,
      }));
      const findById = jest.fn(() => ({
        withGraphFetched: firstWithGraphFetched,
      }));
      billLandedCostModel.mockReturnValue({
        query: jest.fn(() => ({ findById })),
      });

      await expect(service.createLandedCostGLEntries(10)).rejects.toThrow(
        /BillLandedCost or associated Bill not found/,
      );
    });
  });

  describe('revertLandedCostGLEntries', () => {
    it('deletes the ledger entries by the landed cost reference', async () => {
      const trx = { id: 'trx' };

      await service.revertLandedCostGLEntries(10, trx as any);

      expect(ledgerStorage.deleteByReference).toHaveBeenCalledWith(
        10,
        'LandedCost',
        trx,
      );
    });
  });
});
