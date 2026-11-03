import { castArray } from 'lodash';
import moment from 'moment';
import React from 'react';
import intl from 'react-intl-universal';
import * as Yup from 'yup';
import type { InventoryTurnoverByAmountTableQuery } from '@bigcapital/sdk-ts';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

/**
 * Retrieves the inventory turnover by amount query validation schema.
 */
export const getInventoryTurnoverByAmountQuerySchema = () => {
  return Yup.object().shape({
    fromDate: Yup.date().required().label(intl.get('from_date')),
    toDate: Yup.date()
      .min(Yup.ref('fromDate'))
      .required()
      .label(intl.get('to_date')),
  });
};

/**
 * Retrieves the inventory turnover by amount default query.
 */
export const getInventoryTurnoverByAmountQuery = () => ({
  fromDate: moment().startOf('month').format('YYYY-MM-DD'),
  toDate: moment().format('YYYY-MM-DD'),
  itemsIds: [] as number[],
  branchesIds: [] as number[],
  warehousesIds: [] as number[],
  numberFormat: {} as Record<string, unknown>,
});

/**
 * Parses the inventory turnover by amount browser location query.
 */
const parseInventoryTurnoverByAmountQuery = (
  locationQuery: Record<string, unknown>,
): InventoryTurnoverByAmountTableQuery => {
  const defaultQuery = getInventoryTurnoverByAmountQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };

  return {
    ...transformed,

    // Ensures the branches, warehouses and items ids are always arrays.
    itemsIds: castArray(transformed.itemsIds).map(Number),
    branchesIds: castArray(transformed.branchesIds).map(Number),
    warehousesIds: castArray(transformed.warehousesIds).map(Number),
  };
};

/**
 * Inventory turnover by amount location query state.
 */
export const useInventoryTurnoverByAmountQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = React.useMemo(
    () => parseInventoryTurnoverByAmountQuery(locationQuery),
    [locationQuery],
  );

  return {
    query,
    locationQuery,
    setLocationQuery,
  };
};
