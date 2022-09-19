// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCashflowAccountsTableState,
  resetCashflowAccountsTableState,
} from '@/store/CashflowAccounts/CashflowAccounts.actions';

const mapActionsToProps = (dispatch) => ({
  setCashflowAccountsTableState: (queries) =>
    dispatch(setCashflowAccountsTableState(queries)),

  resetCashflowAccountsTableState: () =>
    dispatch(resetCashflowAccountsTableState()),
});

export default connect(null, mapActionsToProps);
