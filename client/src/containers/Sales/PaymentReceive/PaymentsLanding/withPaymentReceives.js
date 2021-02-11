import { connect } from 'react-redux';
import {
  getPaymentReceiveTableStateFactory
} from 'store/PaymentReceives/paymentReceives.selector';

export default (mapState) => {
  const getPaymentReceiveTableState = getPaymentReceiveTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      paymentReceivesTableState: getPaymentReceiveTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
