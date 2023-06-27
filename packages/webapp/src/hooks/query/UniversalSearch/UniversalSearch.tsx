// @ts-nocheck
import { getUniversalSearchBind } from '@/containers/UniversalSearch/utils';
import { useResourceData } from '../GenericResource';

/**
 * Transforms the resource data to search entries based on
 * the given resource type.
 * @param {string} type
 * @param {any} resource
 * @returns
 */
function transformResourceDataToSearch(resource) {
  const selectItem = getUniversalSearchBind(resource._type, 'itemSelect');

  return resource.items
    .map((item) => ({
      ...selectItem ? selectItem(item) : {}, 
      _type: resource._type,
    }));
}

/**
 *
 * @param {*} type
 * @param {*} searchKeyword
 * @returns
 */
export function useUniversalSearch(type, searchKeyword, props) {
  const { data, ...restProps } = useResourceData(
    type,
    {
      search_keyword: searchKeyword,
    },
    props,
  );
  const searchData = transformResourceDataToSearch(data);

  return {
    data: searchData,
    ...restProps,
  };
}
