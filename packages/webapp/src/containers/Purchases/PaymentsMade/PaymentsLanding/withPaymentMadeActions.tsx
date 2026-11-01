import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import type { ComponentType } from 'react';
import {
  setPaymentMadesTableState,
  resetPaymentMadesTableState,
  setPaymentMadesSelectedRows,
  resetPaymentMadesSelectedRows,
} from '@/store/payment-mades/payment-mades.actions';

export interface WithPaymentMadeActionsProps {
  setPaymentMadesTableState: (state: Partial<TableQuery>) => void;
  resetPaymentMadesTableState: () => void;
  setPaymentMadesSelectedRows: (selectedRows: number[]) => void;
  resetPaymentMadesSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithPaymentMadeActionsProps => ({
  setPaymentMadesTableState: (state: Partial<TableQuery>) =>
    dispatch(setPaymentMadesTableState(state)),

  resetPaymentMadesTableState: () => dispatch(resetPaymentMadesTableState()),

  setPaymentMadesSelectedRows: (selectedRows: number[]) =>
    dispatch(setPaymentMadesSelectedRows(selectedRows)),

  resetPaymentMadesSelectedRows: () =>
    dispatch(resetPaymentMadesSelectedRows()),
});
export function withPaymentMadeActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithPaymentMadeActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithPaymentMadeActionsProps>
  >;
}
