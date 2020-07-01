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
  bulkActivateAccounts,
  bulkInactiveAccounts,
  editAccount,
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
  requestBulkActivateAccounts: (ids) => dispatch(bulkActivateAccounts({ ids })),
  requestBulkInactiveAccounts: (ids) => dispatch(bulkInactiveAccounts({ ids })),
  requestEditAccount: (id, form) => dispatch(editAccount(id, form)),
});

export default connect(null, mapActionsToProps);
