import { connect } from 'react-redux';
import {
  fetchAccountTypes,
  fetchAccountsList,
  deleteAccount,
  inactiveAccount,
  activateAccount,
  submitAccount,
  fetchAccount,
  deleteBulkAccounts,
} from 'store/accounts/accounts.actions';

const mapActionsToProps = (dispatch) => ({
  requestFetchAccounts: (query) => dispatch(fetchAccountsList({ query })),
  requestFetchAccountTypes: () => dispatch(fetchAccountTypes()),
  requestSubmitAccount: ({ form }) => dispatch(submitAccount({ form })),
  requestDeleteAccount: (id) => dispatch(deleteAccount({ id })),
  requestInactiveAccount: (id) => dispatch(inactiveAccount({ id })),
  requestActivateAccount: (id) => dispatch(activateAccount({ id })),
  requestFetchAccount: (id) => dispatch(fetchAccount({ id })),
  requestDeleteBulkAccounts: (ids) => dispatch(deleteBulkAccounts({ ids })),
});

export default connect(null, mapActionsToProps);