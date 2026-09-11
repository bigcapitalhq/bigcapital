import {
  BillLandedCostsBridge,
  IBillLandedCostsProvider,
} from './BillLandedCostsBridge';

describe('BillLandedCostsBridge', () => {
  let bridge: BillLandedCostsBridge;

  beforeEach(() => {
    bridge = new BillLandedCostsBridge();
  });

  describe('without a registered provider', () => {
    it('resolves the validations as no-ops', async () => {
      await expect(
        bridge.validateBillHasNoLandedCosts(1),
      ).resolves.toBeUndefined();
      await expect(
        bridge.validateBillEntries([{ itemId: 1, landedCost: true }]),
      ).resolves.toBeUndefined();
      expect(() => bridge.validateBillEditEntries([], [])).not.toThrow();
    });

    it('returns empty contributions', async () => {
      await expect(bridge.getItemAllocatedCosts(1)).resolves.toEqual([]);
      await expect(bridge.getLandedCostLedgerEntries(1)).resolves.toEqual([]);
    });
  });

  describe('with a registered provider', () => {
    const buildProvider = (): jest.Mocked<IBillLandedCostsProvider> => ({
      validateBillHasNoLandedCosts: jest.fn().mockResolvedValue(undefined),
      validateBillEntries: jest.fn().mockResolvedValue(undefined),
      validateBillEditEntries: jest.fn(),
      getItemAllocatedCosts: jest
        .fn()
        .mockResolvedValue([{ entryId: 1, amount: 10 }]),
      getLandedCostLedgerEntries: jest
        .fn()
        .mockResolvedValue([{ amount: 10, costAccountId: 5 }]),
    });

    it('delegates every call to the provider', async () => {
      const provider = buildProvider();
      bridge.register(provider);

      await bridge.validateBillHasNoLandedCosts(7);
      await bridge.validateBillEntries([{ itemId: 1, landedCost: true }]);
      bridge.validateBillEditEntries([{ id: 1 }], [{ id: 1 }]);
      await bridge.getItemAllocatedCosts(7);
      await bridge.getLandedCostLedgerEntries(7);

      expect(provider.validateBillHasNoLandedCosts).toHaveBeenCalledWith(
        7,
        undefined,
      );
      expect(provider.validateBillEntries).toHaveBeenCalledWith([
        { itemId: 1, landedCost: true },
      ]);
      expect(provider.validateBillEditEntries).toHaveBeenCalledWith(
        [{ id: 1 }],
        [{ id: 1 }],
      );
      expect(provider.getItemAllocatedCosts).toHaveBeenCalledWith(7, undefined);
      expect(provider.getLandedCostLedgerEntries).toHaveBeenCalledWith(
        7,
        undefined,
      );
    });

    it('returns the provider contributions', async () => {
      const provider = buildProvider();
      bridge.register(provider);

      await expect(bridge.getItemAllocatedCosts(7)).resolves.toEqual([
        { entryId: 1, amount: 10 },
      ]);
      await expect(bridge.getLandedCostLedgerEntries(7)).resolves.toEqual([
        { amount: 10, costAccountId: 5 },
      ]);
    });
  });
});
