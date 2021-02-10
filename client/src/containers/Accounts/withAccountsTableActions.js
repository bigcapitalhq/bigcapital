import { connect } from 'react-redux';
import { setAccountsTableState } from 'store/accounts/accounts.actions';

const mapActionsToProps = (dispatch) => ({
  setAccountsTableState: (queries) => dispatch(setAccountsTableState(queries)),
});

export default connect(null, mapActionsToProps);
