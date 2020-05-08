import {connect} from 'react-redux';
import { compose } from 'utils';
import DialogConnect from 'connectors/Dialog.connector';
import DialogReduxConnect from 'components/DialogReduxConnect';
import {getDialogPayload} from 'store/dashboard/dashboard.reducer';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountDetail from 'containers/Accounts/withAccountDetail';
import withAccounts from 'containers/Accounts/withAccounts';

export const mapStateToProps = (state, props) => {
  const dialogPayload = getDialogPayload(state, 'account-form');

  return {
    name: 'account-form',
    payload: {action: 'new', id: null, ...dialogPayload},

    accountId: dialogPayload?.id || null,
  };
};

const AccountFormDialogConnect = connect(mapStateToProps);

export default compose(
  AccountFormDialogConnect,
  withAccountsActions,
  withAccountDetail,
  withAccounts,
  DialogReduxConnect,
  DialogConnect,
);
