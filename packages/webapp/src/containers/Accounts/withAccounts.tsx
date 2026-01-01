// @ts-nocheck
import { connect } from 'react-redux';
import {
  getAccountsTableStateFactory,
  accountsTableStateChangedFactory,
} from '@/store/accounts/accounts.selectors';

export const withAccounts = (mapState) => {
  const getAccountsTableState = getAccountsTableStateFactory();
  const accountsTableStateChanged = accountsTableStateChangedFactory();

  const mapStateToProps = (state, props) => {
    const mapped = {
      accountsTableState: getAccountsTableState(state, props),
      accountsTableStateChanged: accountsTableStateChanged(state, props),
      accountsSelectedRows: state.accounts?.selectedRows || [],
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };

  return connect(mapStateToProps);
};
