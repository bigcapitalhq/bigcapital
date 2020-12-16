import { connect } from 'react-redux';
import {
  getAccountsItems,
  getAccountsListFactory,
  getAccountsTableQuery,
} from 'store/accounts/accounts.selectors';
import { getResourceViews } from 'store/customViews/customViews.selectors';

export default (mapState) => {
  const getAccountsList = getAccountsListFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      accountsViews: getResourceViews(state, props, 'accounts'),
      accountsTable: getAccountsItems(state, props),
      accountsList: getAccountsList(state, props),
      accountsTypes: state.accounts.accountsTypes,
      accountsTableQuery: state.accounts.tableQuery,
      accountsLoading: state.accounts.loading,
      accountErrors: state.accounts.errors,
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
