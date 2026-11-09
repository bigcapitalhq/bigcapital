import { pick, at, mapValues } from 'lodash';

export const getItemById = (
  items: Record<string, unknown>,
  id: string | number,
) => {
  return items[id] || null;
};

export const pickItemsFromIds = (
  items: Record<string, unknown>,
  ids: Array<string | number>,
) => {
  return at(items, ids as string[]).filter((i) => i);
};

export const getCurrentPageResults = (
  items: Record<string, unknown>,
  pages: Record<number, { ids: Array<string | number> }>,
  pageNumber: number,
) => {
  const currentPage = pages[pageNumber];
  return typeof currentPage === 'undefined'
    ? []
    : pickItemsFromIds(items, currentPage.ids);
};

export const getCurrentTotalResultsCount = (
  pagination: {
    currentPages: Record<string, string>;
    pages: Record<string, { params: string }>;
    params: Record<string, number>;
  },
  name: string,
) => {
  const currentPageUrl = pagination.currentPages[name];
  const currentPage = pagination.pages[currentPageUrl];
  return typeof currentPageUrl === 'undefined'
    ? 0
    : pagination.params[currentPage.params];
};

export const getAllResults = (
  items: Record<string, unknown>,
  pagination: {
    currentPages: Record<string, string>;
    pages: Record<string, { ids: Array<string | number>; params: string }>;
  },
  name: string,
) => {
  const currentPage = pagination.pages[pagination.currentPages[name]];
  if (typeof currentPage === 'undefined') {
    return [];
  }
  const allPagesKeys = Object.keys(pagination.pages);
  let allPagesIds: Array<string | number> = [];
  for (const key of allPagesKeys) {
    if (pagination.pages[key].params === currentPage.params) {
      allPagesIds = allPagesIds.concat(pagination.pages[key].ids);
    }
  }
  return Object.values(pick(items || {}, allPagesIds as string[]));
};

export const paginationLocationQuery = (
  state: unknown,
  props: { location?: { search: string } },
) => {
  const queryParams = props.location
    ? new URLSearchParams(props.location.search)
    : null;

  const queryParamsKeys = ['page_size', 'page', 'custom_view_id'];

  return queryParams
    ? mapValues(pick(Object.fromEntries(queryParams), queryParamsKeys), (v) =>
        parseInt(v, 10),
      )
    : null;
};

export const defaultPaginationMeta = () => ({
  pageSize: 0,
  page: 1,
  total: 0,
  pagesCount: 0,
  pageIndex: 0,
});
