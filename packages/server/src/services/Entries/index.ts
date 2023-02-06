import { Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import { transformToMap } from 'utils';
import {
  ICommonLandedCostEntry,
  ICommonLandedCostEntryDTO
} from '@/interfaces';

const ERRORS = {
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
  LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES:
    'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
};

@Service()
export default class EntriesService {
  /**
   * Validates bill entries that has allocated landed cost amount not deleted.
   * @param {IItemEntry[]} oldCommonEntries -
   * @param {IItemEntry[]} newBillEntries -
   */
  public getLandedCostEntriesDeleted(
    oldCommonEntries: ICommonLandedCostEntry[],
    newCommonEntriesDTO: ICommonLandedCostEntryDTO[]
  ): ICommonLandedCostEntry[] {
    const newBillEntriesById = transformToMap(newCommonEntriesDTO, 'id');

    return oldCommonEntries.filter((entry) => {
      const newEntry = newBillEntriesById.get(entry.id);

      if (entry.allocatedCostAmount > 0 && typeof newEntry === 'undefined') {
        return true;
      }
      return false;
    });
  }

  /**
   * Validates the bill entries that have located cost amount should not be deleted.
   * @param {IItemEntry[]} oldCommonEntries - Old bill entries.
   * @param {IItemEntryDTO[]} newBillEntries - New DTO bill entries.
   */
  public validateLandedCostEntriesNotDeleted(
    oldCommonEntries: ICommonLandedCostEntry[],
    newCommonEntriesDTO: ICommonLandedCostEntryDTO[]
  ): void {
    const entriesDeleted = this.getLandedCostEntriesDeleted(
      oldCommonEntries,
      newCommonEntriesDTO
    );
    if (entriesDeleted.length > 0) {
      throw new ServiceError(ERRORS.ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED);
    }
  }

  /**
   * Validate allocated cost amount entries should be smaller than new entries amount.
   * @param {IItemEntry[]} oldCommonEntries - Old bill entries.
   * @param {IItemEntryDTO[]} newBillEntries - New DTO bill entries.
   */
  public validateLocatedCostEntriesSmallerThanNewEntries(
    oldCommonEntries: ICommonLandedCostEntry[],
    newCommonEntriesDTO: ICommonLandedCostEntryDTO[]
  ): void {
    const oldBillEntriesById = transformToMap(oldCommonEntries, 'id');

    newCommonEntriesDTO.forEach((entry) => {
      const oldEntry = oldBillEntriesById.get(entry.id);

      if (oldEntry && oldEntry.allocatedCostAmount > entry.amount) {
        throw new ServiceError(
          ERRORS.LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES
        );
      }
    });
  }
}
