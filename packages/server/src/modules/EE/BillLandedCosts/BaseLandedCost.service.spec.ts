import { BaseLandedCostService } from './BaseLandedCost.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './utils';

class TestableBaseLandedCostService extends BaseLandedCostService {
  public validateAllocateCostItemsPublic(entries, items) {
    return this.validateAllocateCostItems(entries, items);
  }

  public getAllocateItemsCostTotalPublic(landedCostDTO) {
    return this.getAllocateItemsCostTotal(landedCostDTO);
  }

  public validateLandedCostEntryAmountPublic(unallocatedCost, amount) {
    return this.validateLandedCostEntryAmount(unallocatedCost, amount);
  }

  public transformToBillLandedCostPublic(
    landedCostDTO,
    bill,
    costTransaction,
    costTransactionEntry,
  ) {
    return this.transformToBillLandedCost(
      landedCostDTO,
      bill,
      costTransaction,
      costTransactionEntry,
    );
  }
}

describe('BaseLandedCostService', () => {
  let service: TestableBaseLandedCostService;

  beforeEach(() => {
    service = new TestableBaseLandedCostService();
  });

  describe('validateAllocateCostItems', () => {
    it('throws an error once an allocate item is not associated with a bill entry', () => {
      const billEntries = [{ id: 1 }, { id: 2 }];
      const allocateItems = [
        { entryId: 1, cost: 100 },
        { entryId: 3, cost: 50 },
      ];

      try {
        service.validateAllocateCostItemsPublic(billEntries, allocateItems);
        throw new Error('Expected the service to throw');
      } catch (error) {
        expect((error as ServiceError).errorType).toBe(
          ERRORS.LANDED_COST_ITEMS_IDS_NOT_FOUND,
        );
      }
    });

    it('does not throw when all the allocate items are associated with bill entries', () => {
      const billEntries = [{ id: 1 }, { id: 2 }];
      const allocateItems = [
        { entryId: 1, cost: 100 },
        { entryId: 2, cost: 50 },
      ];

      expect(() =>
        service.validateAllocateCostItemsPublic(billEntries, allocateItems),
      ).not.toThrow();
    });
  });

  describe('getAllocateItemsCostTotal', () => {
    it('sums the costs of the allocate items', () => {
      expect(
        service.getAllocateItemsCostTotalPublic({
          items: [
            { entryId: 1, cost: 100 },
            { entryId: 2, cost: 50 },
          ],
        }),
      ).toBe(150);
    });

    it('returns zero when there are no allocate items', () => {
      expect(service.getAllocateItemsCostTotalPublic({ items: [] })).toBe(0);
    });
  });

  describe('validateLandedCostEntryAmount', () => {
    it('throws an error when the amount is bigger than the unallocated cost', () => {
      try {
        service.validateLandedCostEntryAmountPublic(50, 100);
        throw new Error('Expected the service to throw');
      } catch (error) {
        expect((error as ServiceError).errorType).toBe(
          ERRORS.COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT,
        );
      }
    });

    it('does not throw when the amount equals the unallocated cost', () => {
      expect(() =>
        service.validateLandedCostEntryAmountPublic(100, 100),
      ).not.toThrow();
    });
  });

  describe('transformToBillLandedCost', () => {
    it('transforms the landed cost dto to a bill landed cost model object', () => {
      const landedCostDTO = {
        transactionType: 'Bill',
        transactionId: 5,
        transactionEntryId: 9,
        allocationMethod: 'value',
        description: 'Ocean freight',
        items: [
          { entryId: 1, cost: 100 },
          { entryId: 2, cost: 50 },
        ],
      };
      const bill = { id: 7 };
      const costTransaction = { currencyCode: 'USD', exchangeRate: 0 };
      const costTransactionEntry = { costAccountId: 1019 };

      expect(
        service.transformToBillLandedCostPublic(
          landedCostDTO as any,
          bill as any,
          costTransaction as any,
          costTransactionEntry as any,
        ),
      ).toEqual({
        billId: 7,
        fromTransactionType: 'Bill',
        fromTransactionId: 5,
        fromTransactionEntryId: 9,
        amount: 150,
        currencyCode: 'USD',
        exchangeRate: 1,
        allocationMethod: 'value',
        allocateEntries: landedCostDTO.items,
        description: 'Ocean freight',
        costAccountId: 1019,
      });
    });
  });
});
