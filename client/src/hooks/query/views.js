import { useQuery } from 'react-query';
import ApiService from "services/ApiService";

// export function useSaveView(values) {
//   return ApiService.post('views', form);
// }

// export function useEditView(values, id) {
//   return ApiService.post(`views/${id}`, values);
// }

// export function useDeleteView(id) {
//   return ApiService.delete(`views/${id}`);
// }

// export function useView(id) {
//   return useQuery(['VIEW', id], () => ApiService.get(`views/${id}`)
// }

export function useResourceViews(resourceSlug) {
  return useQuery(
    ['RESOURCE_VIEW', resourceSlug],
    () => ApiService.get(`views/resource/${resourceSlug}`)
      .then((response) => response.data.views),
    {
      initialData: [],
    }
  );
}
 

export function useResourceColumns(resourceSlug) {
  return useQuery(
    ['RESOURCE_COLUMNS', resourceSlug],
    () => ApiService.get(`resources/${resourceSlug}/columns`),
    {
      initialData: [],
    },
  );
}
 
export function useResourceFields(resourceSlug) {
  return useQuery(
    ['RESOURCE_FIELDS', resourceSlug], 
    () => ApiService.get(`resources/${resourceSlug}/fields`)
      .then((res) => res.data.resource_fields),
    {
      initialData: [],
    },
  );
}
