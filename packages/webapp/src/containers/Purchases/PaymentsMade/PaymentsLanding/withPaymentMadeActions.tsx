import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
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
export const withPaymentMadeActions = connect(null, mapDispatchToProps);
