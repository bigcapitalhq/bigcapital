import { ServiceError } from '@/modules/Items/ServiceError';
import { TransactionLandedCostEntriesService } from './TransactionLandedCostEntries.service';

const ERRORS = {
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
  LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES:
    'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
};

describe('TransactionLandedCostEntriesService', () => {
  let service: TransactionLandedCostEntriesService;

  beforeEach(() => {
    service = new TransactionLandedCostEntriesService();
  });

  describe('getLandedCostEntriesDeleted', () => {
    it('returns the allocated entries that are missing from the new entries', () => {
      const oldEntries = [
        { id: 1, amount: 100, allocatedCostAmount: 50 },
        { id: 2, amount: 200, allocatedCostAmount: 120 },
      ];
      const newEntries = [{ id: 1, amount: 100 }];

      expect(
        service.getLandedCostEntriesDeleted(oldEntries, newEntries),
      ).toEqual([{ id: 2, amount: 200, allocatedCostAmount: 120 }]);
    });

    it('ignores the entries that have no allocated cost amount', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 0 }];

      expect(service.getLandedCostEntriesDeleted(oldEntries, [])).toEqual([]);
    });

    it('ignores the entries that are still presented on the new entries', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 50 }];
      const newEntries = [{ id: 1, amount: 100 }];

      expect(
        service.getLandedCostEntriesDeleted(oldEntries, newEntries),
      ).toEqual([]);
    });
  });

  describe('validateLandedCostEntriesNotDeleted', () => {
    it('throws an error once an allocated entry is deleted', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 50 }];

      try {
        service.validateLandedCostEntriesNotDeleted(oldEntries, []);
        throw new Error('Expected the service to throw');
      } catch (error) {
        expect((error as ServiceError).errorType).toBe(
          ERRORS.ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED,
        );
      }
    });

    it('does not throw when the allocated entries are kept', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 50 }];
      const newEntries = [{ id: 1, amount: 100 }];

      expect(() =>
        service.validateLandedCostEntriesNotDeleted(oldEntries, newEntries),
      ).not.toThrow();
    });
  });

  describe('validateLocatedCostEntriesSmallerThanNewEntries', () => {
    it('throws an error when the new amount is smaller than the allocated cost', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 150 }];
      const newEntries = [{ id: 1, amount: 100 }];

      try {
        service.validateLocatedCostEntriesSmallerThanNewEntries(
          oldEntries,
          newEntries,
        );
        throw new Error('Expected the service to throw');
      } catch (error) {
        expect((error as ServiceError).errorType).toBe(
          ERRORS.LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES,
        );
      }
    });

    it('does not throw when the new amount equals the allocated cost', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 100 }];
      const newEntries = [{ id: 1, amount: 100 }];

      expect(() =>
        service.validateLocatedCostEntriesSmallerThanNewEntries(
          oldEntries,
          newEntries,
        ),
      ).not.toThrow();
    });

    it('ignores the new entries that have no old entry', () => {
      const oldEntries = [{ id: 1, amount: 100, allocatedCostAmount: 100 }];
      const newEntries = [{ id: 2, amount: 10 }];

      expect(() =>
        service.validateLocatedCostEntriesSmallerThanNewEntries(
          oldEntries,
          newEntries,
        ),
      ).not.toThrow();
    });
  });
});
