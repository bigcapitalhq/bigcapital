import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setWarehouseTransferTableState,
  resetWarehouseTransferTableState,
} from '@/store/warehouse-transfer/warehouse-transfer.actions';

export interface WithWarehouseTransfersActionsProps {
  setWarehouseTransferTableState: (queries: Partial<TableQuery>) => void;
  resetWarehouseTransferTableState: () => void;
}

export const mapDipatchToProps = (
  dispatch: Dispatch,
): WithWarehouseTransfersActionsProps => ({
  setWarehouseTransferTableState: (queries: Partial<TableQuery>) =>
    dispatch(setWarehouseTransferTableState(queries)),
  resetWarehouseTransferTableState: () =>
    dispatch(resetWarehouseTransferTableState()),
});

export function withWarehouseTransfersActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithWarehouseTransfersActionsProps>> {
  const Connected = connect(
    null,
    mapDipatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithWarehouseTransfersActionsProps>
  >;
}
