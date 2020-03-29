import { connect } from 'react-redux';
import t from 'store/types';
import {
  fetchAccountTypes,
  fetchAccountsList,
  deleteAccount,
  inactiveAccount,
  fetchAccountsTable,
} from 'store/accounts/accounts.actions';
import {
  getAccountsItems,
} from 'store/accounts/accounts.selectors';
import {
  getResourceViews,
} from 'store/customViews/customViews.selectors';

const mapStateToProps = (state, props) => ({
  views: getResourceViews(state, 'accounts'),
  accounts: getAccountsItems(state, state.accounts.currentViewId),
  tableQuery: state.accounts.tableQuery,
  accountsLoading: state.accounts.loading,
});

const mapActionsToProps = (dispatch) => ({
  fetchAccounts: (query) => dispatch(fetchAccountsList({ query })),
  fetchAccountTypes: () => dispatch(fetchAccountTypes()),
  requestDeleteAccount: (id) => dispatch(deleteAccount({ id })),
  requestInactiveAccount: (id) => dispatch(inactiveAccount({ id })),
  changeCurrentView: (id) => dispatch({
    type: t.ACCOUNTS_SET_CURRENT_VIEW,
    currentViewId: parseInt(id, 10),
  }),

  setAccountsTableQuery: (key, value) => dispatch({
    type: 'ACCOUNTS_TABLE_QUERY_SET', key, value,
  }),
  addAccountsTableQueries: (queries) => dispatch({
    type: 'ACCOUNTS_TABLE_QUERIES_ADD', queries,
  }),

  fetchAccountsTable: (query = {}) => dispatch(fetchAccountsTable({ query: { ...query } })),

  setSelectedRowsAccounts: (ids) => dispatch({
    type: t.ACCOUNTS_SELECTED_ROWS_SET, ids,
  }),
});

export default connect(mapStateToProps, mapActionsToProps);