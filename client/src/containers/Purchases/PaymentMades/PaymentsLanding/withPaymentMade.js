import { connect } from 'react-redux';
import {
  getPaymentMadesTableStateFactory
} from 'store/PaymentMades/paymentMades.selector';

export default (mapState) => {
  const getPaymentMadesTableState = getPaymentMadesTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      paymentMadesTableState: getPaymentMadesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
