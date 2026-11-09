import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setItemsCategoriesTableState,
  setItemsCategoriesSelectedRows,
  resetItemsCategoriesSelectedRows,
} from '@/store/item-categories/items-category.actions';

export interface WithItemCategoriesActionsProps {
  setItemsCategoriesTableState: (state: Partial<TableQuery>) => void;
  setItemsCategoriesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetItemsCategoriesSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithItemCategoriesActionsProps => ({
  setItemsCategoriesTableState: (state: Partial<TableQuery>) =>
    dispatch(setItemsCategoriesTableState(state)),
  setItemsCategoriesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setItemsCategoriesSelectedRows(selectedRows)),
  resetItemsCategoriesSelectedRows: () =>
    dispatch(resetItemsCategoriesSelectedRows()),
});

export function withItemCategoriesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithItemCategoriesActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithItemCategoriesActionsProps>
  >;
}
