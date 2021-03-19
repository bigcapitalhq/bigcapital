import { useRequestQuery } from '../useQueryRequest';

/**
 * Retrieve the resource views.
 * @param {string} resourceSlug - Resource slug.
 */
export function useResourceViews(resourceSlug) {
  return useRequestQuery(
    ['RESOURCE_VIEW', resourceSlug],
    { method: 'get', url: `views/resource/${resourceSlug}` },
    {
      select: (response) => response.data.views,
      defaultData: [],
    },
  );
}
 
/**
 * Retrieve the resource columns.
 * @param {string} resourceSlug - Resource slug.
 */
export function useResourceColumns(resourceSlug) {
  return useRequestQuery(
    ['RESOURCE_COLUMNS', resourceSlug],
    { method: 'get', url: `resources/${resourceSlug}/columns` },
    {
      defaultData: [],
    },
  );
}

/**
 * Retrieve the resource fields.
 * @param {string} resourceSlug - Resource slug.
 */
export function useResourceFields(resourceSlug, props) {
  return useRequestQuery(
    ['RESOURCE_FIELDS', resourceSlug], 
    { method: 'get', url: `resources/${resourceSlug}/fields` },
    {
      select: (res) => res.data.resource_fields,
      defaultData: [],
    },
    props
  );
}
