// @ts-nocheck
import { connect } from 'react-redux';
import {
  setInvoicesTableState,
  resetInvoicesTableState,
  setInvoicesSelectedRows,
  resetInvoicesSelectedRows,
} from '@/store/Invoice/invoices.actions';

const mapDipatchToProps = (dispatch) => ({
  setInvoicesTableState: (queries) => dispatch(setInvoicesTableState(queries)),
  resetInvoicesTableState: () => dispatch(resetInvoicesTableState()),
  setInvoicesSelectedRows: (selectedRows) => dispatch(setInvoicesSelectedRows(selectedRows)),
  resetInvoicesSelectedRows: () => dispatch(resetInvoicesSelectedRows()),
});

export default connect(null, mapDipatchToProps);
