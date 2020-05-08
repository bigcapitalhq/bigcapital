import { connect } from 'react-redux';
import t from 'store/types';
import {
  fetchAccountsTable,
} from 'store/accounts/accounts.actions';

const mapActionsToProps = (dispatch) => ({
  requestFetchAccountsTable: (query = {}) => dispatch(fetchAccountsTable({ query: { ...query } })),
  changeAccountsCurrentView: (id) => dispatch({
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

export default connect(null, mapActionsToProps);