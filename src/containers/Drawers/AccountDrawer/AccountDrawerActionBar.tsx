import React from 'react';
import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import { Icon, Can, FormattedMessage as T } from '@/components';
import { AccountAction, AbilitySubject } from '@/common/abilityOption';
import DashboardActionsBar from '@/components/Dashboard/DashboardActionsBar';

import withDialogActions from '@/containers/Dialog/withDialogActions';
import withAlertsActions from '@/containers/Alert/withAlertActions';

import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { useAccountDrawerContext } from './AccountDrawerProvider';
import { compose, safeCallback } from '@/utils';

/**
 * Account drawer action bar.
 */
function AccountDrawerActionBar({
  // #withDialog
  openDialog,

  // #withAlertsDialog
  openAlert,
}) {
  // Account drawer context.
  const { account } = useAccountDrawerContext();

  // Handle new child button click.
  const onNewChildAccount = () => {
    openDialog('account-form', {
      action: AccountDialogAction.NewChild,
      parentAccountId: account.id,
      accountType: account.account_type,
    });
  };
  // Handle edit account action.
  const onEditAccount = () => {
    openDialog('account-form', {
      action: AccountDialogAction.Edit,
      id: account.id,
    });
  };
  // Handle delete action account.
  const onDeleteAccount = () => {
    openAlert('account-delete', { accountId: account.id });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={AccountAction.Edit} a={AbilitySubject.Account}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="pen-18" />}
            text={<T id={'edit_account'} />}
            onClick={safeCallback(onEditAccount)}
          />

          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="plus" />}
            text={<T id={'new_child_account'} />}
            onClick={safeCallback(onNewChildAccount)}
          />
          <NavbarDivider />
        </Can>
        <Can I={AccountAction.Delete} a={AbilitySubject.Account}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'trash-16'} iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={safeCallback(onDeleteAccount)}
          />
        </Can>
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
export default compose(
  withDialogActions,
  withAlertsActions,
)(AccountDrawerActionBar);
