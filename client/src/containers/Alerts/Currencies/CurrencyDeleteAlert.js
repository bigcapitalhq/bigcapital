import React from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';

import { useDeleteCurrency } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Currency delete alerts.
 */
function CurrencyDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { currency_code },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const { mutateAsync: deleteCurrency, isLoading } = useDeleteCurrency();

  // handle cancel delete currency alert.
  const handleCancelCurrencyDelete = () => closeAlert(name);

  // handle alert confirm delete currency.
  const handleConfirmCurrencyDelete = () => {
    deleteCurrency(currency_code)
      .then((response) => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_currency_has_been_deleted_successfully',
          }),
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
      onCancel={handleCancelCurrencyDelete}
      onConfirm={handleConfirmCurrencyDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_currency_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CurrencyDeleteAlert);
