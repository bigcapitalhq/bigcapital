// @ts-nocheck
import { connect } from 'react-redux';
import {
  setAccountsTableState,
  resetAccountsTableState,
} from '@/store/accounts/accounts.actions';

const mapActionsToProps = (dispatch) => ({
  setAccountsTableState: (queries) => dispatch(setAccountsTableState(queries)),
  resetAccountsTableState: () => dispatch(resetAccountsTableState()),
});

export default connect(null, mapActionsToProps);
