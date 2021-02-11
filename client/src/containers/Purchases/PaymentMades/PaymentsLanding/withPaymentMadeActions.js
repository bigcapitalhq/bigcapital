import { connect } from 'react-redux';
import { setPaymentMadesTableState } from 'store/PaymentMades/paymentMades.actions';

const mapDispatchToProps = (dispatch) => ({
  setPaymentMadesTableState: (state) =>
    dispatch(setPaymentMadesTableState(state)),
});
export default connect(null, mapDispatchToProps);
