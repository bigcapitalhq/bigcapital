// @ts-nocheck
import { useMutation, useQueryClient } from 'react-query';
import { transformPagination, transformResponse } from '@/utils';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

const DEFAULT_PAGINATION = {
  pageSize: 20,
  page: 0,
  pagesCount: 0,
};

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate items.
  queryClient.invalidateQueries(t.ITEMS);

  // Invalidate items categories.
  queryClient.invalidateQueries(t.ITEMS_CATEGORIES);
};

/**
 * Creates a new item.
 */
export function useCreateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('items', values), {
    onSuccess: (res, values) => {
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given item.
 */
export function useEditItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(([id, values]) => apiRequest.post(`items/${id}`, values), {
    onSuccess: (res, [id, values]) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Deletes the given item.
 */
export function useDeleteItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`items/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Activate the given item.
 */
export function useActivateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`items/${id}/activate`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Inactivate the given item.
 */
export function useInactivateItem(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`items/${id}/inactivate`), {
    onSuccess: (res, id) => {
      // Invalidate specific item.
      queryClient.invalidateQueries([t.ITEM, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

// Transforms items response.
const transformItemsResponse = (response) => {
  return {
    items: response.data.items,
    pagination: transformPagination(
      transformResponse(response.data.pagination),
    ),
    filterMeta: transformResponse(response.data.filter_meta),
  };
};

/**
 * Retrieves items list.
 */
export function useItems(query, props) {
  return useRequestQuery(
    [t.ITEMS, query],
    {
      method: 'get',
      url: 'items',
      params: { ...query },
    },
    {
      select: transformItemsResponse,
      defaultData: {
        items: [],
        pagination: DEFAULT_PAGINATION,
        filterMeta: {},
      },
      ...props,
    },
  );
}

export function useRefreshItems() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.ITEMS);
    },
  };
}

/**
 * Retrieve details of the given item.
 * @param {number} id - Item id.
 */
export function useItem(id, props) {
  return useRequestQuery(
    [t.ITEM, id],
    {
      method: 'get',
      url: `items/${id}`,
    },
    {
      select: (response) => response.data.item,
      defaultData: {},
      ...props,
    },
  );
}

export function useItemAssociatedInvoiceTransactions(id, props) {
  return useRequestQuery(
    [t.ITEM_ASSOCIATED_WITH_INVOICES, id],
    {
      method: 'get',
      url: `items/${id}/transactions/invoices`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

export function useItemAssociatedEstimateTransactions(id, props) {
  return useRequestQuery(
    [t.ITEM_ASSOCIATED_WITH_ESTIMATES, id],
    {
      method: 'get',
      url: `items/${id}/transactions/estimates`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

export function useItemAssociatedReceiptTransactions(id, props) {
  return useRequestQuery(
    [t.ITEM_ASSOCIATED_WITH_RECEIPTS, id],
    {
      method: 'get',
      url: `items/${id}/transactions/receipts`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}
export function useItemAssociatedBillTransactions(id, props) {
  return useRequestQuery(
    [t.ITEMS_ASSOCIATED_WITH_BILLS, id],
    {
      method: 'get',
      url: `items/${id}/transactions/bills`,
    },
    {
      select: (res) => res.data.data,
      defaultData: [],
      ...props,
    },
  );
}

export function useItemWarehouseLocation(id, props) {
  return useRequestQuery(
    [t.ITEM_WAREHOUSES_LOCATION, id],
    {
      method: 'get',
      url: `items/${id}/warehouses`,
    },
    {
      select: (res) => res.data.item_warehouses,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * 
 * @param {*} id 
 * @param {*} query 
 * @param {*} props 
 * @returns 
 */
export function useItemInventoryCost(query, props) {
  return useRequestQuery(
    [t.ITEM_INVENTORY_COST, query],
    {
      method: 'get',
      url: `inventory/items-cost`,
      params: { ...query },
    },
    {
      select: (res) => res.data.costs,
      defaultData: [],
      ...props,
    },
  ); 
}
