
import { useMutation, useQuery } from 'react-query';
import ApiService from 'services/ApiService';


const transformVendors = (response) => {
  return {
    vendors: response.data.vendors,
    pagination: response.data.pagination,
  };
};

const transformVendor = (response) => {
  return response.data.vendor;
};

/**
 * Retrieve vendors list.
 */
export function useVendors(query, props) {
  return useQuery(
    ['VENDORS', query],
    () => ApiService
      .get(`vendors`, { params: query })
      .then(transformVendors),
    {
      initialData: {
        vendors: [],
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
export function useEditVendor(props) {
  return useMutation(
    (values, id) => ApiService.post(`vendors/${id}`, values),
    props
  );
}

/**
 * 
 * @param {*} props 
 */
export function useDeleteVendor(props) {
  return useMutation(
    (id) => ApiService.delete(`vendors/${id}`),
    props
  );
}

/**
 * Creates a new vendor.
 */
export function useCreateVendor(props) {
  return useMutation(
    (values) => ApiService.post('vendors', values),
    props
  );
}

/**
 * 
 * @param {*} id 
 * @param {*} props 
 */
export function useVendor(id, props) {
  return useQuery(
    ['VENDOR', id],
    () => ApiService
      .get(`vendors/${id}`)
      .then(transformVendor),
    props
  )
};