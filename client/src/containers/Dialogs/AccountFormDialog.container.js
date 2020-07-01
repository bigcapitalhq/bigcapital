import { connect } from 'react-redux';
import { compose } from 'utils';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDialogRedux from 'components/DialogReduxConnect';
import withAccountsActions from 'containers/Accounts/withAccountsActions';
import withAccountDetail from 'containers/Accounts/withAccountDetail';
import withAccounts from 'containers/Accounts/withAccounts';

export const mapStateToProps = (state, props) => ({
  dialogName: 'account-form',
});
const AccountFormDialogConnect = connect(mapStateToProps);

export default compose(
  AccountFormDialogConnect,
  withDialogRedux(null, 'account-form'),
  withAccountsActions,
  withAccountDetail,
  withAccounts(({ accountsTypes, accounts }) => ({
    accountsTypes,
    accounts,
  })),
  withDialogActions,
);
