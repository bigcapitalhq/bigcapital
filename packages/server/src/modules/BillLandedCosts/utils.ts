import { IItemEntry, IBillLandedCostTransactionEntry } from '@/interfaces';
import { transformToMap } from 'utils';

export const ERRORS = {
  COST_TYPE_UNDEFINED: 'COST_TYPE_UNDEFINED',
  LANDED_COST_ITEMS_IDS_NOT_FOUND: 'LANDED_COST_ITEMS_IDS_NOT_FOUND',
  COST_TRANSACTION_HAS_NO_ENOUGH_TO_LOCATE:
    'COST_TRANSACTION_HAS_NO_ENOUGH_TO_LOCATE',
  BILL_LANDED_COST_NOT_FOUND: 'BILL_LANDED_COST_NOT_FOUND',
  COST_ENTRY_ID_NOT_FOUND: 'COST_ENTRY_ID_NOT_FOUND',
  LANDED_COST_TRANSACTION_NOT_FOUND: 'LANDED_COST_TRANSACTION_NOT_FOUND',
  LANDED_COST_ENTRY_NOT_FOUND: 'LANDED_COST_ENTRY_NOT_FOUND',
  COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT:
    'COST_AMOUNT_BIGGER_THAN_UNALLOCATED_AMOUNT',
  ALLOCATE_COST_SHOULD_NOT_BE_BILL: 'ALLOCATE_COST_SHOULD_NOT_BE_BILL',
};

/**
 * Merges item entry to bill located landed cost entry.
 * @param {IBillLandedCostTransactionEntry[]} locatedEntries -
 * @param {IItemEntry[]} billEntries -
 * @returns {(IBillLandedCostTransactionEntry & { entry: IItemEntry })[]}
 */
export const mergeLocatedWithBillEntries = (
  locatedEntries: IBillLandedCostTransactionEntry[],
  billEntries: IItemEntry[]
): (IBillLandedCostTransactionEntry & { entry: IItemEntry })[] => {
  const billEntriesByEntryId = transformToMap(billEntries, 'id');

  return locatedEntries.map((entry) => ({
    ...entry,
    entry: billEntriesByEntryId.get(entry.entryId),
  }));
};


export const CONFIG = {
  COST_TYPES: {
    Expense: {
      entries: 'categories',
    },
    Bill: {
      entries: 'entries',
    },
  },
};