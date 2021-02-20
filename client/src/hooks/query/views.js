import { useQuery } from 'react-query';
import { defaultTo } from 'lodash';
import useApiRequest from '../useRequest';

export function useResourceViews(resourceSlug) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['RESOURCE_VIEW', resourceSlug],
    () => apiRequest.get(`views/resource/${resourceSlug}`)
      .then((response) => response.data.views),
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  }
}
 

export function useResourceColumns(resourceSlug) {
  const apiRequest = useApiRequest();

  return useQuery(
    ['RESOURCE_COLUMNS', resourceSlug],
    () => apiRequest.get(`resources/${resourceSlug}/columns`),
    {
      initialData: [],
    },
  );
}
 
export function useResourceFields(resourceSlug, props) {
  const apiRequest = useApiRequest();

  const states = useQuery(
    ['RESOURCE_FIELDS', resourceSlug], 
    () => apiRequest.get(`resources/${resourceSlug}/fields`)
      .then((res) => res.data.resource_fields),
    props
  );

  return {
    ...states,
    data: defaultTo(states.data, []),
  }
}
