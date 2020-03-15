import { connect } from 'react-redux';
import {useParams} from 'react-router-dom';
import t from 'store/types';
import {
  fetchAccountTypes,
  fetchAccountsList,
  deleteAccount,
  inactiveAccount,
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
});

const mapActionsToProps = (dispatch) => ({
  fetchAccounts: (query) => dispatch(fetchAccountsList({ query })),
  fetchAccountTypes: () => dispatch(fetchAccountTypes()),
  deleteAccount: (id) => dispatch(deleteAccount({ id })),
  inactiveAccount: (id) => dispatch(inactiveAccount({ id })),
  addBulkActionAccount: (id) => dispatch({
    type: t.ACCOUNT_BULK_ACTION_ADD, account_id: id
  }),
  removeBulkActionAccount: (id) => dispatch({
    type: t.ACCOUNT_BULK_ACTION_REMOVE, account_id: id,
  }),
  changeCurrentView: (id) => dispatch({
    type: t.ACCOUNTS_SET_CURRENT_VIEW,
    currentViewId: parseInt(id, 10),
  }),
});

export default connect(mapStateToProps, mapActionsToProps);