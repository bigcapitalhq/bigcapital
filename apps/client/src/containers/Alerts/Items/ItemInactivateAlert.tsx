// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useInactivateItem } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Item inactivate alert.
 */
function ItemInactivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: inactivateItem, isLoading } = useInactivateItem();

  // Handle cancel inactivate alert.
  const handleCancelInactivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item Inactive.
  const handleConfirmItemInactive = () => {
    inactivateItem(itemId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_has_been_inactivated_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateItem}
      onConfirm={handleConfirmItemInactive}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_inactive_this_item'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemInactivateAlert);
