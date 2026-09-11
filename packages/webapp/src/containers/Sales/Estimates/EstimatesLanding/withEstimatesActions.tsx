import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setEstimatesTableState,
  resetEstimatesTableState,
  setEstimatesSelectedRows,
  resetEstimatesSelectedRows,
} from '@/store/estimate/estimates.actions';

export interface WithEstimatesActionsProps {
  setEstimatesTableState: (state: Partial<TableQuery>) => void;
  resetEstimatesTableState: () => void;
  setEstimatesSelectedRows: (selectedRows: Array<unknown>) => void;
  resetEstimatesSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithEstimatesActionsProps => ({
  setEstimatesTableState: (state: Partial<TableQuery>) =>
    dispatch(setEstimatesTableState(state)),
  resetEstimatesTableState: () => dispatch(resetEstimatesTableState()),
  setEstimatesSelectedRows: (selectedRows: Array<unknown>) =>
    dispatch(setEstimatesSelectedRows(selectedRows)),
  resetEstimatesSelectedRows: () => dispatch(resetEstimatesSelectedRows()),
});

export function withEstimatesActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithEstimatesActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithEstimatesActionsProps>
  >;
}
