import {connect} from 'react-redux';
import {
  fetchAccountTypes,
  fetchAccountsList,
  submitAccount,
  fetchAccount,
  editAccount,
} from 'store/accounts/accounts.actions';
import {getDialogPayload} from 'store/dashboard/dashboard.reducer';
import t from 'store/types';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'account-form');

  return {
    accountsTypes: state.accounts.accountsTypes,
    accounts: state.accounts.accounts,
    name: 'account-form',
    payload: {action: 'new', id: null},
    editAccount: dialogPayload && dialogPayload.action === 'edit' 
      ? state.accounts.accountsById[dialogPayload.id] : {},
  };
};

export const mapDispatchToProps = (dispatch) => ({
  submitAccount: ({ form }) => dispatch(submitAccount({ form })),
  fetchAccounts: () => dispatch(fetchAccountsList()),
  fetchAccountTypes: () => dispatch(fetchAccountTypes()),
  fetchAccount: (id) => dispatch(fetchAccount({ id })),
});
export default connect(mapStateToProps, mapDispatchToProps);