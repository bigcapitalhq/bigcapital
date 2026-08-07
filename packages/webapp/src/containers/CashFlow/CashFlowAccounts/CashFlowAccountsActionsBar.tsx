import {
  Button,
  NavbarGroup,
  Classes,
  NavbarDivider,
  Alignment,
  Switch,
} from '@blueprintjs/core';
import React from 'react';
import { withCashflowAccountsTableActions } from '../AccountTransactions/withCashflowAccountsTableActions';
import type { WithCashflowAccountsTableActionsProps } from '../AccountTransactions/withCashflowAccountsTableActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import {
  DashboardActionsBar,
  Can,
  Icon,
  FormattedMessage as T,
  FeatureCan,
} from '@/components';
import { ACCOUNT_TYPE, Features } from '@/constants';
import { CashflowAction, AbilitySubject } from '@/constants/abilityOption';
import { DialogsName } from '@/constants/dialogs';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { AccountDialogAction } from '@/containers/Dialogs/AccountDialog/utils';
import { useRefreshCashflowAccounts } from '@/hooks/query';
import { useOpenPlaidConnect } from '@/hooks/utils/useOpenPlaidConnect';
import { CreditCard2Icon } from '@/icons/CreditCard2';
import { compose } from '@/utils';

interface CashFlowAccountsActionsBarInnerProps
  extends Pick<WithDialogActionsProps, 'openDialog'>,
    Pick<
      WithCashflowAccountsTableActionsProps,
      'setCashflowAccountsTableState'
    > {}

/**
 * Cash Flow accounts actions bar.
 */
function CashFlowAccountsActionsBarInner({
  // #withDialogActions
  openDialog,

  // #withCashflowAccountsTableActions
  setCashflowAccountsTableState,
}: CashFlowAccountsActionsBarInnerProps) {
  const { refresh } = useRefreshCashflowAccounts();

  // Opens the Plaid popup.
  const { openPlaidAsync, isPlaidLoading } = useOpenPlaidConnect();

  // Handle refresh button click.
  const handleRefreshBtnClick = () => {
    refresh();
  };
  // Handle add cash account.
  const handleAddCashAccount = () => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.NewDefinedType,
      accountType: ACCOUNT_TYPE.CASH,
    });
  };
  // Handle add bank account.
  const handleAddBankAccount = () => {
    openDialog(DialogsName.AccountForm, {
      action: AccountDialogAction.NewDefinedType,
      accountType: ACCOUNT_TYPE.BANK,
    });
  };
  // Handle inactive switch changing.
  const handleInactiveSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked;
    setCashflowAccountsTableState({ inactiveMode: checked });
  };
  // Handle connect button click.
  const handleConnectToBank = () => {
    openPlaidAsync();
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Can I={CashflowAction.Create} a={AbilitySubject.Cashflow}>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus-24'} iconSize={20} />}
            text={<T id={'banking.label.add_cash_account'} />}
            onClick={handleAddCashAccount}
          />
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon={'plus-24'} iconSize={20} />}
            text={<T id={'banking.label.add_bank_account'} />}
            onClick={handleAddBankAccount}
          />
          <NavbarDivider />
        </Can>
        <NavbarDivider />
        <Can
          // @ts-expect-error latent bug — CashflowAction.Edit is not defined in
          // the constants file; runtime receives `undefined`.
          I={CashflowAction.Edit}
          a={AbilitySubject.Cashflow}
        >
          <Switch
            labelElement={<T id={'inactive'} />}
            defaultChecked={false}
            onChange={handleInactiveSwitchChange}
          />
        </Can>
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <FeatureCan feature={Features.BankSyncing}>
          <Button
            className={Classes.MINIMAL}
            text={'Connect Bank/Credit Card'}
            icon={<CreditCard2Icon />}
            onClick={handleConnectToBank}
            disabled={isPlaidLoading}
          />
          <NavbarDivider />
        </FeatureCan>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="refresh-16" iconSize={14} />}
          onClick={handleRefreshBtnClick}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
export const CashFlowAccountsActionsBar = compose(
  withDialogActions,
  withCashflowAccountsTableActions,
)(CashFlowAccountsActionsBarInner);
