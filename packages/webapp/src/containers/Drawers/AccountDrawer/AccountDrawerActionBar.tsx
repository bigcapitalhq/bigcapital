import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
  Popover,
  Menu,
  MenuItem,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import { useAccountDrawerContext } from './AccountDrawerProvider';
import {
  Icon,
  Can,
  FormattedMessage as T,
  DrawerActionsBar,
} from '@/components';
import { CLASSES } from '@/constants';
import { AccountAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import {
  withAlertActions,
  WithAlertActionsProps,
} from '@/containers/Alert/withAlertActions';
import {
  withDialogActions,
  WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';
import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { compose, safeCallback } from '@/utils';

interface AccountDrawerActionBarInnerProps
  extends WithDialogActionsProps,
    WithAlertActionsProps {}

/**
 * Account drawer action bar.
 */
function AccountDrawerActionBarInner({
  // #withDialog
  openDialog,

  // #withAlertsDialog
  openAlert,
}: AccountDrawerActionBarInnerProps) {
  // Account drawer context.
  const { account } = useAccountDrawerContext();

  if (!account) {
    return null;
  }

  // Handle new child button click.
  const onNewChildAccount = () => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.NewChild,
      parentAccountId: account.id,
      accountType: account.accountType,
    });
  };
  // Handle edit account action.
  const onEditAccount = () => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.Edit,
      accountId: account.id,
    });
  };
  // Handle delete action account.
  const onDeleteAccount = () => {
    openAlert('account-delete', { accountId: account.id });
  };
  // Handle inactivate button click.
  const handleInactivateBtnClick = () => {
    openAlert('account-inactivate', { accountId: account.id });
  };
  // Handle activate button click.
  const handleActivateBtnClick = () => {
    openAlert('account-activate', { accountId: account.id });
  };

  return (
    <DrawerActionsBar>
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
        {!account.active && (
          <>
            <NavbarDivider />
            <Button
              className={CLASSES.MINIMAL}
              text={'Activate'}
              intent={Intent.SUCCESS}
              onClick={handleActivateBtnClick}
            />
          </>
        )}
        {!!account.active && (
          <>
            <NavbarDivider />
            <Popover
              minimal={true}
              interactionKind={PopoverInteractionKind.CLICK}
              position={Position.BOTTOM_LEFT}
              modifiers={{
                offset: { offset: '0, 4' },
              }}
              content={
                <Menu>
                  <MenuItem
                    onClick={handleInactivateBtnClick}
                    text={'Inactivate'}
                  />
                </Menu>
              }
            >
              <Button
                icon={<Icon icon="more-vert" iconSize={16} />}
                minimal={true}
              />
            </Popover>
          </>
        )}
      </NavbarGroup>
    </DrawerActionsBar>
  );
}
export const AccountDrawerActionBar = compose(
  withDialogActions,
  withAlertActions,
)(AccountDrawerActionBarInner);
