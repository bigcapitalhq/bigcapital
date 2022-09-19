// @ts-nocheck
import { connect } from 'react-redux';
import {
  setPaymentMadesTableState,
  resetPaymentMadesTableState,
} from '@/store/PaymentMades/paymentMades.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentMadesTableState: (state) =>
    dispatch(setPaymentMadesTableState(state)),

  resetPaymentMadesTableState: () => dispatch(resetPaymentMadesTableState()),
});
export default connect(null, mapDispatchToProps);
