import { useFormikContext } from 'formik';
import * as FF from 'fp-ts/function';
import { round } from 'lodash';
import React from 'react';
import { updateItemsEntriesTotal } from './utils';
import type { ItemEntry } from '@/interfaces/ItemEntries';

/**
 * Convert the given rate to the local currency.
 * @param {number} rate
 * @param {number} exchangeRate
 * @returns {number}
 */
export const convertToForeignCurrency = (
  rate: number,
  exchangeRate: number,
) => {
  return rate * exchangeRate;
};

/**
 * Converts the given rate to the base currency.
 * @param {number} rate
 * @param {number} exchangeRate
 * @returns {number}
 */
export const covertToBaseCurrency = (rate: number, exchangeRate: number) => {
  return rate / exchangeRate;
};

/**
 * Reverts the given rate from the old exchange rate and covert it to the new
 * currency based on the given new exchange rate.
 * @param {number} rate -
 * @param {number} oldExchangeRate - Old exchange rate.
 * @param {number} newExchangeRate - New exchange rate.
 * @returns {number}
 */
const revertAndConvertExchangeRate = (
  rate: number,
  oldExchangeRate: number,
  newExchangeRate: number,
) => {
  const oldValue = convertToForeignCurrency(rate, oldExchangeRate);
  const newValue = covertToBaseCurrency(oldValue, newExchangeRate);

  return round(newValue, 3);
};

/**
 * Assign the new item entry rate after converting to the new exchange rate.
 * @params {number} oldExchangeRate -
 * @params {number} newExchangeRate -
 * @params {ItemEntry} entries -
 */
const assignRateRevertAndCovertExchangeRate =
  (oldExchangeRate: number, newExchangeRate: number) =>
  (entries: ItemEntry[]) => {
    return entries.map((entry) => ({
      ...entry,
      rate: revertAndConvertExchangeRate(
        entry.rate,
        oldExchangeRate,
        newExchangeRate,
      ),
    }));
  };

/**
 * Updates items entries on exchange rate change.
 * @returns {(oldExchangeRate: number, newExchangeRate: number) => ItemEntry[]}
 */
export const useUpdateEntriesOnExchangeRateChange = () => {
  const {
    values: { entries },
  } = useFormikContext<{ entries: ItemEntry[] }>();

  return React.useMemo(() => {
    return (oldExchangeRate: number, newExchangeRate: number) => {
      return FF.pipe(
        entries,
        // Assign a new rate of the given new exchange rate from the old exchange rate.
        assignRateRevertAndCovertExchangeRate(oldExchangeRate, newExchangeRate),
        // Updates entries total.
        updateItemsEntriesTotal,
      );
    };
  }, [entries]);
};
