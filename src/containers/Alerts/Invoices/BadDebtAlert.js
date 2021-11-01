import React from 'react';
import { FormattedMessage as T } from 'components';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { useCancelBadDebt } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * bad debt alert.
 */
function BadDebtAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { invoiceId },

  // #withAlertActions
  closeAlert,
}) {
  // handle cancel alert.
  const handleCancel = () => {
    closeAlert(name);
  };

  const { mutateAsync: cancelBadDebtMutate, isLoading } = useCancelBadDebt();

  // handleConfirm alert.
  const handleConfirm = () => {
    cancelBadDebtMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_invoice_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'badDebt.label_cancel_bad_debt'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_cancel_this_invoice'} />
      </p>
    </Alert>
  );
}

export default compose(withAlertStoreConnect(), withAlertActions)(BadDebtAlert);
