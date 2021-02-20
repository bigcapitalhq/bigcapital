import { useQuery, useMutation, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';
import { transformPagination } from 'utils';

const defaultPagination = {
  pageSize: 12,
  page: 0,
  pagesCount: 0,
};

/**
 * Retrieve the expenses list.
 */
export function useExpenses(query, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['EXPENSES', query],
    () => apiRequest.get(`expenses`, { params: { ...query } }),
    {
      select: (response) => ({
        expenses: response.data.expenses,
        pagination: transformPagination(response.data.pagination),
        filterMeta: response.data.filter_meta,
      }),
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {
      customers: [],
      pagination: defaultPagination,
      filterMeta: {},
    }),
  };
}

/**
 * Retrieve the expense details.
 * @param {number} id - Expense id.
 */
export function useExpense(id, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['EXPENSE', id],
    () => apiRequest.get(`expenses/${id}`),
    {
      select: (res) => res.data.expense,
      ...props,
    },
  );

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Deletes the given expense.
 */
export function useDeleteExpense(props) {
  const apiRequest = useApiRequest();
  const queryClient = useQueryClient();

  return useMutation((id) => apiRequest.delete(`expenses/${id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries('EXPENSES');
      queryClient.invalidateQueries('EXPENSE');
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
      onSuccess: () => {
        queryClient.invalidateQueries('EXPENSES');
        queryClient.invalidateQueries('EXPENSE');
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
    onSuccess: () => {
      queryClient.invalidateQueries('EXPENSES');
      queryClient.invalidateQueries('EXPENSE');
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
    onSuccess: () => {
      queryClient.invalidateQueries('EXPENSES');
      queryClient.invalidateQueries('EXPENSE');
    },
    ...props,
  });
}
