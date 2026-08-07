import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setItemsTableState,
  resetItemsTableState,
  setItemsSelectedRows,
} from '@/store/items/items.actions';

export interface WithItemsActionsProps {
  setItemsTableState: (queries: Partial<TableQuery>) => void;
  resetItemsTableState: () => void;
  setItemsSelectedRows: (selectedRows: Array<unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithItemsActionsProps => ({
  setItemsTableState: (queries) => dispatch(setItemsTableState(queries)),
  resetItemsTableState: () => dispatch(resetItemsTableState()),
  setItemsSelectedRows: (selectedRows) =>
    dispatch(setItemsSelectedRows(selectedRows)),
});

export function withItemsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithItemsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithItemsActionsProps>
  >;
}
