import { useQuery, useMutation } from 'react-query';
import ApiService from 'services/ApiService';


export function useExpenses(props) {
  return useQuery(
    ['EXPENSES'],
    () => ApiService.get(`expenses`).then((response) => response.data),
    {
      initialData: {
        expenses: [],
        pagination: {},
      },
      ...props
    },
  );
}

export function useExpense(id, props) {
  return useQuery(
    ['EXPENSES', id],
    () => ApiService.get(`expenses`).then((response) => response.data.expense),
    {
      initialData: {},
      ...props
    },
  );
}

export function useDeleteExpense(props) {
  return useMutation((id) => ApiService.delete(`expenses/${id}`), props);
}

export function useEditExpense(props) {
  return useMutation((id, values) => ApiService.post(`expenses/${id}`, values), props);
}

 
export function useCreateExpense(props) {
  return useMutation((values) => ApiService.post('expenses', values), props);
}
 