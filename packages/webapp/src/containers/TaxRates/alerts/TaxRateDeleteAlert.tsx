// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useDeleteTaxRate } from '@/hooks/query/taxRates';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Item delete alerts.
 */
function TaxRateDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { taxRateId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteTaxRate, isLoading } = useDeleteTaxRate();

  // Handle cancel delete item alert.
  const handleCancelItemDelete = () => {
    closeAlert(name);
  };
  // Handle confirm delete item.
  const handleConfirmDeleteItem = () => {
    deleteTaxRate(taxRateId)
      .then(() => {
        AppToaster.show({
          message: 'The tax rate has been deleted successfully.',
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.TAX_RATE_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          AppToaster.show({
            message: 'Something went wrong.',
            intent: Intent.DANGER,
          });
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelItemDelete}
      onConfirm={handleConfirmDeleteItem}
      loading={isLoading}
    >
      <p>
        Once you delete this tax rate, you won't be able to restore the item
        later.
      </p>

      <p>
        Are you sure you want to delete ? If you're not sure, you can inactivate
        it instead.
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(TaxRateDeleteAlert);
