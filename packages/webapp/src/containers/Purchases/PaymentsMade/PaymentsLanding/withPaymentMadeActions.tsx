// @ts-nocheck
import { connect } from 'react-redux';
import {
  setPaymentMadesTableState,
  resetPaymentMadesTableState,
} from '@/store/payment-mades/payment-mades.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentMadesTableState: (state) =>
    dispatch(setPaymentMadesTableState(state)),

  resetPaymentMadesTableState: () => dispatch(resetPaymentMadesTableState()),
});
export const withPaymentMadeActions = connect(null, mapDispatchToProps);
