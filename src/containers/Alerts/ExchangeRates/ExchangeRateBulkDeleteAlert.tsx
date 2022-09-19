// @ts-nocheck
import React, { useState } from 'react';
import { FormattedMessage as T } from '@/components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { size } from 'lodash';
import { AppToaster } from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Exchange rate bulk delete alert.
 */
function ExchangeRateBulkDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { exchangeRatesIds },

  // #withAlertActions
  closeAlert,
}) {
  // handle cancel item bulk delete alert.
  const handleCancelBulkDelete = () => {
    closeAlert(name);
  };

  // handle confirm Exchange Rates bulk delete.
  // const handleConfirmBulkDelete = () => {
  //   bulkDeleteExchangeRate(exchangeRatesIds)
  //     .then(() => {
  //       AppToaster.show({
  //         message: formatMessage({
  //           id: 'the_exchange_rates_has_been_successfully_deleted',
  //         }),
  //         intent: Intent.SUCCESS,
  //       });
  //     })
  //     .catch(({ errors }) => {
  //       handleDeleteErrors(errors);
  //     });
  // };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: size(exchangeRatesIds) }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelBulkDelete}
      // onConfirm={}
      // loading={isLoading}
    >
      <p>
        <T
          id={'once_delete_these_exchange_rates_you_will_not_able_restore_them'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ExchangeRateBulkDeleteAlert);
