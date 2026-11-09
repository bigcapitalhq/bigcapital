import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import { setInventoryAdjustmentsTableState } from '@/store/inventory-adjustments/inventory-adjustment.actions';

export interface WithInventoryAdjustmentActionsProps {
  setInventoryAdjustmentTableState: (queries: Partial<TableQuery>) => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithInventoryAdjustmentActionsProps => ({
  setInventoryAdjustmentTableState: (queries) =>
    dispatch(setInventoryAdjustmentsTableState(queries)),
});

export function withInventoryAdjustmentActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithInventoryAdjustmentActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithInventoryAdjustmentActionsProps>
  >;
}
