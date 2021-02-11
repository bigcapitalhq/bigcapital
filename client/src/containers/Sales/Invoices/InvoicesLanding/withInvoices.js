import { connect } from 'react-redux';
import {
  getInvoicesTableStateFactory,
} from 'store/Invoice/invoices.selector';

export default (mapState) => {
  const getInvoicesTableState = getInvoicesTableStateFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      invoicesTableState: getInvoicesTableState(state, props),
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
