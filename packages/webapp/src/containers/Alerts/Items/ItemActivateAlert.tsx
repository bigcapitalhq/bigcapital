import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useActivateItem } from '@/hooks/query';
import { compose } from '@/utils';

interface ItemActivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { itemId: number };
}

function ItemActivateAlertInner({
  name,
  isOpen,
  payload: { itemId },
  closeAlert,
}: ItemActivateAlertProps): React.ReactElement {
  const { mutateAsync: activateItem, isPending } = useActivateItem();

  const handleCancelActivateItem = () => {
    closeAlert(name);
  };

  const handleConfirmItemActivate = () => {
    activateItem(itemId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_has_been_activated_successfully'),
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
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('activate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateItem}
      loading={isPending}
      onConfirm={handleConfirmItemActivate}
    >
      <p>
        <T id={'are_sure_to_activate_this_item'} />
      </p>
    </Alert>
  );
}

export const ItemActivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemActivateAlertInner);
