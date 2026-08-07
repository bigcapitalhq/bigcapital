import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useInactivateItem } from '@/hooks/query';
import { compose } from '@/utils';

interface ItemInactivateAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { itemId: number };
}

function ItemInactivateAlertInner({
  name,
  isOpen,
  payload: { itemId },
  closeAlert,
}: ItemInactivateAlertProps): React.ReactElement {
  const { mutateAsync: inactivateItem, isPending } = useInactivateItem();

  const handleCancelInactivateItem = () => {
    closeAlert(name);
  };

  const handleConfirmItemInactive = () => {
    inactivateItem(itemId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_item_has_been_inactivated_successfully'),
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
      confirmButtonText={intl.get('inactivate')}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateItem}
      onConfirm={handleConfirmItemInactive}
      loading={isPending}
    >
      <p>
        <T id={'are_sure_to_inactive_this_item'} />
      </p>
    </Alert>
  );
}

export const ItemInactivateAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(ItemInactivateAlertInner);
