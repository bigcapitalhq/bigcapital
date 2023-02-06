// @ts-nocheck
import { pick, at, mapValues } from 'lodash';

export const getItemById = (items, id) => {
  return items[id] || null;
};

export const pickItemsFromIds = (items, ids) => {
  return at(items, ids).filter(i => i);
}

export const getCurrentPageResults = (items, pages, pageNumber) => {
  const currentPage = pages[pageNumber]
  return typeof currentPage == 'undefined' ?
    [] : pickItemsFromIds(items, currentPage.ids);
}

export const getCurrentTotalResultsCount = (pagination, name) => {
  const currentPageUrl = pagination.currentPages[name]
  const currentPage = pagination.pages[currentPageUrl]
  return typeof currentPageUrl == 'undefined' ? 0 : pagination.params[currentPage.params]
}

export const getAllResults = (items, pagination, name) => {
  const currentPage = pagination.pages[pagination.currentPages[name]]
  if (typeof currentPage == 'undefined') {
    return []
  }
  let allPagesKeys = Object.keys(pagination.pages)
  let allPagesIds = []
  for (let key of allPagesKeys) {
    if (pagination.pages[key].params == currentPage.params) {
      allPagesIds = allPagesIds.concat(pagination.pages[key].ids)
    }
  }
  return Object.values(pick(items || [], allPagesIds))
}

export const paginationLocationQuery = (state, props) => {
  const queryParams = props.location
    ? new URLSearchParams(props.location.search)
    : null;

  const queryParamsKeys = ['page_size', 'page', 'custom_view_id'];

  return queryParams
    ? mapValues(pick(Object.fromEntries(queryParams), queryParamsKeys), (v) =>
        parseInt(v, 10),
      )
    : null;
}

export const defaultPaginationMeta = () => ({
  pageSize: 0,
  page: 1,
  total: 0,
  pagesCount: 0,
  pageIndex: 0,
})