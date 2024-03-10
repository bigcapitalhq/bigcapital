// @ts-nocheck
import React from 'react';
import {
  Button,
  Classes,
  NavbarGroup,
  Intent,
  NavbarDivider,
} from '@blueprintjs/core';
import {
  Can,
  FormattedMessage as T,
  DrawerActionsBar,
  Icon,
  If,
} from '@/components';
import withAlertsActions from '@/containers/Alert/withAlertActions';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import { AbilitySubject, CashflowAction } from '@/constants/abilityOption';
import { compose } from '@/utils';

/**
 * Cashflow transaction drawer action bar.
 */
function CashflowTransactionDrawerActionBar({
  // #withAlertsDialog
  openAlert,
}) {
  const { referenceId, cashflowTransaction } =
    useCashflowTransactionDrawerContext();

  // Handle cashflow transaction delete action.
  const handleDeleteCashflowTransaction = () => {
    openAlert('account-transaction-delete', { referenceId });
  };

  // Handles the uncategorize button click.
  const handleUncategorizeBtnClick = () => {
    openAlert('cashflow-tranaction-uncategorize', {
      uncategorizedTransactionId:
        cashflowTransaction.uncategorized_transaction_id,
    });
  };

  return (
    <Can I={CashflowAction.Delete} a={AbilitySubject.Cashflow}>
      <DrawerActionsBar>
        <NavbarGroup>
          <Button
            className={Classes.MINIMAL}
            icon={<Icon icon="trash-16" iconSize={16} />}
            text={<T id={'delete'} />}
            intent={Intent.DANGER}
            onClick={handleDeleteCashflowTransaction}
          />
          <If condition={cashflowTransaction.uncategorized_transaction_id}>
            <NavbarDivider />
            <Button
              text={'Uncategorize'}
              onClick={handleUncategorizeBtnClick}
              className={Classes.MINIMAL}
            />
          </If>
        </NavbarGroup>
      </DrawerActionsBar>
    </Can>
  );
}

export default compose(withAlertsActions)(CashflowTransactionDrawerActionBar);
