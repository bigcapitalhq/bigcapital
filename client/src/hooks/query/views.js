import { useQuery } from 'react-query';
import { defaultTo } from 'lodash';
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
  const states = useQuery(
    ['RESOURCE_VIEW', resourceSlug],
    () => ApiService.get(`views/resource/${resourceSlug}`)
      .then((response) => response.data.views),
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  }
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
 
export function useResourceFields(resourceSlug, props) {
  const states = useQuery(
    ['RESOURCE_FIELDS', resourceSlug], 
    () => ApiService.get(`resources/${resourceSlug}/fields`)
      .then((res) => res.data.resource_fields),
    props
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  }
}
