import { createSelector } from 'reselect';
import { getItemById } from 'store/selectors';

const itemsCateogoriesDataSelector = (state) => state.itemCategories.categories;
const itemCategoryIdFromProps = (state, props) => props.itemCategoryId;

export const getItemsCategoriesListFactory = () =>
  createSelector(itemsCateogoriesDataSelector, (itemsCategories) => {
    return Object.values(itemsCategories);
  });

export const getItemCategoryByIdFactory = () => createSelector(
  itemsCateogoriesDataSelector,
  itemCategoryIdFromProps,
  (itemsCategories, itemCategoryid) => {
    return getItemById(itemsCategories, itemCategoryid);
  },
);
