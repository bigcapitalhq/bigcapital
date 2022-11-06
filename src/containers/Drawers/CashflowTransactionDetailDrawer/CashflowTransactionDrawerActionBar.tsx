// @ts-nocheck
import React from 'react';
import { Button, Classes, NavbarGroup, Intent } from '@blueprintjs/core';
import {
  Can,
  FormattedMessage as T,
  DrawerActionsBar,
  Icon,
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
  const { referenceId } = useCashflowTransactionDrawerContext();

  // Handle cashflow transaction delete action.
  const handleDeleteCashflowTransaction = () => {
    openAlert('account-transaction-delete', { referenceId });
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
        </NavbarGroup>
      </DrawerActionsBar>
    </Can>
  );
}

export default compose(withAlertsActions)(CashflowTransactionDrawerActionBar);
