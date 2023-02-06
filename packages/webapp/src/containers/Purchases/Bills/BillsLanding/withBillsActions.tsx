// @ts-nocheck
import { connect } from 'react-redux';
import {
  setBillsTableState,
  resetBillsTableState,
} from '@/store/Bills/bills.actions';

const mapDispatchToProps = (dispatch) => ({
  setBillsTableState: (queries) => dispatch(setBillsTableState(queries)),
  resetBillsTableState: () => dispatch(resetBillsTableState()),
});

export default connect(null, mapDispatchToProps);
