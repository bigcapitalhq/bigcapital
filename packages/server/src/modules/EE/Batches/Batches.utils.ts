import * as moment from 'moment';
import {
  BATCH_EXPIRING_SOON_DAYS,
  BatchStatus,
  IBatchBalance,
} from './types/Batches.types';

/**
 * Rounds the given quantity to the storage precision.
 */
export const toBatchQuantity = (quantity: unknown): number => {
  const parsed = Number(quantity);
  return Number.isFinite(parsed) ? Math.round(parsed * 1000) / 1000 : 0;
};

/**
 * Retrieves the batch quantity in/out/on-hand from the given batch and its
 * inventory transactions totals.
 *
 * The stored `quantity` is used as the opening quantity when the batch has no
 * `IN` inventory transactions yet (e.g. a batch created from the item details
 * page). Once an `IN` transaction exists (created by a bill), the transactions
 * become the source of truth.
 */
export const calcBatchBalance = (
  batchQuantity: number,
  quantityInFromTransactions: number,
  quantityOutFromTransactions: number,
): IBatchBalance => {
  const quantityIn =
    toBatchQuantity(quantityInFromTransactions) > 0
      ? toBatchQuantity(quantityInFromTransactions)
      : toBatchQuantity(batchQuantity);

  const quantityOut = toBatchQuantity(quantityOutFromTransactions);

  return {
    quantityIn,
    quantityOut,
    quantityOnHand: toBatchQuantity(quantityIn - quantityOut),
  };
};

/**
 * Determines the batch status based on its expiry date and balance.
 */
export const getBatchStatus = (
  expiryDate: Date | string | null | undefined,
  quantityOnHand: number,
): BatchStatus => {
  const today = moment().startOf('day');
  const expiry = expiryDate ? moment(expiryDate).startOf('day') : null;

  if (expiry && expiry.isBefore(today)) {
    return BatchStatus.Expired;
  }
  if (toBatchQuantity(quantityOnHand) <= 0) {
    return BatchStatus.Depleted;
  }
  if (expiry && expiry.diff(today, 'days') <= BATCH_EXPIRING_SOON_DAYS) {
    return BatchStatus.ExpiringSoon;
  }
  return BatchStatus.Active;
};

/**
 * Formats the date to the storage date format.
 */
export const formatBatchDate = (
  date: Date | string | null | undefined,
): string | null => {
  return date ? moment(date).format('YYYY-MM-DD') : null;
};
