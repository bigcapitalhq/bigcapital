// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T, FormattedHTMLMessage } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeleteExchangeRate } from '@/hooks/query';
import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * exchange rate delete alerts.
 */
function ExchangeRateDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { exchangeRateId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteExchangeRate, isLoading } = useDeleteExchangeRate();

  // Handle cancel delete exchange rate alert.
  const handleCancelExchangeRateDelete = () => closeAlert(name);

  const handelConfirmExchangeRateDelete = () => {
    deleteExchangeRate(exchangeRateId)
      .then((response) => {
        AppToaster.show({
          message: intl.get('the_exchange_rates_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelExchangeRateDelete}
      onConfirm={handelConfirmExchangeRateDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage id={'once_delete_this_exchange_rate_you_will_able_to_restore_it'} />
      </p>
    </Alert>
  );
}

export default compose(withAlertStoreConnect(), withAlertActions)(ExchangeRateDeleteAlert);
