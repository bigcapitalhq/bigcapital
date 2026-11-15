import { useResourceData } from '../GenericResource';
import { useItemSkuSettings } from '../settings/queries';
import { getUniversalSearchBind } from '@/containers/UniversalSearch/utils';

/**
 * Transformes the resource data to search entries based on
 * the given resource type.
 * @param {string} type
 * @param {any} resource
 * @returns
 */
function transfromResourceDataToSearch(
  resource: any,
  options?: { itemSkuEnabled?: boolean },
) {
  const selectItem = getUniversalSearchBind(
    resource?._type,
    'itemSelect',
    options,
  );

  if (!resource || !Array.isArray(resource.items)) {
    return [];
  }
  return resource.items.map((item: unknown) => ({
    ...(selectItem ? selectItem(item) : {}),
    _type: resource._type,
  }));
}

/**
 *
 * @param {*} type
 * @param {*} searchKeyword
 * @returns
 */
export function useUniversalSearch(
  type: string,
  searchKeyword: string,
  props?: unknown,
) {
  const { enabled: itemSkuEnabled } = useItemSkuSettings();
  const { data, ...restProps } = useResourceData(
    type,
    {
      searchKeyword,
    },
    props,
  );
  const searchData = transfromResourceDataToSearch(data, { itemSkuEnabled });

  return {
    data: searchData,
    ...restProps,
  };
}
