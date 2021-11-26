import React from 'react';
import Icon from 'components/Icon';
import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import { Can, FormattedMessage as T } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { safeCallback } from 'utils';
import { AccountAction, AbilitySubject } from '../../../common/abilityOption';

import { compose } from 'utils';
import { useAccountDrawerContext } from './AccountDrawerProvider';

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
      action: 'new_child',
      parentAccountId: account.id,
      accountType: account.account_type,
    });
  };

  // Handle edit account action.
  const onEditAccount = () => {
    openDialog('account-form', { action: 'edit', id: account.id });
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
