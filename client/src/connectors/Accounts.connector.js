import { connect } from 'react-redux';
import t from 'store/types';
import {
  fetchAccountTypes,
  fetchAccountsList,
  deleteAccount,
  inactiveAccount,
  fetchAccountsTable,
  submitAccount,
  fetchAccount,
  deleteBulkAccounts,
} from 'store/accounts/accounts.actions';
import {
  getAccountsItems,
} from 'store/accounts/accounts.selectors';
import {
  getResourceViews,
} from 'store/customViews/customViews.selectors';
import {
  getItemById
} from 'store/selectors';

const mapStateToProps = (state, props) => ({
  views: getResourceViews(state, 'accounts'),
  accounts: getAccountsItems(state, state.accounts.currentViewId),
  accountsTypes: state.accounts.accountsTypes,

  tableQuery: state.accounts.tableQuery,
  accountsLoading: state.accounts.loading,
  accountErrors: state.accounts.errors,

  getAccountById: (id) => getItemById(state.accounts.items, id),
});

const mapActionsToProps = (dispatch) => ({
  requestFetchAccounts: (query) => dispatch(fetchAccountsList({ query })),
  requestFetchAccountTypes: () => dispatch(fetchAccountTypes()),
  requestSubmitAccount: ({ form }) => dispatch(submitAccount({ form })),
  requestDeleteAccount: (id) => dispatch(deleteAccount({ id })),
  requestInactiveAccount: (id) => dispatch(inactiveAccount({ id })),
  requestFetchAccount: (id) => dispatch(fetchAccount({ id })),
  requestFetchAccountsTable: (query = {}) => dispatch(fetchAccountsTable({ query: { ...query } })),
  requestDeleteBulkAccounts: (ids) => dispatch(deleteBulkAccounts({ ids })),

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
  setSelectedRowsAccounts: (ids) => dispatch({
    type: t.ACCOUNTS_SELECTED_ROWS_SET, payload: { ids },
  }),
});

export default connect(mapStateToProps, mapActionsToProps);