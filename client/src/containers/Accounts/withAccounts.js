import { connect } from 'react-redux';
import {
  getAccountsItems,
} from 'store/accounts/accounts.selectors';
import {
  getResourceViews,
} from 'store/customViews/customViews.selectors';

const mapStateToProps = (state, props) => ({
  accountsViews: getResourceViews(state, 'accounts'),
  accounts: getAccountsItems(state, state.accounts.currentViewId),
  accountsTypes: state.accounts.accountsTypes,

  accountsTableQuery: state.accounts.tableQuery,
  accountsLoading: state.accounts.loading,
  accountErrors: state.accounts.errors,
});

export default connect(mapStateToProps);
