import { Intent, Alert } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { WithDrawerActionsProps } from '@/containers/Drawer/withDrawerActions';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withDrawerActions } from '@/containers/Drawer/withDrawerActions';
import { useDeleteBankRule } from '@/hooks/query/banking';

interface BankRuleDeleteAlertPayload {
  id: number;
}

interface BankRuleDeleteAlertProps
  extends WithAlertActionsProps,
    WithDrawerActionsProps {
  name: string;
  isOpen: boolean;
  payload: BankRuleDeleteAlertPayload;
}

/**
 * Project delete alert.
 */
function BankRuleDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { id },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}: BankRuleDeleteAlertProps) {
  const deleteBankRuleMutation = useDeleteBankRule();
  const { mutateAsync: deleteBankRule } = deleteBankRuleMutation;

  // Latent bug (behavior preserved): TanStack Query v5 renamed the mutation
  // result's `isLoading` to `isPending`, so reading `isLoading` here has always
  // yielded `undefined` and the alert never rendered a loading state. Keep
  // reading it through a cast so the rendering behavior stays identical.
  const isLoading = (deleteBankRuleMutation as { isLoading?: boolean })
    .isLoading;

  // handle cancel delete project alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete project
  const handleConfirmBtnClick = () => {
    deleteBankRule(id)
      .then(() => {
        AppToaster.show({
          message: 'The bank rule has deleted successfully.',
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(({ data: { errors } }) => {
        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={'Delete'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmBtnClick}
      loading={isLoading}
    >
      <p data-testId={'bank-rule-delete-alert'}>
        Are you sure want to delete the bank rule?
      </p>
    </Alert>
  );
}

export const DeleteBankRuleAlert = FF.pipe(
  BankRuleDeleteAlert,
  withDrawerActions,
  withAlertActions,
  withAlertStoreConnect(),
);
