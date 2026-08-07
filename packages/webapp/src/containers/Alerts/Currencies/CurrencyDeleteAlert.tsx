import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useDeleteCurrency } from '@/hooks/query';
import { compose } from '@/utils';

interface CurrencyDeleteAlertPayload {
  currency_code: string;
}

interface CurrencyDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: CurrencyDeleteAlertPayload;
}

interface CurrencyDeleteError {
  type: string;
}

/**
 * Currency delete alerts.
 */
function CurrencyDeleteAlertInner({
  name,
  isOpen,
  payload: { currency_code },
  closeAlert,
}: CurrencyDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteCurrency, isPending: isLoading } =
    useDeleteCurrency();

  const handleCancelCurrencyDelete = () => closeAlert(name);

  const handleConfirmCurrencyDelete = () => {
    deleteCurrency(currency_code)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_currency_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({ data: { errors } }: { data: { errors: CurrencyDeleteError[] } }) => {
          if (errors.find((e) => e.type === 'CANNOT_DELETE_BASE_CURRENCY')) {
            AppToaster.show({
              intent: Intent.DANGER,
              message: 'Cannot delete the base currency.',
            });
          }
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelCurrencyDelete}
      onConfirm={handleConfirmCurrencyDelete}
      loading={isLoading}
    >
      <p>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage
          id={'once_delete_this_currency_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export const CurrencyDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CurrencyDeleteAlertInner);
