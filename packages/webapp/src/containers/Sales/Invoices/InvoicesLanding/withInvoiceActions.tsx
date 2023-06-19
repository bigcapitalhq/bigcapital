// @ts-nocheck
import { connect } from 'react-redux';
import {
  setInvoicesTableState,
  resetInvoicesTableState
} from '@/store/Invoice/invoices.actions';

const mapDispatchToProps = (dispatch) => ({
  setInvoicesTableState: (queries) => dispatch(setInvoicesTableState(queries)),
  resetInvoicesTableState: () => dispatch(resetInvoicesTableState()),
});

export default connect(null, mapDispatchToProps);
