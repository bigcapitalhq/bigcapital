// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useActivateItem } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 *  Item activate alert.
 */
function ItemActivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { itemId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: activateItem, isLoading } = useActivateItem();

  // Handle activate item alert cancel.
  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  // Handle confirm item activated.
  const handleConfirmItemActivate = () => {
    activateItem(itemId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_has_been_activated_successfully'),
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
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isLoading}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        <T id={'are_sure_to_activate_this_item'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemActivateAlert);
