import {pick} from 'lodash';

export const pickItemsFromIds = (items, ids) => {
  return Object.values(pick(items, ids));
}

export const getCurrentPageResults = (items, page, name) => {
  const currentPage = page.pages[page.currentPages[name]]
  return typeof currentPage == 'undefined' ? [] : Object.values(pick(items || [], currentPage.ids))
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