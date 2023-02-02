// @ts-nocheck
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
 * Retrieve the resource meta.
 * @param {string} resourceSlug - Resource slug.
 */
export function useResourceMeta(resourceSlug, props) {
  return useRequestQuery(
    ['RESOURCE_META', resourceSlug],
    { method: 'get', url: `resources/${resourceSlug}/meta` },
    {
      select: (res) => res.data.resource_meta,
      defaultData: {
        fields: {},
      },
    },
    props,
  );
}