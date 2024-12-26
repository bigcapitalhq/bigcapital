import { Injectable } from '@nestjs/common';
import { ServiceError } from '../Items/ServiceError';
import { transformToMap } from '@/utils/transform-to-key';
import { ICommonLandedCostEntry, ICommonLandedCostEntryDTO } from './types/BillLandedCosts.types';

const ERRORS = {
  ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED:
    'ENTRIES_ALLOCATED_COST_COULD_NOT_DELETED',
  LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES:
    'LOCATED_COST_ENTRIES_SHOULD_BIGGE_THAN_NEW_ENTRIES',
};

@Injectable()
export class TransactionLandedCostEntriesService {
  /**
   * Validates bill entries that has allocated landed cost amount not deleted.
   * @param {ICommonLandedCostEntry[]} oldCommonEntries -
   * @param {ICommonLandedCostEntryDTO[]} newBillEntries -
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
   * @param {ICommonLandedCostEntry[]} oldCommonEntries - Old bill entries.
   * @param {ICommonLandedCostEntryDTO[]} newBillEntries - New DTO bill entries.
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
   * @param {ICommonLandedCostEntry[]} oldCommonEntries - Old bill entries.
   * @param {ICommonLandedCostEntryDTO[]} newBillEntries - New DTO bill entries.
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
