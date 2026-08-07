import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import { setItemsCategoriesTableState } from '@/store/item-categories/items-category.actions';

export interface WithItemCategoriesActionsProps {
  setItemsCategoriesTableState: (state: Partial<TableQuery>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithItemCategoriesActionsProps => ({
  setItemsCategoriesTableState: (state: Partial<TableQuery>) =>
    dispatch(setItemsCategoriesTableState(state)),
});

export const withItemCategoriesActions = connect(null, mapDispatchToProps);
