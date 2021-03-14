import { useQuery, useMutation, useQueryClient } from 'react-query';
import useApiRequest from '../useRequest';
import { transformPagination } from 'utils';
import t from './types';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate expenses.
  queryClient.invalidateQueries(t.EXPENSES);

  // Invalidate accounts.
  queryClient.invalidateQueries(t.ACCOUNTS);
  queryClient.invalidateQueries(t.ACCOUNT);

  // Invalidate financial reports.
  queryClient.invalidateQueries(t.FINANCIAL_REPORT);
};

/**
 * Retrieve the expenses list.
 */
export function useExpenses(query, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.EXPENSES, query],
    () => apiRequest.get(`expenses`, { params: { ...query } }),
    {
      select: (response) => ({
        expenses: response.data.expenses,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta,
      }),
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          expenses: [],
          pagination: defaultPagination,
          filter_meta: {},
        },
      },
      ...props,
    },
  );
}

/**
 * Retrieve the expense details.
 * @param {number} id - Expense id.
 */
export function useExpense(id, props) {
  const apiRequest = useApiRequest();

  return useQuery(
    [t.EXPENSE, id],
    () => apiRequest.get(`expenses/${id}`),
    {
      select: (res) => res.data.expense,
      initialDataUpdatedAt: 0,
      initialData: {
        data: {
          expense: {},
        }
      },
      ...props,
    },
  );
}

/**
 * Deletes the given expense.
 */
export function useDeleteExpense(props) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((id) => apiRequest.delete(`expenses/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific expense.
      queryClient.invalidateQueries([t.EXPENSE, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given expense.
 */
export function useEditExpense(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`expenses/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific expense.
        queryClient.invalidateQueries([t.EXPENSE, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Creates the new expense.
 */
export function useCreateExpense(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('expenses', values), {
    onSuccess: (res, [values]) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Publishes the given expense.
 */
export function usePublishExpense(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.post(`expenses/${id}/publish`), {
    onSuccess: (res, id) => {
      // Invalidate specific expense.
      queryClient.invalidateQueries([t.EXPENSE, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}
