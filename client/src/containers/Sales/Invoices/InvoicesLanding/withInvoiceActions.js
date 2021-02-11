import { connect } from 'react-redux';
import {
  setInvoicesTableState
} from 'store/Invoice/invoices.actions';

const mapDipatchToProps = (dispatch) => ({
  setInvoicesTableState: (query) => setInvoicesTableState(query),
});

export default connect(null, mapDipatchToProps);
