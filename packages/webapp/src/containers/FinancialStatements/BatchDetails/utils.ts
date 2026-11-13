import { castArray } from 'lodash';
import React from 'react';
import type { BatchDetailsReportQuery } from '@/hooks/query';
import { useAppQueryString } from '@/hooks';
import { transformToForm } from '@/utils';

export const getDefaultBatchDetailsQuery = () => ({
  itemsIds: [] as number[],
  status: '' as string,
  search: '',
});

/**
 * Parses the batch details report query from the location query string.
 */
const parseBatchDetailsQuery = (
  locationQuery: Record<string, unknown>,
): BatchDetailsReportQuery => {
  const defaultQuery = getDefaultBatchDetailsQuery();
  const transformed = {
    ...defaultQuery,
    ...transformToForm(locationQuery, defaultQuery),
  };
  return {
    ...transformed,
    itemsIds: castArray(transformed.itemsIds).map(Number).filter(Boolean),
    status: (transformed.status ||
      undefined) as BatchDetailsReportQuery['status'],
    search: transformed.search || undefined,
  };
};

/**
 * Batch details report query state.
 */
export const useBatchDetailsQuery = () => {
  const [locationQuery, setLocationQuery] = useAppQueryString();

  const query = React.useMemo(
    () => parseBatchDetailsQuery(locationQuery),
    [locationQuery],
  );
  return { query, locationQuery, setLocationQuery };
};
