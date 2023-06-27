// @ts-nocheck
import { connect } from 'react-redux';
import {
  setPaymentsMadeTableState,
  resetPaymentsMadeTableState,
} from '@/store/PaymentsMade/paymentsMade.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentsMadeTableState: (state) =>
    dispatch(setPaymentsMadeTableState(state)),

  resetPaymentsMadeTableState: () => dispatch(resetPaymentsMadeTableState()),
});
export default connect(null, mapDispatchToProps);
