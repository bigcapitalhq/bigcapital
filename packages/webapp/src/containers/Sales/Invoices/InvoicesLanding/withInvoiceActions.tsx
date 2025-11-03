// @ts-nocheck
import { connect } from 'react-redux';
import {
  setInvoicesTableState,
  resetInvoicesTableState,
  setInvoicesSelectedRows,
} from '@/store/Invoice/invoices.actions';

const mapDipatchToProps = (dispatch) => ({
  setInvoicesTableState: (queries) => dispatch(setInvoicesTableState(queries)),
  resetInvoicesTableState: () => dispatch(resetInvoicesTableState()),
  setInvoicesSelectedRows: (selectedRows) => dispatch(setInvoicesSelectedRows(selectedRows)),
});

export default connect(null, mapDipatchToProps);
