import { connect } from 'react-redux';
import { setPaymentReceivesTableState } from 'store/PaymentReceives/paymentReceives.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentReceivesTableState: (state) =>
    dispatch(setPaymentReceivesTableState(state)),
});

export default connect(null, mapDispatchToProps);
