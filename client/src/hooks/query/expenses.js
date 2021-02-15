import { useQuery, useMutation, useQueryClient } from 'react-query';
import { defaultTo } from 'lodash';
import ApiService from 'services/ApiService';
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
  const states = useQuery(
    ['EXPENSES', query],
    () => ApiService.get(`expenses`, { params: { ...query } }),
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
  const states = useQuery(['EXPENSE', id], () => ApiService.get(`expenses/${id}`), {
    select: (res) => res.data.expense,
    ...props,
  });

  return {
    ...states,
    data: defaultTo(states.data, {}),
  };
}

/**
 * Deletes the given expense.
 */
export function useDeleteExpense(props) {
  const queryClient = useQueryClient();

  return useMutation((id) => ApiService.delete(`expenses/${id}`), {
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

  return useMutation(
    ([id, values]) => ApiService.post(`expenses/${id}`, values),
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

  return useMutation((values) => ApiService.post('expenses', values), {
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

  return useMutation((id) => ApiService.post(`expenses/${id}/publish`), {
    onSuccess: () => {
      queryClient.invalidateQueries('EXPENSES');
      queryClient.invalidateQueries('EXPENSE');
    },
    ...props,
  });
}