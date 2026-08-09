import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setItemsCategoriesTableState,
  setItemsCategoriesSelectedRows,
} from '@/store/item-categories/items-category.actions';

export interface WithItemCategoriesActionsProps {
  setItemsCategoriesTableState: (state: Partial<TableQuery>) => void;
  setItemsCategoriesSelectedRows: (selectedRows: Array<unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithItemCategoriesActionsProps => ({
  setItemsCategoriesTableState: (state: Partial<TableQuery>) =>
    dispatch(setItemsCategoriesTableState(state)),
  setItemsCategoriesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setItemsCategoriesSelectedRows(selectedRows)),
});

export const withItemCategoriesActions = connect(null, mapDispatchToProps);
