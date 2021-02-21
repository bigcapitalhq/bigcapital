import { connect } from 'react-redux';
import {
  setInvoicesTableState
} from 'store/Invoice/invoices.actions';

const mapDipatchToProps = (dispatch) => ({
  setInvoicesTableState: (queries) => dispatch(setInvoicesTableState(queries)),
});

export default connect(null, mapDipatchToProps);
