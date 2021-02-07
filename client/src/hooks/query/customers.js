
import { useMutation, useQuery } from 'react-query';
import ApiService from 'services/ApiService';


const transformCustomers = (response) => {
  return response.data;
}

const transformCustomer = (response) => {
  return response.data;
}

/**
 * 
 * @param {*} query 
 * @param {*} props 
 */
export function useCustomers(query, props) {
  return useQuery(
    ['CUSTOMERS', query],
    () => ApiService
      .get(`customers`, { params: query })
      .then(transformCustomers),
    {
      initialData: {
        customers: [],
        pagination: {},
      },
      ...props
    }
  )
}

/**
 * 
 * @param {*} props 
 */
export function useEditCustomer(props) {
  return useMutation(
    (values, id) => ApiService.post(`customers/${id}`, values),
    props
  );
}

/**
 * 
 * @param {*} props 
 */
export function useDeleteCustomer(props) {
  return useMutation(
    (id) => ApiService.delete(`customers/${id}`),
    props
  );
}

export function useCreateCustomer(props) {
  return useMutation(
    (values) => ApiService.post('customers', values),
    props
  );
}

export function useCustomer(id, props) {
  return useQuery(
    ['CUSTOMER', id],
    () => ApiService
      .get(`customers/${id}`)
      .then(transformCustomer),
    props
  )
};